import { menuItemSchema } from "../../model/schemas";
import type {
  MenuItem,
  MenuItemsFilter,
  StopItemPayload,
} from "../../model/types";
import { MenuItemCannotResumeError, MenuItemNotFoundError } from "./errors";
import { createMenuItemSeed } from "./seed";

interface MenuStoreGlobal {
  __stopListMenuItems?: MenuItem[];
}

const globalMenuStore = globalThis as typeof globalThis & MenuStoreGlobal;

const menuItems =
  globalMenuStore.__stopListMenuItems ??
  (globalMenuStore.__stopListMenuItems = createMenuItemSeed());

const cloneMenuItem = (menuItem: MenuItem): MenuItem =>
  structuredClone(menuItem);

const getMenuItemIndex = (id: string) => {
  const index = menuItems.findIndex((menuItem) => menuItem.id === id);

  if (index === -1) {
    throw new MenuItemNotFoundError(id);
  }

  return index;
};

export const getMenuItems = (filters: MenuItemsFilter = {}): MenuItem[] =>
  menuItems
    .filter((menuItem) => !filters.shop || menuItem.shop === filters.shop)
    .filter(
      (menuItem) => !filters.status || menuItem.status.kind === filters.status,
    )
    .map(cloneMenuItem);

export const stopMenuItem = (
  id: string,
  payload: StopItemPayload,
): MenuItem => {
  const index = getMenuItemIndex(id);
  const currentItem = menuItems[index];
  const updatedItem = menuItemSchema.parse({
    ...currentItem,
    status: {
      kind: "stopped",
      ...payload,
    },
    updatedAt: new Date().toISOString(),
  });

  menuItems[index] = updatedItem;

  return cloneMenuItem(updatedItem);
};

export const resumeMenuItem = (id: string): MenuItem => {
  const index = getMenuItemIndex(id);
  const currentItem = menuItems[index];

  if (currentItem.stock === 0) {
    throw new MenuItemCannotResumeError();
  }

  const updatedItem = menuItemSchema.parse({
    ...currentItem,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  });

  menuItems[index] = updatedItem;

  return cloneMenuItem(updatedItem);
};
