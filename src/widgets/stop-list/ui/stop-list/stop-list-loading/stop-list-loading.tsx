export function StopListLoading() {
  return (
    <div
      aria-label="Загрузка позиций меню"
      className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white"
      role="status"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          className="grid grid-cols-[2fr_1fr_0.6fr_1fr_2fr_1fr] gap-4 border-b border-neutral-100 px-5 py-5 last:border-b-0"
          key={index}
        >
          {Array.from({ length: 6 }, (__, cellIndex) => (
            <span
              className="h-4 animate-pulse rounded bg-neutral-200"
              key={cellIndex}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">Загружаем список меню</span>
    </div>
  );
}
