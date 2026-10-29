import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grain flex min-h-screen items-center bg-ink px-6 text-paper">
      <div className="mx-auto w-full max-w-md space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">404</p>
        <h1 className="font-display text-4xl font-semibold">Bu sayfa yok.</h1>
        <p className="text-muted">Link eski olabilir ya da yanlış yazılmış olabilir.</p>
        <Link href="/" className="inline-block font-semibold text-accent hover:underline">
          Ana sayfaya dön →
        </Link>
      </div>
    </div>
  );
}
