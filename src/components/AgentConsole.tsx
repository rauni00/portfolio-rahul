import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Check,
  CircleDot,
  Cpu,
  Loader2,
  Mail,
  Mic,
  Network,
  Sparkles,
  Zap,
} from "lucide-react";

/* ─── Types ─── */
interface AgentTask {
  label: string;
  live: string;
  done: string;
  tool: string;
  ToolIcon: typeof Mail;
  color: string;
}

const TASKS: AgentTask[] = [
  { label: "Qualify lead from chat", live: "Qualifying lead…", done: "Lead qualified +40%", tool: "GPT-4o", ToolIcon: Sparkles, color: "#5eead4" },
  { label: "Book demo via Calendly", live: "Booking meeting…", done: "Meeting booked ✓", tool: "Calendar", ToolIcon: Calendar, color: "#6366f1" },
  { label: "Send follow-up email", live: "Composing email…", done: "Email sent ✓", tool: "Gmail", ToolIcon: Mail, color: "#fbbf24" },
  { label: "Outbound voice call", live: "Calling lead…", done: "Call complete ✓", tool: "Twilio", ToolIcon: Mic, color: "#fb7185" },
];

const STAGES = ["Listen", "Think", "Act", "Done"] as const;

/* ─── Neural Network SVG Animation ─── */
function NeuralNetwork() {
  const nodes = [
    // Input layer
    { x: 20, y: 15, layer: 0 },
    { x: 20, y: 35, layer: 0 },
    { x: 20, y: 55, layer: 0 },
    { x: 20, y: 75, layer: 0 },
    // Hidden layer 1
    { x: 40, y: 20, layer: 1 },
    { x: 40, y: 40, layer: 1 },
    { x: 40, y: 60, layer: 1 },
    // Hidden layer 2
    { x: 60, y: 25, layer: 2 },
    { x: 60, y: 50, layer: 2 },
    { x: 60, y: 70, layer: 2 },
    // Output layer
    { x: 80, y: 35, layer: 3 },
    { x: 80, y: 55, layer: 3 },
  ];

  const connections: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[j].layer === nodes[i].layer + 1) {
        connections.push([i, j]);
      }
    }
  }

  return (
    <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full opacity-20">
      <defs>
        <linearGradient id="nn-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5eead4" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {connections.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#nn-grad)"
          strokeWidth="0.3"
          strokeDasharray="4 4"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="8;0"
            dur={`${1.5 + i * 0.1}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="2.5" fill="none" stroke="#5eead4" strokeWidth="0.5" opacity="0.4">
            <animate
              attributeName="r"
              values="2;3.5;2"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={n.x} cy={n.y} r="1.2" fill="#5eead4" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur={`${1.8 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ─── Orbit Ring Component ─── */
function OrbitRing({ size, duration, color, delay = 0 }: { size: number; duration: number; color: string; delay?: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        border: `1px solid ${color}`,
        animation: `orbit-ring ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        animationDirection: duration % 2 === 0 ? "reverse" : "normal",
      }}
    >
      {/* Orbiting dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          background: color,
          boxShadow: `0 0 12px 3px ${color}`,
          top: -3,
          left: "50%",
          marginLeft: -3,
        }}
      />
    </div>
  );
}

/* ─── Brain Core Animation ─── */
function BrainCore() {
  return (
    <div className="relative mx-auto" style={{ width: 140, height: 140 }}>
      {/* Outer glow pulse */}
      <div className="absolute inset-0 rounded-full" style={{
        background: "radial-gradient(circle, rgba(94, 234, 212, 0.2), rgba(99, 102, 241, 0.15), transparent 70%)",
        animation: "neon-pulse 3s ease-in-out infinite",
      }} />
      
      {/* Orbit rings */}
      <OrbitRing size={180} duration={7} color="rgba(94, 234, 212, 0.2)" />
      <OrbitRing size={220} duration={11} color="rgba(99, 102, 241, 0.15)" delay={1} />
      <OrbitRing size={260} duration={15} color="rgba(251, 191, 36, 0.1)" delay={2} />
      
      {/* Inner core */}
      <div className="absolute inset-4 rounded-full border border-teal-400/20" style={{
        background: "linear-gradient(135deg, rgba(94, 234, 212, 0.1), rgba(99, 102, 241, 0.1))",
        boxShadow: "0 0 40px rgba(94, 234, 212, 0.15), inset 0 0 30px rgba(99, 102, 241, 0.1)",
      }}>
        <div className="grid h-full w-full place-items-center">
          <Brain size={36} className="text-teal-300" style={{
            filter: "drop-shadow(0 0 12px rgba(94, 234, 212, 0.5))",
          }} />
        </div>
      </div>
      
      {/* Hex/badge floating nodes */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-8 top-2 rounded-lg border border-teal-400/30 bg-[#0c0e18]/90 px-2 py-1"
        style={{ boxShadow: "0 0 15px rgba(94, 234, 212, 0.15)" }}
      >
        <Cpu size={14} className="text-teal-300" />
      </motion.div>
      
      <motion.div
        animate={{ y: [3, -5, 3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -right-6 top-6 rounded-lg border border-indigo-400/30 bg-[#0c0e18]/90 px-2 py-1"
        style={{ boxShadow: "0 0 15px rgba(99, 102, 241, 0.15)" }}
      >
        <Network size={14} className="text-indigo-300" />
      </motion.div>
      
      <motion.div
        animate={{ y: [2, -6, 2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-lg border border-amber-400/30 bg-[#0c0e18]/90 px-2 py-1"
        style={{ boxShadow: "0 0 15px rgba(251, 191, 36, 0.15)" }}
      >
        <Zap size={14} className="text-amber-300" />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT: AI AGENT HERO CONSOLE (Premium)
   ═══════════════════════════════════════════════════ */

export default function AgentConsole() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [tokens, setTokens] = useState(128400);
  const [batches, setBatches] = useState(1284);
  const [speaking, setSpeaking] = useState(false);

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
        "Hi! I am Rahul's AI agent. I qualify leads, book meetings and make calls — all on autopilot!"
      );
      u.rate = 1.05;
      u.onend = () => setSpeaking(false);
      synth.cancel();
      synth.speak(u);
      setSpeaking(true);
    } catch {
      /* speech not supported */
    }
  };

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % (TASKS.length + 1)), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (active !== 0) return;
    const timeout = window.setTimeout(() => setBatches((b) => b + 1), 0);
    return () => window.clearTimeout(timeout);
  }, [active]);

  useEffect(() => {
    const t = setInterval(() => setTokens((x) => x + Math.floor(Math.random() * 40) + 12), 800);
    return () => clearInterval(t);
  }, []);

  const allDone = active === TASKS.length;
  const stageIdx = allDone ? 3 : active % STAGES.length;
  const bubble = allDone ? "🔁 Batch complete — looping…" : TASKS[active].live;

  return (
    <div
      ref={wrapRef}
      onClick={speak}
      title="Click — the agent talks! 🔊"
      className="relative mx-auto w-full max-w-[340px] cursor-pointer select-none"
    >
      {/* Status bubble */}
      <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
        <motion.div
          key={bubble}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-2xl rounded-bl-sm border border-teal-400/30 px-4 py-2 text-xs font-bold text-teal-200"
          style={{
            background: "linear-gradient(135deg, rgba(8, 13, 26, 0.95), rgba(8, 13, 26, 0.85))",
            boxShadow: "0 0 25px rgba(94, 234, 212, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
          {bubble}
        </motion.div>
      </div>

      {/* Background neural network */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <NeuralNetwork />
      </div>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-4 top-8 bottom-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(94, 234, 212, 0.12), rgba(99, 102, 241, 0.08), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: "linear-gradient(180deg, rgba(8, 13, 26, 0.92), rgba(8, 13, 26, 0.85))",
          border: "1px solid rgba(94, 234, 212, 0.12)",
          boxShadow: "0 0 40px rgba(94, 234, 212, 0.06), 0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Animated top border */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #5eead4, #6366f1, transparent)",
            backgroundSize: "200% 100%",
            animation: "holographic 4s ease infinite",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-[0.15em] text-amber-300"
            style={{
              border: "1px solid rgba(251, 191, 36, 0.25)",
              background: "rgba(251, 191, 36, 0.08)",
              boxShadow: "0 0 15px rgba(251, 191, 36, 0.1)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" />
            </span>
            AGENT LIVE
          </span>
          <span className="font-mono text-[9px] text-slate-500">
            v2.0 • {tokens.toLocaleString()} tok
          </span>
        </div>

        {/* Brain visualization (compact) */}
        <div className="relative mx-auto my-4" style={{ height: 80 }}>
          <BrainCore />
        </div>

        {/* Workflow stages */}
        <div className="mb-3 flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-2 py-1.5">
          {STAGES.map((s, i) => {
            const isActive = i === stageIdx;
            const isPast = i < stageIdx;
            return (
              <div key={s} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="relative flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #5eead4, #6366f1)"
                      : isPast
                        ? "rgba(94, 234, 212, 0.1)"
                        : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isActive ? "#5eead4" : isPast ? "rgba(94, 234, 212, 0.2)" : "rgba(255, 255, 255, 0.08)"}`,
                    boxShadow: isActive ? "0 0 18px rgba(94, 234, 212, 0.3)" : "none",
                    color: isActive ? "#070810" : isPast ? "#5eead4" : "#64748b",
                  }}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-full" style={{
                      border: "1px solid rgba(94, 234, 212, 0.5)",
                      animation: "neon-pulse 1.2s ease-in-out infinite",
                    }} />
                  )}
                  {isPast ? <Check size={11} /> : isActive ? <Loader2 size={11} className="animate-spin" /> : <CircleDot size={9} />}
                </div>
                <span className={`text-[8px] font-bold tracking-wider ${isActive ? "text-teal-300" : "text-slate-600"}`}>
                  {s.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Task feed */}
        <div className="space-y-1.5">
          {TASKS.map((t, i) => {
            const done = allDone || i < active;
            const running = !allDone && i === active;
            return (
              <div
                key={t.label}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] transition-all duration-300"
                style={{
                  border: `1px solid ${running ? "rgba(94, 234, 212, 0.3)" : "rgba(255, 255, 255, 0.05)"}`,
                  background: running
                    ? "linear-gradient(135deg, rgba(94, 234, 212, 0.08), rgba(99, 102, 241, 0.04))"
                    : done
                      ? "rgba(255, 255, 255, 0.01)"
                      : "rgba(0, 0, 0, 0.2)",
                  boxShadow: running ? "0 0 20px rgba(94, 234, 212, 0.08)" : "none",
                  opacity: done ? 0.6 : running ? 1 : 0.4,
                }}
              >
                {done ? (
                  <Check size={13} className="shrink-0 text-amber-300" />
                ) : running ? (
                  <Loader2 size={13} className="shrink-0 animate-spin text-teal-300" />
                ) : (
                  <CircleDot size={11} className="shrink-0 text-slate-600" />
                )}
                <span className={`flex-1 truncate font-medium ${running ? "text-white" : "text-slate-400"}`}>
                  {done ? t.done : t.label}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold"
                  style={{
                    color: t.color,
                    background: `${t.color}12`,
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  <t.ToolIcon size={9} /> {t.tool}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[9px] text-slate-500">
          <span>
            batches: <span className="font-bold text-white">{batches.toLocaleString()}</span>
          </span>
          <span>
            success: <span className="font-bold text-amber-300">99.2%</span>
          </span>
          <span>
            latency: <span className="font-bold text-teal-300">1.8s</span>
          </span>
        </div>
      </motion.div>

      {/* Bottom status */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-amber-300"
          style={{
            border: "1px solid rgba(251, 191, 36, 0.2)",
            background: "rgba(251, 191, 36, 0.06)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" />
          </span>
          AGENT ONLINE
        </span>
        <span
          className="rounded-full px-3 py-1.5 text-slate-300"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          {speaking ? "🔊 speaking…" : "click me 🔊 • watch it work"}
        </span>
      </div>
    </div>
  );
}
