import { renderShareCard } from "@/lib/og";

// Emitted as a real /og.png at build time — an extensionless file would be
// served by GitHub Pages as application/octet-stream, which some social
// crawlers reject.
export const dynamic = "force-static";

export function GET() {
  return renderShareCard();
}
