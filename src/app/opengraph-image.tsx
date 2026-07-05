import { ImageResponse } from "next/og";
import { CHARS } from "@/lib/constants";

export const runtime = "edge";
export const alt =
  "Memphis Family Resource Guide — free programs for children & families";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CAT_COLORS = [
  "#4a7fcf",
  "#3aab7c",
  "#e07c45",
  "#9b59b6",
  "#2980b9",
  "#c0397b",
];

function Pixel({ stage, ps }: { stage: number; ps: number }) {
  const c = CHARS[stage];
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {c.rows.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {[...row].map((k, x) => (
            <div
              key={x}
              style={{
                width: ps,
                height: ps,
                background: c.colors[k] || "transparent",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1a1a2e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#6666aa",
            fontSize: 24,
            letterSpacing: 6,
            marginBottom: 18,
          }}
        >
          v3 · SHELBY COUNTY, TN
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 18,
            maxWidth: 800,
          }}
        >
          Memphis Family Resource Guide
        </div>
        <div style={{ color: "#8888bb", fontSize: 32, marginBottom: 44 }}>
          Free programs for children &amp; families · Ages 0–18
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {CAT_COLORS.map((c) => (
            <div
              key={c}
              style={{
                width: 44,
                height: 14,
                background: c,
                borderRadius: 7,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: 90,
            bottom: 80,
            display: "flex",
            alignItems: "flex-end",
            gap: 28,
          }}
        >
          <Pixel stage={0} ps={14} />
          <Pixel stage={2} ps={14} />
          <Pixel stage={4} ps={14} />
        </div>
      </div>
    ),
    { ...size }
  );
}
