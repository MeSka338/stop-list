import { MockApiUnavailableError } from "@/shared/api/server/mock-api";
import { apiError } from "@/shared/api/server/responses";

import { MenuItemCannotResumeError, MenuItemNotFoundError } from "./errors";

export const handleMenuItemRouteError = (error: unknown) => {
  if (error instanceof MockApiUnavailableError) {
    return apiError(503, "MOCK_SERVER_ERROR", error.message);
  }

  if (error instanceof MenuItemNotFoundError) {
    return apiError(404, "MENU_ITEM_NOT_FOUND", error.message);
  }

  if (error instanceof MenuItemCannotResumeError) {
    return apiError(409, "MENU_ITEM_CANNOT_RESUME", error.message);
  }

  console.error("Unexpected menu-items API error", error);

  return apiError(500, "INTERNAL_SERVER_ERROR", "Внутренняя ошибка сервера");
};
