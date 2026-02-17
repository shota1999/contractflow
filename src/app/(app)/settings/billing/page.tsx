import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function BillingPage() {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge label="Billing" tone="brand" />
        <span className="text-sm text-[var(--muted-foreground)]">Coming soon</span>
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        Billing and invoicing controls.
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Manage plans, invoices, and contract-driven spend here.
      </p>
    </Card>
  );
}
