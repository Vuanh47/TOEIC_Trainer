import { apiRequest } from "@/src/services/api.client";
import {
  SubmitPracticeAttemptRequest,
  UserPracticeAttemptApiResponse,
  UserPracticeAttemptDetailApiResponse,
  UserPracticeAttemptListApiResponse,
  UserPracticeSetDetailApiResponse,
  UserPracticeSetListApiResponse,
} from "@/src/types/user-api";

function buildAuthHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function getPracticeSetsByModule(accessToken: string, moduleId: number) {
  return apiRequest<UserPracticeSetListApiResponse>(`/api/users/practice-sets/modules/${moduleId}`, {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function getPracticeSetDetail(accessToken: string, practiceSetId: number) {
  return apiRequest<UserPracticeSetDetailApiResponse>(`/api/users/practice-sets/${practiceSetId}`, {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function startPractice(accessToken: string, practiceSetId: number) {
  return apiRequest<UserPracticeAttemptApiResponse>(`/api/users/practice-sets/${practiceSetId}/start`, {
    headers: buildAuthHeaders(accessToken),
    method: "POST",
  });
}

export function submitPractice(accessToken: string, attemptId: number, payload: SubmitPracticeAttemptRequest) {
  return apiRequest<UserPracticeAttemptDetailApiResponse>(`/api/users/practice-sets/attempts/${attemptId}/submit`, {
    body: JSON.stringify(payload),
    headers: buildAuthHeaders(accessToken),
    method: "POST",
  });
}

export function getMyPracticeAttempts(accessToken: string) {
  return apiRequest<UserPracticeAttemptListApiResponse>("/api/users/practice-sets/attempts", {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}

export function getPracticeAttemptDetail(accessToken: string, attemptId: number) {
  return apiRequest<UserPracticeAttemptDetailApiResponse>(`/api/users/practice-sets/attempts/${attemptId}/details`, {
    headers: buildAuthHeaders(accessToken),
    method: "GET",
  });
}
