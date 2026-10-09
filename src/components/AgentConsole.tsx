import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Circle, Loader2, Mail, Mic, Sparkles } from "lucide-react";

interface AgentTask {
  label: string;
  live: string;
  done: string;
  tool: string;
  ToolIcon: typeof Mail;
  color: string;
}

const TASKS: AgentTask[] = [
  { label: "Qualify lead from chat", live: "⚡ Qualifying lead…", done: "Lead qualified +40%", tool: "GPT-4o", ToolIcon: Sparkles, color: "#22d3ee" },
  { label: "Book demo via Calendly", live: "📅 Booking meeting…", done: "Meeting booked ✓", tool: "Calendar", ToolIcon: Calendar, color: "#a78bfa" },
  { label: "Send follow-up email", live: "✉️ Writing email…", done: "Email sent ✓", tool: "Gmail", ToolIcon: Mail, color: "#a3e635" },
  { label: "Outbound voice call", live: "📞 Calling lead…", done: "Call done — booked ✓", tool: "Twilio", ToolIcon: Mic, color: "#f472b6" },
];

const STAGES = ["Listen", "Think", "Act", "Done"];

/**
 * Live AI-AGENT console — shows an autonomous agent working in a loop:
 * stages light up (Listen → Think → Act → Done), tasks execute one by one,
 * tools fire, tokens tick. Click → it talks 🔊
 */
export default function AgentConsole() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // TASKS.length = "batch complete" beat
  const [tokens, setTokens] = useState(128400);
  const [batches, setBatches] = useState(1284);
  const [speaking, setSpeaking] = useState(false);

  // 🔊 click → talks!
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

  // agent execution loop
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % (TASKS.length + 1)), 2200);
    return () => clearInterval(t);
  }, []);

  // batches completed counter
  useEffect(() => {
    if (active !== 0) return;
    const timeout = window.setTimeout(() => {
      setBatches((b) => b + 1);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [active]);

  // token ticker
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
      className="relative mx-auto w-full max-w-[300px] cursor-pointer select-none"
    >
      {/* live status bubble (synced with agent) */}
      <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
        <motion.div
          key={bubble}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-2xl rounded-bl-sm border border-cyan-400/40 bg-[#0b1020]/95 px-3.5 py-1.5 text-xs font-bold text-cyan-200 shadow-lg shadow-cyan-500/20"
        >
          {bubble}
        </motion.div>
      </div>

      {/* ambient glow */}
      <div className="absolute inset-x-6 top-12 bottom-0 rounded-full bg-gradient-to-br from-cyan-500/25 via-violet-500/25 to-lime-400/15 blur-2xl" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-3xl border border-white/15 bg-[#070c1a]/90 p-4 shadow-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-lime-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
            </span>
            AGENT LIVE
          </span>
          <span className="font-mono text-[10px] text-slate-500">agent-01 • {tokens.toLocaleString()} tok</span>
        </div>

        {/* workflow graph: Listen → Think → Act → Done */}
        <svg viewBox="0 0 260 64" className="mt-3 w-full">
          <defs>
            <linearGradient id="aNode" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="aGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* flowing edges */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={48 + i * 58} y1={22} x2={86 + i * 58} y2={22}
              stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 5" opacity="0.7"
            >
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
            </line>
          ))}
          {STAGES.map((s, i) => {
            const on = i === stageIdx;
            const past = i < stageIdx;
            const cx = 32 + i * 58;
            return (
              <g key={s}>
                {on && (
                  <circle cx={cx} cy={22} r={13} fill="none" stroke="#22d3ee" strokeWidth="1.5">
                    <animate attributeName="r" values="10;16" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={cx} cy={22} r={11}
                  fill={on ? "url(#aNode)" : past ? "#12303a" : "#0b1020"}
                  stroke={on ? "#67e8f9" : "#334155"} strokeWidth={on ? 2 : 1.5}
                  filter={on ? "url(#aGlow)" : undefined}
                />
                {on ? (
                  <circle cx={cx} cy={22} r={3.5} fill="#04121f">
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.7s" repeatCount="indefinite" />
                  </circle>
                ) : past ? (
                  <path d={`M${cx - 4} 22 l3 3 l6 -6`} stroke="#a3e635" strokeWidth="2" fill="none" strokeLinecap="round" />
                ) : (
                  <circle cx={cx} cy={22} r={3} fill="#334155" />
                )}
                <text x={cx} y={50} textAnchor="middle" fontSize="9" fontWeight="700"
                  fill={on ? "#67e8f9" : "#64748b"} fontFamily="inherit">
                  {s.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* live task feed */}
        <div className="mt-2 space-y-1.5">
          {TASKS.map((t, i) => {
            const done = allDone || i < active;
            const running = !allDone && i === active;
            return (
              <div
                key={t.label}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] transition-all duration-300 ${
                  running
                    ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                    : done
                      ? "border-white/5 bg-white/[0.02] opacity-70"
                      : "border-white/10 bg-black/30 opacity-45"
                }`}
              >
                {done ? (
                  <Check size={13} className="shrink-0 text-lime-300" />
                ) : running ? (
                  <Loader2 size={13} className="shrink-0 animate-spin text-cyan-300" />
                ) : (
                  <Circle size={13} className="shrink-0 text-slate-600" />
                )}
                <span className={`flex-1 truncate font-medium ${running ? "text-white" : "text-slate-400"}`}>
                  {done ? t.done : t.label}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold"
                  style={{
                    color: t.color,
                    background: `${t.color}18`,
                    border: `1px solid ${t.color}44`,
                  }}
                >
                  <t.ToolIcon size={10} /> {t.tool}
                </span>
              </div>
            );
          })}
        </div>

        {/* footer stats */}
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[10px] text-slate-500">
          <span>
            batches: <span className="font-bold text-white">{batches.toLocaleString()}</span>
          </span>
          <span>
            success: <span className="font-bold text-lime-300">99.2%</span>
          </span>
          <span>
            latency: <span className="font-bold text-cyan-300">1.8s</span>
          </span>
        </div>
      </motion.div>

      {/* status dots */}
      <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full border border-lime-300/30 bg-lime-300/10 px-2.5 py-1 text-lime-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
          </span>
          AGENT ONLINE
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
          {speaking ? "🔊 speaking… (click = stop)" : "click me 🔊 • watch it work 👀"}
        </span>
      </div>
    </div>
  );
}
