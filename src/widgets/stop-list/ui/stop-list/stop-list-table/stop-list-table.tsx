import {
  MenuItemStatusBadge,
  SHOP_LABELS,
  STOP_REASON_LABELS,
} from "@/entities/menu-item";
import type { MenuItem } from "@/entities/menu-item";
import { cn } from "@/shared/lib/cn";
import { Button, Spinner } from "@/shared/ui";

interface StopListTableProps {
  menuItems: MenuItem[];
  savingItemIds: ReadonlySet<string>;
  onOpenStopPanel: (menuItem: MenuItem) => void;
  onResumeItem: (id: string) => void;
}

const stopUntilFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const getStopPeriodLabel = (until: string | null) =>
  until === null
    ? "До конца смены"
    : `До ${stopUntilFormatter.format(new Date(until))}`;

const gridColumns =
  "grid-cols-[minmax(220px,1.6fr)_minmax(120px,0.8fr)_minmax(100px,0.6fr)_minmax(140px,0.8fr)_minmax(210px,1.2fr)_minmax(210px,1fr)]";

export function StopListTable({
  menuItems,
  savingItemIds,
  onOpenStopPanel,
  onResumeItem,
}: StopListTableProps) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div aria-label="Стоп-лист" className="min-w-[1070px]" role="table">
        <div
          className={cn(
            "grid bg-neutral-50 text-xs font-semibold tracking-wide text-neutral-500 uppercase",
            gridColumns,
          )}
          role="row"
        >
          <div className="px-5 py-4" role="columnheader">
            Позиция
          </div>
          <div className="px-5 py-4" role="columnheader">
            Цех
          </div>
          <div className="px-5 py-4" role="columnheader">
            Остаток
          </div>
          <div className="px-5 py-4" role="columnheader">
            Статус
          </div>
          <div className="px-5 py-4" role="columnheader">
            Причина и срок
          </div>
          <div className="px-5 py-4 text-right" role="columnheader">
            Действие
          </div>
        </div>
        <div role="rowgroup">
          {menuItems.map((menuItem) => {
            const stoppedStatus =
              menuItem.status.kind === "stopped" ? menuItem.status : null;
            const isStopped = stoppedStatus !== null;
            const isSaving = savingItemIds.has(menuItem.id);
            const cannotResume = isStopped && menuItem.stock === 0;

            return (
              <div
                className={cn(
                  "grid border-t border-neutral-100 transition-colors",
                  gridColumns,
                  isStopped ? "bg-neutral-50 text-neutral-600" : "bg-white",
                )}
                key={menuItem.id}
                role="row"
              >
                <div
                  className="px-5 py-4 font-medium text-neutral-950"
                  role="rowheader"
                >
                  <span>{menuItem.title}</span>
                  {isSaving ? (
                    <span className="mt-1 flex items-center gap-1.5 text-xs font-normal text-amber-700">
                      <Spinner className="size-3" />
                      Сохраняется
                    </span>
                  ) : null}
                </div>
                <div className="px-5 py-4 text-sm" role="cell">
                  {SHOP_LABELS[menuItem.shop]}
                </div>
                <div className="px-5 py-4 text-sm" role="cell">
                  <span
                    className={cn(
                      "font-medium",
                      menuItem.stock === 0 && "text-red-600",
                    )}
                  >
                    {menuItem.stock} шт.
                  </span>
                </div>
                <div className="px-5 py-4" role="cell">
                  <MenuItemStatusBadge status={menuItem.status} />
                </div>
                <div className="px-5 py-4 text-sm" role="cell">
                  {isStopped ? (
                    <div>
                      <p className="font-medium text-neutral-800">
                        {STOP_REASON_LABELS[stoppedStatus.reason]}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {getStopPeriodLabel(stoppedStatus.until)}
                      </p>
                    </div>
                  ) : (
                    <span aria-label="Причина отсутствует">—</span>
                  )}
                </div>
                <div className="px-5 py-4 text-right" role="cell">
                  {isSaving ? (
                    <Button disabled>
                      <Spinner />
                      Сохраняется
                    </Button>
                  ) : isStopped ? (
                    <div className="ml-auto flex w-full max-w-44 flex-col gap-2">
                      <Button
                        className="w-full whitespace-nowrap"
                        variant="ghost"
                        onClick={() => onOpenStopPanel(menuItem)}
                      >
                        Изменить
                      </Button>
                      <Button
                        className="w-full whitespace-nowrap"
                        aria-describedby={
                          cannotResume
                            ? `resume-disabled-${menuItem.id}`
                            : undefined
                        }
                        aria-disabled={cannotResume}
                        onClick={() => {
                          if (!cannotResume) {
                            onResumeItem(menuItem.id);
                          }
                        }}
                      >
                        Вернуть в продажу
                      </Button>
                      {cannotResume ? (
                        <span
                          className="sr-only"
                          id={`resume-disabled-${menuItem.id}`}
                        >
                          Нельзя вернуть позицию с нулевым остатком
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => onOpenStopPanel(menuItem)}
                    >
                      В стоп-лист
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
