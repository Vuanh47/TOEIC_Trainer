import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';

export default function AdminLoginCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Ionicons color={colors.primaryDark} name="shield-checkmark" size={18} />
        <Text style={styles.badgeText}>TOEIC_trainer Admin</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(242,177,93,0.28)',
    borderWidth: 1,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderRadius: radius.xl,
    maxWidth: 460,
    padding: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 34,
    width: '100%',
  },
});
