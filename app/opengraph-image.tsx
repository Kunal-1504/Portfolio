import { ImageResponse } from "next/og";
export const alt =
  "Kunal Deshmukh — AI Engineer. A little human. A little AI. A lot of possibility.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
        background: "linear-gradient(120deg,#faf9f6,#ede9f7,#edf4ef)",
        fontFamily: "sans-serif",
        color: "#282828",
      }}
    >
      <div style={{ display: "flex", fontSize: 27, marginBottom: 30 }}>
        Hey, I’m Kunal 👋
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 112,
          fontWeight: 700,
          letterSpacing: -7,
        }}
      >
        AI Engineer.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#68646e",
          marginTop: 24,
        }}
      >
        A little human. A little AI. A lot of possibility.
      </div>
      <div style={{ display: "flex", fontSize: 21, marginTop: 60 }}>
        Agentic Systems & Computer Vision · Pune, India
      </div>
    </div>,
    size,
  );
}
