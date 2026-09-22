"use client";

import {
  MENU_ITEM_STATUSES,
  MENU_ITEM_STATUS_LABELS,
  menuItemStatusKindSchema,
  SHOPS,
  SHOP_LABELS,
  shopSchema,
} from "@/entities/menu-item";
import type {
  MenuItemStatusKind,
  MenuItemsFilter,
  Shop,
} from "@/entities/menu-item";
import { Button, Select } from "@/shared/ui";

const SHOP_OPTIONS = [
  { label: "Все цеха", value: "" },
  ...SHOPS.map((shop) => ({ label: SHOP_LABELS[shop], value: shop })),
];

const STATUS_OPTIONS = [
  { label: "Все статусы", value: "" },
  ...MENU_ITEM_STATUSES.map((status) => ({
    label: MENU_ITEM_STATUS_LABELS[status],
    value: status,
  })),
];

interface MenuFiltersProps {
  filters: MenuItemsFilter;
  isPending: boolean;
  onReset: () => void;
  onShopChange: (shop?: Shop) => void;
  onStatusChange: (status?: MenuItemStatusKind) => void;
}

export function MenuFilters({
  filters,
  isPending,
  onReset,
  onShopChange,
  onStatusChange,
}: MenuFiltersProps) {
  const hasFilters = Boolean(filters.shop || filters.status);

  return (
    <section aria-label="Фильтры меню" className="mt-8">
      <div className="flex flex-wrap items-end gap-4">
        <div className="grid gap-1.5 text-sm font-medium text-neutral-700">
          <label htmlFor="shop-filter">Цех</label>
          <Select
            className="min-w-52"
            disabled={isPending}
            id="shop-filter"
            options={SHOP_OPTIONS}
            placeholder="Все цеха"
            value={filters.shop ?? ""}
            onValueChange={(value) => {
              const result = shopSchema.safeParse(value);
              onShopChange(result.success ? result.data : undefined);
            }}
          />
        </div>

        <div className="grid gap-1.5 text-sm font-medium text-neutral-700">
          <label htmlFor="status-filter">Статус</label>
          <Select
            className="min-w-52"
            disabled={isPending}
            id="status-filter"
            options={STATUS_OPTIONS}
            placeholder="Все статусы"
            value={filters.status ?? ""}
            onValueChange={(value) => {
              const result = menuItemStatusKindSchema.safeParse(value);
              onStatusChange(result.success ? result.data : undefined);
            }}
          />
        </div>

        <Button
          disabled={!hasFilters || isPending}
          variant="ghost"
          onClick={onReset}
        >
          Сбросить
        </Button>
      </div>
    </section>
  );
}
