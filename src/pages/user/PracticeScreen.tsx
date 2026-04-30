import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import UserScreen from "@/src/components/user/UserScreen";
import { lessonUnits } from "@/src/pages/user/mock-data";
import { pushRoute } from "@/src/utils/navigation";

export default function PracticeScreen() {
  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label="A" />}
        title="Academic Concierge"
      />

      <Text style={styles.levelLabel}>LEVEL 4: BUSINESS MASTERY</Text>
      <Text style={styles.title}>TOEIC Listening & Reading</Text>

      <View style={styles.progressShell}>
        <ProgressBar
          label="COURSE PROGRESS"
          rightLabel="45%"
          value={45}
        />
      </View>

      <View style={styles.timeline}>
        <View style={styles.dashedLine} />
        {lessonUnits.map((unit, index) => {
          const alignRight = index % 2 === 1;
          const isCurrent = unit.status === "current";
          const isDone = unit.status === "done";
          const isLocked = unit.status === "locked";

          return (
            <View
              key={unit.id}
              style={[
                styles.timelineItem,
                alignRight ? styles.timelineItemRight : styles.timelineItemLeft,
              ]}
            >
              <Pressable
                onPress={() =>
                  isLocked
                    ? undefined
                    : pushRoute(isCurrent ? "/user/roadmap" : "/user/grammar")
                }
                style={[
                  styles.node,
                  isDone ? styles.nodeDone : null,
                  isCurrent ? styles.nodeCurrent : null,
                  isLocked ? styles.nodeLocked : null,
                ]}
              >
                <Ionicons
                  color={isCurrent || isDone ? colors.primaryDark : "#ACB1C0"}
                  name={
                    isDone
                      ? "checkmark"
                      : isCurrent
                        ? "school-outline"
                        : "lock-closed-outline"
                  }
                  size={28}
                />
              </Pressable>

              {isCurrent ? (
                <View style={styles.startBubble}>
                  <Text style={styles.startBubbleText}>START: VERB TENSES</Text>
                </View>
              ) : null}

              <Text
                style={[
                  styles.unitTitle,
                  isLocked ? styles.unitTitleLocked : null,
                ]}
              >
                {unit.title}
              </Text>

              {isCurrent ? (
                <View style={styles.unitProgressWrap}>
                  <ProgressBar
                    accentColor="#24963F"
                    rightLabel={`${unit.progress}%`}
                    value={unit.progress}
                  />
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={styles.rewardWrap}>
          <View style={styles.rewardCircle}>
            <Ionicons color="#BCC0CF" name="gift-outline" size={30} />
          </View>
          <Text style={styles.rewardLabel}>SECTION EXAM REWARD</Text>
        </View>
      </View>

      <Pressable onPress={() => pushRoute("/user/grammar")} style={styles.energyButton}>
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
  levelLabel: {
    color: "#1A7C2B",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
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
  nodeLocked: {
    backgroundColor: "#EFEFF7",
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
  unitTitleLocked: {
    color: "#BCC0CF",
  },
});
