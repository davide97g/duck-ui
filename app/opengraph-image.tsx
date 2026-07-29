import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "duck/ui, a dark-first component registry on shadcn rails";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// satori has no loader for next/image, so the mark goes in as a data URI
const duckLogo = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/duck.png")
).toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1a1e",
          padding: 72,
          color: "#f4f4f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={duckLogo} width={88} height={88} alt="" />
          <div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>
            <span>duck</span>
            <span style={{ color: "#c3e86a" }}>/</span>
            <span>ui</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            Stick it on anything.
          </div>
          <div style={{ fontSize: 32, color: "#a1a1aa", maxWidth: 860 }}>
            A dark-first shadcn registry with holographic accents and thick
            sticker borders.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontFamily: "monospace",
            color: "#c3e86a",
          }}
        >
          <span>$ npx shadcn add @duck/theme</span>
        </div>
      </div>
    ),
    size
  );
}
