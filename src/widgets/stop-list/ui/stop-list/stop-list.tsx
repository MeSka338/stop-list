"use client";

import { useMutationState, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { menuItemsQueryOptions } from "@/entities/menu-item";
import type { MenuItem } from "@/entities/menu-item";
import { MenuFilters, useMenuFilters } from "@/features/filter-menu-items";
import {
  menuItemMutationKeys,
  selectOpenStopPanel,
  StopReasonPanel,
  useResumeItem,
  useStopPanelStore,
} from "@/features/manage-stop-item";
import { StopListEmpty } from "./stop-list-empty";
import { StopListError } from "./stop-list-error";
import { StopListLoading } from "./stop-list-loading";
import { StopListTable } from "./stop-list-table";

const getMutationItemId = (variables: unknown) => {
  if (typeof variables !== "object" || variables === null) {
    return null;
  }

  const id = Reflect.get(variables, "id");

  return typeof id === "string" ? id : null;
};

export function StopList() {
  const { filters, isPending, resetFilters, setShop, setStatus } =
    useMenuFilters();
  const menuItemsQuery = useQuery(menuItemsQueryOptions(filters));
  const resumeMutation = useResumeItem(filters);
  const openStopPanel = useStopPanelStore(selectOpenStopPanel);
  const [panelMenuItem, setPanelMenuItem] = useState<MenuItem | null>(null);
  const pendingItemIds = useMutationState({
    filters: {
      mutationKey: menuItemMutationKeys.all,
      status: "pending",
    },
    select: (mutation) => getMutationItemId(mutation.state.variables),
  });
  const savingItemIds = useMemo(
    () => new Set(pendingItemIds.filter((id): id is string => id !== null)),
    [pendingItemIds],
  );

  const menuItems = menuItemsQuery.data;
  const stoppedCount =
    menuItems?.filter((menuItem) => menuItem.status.kind === "stopped")
      .length ?? 0;
  const hasFilters = Boolean(filters.shop || filters.status);

  const handleOpenStopPanel = (menuItem: MenuItem) => {
    setPanelMenuItem(menuItem);
    openStopPanel(menuItem);
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Стоп-лист
          </h1>
        </div>

        {menuItems ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-right shadow-sm">
            <p className="text-xs font-medium text-neutral-500">В стоп-листе</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-950">
              {stoppedCount} из {menuItems.length}
            </p>
          </div>
        ) : null}
      </div>

      <MenuFilters
        filters={filters}
        isPending={isPending}
        onReset={resetFilters}
        onShopChange={setShop}
        onStatusChange={setStatus}
      />

      {menuItemsQuery.isPending ? <StopListLoading /> : null}

      {menuItemsQuery.isError && !menuItems ? (
        <StopListError
          message={
            menuItemsQuery.error instanceof Error
              ? menuItemsQuery.error.message
              : "Произошла неизвестная ошибка"
          }
          onRetry={() => void menuItemsQuery.refetch()}
        />
      ) : null}

      {menuItems && menuItems.length === 0 ? (
        <StopListEmpty hasFilters={hasFilters} onResetFilters={resetFilters} />
      ) : null}

      {menuItems && menuItems.length > 0 ? (
        <>
          <StopListTable
            menuItems={menuItems}
            savingItemIds={savingItemIds}
            onOpenStopPanel={handleOpenStopPanel}
            onResumeItem={(id) => resumeMutation.mutate({ id })}
          />
        </>
      ) : null}

      <StopReasonPanel filters={filters} menuItem={panelMenuItem} />
    </main>
  );
}
