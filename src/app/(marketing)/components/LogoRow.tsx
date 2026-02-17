type LogoRowProps = {
  logos: string[];
};

export function LogoRow({ logos }: LogoRowProps) {
  return (
    <div className="flex flex-wrap gap-3 text-sm font-medium text-[var(--muted-foreground)]">
      {logos.map((logo) => (
        <span
          key={logo}
          className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2"
        >
          {logo}
        </span>
      ))}
    </div>
  );
}
