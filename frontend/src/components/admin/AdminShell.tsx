import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/src/assets/styles/theme';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundBand} />
      <View style={styles.backgroundPanel} />
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowSecondary} />
      <View style={styles.accentLine} />
      <View style={styles.page}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 28,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  accentLine: {
    backgroundColor: '#22C7A9',
    height: 3,
    left: 28,
    opacity: 0.9,
    position: 'absolute',
    right: 28,
    top: 0,
  },
  backgroundBand: {
    backgroundColor: '#0C1A2F',
    height: 250,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  backgroundGlow: {
    backgroundColor: 'rgba(89,166,255,0.12)',
    borderRadius: 240,
    height: 260,
    left: -100,
    position: 'absolute',
    top: 70,
    width: 260,
  },
  backgroundGlowSecondary: {
    backgroundColor: 'rgba(34,199,169,0.1)',
    borderRadius: 240,
    height: 240,
    position: 'absolute',
    right: -80,
    top: 180,
    width: 240,
  },
  backgroundPanel: {
    backgroundColor: 'rgba(8,17,31,0.76)',
    borderBottomColor: '#1B2C45',
    borderBottomWidth: 1,
    height: 160,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 250,
  },
});
