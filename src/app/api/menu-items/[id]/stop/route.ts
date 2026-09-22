import type { NextRequest } from "next/server";

import { stopMenuItem } from "@/entities/menu-item/api/server/menu-store";
import { handleMenuItemRouteError } from "@/entities/menu-item/api/server/route-error";
import { stopItemPayloadSchema } from "@/entities/menu-item/model/schemas";
import { simulateMockApiRequest } from "@/shared/api/server/mock-api";
import { apiError, apiSuccess } from "@/shared/api/server/responses";

interface StopMenuItemRouteContext {
  params: Promise<{ id: string }>;
}

export const POST = async (
  request: NextRequest,
  { params }: StopMenuItemRouteContext,
) => {
  try {
    await simulateMockApiRequest();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError(400, "INVALID_JSON", "Тело запроса должно быть JSON");
    }

    const payloadResult = stopItemPayloadSchema.safeParse(body);

    if (!payloadResult.success) {
      return apiError(
        400,
        "INVALID_STOP_PAYLOAD",
        "Не удалось поставить позицию в стоп-лист",
        payloadResult.error.flatten().fieldErrors,
      );
    }

    const { id } = await params;

    return apiSuccess(stopMenuItem(id, payloadResult.data));
  } catch (error) {
    return handleMenuItemRouteError(error);
  }
};
