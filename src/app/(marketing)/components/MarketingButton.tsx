"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { trackMarketingEvent } from "@/lib/marketing/analytics";

type MarketingButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  trackingSource?: string;
};

const variantStyles: Record<NonNullable<MarketingButtonProps["variant"]>, string> = {
  primary: "bg-[#4032C8] text-white hover:bg-[#3528ae]",
  secondary:
    "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-2)]",
  ghost: "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
};

const sizeStyles: Record<NonNullable<MarketingButtonProps["size"]>, string> = {
  sm: "h-10 px-4 text-xs",
  md: "h-12 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
};

export function MarketingButton({
  variant = "primary",
  size = "md",
  className = "",
  trackingSource,
  onClick,
  ...props
}: MarketingButtonProps) {
  const handleClick: MarketingButtonProps["onClick"] = (event) => {
    const fallbackSource =
      typeof props.href === "string"
        ? props.href
        : "pathname" in props.href && props.href.pathname
          ? props.href.pathname
          : undefined;

    const source = trackingSource ?? fallbackSource;

    if (source) {
      trackMarketingEvent("marketing_cta_click", { source });
    }

    onClick?.(event);
  };

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-[0.16em] shadow-[var(--shadow-min)] transition ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    />
  );
}
