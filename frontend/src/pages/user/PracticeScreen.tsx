import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { getUserRoadmap } from "@/src/services/user.service";
import { UserRoadmap, UserRoadmapModuleItem } from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

type ModuleNode = {
  isCompleted: boolean;
  isCurrent: boolean;
  module: UserRoadmapModuleItem;
};

export default function PracticeScreen() {
  const { auth, isHydrated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);

  const loadRoadmap = useCallback(async () => {
    if (!auth.accessToken) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      const payload = await getUserRoadmap(auth.accessToken);
      setRoadmap(payload.data ?? null);
    } catch (error) {
      setRoadmap(null);
      setErrorMessage(error instanceof Error ? error.message : "Khong the tai roadmap practice.");
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken]);

  useEffect(() => {
    if (!isHydrated || !auth.accessToken) return;
    loadRoadmap();
  }, [auth.accessToken, isHydrated, loadRoadmap]);

  useFocusEffect(
    useCallback(() => {
      if (!isHydrated || !auth.accessToken) return;
      loadRoadmap();
    }, [auth.accessToken, isHydrated, loadRoadmap]),
  );

  const moduleNodes = useMemo<ModuleNode[]>(() => {
    if (!roadmap) return [];

    return roadmap.milestones
      .flatMap((milestone) =>
        milestone.modules.map((module) => ({
          milestoneTitle: milestone.title,
          module,
        })),
      )
      .sort((a, b) => a.module.sortOrder - b.module.sortOrder)
      .map(({ milestoneTitle, module }) => ({
        isCompleted: module.progressStatus === "COMPLETED",
        isCurrent:
          module.moduleId === roadmap.currentModuleId ||
          module.progressStatus === "IN_PROGRESS",
        module: {
          ...module,
          description: module.description ?? `Milestone: ${milestoneTitle}`,
        },
      }));
  }, [roadmap]);

  const currentModule =
    moduleNodes.find((item) => item.isCurrent)?.module ??
    moduleNodes[0]?.module ??
    null;
  const completionRatio = `${moduleNodes.filter((item) => item.isCompleted).length}/${moduleNodes.length || 0}`;
  const activeMilestone = roadmap?.milestones.find((milestone) =>
    milestone.modules.some((module) => module.moduleId === currentModule?.moduleId),
  );

  const openModule = (moduleId: number) => {
    pushRoute(`/user/roadmap?moduleId=${moduleId}`);
  };

  const openCurrentPractice = () => {
    if (!currentModule) return;
    pushRoute(`/user/roadmap?moduleId=${currentModule.moduleId}&focus=practice`);
  };

  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label={(auth.user?.fullName ?? "A").charAt(0).toUpperCase()} />}
        subtitle="Roadmap lo trinh"
        title="TOEIC Trainer"
      />

      <SurfaceCard style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>LO TRINH DANG CHON</Text>
        <Text style={styles.title}>{roadmap?.learningPathTitle ?? "Chua chon lo trinh hoc"}</Text>
        <Text style={styles.subtitle}>
          Practice se luon dong bo roadmap ACTIVE moi nhat tu backend moi khi ban mo lai man hinh nay.
        </Text>

        <View style={styles.currentPathBlock}>
          <Text style={styles.currentPathLabel}>
            {roadmap?.learningPathCode ?? "ROADMAP"}
          </Text>
          <Text style={styles.currentPathTitle}>
            {currentModule?.title ?? "Chua co module hien tai"}
          </Text>
          <Text style={styles.currentPathMeta}>
            {activeMilestone?.title ?? "Chua co milestone"} • {currentModule?.moduleType ?? "MODULE"}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{roadmap?.targetScore ?? auth.user?.targetScore ?? "--"}+</Text>
            <Text style={styles.summaryLabel}>Muc tieu</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{completionRatio}</Text>
            <Text style={styles.summaryLabel}>Module xong</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text numberOfLines={1} style={styles.summaryValueCompact}>
              {roadmap?.status ?? "PENDING"}
            </Text>
            <Text style={styles.summaryLabel}>Trang thai</Text>
          </View>
        </View>

        <ProgressBar
          accentColor={colors.accent}
          label="Tien do toan lo trinh"
          rightLabel={`${Math.round(roadmap?.progressPercent ?? 0)}%`}
          value={roadmap?.progressPercent ?? 0}
        />
      </SurfaceCard>

      <Pressable
        disabled={!currentModule}
        onPress={openCurrentPractice}
        style={[styles.primaryButton, !currentModule ? styles.primaryButtonDisabled : null]}
      >
        <Ionicons color={colors.surface} name="play-circle-outline" size={18} />
        <Text style={styles.primaryButtonText}>Tiep tuc module hien tai</Text>
      </Pressable>

      {loading ? (
        <View style={styles.feedbackRow}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.feedbackText}>Dang dong bo roadmap tu backend...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {!loading && !errorMessage && moduleNodes.length === 0 ? (
        <SurfaceCard>
          <Text style={styles.emptyText}>Chua co module nao trong lo trinh hien tai.</Text>
        </SurfaceCard>
      ) : null}

      <View style={styles.treeWrap}>
        <View style={styles.centerLine} />
        {moduleNodes.map((item, index) => {
          const alignRight = index % 2 === 1;
          const isCurrent = item.isCurrent;
          const isDone = item.isCompleted;

          return (
            <View
              key={item.module.moduleId}
              style={[
                styles.branchRow,
                alignRight ? styles.branchRowRight : styles.branchRowLeft,
              ]}
            >
              <View
                style={[
                  styles.connector,
                  alignRight ? styles.connectorRight : styles.connectorLeft,
                ]}
              />

              <View
                style={[
                  styles.nodeWrap,
                  alignRight ? styles.nodeWrapRight : styles.nodeWrapLeft,
                ]}
              >
                <View
                  style={[
                    styles.nodeBadge,
                    isDone ? styles.nodeBadgeDone : null,
                    isCurrent ? styles.nodeBadgeCurrent : null,
                  ]}
                >
                  <Ionicons
                    color={isDone || isCurrent ? colors.surface : colors.primaryDark}
                    name={isDone ? "checkmark-outline" : isCurrent ? "flash-outline" : "book-outline"}
                    size={18}
                  />
                </View>

                <Pressable onPress={() => openModule(item.module.moduleId)} style={styles.roadmapCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.moduleStep}>Module {index + 1}</Text>
                    {isCurrent ? <Text style={styles.currentTag}>Dang hoc</Text> : null}
                    {isDone ? <Text style={styles.doneTag}>Hoan thanh</Text> : null}
                  </View>
                  <Text style={styles.moduleTitle}>{item.module.title}</Text>
                  <Text style={styles.moduleDescription}>
                    {item.module.description ?? "Noi dung module roadmap."}
                  </Text>
                  <View style={styles.moduleMetaRow}>
                    <Text style={styles.moduleMeta}>{item.module.videoLessonCount} video</Text>
                    <Text style={styles.moduleMeta}>{item.module.flashcardCount} vocab</Text>
                    <Text style={styles.moduleMeta}>{item.module.practiceSetCount} practice</Text>
                  </View>
                  <ProgressBar
                    accentColor={isDone ? colors.success : colors.primary}
                    rightLabel={`${Math.round(item.module.progressPercent)}%`}
                    value={item.module.progressPercent}
                  />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  branchRow: {
    marginBottom: spacing.xl,
    minHeight: 170,
    position: "relative",
    width: "100%",
  },
  branchRowLeft: {
    alignItems: "flex-start",
  },
  branchRowRight: {
    alignItems: "flex-end",
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  centerLine: {
    backgroundColor: colors.borderStrong,
    bottom: 0,
    left: "50%",
    marginLeft: -1,
    position: "absolute",
    top: 0,
    width: 2,
  },
  connector: {
    borderColor: colors.borderStrong,
    borderTopWidth: 2,
    height: 72,
    position: "absolute",
    top: 22,
    width: 52,
  },
  connectorLeft: {
    borderLeftWidth: 2,
    borderTopLeftRadius: 28,
    left: "50%",
  },
  connectorRight: {
    borderRightWidth: 2,
    borderTopRightRadius: 28,
    right: "50%",
  },
  currentPathBlock: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  currentPathLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  currentPathMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  currentPathTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
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
  doneTag: {
    backgroundColor: "#DCF7E6",
    borderRadius: radius.pill,
    color: colors.success,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
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
    marginBottom: spacing.lg,
  },
  heroEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  moduleDescription: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  moduleMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  moduleMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  moduleStep: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  moduleTitle: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: spacing.xs,
  },
  nodeBadge: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    left: -19,
    position: "absolute",
    top: 24,
    width: 38,
    zIndex: 2,
  },
  nodeBadgeCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nodeBadgeDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  nodeWrap: {
    position: "relative",
    width: "44%",
  },
  nodeWrapLeft: {
    marginRight: "56%",
  },
  nodeWrapRight: {
    marginLeft: "56%",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginBottom: spacing.lg,
    paddingVertical: 15,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.surfaceDisabled,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  roadmapCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 148,
    padding: spacing.lg,
  },
  subtitle: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  summaryValue: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
  },
  summaryValueCompact: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
  },
  title: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  treeWrap: {
    paddingBottom: spacing.xl,
    position: "relative",
  },
});
