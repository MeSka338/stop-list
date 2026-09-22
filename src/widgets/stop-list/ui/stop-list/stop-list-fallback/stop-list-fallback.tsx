import { StopListLoading } from "../stop-list-loading";

export function StopListFallback() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="h-5 w-36 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-10 w-56 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-neutral-200" />
      <div className="mt-8 flex gap-4">
        <div className="h-16 w-52 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-16 w-52 animate-pulse rounded-lg bg-neutral-200" />
      </div>
      <StopListLoading />
    </main>
  );
}
