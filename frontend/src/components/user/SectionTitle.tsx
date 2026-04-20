import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/src/assets/styles/theme";

type SectionTitleProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionTitle({
  title,
  actionLabel,
  onActionPress,
}: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onActionPress}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    paddingRight: spacing.md,
  },
});
