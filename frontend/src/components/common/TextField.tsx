import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, spacing } from '@/src/assets/styles/theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  error?: string | null;
  compact?: boolean;
  wrapperStyle?: ViewStyle;
};

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  leftIcon,
  rightSlot,
  error,
  compact = false,
  wrapperStyle,
}: TextFieldProps) {
  return (
    <View
      style={[
        styles.wrapper,
        compact ? styles.wrapperCompact : null,
        wrapperStyle,
      ]}>
      <Text style={[styles.label, compact ? styles.labelCompact : null]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputShell,
          compact ? styles.inputShellCompact : null,
          error ? styles.inputShellError : null,
        ]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          style={[styles.input, compact ? styles.inputCompact : null]}
          value={value}
        />
        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.error, compact ? styles.errorCompact : null]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function FieldIconButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable hitSlop={12} onPress={onPress} style={styles.iconButton}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  errorCompact: {
    fontSize: 11,
    marginTop: 4,
  },
  iconButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    paddingVertical: 0,
  },
  inputCompact: {
    fontSize: 15,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 58,
    paddingHorizontal: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  inputShellCompact: {
    minHeight: 50,
    paddingHorizontal: 12,
  },
  inputShellError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  labelCompact: {
    fontSize: 13,
    marginBottom: 4,
  },
  leftIcon: {
    width: 22,
  },
  rightSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    marginBottom: spacing.md,
  },
  wrapperCompact: {
    marginBottom: 10,
  },
});
