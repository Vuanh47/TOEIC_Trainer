import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateMilestoneModuleRequest,
  MilestoneModuleListResponse,
  MilestoneModuleResponse,
  UpdateMilestoneModuleRequest,
} from '@/src/types/admin-api';

export class AdminMilestoneModuleService extends BaseAdminService {
  getByMilestoneId(milestoneId: number) {
    return this.request<MilestoneModuleListResponse>(
      `/api/admin/milestones/${milestoneId}/modules`,
      { method: 'GET' }
    );
  }

  create(milestoneId: number, request: CreateMilestoneModuleRequest) {
    return this.request<MilestoneModuleResponse>(
      `/api/admin/milestones/${milestoneId}/modules`,
      {
        body: JSON.stringify(request),
        method: 'POST',
      }
    );
  }

  update(
    milestoneId: number,
    milestoneModuleId: number,
    request: UpdateMilestoneModuleRequest
  ) {
    return this.request<MilestoneModuleResponse>(
      `/api/admin/milestones/${milestoneId}/modules/${milestoneModuleId}`,
      {
        body: JSON.stringify(request),
        method: 'PUT',
      }
    );
  }

  delete(milestoneId: number, milestoneModuleId: number) {
    return this.request<ApiVoidResponse>(
      `/api/admin/milestones/${milestoneId}/modules/${milestoneModuleId}`,
      { method: 'DELETE' }
    );
  }
}
