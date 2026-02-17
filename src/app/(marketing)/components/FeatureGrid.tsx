import { Card } from "@/components/ui/Card";

type FeatureItem = {
  title: string;
  description: string;
};

type FeatureGridProps = {
  items: FeatureItem[];
  columns?: 1 | 2 | 3 | 4;
};

const columnStyles: Record<NonNullable<FeatureGridProps["columns"]>, string> = {
  1: "grid gap-4",
  2: "grid gap-6 md:grid-cols-2",
  3: "grid gap-6 md:grid-cols-3",
  4: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  return (
    <div className={columnStyles[columns]}>
      {items.map((item) => (
        <Card key={item.title} className="p-6">
          <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
