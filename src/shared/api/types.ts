export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export interface ApiErrorResponse {
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
