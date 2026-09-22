import type { MenuItem, MenuItemsFilter } from "@/entities/menu-item";

const matchesFilters = (menuItem: MenuItem, filters: MenuItemsFilter) =>
  (!filters.shop || menuItem.shop === filters.shop) &&
  (!filters.status || menuItem.status.kind === filters.status);

export const updateMenuItemInList = (
  menuItems: MenuItem[] | undefined,
  updatedItem: MenuItem,
  filters: MenuItemsFilter,
) =>
  (menuItems ?? [])
    .map((menuItem) =>
      menuItem.id === updatedItem.id ? updatedItem : menuItem,
    )
    .filter((menuItem) => matchesFilters(menuItem, filters));

export const restoreMenuItemInList = (
  currentMenuItems: MenuItem[] | undefined,
  previousMenuItems: MenuItem[] | undefined,
  itemId: string,
) => {
  if (!currentMenuItems) {
    return previousMenuItems;
  }

  const previousItem = previousMenuItems?.find(
    (menuItem) => menuItem.id === itemId,
  );
  const restoredMenuItems = currentMenuItems.filter(
    (menuItem) => menuItem.id !== itemId,
  );

  if (!previousItem) {
    return restoredMenuItems;
  }

  const previousIndex =
    previousMenuItems?.findIndex((menuItem) => menuItem.id === itemId) ?? 0;

  restoredMenuItems.splice(
    Math.min(previousIndex, restoredMenuItems.length),
    0,
    previousItem,
  );

  return restoredMenuItems;
};
