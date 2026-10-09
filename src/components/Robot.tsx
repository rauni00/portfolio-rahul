import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BUBBLES = [
  "⚡ Neural core online!",
  "🎙️ Voice bot ready!",
  "📈 Leads +40%!",
  "✨ Click me — I talk!",
];

/**
 * "ORBIT" — levitating AI core bot (v2 look).
 * Glass head • scanning visor • halo ring • voice pods • levitation pad
 * - Eyes follow the mouse 👀
 * - Visor blinks + scan sweep
 * - Click → talks via text-to-speech 🔊
 */
export default function Robot() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  // 🔊 click → talks! (browser text-to-speech)
  const speak = () => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      if (speaking) {
        synth.cancel();
        setSpeaking(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(
        "Hi! I am Rahul's AI assistant. Rahul builds chatbots, voice bots and full stack apps. Let's work together!"
      );
      u.rate = 1.05;
      u.onend = () => setSpeaking(false);
      synth.cancel();
      synth.speak(u);
      setSpeaking(true);
      setBubble(3);
    } catch {
      /* speech not supported */
    }
  };

  // blink the visor every ~3.4s
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  // rotate speech bubble
  useEffect(() => {
    const t = setInterval(() => setBubble((b) => (b + 1) % BUBBLES.length), 2600);
    return () => clearInterval(t);
  }, []);

  // pupils follow mouse
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      setPupil({
        x: Math.max(-5, Math.min(5, dx * 12)),
        y: Math.max(-4, Math.min(4, dy * 10)),
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={wrapRef}
      onClick={speak}
      title="Click me — the bot talks! 🔊"
      className="relative mx-auto w-full max-w-[260px] cursor-pointer select-none"
    >
      {/* speech bubble */}
      <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
        <motion.div
          key={bubble}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-2xl rounded-bl-sm border border-fuchsia-400/40 bg-[#0b1020]/95 px-3.5 py-1.5 text-xs font-bold text-fuchsia-200 shadow-lg shadow-fuchsia-500/20"
        >
          {BUBBLES[bubble]}
        </motion.div>
      </div>

      {/* ambient glow */}
      <div className="absolute inset-x-6 top-14 bottom-0 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-violet-500/25 to-cyan-500/25 blur-2xl" />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <svg viewBox="0 0 200 235" className="w-full drop-shadow-[0_10px_35px_rgba(192,132,252,0.35)]">
          <defs>
            <radialGradient id="oGlass" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#3b4a6b" />
              <stop offset="0.55" stopColor="#141c33" />
              <stop offset="1" stopColor="#080d1d" />
            </radialGradient>
            <linearGradient id="oVisor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#020617" />
              <stop offset="1" stopColor="#0b1530" />
            </linearGradient>
            <linearGradient id="oPod" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#e879f9" />
            </linearGradient>
            <linearGradient id="oScan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="0.5" stopColor="#67e8f9" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <filter id="oGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="oVisorClip">
              <rect x="58" y="74" width="84" height="44" rx="22" />
            </clipPath>
          </defs>

          {/* halo ring (rotating dashes) */}
          <ellipse
            cx="100" cy="26" rx="48" ry="13" fill="none"
            stroke="#67e8f9" strokeWidth="2" strokeDasharray="7 9" opacity="0.85"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="64" dur="5s" repeatCount="indefinite" />
          </ellipse>
          {/* satellite orbiting the halo */}
          <circle cx="0" cy="0" r="4.5" fill="#a3e635" filter="url(#oGlow)">
            <animateMotion dur="5s" repeatCount="indefinite" path="M52,26 a48,13 0 1,1 96,0 a48,13 0 1,1 -96,0" />
          </circle>

          {/* voice pods (headphone cups) */}
          <rect x="30" y="78" width="17" height="40" rx="8.5" fill="url(#oPod)" />
          <rect x="153" y="78" width="17" height="40" rx="8.5" fill="url(#oPod)" />
          <circle cx="38.5" cy="98" r="4" fill="#fff" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.25;0.9" dur="1.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="161.5" cy="98" r="4" fill="#fff" opacity="0.9">
            <animate attributeName="opacity" values="0.25;0.9;0.25" dur="1.1s" repeatCount="indefinite" />
          </circle>
          {/* pod links */}
          <rect x="44" y="92" width="8" height="12" rx="4" fill="#475569" />
          <rect x="148" y="92" width="8" height="12" rx="4" fill="#475569" />

          {/* glass head */}
          <circle cx="100" cy="102" r="52" fill="url(#oGlass)" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1.5" />
          {/* glass shine */}
          <ellipse cx="78" cy="72" rx="20" ry="10" fill="#fff" opacity="0.14" transform="rotate(-25 78 72)" />
          <ellipse cx="70" cy="66" rx="6" ry="3.5" fill="#fff" opacity="0.25" transform="rotate(-25 70 66)" />

          {/* visor */}
          <rect x="58" y="74" width="84" height="44" rx="22" fill="url(#oVisor)" stroke="#22d3ee" strokeOpacity="0.7" strokeWidth="1.5" />
          {/* scan sweep */}
          <g clipPath="url(#oVisorClip)">
            <motion.rect
              x={58} y={74} width={12} height={44} fill="url(#oScan)"
              initial={{ x: 0 }}
              animate={{ x: [0, 72, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
          {/* eyes (follow mouse + blink) */}
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: blink ? "scaleY(0.08)" : "scaleY(1)",
              transition: "transform 0.13s ease",
            }}
          >
            <circle cx={86 + pupil.x} cy={96 + pupil.y} r="9" fill="#22d3ee" filter="url(#oGlow)" />
            <circle cx={86 + pupil.x} cy={96 + pupil.y} r="4" fill="#04121f" />
            <circle cx={114 + pupil.x} cy={96 + pupil.y} r="9" fill="#e879f9" filter="url(#oGlow)" />
            <circle cx={114 + pupil.x} cy={96 + pupil.y} r="4" fill="#1c071f" />
          </g>

          {/* smile arc under visor */}
          <path d="M90 130 Q100 137 110 130" fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

          {/* core pendant */}
          <polygon points="100,150 110,162 100,174 90,162" fill="none" stroke="#a3e635" strokeWidth="2" />
          <circle cx="100" cy="162" r="4" fill="#a3e635" filter="url(#oGlow)">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
          {/* mini equalizer bars 🎙️ */}
          <g fill="#67e8f9">
            {[0, 1, 2].map((i) => (
              <rect key={i} x={118 + i * 8} y={156} width={4.5} height={10} rx={2}>
                <animate attributeName="height" values="4;11;5;9;4" dur={`${0.65 + i * 0.15}s`} repeatCount="indefinite" />
                <animate attributeName="y" values="163;156;162;158;163" dur={`${0.65 + i * 0.15}s`} repeatCount="indefinite" />
              </rect>
            ))}
            {[0, 1, 2].map((i) => (
              <rect key={`l${i}`} x={70 + i * 8} y={156} width={4.5} height={10} rx={2}>
                <animate attributeName="height" values="9;4;10;5;9" dur={`${0.7 + i * 0.15}s`} repeatCount="indefinite" />
                <animate attributeName="y" values="158;163;157;162;158" dur={`${0.7 + i * 0.15}s`} repeatCount="indefinite" />
              </rect>
            ))}
          </g>

          {/* electrons orbiting the head */}
          <circle cx="0" cy="0" r="3.5" fill="#22d3ee" filter="url(#oGlow)">
            <animateMotion dur="7s" repeatCount="indefinite" path="M40,102 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
          </circle>
          <circle cx="0" cy="0" r="3" fill="#e879f9" filter="url(#oGlow)">
            <animateMotion dur="9s" begin="1.5s" repeatCount="indefinite" path="M40,102 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0" />
          </circle>

          {/* levitation pad */}
          <ellipse cx="100" cy="212" rx="56" ry="12" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="10 8" opacity="0.8">
            <animate attributeName="stroke-dashoffset" from="72" to="0" dur="6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="100" cy="212" rx="38" ry="8" fill="#22d3ee" opacity="0.14">
            <animate attributeName="rx" values="38;32;38" dur="4.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="100" cy="212" rx="16" ry="3.5" fill="#67e8f9" opacity="0.5" />
          {/* rising energy particles */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={86 + i * 14} cy={204} r="2" fill="#a3e635" opacity="0.9">
              <animate attributeName="cy" values="204;184" dur={`${1.4 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur={`${1.4 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </motion.div>

      {/* status dots */}
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full border border-lime-300/30 bg-lime-300/10 px-2.5 py-1 text-lime-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
          </span>
          AI ONLINE
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
          {speaking ? "🔊 speaking… (click = stop)" : "click me 🔊 • move your mouse 👀"}
        </span>
      </div>
    </div>
  );
}
