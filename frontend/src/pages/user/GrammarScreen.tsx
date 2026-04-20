import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { pushRoute } from "@/src/utils/navigation";

export default function GrammarScreen() {
  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<Ionicons color={colors.primaryDark} name="person-circle" size={42} />}
        title="Academic Concierge"
      />

      <Text style={styles.levelLabel}>CURRENT FOCUS</Text>
      <Text style={styles.title}>Unit 3: Active Voices</Text>
      <Text style={styles.subtitle}>
        Di qua lo trinh ngu phap, video huong dan va bo note ca nhan trong mot
        man hinh danh rieng cho user.
      </Text>

      <SurfaceCard style={styles.heroCard}>
        <Text style={styles.heroCardTitle}>Course progress</Text>
        <ProgressBar accentColor={colors.primary} rightLabel="45%" value={45} />
        <View style={styles.unitList}>
          {[
            { done: true, label: "Nouns & Pronouns" },
            { done: true, label: "Sentence Structure" },
            { current: true, label: "Active Voices" },
            { label: "Prepositions", locked: true },
          ].map((unit) => (
            <View key={unit.label} style={styles.unitRow}>
              <View
                style={[
                  styles.unitDot,
                  unit.done ? styles.unitDotDone : null,
                  unit.current ? styles.unitDotCurrent : null,
                  unit.locked ? styles.unitDotLocked : null,
                ]}
              >
                <Ionicons
                  color={unit.current || unit.done ? colors.surface : "#AAB1C4"}
                  name={
                    unit.done
                      ? "checkmark"
                      : unit.current
                        ? "play"
                        : "lock-closed-outline"
                  }
                  size={14}
                />
              </View>
              <Text
                style={[
                  styles.unitLabel,
                  unit.locked ? styles.unitLabelLocked : null,
                ]}
              >
                {unit.label}
              </Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={styles.actionIcon}>
            <Ionicons color={colors.primaryDark} name="book-outline" size={22} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Roadmap & Formula</Text>
            <Text style={styles.actionDesc}>
              Doc cong thuc, vi du va canh bao de xu ly ngu phap nhanh hon.
            </Text>
          </View>
        </View>
        <Pressable onPress={() => pushRoute("/user/roadmap")} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Mo bai hoc</Text>
        </Pressable>
      </SurfaceCard>

      <SurfaceCard style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={[styles.actionIcon, { backgroundColor: "#DBF0FF" }]}>
            <Ionicons color={colors.primaryDark} name="play-circle-outline" size={22} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Video lesson & notes</Text>
            <Text style={styles.actionDesc}>
              Xem video, transcript va mo note bottom sheet de luu nhanh.
            </Text>
          </View>
        </View>
        <View style={styles.dualActions}>
          <Pressable onPress={() => pushRoute("/user/lesson")} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Xem video</Text>
          </Pressable>
          <Pressable onPress={() => pushRoute("/user/notebook")} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Mo ghi chu</Text>
          </Pressable>
        </View>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  actionBody: {
    flex: 1,
  },
  actionCard: {
    marginBottom: spacing.lg,
  },
  actionDesc: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 4,
  },
  actionIcon: {
    alignItems: "center",
    backgroundColor: "#E8EDFF",
    borderRadius: radius.pill,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  dualActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroCardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md,
    textTransform: "uppercase",
  },
  levelLabel: {
    color: "#1A7C2B",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 16,
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
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  unitDot: {
    alignItems: "center",
    backgroundColor: "#BBC1D3",
    borderRadius: radius.pill,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  unitDotCurrent: {
    backgroundColor: colors.primary,
  },
  unitDotDone: {
    backgroundColor: "#24963F",
  },
  unitDotLocked: {
    backgroundColor: "#D8DCE8",
  },
  unitLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  unitLabelLocked: {
    color: "#ABB0BF",
  },
  unitList: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  unitRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
