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
    backgroundColor: 'rgba(201, 176, 138, 0.2)',
    borderRadius: 220,
    height: 260,
    position: 'absolute',
    right: -90,
    top: 72,
    width: 260,
  },
  backgroundGlowSecondary: {
    backgroundColor: 'rgba(86, 120, 176, 0.12)',
    borderRadius: 240,
    height: 240,
    left: -110,
    position: 'absolute',
    top: 200,
    width: 240,
  },
  backgroundMid: {
    backgroundColor: '#BECBE3',
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    height: 280,
    left: 20,
    opacity: 0.55,
    position: 'absolute',
    right: 20,
    top: 34,
  },
  backgroundTop: {
    backgroundColor: '#D7E0F0',
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    height: 250,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderColor: '#E8EEF8',
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
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
    backgroundColor: '#E9EFFA',
    flex: 1,
  },
});
