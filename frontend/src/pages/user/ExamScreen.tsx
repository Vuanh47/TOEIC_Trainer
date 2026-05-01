import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { examQuestion } from "@/src/pages/user/mock-data";
import { replaceRoute } from "@/src/utils/navigation";

export default function ExamScreen() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const isSubmitted = selectedOptionId !== null;

  return (
    <UserScreen>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons color={colors.primaryDark} name="close-outline" size={28} />
        </Pressable>
        <Text style={styles.title}>TOEIC Official</Text>
        <View style={styles.timerPill}>
          <Ionicons color="#CB2313" name="timer-outline" size={16} />
          <Text style={styles.timerText}>12:44</Text>
        </View>
      </View>

      <Text style={styles.partText}>{examQuestion.part}</Text>
      <Text style={styles.counter}>{examQuestion.progressText}</Text>

      <SurfaceCard style={styles.promptCard}>
        <Text style={styles.prompt}>
          {examQuestion.prompt.split(examQuestion.highlight)[0]}
          <Text style={styles.highlight}>{examQuestion.highlight}</Text>
          {examQuestion.prompt.split(examQuestion.highlight)[1]}
        </Text>
      </SurfaceCard>

      {examQuestion.options.map((option) => {
        const selected = selectedOptionId === option.id;
        const correct = examQuestion.correctOptionId === option.id;
        const showCorrect = isSubmitted && correct;

        return (
          <Pressable
            key={option.id}
            onPress={() => setSelectedOptionId(option.id)}
            style={[
              styles.optionCard,
              selected ? styles.optionSelected : null,
              showCorrect ? styles.optionCorrect : null,
            ]}
          >
            <View style={[styles.optionBadge, showCorrect ? styles.optionBadgeCorrect : null]}>
              <Text style={[styles.optionBadgeText, showCorrect ? styles.optionBadgeTextActive : null]}>
                {option.label}
              </Text>
            </View>
            <Text style={styles.optionText}>{option.value}</Text>
            {showCorrect ? (
              <Ionicons color="#1A7C2B" name="checkmark-circle" size={22} />
            ) : null}
          </Pressable>
        );
      })}

      <View style={styles.bottomActions}>
        <Pressable onPress={() => router.back()} style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Previous</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedOptionId(null)} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Next</Text>
        </Pressable>
        <Pressable onPress={() => replaceRoute("/user/test")} style={styles.submitAction}>
          <Text style={styles.submitActionText}>Nop bai som</Text>
        </Pressable>
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  bottomActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  counter: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: spacing.lg,
  },
  highlight: {
    color: colors.primaryDark,
    textDecorationLine: "underline",
    textDecorationColor: "#9CF09F",
  },
  iconButton: {
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  optionBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  optionBadgeCorrect: {
    backgroundColor: "#1A7C2B",
  },
  optionBadgeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  optionBadgeTextActive: {
    color: colors.surface,
  },
  optionCard: {
    alignItems: "center",
    backgroundColor: "rgba(241,243,252,0.95)",
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
    minHeight: 106,
    paddingHorizontal: spacing.md,
  },
  optionCorrect: {
    backgroundColor: "#E1F7DE",
    borderColor: "#1A7C2B",
    borderWidth: 2,
  },
  optionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  optionText: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  partText: {
    color: colors.text,
    fontSize: 13,
    letterSpacing: 2.2,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 72,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
  },
  prompt: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 42,
  },
  promptCard: {
    marginBottom: spacing.lg,
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: "#EFF1FA",
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 72,
  },
  secondaryActionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  submitAction: {
    alignItems: "center",
    borderColor: "#D6DDED",
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 72,
    paddingHorizontal: spacing.md,
    width: 98,
  },
  submitActionText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  timerPill: {
    alignItems: "center",
    backgroundColor: "#FFE0DB",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  timerText: {
    color: "#CB2313",
    fontSize: 16,
    fontWeight: "900",
  },
  title: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
});
