import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { getPracticeAttemptDetail } from "@/src/services/user-practice.service";
import { UserPracticeAttemptDetailResponseData } from "@/src/types/user-api";

function formatDateTime(value?: string | null) {
  if (!value) return "Chưa nộp bài";
  return new Date(value).toLocaleString();
}

export default function PracticeAttemptReviewScreen() {
  const params = useLocalSearchParams<{ attemptId?: string }>();
  const { auth } = useAuth();

  const [attempt, setAttempt] = useState<UserPracticeAttemptDetailResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const attemptId = useMemo(() => {
    if (!params.attemptId) return null;
    const parsed = Number(params.attemptId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.attemptId]);

  useEffect(() => {
    if (!auth.accessToken || !attemptId) return;
    const accessToken = auth.accessToken;

    const loadAttempt = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const response = await getPracticeAttemptDetail(accessToken, attemptId);
        setAttempt(response.data ?? null);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Không thể tải kết quả practice.");
      } finally {
        setLoading(false);
      }
    };

    void loadAttempt();
  }, [attemptId, auth.accessToken]);

  if (loading) {
    return (
      <UserScreen scrollable={false}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </UserScreen>
    );
  }

  if (!attempt || errorMessage) {
    return (
      <UserScreen>
        <AppHeader
          title="Xem lại practice"
          leftIcon="chevron-back-outline"
          onLeftPress={() => router.back()}
          rightSlot={<AvatarBadge label={auth.user?.fullName?.[0] || "U"} />}
        />
        <SurfaceCard>
          <Text style={styles.errorTitle}>Không tải được kết quả</Text>
          <Text style={styles.errorText}>{errorMessage ?? "Dữ liệu attempt không hợp lệ."}</Text>
        </SurfaceCard>
      </UserScreen>
    );
  }

  const answers = attempt.answers ?? [];
  const scorePercent = Math.round(attempt.score ?? 0);
  const incorrectCount = answers.filter((item) => !item.correct).length;

  return (
    <UserScreen>
      <AppHeader
        title="Xem lại practice"
        subtitle="Bài tập theo module"
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<AvatarBadge label={auth.user?.fullName?.[0] || "U"} />}
      />

      <SurfaceCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Kết quả luyện tập</Text>
            <Text style={styles.heroTitle}>{attempt.practiceSetTitle}</Text>
            <Text style={styles.heroMeta}>Nộp bài: {formatDateTime(attempt.submittedAt)}</Text>
          </View>
          <View style={styles.scoreRing}>
            <Text style={styles.scoreRingValue}>{scorePercent}%</Text>
            <Text style={styles.scoreRingLabel}>Điểm</Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={[styles.statCard, styles.statCardSuccess]}>
            <Text style={styles.statValue}>{attempt.correctCount ?? 0}</Text>
            <Text style={styles.statLabel}>Câu đúng</Text>
          </View>
          <View style={[styles.statCard, styles.statCardDanger]}>
            <Text style={styles.statValue}>{incorrectCount}</Text>
            <Text style={styles.statLabel}>Cần xem lại</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{attempt.totalQuestions}</Text>
            <Text style={styles.statLabel}>Tổng câu</Text>
          </View>
        </View>
      </SurfaceCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chi tiết đáp án</Text>
        <Text style={styles.sectionCaption}>Xem đầy đủ đáp án chọn, đáp án đúng và giải thích có sẵn.</Text>
      </View>

      {answers.map((answer, index) => {
        const isExpanded = expandedQuestionId === answer.practiceSetQuestionId;
        return (
          <SurfaceCard
            key={answer.practiceSetQuestionId}
            style={[styles.answerCard, answer.correct ? styles.answerCardCorrect : styles.answerCardWrong]}
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
                          key={`${answer.practiceSetQuestionId}-${option.id}`}
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

            {answer.explanation ? (
              <View style={styles.explainSection}>
                <Pressable
                  onPress={() =>
                    setExpandedQuestionId((prev) =>
                      prev === answer.practiceSetQuestionId ? null : answer.practiceSetQuestionId,
                    )
                  }
                  style={[styles.explainButton, isExpanded ? styles.explainButtonActive : null]}
                >
                  <Ionicons color={isExpanded ? "#fff" : "#0E7C66"} name="book-outline" size={16} />
                  <Text style={[styles.explainButtonText, isExpanded ? styles.explainButtonTextActive : null]}>
                    {isExpanded ? "Ẩn giải thích" : "Xem giải thích"}
                  </Text>
                </Pressable>

                {isExpanded ? (
                  <View style={styles.explainPanel}>
                    <Text style={styles.explainTitle}>Giải thích câu hỏi</Text>
                    <Text style={styles.explainBody}>{answer.explanation}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
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
  loadingWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
});
