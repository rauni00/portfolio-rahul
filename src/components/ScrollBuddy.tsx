import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ScrollBuddy — a tiny robot companion that HOPS alongside you as you scroll.
 * - Detects the active section and jumps to stand near its heading.
 * - Hopping works BOTH ways (scroll down → hops down, scroll up → hops up).
 * - Idle bobbing + blinking eyes keep it alive between jumps.
 * - Speech bubble shows where you are. Click it to zoom back to top.
 * - Pure CSS/SVG (zero 3D cost), hidden on reduced-motion + at the very top.
 */

const STOPS = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "services", label: "Services", emoji: "✨" },
  { id: "skills", label: "Skills", emoji: "🛠️" },
  { id: "experience", label: "Experience", emoji: "💼" },
  { id: "projects", label: "Projects", emoji: "🚀" },
  { id: "github", label: "GitHub", emoji: "💻" },
  { id: "testimonials", label: "Reviews", emoji: "⭐" },
  { id: "contact", label: "Contact", emoji: "📬" },
];

function headingY(id: string): number | null {
  const section = document.getElementById(id);
  if (!section) return null;
  // Home has an h1, every other section has an h2 — stand next to it.
  const head = section.querySelector(id === "home" ? "h1" : "h2");
  if (!head) return null;
  const r = head.getBoundingClientRect();
  const y = r.top + r.height * 0.5;
  // Clamp: never enter the floating-dock zone (bottom ~340px) or under the header.
  // Extra clearance on small screens where the dock + chat launcher crowd the corner.
  const bottomClearance = window.innerWidth < 640 ? 360 : 320;
  return Math.min(Math.max(y, 130), window.innerHeight - bottomClearance);
}

export default function ScrollBuddy({ hide }: { hide?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const [top, setTop] = useState(300);
  const [hopKey, setHopKey] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ticking = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;

    const update = () => {
      ticking.current = false;
      const y = window.scrollY;
      setVisible(y > 350);

      // Active section = last one whose top has crossed the upper third.
      const probe = y + window.innerHeight * 0.3;
      let active = 0;
      STOPS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= probe) active = i;
      });

      setStopIndex((prev) => {
        if (prev !== active) {
          const target = headingY(STOPS[active].id);
          if (target !== null) setTop(target);
          // Kud! — trigger the hop animation.
          setHopKey((k) => k + 1);
        }
        return active;
      });
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;
  const stop = STOPS[stopIndex];

  const goTop = () => {
    setHopKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && !hide && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, top }}
          exit={{ opacity: 0, x: 40 }}
          transition={
            { top: { type: "spring", stiffness: 120, damping: 16 } } as never
          }
          className="fixed right-3 z-40 sm:right-5"
          style={{ top }}
        >
          {/* Hop wrapper — remounts on every jump for squash & stretch */}
          <motion.div
            key={hopKey}
            initial={{ y: 0, scaleY: 1 }}
            animate={{ y: [0, -30, 0], scaleY: [1, 1.08, 0.92, 1] }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ transformOrigin: "bottom center" }}
          >
            <button
              onClick={goTop}
              aria-label="Back to top with buddy"
              className="group relative flex flex-col items-center"
              data-cursor-hover
            >
              {/* Speech bubble — right-aligned so it never clips off-screen */}
              <span
                key={`bubble-${stopIndex}`}
                className="buddy-bubble absolute -top-2 right-0 -translate-y-full whitespace-nowrap rounded-full border border-slate-900/10 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-md"
              >
                {stop.emoji} {stop.label}
              </span>

              {/* ── Cute bot (pure SVG, theme colors) ── */}
              <svg
                width="52"
                height="60"
                viewBox="0 0 52 60"
                className="buddy-bob drop-shadow-[0_6px_12px_rgba(79,70,229,0.25)]"
              >
                {/* antenna */}
                <line x1="26" y1="8" x2="26" y2="2" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="26" cy="2" r="2.5" fill="#fbbf24">
                  <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
                </circle>
                {/* head */}
                <rect x="10" y="8" width="32" height="26" rx="10" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                {/* eyes (CSS blink) */}
                <ellipse cx="20" cy="21" rx="3.4" ry="4" fill="#0f172a" className="buddy-eye" />
                <ellipse cx="32" cy="21" rx="3.4" ry="4" fill="#0f172a" className="buddy-eye" />
                <circle cx="21" cy="19.5" r="1.1" fill="#fff" />
                <circle cx="33" cy="19.5" r="1.1" fill="#fff" />
                {/* smile */}
                <path d="M21 28 Q26 31.5 31 28" stroke="#4f46e5" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* body */}
                <rect x="15" y="36" width="22" height="14" rx="7" fill="#4f46e5" />
                <circle cx="26" cy="43" r="3.5" fill="#5eead4">
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* arms */}
                <rect x="7" y="38" width="6" height="10" rx="3" fill="#7c3aed" />
                <rect x="39" y="38" width="6" height="10" rx="3" fill="#7c3aed" />
                {/* feet */}
                <ellipse cx="20" cy="53" rx="5" ry="3" fill="#312e81" />
                <ellipse cx="32" cy="53" rx="5" ry="3" fill="#312e81" />
              </svg>
            </button>
          </motion.div>

          {/* Ground shadow — stays put while the bot jumps */}
          <motion.div
            key={`shadow-${hopKey}`}
            initial={{ scaleX: 1, opacity: 0.25 }}
            animate={{ scaleX: [1, 0.65, 1.2, 1], opacity: [0.25, 0.12, 0.3, 0.25] }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="mx-auto mt-1 h-2 w-10 rounded-full bg-slate-900/30 blur-[3px]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
