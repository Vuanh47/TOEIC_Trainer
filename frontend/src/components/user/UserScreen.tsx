import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";

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
      <View style={styles.topBand} />
      <View style={styles.topPanel} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.glowAccent} />
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
    paddingBottom: 156,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  glowBottom: {
    backgroundColor: "rgba(224, 138, 46, 0.14)",
    borderRadius: 220,
    bottom: 140,
    height: 260,
    position: "absolute",
    right: -100,
    width: 260,
  },
  glowAccent: {
    backgroundColor: "rgba(15,107,98,0.1)",
    borderRadius: 240,
    height: 220,
    left: "50%",
    marginLeft: -110,
    position: "absolute",
    top: 160,
    width: 220,
  },
  glowTop: {
    backgroundColor: "rgba(15,107,98,0.12)",
    borderRadius: 260,
    height: 290,
    left: -90,
    position: "absolute",
    top: 80,
    width: 290,
  },
  mesh: {
    backgroundColor: "rgba(255,253,248,0.8)",
    borderColor: "rgba(191,181,159,0.56)",
    borderRadius: radius.xl,
    borderWidth: 1,
    bottom: 60,
    left: 12,
    position: "absolute",
    right: 12,
    top: 12,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBand: {
    backgroundColor: "#EDE4D2",
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 64,
    height: 220,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  topPanel: {
    backgroundColor: "rgba(255,255,255,0.34)",
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
    height: 260,
    left: 20,
    position: "absolute",
    right: 20,
    top: 18,
  },
});
