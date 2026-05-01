import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import { API_BASE_URL } from '@/src/config/env';
import {
  ApiVoidResponse,
  CreateVideoLessonRequest,
  UpdateVideoLessonRequest,
  VideoLessonListResponse,
  VideoLessonResponse,
  VideoUploadResponse,
} from '@/src/types/admin-api';

export class AdminVideoLessonService extends BaseAdminService {
  getByModuleId(moduleId: number) {
    return this.request<VideoLessonListResponse>(
      `/api/admin/video-lessons/modules/${moduleId}`,
      { method: 'GET' }
    );
  }

  create(request: CreateVideoLessonRequest) {
    return this.request<VideoLessonResponse>('/api/admin/video-lessons', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(videoLessonId: number, request: UpdateVideoLessonRequest) {
    return this.request<VideoLessonResponse>(`/api/admin/video-lessons/${videoLessonId}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  delete(videoLessonId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/video-lessons/${videoLessonId}`, {
      method: 'DELETE',
    });
  }

  async upload(file: File) {
    const normalizedPath = '/api/admin/video-lessons/upload';
    const requestUrl =
      API_BASE_URL.endsWith('/api') && normalizedPath.startsWith('/api/')
        ? `${API_BASE_URL}${normalizedPath.slice(4)}`
        : `${API_BASE_URL}${normalizedPath}`;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(requestUrl, {
      body: formData,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      method: 'POST',
    });

    const payload = (await response.json().catch(() => null)) as VideoUploadResponse | null;
    if (!response.ok || !payload) {
      throw new Error(payload?.message ?? `Upload failed (${response.status})`);
    }

    return payload;
  }

  async uploadAndCreate(
    file: File,
    data: {
      moduleId: number;
      title: string;
      description: string | null;
      sortOrder: number;
      free: boolean;
      published: boolean;
    },
  ) {
    const normalizedPath = '/api/admin/video-lessons/upload-and-create';
    const requestUrl =
      API_BASE_URL.endsWith('/api') && normalizedPath.startsWith('/api/')
        ? `${API_BASE_URL}${normalizedPath.slice(4)}`
        : `${API_BASE_URL}${normalizedPath}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(data));

    const response = await fetch(requestUrl, {
      body: formData,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      method: 'POST',
    });

    const payload = (await response.json().catch(() => null)) as VideoLessonResponse | null;
    if (!response.ok || !payload) {
      throw new Error(payload?.message ?? `Upload and create failed (${response.status})`);
    }

    return payload;
  }
}
