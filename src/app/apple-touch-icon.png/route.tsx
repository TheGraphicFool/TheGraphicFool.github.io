import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

const size = { width: 180, height: 180 };

export const dynamic = "force-static";

/** /apple-touch-icon.png — home-screen icon: the AZ monogram, yellow on ink. */
export async function GET() {
  const archivo = await readFile(path.join(process.cwd(), "assets/fonts/ArchivoBlack-Regular.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffe600",
          fontFamily: "Archivo Black",
          fontSize: 84,
          letterSpacing: -2,
        }}
      >
        {site.initials}
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo Black", data: archivo, style: "normal", weight: 400 }] }
  );
}
