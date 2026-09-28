import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-page mx-auto px-4 pt-12 pb-4">
      <p className="text-sm font-semibold text-muted m-0">404</p>
      <h1 className="text-3xl font-bold leading-tight text-ink mt-1 mb-3">Page not found</h1>
      <p className="text-base leading-relaxed text-ink m-0 mb-6">
        That page doesn&apos;t exist — but every free program for Memphis
        families is one tap away.
      </p>
      <Link
        href="/"
        className="inline-flex items-center h-11 px-5 rounded bg-primary text-white text-base font-semibold no-underline hover:bg-primary-dark"
      >
        Back to the guide
      </Link>
    </div>
  );
}
