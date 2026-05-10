import { apiRequest, RequestOptions } from '@/src/services/api.client';

export class BaseAdminService {
  constructor(protected readonly accessToken: string) {}

  protected request<T>(path: string, options: RequestOptions = {}) {
    return apiRequest<T>(path, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }
}
