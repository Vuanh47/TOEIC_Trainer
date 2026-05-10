import {
  TestListResponse,
  TestResponse,
  CreateTestRequest,
  UpdateTestRequest,
  TestPartListResponse,
  TestPartResponse,
  CreateTestPartRequest,
  UpdateTestPartRequest,
  TestPartQuestionListResponse,
  AssignTestPartQuestionsRequest,
  ApiVoidResponse,
} from '@/src/types/admin-api';
import { BaseAdminService } from '@/src/services/admin/base-admin.service';

export class AdminTestService extends BaseAdminService {
  getAll() {
    return this.request<TestListResponse>('/api/admin/tests');
  }

  getPublished() {
    return this.request<TestListResponse>('/api/admin/tests/published');
  }

  getById(testId: number) {
    return this.request<TestResponse>(`/api/admin/tests/${testId}`);
  }

  create(request: CreateTestRequest) {
    return this.request<TestResponse>('/api/admin/tests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  update(testId: number, request: UpdateTestRequest) {
    return this.request<TestResponse>(`/api/admin/tests/${testId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  delete(testId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/tests/${testId}`, {
      method: 'DELETE',
    });
  }

  // Parts
  getParts(testId: number) {
    return this.request<TestPartListResponse>(`/api/admin/tests/${testId}/parts`);
  }

  createPart(testId: number, request: CreateTestPartRequest) {
    return this.request<TestPartResponse>(`/api/admin/tests/${testId}/parts`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  updatePart(testPartId: number, request: UpdateTestPartRequest) {
    return this.request<TestPartResponse>(`/api/admin/tests/parts/${testPartId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  deletePart(testPartId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/tests/parts/${testPartId}`, {
      method: 'DELETE',
    });
  }

  // Questions
  getPartQuestions(testPartId: number) {
    return this.request<TestPartQuestionListResponse>(`/api/admin/tests/parts/${testPartId}/questions`);
  }

  assignQuestions(testPartId: number, request: AssignTestPartQuestionsRequest) {
    return this.request<TestPartQuestionListResponse>(`/api/admin/tests/parts/${testPartId}/questions`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  removeQuestion(testPartId: number, testPartQuestionId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/tests/parts/${testPartId}/questions/${testPartQuestionId}`, {
      method: 'DELETE',
    });
  }
}
