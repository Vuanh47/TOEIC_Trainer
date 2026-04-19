import { createContext, ReactNode, useState } from 'react';

import { LoginSuccessData } from '@/src/types/auth';

type AuthState = {
  accessToken: string | null;
  expiresIn: number | null;
  tokenType: string | null;
  user: LoginSuccessData['user'] | null;
};

type AuthContextValue = {
  auth: AuthState;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);

  const signIn = (payload: LoginSuccessData) => {
    setAuth({
      accessToken: payload.accessToken,
      expiresIn: payload.expiresIn,
      tokenType: payload.tokenType,
      user: payload.user,
    });
  };

  const signOut = () => {
    setAuth(initialState);
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
