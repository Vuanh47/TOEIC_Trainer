import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { UserTestService } from "@/src/services/user-test.service";
import { QuestionAnswerResult, QuestionExplainResponse, TestAttemptResponse } from "@/src/types/user-api";

function formatDateTime(value?: string | null) {
  if (!value) return "Chua nop bai";
  return new Date(value).toLocaleString();
}

function normalizeExplainText(text?: string | null) {
  if (!text) return "";
  return text.replace(/\*\*/g, "").trim();
}

export default function AttemptReviewScreen() {
  const params = useLocalSearchParams<{ attemptId?: string }>();
  const { auth } = useAuth();

  const [attempt, setAttempt] = useState<TestAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  const [explainLoadingId, setExplainLoadingId] = useState<number | null>(null);
  const [explanations, setExplanations] = useState<Record<number, QuestionExplainResponse>>({});
  const [explainErrors, setExplainErrors] = useState<Record<number, string>>({});

  const service = useMemo(() => {
    return auth.accessToken ? new UserTestService(auth.accessToken) : null;
  }, [auth.accessToken]);

  const attemptId = useMemo(() => {
    if (!params.attemptId) return null;
    const parsed = Number(params.attemptId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.attemptId]);

  useEffect(() => {
    if (!service || !attemptId) return;

    const loadAttempt = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const response = await service.getAttemptDetails(attemptId);
        setAttempt(response.data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Khong the tai chi tiet bai lam.");
      } finally {
        setLoading(false);
      }
    };

    void loadAttempt();
  }, [attemptId, service]);

  const scorePercent = Math.round(attempt?.score ?? 0);
  const answers = attempt?.answers ?? [];
  const incorrectCount = answers.filter((item) => !item.correct).length;

  const handleExplain = async (answer: QuestionAnswerResult) => {
    if (!service) return;

    const questionId = answer.testPartQuestionId;
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
      return;
    }

    setExpandedQuestionId(questionId);
    if (explanations[questionId] || explainLoadingId === questionId) return;

    try {
      setExplainLoadingId(questionId);
      setExplainErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });

      const response = await service.explainQuestion({
        testPartQuestionId: questionId,
        selectedAnswer: answer.selectedLabel,
        type: "BOTH",
      });

      setExplanations((prev) => ({
        ...prev,
        [questionId]: response.data,
      }));
    } catch (error) {
      setExplainErrors((prev) => ({
        ...prev,
        [questionId]: error instanceof Error ? error.message : "Khong the tai giai thich AI.",
      }));
    } finally {
      setExplainLoadingId(null);
    }
  };

  if (loading) {
    return (
      <UserScreen scrollable={false}>
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </UserScreen>
    );
  }

  if (!attempt || errorMessage) {
    return (
      <UserScreen>
        <AppHeader
          title="Review Attempt"
          leftIcon="chevron-back-outline"
          onLeftPress={() => router.back()}
          rightSlot={<AvatarBadge label={auth.user?.fullName?.[0] || "U"} />}
        />
        <SurfaceCard style={styles.errorCard}>
          <Text style={styles.errorTitle}>Khong tai duoc bai lam</Text>
          <Text style={styles.errorText}>{errorMessage ?? "Du lieu attempt khong hop le."}</Text>
        </SurfaceCard>
      </UserScreen>
    );
  }

  return (
    <UserScreen>
      <AppHeader
        title="Review Attempt"
        subtitle="AI Feedback"
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<AvatarBadge label={auth.user?.fullName?.[0] || "U"} />}
      />

      <SurfaceCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>TOEIC Review</Text>
            <Text style={styles.heroTitle}>{attempt.testTitle}</Text>
            <Text style={styles.heroMeta}>Nop bai: {formatDateTime(attempt.submittedAt)}</Text>
          </View>
          <View style={styles.scoreRing}>
            <Text style={styles.scoreRingValue}>{scorePercent}%</Text>
            <Text style={styles.scoreRingLabel}>Score</Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={[styles.statCard, styles.statCardSuccess]}>
            <Text style={styles.statValue}>{attempt.correctCount ?? 0}</Text>
            <Text style={styles.statLabel}>Cau dung</Text>
          </View>
          <View style={[styles.statCard, styles.statCardDanger]}>
            <Text style={styles.statValue}>{incorrectCount}</Text>
            <Text style={styles.statLabel}>Can xem lai</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{attempt.totalQuestions}</Text>
            <Text style={styles.statLabel}>Tong cau</Text>
          </View>
        </View>
      </SurfaceCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cau hoi va dap an</Text>
        <Text style={styles.sectionCaption}>Hien day du dap an va giai thich AI theo tung cau.</Text>
      </View>

      {answers.map((answer, index) => {
        const explainData = explanations[answer.testPartQuestionId];
        const explainError = explainErrors[answer.testPartQuestionId];
        const isExpanded = expandedQuestionId === answer.testPartQuestionId;
        const isLoadingExplain = explainLoadingId === answer.testPartQuestionId;
        const normalizedExplanation = normalizeExplainText(explainData?.explanation);
        const normalizedTips = normalizeExplainText(explainData?.tips);
        const shouldRenderTips = normalizedTips.length > 0 && normalizedTips !== normalizedExplanation;

        return (
          <SurfaceCard
            key={answer.testPartQuestionId}
            style={[
              styles.answerCard,
              answer.correct ? styles.answerCardCorrect : styles.answerCardWrong,
            ]}
          >
            <View style={styles.answerTopRow}>
              <View style={styles.answerIndexWrap}>
                <Text style={styles.answerIndex}>Q{index + 1}</Text>
              </View>
              <View style={styles.answerContent}>
                <Text style={styles.answerQuestion}>{answer.questionText}</Text>

                {answer.options?.length ? (
                  <View style={styles.optionsList}>
                    {answer.options.map((option) => {
                      const isSelected = option.optionLabel === answer.selectedLabel;
                      const isCorrect = option.optionLabel === answer.correctLabel || option.correct === true;
                      return (
                        <View
                          key={`${answer.testPartQuestionId}-${option.optionLabel}`}
                          style={[
                            styles.optionRow,
                            isCorrect ? styles.optionRowCorrect : null,
                            isSelected && !isCorrect ? styles.optionRowSelectedWrong : null,
                          ]}
                        >
                          <Text style={styles.optionLabel}>{option.optionLabel}</Text>
                          <Text style={styles.optionText}>{option.optionText}</Text>
                          {isCorrect ? (
                            <Ionicons color="#1A7C2B" name="checkmark-circle" size={18} />
                          ) : isSelected ? (
                            <Ionicons color="#B9382F" name="close-circle" size={18} />
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              <View style={[styles.stateIcon, answer.correct ? styles.stateIconSuccess : styles.stateIconDanger]}>
                <Ionicons
                  color={answer.correct ? "#1A7C2B" : "#B9382F"}
                  name={answer.correct ? "checkmark" : "close"}
                  size={18}
                />
              </View>
            </View>

            <View style={styles.explainSection}>
              <Pressable
                onPress={() => void handleExplain(answer)}
                style={[styles.explainButton, isExpanded ? styles.explainButtonActive : null]}
              >
                <Ionicons color={isExpanded ? "#fff" : "#0E7C66"} name="sparkles-outline" size={16} />
                <Text style={[styles.explainButtonText, isExpanded ? styles.explainButtonTextActive : null]}>
                  {isExpanded ? "An giai thich AI" : explainData ? "Xem lai giai thich AI" : "Giai thich AI"}
                </Text>
              </Pressable>

              {isExpanded ? (
                <View style={styles.explainPanel}>
                  {isLoadingExplain ? (
                    <View style={styles.inlineLoading}>
                      <ActivityIndicator color={colors.primary} />
                      <Text style={styles.inlineLoadingText}>AI dang phan tich cau hoi nay.</Text>
                    </View>
                  ) : null}

                  {explainError ? <Text style={styles.explainError}>{explainError}</Text> : null}

                  {explainData ? (
                    <>
                      <View style={styles.explainBadgeRow}>
                        <View style={styles.explainBadge}>
                          <Text style={styles.explainBadgeText}>Correct: {normalizeExplainText(explainData.correctAnswer)}</Text>
                        </View>
                        <View style={[styles.explainBadge, styles.explainBadgeMuted]}>
                          <Text style={styles.explainBadgeText}>Your answer: {explainData.userAnswer}</Text>
                        </View>
                      </View>

                      {normalizedExplanation ? (
                        <>
                          <Text style={styles.explainTitle}>Vi sao cau nay nhu vay?</Text>
                          <Text style={styles.explainBody}>{normalizedExplanation}</Text>
                        </>
                      ) : null}

                      {shouldRenderTips ? (
                        <View style={styles.tipCard}>
                          <Ionicons color="#1D355E" name="bulb-outline" size={18} />
                          <Text style={styles.tipText}>{normalizedTips}</Text>
                        </View>
                      ) : null}
                    </>
                  ) : null}
                </View>
              ) : null}
            </View>
          </SurfaceCard>
        );
      })}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  answerCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  answerCardCorrect: {
    backgroundColor: "#F6FCF8",
    borderColor: "#CBEAD8",
  },
  answerCardWrong: {
    backgroundColor: "#FFF9F7",
    borderColor: "#F1D4CF",
  },
  answerContent: {
    flex: 1,
  },
  answerIndex: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
  },
  answerIndexWrap: {
    alignItems: "center",
    backgroundColor: "#E7EEF8",
    borderRadius: radius.pill,
    height: 42,
    justifyContent: "center",
    marginRight: spacing.sm,
    width: 42,
  },
  answerQuestion: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },
  answerTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  centerState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  errorCard: {
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  errorTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
  },
  explainBadge: {
    backgroundColor: "#DFF7F1",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  explainBadgeMuted: {
    backgroundColor: "#EDF2FA",
  },
  explainBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  explainBadgeText: {
    color: "#0F3554",
    fontSize: 12,
    fontWeight: "800",
  },
  explainBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  explainButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#DFF7F1",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  explainButtonActive: {
    backgroundColor: "#14A085",
  },
  explainButtonText: {
    color: "#0E7C66",
    fontSize: 13,
    fontWeight: "900",
  },
  explainButtonTextActive: {
    color: "#fff",
  },
  explainError: {
    color: "#B9382F",
    fontSize: 13,
    fontWeight: "700",
  },
  explainPanel: {
    backgroundColor: "#F4FAFF",
    borderColor: "#D8E9F9",
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  explainSection: {
    marginTop: spacing.md,
  },
  explainTitle: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: spacing.xs,
  },
  heroCard: {
    backgroundColor: "#173267",
    borderColor: "#264784",
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  heroCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroEyebrow: {
    color: "#9DD9FF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  heroMeta: {
    color: "#C9D8F4",
    fontSize: 13,
    marginTop: spacing.sm,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
    marginTop: spacing.xs,
  },
  heroTopRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  inlineLoading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  inlineLoadingText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 13,
  },
  optionLabel: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    width: 22,
  },
  optionRow: {
    alignItems: "center",
    backgroundColor: "#F7F9FE",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  optionRowCorrect: {
    backgroundColor: "#E7F8EA",
    borderColor: "#A9D7B0",
    borderWidth: 1,
  },
  optionRowSelectedWrong: {
    backgroundColor: "#FDECEC",
    borderColor: "#E9B6B6",
    borderWidth: 1,
  },
  optionsList: {
    marginTop: spacing.md,
  },
  optionText: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  scoreRing: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    height: 92,
    justifyContent: "center",
    width: 92,
  },
  scoreRingLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  scoreRingValue: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
  },
  sectionCaption: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900",
  },
  stateIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 32,
    justifyContent: "center",
    marginLeft: spacing.sm,
    width: 32,
  },
  stateIconDanger: {
    backgroundColor: "#FDE7E3",
  },
  stateIconSuccess: {
    backgroundColor: "#E4F8E6",
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 86,
    padding: spacing.md,
  },
  statCardDanger: {
    backgroundColor: "rgba(217,91,91,0.22)",
  },
  statCardSuccess: {
    backgroundColor: "rgba(47,166,110,0.22)",
  },
  statGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statLabel: {
    color: "#DCE6FA",
    fontSize: 12,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  tipCard: {
    alignItems: "flex-start",
    backgroundColor: "#E9F3FF",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  tipText: {
    color: "#1B365C",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 21,
  },
});
