"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The hero's centrepiece: THE GRAPHIC FOOL spelled in chunky mechanical
 * keycaps on a tilted keyboard deck.
 *
 * - Click / tap a key and it travels down and springs back.
 * - Type on a real keyboard: every matching cap presses (only while the hero
 *   is on screen, and never while you're typing in a form field).
 * - A little LCD shows what you typed. Type FOOL for a wave, HELLO or HIRE
 *   for a shortcut to the contact section.
 * - Optional "thock" sound, synthesised with Web Audio, off by default.
 */

const ROWS = ["THE", "GRAPHIC", "FOOL"] as const;

/** Cap colours, cycled across the letters. Class names written out for Tailwind. */
const CAPS = ["bg-yellow", "bg-white", "bg-pink", "bg-cyan", "bg-lime", "bg-white", "bg-orange"];

const SOUND_KEY = "tgf-key-sound";

type Easter = "wave" | "hello" | null;

/** A short, soft keyboard "thock": filtered noise click + a low body thump. */
function useThock() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback((pitch = 1) => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = (ctxRef.current ??= new Ctx());
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;

      // Click: 25ms of noise through a band-pass.
      const length = Math.floor(ctx.sampleRate * 0.025);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 2400 * pitch;
      band.Q.value = 0.9;
      const clickGain = ctx.createGain();
      clickGain.gain.value = 0.22;
      noise.connect(band).connect(clickGain).connect(ctx.destination);
      noise.start(now);

      // Thock: a quick low sine that drops in pitch.
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(190 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(70 * pitch, now + 0.07);
      const body = ctx.createGain();
      body.gain.setValueAtTime(0.28, now);
      body.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(body).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio is a nicety; never let it break the page.
    }
  }, []);
}

export function HeroKeyboard() {
  const reduceMotion = useReducedMotion();
  const deckRef = useRef<HTMLDivElement>(null);
  const [down, setDown] = useState<Set<string>>(() => new Set());
  const [typed, setTyped] = useState("");
  const [sound, setSound] = useState(false);
  const [easter, setEaster] = useState<Easter>(null);
  const [waveId, setWaveId] = useState(0);
  const visible = useRef(true);
  const thock = useThock();

  // Remember the sound choice for this visitor (per-browser convenience only).
  useEffect(() => {
    try {
      // Read once after mount: localStorage doesn't exist during the static
      // pre-render, so it can't seed the initial state without a mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(SOUND_KEY) === "on") setSound(true);
    } catch {}
  }, []);

  const toggleSound = () => {
    setSound((on) => {
      const next = !on;
      try {
        localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {}
      if (next) thock(1.1);
      return next;
    });
  };

  /** Press a cap (by id) for a moment, with sound if it's on. */
  const press = useCallback(
    (ids: string[], pitch = 1) => {
      if (ids.length === 0) return;
      if (sound) thock(pitch);
      setDown((prev) => new Set([...prev, ...ids]));
      window.setTimeout(() => {
        setDown((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
      }, 110);
    },
    [sound, thock]
  );

  const type = useCallback(
    (char: string) => {
      setTyped((prev) => {
        const next = (prev + char).slice(-14);
        if (/FOOL$/.test(next)) {
          setEaster("wave");
          setWaveId((n) => n + 1);
        } else if (/(HELLO|HIRE)$/.test(next)) {
          setEaster("hello");
        }
        return next;
      });
    },
    []
  );

  // Physical keyboard → press every matching cap.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting));
    if (deckRef.current) io.observe(deckRef.current);

    function onKey(event: KeyboardEvent) {
      if (!visible.current || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const char = event.key.length === 1 ? event.key.toUpperCase() : "";
      if (!/^[A-Z]$/.test(char)) return;
      const ids: string[] = [];
      ROWS.forEach((word, r) => [...word].forEach((l, i) => l === char && ids.push(`${r}-${i}`)));
      press(ids, 0.9 + Math.random() * 0.2);
      type(char);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      io.disconnect();
    };
  }, [press, type]);

  let colour = 0;

  return (
    <div className="relative">
      {/* The deck, tilted back like a keyboard on a desk */}
      <div
        ref={deckRef}
        className="nb-kb-deck bg-ink border-ink mx-auto w-full max-w-[1100px] rounded-[22px] border-[3px] p-3 sm:p-5"
      >
        {/* Top strip: LCD + sound toggle */}
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <div
            aria-live="polite"
            className="bg-lime text-ink border-ink flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-md border-[3px] px-3 py-1.5 font-mono text-xs font-bold tracking-widest sm:max-w-sm sm:text-sm"
          >
            <span className="opacity-50">&gt;</span>
            <span className="truncate">
              {easter === "hello" ? "LET'S TALK ↓" : typed || "TYPE ANYTHING"}
            </span>
            <span aria-hidden className="nb-blink">▌</span>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="nb-press nb-panel font-display bg-white px-3 py-1.5 text-[11px] sm:text-xs"
          >
            {sound ? "♪ Sound on" : "♪ Sound off"}
          </button>
        </div>

        {/* Keys */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {ROWS.map((word, r) => (
            <div
              key={word}
              className="flex justify-center gap-1.5 sm:gap-2.5"
              // Real keyboards stagger their rows.
              style={{ paddingLeft: r === 1 ? 0 : `${r * 4}%`, paddingRight: r === 1 ? 0 : `${(2 - r) * 3}%` }}
            >
              {[...word].map((letter, i) => {
                const id = `${r}-${i}`;
                const cap = CAPS[colour++ % CAPS.length];
                const order = r * 7 + i;
                return (
                  // The wave lives on a wrapper so its transform never fights
                  // the keycap's own press travel.
                  <motion.span
                    key={`${id}-${waveId}`}
                    className="block"
                    initial={false}
                    animate={waveId > 0 && !reduceMotion ? { y: [0, -14, 0] } : undefined}
                    transition={{ duration: 0.45, delay: order * 0.035, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      aria-label={`Key ${letter}`}
                      data-down={down.has(id) ? "true" : undefined}
                      onPointerDown={() => {
                        press([id], 0.95 + Math.random() * 0.1);
                        type(letter);
                      }}
                      className={`nb-press nb-panel font-display grid aspect-square w-[clamp(36px,10.4vw,104px)] place-items-center text-[clamp(1.05rem,5vw,3.6rem)] leading-none ${cap}`}
                    >
                      {letter}
                    </button>
                  </motion.span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {easter === "hello" && (
        <a
          href="#contact"
          onClick={() => setEaster(null)}
          className="nb-press nb-panel font-display bg-pink absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 text-sm"
        >
          Say hello →
        </a>
      )}
    </div>
  );
}
