import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { flashcards } from "@/src/pages/user/mock-data";

const REVIEW_ACTIONS = [
  { id: "again", icon: "refresh-outline", label: "QUEN", subtitle: "LAP LAI SOM" },
  { id: "hard", icon: "hourglass-outline", label: "KHO", subtitle: "NGAY MAI" },
  { id: "easy", icon: "play-forward-outline", label: "DE", subtitle: "4 NGAY NUA" },
] as const;

export default function CardsScreen() {
  const [cardIndex, setCardIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const currentCard = flashcards[cardIndex];

  const handleRateCard = (actionId: string) => {
    Alert.alert("Flashcard action", `Ban da chon: ${actionId}`);
    setShowMeaning(false);
    setCardIndex((current) => (current + 1) % flashcards.length);
  };

  return (
    <UserScreen>
      <AppHeader
        rightSlot={<AvatarBadge label="A" />}
        title="Academic Concierge"
      />

      <Text style={styles.eyebrow}>CURRENT SESSION</Text>
      <View style={styles.titleRow}>
        <Text style={styles.title}>TOEIC Vocabulary Mastery</Text>
        <View style={styles.progressBlock}>
          <Text style={styles.progressValue}>{currentCard.progressLabel}</Text>
          <ProgressBar accentColor="#2EB84B" value={44} />
        </View>
      </View>

      <Pressable onPress={() => setShowMeaning((current) => !current)}>
        <SurfaceCard style={styles.flashcard}>
          <View style={styles.flashcardBadge}>
            <Text style={styles.flashcardBadgeText}>NEW WORD</Text>
          </View>
          <Text style={styles.word}>{currentCard.word}</Text>

          <View style={styles.pronunciationRow}>
            <Text style={styles.pronunciation}>{currentCard.phonetic}</Text>
            <Pressable
              onPress={() => Alert.alert("Audio", `Phat am tu: ${currentCard.word}`)}
              style={styles.audioButton}
            >
              <Ionicons color={colors.primary} name="volume-high" size={22} />
            </Pressable>
          </View>

          <View style={styles.meaningBody}>
            {showMeaning ? (
              <>
                <Text style={styles.meaningLabel}>Meaning</Text>
                <Text style={styles.meaningText}>{currentCard.meaning}</Text>
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.exampleText}>{currentCard.example}</Text>
              </>
            ) : (
              <View style={styles.tapHintWrap}>
                <Ionicons color={colors.textMuted} name="hand-left-outline" size={18} />
                <Text style={styles.tapHint}>Tap card to see meaning</Text>
              </View>
            )}
          </View>
        </SurfaceCard>
      </Pressable>

      <View style={styles.reviewGrid}>
        {REVIEW_ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => handleRateCard(action.id)}
            style={styles.reviewCard}
          >
            <View style={styles.reviewIcon}>
              <Ionicons color={colors.text} name={action.icon} size={24} />
            </View>
            <Text style={styles.reviewTitle}>{action.label}</Text>
            <Text style={styles.reviewSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  audioButton: {
    alignItems: "center",
    backgroundColor: "#EFF2FF",
    borderRadius: radius.pill,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  eyebrow: {
    color: colors.text,
    fontSize: 12,
    letterSpacing: 3.2,
    marginBottom: spacing.sm,
  },
  exampleLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  exampleText: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 28,
  },
  flashcard: {
    alignItems: "center",
    minHeight: 620,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  flashcardBadge: {
    backgroundColor: "#E9ECFA",
    borderRadius: radius.pill,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  flashcardBadgeText: {
    color: colors.text,
    fontSize: 13,
    letterSpacing: 2,
  },
  meaningBody: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: spacing.xl,
    width: "100%",
  },
  meaningLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  meaningText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  pronunciation: {
    color: "#5F84CA",
    fontSize: 24,
  },
  pronunciationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  progressBlock: {
    flex: 1,
    maxWidth: 290,
  },
  progressValue: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.sm,
    textAlign: "right",
  },
  reviewCard: {
    alignItems: "center",
    backgroundColor: "rgba(241,243,252,0.92)",
    borderRadius: radius.lg,
    flex: 1,
    minHeight: 180,
    padding: spacing.md,
  },
  reviewGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  reviewIcon: {
    alignItems: "center",
    backgroundColor: "#E7E9F4",
    borderRadius: radius.pill,
    height: 74,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 74,
  },
  reviewSubtitle: {
    color: "#8B8E9F",
    fontSize: 11,
    fontWeight: "800",
    marginTop: spacing.xs,
    textAlign: "center",
  },
  reviewTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  tapHint: {
    color: colors.text,
    fontSize: 14,
  },
  tapHintWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
  },
  titleRow: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  word: {
    color: colors.text,
    fontSize: 68,
    fontWeight: "900",
    lineHeight: 72,
    marginBottom: spacing.xl,
    marginTop: spacing.xxl,
    textAlign: "center",
  },
});
