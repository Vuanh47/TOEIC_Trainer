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
        <Ionicons color={colors.accent} name="shield-checkmark" size={18} />
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
    borderColor: '#257D74',
    borderWidth: 1,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  badgeText: {
    color: '#B8FFF4',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: 'rgba(15,27,49,0.94)',
    borderColor: '#2D496B',
    borderWidth: 1,
    borderRadius: radius.xl,
    maxWidth: 460,
    padding: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.22,
    shadowRadius: 40,
    width: '100%',
  },
});
