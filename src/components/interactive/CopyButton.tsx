"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

/** Copies `value` to the clipboard and flashes a sticker-style confirmation. */
export function CopyButton({ value, label = "Copy", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API blocked (insecure context, old browser) — fall back to a
      // throwaway textarea selection.
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`nb-panel nb-press shadow-nb-xs font-display relative inline-flex items-center gap-2 px-4 py-2.5 text-sm ${
        copied ? "bg-lime" : "bg-white hover:bg-cyan"
      } ${className}`}
    >
      <span aria-live="polite">{copied ? "Copied!" : label}</span>
      <span aria-hidden>{copied ? "✓" : "⧉"}</span>
      <AnimatePresence>
        {copied && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 6, scale: 0.6, rotate: 0 }}
            animate={{ opacity: 1, y: -6, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="nb-panel nb-label bg-pink shadow-nb-xs pointer-events-none absolute -top-8 -right-3 px-2 py-1.5 font-bold"
          >
            In your clipboard
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
