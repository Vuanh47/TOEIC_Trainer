import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { getPracticeSetDetail, startPractice, submitPractice } from "@/src/services/user-practice.service";
import { UserPracticeAttemptResponse, UserPracticeQuestionResponse, UserPracticeSetDetailResponseData } from "@/src/types/user-api";
import { replaceRoute } from "@/src/utils/navigation";

export default function PracticeSessionScreen() {
  const { practiceSetId, moduleId } = useLocalSearchParams<{ practiceSetId?: string; moduleId?: string }>();
  const { auth } = useAuth();

  const [practiceSet, setPracticeSet] = useState<UserPracticeSetDetailResponseData | null>(null);
  const [attempt, setAttempt] = useState<UserPracticeAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const parsedPracticeSetId = useMemo(() => {
    if (!practiceSetId) return null;
    const parsed = Number(practiceSetId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [practiceSetId]);

  const parsedModuleId = useMemo(() => {
    if (!moduleId) return null;
    const parsed = Number(moduleId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [moduleId]);

  const questions = practiceSet?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!auth.accessToken || !parsedPracticeSetId) return;
    const accessToken = auth.accessToken;

    const initPractice = async () => {
      try {
        setLoading(true);
        const [detailResp, attemptResp] = await Promise.all([
          getPracticeSetDetail(accessToken, parsedPracticeSetId),
          startPractice(accessToken, parsedPracticeSetId),
        ]);
        setPracticeSet(detailResp.data ?? null);
        setAttempt(attemptResp.data ?? null);
        setTimeLeft((detailResp.data?.durationMinutes ?? 0) * 60);
      } catch (error) {
        Alert.alert("Practice", error instanceof Error ? error.message : "Không thể bắt đầu bài tập.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    void initPractice();
  }, [auth.accessToken, parsedPracticeSetId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSelectOption = (question: UserPracticeQuestionResponse, label: string) => {
    const questionKey = question.practiceSetQuestionId ?? question.id;
    setUserAnswers((prev) => ({
      ...prev,
      [questionKey]: label,
    }));
  };

  const handleSubmit = useCallback(async (auto = false) => {
    if (!auth.accessToken || !attempt) return;
    const accessToken = auth.accessToken;

    try {
      setLoading(true);
      const answers = Object.entries(userAnswers).map(([id, selectedLabel]) => ({
        practiceSetQuestionId: Number(id),
        selectedLabel,
      }));
      const response = await submitPractice(accessToken, attempt.id, { answers });

      if (!auto) {
        Alert.alert("Practice", "Đã nộp bài thành công.");
      }

      replaceRoute(
        `/user/practice-attempt-review?attemptId=${response.data.attemptId}&moduleId=${parsedModuleId ?? ""}`,
      );
    } catch (error) {
      Alert.alert("Practice", error instanceof Error ? error.message : "Không thể nộp bài.");
    } finally {
      setLoading(false);
    }
  }, [attempt, auth.accessToken, parsedModuleId, userAnswers]);

  useEffect(() => {
    if (timeLeft <= 0 || loading || !attempt) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          void handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt, handleSubmit, loading, timeLeft]);

  const confirmSubmit = () => {
    Alert.alert("Nộp bài", "Bạn có chắc muốn nộp bài ngay bây giờ?", [
      { text: "Hủy", style: "cancel" },
      { text: "Nộp bài", onPress: () => void handleSubmit(false) },
    ]);
  };

  if (loading || !practiceSet || !currentQuestion) {
    return (
      <UserScreen scrollable={false}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </UserScreen>
    );
  }

  const selectedOption = userAnswers[currentQuestion.practiceSetQuestionId ?? currentQuestion.id];

  return (
    <UserScreen>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons color={colors.primaryDark} name="close-outline" size={28} />
        </Pressable>
        <Text style={styles.title}>{practiceSet.title}</Text>
        <View style={styles.timerPill}>
          <Ionicons color="#CB2313" name="timer-outline" size={16} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <Text style={styles.partText}>Bộ practice Part {practiceSet.partNo ?? "--"}</Text>
      <Text style={styles.counter}>Câu hỏi {currentIndex + 1} / {questions.length}</Text>

      <SurfaceCard style={styles.promptCard}>
        <Text style={styles.prompt}>{currentQuestion.questionText}</Text>
      </SurfaceCard>

      {currentQuestion.options.map((option) => {
        const selected = selectedOption === option.optionLabel;
        return (
          <Pressable
            key={option.id}
            onPress={() => handleSelectOption(currentQuestion, option.optionLabel)}
            style={[styles.optionCard, selected ? styles.optionSelected : null]}
          >
            <View style={styles.optionBadge}>
              <Text style={styles.optionBadgeText}>{option.optionLabel}</Text>
            </View>
            <Text style={styles.optionText}>{option.optionText}</Text>
          </Pressable>
        );
      })}

      <View style={styles.bottomActions}>
        <Pressable
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          style={[styles.secondaryAction, currentIndex === 0 ? styles.actionDisabled : null]}
        >
          <Text style={styles.secondaryActionText}>Trước</Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          disabled={currentIndex === questions.length - 1}
          style={[styles.primaryAction, currentIndex === questions.length - 1 ? styles.actionDisabled : null]}
        >
          <Text style={styles.primaryActionText}>Tiếp</Text>
        </Pressable>
        <Pressable onPress={confirmSubmit} style={styles.submitAction}>
          <Text style={styles.submitActionText}>Nộp bài</Text>
        </Pressable>
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  actionDisabled: {
    opacity: 0.5,
  },
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
  iconButton: {
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  loadingWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  optionBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  optionBadgeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
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
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    marginHorizontal: spacing.md,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
});
