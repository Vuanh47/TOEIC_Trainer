import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import SectionTitle from "@/src/components/user/SectionTitle";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import { notebookEntries, userProfile } from "@/src/pages/user/mock-data";
import { logout } from "@/src/services/auth.service";
import { getMyProfile, updateMyTargetScore } from "@/src/services/user.service";
import { pushRoute } from "@/src/utils/navigation";

export default function ProfileScreen() {
  const { auth, signOut } = useAuth();
  const [targetScore, setTargetScore] = useState<number>(userProfile.targetScore);
  const [fullName, setFullName] = useState<string>(userProfile.fullName);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!auth.accessToken) return;

    async function loadProfile() {
      if (!auth.accessToken) return;
      try {
        const response = await getMyProfile(auth.accessToken);
        setTargetScore(response.data.targetScore);
        setFullName(response.data.fullName);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Khong the tai thong tin ca nhan.";
        Alert.alert("Profile", message);
      }
    }

    loadProfile();
  }, [auth.accessToken]);

  const increaseTarget = async () => {
    if (!auth.accessToken) return;
    const nextTarget = Math.min(targetScore + 5, 990);
    try {
      const response = await updateMyTargetScore(auth.accessToken, nextTarget);
      setTargetScore(response.data.targetScore);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Khong the cap nhat muc tieu.";
      Alert.alert("Profile", message);
    }
  };

  const handleLogout = async () => {
    if (!auth.accessToken || loggingOut) return;

    try {
      setLoggingOut(true);
      await logout(auth.accessToken, auth.tokenType ?? "Bearer");
    } catch {
      // best-effort call to backend logout
    } finally {
      signOut();
      setLoggingOut(false);
      router.replace("/");
    }
  };

  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label="A" />}
        title="Academic Concierge"
      />

      <Text style={styles.eyebrow}>LUMINA LEXICON</Text>
      <Text style={styles.title}>{fullName}</Text>
      <Text style={styles.subtitle}>
        Your personalized collection of linguistic insights and recurring challenges.
      </Text>

      <View style={styles.collectionStack}>
        <SurfaceCard style={styles.collectionCard}>
          <View style={styles.collectionBadgeRow}>
            <View style={[styles.collectionIcon, { backgroundColor: "#F1F3FA" }]}>
              <Ionicons color={colors.primaryDark} name="star" size={18} />
            </View>
            <View style={[styles.countPill, { backgroundColor: "#92F37F" }]}>
              <Text style={styles.countText}>12 Items</Text>
            </View>
          </View>
          <Text style={styles.collectionTitle}>Hay sai o day</Text>
          <Text style={styles.collectionDesc}>
            Common pitfalls and tricky grammatical structures found in Part 5 & 6.
          </Text>
        </SurfaceCard>

        <SurfaceCard style={styles.collectionCard}>
          <View style={styles.collectionBadgeRow}>
            <View style={[styles.collectionIcon, { backgroundColor: "#DDFBDD" }]}>
              <Ionicons color={colors.text} name="book-outline" size={20} />
            </View>
            <View style={[styles.countPill, { backgroundColor: "#D9E0FF" }]}>
              <Text style={styles.countText}>8 Items</Text>
            </View>
          </View>
          <Text style={styles.collectionTitle}>On truoc ngay thi</Text>
          <Text style={styles.collectionDesc}>
            Critical tips and vocabulary lists for high-speed review sessions.
          </Text>
        </SurfaceCard>
      </View>

      <SectionTitle
        actionLabel="Sap xep"
        onActionPress={() => pushRoute("/user/notebook")}
        title="Tat ca muc da luu"
      />
      {notebookEntries.map((entry) => (
        <Pressable
          key={entry.id}
          onPress={() => pushRoute("/user/notebook")}
          style={styles.noteItem}
        >
          <Ionicons color="#B7BCCB" name="reorder-three-outline" size={18} />
          <View style={styles.noteContent}>
            <View style={styles.noteHeader}>
              <View style={styles.noteCategory}>
                <Text style={styles.noteCategoryText}>{entry.category}</Text>
              </View>
              <Text style={styles.noteDate}>{entry.createdAt}</Text>
            </View>
            <Text style={styles.noteTitle}>{entry.title}</Text>
          </View>
        </Pressable>
      ))}

      <Pressable onPress={() => pushRoute("/user/notebook")} style={styles.addButton}>
        <Text style={styles.addButtonText}>THEM GHI CHU MOI</Text>
      </Pressable>

      <SurfaceCard style={styles.statsCard}>
        <Text style={styles.statsTitle}>Profile snapshot</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Target score</Text>
          <Pressable onPress={increaseTarget}>
            <Text style={styles.statsValue}>{targetScore}</Text>
          </Pressable>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Study streak</Text>
          <Text style={styles.statsValue}>{userProfile.streakDays} ngay</Text>
        </View>
        <Pressable
          disabled={loggingOut}
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed ? styles.logoutButtonPressed : null,
            loggingOut ? styles.logoutButtonDisabled : null,
          ]}
        >
          <Ionicons color="#FDECEC" name="log-out-outline" size={18} />
          <Text style={styles.logoutText}>
            {loggingOut ? "Dang xu ly..." : "Dang xuat"}
          </Text>
        </Pressable>
      </SurfaceCard>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  collectionBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  collectionCard: {
    marginBottom: spacing.lg,
  },
  collectionDesc: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  collectionIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  collectionStack: {
    marginBottom: spacing.xl,
  },
  collectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  countPill: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  countText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2.2,
    marginBottom: spacing.sm,
  },
  noteCategory: {
    backgroundColor: "#D2F2C8",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  noteCategoryText: {
    color: "#1A7C2B",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  noteContent: {
    flex: 1,
  },
  noteDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  noteHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  noteItem: {
    alignItems: "flex-start",
    backgroundColor: "rgba(241,243,252,0.96)",
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  logoutButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#C44C4C",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  logoutButtonDisabled: {
    opacity: 0.78,
  },
  logoutButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  logoutText: {
    color: "#FDECEC",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  statsCard: {
    marginTop: spacing.xl,
  },
  statsLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  statsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  statsValue: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 44,
    marginBottom: spacing.md,
  },
});
