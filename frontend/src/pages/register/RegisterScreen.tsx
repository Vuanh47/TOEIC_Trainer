import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
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
import AuthLayout from "@/src/layouts/AuthLayout";
import { register } from "@/src/services/auth.service";
import { RegisterRequest } from "@/src/types/auth";

const LEVEL_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterRequest>({
    avatarUrl: "",
    currentLevel: "BEGINNER",
    email: "",
    fullName: "",
    password: "",
    targetScore: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const errors = useMemo(
    () => ({
      email:
        form.email.length > 0 && !form.email.includes("@")
          ? "Email không hợp lệ."
          : null,
      fullName:
        form.fullName.trim().length > 0 && form.fullName.trim().length < 2
          ? "Họ tên quá ngắn."
          : null,
      password:
        form.password.length > 0 && form.password.length < 8
          ? "Mật khẩu phải có ít nhất 8 ký tự."
          : null,
      targetScore:
        Number.isNaN(form.targetScore) ||
        form.targetScore < 100 ||
        form.targetScore > 990
          ? "Điểm mục tiêu phải trong khoảng 100 - 990."
          : null,
    }),
    [form],
  );

  const hasError = Object.values(errors).some(Boolean);

  const updateField = <K extends keyof RegisterRequest>(
    key: K,
    value: RegisterRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    if (hasError) {
      setErrorMessage("Vui lòng kiểm tra lại thông tin đăng ký.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await register(form);

      Alert.alert(
        "Đăng ký thành công",
        `${response.data.fullName} đã được tạo tài khoản.`,
        [{ text: "Đăng nhập", onPress: () => router.replace("/") }],
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể đăng ký.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons color={colors.primaryDark} name="school" size={18} />
            </View>
            <Text style={styles.brandText}>TOEIC_trainer</Text>
          </View>
          <Text style={styles.subtitle}>Tiếp tục hành trình luyện thi TOEIC</Text>
               
        </View>

        <View style={styles.form}>
          <TextField
            error={errors.fullName}
            label="Họ và tên"
            leftIcon={
              <Ionicons
                color={colors.textMuted}
                name="person-outline"
                size={20}
              />
            }
            onChangeText={(value) => updateField("fullName", value)}
            placeholder="Nhập họ tên của bạn"
            variant="light"
            value={form.fullName}
          />

          <TextField
            autoCapitalize="none"
            error={errors.email}
            keyboardType="email-address"
            label="Địa chỉ email"
            leftIcon={
              <MaterialCommunityIcons
                color={colors.textMuted}
                name="email-outline"
                size={20}
              />
            }
            onChangeText={(value) => updateField("email", value)}
            placeholder="Nhập email đăng ký"
            variant="light"
            value={form.email}
          />

          <TextField
            autoCapitalize="none"
            error={errors.password}
            label="Mật khẩu"
            leftIcon={
              <MaterialCommunityIcons
                color={colors.textMuted}
                name="lock-outline"
                size={20}
              />
            }
            onChangeText={(value) => updateField("password", value)}
            placeholder="Tạo mật khẩu ít nhất 8 ký tự"
            rightSlot={
              <FieldIconButton
                onPress={() => setShowPassword((current) => !current)}
              >
                <Ionicons
                  color={colors.textMuted}
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                />
              </FieldIconButton>
            }
            secureTextEntry={!showPassword}
            variant="light"
            value={form.password}
          />

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Trình độ hiện tại</Text>
            <View style={styles.levelGrid}>
              {LEVEL_OPTIONS.map((level) => {
                const selected = form.currentLevel === level;

                return (
                  <Pressable
                    key={level}
                    onPress={() => updateField("currentLevel", level)}
                    style={[
                      styles.levelChip,
                      selected ? styles.levelChipActive : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelText,
                        selected ? styles.levelTextActive : null,
                      ]}
                    >
                      {level}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <TextField
            error={errors.targetScore}
            label="Mục điểm mục tiêu"
            leftIcon={
              <MaterialCommunityIcons
                color={colors.textMuted}
                name="target"
                size={20}
              />
            }
            onChangeText={(value) =>
              updateField(
                "targetScore",
                Number(value.replace(/[^0-9]/g, "")) || 0,
              )
            }
            placeholder="Nhập mức điểm mong muốn"
            variant="light"
            value={form.targetScore ? String(form.targetScore) : ""}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <PrimaryButton
            label="TẠO TÀI KHOẢN"
            loading={loading}
            onPress={handleRegister}
          />

          <Pressable onPress={() => router.back()} style={styles.footerLink}>
            <Text style={styles.footerText}>
              Đã có tài khoản?{" "}
              <Text style={styles.footerHighlight}>Đăng nhập</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  brandIcon: {
    alignItems: "center",
    backgroundColor: '#DCE8FB',
    borderRadius: radius.pill,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  brandText: {
    color: '#274A83',
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  fieldBlock: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: '#43546F',
    fontSize: 15,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  footerHighlight: {
    color: '#2E5DA3',
    fontWeight: "800",
  },
  footerLink: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    color: '#5B6C86',
    fontSize: 15,
  },
  form: {
    marginTop: spacing.lg,
  },
  header: {
    alignItems: "center",
  },
  levelChip: {
    alignItems: "center",
    backgroundColor: '#F4F8FF',
    borderColor: '#D7E2F2',
    borderRadius: radius.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  levelChipActive: {
    backgroundColor: '#2E5DA3',
    borderColor: '#2E5DA3',
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  levelText: {
    color: '#36527D',
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 22,
  },
  levelTextActive: {
    color: '#F8FBFF',
  },
  subtitle: {
    color: '#6D7F98',
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
});
