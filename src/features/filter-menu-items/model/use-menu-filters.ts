"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import type {
  MenuItemStatusKind,
  MenuItemsFilter,
  Shop,
} from "@/entities/menu-item";

import { parseMenuItemFilters } from "./parse-menu-item-filters";

export const useMenuFilters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => parseMenuItemFilters(searchParams),
    [searchParams],
  );

  const navigate = useCallback(
    (nextFilters: MenuItemsFilter) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      nextSearchParams.delete("shop");
      nextSearchParams.delete("status");

      if (nextFilters.shop) {
        nextSearchParams.set("shop", nextFilters.shop);
      }

      if (nextFilters.status) {
        nextSearchParams.set("status", nextFilters.status);
      }

      const query = nextSearchParams.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const setShop = useCallback(
    (shop?: Shop) => navigate({ ...filters, shop }),
    [filters, navigate],
  );

  const setStatus = useCallback(
    (status?: MenuItemStatusKind) => navigate({ ...filters, status }),
    [filters, navigate],
  );

  const resetFilters = useCallback(() => navigate({}), [navigate]);

  return {
    filters,
    isPending,
    resetFilters,
    setShop,
    setStatus,
  };
};
