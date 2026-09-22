import { Button } from "@/shared/ui";

interface StopListEmptyProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function StopListEmpty({
  hasFilters,
  onResetFilters,
}: StopListEmptyProps) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
      <h2 className="font-semibold text-neutral-900">Позиции не найдены</h2>
      <p className="mt-1 text-sm text-neutral-600">
        {hasFilters
          ? "Попробуйте изменить или сбросить фильтры."
          : "В меню пока нет ни одной позиции."}
      </p>
      {hasFilters ? (
        <Button className="mt-4" onClick={onResetFilters}>
          Сбросить фильтры
        </Button>
      ) : null}
    </div>
  );
}
