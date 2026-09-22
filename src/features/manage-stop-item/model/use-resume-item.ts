"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { menuItemKeys, resumeMenuItemRequest } from "@/entities/menu-item";
import type { MenuItem, MenuItemsFilter } from "@/entities/menu-item";
import { showErrorToast } from "@/shared/ui";

import {
  restoreMenuItemInList,
  updateMenuItemInList,
} from "./optimistic-menu-items";
import { menuItemMutationKeys } from "./mutation-keys";
import { getMutationErrorMessage } from "./mutation-error";

export const useResumeItem = (filters: MenuItemsFilter) => {
  const queryClient = useQueryClient();
  const queryKey = menuItemKeys.list(filters);

  return useMutation({
    mutationKey: menuItemMutationKeys.resume(),
    mutationFn: resumeMenuItemRequest,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousMenuItems = queryClient.getQueryData<MenuItem[]>(queryKey);
      const currentItem = previousMenuItems?.find(
        (menuItem) => menuItem.id === id,
      );

      if (currentItem) {
        queryClient.setQueryData<MenuItem[]>(queryKey, (menuItems) =>
          updateMenuItemInList(
            menuItems,
            {
              ...currentItem,
              status: { kind: "available" },
              updatedAt: new Date().toISOString(),
            },
            filters,
          ),
        );
      }

      return { previousMenuItems };
    },
    onError: (error, { id }, context) => {
      if (context) {
        queryClient.setQueryData<MenuItem[]>(queryKey, (menuItems) =>
          restoreMenuItemInList(menuItems, context.previousMenuItems, id),
        );
      }

      showErrorToast(
        getMutationErrorMessage(
          error,
          "Не удалось вернуть позицию в продажу",
        ),
      );
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<MenuItem[]>(queryKey, (menuItems) =>
        updateMenuItemInList(menuItems, updatedItem, filters),
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() }),
  });
};
