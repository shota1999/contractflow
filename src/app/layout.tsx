import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: {
    default: "ContractFlow AI",
    template: "%s | ContractFlow AI",
  },
  description:
    "ContractFlow AI is an enterprise platform for automating contract and proposal workflows with policy-aware intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
