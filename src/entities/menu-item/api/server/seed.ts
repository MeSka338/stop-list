import { menuItemsSchema } from "../../model/schemas";
import { createMenuItemSeedData } from "./menu-item-seed-data";

export const createMenuItemSeed = (now = new Date()) => {
  const updatedAt = now.toISOString();

  return menuItemsSchema.parse(createMenuItemSeedData(now, updatedAt));
};
