import { useEffect, useState } from "react";

/**
 * Returns the id of whichever of `ids` currently sits under the header band.
 * Ids that aren't on the page (e.g. on a case study) are simply ignored, so
 * this returns null there. Pass the current pathname so the observer re-binds
 * after a client-side navigation back to the page that has the sections.
 */
export function useActiveSection(ids: string[], pathname: string) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // First section (in document order) that crosses the band wins.
        setActive(elements.find((el) => visible.get(el.id))?.id ?? null);
      },
      // A thin band ~30% down the viewport.
      { rootMargin: "-30% 0px -69% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, pathname]);

  return active;
}
