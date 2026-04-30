import { Redirect } from 'expo-router';

import { useAuth } from '@/src/hooks/use-auth';
import AdminLoginScreen from '@/src/pages/admin/login/AdminLoginScreen';

export default function AdminIndexPage() {
  const { auth, isHydrated } = useAuth();

  if (!isHydrated) {
    return null;
  }

  if (auth.accessToken && auth.user?.role === 'ADMIN') {
    return <Redirect href="/admin/dashboard" />;
  }

  return <AdminLoginScreen />;
}
