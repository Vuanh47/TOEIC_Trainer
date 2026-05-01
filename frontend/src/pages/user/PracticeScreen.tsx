import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
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
      setErrorMessage(error instanceof Error ? error.message : "Khong the tai lo trinh hoc.");
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken]);

  useEffect(() => {
    if (!isHydrated || !auth.accessToken) return;
    loadRoadmap();
  }, [auth.accessToken, isHydrated, loadRoadmap]);

  const moduleNodes = useMemo<ModuleNode[]>(() => {
    if (!roadmap) return [];

    const orderedModules = roadmap.milestones
      .flatMap((milestone) => milestone.modules)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return orderedModules.map((module) => ({
      isCompleted: module.progressStatus === "COMPLETED",
      isCurrent:
        module.moduleId === roadmap.currentModuleId ||
        module.progressStatus === "IN_PROGRESS",
      module,
    }));
  }, [roadmap]);

  const currentModule = useMemo(
    () => moduleNodes.find((item) => item.isCurrent)?.module ?? moduleNodes[0]?.module ?? null,
    [moduleNodes],
  );

  const openModule = (moduleId: number) => {
    pushRoute(`/user/grammar?moduleId=${moduleId}`);
  };

  return (
    <UserScreen>
      <AppHeader rightSlot={<AvatarBadge label="A" />} title="Academic Concierge" />

      <Text style={styles.levelLabel}>
        TARGET {roadmap?.targetScore ?? auth.user?.targetScore ?? "--"}+
      </Text>
      <Text style={styles.title}>{roadmap?.learningPathTitle ?? "TOEIC Learning Path"}</Text>

      <View style={styles.progressShell}>
        <ProgressBar
          label="COURSE PROGRESS"
          rightLabel={`${Math.round(roadmap?.progressPercent ?? 0)}%`}
          value={roadmap?.progressPercent ?? 0}
        />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Dang dong bo lo trinh tu backend...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {!loading && !errorMessage && moduleNodes.length === 0 ? (
        <Text style={styles.emptyText}>Chua co module nao trong lo trinh hien tai.</Text>
      ) : null}

      <View style={styles.timeline}>
        <View style={styles.dashedLine} />
        {moduleNodes.map((item, index) => {
          const alignRight = index % 2 === 1;
          const isCurrent = item.isCurrent;
          const isDone = item.isCompleted;

          return (
            <View
              key={item.module.moduleId}
              style={[
                styles.timelineItem,
                alignRight ? styles.timelineItemRight : styles.timelineItemLeft,
              ]}
            >
              <Pressable
                onPress={() => openModule(item.module.moduleId)}
                style={[
                  styles.node,
                  isDone ? styles.nodeDone : null,
                  isCurrent ? styles.nodeCurrent : null,
                ]}
              >
                <Ionicons
                  color={isCurrent || isDone ? colors.primaryDark : "#ACB1C0"}
                  name={isDone ? "checkmark" : isCurrent ? "school-outline" : "book-outline"}
                  size={28}
                />
              </Pressable>

              {isCurrent ? (
                <View style={styles.startBubble}>
                  <Text style={styles.startBubbleText}>CURRENT MODULE</Text>
                </View>
              ) : null}

              <Text style={styles.unitTitle}>{item.module.title}</Text>
              <Text style={styles.unitMeta}>
                {item.module.videoLessonCount} videos • {item.module.flashcardCount} vocab •{" "}
                {item.module.practiceSetCount} practices
              </Text>

              <View style={styles.unitProgressWrap}>
                <ProgressBar
                  accentColor={isDone ? "#24963F" : colors.primary}
                  rightLabel={`${Math.round(item.module.progressPercent)}%`}
                  value={item.module.progressPercent}
                />
              </View>
            </View>
          );
        })}

        <View style={styles.rewardWrap}>
          <View style={styles.rewardCircle}>
            <Ionicons color="#BCC0CF" name="ribbon-outline" size={30} />
          </View>
          <Text style={styles.rewardLabel}>{roadmap?.status ?? "ACTIVE PATH"}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => {
          if (currentModule) {
            openModule(currentModule.moduleId);
          }
        }}
        style={styles.energyButton}
      >
        <Ionicons color={colors.text} name="flash" size={22} />
      </Pressable>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  dashedLine: {
    alignSelf: "center",
    borderColor: "#D9DEEC",
    borderStyle: "dashed",
    borderWidth: 2,
    bottom: 0,
    position: "absolute",
    top: 0,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  energyButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#59FF77",
    borderRadius: radius.md,
    height: 56,
    justifyContent: "center",
    marginTop: spacing.lg,
    width: 56,
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
  levelLabel: {
    color: "#1A7C2B",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.8,
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
  node: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  nodeCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderWidth: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  nodeDone: {
    backgroundColor: "#9AF78B",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  progressShell: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  rewardCircle: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderColor: "#DADFF1",
    borderRadius: radius.pill,
    borderStyle: "dashed",
    borderWidth: 2,
    height: 120,
    justifyContent: "center",
    width: 120,
  },
  rewardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: spacing.sm,
  },
  rewardWrap: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  startBubble: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#171B28",
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
    marginTop: -18,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  startBubbleText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
  timeline: {
    paddingBottom: spacing.xl,
    position: "relative",
  },
  timelineItem: {
    marginBottom: spacing.xl,
    width: "50%",
  },
  timelineItemLeft: {
    alignItems: "center",
    alignSelf: "flex-start",
    paddingRight: spacing.md,
  },
  timelineItemRight: {
    alignItems: "center",
    alignSelf: "flex-end",
    paddingLeft: spacing.md,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: spacing.lg,
  },
  unitMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  unitProgressWrap: {
    marginTop: spacing.sm,
    width: "100%",
  },
  unitTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: spacing.md,
    textAlign: "center",
  },
});
