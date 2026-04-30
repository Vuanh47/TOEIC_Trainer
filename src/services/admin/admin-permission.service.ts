import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import { PermissionApiItem } from '@/src/types/admin-api';

export class AdminPermissionService extends BaseAdminService {
  getAll() {
    return this.request<PermissionApiItem[]>('/api/admin/permissions', {
      method: 'GET',
    });
  }
}
