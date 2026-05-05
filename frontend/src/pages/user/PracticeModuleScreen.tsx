import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import {
  getMyPracticeAttempts,
  getPracticeSetDetail,
  getPracticeSetsByModule,
} from "@/src/services/user-practice.service";
import {
  PracticeSetApiItem,
  UserPracticeAttemptResponse,
  UserPracticeSetDetailResponseData,
} from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

export default function PracticeModuleScreen() {
  const params = useLocalSearchParams<{ moduleId?: string }>();
  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [practiceSets, setPracticeSets] = useState<PracticeSetApiItem[]>([]);
  const [attempts, setAttempts] = useState<UserPracticeAttemptResponse[]>([]);
  const [selectedSet, setSelectedSet] = useState<UserPracticeSetDetailResponseData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const moduleId = useMemo(() => {
    if (!params.moduleId) return null;
    const parsed = Number(params.moduleId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.moduleId]);

  const loadData = useCallback(async () => {
    if (!auth.accessToken || !moduleId) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      let nextSets: PracticeSetApiItem[] = [];

      const [setsResp, attemptsResp] = await Promise.allSettled([
        getPracticeSetsByModule(auth.accessToken, moduleId),
        getMyPracticeAttempts(auth.accessToken),
      ]);

      if (setsResp.status === "fulfilled") {
        nextSets = setsResp.value.data ?? [];
        setPracticeSets(nextSets);

        if (nextSets[0]?.id) {
          setDetailLoading(true);
          try {
            const detail = await getPracticeSetDetail(auth.accessToken, nextSets[0].id);
            setSelectedSet(detail.data ?? null);
          } finally {
            setDetailLoading(false);
          }
        } else {
          setSelectedSet(null);
        }
      } else {
        setPracticeSets([]);
        setSelectedSet(null);
        setErrorMessage(
          setsResp.reason instanceof Error ? setsResp.reason.message : "Khong the tai practice sets.",
        );
      }

      if (attemptsResp.status === "fulfilled") {
        const ownAttempts = (attemptsResp.value.data ?? []).filter((item) =>
          nextSets.some((set) => set.id === item.practiceSetId),
        );
        setAttempts(ownAttempts);
      } else {
        setAttempts([]);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Khong the tai luyen de.");
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken, moduleId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSelectSet = async (practiceSetId: number) => {
    if (!auth.accessToken) return;
    try {
      setDetailLoading(true);
      const response = await getPracticeSetDetail(auth.accessToken, practiceSetId);
      setSelectedSet(response.data ?? null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Khong the tai chi tiet bo bai tap.");
    } finally {
      setDetailLoading(false);
    }
  };

  const currentAttempts = useMemo(() => {
    if (!selectedSet) return [];
    return attempts.filter((item) => item.practiceSetId === selectedSet.id).slice(0, 3);
  }, [attempts, selectedSet]);

  if (loading) {
    return (
      <UserScreen scrollable={false}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </UserScreen>
    );
  }

  return (
    <UserScreen>
      <AppHeader
        title="Practice Sets"
        subtitle="Module Exercises"
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<AvatarBadge label={auth.user?.fullName?.[0] || "U"} />}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <SurfaceCard style={styles.headerCard}>
        <Text style={styles.headerTitle}>Luyen de theo module</Text>
        <Text style={styles.headerText}>
          Day la cac bo bai tap admin da giao cho module nay. Chon mot bo de xem chi tiet va bat dau.
        </Text>
      </SurfaceCard>

      <SurfaceCard style={styles.listCard}>
        <Text style={styles.blockTitle}>Danh sach practice sets</Text>
        {practiceSets.map((set) => {
          const active = selectedSet?.id === set.id;
          return (
            <Pressable
              key={set.id}
              onPress={() => void handleSelectSet(set.id)}
              style={[styles.setRow, active ? styles.setRowActive : null]}
            >
              <View style={styles.setIcon}>
                <Ionicons color={active ? "#fff" : colors.primaryDark} name="document-text-outline" size={18} />
              </View>
              <View style={styles.setBody}>
                <Text style={styles.setTitle}>{set.title}</Text>
                <Text style={styles.setMeta}>
                  {set.durationMinutes ?? "--"} phut • Part {set.partNo ?? "--"}
                </Text>
              </View>
              <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
            </Pressable>
          );
        })}
        {practiceSets.length === 0 ? (
          <Text style={styles.emptyText}>Module nay chua co practice set duoc publish.</Text>
        ) : null}
      </SurfaceCard>

      <SurfaceCard style={styles.detailCard}>
        <Text style={styles.blockTitle}>Chi tiet bo bai tap</Text>
        {detailLoading ? (
          <View style={styles.inlineLoading}>
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.inlineLoadingText}>Dang tai chi tiet practice set...</Text>
          </View>
        ) : selectedSet ? (
          <>
            <Text style={styles.detailTitle}>{selectedSet.title}</Text>
            <Text style={styles.detailText}>
              {selectedSet.description || "Bo bai tap nay se giup ban cuong hoa kien thuc vua hoc trong module."}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{selectedSet.durationMinutes ?? "--"}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{selectedSet.questions?.length ?? selectedSet.questionCount ?? "--"}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{selectedSet.targetScore ?? "--"}</Text>
                <Text style={styles.statLabel}>Target</Text>
              </View>
            </View>

            <Pressable
              onPress={() => pushRoute(`/user/practice-session?practiceSetId=${selectedSet.id}&moduleId=${moduleId}`)}
              style={styles.primaryAction}
            >
              <Text style={styles.primaryActionText}>Bat dau bai tap</Text>
            </Pressable>

            {currentAttempts.length > 0 ? (
              <View style={styles.attemptList}>
                <Text style={styles.attemptTitle}>Lan lam gan day</Text>
                {currentAttempts.map((attempt) => (
                  <Pressable
                    key={attempt.id}
                    onPress={() => pushRoute(`/user/practice-attempt-review?attemptId=${attempt.id}`)}
                    style={styles.attemptRow}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.attemptMain}>
                        {new Date(attempt.startedAt).toLocaleDateString()} • {attempt.correctCount ?? 0}/{attempt.totalQuestions}
                      </Text>
                      <Text style={styles.attemptSub}>Cham de xem ket qua chi tiet</Text>
                    </View>
                    <View style={styles.scorePill}>
                      <Text style={styles.scorePillText}>{Math.round(attempt.score ?? 0)}%</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.emptyText}>Chon mot practice set de xem chi tiet.</Text>
        )}
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  attemptList: {
    marginTop: spacing.lg,
  },
  attemptMain: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  attemptRow: {
    alignItems: "center",
    backgroundColor: "#F5F8FF",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  attemptSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  attemptTitle: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
  blockTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  detailCard: {
    marginBottom: spacing.lg,
  },
  detailText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
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
  headerCard: {
    marginBottom: spacing.lg,
  },
  headerText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  headerTitle: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
  },
  inlineLoading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  inlineLoadingText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  listCard: {
    marginBottom: spacing.lg,
  },
  loadingWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginTop: spacing.lg,
    paddingVertical: 15,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  scorePill: {
    backgroundColor: "#E3FFDE",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  scorePillText: {
    color: "#1A7C2B",
    fontSize: 12,
    fontWeight: "900",
  },
  setBody: {
    flex: 1,
  },
  setIcon: {
    alignItems: "center",
    backgroundColor: "#E9EDFA",
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  setMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  setRow: {
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  setRowActive: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  setTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  statBadge: {
    alignItems: "center",
    backgroundColor: "#EFF4FD",
    borderRadius: radius.lg,
    flex: 1,
    paddingVertical: spacing.md,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  statValue: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
