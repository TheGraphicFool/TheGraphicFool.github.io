import Link from "next/link";
import { Sticker } from "@/components/ui/Sticker";

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden">
      <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1800px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="relative inline-block">
          <div className="absolute -top-4 -right-4 z-10 sm:-right-10">
            <Sticker rotate={8} className="bg-pink">
              Dead end
            </Sticker>
          </div>
          <p className="font-display text-[clamp(5rem,22vw,16rem)] leading-[0.8]">
            4<span className="nb-outline-text">0</span>4
          </p>
        </div>

        <h1 className="mt-8 text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.9]">
          This page
          <br />
          was never filed
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed sm:text-lg">
          The link is broken, the project moved, or it never existed. The archive
          is still where you left it.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/"
            className="nb-panel nb-press shadow-nb bg-yellow font-display inline-flex items-center gap-3 px-6 py-4 text-base sm:text-lg"
          >
            <span aria-hidden>←</span> Back home
          </Link>
          <Link
            href="/#work"
            className="nb-panel nb-press shadow-nb bg-white hover:bg-cyan font-display inline-flex items-center gap-3 px-6 py-4 text-base sm:text-lg"
          >
            See the archive
          </Link>
        </div>
      </div>
    </section>
  );
}
