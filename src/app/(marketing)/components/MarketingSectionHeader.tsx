type MarketingSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function MarketingSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: MarketingSectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const descriptionClass = align === "center" ? "mx-auto max-w-2xl" : "max-w-xl";

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold text-[var(--foreground)] md:text-4xl">{title}</h2>
      {description ? (
        <p className={`text-base text-[var(--muted-foreground)] ${descriptionClass}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
