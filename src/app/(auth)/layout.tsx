export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.08),transparent_60%)] px-4 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}
