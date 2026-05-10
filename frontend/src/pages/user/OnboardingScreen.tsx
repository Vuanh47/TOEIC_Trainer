import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { goalPlans } from "@/src/pages/user/mock-data";
import { assignRecommendedPath } from "@/src/services/user.service";
import { replaceRoute } from "@/src/utils/navigation";

export default function OnboardingScreen() {
  const { auth } = useAuth();
  const [selectedGoalId, setSelectedGoalId] = useState("goal-500");
  const [submitting, setSubmitting] = useState(false);
  const selectedGoal =
    goalPlans.find((goal) => goal.id === selectedGoalId) ?? goalPlans[1];

  const handleAssignPath = async () => {
    if (!auth.accessToken) {
      replaceRoute("/");
      return;
    }

    try {
      setSubmitting(true);
      await assignRecommendedPath(auth.accessToken, {
        targetScore: selectedGoal.targetScore,
      });
      replaceRoute("/user/home");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể tạo lộ trình.";
      Alert.alert("Onboarding", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<AvatarBadge label="A" />}
        title="Cố vấn học tập"
      />

      <Text style={styles.heroTitle}>Chinh phục TOEIC theo cách chuyên biệt.</Text>
      <Text style={styles.heroSubtitle}>
        Chào mừng bạn đến với lộ trình cá nhân hóa. Hãy bắt đầu bằng việc xác định vị
        thế hiện tại của bạn để chúng tôi có thể phục vụ tốt nhất.
      </Text>

      <Pressable onPress={handleAssignPath} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>
          {submitting ? "ĐANG TẠO LỘ TRÌNH..." : "BẮT ĐẦU NGAY"}
        </Text>
      </Pressable>
      <Pressable onPress={() => replaceRoute("/user/home")}>
        <Text style={styles.linkText}>Tôi đã biết trình độ của mình</Text>
      </Pressable>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Chọn mục tiêu của bạn</Text>
        <Text style={styles.sectionHint}>Hành trình bắt đầu từ đây</Text>
      </View>

      {goalPlans.map((goal) => {
        const selected = goal.id === selectedGoalId;

        return (
          <Pressable key={goal.id} onPress={() => setSelectedGoalId(goal.id)}>
            <SurfaceCard
              style={[
                styles.goalCard,
                { borderColor: selected ? "#B9E4BE" : "rgba(255,255,255,0.7)" },
                selected ? styles.goalCardSelected : null,
              ]}
            >
              {goal.badge ? (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>{goal.badge}</Text>
                </View>
              ) : null}
              <View style={[styles.goalIcon, { backgroundColor: goal.accentColor }]}>
                <Ionicons color={colors.primaryDark} name="book-outline" size={24} />
              </View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDesc}>{goal.description}</Text>
              <View style={styles.goalFooter}>
                <View
                  style={[
                    styles.goalProgress,
                    { backgroundColor: selected ? "#24963F" : "#C7D2F8" },
                  ]}
                />
                <Text style={styles.goalLevel}>{goal.level}</Text>
              </View>
            </SurfaceCard>
          </Pressable>
        );
      })}

      <View style={styles.methodWrap}>
        <Text style={styles.methodEyebrow}>PHƯƠNG PHÁP CONCIERGE</Text>
        <Text style={styles.methodTitle}>Không chỉ là ứng dụng, đây là người thầy riêng của bạn.</Text>
        <Text style={styles.methodText}>
          Chúng tôi sử dụng thuật toán AI để phân tích điểm yếu của bạn trong từng
          Part của TOEIC, từ đó xây dựng các bài tập &quot;Flow State&quot; giúp bạn tiến bộ mà
          không thấy áp lực.
        </Text>
        <View style={styles.bulletRow}>
          <View style={styles.checkIcon}>
            <Ionicons color="#1A7C2B" name="checkmark" size={18} />
          </View>
          <Text style={styles.bulletText}>Lộ trình 1-1 không trùng lặp</Text>
        </View>
        <View style={styles.bulletRow}>
          <View style={styles.checkIcon}>
            <Ionicons color="#1A7C2B" name="checkmark" size={18} />
          </View>
          <Text style={styles.bulletText}>Kho đề thi sát thực tế nhất 2024</Text>
        </View>
      </View>

      <View style={styles.stickyBar}>
        <View style={styles.stickyInfo}>
          <Ionicons color={colors.surface} name="sparkles-outline" size={18} />
          <Text style={styles.stickyText}>
            Đã chọn: Mục tiêu {selectedGoal.targetScore}+
          </Text>
        </View>
        <Pressable onPress={handleAssignPath} style={styles.stickyButton}>
          <Text style={styles.stickyButtonText}>Tạo lộ trình cho tôi</Text>
        </Pressable>
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  bulletRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  bulletText: {
    color: colors.text,
    fontSize: 14,
  },
  checkIcon: {
    alignItems: "center",
    backgroundColor: "#A7FF9B",
    borderRadius: radius.pill,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  goalCard: {
    marginBottom: spacing.md,
    paddingTop: spacing.lg,
  },
  goalCardSelected: {
    borderWidth: 2,
    shadowOpacity: 0.18,
  },
  goalDesc: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  goalFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 54,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 54,
  },
  goalLevel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  goalProgress: {
    borderRadius: radius.pill,
    height: 4,
    width: 100,
  },
  goalTitle: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  heroTitle: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  linkText: {
    color: colors.primaryDark,
    fontSize: 15,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  methodEyebrow: {
    color: "#1A7C2B",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
  },
  methodText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 26,
  },
  methodTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  methodWrap: {
    marginTop: spacing.xl,
  },
  popularBadge: {
    alignSelf: "center",
    backgroundColor: "#1A7C2B",
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
    marginTop: -8,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  popularBadgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "900",
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  sectionHint: {
    color: "#1A7C2B",
    fontSize: 13,
    maxWidth: 100,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    maxWidth: 180,
  },
  stickyBar: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    bottom: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    left: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    position: "absolute",
    right: spacing.lg,
  },
  stickyButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  stickyButtonText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  stickyInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  stickyText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },
});
