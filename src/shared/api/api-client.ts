import type { ApiErrorResponse, ApiSuccessResponse } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!isRecord(value) || !isRecord(value.error)) {
    return false;
  }

  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  );
};

const isApiSuccessResponse = <T>(
  value: unknown,
): value is ApiSuccessResponse<T> => isRecord(value) && "data" in value;

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string[] | undefined>;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export const apiRequest = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch {
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      "Не удалось связаться с сервером",
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiClientError(
        response.status,
        payload.error.code,
        payload.error.message,
        payload.error.fieldErrors,
      );
    }

    throw new ApiClientError(
      response.status,
      "UNEXPECTED_API_ERROR",
      "Сервер вернул неожиданный ответ",
    );
  }

  if (!isApiSuccessResponse<T>(payload)) {
    throw new ApiClientError(
      response.status,
      "INVALID_API_RESPONSE",
      "Не удалось прочитать ответ сервера",
    );
  }

  return payload.data;
};
