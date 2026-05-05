import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { UserTestService } from "@/src/services/user-test.service";
import { UserTestResponse, TestAttemptResponse } from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

export default function TestHubScreen() {
  const { auth } = useAuth();
  const [tests, setTests] = useState<UserTestResponse[]>([]);
  const [attempts, setAttempts] = useState<TestAttemptResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const service = useMemo(() => {
    return auth.accessToken ? new UserTestService(auth.accessToken) : null;
  }, [auth.accessToken]);

  useEffect(() => {
    if (!service) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [testsResp, attemptsResp] = await Promise.allSettled([
          service.getPublishedTests(),
          service.getMyAttempts(),
        ]);

        if (testsResp.status === "fulfilled") {
          setTests(testsResp.value.data || []);
        } else {
          setTests([]);
          console.error("Failed to load published tests", testsResp.reason);
        }

        if (attemptsResp.status === "fulfilled") {
          setAttempts(attemptsResp.value.data || []);
        } else {
          setAttempts([]);
          console.error("Failed to load attempts", attemptsResp.reason);
        }
      } catch (error) {
        console.error("Failed to load test hub data", error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [service]);

  if (loading) {
    return (
      <UserScreen>
        <View style={styles.loadingState}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </UserScreen>
    );
  }

  return (
    <UserScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader
          rightSlot={<AvatarBadge label={auth.user?.fullName?.[0] || "U"} />}
          title="TOEIC Test Center"
        />

        <Text style={styles.title}>TOEIC Official Practice</Text>
        <Text style={styles.subtitle}>
          Thi thu co giai thich, theo doi thoi gian va kha nang nop bai som.
        </Text>

        {tests.length > 0 ? (
          <SurfaceCard style={styles.examCard}>
            <View style={styles.timerPill}>
              <Ionicons color="#CB2313" name="timer-outline" size={18} />
              <Text style={styles.timerText}>{tests[0].totalDurationMinutes}:00</Text>
            </View>
            <Text style={styles.sectionLabel}>{tests[0].testType}</Text>
            <Text style={styles.questionCounter}>{tests[0].title}</Text>
            <Text style={styles.examSnippet}>
              {tests[0].description || "Ready to start your TOEIC journey?"}
            </Text>
            <View style={styles.examActions}>
              <Pressable
                onPress={() => pushRoute(`/user/exam?testId=${tests[0].id}`)}
                style={styles.primaryAction}
              >
                <Text style={styles.primaryActionText}>Start Test</Text>
              </Pressable>
            </View>
          </SurfaceCard>
        ) : null}

        <Text style={styles.blockTitle}>Available Tests</Text>
        {tests.slice(1).map((test) => (
          <Pressable
            key={test.id}
            onPress={() => pushRoute(`/user/exam?testId=${test.id}`)}
            style={styles.resultItem}
          >
            <View style={styles.resultMain}>
              <Text style={styles.resultTitle}>{test.title}</Text>
              <Text style={styles.resultMeta}>
                {test.testType} | {test.totalDurationMinutes} min
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        ))}

        <Text style={[styles.blockTitle, styles.resultsTitle]}>Recent results</Text>
        {attempts.length > 0 ? (
          attempts.map((attempt) => (
            <Pressable
              key={attempt.attemptId}
              onPress={() => pushRoute(`/user/attempt-review?attemptId=${attempt.attemptId}`)}
              style={styles.resultItem}
            >
              <View style={styles.resultMain}>
                <Text style={styles.resultTitle}>{attempt.testTitle}</Text>
                <Text style={styles.resultMeta}>
                  {new Date(attempt.startedAt).toLocaleDateString()} | {attempt.correctCount}/{attempt.totalQuestions} correct
                </Text>
                <View style={styles.reviewPill}>
                  <Ionicons name="sparkles-outline" size={14} color="#0E7C66" />
                  <Text style={styles.reviewPillText}>Xem bai lam va giai thich AI</Text>
                </View>
              </View>
              <View style={styles.resultAside}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{Math.round(attempt.score || 0)}%</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.resultMeta}>Chua co ket qua nao.</Text>
        )}
      </ScrollView>
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
  loadingState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
  questionCounter: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  resultAside: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
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
  resultMain: {
    flex: 1,
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  resultsTitle: {
    marginTop: spacing.lg,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  reviewPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#DFF7F1",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  reviewPillText: {
    color: "#0E7C66",
    fontSize: 12,
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
