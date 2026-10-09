import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Bot,
  Check,
  Copy,
  Loader2,
  MessageCircle,
  Quote,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { chatFaqs, profile, services, testimonials } from "../data";

/* ================= PRELOADER (cinematic) ================= */

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
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center"
          style={{ background: "#f6f6f4" }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="mx-auto h-16 w-16 rounded-2xl p-[2px]"
              style={{
                background: "linear-gradient(135deg, #5eead4, #6366f1)",
                boxShadow: "0 0 40px rgba(94, 234, 212, 0.3)",
              }}
            >
              <div
                className="grid h-full w-full place-items-center rounded-2xl font-display text-lg font-black text-slate-900"
                style={{ background: "#f6f6f4" }}
              >
                {profile.avatarInitials}
              </div>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mt-4 font-display text-sm font-bold tracking-[0.3em]"
              style={{
                background: "linear-gradient(135deg, #0d9488, #4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
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
    <section id="services" className="relative z-10 mx-auto max-w-6xl overflow-hidden px-5 py-24 sm:px-8">
      <div data-speed="0.3" className="gs-parallax pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full blur-[130px]" style={{ background: "rgba(251, 191, 36, 0.07)" }} />
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600"
          style={{
            border: "1px solid rgba(251, 191, 36, 0.2)",
            background: "rgba(251, 191, 36, 0.06)",
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.1)",
          }}
        >
          <Sparkles size={13} /> What I do
        </span>
        <h2 className="mt-5 font-display gradient-title text-3xl font-bold sm:text-5xl leading-[1.1]">
          Hire me for outcomes, not just code
        </h2>
        <p className="mt-4 text-slate-500 leading-relaxed">
          Whether you're a recruiter or a founder — these three services deliver the most value.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="neon-card group p-6"
          >
            <span className="text-4xl">{s.emoji}</span>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            <ul className="mt-4 space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                  <Check size={13} className="text-amber-600" /> {p}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-slate-900 transition hover:text-teal-600"
              data-cursor-hover
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
    <section id="testimonials" className="relative z-10 mx-auto max-w-6xl overflow-hidden px-5 py-24 sm:px-8">
      <div data-speed="0.35" className="gs-parallax pointer-events-none absolute -right-40 top-32 h-96 w-96 rounded-full blur-[130px]" style={{ background: "rgba(45, 212, 191, 0.08)" }} />
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600"
          style={{
            border: "1px solid rgba(251, 191, 36, 0.2)",
            background: "rgba(251, 191, 36, 0.06)",
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.1)",
          }}
        >
          <Quote size={13} /> Social proof
        </span>
        <h2 className="mt-5 font-display gradient-title text-3xl font-bold sm:text-5xl leading-[1.1]">
          People I've worked with
        </h2>
      </div>
      <div
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-8 text-center sm:p-10"
        style={{
          border: "1px solid rgba(94, 234, 212, 0.1)",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8))",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 40px rgba(94, 234, 212, 0.08), 0 20px 60px rgba(15, 23, 42, 0.10)",
        }}
      >
        {/* Holographic top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
          background: "linear-gradient(90deg, transparent, #fbbf24, #f97316, transparent)",
          backgroundSize: "200% 100%",
          animation: "holographic 5s ease infinite",
        }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <Quote className="mx-auto" size={28} style={{ color: "#5eead4", filter: "drop-shadow(0 0 8px rgba(94, 234, 212, 0.4))" }} />
            <p className="mt-4 text-lg leading-relaxed text-slate-700">"{cur.quote}"</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-full font-display text-xs font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: "0 0 15px rgba(79, 70, 229, 0.35)",
                }}
              >
                {cur.initials}
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold text-slate-900">{cur.name}</span>
                <span className="block text-xs text-teal-600">{cur.role}</span>
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
              className="h-2 rounded-full transition-all"
              style={{
                width: i === idx ? 32 : 8,
                background: i === idx ? "#5eead4" : "rgba(15, 23, 42, 0.15)",
                boxShadow: i === idx ? "0 0 10px rgba(94, 234, 212, 0.4)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CONTACT FORM ================= */

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

  const inputStyle = {
    border: "1px solid rgba(15, 23, 42, 0.08)",
    background: "#ffffff",
    backdropFilter: "blur(8px)",
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
        className="rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-teal-400/40 transition"
        style={inputStyle}
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Your email *"
        type="email"
        className="rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-teal-400/40 transition"
        style={inputStyle}
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Project details / role / message *"
        rows={4}
        className="rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-teal-400/40 transition sm:col-span-2"
        style={inputStyle}
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] sm:col-span-2"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          boxShadow: "0 0 25px rgba(79, 70, 229, 0.35)",
        }}
        data-cursor-hover
      >
        <Send size={15} /> {sent ? "Opening your email app… ✓" : "Send Message"}
      </button>
      {sent && (
        <p className="text-center text-xs text-amber-600 sm:col-span-2">
          Thanks {form.name.split(" ")[0]}! Your email app should have opened — expect a reply within 24 hours.
        </p>
      )}
    </form>
  );
}

/* ================= FLOATING ACTIONS ================= */

export function FloatingActions({ showTop, hidden }: { showTop: boolean; hidden?: boolean }) {
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
    /* ── Unified action dock: evenly spaced, never overlapping ── */
    <AnimatePresence>
      {!hidden && (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-1.5 rounded-2xl border border-slate-900/10 bg-white/90 p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.15)] backdrop-blur-md"
    >
      {/* Copy email */}
      <button
        onClick={copyEmail}
        aria-label="Copy email"
        title={copied ? "Copied!" : "Copy email"}
        className="grid h-10 w-10 place-items-center rounded-xl transition hover:scale-105 hover:bg-slate-900/[0.05]"
        style={{ color: copied ? "#b45309" : "#0d9488" }}
      >
        {copied ? <Check size={18} /> : <Copy size={17} />}
      </button>
      <span className="h-px w-6 bg-slate-900/10" />
      {/* WhatsApp */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
          "Hi Rahul! I saw your portfolio and want to discuss an opportunity."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="grid h-10 w-10 place-items-center rounded-xl text-white"
        style={{ background: "#25D366" }}
      >
        <MessageCircle size={18} />
      </motion.a>
      {/* Back to top (appears after scrolling) */}
      <AnimatePresence mode="popLayout">
        {showTop && (
          <motion.div
            key="top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="h-px w-6 bg-slate-900/10" />
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="grid h-10 w-10 place-items-center rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= AI CHAT WIDGET ================= */

interface AgentAction {
  label: string;
  href: string;
}

interface AgentMsg {
  id: number;
  from: "bot" | "user";
  text: string;
  actions?: AgentAction[];
  meta?: string;
}

interface TraceStep {
  label: string;
  done: boolean;
}

interface Intent {
  id: string;
  label: string;
  match: string[];
  sources: number;
  reply: string;
  actions?: AgentAction[];
  followups: string[];
}

/* Short keys (≤3 chars) match on word boundaries so "hi" never fires inside "hiring". */
function keyHit(lower: string, key: string): boolean {
  if (key.length <= 3) {
    try {
      return new RegExp(`\\b${key}\\b`).test(lower);
    } catch {
      return lower.includes(key);
    }
  }
  return lower.includes(key);
}

const DEFAULT_FOLLOWUPS = ["Experience?", "AI bots?", "Projects?", "Hire Rahul?"];

const INTENTS: Intent[] = [
  {
    id: "ultimabot", label: "project · Ultimabot AI",
    match: ["ultimabot", "ultima"],
    sources: 4,
    reply: "Ultimabot AI is Rahul's flagship build — a production platform with an AI chatbot, email bot and inbound/outbound voice bots for support, lead-gen and appointment booking. GPT-4o + embeddings over website data and PDFs, Calendly + Google Meet auto-booking, Redis caching. Result: +40% lead-qualification efficiency.",
    actions: [
      { label: "Open live app", href: "https://app.ultimabot.ai" },
      { label: "All projects", href: "#projects" },
    ],
    followups: ["Hire Rahul?", "AI bots?", "Experience?"],
  },
  {
    id: "welfore", label: "project · Ask Welfore",
    match: ["welfore", "diet", "ask welfore"],
    sources: 3,
    reply: "Ask Welfore is a diet-tracking app with 5,000+ users — personalized plans, daily meal and nutrition tracking, real-time analytics and progress charts. Built with React + Node + Express + MongoDB.",
    actions: [{ label: "Open live app", href: "https://app.askwelfore.com" }],
    followups: ["Projects?", "Hire Rahul?"],
  },
  {
    id: "transplant", label: "project · Transplant Made Easy",
    match: ["transplant", "healthcare", "hipaa", "hospital", "kidney", "donor"],
    sources: 3,
    reply: "Transplant Made Easy is a HIPAA-compliant cross-platform desktop app connecting kidney-transplant candidates with donors. React + Electron + Node + MongoDB, with Skyflow Privacy Vault for patient-data security.",
    followups: ["Projects?", "Skills?"],
  },
  {
    id: "iot", label: "project · Gunlox IoT",
    match: ["gunlox", "iot", "smart lock", "facial recognition", "bluetooth"],
    sources: 2,
    reply: "Gunlox is a smart IoT firearm lock using Bluetooth and facial recognition. Rahul built the admin panel and integrated the complex API services (Angular + Node + Express + MongoDB).",
    followups: ["Projects?", "Experience?"],
  },
  {
    id: "saas", label: "project · SaaS builds",
    match: ["invoice", "kitchen", "saas", "food order", "drag-and-drop"],
    sources: 3,
    reply: "On the SaaS side: Mom's Kitchen (online food ordering, React + Redux) and Invoice Builder (drag-and-drop invoice templates with one-click generation — live demo linked in the projects section).",
    actions: [{ label: "All projects", href: "#projects" }],
    followups: ["Projects?", "Hire Rahul?"],
  },
  {
    id: "ai", label: "capability · AI bots",
    match: ["ai", "chatbot", "voice", "bot", "bots", "openai", "gpt", "llm", "agent", "agents", "embeddings", "prompt"],
    sources: 5,
    reply: "AI bots are Rahul's core strength. At Ultimabot AI he shipped a chatbot, email bot and inbound/outbound voice bots to production — GPT-4o + embeddings, Redis caching, Calendly/Meet flows. Lead qualification improved by 40%, app load times dropped 30%.",
    followups: ["Projects?", "Hire Rahul?", "Skills?"],
  },
  {
    id: "projects", label: "portfolio · projects",
    match: ["project", "projects", "work", "portfolio", "built", "apps", "case stud"],
    sources: 6,
    reply: "Top of the stack: Ultimabot AI (AI support + lead-gen platform), Ask Welfore (5K+ users), Transplant Made Easy (HIPAA healthcare app), Gunlox (IoT smart lock), plus Invoice Builder and Mom's Kitchen. Filter them by AI / Healthcare / IoT / SaaS in the projects section.",
    actions: [{ label: "See all projects", href: "#projects" }],
    followups: ["AI bots?", "Hire Rahul?"],
  },
  {
    id: "experience", label: "profile · experience",
    match: ["experience", "experiences", "years", "worked", "career", "background", "companies", "company", "senior", "fresher"],
    sources: 3,
    reply: "4+ years across the stack: Software Engineer at Cyber Vision Infotech (AI chatbot, email + voice bot systems, -30% load times), Associate Software Engineer at OTS Solutions (healthcare + IoT + fintech), plus freelance full-stack work at Micronsol InfoTech.",
    followups: ["AI bots?", "Projects?", "Skills?"],
  },
  {
    id: "skills", label: "profile · skills",
    match: ["skill", "skills", "stack", "tech", "technologies", "mern", "nestjs", "react", "node", "typescript", "aws", "docker", "redis", "mongodb", "socket"],
    sources: 6,
    reply: "Core stack: React, Next.js, NestJS, Node + Express, MongoDB, MySQL, Redis. AI layer: OpenAI GPT-4o, embeddings, prompt engineering, voice bots. Cloud: AWS Lambda/EC2/S3, Docker, CI/CD — plus Socket.io realtime and Twilio.",
    followups: ["AI bots?", "Experience?"],
  },
  {
    id: "services", label: "offering · services",
    match: ["service", "services", "freelance", "offer", "what do you do", "consult"],
    sources: 3,
    reply: "Three things Rahul delivers: 1) AI chatbot + voice bot development (GPT-4o + embeddings, +40% lead qualification), 2) full-stack SaaS apps in MERN + NestJS, 3) cloud, realtime and integrations (AWS, Socket.io, Twilio, payments). Process: Discover → Design → Develop → Deploy.",
    actions: [{ label: "Start a project", href: "#contact" }],
    followups: ["Hire Rahul?", "Projects?"],
  },
  {
    id: "hire", label: "action · hiring",
    match: ["hire", "hiring", "contact", "email", "phone", "call", "join", "joining", "available", "availability", "ctc", "salary", "package", "budget", "rate", "rates", "cost", "price", "interview", "opportunity", "role", "job"],
    sources: 2,
    reply: "Rahul is an immediate joiner in Gurugram, open to remote and on-site roles. For timelines, rates or CTC, the fastest path is direct: rahulrauniyar700@gmail.com or +91-8546001170 — he replies within 24 hours. Or drop a message in the contact section below.",
    actions: [{ label: "Go to contact", href: "#contact" }],
    followups: ["Projects?", "Experience?"],
  },
  {
    id: "resume", label: "document · resume",
    match: ["resume", "cv", "cvv"],
    sources: 1,
    reply: "Hit the 'Download Resume' button in the hero section — it auto-downloads the PDF. Or email rahulrauniyar700@gmail.com and he'll send it over with a note on relevant work.",
    followups: ["Hire Rahul?", "Experience?"],
  },
  {
    id: "education", label: "profile · education",
    match: ["education", "degree", "mca", "bca", "college", "study", "qualification", "university"],
    sources: 2,
    reply: "MCA from JSU Shikohabad (2023–25) and BCA from MCRPV Bhopal (2019–22) — backed by 4+ years of production full-stack and GenAI work.",
    followups: ["Experience?", "Skills?"],
  },
  {
    id: "location", label: "profile · location",
    match: ["location", "where", "live", "based", "city", "gurugram", "gurgaon", "india", "remote", "onsite", "on-site", "relocate", "wfo", "wfh"],
    sources: 1,
    reply: "Based in Gurugram, Haryana, India — open to remote as well as on-site roles.",
    followups: ["Hire Rahul?", "Experience?"],
  },
  {
    id: "github", label: "profile · github",
    match: ["github", "git ", "repo", "repos", "code", "open source", "commit"],
    sources: 2,
    reply: "His GitHub is @rauni00 — and this very page has a live section pulling his latest repos straight from the GitHub API, auto-fresh on every push.",
    actions: [{ label: "Open GitHub", href: "https://github.com/rauni00" }],
    followups: ["Projects?", "Skills?"],
  },
  {
    id: "who", label: "profile · intro",
    match: ["who is rahul", "who are you", "about rahul", "yourself", "introduce", "your name"],
    sources: 4,
    reply: "I'm the AI agent for Rahul Rauniyar — full-stack developer (MERN + NestJS) and GenAI app builder from Gurugram. 4+ years, production AI chatbots + voice bots, immediate joiner. Ask me anything about his work — or put me to use and start a hire.",
    followups: ["Experience?", "Projects?", "Hire Rahul?"],
  },
  {
    id: "thanks", label: "courtesy · thanks",
    match: ["thanks", "thank you", "great", "awesome", "nice", "cool", "perfect", "super"],
    sources: 1,
    reply: "Anytime! That's what I'm here for. Want me to pull up projects next — or connect you with Rahul directly?",
    followups: ["Hire Rahul?", "Projects?"],
  },
  {
    id: "bye", label: "courtesy · goodbye",
    match: ["bye", "goodbye", "see you", "later", "good night"],
    sources: 1,
    reply: "See you! I'll be right here if you need Rahul's details — experience, projects, or hiring. 👋",
    followups: ["Hire Rahul?"],
  },
  {
    id: "greeting", label: "courtesy · greeting",
    match: ["hello", "hey", "namaste", "good morning", "good evening", "good afternoon"],
    sources: 1,
    reply: "Hey! I'm Rahul's AI agent — I reason over his portfolio knowledge before answering. Try me: his AI bot work, top projects, or how to hire him. What's first?",
    followups: ["Experience?", "AI bots?", "Hire Rahul?"],
  },
];

function resolveIntent(q: string): Intent {
  const lower = q.toLowerCase();
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.match) {
      if (keyHit(lower, k.toLowerCase())) score += k.length <= 3 ? 2 : 3 + k.length * 0.1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  if (best) return best;
  // Fallback layer: legacy FAQ knowledge
  let fbScore = 0;
  let fbReply: string | null = null;
  for (const f of chatFaqs) {
    let s = 0;
    for (const k of f.keys) {
      if (keyHit(lower, k.toLowerCase())) s += 1;
    }
    if (s > fbScore) {
      fbScore = s;
      fbReply = f.reply;
    }
  }
  if (fbReply) {
    return {
      id: "faq", label: "knowledge · faq", match: [], sources: 2,
      reply: fbReply, followups: DEFAULT_FOLLOWUPS,
    };
  }
  return {
    id: "unknown", label: "knowledge · general", match: [], sources: 8,
    reply: "Hmm — that one isn't in my knowledge base yet. I can dig into: experience, AI bots, projects, skills, education, or hiring. Try one of those — or ask Rahul directly via the contact section and he'll reply within 24 hours.",
    followups: DEFAULT_FOLLOWUPS,
  };
}

/* Scroll to a page section, or open an external link. */
function goTo(href: string) {
  if (href.startsWith("#")) {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.open(href, "_blank", "noopener,noreferrer");
  }
}

export function ChatWidget({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "thinking" | "answering">("idle");
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [msgs, setMsgs] = useState<AgentMsg[]>([
    {
      id: 0,
      from: "bot",
      text: "Hey! I'm Rahul's AI agent — I reason over his portfolio before answering. Ask me about experience, AI bots, projects, or hiring.",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_FOLLOWUPS);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);
  const runRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, trace, phase, open]);

  // Clear all pending agent timers (used when a new run starts or on unmount).
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  // 🔊 first visit (per tab session) → the agent greets by voice.
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
              "Hi! I'm Rahul's AI agent. Ask me about his experience, projects, or hiring!"
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

  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  /* Agentic loop: parse intent → query knowledge → compose → stream the answer. */
  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || phase !== "idle") return;
    const run = ++runRef.current;
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    const alive = () => runRef.current === run;

    const intent = resolveIntent(q);
    // Deterministic "confidence" + timing so renders stay pure (no Math.random/Date).
    const conf = 87 + (q.length % 12);
    const streamSpeed = 60;
    const wordsPerTick = 2;
    const thinkSecs = 2.2;
    const estSecs = (thinkSecs + (intent.reply.split(" ").length / wordsPerTick) * (streamSpeed / 1000)).toFixed(1);

    setMsgs((m) => [...m, { id: idRef.current++, from: "user", text: q }]);
    setInput("");
    setPhase("thinking");
    setTrace([{ label: "Parsing intent…", done: false }]);

    later(() => {
      if (!alive()) return;
      setTrace([
        { label: `Intent → ${intent.label} (${conf}%)`, done: true },
        { label: "Querying portfolio knowledge…", done: false },
      ]);
    }, 750);

    later(() => {
      if (!alive()) return;
      setTrace([
        { label: `Intent → ${intent.label} (${conf}%)`, done: true },
        { label: `Knowledge → ${intent.sources} sources`, done: true },
        { label: "Composing answer…", done: false },
      ]);
    }, 1500);

    later(() => {
      if (!alive()) return;
      setTrace((s) => s.map((step) => ({ ...step, done: true })));
      setPhase("answering");
      const id = idRef.current++;
      setMsgs((m) => [...m, { id, from: "bot", text: "" }]);

      const words = intent.reply.split(" ");
      let i = 0;
      const tick = window.setInterval(() => {
        if (!alive()) {
          clearInterval(tick);
          return;
        }
        i += wordsPerTick;
        const finished = i >= words.length;
        const sliced = words.slice(0, i).join(" ");
        setMsgs((m) => m.map((mm) => (mm.id === id ? { ...mm, text: sliced } : mm)));
        if (finished) {
          clearInterval(tick);
          setMsgs((m) =>
            m.map((mm) =>
              mm.id === id
                ? { ...mm, actions: intent.actions, meta: `⚡ ${intent.sources} sources • ${estSecs}s` }
                : mm
            )
          );
          setSuggestions(intent.followups);
          setTrace([]);
          setPhase("idle");
        }
      }, streamSpeed);
      timersRef.current.push(tick);
    }, 2200);
  };

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => onOpenChange(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI agent"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          boxShadow: "0 0 30px rgba(79, 70, 229, 0.35), 0 8px 32px rgba(15, 23, 42, 0.2)",
        }}
      >
        {open ? <X size={17} /> : <Bot size={17} />}
        {open ? "Close" : "Ask AI Agent"}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-black">
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
            className="fixed bottom-20 left-4 z-50 flex h-[420px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-2xl sm:left-6"
            style={{
              border: "1px solid rgba(94, 234, 212, 0.12)",
              background: "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(94, 234, 212, 0.10), 0 25px 80px rgba(15, 23, 42, 0.18)",
            }}
          >
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
              background: "linear-gradient(90deg, #5eead4, #6366f1, #5eead4)",
              backgroundSize: "200% 100%",
              animation: "holographic 4s ease infinite",
            }} />
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "linear-gradient(135deg, rgba(94, 234, 212, 0.08), rgba(99, 102, 241, 0.08))" }}>
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: "0 0 12px rgba(79, 70, 229, 0.4)",
                }}
              >
                <Bot size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Rahul's AI Agent</p>
                <p className="flex items-center gap-1 text-[11px] text-amber-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  {phase === "idle" ? "Agentic • thinks before replying" : "Agent working…"}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-md text-white"
                        : "rounded-bl-md text-slate-700"
                    }`}
                    style={
                      m.from === "user"
                        ? {
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          }
                        : {
                            border: "1px solid rgba(15, 23, 42, 0.06)",
                            background: "rgba(15, 23, 42, 0.03)",
                          }
                    }
                  >
                    {m.text ? (
                      <span className="whitespace-pre-line">{m.text}</span>
                    ) : (
                      <span className="flex gap-1 py-1">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.18 }}
                            className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                          />
                        ))}
                      </span>
                    )}
                    {m.meta && (
                      <span className="mt-1.5 block font-mono text-[10px] text-slate-400">{m.meta}</span>
                    )}
                    {m.actions && m.actions.length > 0 && (
                      <span className="mt-2 flex flex-wrap gap-1.5">
                        {m.actions.map((a) => (
                          <button
                            key={a.label}
                            onClick={() => goTo(a.href)}
                            className="rounded-full px-3 py-1 text-[11px] font-bold text-white transition hover:scale-[1.03]"
                            style={{
                              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                              boxShadow: "0 0 10px rgba(79, 70, 229, 0.3)",
                            }}
                          >
                            {a.label} →
                          </button>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {/* Agent thinking trace — visible reasoning, like an agentic loop */}
              {phase === "thinking" && trace.length > 0 && (
                <div className="flex justify-start">
                  <div
                    className="w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-slate-600"
                    style={{
                      border: "1px dashed rgba(79, 70, 229, 0.3)",
                      background: "rgba(79, 70, 229, 0.04)",
                    }}
                  >
                    {trace.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 py-0.5">
                        {s.done ? (
                          <Check size={12} className="shrink-0 text-teal-600" />
                        ) : (
                          <Loader2 size={12} className="shrink-0 animate-spin text-indigo-500" />
                        )}
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-slate-900/10 px-3 pt-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold text-teal-700 transition"
                  style={{
                    border: "1px solid rgba(94, 234, 212, 0.2)",
                    background: "rgba(94, 234, 212, 0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#5eead4";
                    (e.currentTarget as HTMLElement).style.color = "#070810";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(94, 234, 212, 0.06)";
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
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
                className="flex-1 rounded-full px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-teal-400/30 transition"
                style={{
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  background: "#ffffff",
                }}
              />
              <button
                onClick={() => send()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: "0 0 12px rgba(79, 70, 229, 0.35)",
                }}
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
