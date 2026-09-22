import { STOP_TIME_STEP_MS } from "../../model/constants";
import type { MenuItemStatus, StopReason } from "../../model/types";

const HOUR_MS = 60 * 60 * 1_000;

const available = (): MenuItemStatus => ({ kind: "available" });

const stopped = (reason: StopReason, until: string | null): MenuItemStatus => ({
  kind: "stopped",
  reason,
  until,
});

const getFutureStopTime = (now: Date, hoursAhead: number) => {
  const timestamp = Math.ceil(
    (now.getTime() + hoursAhead * HOUR_MS) / STOP_TIME_STEP_MS,
  );

  return new Date(timestamp * STOP_TIME_STEP_MS).toISOString();
};

export const createMenuItemSeedData = (now: Date, updatedAt: string) => [
  {
    id: "beef-burger",
    title: "Бургер с говядиной",
    shop: "kitchen",
    stock: 18,
    status: available(),
    updatedAt,
  },
  {
    id: "carbonara",
    title: "Паста карбонара",
    shop: "kitchen",
    stock: 0,
    status: stopped("out_of_stock", null),
    updatedAt,
  },
  {
    id: "tom-yum",
    title: "Том-ям",
    shop: "kitchen",
    stock: 7,
    status: stopped("equipment", getFutureStopTime(now, 2)),
    updatedAt,
  },
  {
    id: "caesar-salad",
    title: "Салат цезарь",
    shop: "kitchen",
    stock: 12,
    status: available(),
    updatedAt,
  },
  {
    id: "french-fries",
    title: "Картофель фри",
    shop: "kitchen",
    stock: 4,
    status: stopped("quality", getFutureStopTime(now, 1)),
    updatedAt,
  },
  {
    id: "espresso",
    title: "Эспрессо",
    shop: "bar",
    stock: 40,
    status: available(),
    updatedAt,
  },
  {
    id: "cappuccino",
    title: "Капучино",
    shop: "bar",
    stock: 16,
    status: stopped("equipment", null),
    updatedAt,
  },
  {
    id: "citrus-lemonade",
    title: "Цитрусовый лимонад",
    shop: "bar",
    stock: 22,
    status: available(),
    updatedAt,
  },
  {
    id: "cranberry-mors",
    title: "Клюквенный морс",
    shop: "bar",
    stock: 0,
    status: stopped("out_of_stock", null),
    updatedAt,
  },
  {
    id: "sea-buckthorn-tea",
    title: "Облепиховый чай",
    shop: "bar",
    stock: 14,
    status: available(),
    updatedAt,
  },
  {
    id: "cheesecake",
    title: "Чизкейк",
    shop: "pastry",
    stock: 9,
    status: available(),
    updatedAt,
  },
  {
    id: "honey-cake",
    title: "Медовик",
    shop: "pastry",
    stock: 6,
    status: stopped("quality", getFutureStopTime(now, 3)),
    updatedAt,
  },
  {
    id: "croissant",
    title: "Круассан",
    shop: "pastry",
    stock: 20,
    status: available(),
    updatedAt,
  },
  {
    id: "tiramisu",
    title: "Тирамису",
    shop: "pastry",
    stock: 5,
    status: stopped("menu_change", null),
    updatedAt,
  },
  {
    id: "pistachio-eclair",
    title: "Фисташковый эклер",
    shop: "pastry",
    stock: 11,
    status: available(),
    updatedAt,
  },
];
