import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "default" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[color:var(--brand)] bg-[color:var(--brand)] text-[color:var(--brand-foreground)] shadow-[var(--shadow-min)] transition hover:brightness-105",
  secondary:
    "border-[color:var(--border)] bg-[var(--surface)] text-[color:var(--foreground)] shadow-[var(--shadow-min)] hover:bg-[var(--surface-2)]",
  destructive:
    "border-[color:var(--danger)] text-[color:var(--danger)] hover:bg-[color:var(--danger)]/10",
  ghost: "border-transparent bg-transparent text-[color:var(--foreground)] hover:bg-[var(--surface-2)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  default: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-[var(--radius-md)] border font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/25 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    if (props.disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {props.children}
        </span>
      );
    }

    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...props}
    />
  );
}
