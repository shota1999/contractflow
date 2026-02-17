import { Suspense } from "react";
import { ResetPasswordClient } from "@/components/auth/ResetPasswordClient";
import { LoadingState } from "@/components/ui/LoadingState";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Suspense fallback={<LoadingState label="Loading reset form..." />}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}
