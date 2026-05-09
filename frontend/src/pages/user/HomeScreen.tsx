import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SectionTitle from "@/src/components/user/SectionTitle";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { achievementCards, leaderboardEntries, userProfile } from "@/src/pages/user/mock-data";
import { assignRecommendedPath, getLearningPaths, getUserRoadmap } from "@/src/services/user.service";
import { LearningPath, UserRoadmap } from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

function formatName(fullName?: string | null) {
  if (!fullName?.trim()) return "bạn";
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1];
}

function getRecommendationLabel(path: LearningPath, targetScore: number) {
  const gap = Math.abs(path.targetScore - targetScore);

  if (gap === 0) return "Đề xuất";
  if (gap <= 100) return "Gần mục tiêu";
  if (path.targetScore < targetScore) return "Cần tăng tốc";
  return "Vượt mục tiêu";
}

export default function HomeScreen() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assigningPath, setAssigningPath] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  const fullName = auth.user?.fullName ?? userProfile.fullName;
  const targetScore = auth.user?.targetScore ?? userProfile.targetScore;
  const greetingName = formatName(fullName);

  useEffect(() => {
    if (!auth.accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    Promise.all([getLearningPaths(auth.accessToken), getUserRoadmap(auth.accessToken)])
      .then(([pathsResponse, roadmapResponse]) => {
        const nextPaths = pathsResponse.data ?? [];
        const nextRoadmap = roadmapResponse.data ?? null;

        setLearningPaths(nextPaths);
        setRoadmap(nextRoadmap);

        if (nextRoadmap?.learningPathId) {
          setSelectedPathId(nextRoadmap.learningPathId);
          return;
        }

        const nearestPath = [...nextPaths]
          .filter((path) => path.active)
          .sort((a, b) => Math.abs(a.targetScore - targetScore) - Math.abs(b.targetScore - targetScore))[0];

        setSelectedPathId(nearestPath?.id ?? null);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu trang chủ.");
      })
      .finally(() => setLoading(false));
  }, [auth.accessToken, targetScore]);

  const selectedPath = useMemo(
    () => learningPaths.find((item) => item.id === selectedPathId) ?? null,
    [learningPaths, selectedPathId],
  );

  const recommendedPathId = useMemo(() => {
    return [...learningPaths]
      .filter((path) => path.active)
      .sort((a, b) => Math.abs(a.targetScore - targetScore) - Math.abs(b.targetScore - targetScore))[0]?.id;
  }, [learningPaths, targetScore]);

  const roadmapModules = roadmap?.milestones.flatMap((milestone) => milestone.modules) ?? [];
  const latestModule =
    roadmapModules.find((module) => module.moduleId === roadmap?.currentModuleId) ??
    roadmapModules.find((module) => module.progressStatus === "IN_PROGRESS") ??
    roadmapModules[0] ??
    null;
  const vocabularyLearned = roadmapModules.reduce((sum, module) => sum + module.flashcardCount, 0) || 128;

  const handleChoosePath = async () => {
    if (!auth.accessToken || !selectedPath) return;

    try {
      setAssigningPath(true);
      await assignRecommendedPath(auth.accessToken, selectedPath.targetScore);
      Alert.alert("Lộ trình", `Đã chọn ${selectedPath.title}.`);
      pushRoute("/user/practice");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể chọn lộ trình.";
      Alert.alert("Lỗi", message);
    } finally {
      setAssigningPath(false);
    }
  };

  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label={greetingName.charAt(0).toUpperCase()} />}
        subtitle="Tổng quan học tập"
        title="TOEIC Trainer"
      />

      <SurfaceCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Xin chào {greetingName}</Text>
            <Text style={styles.heroTitle}>Hôm nay tiếp tục lộ trình nào?</Text>
            <Text style={styles.heroSubtitle}>
              Trang chủ hiển thị tổng quan học tập và đề xuất lộ trình phù hợp với mục tiêu {targetScore}+
              TOEIC bạn đã đăng ký.
            </Text>
          </View>
          <View style={styles.targetBadge}>
            <Text style={styles.targetBadgeValue}>{targetScore}+</Text>
            <Text style={styles.targetBadgeLabel}>Mục tiêu</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{vocabularyLearned}</Text>
            <Text style={styles.statLabel}>Từ vựng đã học</Text>
          </View>
          <View style={styles.statCard}>
            <Text numberOfLines={1} style={styles.statValueCompact}>
              {latestModule?.title ?? "Chưa có"}
            </Text>
            <Text style={styles.statLabel}>Module gần nhất</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile.streakDays} ngày</Text>
            <Text style={styles.statLabel}>Chuỗi học</Text>
          </View>
        </View>

        <ProgressBar
          accentColor={colors.accent}
          label="Tiến độ lộ trình hiện tại"
          rightLabel={`${Math.round(roadmap?.progressPercent ?? 0)}%`}
          value={roadmap?.progressPercent ?? 0}
        />
      </SurfaceCard>

      <SectionTitle
        actionLabel="Mở practice"
        onActionPress={() => pushRoute("/user/practice")}
        title="Danh sách lộ trình học"
      />

      {loading ? (
        <View style={styles.feedbackRow}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.feedbackText}>Đang tải lộ trình từ backend...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {!loading ? (
        <View style={styles.pathList}>
          {learningPaths.map((path) => {
            const isSelected = selectedPathId === path.id;
            const isRecommended = recommendedPathId === path.id;
            const isCurrent = roadmap?.learningPathId === path.id;

            return (
              <Pressable
                key={path.id}
                onPress={() => path.active && setSelectedPathId(path.id)}
                style={[
                  styles.pathCard,
                  isSelected ? styles.pathCardSelected : null,
                  !path.active ? styles.pathCardDisabled : null,
                ]}
              >
                <View style={styles.pathTagRow}>
                  <Text style={styles.pathCode}>{path.code}</Text>
                  {isRecommended ? <Text style={styles.recommendTag}>Đề xuất</Text> : null}
                  {isCurrent ? <Text style={styles.currentTag}>Đang học</Text> : null}
                </View>
                <Text style={styles.pathTitle}>{path.title}</Text>
                <Text style={styles.pathDescription}>{path.description}</Text>
                <View style={styles.pathFooter}>
                  <Text style={styles.pathScore}>{path.targetScore}+ TOEIC</Text>
                  <Text style={styles.pathHint}>{getRecommendationLabel(path, targetScore)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <Pressable
        disabled={!selectedPath || assigningPath}
        onPress={handleChoosePath}
        style={[styles.primaryButton, !selectedPath || assigningPath ? styles.primaryButtonDisabled : null]}
      >
        <Text style={styles.primaryButtonText}>
          {assigningPath ? "Đang cập nhật lộ trình..." : selectedPath ? `Chọn ${selectedPath.title}` : "Chọn một lộ trình"}
        </Text>
      </Pressable>

      <View style={styles.featureGrid}>
        <SurfaceCard style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <View style={[styles.featureIcon, { backgroundColor: "#E4F7F1" }]}>
              <Ionicons color={colors.accent} name="book-outline" size={20} />
            </View>
            <Text style={styles.featureTitle}>Ngữ pháp</Text>
          </View>
          <Text style={styles.featureText}>
            Mở thư viện ngữ pháp với hai khu vực Yêu thích và Tất cả, chạm vào title để xem chi tiết và lưu nhanh.
          </Text>
          <Pressable onPress={() => pushRoute("/user/grammar")} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Mở ngữ pháp</Text>
          </Pressable>
        </SurfaceCard>

        <SurfaceCard style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <View style={[styles.featureIcon, { backgroundColor: "#FFF1DE" }]}>
              <Ionicons color="#C47716" name="trophy-outline" size={20} />
            </View>
            <Text style={styles.featureTitle}>Bảng xếp hạng</Text>
          </View>

          <View style={styles.podiumRow}>
            {[leaderboardEntries[1], leaderboardEntries[0], leaderboardEntries[2]].map((entry, index) => {
              if (!entry) return null;
              const isChampion = index === 1;

              return (
                <View key={entry.id} style={[styles.podiumItem, isChampion ? styles.podiumItemCenter : null]}>
                  <View style={[styles.avatarCircle, isChampion ? styles.avatarCircleChampion : null]}>
                    {isChampion ? (
                      <Ionicons color="#F5B942" name="crown" size={22} style={styles.crownIcon} />
                    ) : null}
                    <Text style={styles.avatarInitial}>{entry.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text numberOfLines={2} style={styles.podiumName}>
                    {entry.name}
                  </Text>
                  <View style={[styles.scorePill, isChampion ? styles.scorePillChampion : null]}>
                    <Text style={styles.scorePillText}>{entry.points}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {leaderboardEntries.slice(3).map((entry) => (
            <View key={entry.id} style={styles.rankRow}>
              <Text style={styles.rankIndex}>{entry.rank}</Text>
              <View style={styles.rankAvatar}>
                <Text style={styles.rankAvatarText}>{entry.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{entry.name}</Text>
                <Text style={styles.rankMeta}>Điểm xếp hạng: {entry.points}</Text>
              </View>
              <Text style={styles.rankDelta}>+{entry.streak}</Text>
            </View>
          ))}
        </SurfaceCard>
      </View>

      <SectionTitle title="Thành tích nổi bật" />
      <View style={styles.achievementGrid}>
        {achievementCards.map((item) => (
          <SurfaceCard key={item.title} style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: item.tint }]}>
              <Ionicons
                color={item.locked ? colors.textMuted : colors.primaryDark}
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={22}
              />
            </View>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementSubtitle}>{item.subtitle}</Text>
          </SurfaceCard>
        ))}
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    minHeight: 168,
    padding: spacing.md,
    width: "48.2%",
  },
  achievementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  achievementIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 48,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 48,
  },
  achievementSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  achievementTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: "#47C4B4",
    borderColor: "rgba(255,255,255,0.92)",
    borderRadius: radius.pill,
    borderWidth: 4,
    height: 74,
    justifyContent: "center",
    position: "relative",
    width: 74,
  },
  avatarCircleChampion: {
    backgroundColor: "#F7BC4A",
    height: 90,
    width: 90,
  },
  avatarInitial: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "900",
  },
  crownIcon: {
    position: "absolute",
    top: -18,
  },
  currentTag: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    color: colors.surface,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  errorText: {
    backgroundColor: "rgba(249,112,102,0.1)",
    borderColor: "rgba(249,112,102,0.24)",
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.danger,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  featureCard: {
    flex: 1,
    minWidth: 0,
  },
  featureGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  featureIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  featureText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 110,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  feedbackRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: "#F7FBFF",
    marginBottom: spacing.xl,
  },
  heroCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroEyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  heroSubtitle: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  heroTitle: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  heroTopRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  pathCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  pathCardDisabled: {
    opacity: 0.55,
  },
  pathCardSelected: {
    borderColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
  },
  pathCode: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pathDescription: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  pathFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pathHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  pathList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  pathScore: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
  pathTagRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  pathTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.xs,
  },
  podiumItem: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    marginTop: spacing.md,
  },
  podiumItemCenter: {
    marginTop: 0,
  },
  podiumName: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: spacing.sm,
    minHeight: 36,
    textAlign: "center",
  },
  podiumRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    marginBottom: spacing.xl,
    paddingVertical: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.surfaceDisabled,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  rankAvatar: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  rankAvatarText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
  },
  rankDelta: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "900",
  },
  rankIndex: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "900",
    width: 18,
  },
  rankInfo: {
    flex: 1,
  },
  rankMeta: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 2,
  },
  rankName: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
  },
  rankRow: {
    alignItems: "center",
    backgroundColor: "#F8FAFD",
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  recommendTag: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scorePill: {
    backgroundColor: "#47C4B4",
    borderRadius: radius.pill,
    marginTop: spacing.sm,
    minWidth: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  scorePillChampion: {
    backgroundColor: "#F7BC4A",
  },
  scorePillText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  secondaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: radius.lg,
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  statValue: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
  },
  statValueCompact: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  targetBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    minWidth: 88,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  targetBadgeLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  targetBadgeValue: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
  },
});
