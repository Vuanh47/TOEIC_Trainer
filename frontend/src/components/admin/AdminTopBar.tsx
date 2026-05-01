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
          <Ionicons color={colors.surface} name="school" size={22} />
        </View>
        <View>
          <Text style={styles.eyebrow}>TOEIC Trainer</Text>
          <Text style={styles.title}>Admin Console</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Live API</Text>
        </View>
        <View style={styles.divider} />
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
    backgroundColor: '#172235',
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  bar: {
    alignItems: 'center',
    backgroundColor: '#101A2C',
    borderColor: '#293850',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.24,
    shadowRadius: 42,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  logoBadge: {
    alignItems: 'center',
    backgroundColor: '#203A61',
    borderColor: '#3C72B9',
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    width: 44,
  },
  statusBadge: {
    alignItems: 'center',
    backgroundColor: '#0F3938',
    borderColor: '#257D74',
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusDot: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 7,
    width: 7,
  },
  statusText: {
    color: '#6EE7D8',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  divider: {
    backgroundColor: colors.border,
    height: 26,
    width: 1,
  },
});
