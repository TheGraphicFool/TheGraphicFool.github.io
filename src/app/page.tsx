import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { WorkRail } from "@/components/work/WorkRail";
import { Marquee } from "@/components/ui/Marquee";
import { marqueeItems } from "@/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={marqueeItems} duration={38} />
      <WorkRail />
      <Services />
      <Marquee
        items={["Available Q2 2026", "Say hello", "Briefs welcome", "Let's talk"]}
        duration={28}
        reverse
        className="bg-pink text-ink"
        separator="●"
      />
      <About />
      <Contact />
    </>
  );
}
