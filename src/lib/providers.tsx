"use client";

import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { makeStore, AppStore } from "@/lib/store";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
