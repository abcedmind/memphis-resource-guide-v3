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
          background: "#faf7f2",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h2 style={{ color: "#1a1a2e", fontSize: 18 }}>
            Something went wrong
          </h2>
          <p style={{ color: "#888", fontSize: 13, margin: "8px 0 20px" }}>
            The guide hit a snag. Dial 2-1-1 anytime for help finding
            services.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#1a1a2e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 13,
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
