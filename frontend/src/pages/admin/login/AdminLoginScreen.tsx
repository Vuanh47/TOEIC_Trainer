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
import { useAuth } from '@/src/hooks/use-auth';
import { loginAdmin } from '@/src/services/admin-auth.service';

export default function AdminLoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Email khong hop le.' : null;
  const passwordError =
    password.length > 0 && password.length < 8
      ? 'Mat khau phai co it nhat 8 ky tu.'
      : null;

  const handleLogin = async () => {
    if (emailError || passwordError) {
      setErrorMessage('Vui long kiem tra lai thong tin dang nhap.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const payload = await loginAdmin({ email, password });
      signIn(payload.data);
      router.replace('/admin/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Khong the dang nhap admin.';
      setErrorMessage(message);
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
              <Text style={styles.eyebrow}>Secure Admin Portal</Text>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Admin Login</Text>
                <View style={styles.titleAccent} />
              </View>
            </View>
            <Text style={styles.subtitle}>
              Dang nhap bang tai khoan co quyen ADMIN de quan ly noi dung.
            </Text>

            <View style={styles.form}>
              <TextField
                autoCapitalize="none"
                error={emailError}
                keyboardType="email-address"
                label="Dia chi email"
                leftIcon={
                  <MaterialCommunityIcons
                    color={colors.textMuted}
                    name="email-outline"
                    size={22}
                  />
                }
                onChangeText={setEmail}
                placeholder="Nhap email admin"
                value={email}
              />

              <TextField
                autoCapitalize="none"
                error={passwordError}
                label="Mat khau"
                leftIcon={
                  <MaterialCommunityIcons
                    color={colors.textMuted}
                    name="lock-outline"
                    size={22}
                  />
                }
                onChangeText={setPassword}
                placeholder="Nhap mat khau admin"
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

              <PrimaryButton
                label="DANG NHAP ADMIN"
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
    backgroundColor: 'rgba(217,45,32,0.08)',
    borderColor: 'rgba(217,45,32,0.14)',
    borderRadius: 16,
    borderWidth: 1,
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
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
