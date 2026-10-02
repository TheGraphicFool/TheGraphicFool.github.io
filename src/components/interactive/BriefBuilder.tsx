"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { services, site } from "@/data/site";

const BUDGETS = ["< $1k", "$1k – 5k", "$5k – 15k", "$15k +", "Not sure yet"] as const;
const TIMELINES = ["ASAP", "1 – 2 months", "3 months +", "Flexible"] as const;

type ChipGroupProps<T extends string> = {
  legend: string;
  options: readonly T[];
  selected: T[];
  multi?: boolean;
  onChange: (next: T[]) => void;
};

function ChipGroup<T extends string>({ legend, options, selected, multi, onChange }: ChipGroupProps<T>) {
  return (
    <fieldset>
      <legend className="nb-label mb-3 opacity-60">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange(
                  multi
                    ? active
                      ? selected.filter((item) => item !== option)
                      : [...selected, option]
                    : active
                      ? []
                      : [option]
                )
              }
              className={`nb-panel nb-press font-display px-3.5 py-2 text-sm ${
                active
                  ? "bg-ink text-yellow shadow-nb-none translate-x-[3px] translate-y-[3px]"
                  : "bg-white shadow-nb-xs hover:bg-yellow"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * A three-tap brief: pick what you need, roughly what it costs, and when.
 * There's no backend (static site), so it composes a pre-filled email instead.
 */
export function BriefBuilder() {
  const [kinds, setKinds] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const steps = [kinds.length > 0, budget.length > 0, timeline.length > 0];
  const done = steps.filter(Boolean).length;

  const subject = kinds.length ? `Project enquiry — ${kinds.join(" + ")}` : "Project enquiry";
  const body = [
    "Hi Ali,",
    "",
    `I'm looking for help with: ${kinds.join(", ") || "—"}`,
    `Budget: ${budget[0] ?? "—"}`,
    `Timeline: ${timeline[0] ?? "—"}`,
    "",
    note.trim() || "A bit about the project:",
    "",
  ].join("\n");
  const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="nb-panel shadow-nb-lg bg-white">
      <div className="border-ink bg-ink text-paper flex items-center justify-between gap-4 border-b-[3px] px-5 py-4">
        <p className="font-display text-base sm:text-lg">Build a brief</p>
        <div className="flex items-center gap-3">
          <span className="nb-label opacity-70">{done}/3</span>
          <div className="flex gap-1.5" aria-hidden>
            {steps.map((ok, i) => (
              <motion.span
                key={i}
                className="border-paper block h-3 w-6 border-2"
                animate={{ backgroundColor: ok ? "var(--lime)" : "rgba(0,0,0,0)" }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-7 p-5 sm:p-7">
        <ChipGroup
          legend="01 — What do you need?"
          options={services.map((service) => service.title)}
          selected={kinds}
          multi
          onChange={setKinds}
        />
        <ChipGroup legend="02 — Ballpark budget" options={BUDGETS} selected={budget} onChange={setBudget} />
        <ChipGroup legend="03 — Timeline" options={TIMELINES} selected={timeline} onChange={setTimeline} />

        <label className="block">
          <span className="nb-label mb-3 block opacity-60">04 — Anything else? (optional)</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="The brand, the deadline, the thing keeping you up at night…"
            className="nb-panel bg-paper w-full resize-y px-4 py-3 text-base outline-none focus:bg-white"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={done}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="nb-label opacity-60"
            >
              {done === 3 ? "Looks great — fire it off" : done === 0 ? "Tap a few chips to start" : "Nearly there"}
            </motion.p>
          </AnimatePresence>
          <motion.a
            href={href}
            animate={done === 3 ? { rotate: [0, -3, 3, -2, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
            className={`nb-panel nb-press shadow-nb font-display inline-flex items-center gap-3 px-6 py-4 text-base ${
              done === 3 ? "bg-pink" : "bg-yellow hover:bg-pink"
            }`}
          >
            Send the brief <span aria-hidden>→</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
