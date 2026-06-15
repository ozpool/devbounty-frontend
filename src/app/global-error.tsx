"use client";

// Replaces the root layout when an error escapes it, so it needs its own
// <html>/<body> and can't rely on global styles being present.
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
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0c",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h2>
        <p style={{ color: "#a1a1aa", marginTop: "0.5rem" }}>
          The app hit an unexpected error.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#23d18b",
            color: "#06140d",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
