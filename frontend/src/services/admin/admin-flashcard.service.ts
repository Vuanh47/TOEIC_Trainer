import { BaseAdminService } from '@/src/services/admin/base-admin.service';
import {
  ApiVoidResponse,
  CreateAdminFlashcardRequest,
  FlashcardListResponse,
  FlashcardResponse,
  UpdateAdminFlashcardRequest,
} from '@/src/types/admin-api';

export class AdminFlashcardService extends BaseAdminService {
  getByModuleId(moduleId: number) {
    return this.request<FlashcardListResponse>(`/api/admin/flashcards/modules/${moduleId}`, {
      method: 'GET',
    });
  }

  create(request: CreateAdminFlashcardRequest) {
    return this.request<FlashcardResponse>('/api/admin/flashcards', {
      body: JSON.stringify(request),
      method: 'POST',
    });
  }

  update(flashcardId: number, request: UpdateAdminFlashcardRequest) {
    return this.request<FlashcardResponse>(`/api/admin/flashcards/${flashcardId}`, {
      body: JSON.stringify(request),
      method: 'PUT',
    });
  }

  delete(flashcardId: number) {
    return this.request<ApiVoidResponse>(`/api/admin/flashcards/${flashcardId}`, {
      method: 'DELETE',
    });
  }
}
