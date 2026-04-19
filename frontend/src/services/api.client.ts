import { API_BASE_URL } from '@/src/config/env';

type RequestOptions = {
  body?: BodyInit | null;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
};

export class ApiError extends Error {
  requestUrl: string;
  responseBody?: unknown;
  statusCode?: number;

  constructor(
    message: string,
    requestUrl: string,
    statusCode?: number,
    responseBody?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.requestUrl = requestUrl;
    this.responseBody = responseBody;
    this.statusCode = statusCode;
  }
}

type ErrorPayload = {
  message?: string;
};

function buildRequestUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function getErrorMessage(payload: unknown, statusCode?: number) {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as ErrorPayload).message === 'string'
  ) {
    return (payload as ErrorPayload).message!;
  }

  if (statusCode) {
    return `Request failed with status ${statusCode}`;
  }

  return 'Khong the ket noi backend.';
}

function createNetworkError(error: unknown, requestUrl: string) {
  const reason =
    error instanceof Error ? error.message : 'Khong the ket noi backend.';

  return new ApiError(
    `${reason}. Kiem tra lai API_BASE_URL: ${requestUrl}`,
    requestUrl
  );
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const requestUrl = buildRequestUrl(path);

  try {
    const response = await fetch(requestUrl, {
      body: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      method: options.method ?? 'GET',
    });

    const payload = (await response.json().catch(() => null)) as T | null;

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(payload, response.status),
        requestUrl,
        response.status,
        payload
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw createNetworkError(error, requestUrl);
  }
}
