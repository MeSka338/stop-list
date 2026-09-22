import { Suspense } from "react";

import { StopList, StopListFallback } from "@/widgets/stop-list";

export default function HomePage() {
  return (
    <Suspense fallback={<StopListFallback />}>
      <StopList />
    </Suspense>
  );
}
