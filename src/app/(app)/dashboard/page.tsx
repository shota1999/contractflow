export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <section className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-min)] md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[color:var(--brand)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
              Dashboard
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Executive overview
            </span>
            <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
              Coming soon
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Executive overview is loading.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
            We will surface KPIs, contract velocity, approval bottlenecks, and risk insights in a
            single control center.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Active workflows", value: "—", detail: "Awaiting data" },
            { label: "Approvals at risk", value: "—", detail: "SLA monitoring" },
            { label: "Revenue impact", value: "—", detail: "Pipeline visibility" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-min)] transition hover:shadow-[var(--shadow-soft)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                {card.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-[var(--foreground)]">{card.value}</p>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">{card.detail}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-min)] md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Upcoming dashboards
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                Contract health & approvals
              </h2>
            </div>
            <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
              In progress
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Top clauses driving negotiation time",
              "Approvals by stakeholder and SLA",
              "Auditable decision trail coverage",
              "Risk trends across contract types",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
    </div>
  );
}
