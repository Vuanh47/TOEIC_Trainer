import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import TextField, { FieldIconButton } from "@/src/components/common/TextField";
import { API_BASE_URL } from "@/src/config/env";
import { useAuth } from "@/src/hooks/use-auth";
import AuthLayout from "@/src/layouts/AuthLayout";
import { login } from "@/src/services/auth.service";
import { formatExpiry } from "@/src/utils/format";

export default function LoginScreen() {
  const { auth, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailError =
    email.length > 0 && !email.includes("@") ? "Email khong hop le." : null;
  const passwordError =
    password.length > 0 && password.length < 8
      ? "Mat khau phai co it nhat 8 ky tu."
      : null;

  const handleLogin = async () => {
    if (emailError || passwordError) {
      setErrorMessage("Vui long kiem tra lai thong tin dang nhap.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      console.log("[auth] login request", {
        email,
        url: `${API_BASE_URL}/api/auth/login`,
      });

      const payload = await login({ email, password });
      console.log("[auth] login success", {
        status: payload.status,
        userId: payload.data.user.id,
      });
      signIn(payload.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Khong the dang nhap.";
      console.log("[auth] login error", error);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <View style={styles.logoHalo} />
            <View style={styles.logoCircle}>
              <Ionicons color={colors.primaryDark} name="school" size={64} />
            </View>
          </View>

          <View style={styles.brandBadge}>
            <Text style={styles.brandText}>TOEIC_trainer</Text>
          </View>

          <Text style={styles.subtitle}>
            Tiep tuc hanh trinh luyen thi TOEIC
          </Text>
        </View>

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
            placeholder="Nhap email cua ban"
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
            placeholder="Nhap mat khau cua ban"
            rightSlot={
              <FieldIconButton
                onPress={() => setShowPassword((current) => !current)}
              >
                <Ionicons
                  color={colors.textMuted}
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                />
              </FieldIconButton>
            }
            secureTextEntry={!showPassword}
            value={password}
          />

          <Pressable
            onPress={() => Alert.alert("Thong bao", "Chuc nang dang cap nhat.")}
            style={styles.linkWrap}
          >
            <Text style={styles.linkText}>Quen mat khau?</Text>
          </Pressable>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <Text style={styles.debugText}>API endpoint: {API_BASE_URL}</Text>

          <PrimaryButton
            label="DANG NHAP"
            loading={loading}
            onPress={handleLogin}
          />

          <Pressable
            onPress={() => router.push("/register")}
            style={styles.registerWrap}
          >
            <Text style={styles.registerText}>
              Chua co tai khoan?{" "}
              <Text style={styles.registerHighlight}>Dang ky ngay</Text>
            </Text>
          </Pressable>

          {auth.user ? (
            <View style={styles.successCard}>
              <View style={styles.successHeader}>
                <Ionicons
                  color={colors.success}
                  name="checkmark-circle"
                  size={22}
                />
                <Text style={styles.successTitle}>Dang nhap thanh cong</Text>
              </View>
              <Text style={styles.successLine}>{auth.user.fullName}</Text>
              <Text style={styles.successMeta}>{auth.user.email}</Text>
              <Text style={styles.successMeta}>
                Token het han sau {formatExpiry(auth.expiresIn)}
              </Text>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  brandBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  brandText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  debugText: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  form: {
    marginTop: spacing.lg,
  },
  header: {
    alignItems: "center",
  },
  linkText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "700",
  },
  linkWrap: {
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  logoCircle: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: "rgba(255,255,255,0.75)",
    borderRadius: radius.pill,
    borderWidth: 8,
    height: 132,
    justifyContent: "center",
    width: 132,
  },
  logoHalo: {
    backgroundColor: "rgba(255,182,72,0.18)",
    borderRadius: radius.pill,
    height: 170,
    position: "absolute",
    width: 170,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    minHeight: 170,
  },
  registerHighlight: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  registerText: {
    color: colors.text,
    fontSize: 15,
  },
  registerWrap: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  successCard: {
    backgroundColor: "#EFFAF2",
    borderColor: "#B6E2C3",
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  successHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  successLine: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  successMeta: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  successTitle: {
    color: colors.success,
    fontSize: 16,
    fontWeight: "800",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
});
