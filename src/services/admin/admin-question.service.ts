import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateQuestionRequest,
  QuestionListResponse,
  QuestionResponse,
  UpdateQuestionRequest,
} from '@/src/types/admin-api';

export class AdminQuestionService extends BaseAdminService {
  getAll(keyword?: string) {
    const query = keyword?.trim()
      ? `?keyword=${encodeURIComponent(keyword.trim())}`
      : '';

    return this.request<QuestionListResponse>(`/api/admin/questions${query}`, {
      method: 'GET',
    });
  }

  getById(questionId: number) {
    return this.request<QuestionResponse>(`/api/admin/questions/${questionId}`, {
      method: 'GET',
    });
  }

  create(request: CreateQuestionRequest) {
    return this.request<QuestionResponse>('/api/admin/questions', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(questionId: number, request: UpdateQuestionRequest) {
    return this.request<QuestionResponse>(`/api/admin/questions/${questionId}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  delete(questionId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/questions/${questionId}`, {
      method: 'DELETE',
    });
  }
}
