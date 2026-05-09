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
import { vocabProgressStore } from "@/src/store/progress-store";
import { UserModuleContent, UserRoadmapModuleItem } from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

export default function RoadmapScreen() {
  const { auth, isHydrated } = useAuth();
  const params = useLocalSearchParams<{ moduleId?: string; vocabDone?: string; focus?: string }>();

  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [moduleInfo, setModuleInfo] = useState<UserRoadmapModuleItem | null>(null);
  const [moduleContent, setModuleContent] = useState<UserModuleContent | null>(null);
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

      const fallbackModuleId = roadmap?.currentModuleId ?? roadmapModules[0]?.moduleId ?? selectedModuleId;
      const resolvedModuleId = selectedModuleId ?? fallbackModuleId;

      if (!resolvedModuleId) {
        setModuleInfo(null);
        setModuleContent(null);
        setErrorMessage("Khong tim thay module trong roadmap cua ban.");
        return;
      }

      setModuleInfo(roadmapModules.find((module) => module.moduleId === resolvedModuleId) ?? null);

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
  const vocabStepDone =
    (typeof activeModuleId === "number" && vocabProgressStore.isCompleted(activeModuleId)) ||
    params.vocabDone === "true";
  const canOpenVocab = allVideosCompleted;
  const canOpenPractice = allVideosCompleted && vocabStepDone;
  const canCompleteModule = allVideosCompleted && vocabStepDone && practiceStepDone;
  const shouldHighlightPractice = params.focus === "practice" && canOpenPractice;

  useEffect(() => {
    setPracticeStepDone(false);
  }, [activeModuleId]);

  useEffect(() => {
    if (params.vocabDone === "true" && typeof activeModuleId === "number") {
      vocabProgressStore.markCompleted(activeModuleId);
    }
  }, [activeModuleId, params.vocabDone]);

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
        pushRoute(`/user/path-complete?moduleId=${activeModuleId}`);
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
        rightSlot={<Ionicons color={colors.primaryDark} name="map-outline" size={32} />}
        subtitle={moduleContent?.moduleType ?? moduleInfo?.moduleType ?? "ROADMAP MODULE"}
        title={moduleContent?.title ?? moduleInfo?.title ?? "Module detail"}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Dang tai noi dung module...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {shouldHighlightPractice ? (
        <SurfaceCard style={styles.successCard}>
          <View style={styles.successRow}>
            <View style={styles.successIcon}>
              <Ionicons color={colors.surface} name="checkmark" size={18} />
            </View>
            <View style={styles.successBody}>
              <Text style={styles.successTitle}>Da san sang cho practice</Text>
              <Text style={styles.successText}>Ban da xong video va tu vung, co the vao luyen de ngay.</Text>
            </View>
          </View>
        </SurfaceCard>
      ) : null}

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
        <Text style={styles.listTitle}>Lo trinh hoan thanh</Text>
        <View style={styles.flowBlock}>
          <View style={styles.flowRow}>
            <View style={[styles.flowBadge, allVideosCompleted ? styles.flowBadgeDone : null]}>
              <Text style={styles.flowBadgeText}>1</Text>
            </View>
            <View style={styles.flowBody}>
              <Text style={styles.flowTitle}>Hoc video</Text>
              <Text style={styles.flowSub}>{completedVideoLessons}/{totalVideoLessons} bai da hoan thanh</Text>
            </View>
          </View>
          <View style={styles.flowRow}>
            <View style={[styles.flowBadge, vocabStepDone ? styles.flowBadgeDone : null]}>
              <Text style={styles.flowBadgeText}>2</Text>
            </View>
            <View style={styles.flowBody}>
              <Text style={styles.flowTitle}>Luyen tu vung</Text>
              <Text style={styles.flowSub}>Mo sau khi xong video trong module</Text>
            </View>
          </View>
          <View style={styles.flowRow}>
            <View style={[styles.flowBadge, practiceStepDone ? styles.flowBadgeDone : null]}>
              <Text style={styles.flowBadgeText}>3</Text>
            </View>
            <View style={styles.flowBody}>
              <Text style={styles.flowTitle}>Luyen practice</Text>
              <Text style={styles.flowSub}>Mo khi buoc 1 va 2 da xong</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionCol}>
          <Pressable
            onPress={() => {
              if (activeModuleId) pushRoute(`/user/lesson?moduleId=${activeModuleId}`);
            }}
            style={styles.actionButtonPrimary}
          >
            <Text style={styles.actionButtonPrimaryText}>Buoc 1: Hoc video</Text>
          </Pressable>

          <Pressable
            disabled={!activeModuleId || !canOpenVocab}
            onPress={() => {
              if (activeModuleId) {
                pushRoute(`/user/cards?moduleId=${activeModuleId}`);
              }
            }}
            style={[
              vocabStepDone ? styles.actionButtonDone : styles.actionButtonSoft,
              !canOpenVocab ? styles.actionButtonDisabled : null,
            ]}
          >
            <Text style={vocabStepDone ? styles.actionButtonPrimaryText : styles.actionButtonSoftText}>
              Buoc 2: Luyen tu vung
            </Text>
          </Pressable>

          <Pressable
            disabled={!activeModuleId || !canOpenPractice}
            onPress={() => {
              if (activeModuleId) {
                setPracticeStepDone(true);
                pushRoute(`/user/practice-module?moduleId=${activeModuleId}`);
              }
            }}
            style={[
              shouldHighlightPractice ? styles.actionButtonPrimary : styles.actionButtonSoft,
              !canOpenPractice ? styles.actionButtonDisabled : null,
            ]}
          >
            <Text style={shouldHighlightPractice ? styles.actionButtonPrimaryText : styles.actionButtonSoftText}>
              Buoc 3: Luyen practice
            </Text>
          </Pressable>

          <Pressable
            disabled={!activeModuleId || unlocking || !canCompleteModule}
            onPress={handleCompleteModule}
            style={[styles.actionButtonDone, unlocking || !canCompleteModule ? styles.actionButtonDisabled : null]}
          >
            <Text style={styles.actionButtonPrimaryText}>
              {unlocking ? "Dang cap nhat..." : "Buoc 4: Hoan thanh module"}
            </Text>
          </Pressable>
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.listCard}>
        <Text style={styles.listTitle}>Noi dung co san</Text>
        {(moduleContent?.videoLessons ?? []).slice(0, 3).map((lesson) => (
          <View key={lesson.lessonId} style={styles.listRow}>
            <Ionicons color={colors.primaryDark} name="play-circle-outline" size={18} />
            <View style={styles.listBody}>
              <Text style={styles.listMain}>{lesson.lessonTitle}</Text>
              <Text style={styles.listSub}>{lesson.durationSeconds}s - {lesson.progressStatus}</Text>
            </View>
          </View>
        ))}
        {(moduleContent?.flashcards ?? []).slice(0, 2).map((card) => (
          <View key={card.id} style={styles.listRow}>
            <Ionicons color={colors.primaryDark} name="book-outline" size={18} />
            <View style={styles.listBody}>
              <Text style={styles.listMain}>{card.englishWord}</Text>
              <Text style={styles.listSub}>{card.meaningVi}</Text>
            </View>
          </View>
        ))}
        {(moduleContent?.practiceSets ?? []).slice(0, 2).map((set) => (
          <Pressable
            key={set.id}
            disabled={!canOpenPractice}
            onPress={() => {
              setPracticeStepDone(true);
              pushRoute(`/user/practice-module?moduleId=${activeModuleId}`);
            }}
            style={[styles.listRow, !canOpenPractice ? styles.disabledRow : null]}
          >
            <Ionicons color={colors.primaryDark} name="document-text-outline" size={18} />
            <View style={styles.listBody}>
              <Text style={styles.listMain}>{set.title}</Text>
              <Text style={styles.listSub}>{set.durationMinutes ?? "--"} phut - Part {set.partNo ?? "--"}</Text>
            </View>
            <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
          </Pressable>
        ))}
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonDone: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    paddingVertical: 14,
  },
  actionButtonPrimary: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    paddingVertical: 14,
  },
  actionButtonPrimaryText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  actionButtonSoft: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 14,
  },
  actionButtonSoftText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
  actionCol: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  disabledRow: {
    opacity: 0.55,
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
  flowBadge: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  flowBadgeDone: {
    backgroundColor: colors.success,
  },
  flowBadgeText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  flowBlock: {
    gap: spacing.md,
  },
  flowBody: {
    flex: 1,
  },
  flowRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  flowSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  flowTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
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
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md,
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
  successBody: {
    flex: 1,
  },
  successCard: {
    backgroundColor: "#E8F8EE",
    borderColor: "#BDE2C7",
    marginBottom: spacing.lg,
  },
  successIcon: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  successRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  successText: {
    color: "#31543B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
  },
  successTitle: {
    color: "#113A1A",
    fontSize: 15,
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
