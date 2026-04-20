import { Stack } from "expo-router";

export default function UserLayout() {
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
