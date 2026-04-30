import { createContext, ReactNode, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { LoginSuccessData } from '@/src/types/auth';

type AuthState = {
  accessToken: string | null;
  expiresIn: number | null;
  tokenType: string | null;
  user: LoginSuccessData['user'] | null;
};

type AuthContextValue = {
  auth: AuthState;
  isHydrated: boolean;
  signIn: (payload: LoginSuccessData) => void;
  signOut: () => void;
};

const initialState: AuthState = {
  accessToken: null,
  expiresIn: null,
  tokenType: null,
  user: null,
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = 'toeic_trainer_auth';

function saveAuthToStorage(state: AuthState) {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failure in private mode or blocked storage.
  }
}

function clearAuthStorage() {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage failure in private mode or blocked storage.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof localStorage === 'undefined') {
      setIsHydrated(true);
      return;
    }

    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as AuthState;
      if (parsed?.accessToken && parsed?.tokenType && parsed?.user) {
        setAuth(parsed);
      }
    } catch {
      clearAuthStorage();
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const signIn = (payload: LoginSuccessData) => {
    const nextState: AuthState = {
      accessToken: payload.accessToken,
      expiresIn: payload.expiresIn,
      tokenType: payload.tokenType,
      user: payload.user,
    };

    setAuth(nextState);
    saveAuthToStorage(nextState);
  };

  const signOut = () => {
    setAuth(initialState);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider value={{ auth, isHydrated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
