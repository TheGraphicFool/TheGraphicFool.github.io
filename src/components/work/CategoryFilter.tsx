"use client";

type CategoryFilterProps<T extends string> = {
  categories: readonly T[];
  active: T;
  counts: Record<string, number>;
  onChange: (category: T) => void;
};

/**
 * Chunky toggle chips. Modelled as a group of pressed/unpressed buttons rather
 * than a tablist — there's no tabpanel here, just a filtered rail.
 */
export function CategoryFilter<T extends string>({
  categories,
  active,
  counts,
  onChange,
}: CategoryFilterProps<T>) {
  return (
    <div
      role="group"
      aria-label="Filter work by category"
      // One swipeable row on phones (wrapping took three rows of height);
      // wraps normally from sm up.
      className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(category)}
            className={`nb-panel nb-press font-display flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm ${
              isActive
                ? "bg-ink text-yellow shadow-nb-none translate-x-[3px] translate-y-[3px]"
                : "bg-white shadow-nb-xs hover:bg-yellow"
            }`}
          >
            {category}
            <span
              className={`nb-label ${isActive ? "opacity-70" : "opacity-45"}`}
            >
              {counts[category] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
