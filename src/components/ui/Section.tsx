import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: "default" | "muted" | "gradient";
};

const toneStyles: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-transparent",
  muted: "bg-[var(--surface-2)]",
  gradient:
    "bg-[radial-gradient(circle_at_top,color-mix(in srgb,var(--brand) 18%,white 82%),transparent_60%)]",
};

export function Section({
  children,
  className = "",
  tone = "default",
  ...props
}: SectionProps) {
  return (
    <section className={`${toneStyles[tone]} py-16 md:py-20 ${className}`} {...props}>
      {children}
    </section>
  );
}
