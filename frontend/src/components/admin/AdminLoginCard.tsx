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
    backgroundColor: '#101A2C',
    borderColor: '#2A3850',
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
