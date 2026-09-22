import { NextResponse } from "next/server";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/shared/api/types";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

export const apiSuccess = <T>(data: T, status = 200) =>
  NextResponse.json<ApiSuccessResponse<T>>(
    { data },
    { status, headers: NO_STORE_HEADERS },
  );

export const apiError = (
  status: number,
  code: string,
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
) =>
  NextResponse.json<ApiErrorResponse>(
    {
      error: {
        code,
        message,
        ...(fieldErrors ? { fieldErrors } : {}),
      },
    },
    { status, headers: NO_STORE_HEADERS },
  );
