import { Suspense } from "react";
import { SignupClient } from "@/components/auth/SignupClient";
import { LoadingState } from "@/components/ui/LoadingState";

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading signup..." />}>
      <SignupClient />
    </Suspense>
  );
}
