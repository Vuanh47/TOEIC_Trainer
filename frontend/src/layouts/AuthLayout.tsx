import { ReactNode } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/src/assets/styles/theme';

type AuthLayoutProps = {
  children: ReactNode;
  compact?: boolean;
  scrollable?: boolean;
};

export default function AuthLayout({
  children,
  compact = false,
  scrollable = true,
}: AuthLayoutProps) {
  const content = (
    <View style={[styles.card, compact ? styles.cardCompact : null]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundTop} />
      <View style={styles.backgroundMid} />
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowSecondary} />

      {scrollable ? (
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <View style={styles.content}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundGlow: {
    backgroundColor: 'rgba(242,177,93,0.24)',
    borderRadius: 220,
    height: 260,
    position: 'absolute',
    right: -90,
    top: 72,
    width: 260,
  },
  backgroundGlowSecondary: {
    backgroundColor: 'rgba(36,87,166,0.08)',
    borderRadius: 240,
    height: 240,
    left: -110,
    position: 'absolute',
    top: 200,
    width: 240,
  },
  backgroundMid: {
    backgroundColor: colors.backgroundStrong,
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    height: 280,
    left: 20,
    opacity: 0.5,
    position: 'absolute',
    right: 20,
    top: 34,
  },
  backgroundTop: {
    backgroundColor: '#DCE7F8',
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    height: 250,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.xl,
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 34,
  },
  cardCompact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
