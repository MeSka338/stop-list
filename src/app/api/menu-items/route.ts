import type { NextRequest } from "next/server";

import { getMenuItems } from "@/entities/menu-item/api/server/menu-store";
import { handleMenuItemRouteError } from "@/entities/menu-item/api/server/route-error";
import { menuItemsFilterSchema } from "@/entities/menu-item/model/schemas";
import { simulateMockApiRequest } from "@/shared/api/server/mock-api";
import { apiError, apiSuccess } from "@/shared/api/server/responses";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  try {
    await simulateMockApiRequest();

    const filtersResult = menuItemsFilterSchema.safeParse({
      shop: request.nextUrl.searchParams.get("shop") || undefined,
      status: request.nextUrl.searchParams.get("status") || undefined,
    });

    if (!filtersResult.success) {
      return apiError(
        400,
        "INVALID_FILTERS",
        "Переданы некорректные параметры фильтрации",
        filtersResult.error.flatten().fieldErrors,
      );
    }

    return apiSuccess(getMenuItems(filtersResult.data));
  } catch (error) {
    return handleMenuItemRouteError(error);
  }
};
