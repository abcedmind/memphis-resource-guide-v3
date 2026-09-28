"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-page mx-auto px-4 pt-12 pb-4">
      <h1 className="text-3xl font-bold leading-tight text-ink m-0 mb-3">
        Something went wrong
      </h1>
      <p className="text-base leading-relaxed text-ink m-0 mb-6">
        Sorry — the guide hit a snag. Your connection may be limited; the
        resources themselves haven&apos;t gone anywhere. You can also always
        dial 2-1-1 for help finding services.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center h-11 px-5 rounded bg-primary text-white text-base font-semibold hover:bg-primary-dark"
      >
        Try again
      </button>
    </div>
  );
}
