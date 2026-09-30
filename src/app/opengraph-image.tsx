import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Memphis Family Resource Guide — free programs for children & families";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          borderTop: "16px solid #1d5a8e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#525559", fontSize: 30, marginBottom: 20 }}>
          Shelby County, Tennessee
        </div>
        <div
          style={{
            color: "#1b1f24",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          Memphis Family Resource Guide
        </div>
        <div style={{ color: "#525559", fontSize: 36 }}>
          Free programs for children &amp; families · Ages 0–18
        </div>
      </div>
    ),
    { ...size }
  );
}
