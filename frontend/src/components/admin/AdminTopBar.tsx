import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';

type AdminTopBarProps = {
  adminName: string;
};

export default function AdminTopBar({ adminName }: AdminTopBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons color={colors.primary} name="book" size={24} />
        </View>
        <Text style={styles.title}>LinguaLeap Pro Admin Dashboard</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.iconButton}>
          <Ionicons color={colors.textMuted} name="notifications-outline" size={22} />
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{adminName.charAt(0)}</Text>
        </View>
        <Ionicons color={colors.textMuted} name="chevron-down" size={18} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#EEF3F9',
    borderColor: '#D7E0EB',
    borderWidth: 1,
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  avatarText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: 4,
    paddingVertical: spacing.sm,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  logoBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '500',
  },
});
