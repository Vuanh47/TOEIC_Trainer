import { ApiError } from "@/src/services/api.client";

type ErrorResponseBody = {
  code?: number;
  message?: string;
};

export function isNoActiveLearningPathError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return false;
  }

  const responseBody =
    typeof error.responseBody === "object" && error.responseBody !== null
      ? (error.responseBody as ErrorResponseBody)
      : null;

  return responseBody?.code === 7001;
}
