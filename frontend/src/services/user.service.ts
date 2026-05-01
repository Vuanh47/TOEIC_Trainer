import { apiRequest } from "@/src/services/api.client";
import {
  FlashcardCollectionListResponse,
  FlashcardCollectionResponse,
  FlashcardResponse,
  FlashcardsResponse,
  LessonProgressUpdateResponse,
  ModuleUnlockResponse,
  UserLessonsResponse,
  UserModuleContentResponse,
  UserLearningPathAssignmentResponse,
  UserProfileResponse,
  UserRoadmapResponse,
} from "@/src/types/user-api";

function buildAuthHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function getMyProfile(accessToken: string) {
  return apiRequest<UserProfileResponse>("/api/users/me", {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function updateMyTargetScore(accessToken: string, targetScore: number) {
  return apiRequest<UserProfileResponse>("/api/users/me/target-score", {
    body: JSON.stringify({ targetScore }),
    headers: buildAuthHeaders(accessToken),
    method: "PUT",
  });
}

export function getMyFlashcards(accessToken: string) {
  return apiRequest<FlashcardsResponse>("/api/users/flashcards/mine", {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function assignRecommendedPath(accessToken: string, targetScore?: number) {
  return apiRequest<UserLearningPathAssignmentResponse>(
    "/api/placement-onboarding/assign-path",
    {
      body:
        typeof targetScore === "number"
          ? JSON.stringify({ targetScore })
          : undefined,
      headers: buildAuthHeaders(accessToken),
      method: "POST",
    }
  );
}

export function getUserLessons(accessToken: string, moduleId?: number) {
  const path =
    typeof moduleId === "number"
      ? `/api/users/lessons?moduleId=${moduleId}`
      : "/api/users/lessons";

  return apiRequest<UserLessonsResponse>(path, {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function getUserRoadmap(accessToken: string) {
  return apiRequest<UserRoadmapResponse>("/api/users/learning/roadmap", {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function getUserModuleContent(accessToken: string, moduleId: number) {
  return apiRequest<UserModuleContentResponse>(
    `/api/users/learning/modules/${moduleId}/content`,
    {
      headers: buildAuthHeaders(accessToken),
      method: "GET",
    }
  );
}

export function updateLessonProgress(
  accessToken: string,
  lessonId: number,
  payload: {
    lastPositionSeconds?: number;
    watchedSeconds?: number;
    completionPercent?: number;
    status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  },
) {
  return apiRequest<LessonProgressUpdateResponse>(
    `/api/users/lessons/${lessonId}/progress`,
    {
      body: JSON.stringify(payload),
      headers: buildAuthHeaders(accessToken),
      method: "POST",
    },
  );
}

export function completeOrUnlockNextModule(
  accessToken: string,
  moduleId: number,
  forceComplete = false,
) {
  return apiRequest<ModuleUnlockResponse>(
    `/api/users/learning/modules/${moduleId}/complete-or-unlock-next`,
    {
      body: JSON.stringify({ forceComplete }),
      headers: buildAuthHeaders(accessToken),
      method: "POST",
    },
  );
}

export function createMyFlashcard(
  accessToken: string,
  payload: {
    englishWord: string;
    meaningVi: string;
    exampleSentence?: string;
    pronunciation?: string;
  },
) {
  return apiRequest<FlashcardResponse>("/api/users/flashcards", {
    body: JSON.stringify(payload),
    headers: buildAuthHeaders(accessToken),
    method: "POST",
  });
}

export function updateMyFlashcard(
  accessToken: string,
  flashcardId: number,
  payload: {
    englishWord?: string;
    meaningVi?: string;
    exampleSentence?: string;
    pronunciation?: string;
    flashcardCollectionId?: number;
  },
) {
  return apiRequest<FlashcardResponse>("/api/users/flashcards/" + flashcardId, {
    body: JSON.stringify(payload),
    headers: buildAuthHeaders(accessToken),
    method: "PUT",
  });
}

export function deleteMyFlashcard(accessToken: string, flashcardId: number) {
  return apiRequest("/api/users/flashcards/" + flashcardId, {
    headers: buildAuthHeaders(accessToken),
    method: "DELETE",
  });
}

export function getModuleFlashcardsForUser(accessToken: string, moduleId: number, keyword?: string) {
  const suffix = keyword && keyword.trim().length > 0 ? `?keyword=${encodeURIComponent(keyword.trim())}` : "";
  return apiRequest<FlashcardsResponse>(`/api/users/flashcards/modules/${moduleId}${suffix}`, {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function createFlashcardCollection(
  accessToken: string,
  payload: { name: string; description?: string },
) {
  return apiRequest<FlashcardCollectionResponse>("/api/users/flashcards/collections", {
    body: JSON.stringify(payload),
    headers: buildAuthHeaders(accessToken),
    method: "POST",
  });
}

export function getMyFlashcardCollections(accessToken: string) {
  return apiRequest<FlashcardCollectionListResponse>("/api/users/flashcards/collections", {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function getFlashcardCollectionDetail(accessToken: string, collectionId: number) {
  return apiRequest<FlashcardCollectionResponse>(`/api/users/flashcards/collections/${collectionId}`, {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function updateFlashcardCollection(
  accessToken: string,
  collectionId: number,
  payload: { name?: string; description?: string },
) {
  return apiRequest<FlashcardCollectionResponse>(`/api/users/flashcards/collections/${collectionId}`, {
    body: JSON.stringify(payload),
    headers: buildAuthHeaders(accessToken),
    method: "PUT",
  });
}

export function deleteFlashcardCollection(accessToken: string, collectionId: number) {
  return apiRequest(`/api/users/flashcards/collections/${collectionId}`, {
    headers: buildAuthHeaders(accessToken),
    method: "DELETE",
  });
}
