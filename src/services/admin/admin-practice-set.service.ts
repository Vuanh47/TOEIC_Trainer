import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreatePracticeSetRequest,
  PracticeSetListResponse,
  PracticeSetResponse,
  UpdatePracticeSetRequest,
  AssignPracticeSetQuestionsRequest,
  PracticeSetQuestionListResponse,
} from '@/src/types/admin-api';

export class AdminPracticeSetService extends BaseAdminService {
  getByModuleId(moduleId: number) {
    return this.request<PracticeSetListResponse>(
      `/api/admin/practice-sets/modules/${moduleId}`,
      { method: 'GET' }
    );
  }

  create(request: CreatePracticeSetRequest) {
    return this.request<PracticeSetResponse>('/api/admin/practice-sets', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(practiceSetId: number, request: UpdatePracticeSetRequest) {
    return this.request<PracticeSetResponse>(`/api/admin/practice-sets/${practiceSetId}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  delete(practiceSetId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/practice-sets/${practiceSetId}`, {
      method: 'DELETE',
    });
  }

  getQuestions(practiceSetId: number) {
    return this.request<PracticeSetQuestionListResponse>(
      `/api/admin/practice-sets/${practiceSetId}/questions`,
      { method: 'GET' }
    );
  }

  assignQuestions(practiceSetId: number, request: AssignPracticeSetQuestionsRequest) {
    return this.request<PracticeSetQuestionListResponse>(
      `/api/admin/practice-sets/${practiceSetId}/questions`,
      {
        body: JSON.stringify(request),
        method: 'POST',
      }
    );
  }
}
