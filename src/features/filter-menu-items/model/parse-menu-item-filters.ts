import { menuItemStatusKindSchema, shopSchema } from "@/entities/menu-item";
import type { MenuItemsFilter } from "@/entities/menu-item";

interface SearchParamsReader {
  get(name: string): string | null;
}

export const parseMenuItemFilters = (
  searchParams: SearchParamsReader,
): MenuItemsFilter => {
  const shopResult = shopSchema.safeParse(searchParams.get("shop"));
  const statusResult = menuItemStatusKindSchema.safeParse(
    searchParams.get("status"),
  );

  return {
    ...(shopResult.success ? { shop: shopResult.data } : {}),
    ...(statusResult.success ? { status: statusResult.data } : {}),
  };
};
