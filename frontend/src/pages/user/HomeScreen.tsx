import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SectionTitle from "@/src/components/user/SectionTitle";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import {
  achievementCards,
  focusAreas,
  userProfile,
} from "@/src/pages/user/mock-data";
import { pushRoute } from "@/src/utils/navigation";

function CircleScore() {
  return (
    <View style={styles.circleWrap}>
      <View style={styles.circleOuter}>
        <View style={styles.circleInner}>
          <Text style={styles.circleValue}>500</Text>
          <Text style={styles.circleLabel}>/ 800 PTS</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label="A" />}
        title="Academic Concierge"
      />

      <Text style={styles.heroTitle}>{userProfile.fullName}&apos;s Dashboard</Text>
      <Text style={styles.heroSubtitle}>
        Your path to TOEIC 990 is {userProfile.completionRate}% complete.
      </Text>

      <Pressable
        onPress={() => pushRoute("/user/onboarding")}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>START DAILY DRILL</Text>
      </Pressable>

      <SurfaceCard style={styles.masteryCard}>
        <Text style={styles.cardTitle}>Overall Mastery</Text>
        <CircleScore />
        <Text style={styles.masteryFoot}>
          You&apos;ve gained <Text style={styles.emphasis}>+45 points</Text> this week.
        </Text>
        <Text style={styles.masterySub}>Keep the momentum!</Text>
      </SurfaceCard>

      <SurfaceCard style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Listening vs Reading</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primaryDark }]} />
              <Text style={styles.legendText}>Listening</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#47D764" }]} />
              <Text style={styles.legendText}>Reading</Text>
            </View>
          </View>
        </View>
        <View style={styles.barChart}>
          {[
            { label: "W1", listen: 44, read: 38 },
            { label: "W2", listen: 57, read: 52 },
            { label: "W3", listen: 68, read: 66 },
            { label: "CURRENT", listen: 78, read: 82 },
          ].map((item) => (
            <View key={item.label} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barListening, { height: `${item.listen}%` }]}
                />
                <View
                  style={[styles.barReading, { height: `${item.read}%` }]}
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <SectionTitle
        actionLabel="View All"
        onActionPress={() => pushRoute("/user/roadmap")}
        title="Milestones & Achievements"
      />
      <View style={styles.achievementGrid}>
        {achievementCards.map((item) => (
          <SurfaceCard key={item.title} style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: item.tint }]}>
              <Ionicons
                color={item.locked ? "#9A9FB0" : colors.primaryDark}
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={22}
              />
            </View>
            <Text style={[styles.achievementTitle, item.locked ? styles.lockedText : null]}>
              {item.title}
            </Text>
            <Text style={styles.achievementSubtitle}>{item.subtitle}</Text>
          </SurfaceCard>
        ))}
      </View>

      <SectionTitle title="Recent Focus Areas" />
      {focusAreas.map((area) => (
        <Pressable
          key={area.title}
          onPress={() => pushRoute("/user/grammar")}
          style={styles.focusItem}
        >
          <View style={[styles.focusIcon, { backgroundColor: area.color }]}>
            <Ionicons color={colors.primaryDark} name="trending-up-outline" size={18} />
          </View>
          <View style={styles.focusBody}>
            <Text style={styles.focusTitle}>{area.title}</Text>
            <Text style={styles.focusMeta}>
              Accuracy: {area.accuracy} ({area.tone})
            </Text>
          </View>
          <Ionicons color={colors.textMuted} name="chevron-forward" size={20} />
        </Pressable>
      ))}

      <SurfaceCard style={styles.summaryCard}>
        <Text style={styles.summaryBadge}>Concierge Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Study Hours</Text>
          <Text style={styles.summaryValue}>{userProfile.studyHours}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Mock Tests Taken</Text>
          <Text style={styles.summaryValue}>12</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Vocabulary Strength</Text>
          <Text style={styles.summaryValue}>A+</Text>
        </View>
        <ProgressBar
          accentColor="#47D764"
          label="Weekly momentum"
          rightLabel="84%"
          value={84}
        />
        <Pressable
          onPress={() => Alert.alert("Roadmap", "Ban co the noi API goi dashboard summary tai day.")}
          style={styles.summaryAction}
        >
          <Text style={styles.summaryActionText}>
            Your analytical skills are peaking. Focus on Listening Part 2 tomorrow.
          </Text>
        </Pressable>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    flexBasis: "48%",
    minHeight: 164,
    padding: spacing.md,
  },
  achievementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  achievementIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 52,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 52,
  },
  achievementSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.xs,
    textTransform: "uppercase",
  },
  achievementTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  barChart: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.md,
    height: 180,
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
  },
  barLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
  },
  barListening: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    width: 12,
  },
  barReading: {
    backgroundColor: "#47D764",
    borderRadius: radius.pill,
    width: 12,
  },
  barTrack: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 8,
    height: 140,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  chartCard: {
    marginBottom: spacing.xl,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    width: 80,
  },
  circleInner: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 114,
    justifyContent: "center",
    width: 114,
  },
  circleLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  circleOuter: {
    alignItems: "center",
    backgroundColor: "#DDE4F8",
    borderColor: "#24963F",
    borderRadius: radius.pill,
    borderTopColor: "#47D764",
    borderWidth: 8,
    height: 142,
    justifyContent: "center",
    width: 142,
  },
  circleValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900",
  },
  circleWrap: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  emphasis: {
    color: "#24963F",
    fontWeight: "900",
  },
  focusBody: {
    flex: 1,
  },
  focusIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  focusItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  focusMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  focusTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 28,
    marginBottom: spacing.lg,
    maxWidth: 260,
  },
  heroTitle: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  legendDot: {
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  legendRow: {
    gap: spacing.sm,
  },
  legendText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  lockedText: {
    color: "#9A9FB0",
  },
  masteryCard: {
    marginBottom: spacing.lg,
  },
  masteryFoot: {
    color: colors.text,
    fontSize: 13,
    textAlign: "center",
  },
  masterySub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  summaryAction: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  summaryActionText: {
    color: "#E4EDFF",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
  },
  summaryBadge: {
    color: "#C9D8FF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: spacing.md,
    textTransform: "uppercase",
  },
  summaryCard: {
    backgroundColor: colors.primaryDark,
  },
  summaryLabel: {
    color: "#DCE6FF",
    fontSize: 14,
  },
  summaryRow: {
    borderBottomColor: "rgba(255,255,255,0.12)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  summaryValue: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: "900",
  },
});
