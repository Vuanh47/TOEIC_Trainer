import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { pushRoute } from "@/src/utils/navigation";

export default function PathCompleteScreen() {
  return (
    <UserScreen contentStyle={styles.content}>
      <SurfaceCard style={styles.heroCard}>
        <View style={styles.iconWrap}>
          <Ionicons color={colors.surface} name="trophy-outline" size={40} />
        </View>

        <Text style={styles.title}>Chuc mung ban da hoan thanh lo trinh</Text>
        <Text style={styles.subtitle}>
          Toan bo roadmap da duoc hoan tat. Ban co the quay lai trang home de chon lo trinh moi hoac vao
          practice de xem lai tien do.
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>100%</Text>
            <Text style={styles.badgeLabel}>Tien do</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>DONE</Text>
            <Text style={styles.badgeLabel}>Trang thai</Text>
          </View>
        </View>

        <View style={styles.actionCol}>
          <Pressable onPress={() => pushRoute("/user/home")} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Ve trang home</Text>
          </Pressable>
          <Pressable onPress={() => pushRoute("/user/practice")} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Xem roadmap practice</Text>
          </Pressable>
        </View>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  actionCol: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: "100%",
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flex: 1,
    padding: spacing.md,
  },
  badgeLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
    width: "100%",
  },
  badgeValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900",
  },
  content: {
    justifyContent: "center",
  },
  heroCard: {
    alignItems: "center",
    backgroundColor: "#F8FBFF",
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    height: 88,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 88,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },
  title: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    textAlign: "center",
  },
});
