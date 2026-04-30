import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { pushRoute } from "@/src/utils/navigation";

export default function TestHubScreen() {
  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label="A" />}
        title="Academic Concierge"
      />

      <Text style={styles.title}>TOEIC Official Practice</Text>
      <Text style={styles.subtitle}>
        Thi thu co giai thich, theo doi thoi gian va kha nang nop bai som.
      </Text>

      <SurfaceCard style={styles.examCard}>
        <View style={styles.timerPill}>
          <Ionicons color="#CB2313" name="timer-outline" size={18} />
          <Text style={styles.timerText}>12:44</Text>
        </View>
        <Text style={styles.sectionLabel}>PART 5: INCOMPLETE SENTENCES</Text>
        <Text style={styles.questionCounter}>Question 142 / 200</Text>
        <View style={styles.dotRow}>
          {[true, true, false, false].map((active, index) => (
            <View
              key={index}
              style={[styles.progressDot, active ? styles.progressDotActive : null]}
            />
          ))}
        </View>
        <Text style={styles.examSnippet}>
          The board of directors is pleased to announce that Mr. Henderson has
          been promoted...
        </Text>
        <ProgressBar
          accentColor="#24963F"
          label="Current accuracy"
          rightLabel="78%"
          value={78}
        />
        <View style={styles.examActions}>
          <Pressable onPress={() => pushRoute("/user/exam")} style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Resume Test</Text>
          </Pressable>
          <Pressable onPress={() => pushRoute("/user/exam")} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Quick Review</Text>
          </Pressable>
        </View>
      </SurfaceCard>

      <Text style={styles.blockTitle}>Recent results</Text>
      {[
        { label: "Mini Test 03", meta: "Part 5-6 | 18 min", score: "86%" },
        { label: "Reading Sprint", meta: "Part 7 | 14 min", score: "74%" },
        { label: "Listening Drill", meta: "Part 2 | 9 min", score: "91%" },
      ].map((item) => (
        <Pressable key={item.label} onPress={() => pushRoute("/user/exam")} style={styles.resultItem}>
          <View>
            <Text style={styles.resultTitle}>{item.label}</Text>
            <Text style={styles.resultMeta}>{item.meta}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        </Pressable>
      ))}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  blockTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  dotRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.lg,
  },
  examActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  examCard: {
    marginBottom: spacing.xl,
  },
  examSnippet: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: spacing.lg,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 16,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
  },
  progressDot: {
    backgroundColor: "#CBD0E0",
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  progressDotActive: {
    backgroundColor: "#24963F",
  },
  questionCounter: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  resultItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  scoreBadge: {
    backgroundColor: "#E3FFDE",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  scoreText: {
    color: "#1A7C2B",
    fontSize: 13,
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
    fontSize: 16,
    fontWeight: "800",
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  timerPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFE0DB",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  timerText: {
    color: "#CB2313",
    fontSize: 18,
    fontWeight: "900",
  },
  title: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
});
