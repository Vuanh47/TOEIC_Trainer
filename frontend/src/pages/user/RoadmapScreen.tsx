import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import {
  completeOrUnlockNextModule,
  getUserModuleContent,
  getUserRoadmap,
} from "@/src/services/user.service";
import { UserModuleContent, UserRoadmapModuleItem } from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

export default function RoadmapScreen() {
  const { auth, isHydrated } = useAuth();
  const params = useLocalSearchParams<{ moduleId?: string }>();

  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [moduleInfo, setModuleInfo] = useState<UserRoadmapModuleItem | null>(null);
  const [moduleContent, setModuleContent] = useState<UserModuleContent | null>(null);
  const [vocabStepDone, setVocabStepDone] = useState(false);
  const [practiceStepDone, setPracticeStepDone] = useState(false);

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
        setErrorMessage("Khong tim thay module trong lo trinh cua ban.");
        return;
      }

      const matchedModule = roadmapModules.find((module) => module.moduleId === resolvedModuleId);
      setModuleInfo(matchedModule ?? null);

      const modulePayload = await getUserModuleContent(auth.accessToken, resolvedModuleId);
      setModuleContent(modulePayload.data ?? null);
    } catch (error) {
      setModuleInfo(null);
      setModuleContent(null);
      setErrorMessage(error instanceof Error ? error.message : "Khong the tai chi tiet module.");
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken, selectedModuleId]);

  useEffect(() => {
    if (!isHydrated || !auth.accessToken) return;
    loadModule();
  }, [auth.accessToken, isHydrated, loadModule]);

  const activeModuleId = moduleContent?.moduleId ?? moduleInfo?.moduleId;
  const totalVideoLessons = moduleContent?.videoLessons?.length ?? 0;
  const completedVideoLessons =
    moduleContent?.videoLessons?.filter((lesson) => lesson.progressStatus === "COMPLETED").length ?? 0;
  const allVideosCompleted = totalVideoLessons > 0 && completedVideoLessons === totalVideoLessons;
  const canOpenVocab = allVideosCompleted;
  const canOpenPractice = allVideosCompleted && vocabStepDone;
  const canCompleteModule = allVideosCompleted && vocabStepDone && practiceStepDone;

  useEffect(() => {
    setVocabStepDone(false);
    setPracticeStepDone(false);
  }, [activeModuleId]);

  const handleCompleteModule = async () => {
    if (!auth.accessToken || !activeModuleId || unlocking) return;

    try {
      setUnlocking(true);
      const response = await completeOrUnlockNextModule(auth.accessToken, activeModuleId, true);
      await loadModule();

      if (response.data?.nextModuleUnlocked && response.data?.nextModuleId) {
        Alert.alert("Module", "Da mo module tiep theo.");
        pushRoute(`/user/grammar?moduleId=${response.data.nextModuleId}`);
        return;
      }

      if (response.data?.pathCompleted) {
        Alert.alert("Module", "Ban da hoan thanh toan bo learning path hien tai.");
        return;
      }

      Alert.alert("Module", "Da cap nhat trang thai module.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Khong the cap nhat module.";
      Alert.alert("Module", message);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<Ionicons color={colors.primaryDark} name="person-circle" size={42} />}
        subtitle={moduleContent?.moduleType ?? moduleInfo?.moduleType ?? "USER MODULE"}
        title={moduleContent?.title ?? moduleInfo?.title ?? "Module detail"}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Dang tai noi dung module...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <SurfaceCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Tong quan module</Text>
        <Text style={styles.summaryDesc}>
          {moduleContent?.description ?? moduleInfo?.description ?? "Chua co mo ta module."}
        </Text>

        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moduleContent?.videoLessons.length ?? 0}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moduleContent?.flashcards.length ?? 0}</Text>
            <Text style={styles.statLabel}>Vocab</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moduleContent?.practiceSets.length ?? 0}</Text>
            <Text style={styles.statLabel}>Practice</Text>
          </View>
        </View>

        <ProgressBar
          accentColor={colors.primary}
          label="Tien do module"
          rightLabel={`${Math.round(moduleInfo?.progressPercent ?? 0)}%`}
          value={moduleInfo?.progressPercent ?? 0}
        />
      </SurfaceCard>

      <SurfaceCard style={styles.listCard}>
        <Text style={styles.listTitle}>Video lessons</Text>
        {(moduleContent?.videoLessons ?? []).slice(0, 4).map((lesson) => (
          <View key={lesson.lessonId} style={styles.listRow}>
            <Ionicons color={colors.primaryDark} name="play-circle-outline" size={18} />
            <View style={styles.listBody}>
              <Text style={styles.listMain}>{lesson.lessonTitle}</Text>
              <Text style={styles.listSub}>{lesson.durationSeconds}s - {lesson.progressStatus}</Text>
            </View>
          </View>
        ))}
        {(moduleContent?.videoLessons?.length ?? 0) === 0 ? (
          <Text style={styles.emptyText}>Chua co video duoc publish.</Text>
        ) : null}
      </SurfaceCard>

      <SurfaceCard style={styles.listCard}>
        <Text style={styles.listTitle}>Vocabulary from admin</Text>
        {(moduleContent?.flashcards ?? []).slice(0, 4).map((card) => (
          <View key={card.id} style={styles.listRow}>
            <Ionicons color={colors.primaryDark} name="book-outline" size={18} />
            <View style={styles.listBody}>
              <Text style={styles.listMain}>{card.englishWord}</Text>
              <Text style={styles.listSub}>{card.meaningVi}</Text>
            </View>
          </View>
        ))}
        {(moduleContent?.flashcards?.length ?? 0) === 0 ? (
          <Text style={styles.emptyText}>Chua co flashcard trong module.</Text>
        ) : null}
      </SurfaceCard>

      <SurfaceCard style={styles.listCard}>
        <Text style={styles.listTitle}>Practice sets</Text>
        {(moduleContent?.practiceSets ?? []).slice(0, 4).map((set) => (
          <View key={set.id} style={styles.listRow}>
            <Ionicons color={colors.primaryDark} name="document-text-outline" size={18} />
            <View style={styles.listBody}>
              <Text style={styles.listMain}>{set.title}</Text>
              <Text style={styles.listSub}>{set.durationMinutes ?? "--"} phut - Part {set.partNo ?? "--"}</Text>
            </View>
          </View>
        ))}
        {(moduleContent?.practiceSets?.length ?? 0) === 0 ? (
          <Text style={styles.emptyText}>Chua co de luyen tap duoc publish.</Text>
        ) : null}
      </SurfaceCard>

      <SurfaceCard style={styles.listCard}>
        <Text style={styles.listTitle}>Quy trinh hoan thanh module</Text>
        <Text style={styles.flowText}>
          1) Xem video: {completedVideoLessons}/{totalVideoLessons} bai{"\n"}
          2) Luyen tu vung{"\n"}
          3) Luyen de{"\n"}
          4) Hoan thanh module
        </Text>

        <View style={styles.actionCol}>
          <Pressable
            onPress={() => {
              if (activeModuleId) pushRoute(`/user/lesson?moduleId=${activeModuleId}`);
            }}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Buoc 1: Hoc video</Text>
          </Pressable>

          <Pressable
            disabled={!activeModuleId || !canOpenVocab}
            onPress={() => {
              if (activeModuleId) {
                setVocabStepDone(true);
                pushRoute(`/user/cards?moduleId=${activeModuleId}`);
              }
            }}
            style={[styles.actionButtonSoft, !canOpenVocab ? styles.actionButtonDisabled : null]}
          >
            <Text style={styles.actionTextSoft}>Buoc 2: Luyen tu vung</Text>
          </Pressable>

          <Pressable
            disabled={!activeModuleId || !canOpenPractice}
            onPress={() => {
              if (activeModuleId) {
                setPracticeStepDone(true);
                pushRoute(`/user/exam?moduleId=${activeModuleId}`);
              }
            }}
            style={[styles.actionButtonSoft, !canOpenPractice ? styles.actionButtonDisabled : null]}
          >
            <Text style={styles.actionTextSoft}>Buoc 3: Luyen de</Text>
          </Pressable>

          <Pressable
            disabled={!activeModuleId || unlocking || !canCompleteModule}
            onPress={handleCompleteModule}
            style={[
              styles.actionButtonStrong,
              unlocking || !canCompleteModule ? styles.actionButtonDisabled : null,
            ]}
          >
            <Text style={styles.actionText}>
              {unlocking ? "Dang cap nhat..." : "Buoc 4: Hoan thanh module nay"}
            </Text>
          </Pressable>
        </View>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 14,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonSoft: {
    alignItems: "center",
    backgroundColor: "#E9EDFA",
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 14,
  },
  actionButtonStrong: {
    alignItems: "center",
    backgroundColor: "#24963F",
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCol: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  actionTextSoft: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.sm,
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
  listBody: {
    flex: 1,
  },
  listCard: {
    marginBottom: spacing.lg,
  },
  listMain: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  listSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  listTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  flowText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm,
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
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
  },
  statValue: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900",
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryDesc: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  summaryStats: {
    flexDirection: "row",
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  summaryTitle: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: "900",
  },
});
