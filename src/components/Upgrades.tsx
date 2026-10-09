import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Bot,
  Check,
  Copy,
  MessageCircle,
  Quote,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { chatFaqs, profile, services, testimonials } from "../data";

/* ================= PRELOADER (first-impression attraction) ================= */

export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[#05070f]"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-[3px]"
            >
              <div className="grid h-full w-full place-items-center rounded-2xl bg-[#05070f] font-display text-lg font-black text-white">
                {profile.avatarInitials}
              </div>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mt-4 font-display text-sm font-bold tracking-[0.3em] text-cyan-300"
            >
              LOADING PORTFOLIO
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= SERVICES ================= */

export function ServicesSection() {
  return (
    <section id="services" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
          <Sparkles size={13} /> What I do
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
          Hire me for outcomes, not just code
        </h2>
        <p className="mt-3 text-slate-400">
          Whether you're a recruiter or a founder — these three services deliver the most value.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="card-shine rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-6"
          >
            <span className="text-4xl">{s.emoji}</span>
            <h3 className="mt-4 font-display text-lg font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            <ul className="mt-4 space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
                  <Check size={13} className="text-lime-300" /> {p}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-white hover:text-cyan-300"
            >
              Discuss this → 
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);
  const cur = testimonials[idx];
  return (
    <section id="testimonials" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          <Quote size={13} /> Social proof
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
          People I've worked with
        </h2>
      </div>
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-8 text-center sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <Quote className="mx-auto text-cyan-400" size={28} />
            <p className="mt-4 text-lg leading-relaxed text-slate-200">"{cur.quote}"</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 font-display text-xs font-black text-black">
                {cur.initials}
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold text-white">{cur.name}</span>
                <span className="block text-xs text-cyan-300">{cur.role}</span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`review ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-8 bg-cyan-400" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CONTACT FORM (lead capture) ================= */

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };
  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2"
    >
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Your name *"
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Your email *"
        type="email"
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Project details / role / message *"
        rows={4}
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60 sm:col-span-2"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] sm:col-span-2"
      >
        <Send size={15} /> {sent ? "Opening your email app… ✓" : "Send Message"}
      </button>
      {sent && (
        <p className="text-center text-xs text-lime-300 sm:col-span-2">
          Thanks {form.name.split(" ")[0]}! Your email app should have opened — expect a reply within 24 hours.
        </p>
      )}
    </form>
  );
}

/* ================= FLOATING ACTIONS: WhatsApp + copy email + top ================= */

export function FloatingActions({ showTop }: { showTop: boolean }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <>
      {/* WhatsApp */}
      <motion.a
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
          "Hi Rahul! I saw your portfolio and want to discuss an opportunity."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-6 z-50 grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"
      >
        <MessageCircle size={19} />
      </motion.a>
      {/* Copy email */}
      <button
        onClick={copyEmail}
        aria-label="Copy email"
        title={copied ? "Copied!" : "Copy email"}
        className={`fixed bottom-[7.5rem] right-6 z-50 grid h-11 w-11 place-items-center rounded-full border shadow-xl transition hover:scale-110 ${
          copied
            ? "border-lime-300/50 bg-lime-300 text-black"
            : "border-white/15 bg-[#0b1020] text-cyan-300"
        }`}
      >
        {copied ? <Check size={18} /> : <Copy size={17} />}
      </button>
      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-black shadow-xl"
            aria-label="back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= AI CHAT WIDGET (portfolio assistant — big attraction!) ================= */

interface Msg {
  from: "bot" | "user";
  text: string;
}

function botReply(q: string): string {
  const lower = q.toLowerCase();
  for (const f of chatFaqs) {
    if (f.keys.some((k) => lower.includes(k))) return f.reply;
  }
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey"))
    return "Hello! 👋 I'm Rahul's portfolio assistant. Ask me about experience, AI projects, skills, or hiring!";
  return "Great question! Rahul himself can answer that best via the contact section — rahulrauniyar700@gmail.com. Or ask me about: experience? AI bots? projects? skills? hiring?";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi! 👋 I'm Rahul's AI assistant. Ask me — experience? AI bots? projects? hiring?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  // 🔊 first visit (per tab session) → the chatbot greets by voice.
  // Key lives in sessionStorage: tab close = key auto-removed = next visit greets again.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    try {
      if (sessionStorage.getItem("rr-voice-greeted")) return;
      t = setTimeout(() => {
        try {
          const synth = window.speechSynthesis;
          if (synth) {
            const u = new SpeechSynthesisUtterance(
              "Hi! I'm Rahul's AI assistant. Ask me about his experience, projects, or hiring!"
            );
            u.rate = 1.05;
            synth.speak(u);
          }
        } catch {
          /* voice not available */
        }
        try {
          sessionStorage.setItem("rr-voice-greeted", "1");
        } catch {
          /* storage unavailable */
        }
      }, 2500);
    } catch {
      /* storage unavailable */
    }
    return () => clearTimeout(t);
  }, []);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: botReply(q) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI assistant"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-bold text-black shadow-2xl shadow-cyan-500/30"
      >
        {open ? <X size={17} /> : <Bot size={17} />}
        {open ? "Close" : "Ask AI about Rahul"}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-lime-400 text-[9px] font-black text-black">
              1
            </span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-20 left-4 z-50 flex h-[420px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0b1020]/95 shadow-2xl backdrop-blur-xl sm:left-6"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-black">
                <Bot size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Rahul's AI Assistant</p>
                <p className="flex items-center gap-1 text-[11px] text-lime-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> Online — instant reply
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-md bg-gradient-to-r from-cyan-400 to-violet-500 text-black"
                        : "rounded-bl-md border border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-3 pt-2">
              {["Experience?", "AI bots?", "Projects?", "Hire Rahul?"].map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-400 hover:text-black"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your question…"
                className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
              />
              <button
                onClick={() => send()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
