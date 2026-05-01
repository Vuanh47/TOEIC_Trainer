import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "@/src/assets/styles/theme";
import { AdminSidebarItem } from "@/src/types/admin";

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
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarEyebrow}>Workspace</Text>
        <Text style={styles.sidebarTitle}>Operations</Text>
      </View>
      {items.map((item) => {
        const active = item.id === activeItemId;

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[styles.item, active ? styles.itemActive : null]}
          >
            {active ? <View style={styles.activeRail} /> : null}
            <View
              style={[styles.iconWrap, active ? styles.iconWrapActive : null]}
            >
              <Ionicons
                color={active ? colors.text : colors.textMuted}
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={18}
              />
            </View>
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
  activeRail: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    bottom: 10,
    left: 0,
    position: "absolute",
    top: 10,
    width: 3,
  },
  item: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  itemActive: {
    backgroundColor: "#1B2940",
    borderColor: "#405C82",
    borderWidth: 1,
    shadowColor: "rgba(96,165,250,0.18)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 22,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#1A263A",
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  iconWrapActive: {
    backgroundColor: "#2F6EA8",
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  labelActive: {
    color: colors.text,
    fontWeight: "900",
  },
  sidebar: {
    backgroundColor: "#0B1220",
    borderColor: "#243148",
    borderWidth: 1,
    borderRadius: 18,
    gap: 6,
    minWidth: 258,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 38,
  },
  sidebarEyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  sidebarHeader: {
    borderBottomColor: "#223047",
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingBottom: 14,
    paddingTop: 6,
  },
  sidebarTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3,
  },
});
