import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateGrammarRequest,
  GrammarListResponse,
  GrammarResponse,
  UpdateGrammarRequest,
} from '@/src/types/admin-api';

export class AdminGrammarService extends BaseAdminService {
  getAll() {
    return this.request<GrammarListResponse>('/api/admin/grammars', {
      method: 'GET',
    });
  }

  getById(id: number) {
    return this.request<GrammarResponse>(`/api/admin/grammars/${id}`, {
      method: 'GET',
    });
  }

  create(request: CreateGrammarRequest) {
    return this.request<GrammarResponse>('/api/admin/grammars', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(id: number, request: UpdateGrammarRequest) {
    return this.request<GrammarResponse>(`/api/admin/grammars/${id}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  delete(id: number) {
    return this.request<ApiVoidResponse>(`/api/admin/grammars/${id}`, {
      method: 'DELETE',
    });
  }
}
