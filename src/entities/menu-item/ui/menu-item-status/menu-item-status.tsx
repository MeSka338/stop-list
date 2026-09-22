import { cn } from "@/shared/lib/cn";

import { MENU_ITEM_STATUS_LABELS } from "../../model/constants";
import type { MenuItemStatus } from "../../model/types";

interface MenuItemStatusBadgeProps {
  status: MenuItemStatus;
}

export function MenuItemStatusBadge({ status }: MenuItemStatusBadgeProps) {
  const isStopped = status.kind === "stopped";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        isStopped
          ? "bg-red-100 text-red-700"
          : "bg-emerald-100 text-emerald-700",
      )}
    >
      {MENU_ITEM_STATUS_LABELS[status.kind]}
    </span>
  );
}
