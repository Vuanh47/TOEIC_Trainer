import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/src/assets/styles/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !loading ? styles.buttonPressed : null,
        loading ? styles.buttonDisabled : null,
      ]}>
      <View style={styles.glow} />
      <View style={styles.shine} />
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    borderColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1,
    elevation: 5,
    justifyContent: 'center',
    minHeight: 62,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.26,
    shadowRadius: 28,
  },
  buttonDisabled: {
    opacity: 0.85,
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
  },
  glow: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.pill,
    height: 26,
    left: 22,
    position: 'absolute',
    right: 22,
    top: 8,
  },
  label: {
    color: '#F7FBFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  shine: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.pill,
    bottom: -12,
    height: 38,
    position: 'absolute',
    right: -8,
    transform: [{ rotate: '-14deg' }],
    width: 140,
  },
});
