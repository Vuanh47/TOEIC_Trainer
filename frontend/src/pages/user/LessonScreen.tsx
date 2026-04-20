import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { pushRoute } from "@/src/utils/navigation";

export default function LessonScreen() {
  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={<Ionicons color={colors.primaryDark} name="person-circle" size={42} />}
        title="TOEIC Part 1 Instructions"
      />

      <SurfaceCard style={styles.videoCard}>
        <View style={styles.videoHero}>
          <ProgressBar accentColor={colors.primary} value={36} />
          <View style={styles.videoControls}>
            <Pressable style={styles.controlButton}>
              <Ionicons color={colors.surface} name="play" size={22} />
            </Pressable>
            <View style={styles.nowPlaying}>
              <Ionicons color={colors.surface} name="mic-outline" size={16} />
              <Text style={styles.nowPlayingText}>Tap to add a note</Text>
            </View>
            <Pressable onPress={() => pushRoute("/user/notebook")} style={styles.controlButton}>
              <Ionicons color={colors.surface} name="document-text-outline" size={22} />
            </Pressable>
          </View>
        </View>
      </SurfaceCard>

      <View style={styles.segmentTabs}>
        <Text style={[styles.segmentTab, styles.segmentTabActive]}>Tong quan</Text>
        <Text style={styles.segmentTab}>Ghi chu cua ban</Text>
      </View>

      {[
        "Chu y thay dong tu dang dien ra va loai bo dap an mo ta boi canh sai.",
        "Cac truong hop can nho: vi tri, trang thai va hanh dong theo thu tu uu tien.",
        "Mot guest voi tips: gap tu location thi uu tien xet object trong anh.",
      ].map((text, index) => (
        <View key={index} style={styles.noteRow}>
          <View style={styles.noteTag}>
            <Text style={styles.noteTagText}>00:{index + 2}8</Text>
          </View>
          <Text style={styles.noteBody}>{text}</Text>
        </View>
      ))}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  controlButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.pill,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  noteBody: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    lineHeight: 30,
  },
  noteRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  noteTag: {
    backgroundColor: "#EEF1FF",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  noteTagText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  nowPlaying: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  nowPlayingText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "700",
  },
  segmentTab: {
    color: "#9FA6B8",
    fontSize: 18,
    fontWeight: "700",
  },
  segmentTabActive: {
    color: colors.primaryDark,
    textDecorationLine: "underline",
  },
  segmentTabs: {
    flexDirection: "row",
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  videoCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  videoControls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  videoHero: {
    backgroundColor: "#364968",
    borderRadius: radius.lg,
    gap: spacing.lg,
    minHeight: 220,
    padding: spacing.md,
  },
});
