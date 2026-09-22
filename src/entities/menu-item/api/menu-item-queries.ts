import { queryOptions } from "@tanstack/react-query";

import type { MenuItemsFilter } from "../model/types";
import { fetchMenuItems } from "./menu-item-api";

const normalizeFilters = (filters: MenuItemsFilter) => ({
  shop: filters.shop ?? null,
  status: filters.status ?? null,
});

export const menuItemKeys = {
  all: ["menu-items"] as const,
  lists: () => [...menuItemKeys.all, "list"] as const,
  list: (filters: MenuItemsFilter = {}) =>
    [...menuItemKeys.lists(), normalizeFilters(filters)] as const,
};

export const menuItemsQueryOptions = (filters: MenuItemsFilter = {}) =>
  queryOptions({
    queryKey: menuItemKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
  });
