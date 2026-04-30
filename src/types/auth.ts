export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
  status: string;
  timestamp: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  avatarUrl: string;
  currentLevel: string;
  email: string;
  fullName: string;
  password: string;
  targetScore: number;
};

export type AuthUser = {
  authProvider: string;
  avatarUrl: string | null;
  createdAt: string;
  currentLevel: string;
  email: string;
  fullName: string;
  id: number;
  premium: boolean;
  profileId: number;
  providerUserId: string | null;
  role: string;
  status: string;
  targetScore: number;
  updatedAt: string;
};

export type LoginSuccessData = {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser;
};

export type LoginResponse = ApiResponse<LoginSuccessData>;

export type RegisterResponse = ApiResponse<AuthUser>;
