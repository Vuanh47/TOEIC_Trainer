import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onLeftPress?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightSlot?: ReactNode;
};

export default function AppHeader({
  title,
  subtitle,
  onLeftPress,
  leftIcon = "menu-outline",
  rightSlot,
}: AppHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <Pressable onPress={onLeftPress} style={styles.iconButton}>
          <Ionicons color={colors.primaryDark} name={leftIcon} size={24} />
        </Pressable>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightSlot}
    </View>
  );
}

export function AvatarBadge({ label = "A" }: { label?: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: "#0F1E45",
    borderRadius: radius.pill,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900",
  },
  iconButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginLeft: -10,
    width: 40,
  },
  leftSection: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  subtitle: {
    color: "#2E8B39",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
  },
});
