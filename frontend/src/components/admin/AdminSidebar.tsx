import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '@/src/assets/styles/theme';
import { AdminSidebarItem } from '@/src/types/admin';

type AdminSidebarProps = {
  activeItemId: string;
  items: AdminSidebarItem[];
  onSelect: (id: string) => void;
};

export default function AdminSidebar({
  activeItemId,
  items,
  onSelect,
}: AdminSidebarProps) {
  return (
    <View style={styles.sidebar}>
      {items.map((item) => {
        const active = item.id === activeItemId;

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[styles.item, active ? styles.itemActive : null]}>
            <Ionicons
              color={active ? colors.primary : colors.text}
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={22}
            />
            <Text style={[styles.label, active ? styles.labelActive : null]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  itemActive: {
    backgroundColor: '#F6FAFF',
    borderColor: '#D9E9FB',
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  sidebar: {
    backgroundColor: '#EFF4FA',
    borderColor: '#DCE5EF',
    borderWidth: 1,
    borderRadius: 20,
    gap: 8,
    minWidth: 238,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
});
