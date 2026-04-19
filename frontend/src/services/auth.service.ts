import { apiRequest, ApiError } from '@/src/services/api.client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/src/types/auth';

function validateLoginResponse(payload: LoginResponse) {
  if (payload.data?.accessToken) {
    return payload;
  }

  throw new ApiError(
    'Dang nhap that bai. Response khong co accessToken.',
    '/api/auth/login'
  );
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const payload = await apiRequest<LoginResponse>('/api/auth/login', {
    body: JSON.stringify(credentials),
    method: 'POST',
  });

  return validateLoginResponse(payload);
}

function validateRegisterResponse(payload: RegisterResponse) {
  if (payload?.data) {
    return payload;
  }

  throw new ApiError(
    'Dang ky that bai. Response khong hop le.',
    '/api/auth/register'
  );
}

export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const response = await apiRequest<RegisterResponse>('/api/auth/register', {
    body: JSON.stringify(payload),
    method: 'POST',
  });

  return validateRegisterResponse(response);
}
