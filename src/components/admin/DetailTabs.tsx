import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/src/assets/styles/theme';
import { AdminTabKey } from '@/src/types/admin';

type DetailTabsProps = {
  activeTab: AdminTabKey;
  onChange: (tab: AdminTabKey) => void;
};

const tabs: { key: AdminTabKey; label: string }[] = [
  { key: 'video', label: 'Video' },
  { key: 'vocabulary', label: 'Vocabulary' },
  { key: 'exercises', label: 'Exercises' },
];

export default function DetailTabs({ activeTab, onChange }: DetailTabsProps) {
  return (
    <View style={styles.row}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active ? styles.tabActive : null]}>
            <Text style={[styles.label, active ? styles.labelActive : null]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    borderBottomColor: '#E7ECF2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingBottom: 0,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    marginBottom: -1,
    paddingVertical: 14,
  },
  tabActive: {
    backgroundColor: colors.surface,
    borderBottomColor: '#1C78D0',
    borderBottomWidth: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
  },
});
