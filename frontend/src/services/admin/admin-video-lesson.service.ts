import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateVideoLessonRequest,
  UpdateVideoLessonRequest,
  VideoLessonListResponse,
  VideoLessonResponse,
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
}
