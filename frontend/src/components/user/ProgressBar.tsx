import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";

type ProgressBarProps = {
  label?: string;
  value: number;
  rightLabel?: string;
  accentColor?: string;
};

export default function ProgressBar({
  label,
  value,
  rightLabel,
  accentColor = colors.primary,
}: ProgressBarProps) {
  return (
    <View>
      {label || rightLabel ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
        </View>
      ) : null}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { backgroundColor: accentColor, width: `${Math.max(0, Math.min(100, value))}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    borderRadius: radius.pill,
    height: "100%",
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  rightLabel: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },
  track: {
    backgroundColor: "#E7EAF6",
    borderRadius: radius.pill,
    height: 10,
    overflow: "hidden",
  },
});
