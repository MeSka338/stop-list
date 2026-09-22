import { apiRequest } from "@/shared/api";

import type {
  MenuItem,
  MenuItemsFilter,
  StopItemPayload,
} from "../model/types";

export interface StopMenuItemVariables {
  id: string;
  payload: StopItemPayload;
}

export interface ResumeMenuItemVariables {
  id: string;
}

export const fetchMenuItems = (filters: MenuItemsFilter = {}) => {
  const searchParams = new URLSearchParams();

  if (filters.shop) {
    searchParams.set("shop", filters.shop);
  }

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  const query = searchParams.toString();
  const url = query ? `/api/menu-items?${query}` : "/api/menu-items";

  return apiRequest<MenuItem[]>(url, { cache: "no-store" });
};

export const stopMenuItemRequest = ({ id, payload }: StopMenuItemVariables) =>
  apiRequest<MenuItem>(`/api/menu-items/${encodeURIComponent(id)}/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const resumeMenuItemRequest = ({ id }: ResumeMenuItemVariables) =>
  apiRequest<MenuItem>(`/api/menu-items/${encodeURIComponent(id)}/resume`, {
    method: "POST",
  });
