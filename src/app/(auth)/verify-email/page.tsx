import { Suspense } from "react";
import { VerifyEmailClient } from "@/components/auth/VerifyEmailClient";
import { LoadingState } from "@/components/ui/LoadingState";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Suspense fallback={<LoadingState label="Loading verification..." />}>
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}
