import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/src/assets/styles/theme";

type UserScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
};

export default function UserScreen({
  children,
  scrollable = true,
  contentStyle,
}: UserScreenProps) {
  const body = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.mesh} />
      {scrollable ? (
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 128,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  glowBottom: {
    backgroundColor: "rgba(78, 227, 109, 0.08)",
    borderRadius: 220,
    bottom: 120,
    height: 240,
    position: "absolute",
    right: -100,
    width: 240,
  },
  glowTop: {
    backgroundColor: "rgba(36,87,166,0.08)",
    borderRadius: 260,
    height: 260,
    left: -110,
    position: "absolute",
    top: 90,
    width: 260,
  },
  mesh: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 40,
    bottom: 60,
    left: 12,
    position: "absolute",
    right: 12,
    top: 12,
  },
  safeArea: {
    backgroundColor: "#F7F7FD",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
