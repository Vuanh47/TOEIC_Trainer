import { apiRequest } from "@/src/services/api.client";
import {
  FlashcardsResponse,
  UserLearningPathAssignmentResponse,
  UserProfileResponse,
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

export function assignRecommendedPath(accessToken: string) {
  return apiRequest<UserLearningPathAssignmentResponse>(
    "/api/placement-onboarding/assign-path",
    {
      headers: buildAuthHeaders(accessToken),
      method: "POST",
    }
  );
}
