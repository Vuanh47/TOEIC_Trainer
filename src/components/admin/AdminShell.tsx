import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/src/assets/styles/theme';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundBand} />
      <View style={styles.backgroundPanel} />
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
    backgroundColor: '#35D0C2',
    height: 2,
    left: 28,
    opacity: 0.9,
    position: 'absolute',
    right: 28,
    top: 0,
  },
  backgroundBand: {
    backgroundColor: '#0E1728',
    height: 226,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  backgroundPanel: {
    backgroundColor: '#0B1220',
    borderBottomColor: '#172235',
    borderBottomWidth: 1,
    height: 132,
    left: 0,
    opacity: 0.72,
    position: 'absolute',
    right: 0,
    top: 226,
  },
});
