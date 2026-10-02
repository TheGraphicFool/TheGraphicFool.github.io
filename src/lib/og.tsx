import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/data/site";

/**
 * The share card shown when the site is linked on WhatsApp, LinkedIn, X,
 * Slack, Google Discover, etc. Rendered once at build time from the portrait
 * in public/, so swapping that file updates the card on the next deploy.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${site.name} (${site.brand}) — ${site.role}`;

const INK = "#0a0a0a";
const PAPER = "#f4f1e8";
const VIOLET = "#7b4dff";
const YELLOW = "#ffe600";
const PINK = "#ff3d8b";
const LIME = "#b8ff3d";

async function asset(file: string) {
  return readFile(path.join(process.cwd(), file));
}

/** Satori can't decode WebP, so hand it a PNG data URL. */
async function portraitDataUrl() {
  const png = await sharp(await asset(path.join("public", site.portrait)))
    .resize({ width: 520 })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

export async function renderShareCard() {
  const [archivo, mono, portrait] = await Promise.all([
    asset("assets/fonts/ArchivoBlack-Regular.ttf"),
    asset("assets/fonts/SpaceMono-Bold.ttf"),
    portraitDataUrl(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          border: `10px solid ${INK}`,
          fontFamily: "Archivo Black",
          color: INK,
        }}
      >
        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 40px 40px 56px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 22, letterSpacing: 4 }}>
            PORTFOLIO — {site.location.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 84, lineHeight: 0.9, letterSpacing: -2 }}>THE GRAPHIC</div>
            <div style={{ display: "flex", fontSize: 84, lineHeight: 0.9, letterSpacing: -2 }}>FOOL</div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 34,
                background: INK,
                color: YELLOW,
                padding: "10px 18px",
                alignSelf: "flex-start",
              }}
            >
              {site.name.toUpperCase()}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
            <div
              style={{
                display: "flex",
                background: PINK,
                border: `5px solid ${INK}`,
                boxShadow: `6px 6px 0 ${INK}`,
                padding: "10px 18px",
                fontSize: 26,
                whiteSpace: "nowrap",
              }}
            >
              {site.role.toUpperCase()}
            </div>
            <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 24, letterSpacing: 1 }}>
              {new URL(site.url).host} ↗
            </div>
          </div>
        </div>

        {/* Portrait */}
        <div
          style={{
            display: "flex",
            width: 440,
            background: VIOLET,
            borderLeft: `10px solid ${INK}`,
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img
            src={portrait}
            width={440}
            height={610}
            style={{ width: 440, height: 610, objectFit: "cover", objectPosition: "top" }}
          />
          <div
            style={{
              position: "absolute",
              top: 28,
              left: -34,
              display: "flex",
              background: LIME,
              border: `5px solid ${INK}`,
              padding: "8px 14px",
              fontFamily: "Space Mono",
              fontSize: 20,
              transform: "rotate(-6deg)",
            }}
          >
            SAY HELLO
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo Black", data: archivo, style: "normal", weight: 400 },
        { name: "Space Mono", data: mono, style: "normal", weight: 700 },
      ],
    }
  );
}
