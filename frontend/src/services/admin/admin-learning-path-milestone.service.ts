import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateLearningPathMilestoneRequest,
  LearningPathMilestoneListResponse,
  LearningPathMilestoneResponse,
  UpdateLearningPathMilestoneRequest,
} from '@/src/types/admin-api';

export class AdminLearningPathMilestoneService extends BaseAdminService {
  getByLearningPathId(learningPathId: number) {
    return this.request<LearningPathMilestoneListResponse>(
      `/api/admin/learning-paths/${learningPathId}/milestones`,
      { method: 'GET' }
    );
  }

  create(learningPathId: number, request: CreateLearningPathMilestoneRequest) {
    return this.request<LearningPathMilestoneResponse>(
      `/api/admin/learning-paths/${learningPathId}/milestones`,
      {
        body: JSON.stringify(request),
        method: 'POST',
      }
    );
  }

  update(
    learningPathId: number,
    milestoneId: number,
    request: UpdateLearningPathMilestoneRequest
  ) {
    return this.request<LearningPathMilestoneResponse>(
      `/api/admin/learning-paths/${learningPathId}/milestones/${milestoneId}`,
      {
        body: JSON.stringify(request),
        method: 'PUT',
      }
    );
  }

  delete(learningPathId: number, milestoneId: number) {
    return this.request<ApiVoidResponse>(
      `/api/admin/learning-paths/${learningPathId}/milestones/${milestoneId}`,
      { method: 'DELETE' }
    );
  }
}
