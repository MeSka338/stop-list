export const SHOPS = ["kitchen", "bar", "pastry"] as const;

export const SHOP_LABELS = {
  kitchen: "Кухня",
  bar: "Бар",
  pastry: "Кондитерская",
} as const satisfies Record<(typeof SHOPS)[number], string>;

export const STOP_REASONS = [
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
] as const;

export const STOP_REASON_LABELS = {
  out_of_stock: "Закончились продукты",
  equipment: "Сломалось оборудование",
  quality: "Вопросы к качеству партии",
  menu_change: "Позиция выведена из меню смены",
} as const satisfies Record<(typeof STOP_REASONS)[number], string>;

export const MENU_ITEM_STATUSES = ["available", "stopped"] as const;

export const MENU_ITEM_STATUS_LABELS = {
  available: "В продаже",
  stopped: "В стоп-листе",
} as const satisfies Record<(typeof MENU_ITEM_STATUSES)[number], string>;

export const STOP_TIME_STEP_MINUTES = 15;
export const MAX_STOP_AHEAD_HOURS = 24;

export const STOP_TIME_STEP_MS = STOP_TIME_STEP_MINUTES * 60 * 1_000;
export const MAX_STOP_AHEAD_MS = MAX_STOP_AHEAD_HOURS * 60 * 60 * 1_000;
