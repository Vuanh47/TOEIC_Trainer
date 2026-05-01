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
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    elevation: 5,
    justifyContent: 'center',
    minHeight: 60,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
  buttonDisabled: {
    opacity: 0.85,
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
  },
  glow: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill,
    height: 24,
    left: 18,
    position: 'absolute',
    right: 18,
    top: 10,
  },
  label: {
    color: '#F7FBFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
