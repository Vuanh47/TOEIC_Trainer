import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topDivider} />
      <View style={styles.page}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  safeArea: {
    backgroundColor: '#F7F9FC',
    flex: 1,
  },
  topDivider: {
    backgroundColor: '#C8D2DF',
    height: 3,
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    top: 74,
  },
});
