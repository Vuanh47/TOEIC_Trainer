import { Redirect } from 'expo-router';

import { useAuth } from '@/src/hooks/use-auth';
import LoginScreen from '@/src/pages/login/LoginScreen';

export default function IndexPage() {
  const { auth, isHydrated } = useAuth();

  if (!isHydrated) {
    return null;
  }

  if (auth.accessToken) {
    return <Redirect href="/user/home" />;
  }

  return <LoginScreen />;
}
