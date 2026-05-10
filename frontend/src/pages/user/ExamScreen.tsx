import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { UserTestService } from "@/src/services/user-test.service";
import { TestAttemptResponse, UserTestResponse } from "@/src/types/user-api";
import { replaceRoute } from "@/src/utils/navigation";

export default function ExamScreen() {
  const { testId } = useLocalSearchParams<{ testId: string }>();
  const { auth } = useAuth();

  const [test, setTest] = useState<UserTestResponse | null>(null);
  const [attempt, setAttempt] = useState<TestAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const service = useMemo(() => {
    return auth.accessToken ? new UserTestService(auth.accessToken) : null;
  }, [auth.accessToken]);

  const allQuestions = useMemo(() => {
    if (!test?.parts) return [];
    return test.parts.flatMap((part) =>
      (part.questions || []).map((question) => ({
        ...question,
        partName: part.partName,
      })),
    );
  }, [test]);

  const currentQuestion = allQuestions[currentIndex];

  useEffect(() => {
    if (!service || !testId) return;

    const initTest = async () => {
      try {
        setLoading(true);
        const id = Number.parseInt(testId, 10);
        const [testResp, attemptResp] = await Promise.all([
          service.getTestById(id),
          service.startTest(id),
        ]);
        setTest(testResp.data);
        setAttempt(attemptResp.data);
        setTimeLeft(testResp.data.totalDurationMinutes * 60);
      } catch (error) {
        console.error("Failed to start test", error);
        Alert.alert("Lỗi", "Không thể bắt đầu bài thi. Vui lòng thử lại sau.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    void initTest();
  }, [service, testId]);

  const performSubmit = useCallback(async () => {
    if (!service || !attempt) return;

    try {
      setLoading(true);
      const answers = Object.entries(userAnswers).map(([id, label]) => ({
        selectedLabel: label,
        testPartQuestionId: Number.parseInt(id, 10),
      }));
      await service.submitAttempt(attempt.attemptId, { answers });
      Alert.alert("Thành công", "Bài thi của bạn đã được nộp.");
      replaceRoute("/user/test");
    } catch (error) {
      console.error("Failed to submit test", error);
      Alert.alert("Lỗi", "Nộp bài thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [attempt, service, userAnswers]);

  useEffect(() => {
    if (timeLeft <= 0 || loading || !attempt) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert("Hết giờ", "Thời gian làm bài đã hết. Hệ thống sẽ tự động nộp bài.");
          void performSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt, loading, performSubmit, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;
    return `${minutes}:${remainSeconds < 10 ? "0" : ""}${remainSeconds}`;
  };

  const handleSelectOption = (label: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: label,
    }));
  };

  const handleSubmit = () => {
    Alert.alert("Nộp bài", "Bạn có chắc chắn muốn nộp bài ngay bây giờ?", [
      { text: "Hủy", style: "cancel" },
      { text: "Nộp bài", onPress: () => void performSubmit() },
    ]);
  };

  if (loading || !test || !currentQuestion) {
    return (
      <UserScreen>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </UserScreen>
    );
  }

  const selectedOptionLabel = userAnswers[currentQuestion.id];

  return (
    <UserScreen>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons color={colors.primaryDark} name="close-outline" size={28} />
        </Pressable>
        <Text style={styles.title}>{test.title}</Text>
        <View style={styles.timerPill}>
          <Ionicons color="#CB2313" name="timer-outline" size={16} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <Text style={styles.partText}>{(currentQuestion as typeof currentQuestion & { partName?: string }).partName}</Text>
      <Text style={styles.counter}>Câu hỏi {currentIndex + 1} / {allQuestions.length}</Text>

      <SurfaceCard style={styles.promptCard}>
        <Text style={styles.prompt}>{currentQuestion.questionText}</Text>
      </SurfaceCard>

      {currentQuestion.options.map((option) => {
        const selected = selectedOptionLabel === option.optionLabel;

        return (
          <Pressable
            key={option.id}
            onPress={() => handleSelectOption(option.optionLabel)}
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
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          style={[styles.secondaryAction, currentIndex === 0 ? styles.actionDisabled : null]}
        >
          <Text style={styles.secondaryActionText}>Trước</Text>
        </Pressable>
        <Pressable
          disabled={currentIndex === allQuestions.length - 1}
          onPress={() => setCurrentIndex((prev) => Math.min(allQuestions.length - 1, prev + 1))}
          style={[styles.primaryAction, currentIndex === allQuestions.length - 1 ? styles.actionDisabled : null]}
        >
          <Text style={styles.primaryActionText}>Tiếp</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} style={styles.submitAction}>
          <Text style={styles.submitActionText}>Nộp bài sớm</Text>
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
