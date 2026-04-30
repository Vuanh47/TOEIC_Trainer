import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateLearningPathRequest,
  LearningPathListResponse,
  LearningPathResponse,
  UpdateLearningPathRequest,
} from '@/src/types/admin-api';

export class AdminLearningPathService extends BaseAdminService {
  getAll() {
    return this.request<LearningPathListResponse>('/api/admin/learning-paths', {
      method: 'GET',
    });
  }

  getById(id: number) {
    return this.request<LearningPathResponse>(`/api/admin/learning-paths/${id}`, {
      method: 'GET',
    });
  }

  create(request: CreateLearningPathRequest) {
    return this.request<LearningPathResponse>('/api/admin/learning-paths', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(id: number, request: UpdateLearningPathRequest) {
    return this.request<LearningPathResponse>(`/api/admin/learning-paths/${id}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  deactivate(id: number) {
    return this.request<ApiVoidResponse>(`/api/admin/learning-paths/deactive/${id}`, {
      method: 'DELETE',
    });
  }

  delete(id: number) {
    return this.request<ApiVoidResponse>(`/api/admin/learning-paths/${id}`, {
      method: 'DELETE',
    });
  }
}
