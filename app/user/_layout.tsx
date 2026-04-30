import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/src/hooks/use-auth";

export default function UserLayout() {
  const { auth, isHydrated } = useAuth();

  if (!isHydrated) {
    return null;
  }

  if (!auth.accessToken) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="roadmap" />
      <Stack.Screen name="grammar" />
      <Stack.Screen name="notebook" />
      <Stack.Screen name="lesson" />
      <Stack.Screen name="exam" />
    </Stack>
  );
}
