import { z } from "zod";

import {
  MAX_STOP_AHEAD_HOURS,
  MAX_STOP_AHEAD_MS,
  MENU_ITEM_STATUSES,
  SHOPS,
  STOP_REASONS,
  STOP_TIME_STEP_MINUTES,
  STOP_TIME_STEP_MS,
} from "./constants";

export const shopSchema = z.enum(SHOPS);
export const stopReasonSchema = z.enum(STOP_REASONS, {
  error: "Выберите причину",
});
export const menuItemStatusKindSchema = z.enum(MENU_ITEM_STATUSES);

export const availableMenuItemStatusSchema = z.object({
  kind: z.literal("available"),
});

export const stoppedMenuItemStatusSchema = z.object({
  kind: z.literal("stopped"),
  reason: stopReasonSchema,
  until: z.iso.datetime({ offset: true }).nullable(),
});

export const menuItemStatusSchema = z.discriminatedUnion("kind", [
  availableMenuItemStatusSchema,
  stoppedMenuItemStatusSchema,
]);

export const menuItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  shop: shopSchema,
  stock: z.number().int().min(0).max(99),
  status: menuItemStatusSchema,
  updatedAt: z.iso.datetime({ offset: true }),
});

export const menuItemsSchema = z.array(menuItemSchema);

export const stopItemPayloadSchema = z
  .object({
    reason: stopReasonSchema,
    until: z.iso.datetime({ offset: true }).nullable(),
  })
  .superRefine(({ until }, context) => {
    if (until === null) {
      return;
    }

    const now = Date.now();
    const timestamp = Date.parse(until);

    if (timestamp <= now) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Срок должен быть в будущем",
      });
    }

    if (timestamp > now + MAX_STOP_AHEAD_MS) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: `Срок должен быть не позднее чем через ${MAX_STOP_AHEAD_HOURS} часа`,
      });
    }

    if (timestamp % STOP_TIME_STEP_MS !== 0) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: `Время должно быть кратно ${STOP_TIME_STEP_MINUTES} минутам`,
      });
    }
  });

export const menuItemsFilterSchema = z.object({
  shop: shopSchema.optional(),
  status: menuItemStatusKindSchema.optional(),
});
