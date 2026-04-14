import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ReadinessDiagnosticClient } from "./ReadinessDiagnosticClient";

export default function ReadinessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <ReadinessDiagnosticClient />
    </Suspense>
  );
}
