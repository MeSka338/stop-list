import { Button } from "@/shared/ui";

interface StopListErrorProps {
  message: string;
  onRetry: () => void;
}

export function StopListError({ message, onRetry }: StopListErrorProps) {
  return (
    <div
      className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6"
      role="alert"
    >
      <h2 className="font-semibold text-red-900">Не удалось загрузить меню</h2>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <Button className="mt-4" onClick={onRetry}>
        Попробовать снова
      </Button>
    </div>
  );
}
