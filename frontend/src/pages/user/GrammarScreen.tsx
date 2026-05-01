import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { getUserModuleContent, getUserRoadmap } from "@/src/services/user.service";
import { UserModuleContent, UserRoadmapModuleItem } from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

export default function GrammarScreen() {
  const { auth, isHydrated } = useAuth();
  const params = useLocalSearchParams<{ moduleId?: string }>();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [moduleInfo, setModuleInfo] = useState<UserRoadmapModuleItem | null>(null);
  const [moduleContent, setModuleContent] = useState<UserModuleContent | null>(null);

  const selectedModuleId = useMemo(() => {
    if (!params.moduleId) return undefined;
    const parsed = Number(params.moduleId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [params.moduleId]);

  const loadModule = useCallback(async () => {
    if (!auth.accessToken) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      const roadmapPayload = await getUserRoadmap(auth.accessToken);
      const roadmap = roadmapPayload.data;
      const roadmapModules = (roadmap?.milestones ?? [])
        .flatMap((milestone) => milestone.modules)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const fallbackModuleId =
        roadmap?.currentModuleId ?? roadmapModules[0]?.moduleId ?? selectedModuleId;
      const resolvedModuleId = selectedModuleId ?? fallbackModuleId;

      if (!resolvedModuleId) {
        setModuleInfo(null);
        setModuleContent(null);
        setErrorMessage("Ban chua duoc gan module nao trong lo trinh.");
        return;
      }

      const matchedModule = roadmapModules.find((module) => module.moduleId === resolvedModuleId);
      setModuleInfo(matchedModule ?? null);

      const modulePayload = await getUserModuleContent(auth.accessToken, resolvedModuleId);
      setModuleContent(modulePayload.data ?? null);
    } catch (error) {
      setModuleInfo(null);
      setModuleContent(null);
      setErrorMessage(error instanceof Error ? error.message : "Khong the tai du lieu module.");
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken, selectedModuleId]);

  useEffect(() => {
    if (!isHydrated || !auth.accessToken) return;
    loadModule();
  }, [auth.accessToken, isHydrated, loadModule]);

  const activeModuleId = moduleContent?.moduleId ?? moduleInfo?.moduleId;

  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<Ionicons color={colors.primaryDark} name="person-circle" size={42} />}
        title="Academic Concierge"
      />

      <Text style={styles.levelLabel}>
        CURRENT FOCUS • {moduleContent?.moduleType ?? moduleInfo?.moduleType ?? "MODULE"}
      </Text>
      <Text style={styles.title}>{moduleContent?.title ?? moduleInfo?.title ?? "Learning module"}</Text>
      <Text style={styles.subtitle}>
        {moduleContent?.description ?? moduleInfo?.description ?? "Chon module de hoc video, vocab va practice theo lo trinh admin da tao."}
      </Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Dang tai noi dung module...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <SurfaceCard style={styles.heroCard}>
        <Text style={styles.heroCardTitle}>Module progress</Text>
        <ProgressBar
          accentColor={colors.primary}
          rightLabel={`${Math.round(moduleInfo?.progressPercent ?? 0)}%`}
          value={moduleInfo?.progressPercent ?? 0}
        />
        <View style={styles.unitList}>
          <View style={styles.unitRow}>
            <View style={[styles.unitDot, styles.unitDotCurrent]}>
              <Ionicons color={colors.surface} name="play" size={14} />
            </View>
            <Text style={styles.unitLabel}>
              {moduleContent?.videoLessons?.length ?? 0} video lessons
            </Text>
          </View>
          <View style={styles.unitRow}>
            <View style={[styles.unitDot, styles.unitDotDone]}>
              <Ionicons color={colors.surface} name="book-outline" size={14} />
            </View>
            <Text style={styles.unitLabel}>
              {moduleContent?.flashcards?.length ?? 0} vocabulary cards
            </Text>
          </View>
          <View style={styles.unitRow}>
            <View style={styles.unitDot}>
              <Ionicons color={colors.surface} name="document-text-outline" size={14} />
            </View>
            <Text style={styles.unitLabel}>
              {moduleContent?.practiceSets?.length ?? 0} practice sets
            </Text>
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={styles.actionIcon}>
            <Ionicons color={colors.primaryDark} name="map-outline" size={22} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Roadmap & detail</Text>
            <Text style={styles.actionDesc}>
              Xem thong tin tong hop cua module: video, tu vung va bo bai tap.
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            if (activeModuleId) {
              pushRoute(`/user/roadmap?moduleId=${activeModuleId}`);
            }
          }}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Mo chi tiet module</Text>
        </Pressable>
      </SurfaceCard>

      <SurfaceCard style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={[styles.actionIcon, { backgroundColor: "#DBF0FF" }]}>
            <Ionicons color={colors.primaryDark} name="play-circle-outline" size={22} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Hoc va luyen tap</Text>
            <Text style={styles.actionDesc}>
              Di truc tiep vao danh sach video, vocabulary cards va ghi chu ca nhan.
            </Text>
          </View>
        </View>
        <View style={styles.dualActions}>
          <Pressable
            onPress={() => {
              if (activeModuleId) {
                pushRoute(`/user/lesson?moduleId=${activeModuleId}`);
              }
            }}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>Video</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (activeModuleId) {
                pushRoute(`/user/cards?moduleId=${activeModuleId}`);
              }
            }}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>Tu vung</Text>
          </Pressable>
          <Pressable onPress={() => pushRoute("/user/notebook")} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Ghi chu</Text>
          </Pressable>
        </View>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  actionBody: {
    flex: 1,
  },
  actionCard: {
    marginBottom: spacing.lg,
  },
  actionDesc: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 4,
  },
  actionIcon: {
    alignItems: "center",
    backgroundColor: "#E8EDFF",
    borderRadius: radius.pill,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  dualActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  errorText: {
    backgroundColor: "rgba(249,112,102,0.1)",
    borderColor: "rgba(249,112,102,0.24)",
    borderRadius: 8,
    borderWidth: 1,
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroCardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md,
    textTransform: "uppercase",
  },
  levelLabel: {
    color: "#1A7C2B",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  loadingWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: "#EFF1FA",
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 16,
  },
  secondaryActionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  unitDot: {
    alignItems: "center",
    backgroundColor: "#4B6FB8",
    borderRadius: radius.pill,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  unitDotCurrent: {
    backgroundColor: colors.primary,
  },
  unitDotDone: {
    backgroundColor: "#24963F",
  },
  unitLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  unitList: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  unitRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
