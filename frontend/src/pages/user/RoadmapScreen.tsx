import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { pushRoute } from "@/src/utils/navigation";

export default function RoadmapScreen() {
  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => router.back()}
        rightSlot={
          <View style={styles.rightIcons}>
            <Pressable onPress={() => pushRoute("/user/notebook")} style={styles.topAction}>
              <Ionicons color={colors.primaryDark} name="bookmark" size={20} />
            </Pressable>
            <Pressable onPress={() => pushRoute("/user/profile")} style={styles.topActionSoft}>
              <Ionicons color="#E4A58C" name="pause" size={20} />
            </Pressable>
          </View>
        }
        subtitle="B1 • Intermediate"
        title="Academic Concierge"
      />

      <View style={styles.tag}>
        <Text style={styles.tagText}>GRAMMAR FOCUS</Text>
      </View>
      <Text style={styles.title}>Cau bi dong (Passive Voice)</Text>
      <Text style={styles.subtitle}>
        Passive voice represents a focus on the action rather than the subject.
        It is highly frequent in TOEIC Reading Part 5 and Part 6.
      </Text>

      <SurfaceCard style={styles.formulaCard}>
        <Text style={styles.formulaBadge}>fx Cau truc (Formula)</Text>
        <View style={styles.formulaBox}>
          <Text style={styles.formulaText}>S + had + V3/ed + before + S + V2/ed</Text>
        </View>
        <Text style={styles.formulaDesc}>
          Su dung de dien ta mot hanh dong da hoan thanh truoc mot thoi diem hoac hanh
          dong khac trong qua khu.
        </Text>
      </SurfaceCard>

      <SurfaceCard style={styles.exampleCard}>
        <View style={styles.exampleHeader}>
          <Ionicons color={colors.text} name="bulb-outline" size={18} />
          <Text style={styles.exampleTitle}>Vi du minh hoa</Text>
        </View>

        <View style={styles.exampleBubble}>
          <Text style={styles.exampleSentence}>
            &quot;The report <Text style={styles.highlight}>had been submitted</Text> by the
            manager <Text style={styles.highlight}>before</Text> the deadline{" "}
            <Text style={styles.highlight}>passed</Text>.&quot;
          </Text>
          <Text style={styles.exampleTranslation}>
            Ban bao cao da duoc nop boi quan ly truoc khi han chot ket thuc.
          </Text>
        </View>

        <View style={styles.exampleBubble}>
          <Text style={styles.exampleSentence}>
            &quot;All staff <Text style={styles.highlight}>had left</Text> the office{" "}
            <Text style={styles.highlight}>before</Text> the power{" "}
            <Text style={styles.highlight}>went out</Text>.&quot;
          </Text>
          <Text style={styles.exampleTranslation}>
            Tat ca nhan vien da roi van phong truoc khi dien bi ngat.
          </Text>
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.noteCard}>
        <View style={styles.noteIcon}>
          <Ionicons color={colors.surface} name="warning" size={22} />
        </View>
        <View style={styles.noteBody}>
          <Text style={styles.noteTitle}>Luu y quan trong (Note)</Text>
          <Text style={styles.noteText}>
            Trong de thi TOEIC, hay can than voi cac noi dong tu (intransitive
            verbs) nhu happen, occur, rise, fall. Nhung tu nay khong bao gio duoc
            chia o dang bi dong.
          </Text>
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.progressCard}>
        <View style={styles.progressRing}>
          <Text style={styles.progressRingText}>75%</Text>
        </View>
        <View>
          <Text style={styles.progressTitle}>Tien do bai hoc</Text>
          <Text style={styles.progressSubtitle}>MASTERY LEVEL: SILVER</Text>
          <Text style={styles.progressMeta}>Du kien hoan thanh: 5 phut</Text>
        </View>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  exampleBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  exampleCard: {
    marginBottom: spacing.xl,
  },
  exampleHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  exampleSentence: {
    color: colors.text,
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 34,
    marginBottom: spacing.md,
  },
  exampleTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  exampleTranslation: {
    color: colors.text,
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 28,
  },
  formulaBadge: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  formulaBox: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
    borderWidth: 2,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  formulaCard: {
    backgroundColor: "#AFC4FF",
    marginBottom: spacing.xl,
  },
  formulaDesc: {
    color: colors.primaryDark,
    fontSize: 16,
    lineHeight: 26,
  },
  formulaText: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  highlight: {
    color: colors.primaryDark,
    fontWeight: "900",
  },
  noteBody: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: "#FFF0F0",
    borderLeftColor: "#D32020",
    borderLeftWidth: 6,
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  noteIcon: {
    alignItems: "center",
    backgroundColor: "#D32020",
    borderRadius: radius.pill,
    height: 42,
    justifyContent: "center",
    marginTop: 2,
    width: 42,
  },
  noteText: {
    color: "#9A1F1F",
    fontSize: 16,
    lineHeight: 28,
  },
  noteTitle: {
    color: "#C52727",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  progressCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  progressMeta: {
    color: colors.text,
    fontSize: 14,
    marginTop: spacing.md,
  },
  progressRing: {
    alignItems: "center",
    borderColor: "#47D764",
    borderRadius: radius.pill,
    borderTopColor: "#CDE7D1",
    borderWidth: 6,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  progressRingText: {
    color: "#1A7C2B",
    fontSize: 16,
    fontWeight: "900",
  },
  progressSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  progressTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  rightIcons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  tagText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: spacing.lg,
  },
  topAction: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  topActionSoft: {
    alignItems: "center",
    backgroundColor: "#FCE0D0",
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});
