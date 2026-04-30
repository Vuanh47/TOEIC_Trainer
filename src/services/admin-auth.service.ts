import { ApiError } from '@/src/services/api.client';
import { login } from '@/src/services/auth.service';
import { LoginRequest, LoginResponse } from '@/src/types/auth';

export async function loginAdmin(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const payload = await login(credentials);

  if (payload.data.user.role !== 'ADMIN') {
    throw new ApiError(
      'Tai khoan nay khong co quyen truy cap admin.',
      '/api/auth/login',
      403,
      payload
    );
  }

  return payload;
}
