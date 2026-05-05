import { apiRequest } from './api.client';
import { 
  UserTestListResponse, 
  UserTestDetailResponse, 
  TestAttemptApiResponse, 
  TestAttemptListApiResponse, 
  SubmitTestAttemptRequest,
  ExplainQuestionRequest,
  QuestionExplainApiResponse,
} from '../types/user-api';

export class UserTestService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  async getPublishedTests(): Promise<UserTestListResponse> {
    return apiRequest<UserTestListResponse>('/api/users/tests/published', {
      headers: this.headers,
    });
  }

  async getTestById(testId: number): Promise<UserTestDetailResponse> {
    return apiRequest<UserTestDetailResponse>(`/api/users/tests/${testId}`, {
      headers: this.headers,
    });
  }

  async startTest(testId: number): Promise<TestAttemptApiResponse> {
    return apiRequest<TestAttemptApiResponse>(`/api/users/tests/${testId}/start`, {
      method: 'POST',
      headers: this.headers,
    });
  }

  async submitAttempt(attemptId: number, request: SubmitTestAttemptRequest): Promise<TestAttemptApiResponse> {
    return apiRequest<TestAttemptApiResponse>(`/api/users/tests/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request),
    });
  }

  async getMyAttempts(): Promise<TestAttemptListApiResponse> {
    return apiRequest<TestAttemptListApiResponse>('/api/users/tests/attempts', {
      headers: this.headers,
    });
  }

  async getAttemptDetails(attemptId: number): Promise<TestAttemptApiResponse> {
    return apiRequest<TestAttemptApiResponse>(`/api/users/tests/attempts/${attemptId}/details`, {
      headers: this.headers,
    });
  }

  async explainQuestion(request: ExplainQuestionRequest): Promise<QuestionExplainApiResponse> {
    return apiRequest<QuestionExplainApiResponse>('/api/users/tests/questions/explain', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request),
    });
  }
}
