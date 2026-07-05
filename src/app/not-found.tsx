import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="text-[40px] mb-2.5" aria-hidden="true">🔎</div>
      <h2 className="text-lg font-extrabold text-ink mb-2">Page not found</h2>
      <p className="text-[13px] text-[#888] leading-relaxed max-w-[360px] mx-auto mb-5">
        That page doesn&apos;t exist — but every free program for Memphis
        families is one tap away.
      </p>
      <Link
        href="/"
        className="inline-block bg-ink text-white rounded-lg px-5 py-2.5 text-[13px]"
      >
        ← Back to the guide
      </Link>
    </div>
  );
}
