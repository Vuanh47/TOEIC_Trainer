import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateLearningModuleRequest,
  LearningModuleListResponse,
  LearningModuleResponse,
  UpdateLearningModuleRequest,
} from '@/src/types/admin-api';

export class AdminLearningModuleService extends BaseAdminService {
  getAll() {
    return this.request<LearningModuleListResponse>('/api/admin/learning-modules', {
      method: 'GET',
    });
  }

  getById(id: number) {
    return this.request<LearningModuleResponse>(`/api/admin/learning-modules/${id}`, {
      method: 'GET',
    });
  }

  create(request: CreateLearningModuleRequest) {
    return this.request<LearningModuleResponse>('/api/admin/learning-modules', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(id: number, request: UpdateLearningModuleRequest) {
    return this.request<LearningModuleResponse>(`/api/admin/learning-modules/${id}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  deactivate(id: number) {
    return this.request<ApiVoidResponse>(`/api/admin/learning-modules/${id}`, {
      method: 'DELETE',
    });
  }
}
