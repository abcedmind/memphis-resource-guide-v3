"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="text-[40px] mb-2.5" aria-hidden="true">⚠</div>
      <h2 className="font-display text-lg font-extrabold text-ink mb-2">
        Something went wrong
      </h2>
      <p className="text-[13px] text-[#888] leading-relaxed max-w-[360px] mx-auto mb-5">
        Sorry — the guide hit a snag. Your connection may be limited; the
        resources themselves haven&apos;t gone anywhere. You can also always
        dial 2-1-1 for help finding services.
      </p>
      <button
        onClick={reset}
        className="bg-ink text-white rounded-button px-5 py-2.5 text-[13px]"
      >
        Try again
      </button>
    </div>
  );
}
