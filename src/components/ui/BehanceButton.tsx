type BehanceButtonProps = {
  href: string;
  /** Visible label. */
  label?: string;
  /** Accessible name when the label alone is ambiguous (e.g. on a rail card). */
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
};

/** Outbound link to the full case study on Behance. */
export function BehanceButton({
  href,
  label = "View on Behance",
  ariaLabel,
  size = "md",
  className = "",
}: BehanceButtonProps) {
  const sizing =
    size === "sm"
      ? "shadow-nb-xs gap-2 px-3 py-2 text-xs"
      : "shadow-nb gap-3 px-6 py-4 text-base sm:text-lg";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`nb-panel nb-press font-display inline-flex items-center bg-[#1769ff] text-white hover:bg-ink ${sizing} ${className}`}
    >
      <span
        aria-hidden
        className="bg-white text-[#1769ff] grid h-[1.4em] min-w-[1.4em] place-items-center px-1 text-[0.8em] leading-none"
      >
        Bē
      </span>
      {label}
      <span aria-hidden>↗</span>
    </a>
  );
}
