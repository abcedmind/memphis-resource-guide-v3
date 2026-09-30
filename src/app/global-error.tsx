"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#f4f4f4",
          color: "#1b1f24",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          minHeight: "100vh",
          margin: 0,
          padding: "48px 16px",
        }}
      >
        <div style={{ maxWidth: 736, margin: "0 auto" }}>
          <h1 style={{ fontSize: 30, lineHeight: 1.2, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 24px" }}>
            The guide hit a snag. Dial 2-1-1 anytime for help finding
            services.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#1d5a8e",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              height: 44,
              padding: "0 20px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
