import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';
import AdminLoginCard from '@/src/components/admin/AdminLoginCard';
import AdminShell from '@/src/components/admin/AdminShell';
import PrimaryButton from '@/src/components/common/PrimaryButton';
import TextField, { FieldIconButton } from '@/src/components/common/TextField';
import { API_BASE_URL } from '@/src/config/env';
import { useAuth } from '@/src/hooks/use-auth';
import { ApiError } from '@/src/services/api.client';
import { loginAdmin } from '@/src/services/admin-auth.service';

export default function AdminLoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Email không hợp lệ.' : null;
  const passwordError =
    password.length > 0 && password.trim().length === 0
      ? 'Mật khẩu không được để trống.'
      : null;

  const handleLogin = async () => {
    if (email.trim().length === 0 || password.trim().length === 0) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    if (emailError || passwordError) {
      setErrorMessage('Vui lòng kiểm tra lại thông tin đăng nhập.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const payload = await loginAdmin({ email: email.trim(), password });
      signIn(payload.data);
      router.replace('/admin/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        const raw = error.message.trim().toLowerCase();
        if (
          raw === 'login failed' ||
          raw.includes('bad credentials') ||
          raw.includes('invalid')
        ) {
          setErrorMessage('Sai email hoặc mật khẩu.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Không thể đăng nhập admin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      <View style={styles.center}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}>
          <AdminLoginCard>
            <View style={styles.headerBlock}>
              <Text style={styles.eyebrow}>Cổng quản trị bảo mật</Text>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Đăng nhập Admin</Text>
                <View style={styles.titleAccent} />
              </View>
            </View>
            <Text style={styles.subtitle}>
              Đăng nhập bằng tài khoản có quyền ADMIN để quản lý nội dung.
            </Text>

            <View style={styles.form}>
              <TextField
                autoCapitalize="none"
                error={emailError}
                keyboardType="email-address"
                label="Địa chỉ email"
                leftIcon={
                  <MaterialCommunityIcons
                    color={colors.textMuted}
                    name="email-outline"
                    size={22}
                  />
                }
                onChangeText={setEmail}
                placeholder="Nhập email admin"
                value={email}
              />

              <TextField
                autoCapitalize="none"
                error={passwordError}
                label="Mật khẩu"
                leftIcon={
                  <MaterialCommunityIcons
                    color={colors.textMuted}
                    name="lock-outline"
                    size={22}
                  />
                }
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu admin"
                rightSlot={
                  <FieldIconButton
                    onPress={() => setShowPassword((current) => !current)}>
                    <Ionicons
                      color={colors.textMuted}
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                    />
                  </FieldIconButton>
                }
                secureTextEntry={!showPassword}
                value={password}
              />

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              <Text style={styles.debugText}>API endpoint: {API_BASE_URL}</Text>

              <PrimaryButton
                label="ĐĂNG NHẬP ADMIN"
                loading={loading}
                onPress={handleLogin}
              />
            </View>
          </AdminLoginCard>
        </KeyboardAvoidingView>
      </View>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    backgroundColor: 'rgba(255,122,112,0.1)',
    borderColor: 'rgba(255,122,112,0.24)',
    borderRadius: 16,
    borderWidth: 1,
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  debugText: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  form: {
    marginTop: spacing.md,
  },
  headerBlock: {
    marginBottom: spacing.xs,
  },
  keyboard: {
    width: '100%',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: spacing.xl,
    maxWidth: 360,
  },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  titleAccent: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 10,
    marginLeft: spacing.sm,
    width: 10,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
