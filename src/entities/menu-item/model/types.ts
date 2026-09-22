import type { z } from "zod";

import type {
  availableMenuItemStatusSchema,
  menuItemSchema,
  menuItemsFilterSchema,
  menuItemStatusKindSchema,
  menuItemStatusSchema,
  shopSchema,
  stoppedMenuItemStatusSchema,
  stopItemPayloadSchema,
  stopReasonSchema,
} from "./schemas";

export type Shop = z.infer<typeof shopSchema>;
export type StopReason = z.infer<typeof stopReasonSchema>;
export type MenuItemStatusKind = z.infer<typeof menuItemStatusKindSchema>;
export type AvailableMenuItemStatus = z.infer<
  typeof availableMenuItemStatusSchema
>;
export type StoppedMenuItemStatus = z.infer<typeof stoppedMenuItemStatusSchema>;
export type MenuItemStatus = z.infer<typeof menuItemStatusSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type StopItemPayload = z.infer<typeof stopItemPayloadSchema>;
export type MenuItemsFilter = z.infer<typeof menuItemsFilterSchema>;
