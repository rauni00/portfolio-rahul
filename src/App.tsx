import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Download,
  ExternalLink,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  Rocket,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import {
  ChatWidget,
  ContactForm,
  FloatingActions,
  Preloader,
  ServicesSection,
  TestimonialsSection,
} from "./components/Upgrades";
import { GitHubSection, ProcessSection } from "./components/More";
import GsapEffects from "./components/GsapEffects";
import AgentConsole from "./components/AgentConsole";
import CustomCursor from "./components/CustomCursor";
import { SectionDivider, SectionReveal } from "./components/SectionTransitions";
// Spline scene is loaded only for the hero; keeps the page lightweight while using the published 3D asset
const SplineHero = lazy(() => import("./components/SplineHero"));

/* 3D must NEVER blank the page: on any Canvas/WebGL failure show AgentConsole */
class HeroErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <AgentConsole /> : this.props.children;
  }
}
import { usePortfolio } from "./lib/usePortfolio";
import { resumeDownloadUrl, downloadResume } from "./lib/api";

const currentYear = new Date().getFullYear();

/* ---------- helpers ---------- */

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 48, scale: 0.98 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* Cinematic section heading with neon kicker + ghost number */
function SectionHeading({
  kicker,
  title,
  sub,
  kickerColor = "cyan",
  no,
  align = "center",
}: {
  kicker: string;
  title: string;
  sub?: string;
  kickerColor?: "cyan" | "lime" | "violet" | "amber" | "rose";
  no?: string;
  align?: "center" | "left";
}) {
  const colorMap = {
    cyan: { border: "rgba(94, 234, 212, 0.25)", bg: "rgba(94, 234, 212, 0.08)", text: "text-teal-300", glow: "rgba(94, 234, 212, 0.15)" },
    lime: { border: "rgba(251, 191, 36, 0.25)", bg: "rgba(251, 191, 36, 0.08)", text: "text-amber-400", glow: "rgba(251, 191, 36, 0.15)" },
    violet: { border: "rgba(99, 102, 241, 0.25)", bg: "rgba(99, 102, 241, 0.08)", text: "text-indigo-300", glow: "rgba(99, 102, 241, 0.15)" },
    amber: { border: "rgba(251, 191, 36, 0.25)", bg: "rgba(251, 191, 36, 0.08)", text: "text-amber-400", glow: "rgba(251, 191, 36, 0.15)" },
    rose: { border: "rgba(251, 113, 133, 0.25)", bg: "rgba(251, 113, 133, 0.08)", text: "text-orange-400", glow: "rgba(251, 113, 133, 0.15)" },
  };
  const c = colorMap[kickerColor];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className={`relative mb-14 max-w-2xl ${align === "left" ? "mx-0 text-left" : "mx-auto text-center"}`}
    >
      {no && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-9 select-none font-display text-7xl font-black tracking-tight text-white/[0.07] ${align === "left" ? "left-0" : "left-1/2 -translate-x-1/2"}`}
        >
          {no}
        </span>
      )}
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${c.text}`}
        style={{ border: `1px solid ${c.border}`, background: c.bg, boxShadow: `0 0 20px ${c.glow}` }}
      >
        <Sparkles size={13} /> {kicker}
      </span>
      <h2 className="fluid-h2 mt-5 font-display gradient-title font-bold">
        {title}
      </h2>
      {sub && <p className="mt-4 text-slate-400 leading-relaxed">{sub}</p>}
    </motion.div>
  );
}

/* ---------- main ---------- */

/* Load the heavy 3D scene on every screen (mobile included), deferred
   until after first paint so LCP isn't blocked. Only reduced-motion
   users skip it — the static content stays fully readable for them. */
function useShouldLoad3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqWide = window.matchMedia("(min-width: 640px)");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // Data-saver users asked for less data — keep the robot off for them
    if (conn?.saveData) return;
    const compute = () => setOk(!mqMotion.matches);
    // Defer past first paint: idle callback with timeout fallback
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const schedule = (fn: () => void): number => {
      if (typeof w.requestIdleCallback === "function") {
        return w.requestIdleCallback(fn, { timeout: 3000 });
      }
      return window.setTimeout(fn, 2000);
    };
    const cancel = (id: number) => {
      if (typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
    let id = 0;
    let onLoad: (() => void) | null = null;
    if ((!mqFine.matches || !mqWide.matches) && document.readyState !== "complete") {
      // On phones, never let Spline fight first paint — wait for full load
      onLoad = () => {
        id = schedule(compute);
      };
      window.addEventListener("load", onLoad, { once: true });
    } else {
      id = schedule(compute);
    }
    mqMotion.addEventListener?.("change", compute);
    return () => {
      cancel(id);
      if (onLoad) window.removeEventListener("load", onLoad);
      mqMotion.removeEventListener?.("change", compute);
    };
  }, []);
  return ok;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  // Dynamic content: from the email-bot API, with data.ts as fallback
  const { data: pd } = usePortfolio();
  const { profile, socials, stats, skillGroups, marqueeSkills, experiences, projects, education, achievements, navLinks } = pd;
  const resumeUrl = resumeDownloadUrl(profile.resumeLink);
  const shouldLoad3D = useShouldLoad3D();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  // mouse glow (large ambient)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glowX = useTransform(mx, (v) => v - 300);
  const glowY = useTransform(my, (v) => v - 300);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mx, my]);

  // Close mobile menu on Escape for keyboard users
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="relative min-h-screen bg-[#0B0F17] font-body text-slate-300 antialiased">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900 focus:shadow-xl"
      >
        Skip to content
      </a>
      <Preloader />
      <GsapEffects />
      <CustomCursor />

      {/* Progress bar (cinematic gradient) */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
        data-cursor-hover
      >
        <div className="h-full w-full" style={{
          background: "linear-gradient(90deg, #5eead4, #6366f1)",
          boxShadow: "0 0 15px rgba(94, 234, 212, 0.4)",
        }} />
      </motion.div>

      {/* Mouse glow (ambient) */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="mouse-glow hidden md:block"
      />

      {/* 3D robot — fixed global ambient stage on every screen (z-0, behind
          the opaque cards). Right-shifted on desktop so hero copy stays clean. */}
      {shouldLoad3D && (
        <div className="pointer-events-none fixed inset-0 z-0 lg:left-[28%]" aria-hidden="true">
          <div className="h-full w-full origin-center">
            <HeroErrorBoundary>
              <Suspense fallback={null}>
                <SplineHero fill />
              </Suspense>
            </HeroErrorBoundary>
          </div>
        </div>
      )}
      {/* Grid background */}
      <div className="grid-bg pointer-events-none fixed inset-0 z-0" />

      {/* ─── HEADER ─── */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 shadow-2xl sm:px-6" style={{
          border: "1px solid rgba(94, 234, 212, 0.08)",
          boxShadow: "0 8px 32px rgba(255, 255, 255, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
        }}>
          <a href="#home" className="group flex items-center gap-3" data-cursor-hover>
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-10 w-10 rounded-xl object-cover shadow-lg transition-transform group-hover:rotate-3"
                style={{ boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-xl font-display text-sm font-bold text-white shadow-lg transition-transform group-hover:rotate-12" style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)",
              }}>
                {profile.avatarInitials}
              </span>
            )}
            <span className="font-display text-sm font-bold text-white sm:text-base">
              {profile.name}
              <span className="block text-[11px] font-normal text-teal-300/80">
                {profile.availability}
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                data-cursor-hover
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="btn-primary ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition hover:scale-105"
              data-cursor-hover
            >
              Hire Me <ArrowRight size={15} />
            </a>
          </nav>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 p-3 lg:hidden"
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.06]"
                >
                  {l.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════ HERO (side by side) ═══════════ */}
      <section id="home" className="relative z-10 overflow-hidden pb-20 pt-28 sm:pt-36">
        {/* Cinematic blobs */}
        <div data-speed="0.35" className="gs-parallax pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full blur-[130px]" style={{ background: "rgba(94, 234, 212, 0.12)" }} />
        <div data-speed="0.2" className="gs-parallax pointer-events-none absolute -right-40 top-32 h-[32rem] w-[32rem] rounded-full blur-[140px]" style={{ background: "rgba(99, 102, 241, 0.12)", animationDelay: "-4s" }} />
        <div data-speed="0.45" className="gs-parallax pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-[110px]" style={{ background: "rgba(251, 113, 133, 0.06)" }} />
        {/* Mobile-only readability wash (desktop uses the left-column wash below) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F17]/75 via-[#0B0F17]/30 to-transparent sm:hidden" />
        {/* Desktop readability wash behind the copy column (softens the 3D) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/80 to-transparent lg:block" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          {/* Left: Text content */}
          <div>
            <div
              data-gs-badge
              className="flex items-center gap-3"
            >
              {profile.photo && (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-teal-400/40"
                />
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile.availability}
              </span>
            </div>

            <h1 className="fluid-display mt-6 font-display font-extrabold text-white">
              <span className="block overflow-hidden pb-1">
                <span data-gs-line className="block text-slate-300">
                  Hi, I'm{" "}
                  <span className="text-brand-gradient">
                    {profile.firstName}
                  </span>
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span
                  data-gs-line
                  className="text-stroke block font-black uppercase tracking-[-0.06em] text-white/90"
                >
                  {profile.role}
                </span>
              </span>
            </h1>

            <p data-gs-fade className="mt-5 max-w-lg text-lg leading-relaxed text-slate-400">
              {profile.tagline}
            </p>

            <div data-gs-fade className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="primary-button magnetic btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition hover:scale-[1.02]"
                data-cursor-hover
              >
                <Rocket size={16} /> View My Work
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={resumeUrl}
                onClick={(e) => {
                  // Token-authenticated download (Settings resume); falls back to plain link
                  e.preventDefault();
                  downloadResume("Rahul-Rauniyar-Resume.pdf").then((ok) => {
                    if (!ok) window.location.href = resumeUrl;
                  });
                }}
                className="magnetic inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-teal-400/40 hover:bg-white/10"
                data-cursor-hover
              >
                <Download size={16} /> Download Resume
              </a>
            </div>

            <div data-gs-fade className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-teal-300" /> {profile.location}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Phone size={15} className="text-teal-300" /> {profile.phone}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <a href="#contact" className="font-semibold text-indigo-300 hover:underline" data-cursor-hover>
                Let's work together →
              </a>
            </div>

            <div
              data-gs-stat
              className="mt-8 grid max-w-xl grid-cols-2 divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm sm:grid-cols-4 sm:divide-x"
              style={{ boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)" }}
            >
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-4 text-center">
                  <div className="font-display text-2xl font-extrabold text-white">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live AI agent console (dark default blends with the 3D stage) */}
          <div data-gs-fade className="relative mx-auto w-full max-w-md lg:mx-0">
            <AgentConsole />
          </div>
        </div>

      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <div className="relative z-10 overflow-hidden py-5" style={{
        borderTop: "1px solid rgba(94, 234, 212, 0.08)",
        borderBottom: "1px solid rgba(94, 234, 212, 0.08)",
        background: "rgba(94, 234, 212, 0.02)",
      }}>
        <div className="flex w-max animate-marquee gap-3">
          {[...marqueeSkills, ...marqueeSkills].map((s, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold text-slate-400"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.04)",
              }}
            >
              ✦ {s}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ SERVICES ═══════════ */}
      <SectionReveal>
        <ServicesSection />
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ SKILLS ═══════════ */}
      <SectionReveal>
        <section id="skills" className="relative z-10 mx-auto max-w-6xl overflow-hidden px-5 py-24 sm:px-8">
          <div data-speed="0.25" className="gs-parallax pointer-events-none absolute -right-40 top-16 h-96 w-96 rounded-full blur-[130px]" style={{ background: "rgba(99, 102, 241, 0.10)" }} />
          <div data-speed="0.4" className="gs-parallax pointer-events-none absolute -left-40 bottom-10 h-80 w-80 rounded-full blur-[120px]" style={{ background: "rgba(45, 212, 191, 0.08)" }} />
          <SectionHeading
            kicker="Tech Arsenal"
            title="Skills that ship production apps"
            sub="Frontend to backend to GenAI — full stack, end to end."
            kickerColor="cyan"
            no="01"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g, i) => (
              <motion.div
                key={g.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="neon-card group p-6"
              >
                <div
                  className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl"
                  style={{
                    background: `${g.color}15`,
                    color: g.color,
                    border: `1px solid ${g.color}30`,
                    boxShadow: `0 0 15px ${g.color}15`,
                  }}
                >
                  <g.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{g.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full px-3 py-1 text-xs text-slate-400 transition group-hover:border-white/15 hover:!border-teal-400/40 hover:text-white"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(255, 255, 255, 0.04)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ EXPERIENCE ═══════════ */}
      <SectionReveal>
        <section id="experience" className="relative z-10 overflow-hidden py-24" style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.025)",
        }}>
          <div data-speed="0.3" className="gs-parallax pointer-events-none absolute -left-40 top-24 h-[26rem] w-[26rem] rounded-full blur-[130px]" style={{ background: "rgba(45, 212, 191, 0.09)" }} />
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading
              kicker="Career Journey"
              title="Where I've worked & what I delivered"
              kickerColor="violet"
              no="02"
              align="left"
            />
            <div className="relative space-y-6 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px sm:before:left-1/2" style={{
              /* neon timeline line */
            }}>
              <div className="absolute bottom-4 left-[19px] top-4 w-px sm:left-1/2" style={{
                background: "linear-gradient(180deg, #5eead4, #6366f1, transparent)",
              }} />
              {experiences.map((e, i) => (
                <motion.div
                  key={e.company}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className={`relative flex sm:w-1/2 ${
                    i % 2 === 0
                      ? "sm:pr-10"
                      : "sm:ml-auto sm:flex-row-reverse sm:pl-10 sm:text-left"
                  } pl-12 sm:pl-0`}
                >
                  <span
                    className={`absolute left-3 top-6 grid h-9 w-9 place-items-center rounded-full text-teal-300 sm:left-auto ${
                      i % 2 === 0 ? "sm:-right-[18px]" : "sm:-left-[18px]"
                    }`}
                    style={{
                      border: "1px solid rgba(94, 234, 212, 0.3)",
                      background: "rgba(255, 255, 255, 0.04)",
                      boxShadow: "0 0 15px rgba(94, 234, 212, 0.15)",
                    }}
                  >
                    <Briefcase size={15} />
                  </span>
                  <div className="neon-card w-full p-6 shadow-xl">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-300"
                      style={{ background: "rgba(94, 234, 212, 0.08)" }}
                    >
                      {e.period}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-white">{e.role}</h3>
                    <p className="text-sm font-semibold text-indigo-300">
                      {e.company} • {e.location}
                    </p>
                    <ul className="mt-3 space-y-2.5 text-sm font-medium leading-relaxed text-slate-300">
                      {e.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{
                            background: "linear-gradient(135deg, #5eead4, #6366f1)",
                          }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-3 py-0.5 text-[11px] text-slate-400"
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            background: "rgba(255, 255, 255, 0.04)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ PROJECTS ═══════════ */}
      <SectionReveal>
        <section id="projects" className="relative z-10 mx-auto max-w-6xl overflow-hidden px-5 py-24 sm:px-8">
          <div data-speed="0.28" className="gs-parallax pointer-events-none absolute -right-40 top-40 h-[26rem] w-[26rem] rounded-full blur-[130px]" style={{ background: "rgba(251, 191, 36, 0.08)" }} />
          <div data-speed="0.42" className="gs-parallax pointer-events-none absolute -left-40 bottom-20 h-80 w-80 rounded-full blur-[120px]" style={{ background: "rgba(99, 102, 241, 0.08)" }} />
          <SectionHeading
            kicker="Featured Work"
            title="Projects with real users & revenue impact"
            sub="AI platforms, healthcare, IoT, SaaS — all production-ready."
            kickerColor="cyan"
            no="03"
          />
          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {["All", "AI", "Healthcare", "IoT", "SaaS"].map((f) => (
              <button
                key={f}
                onClick={() => setProjectFilter(f)}
                className="rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300"
                style={{
                  background: projectFilter === f
                    ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                    : "rgba(255, 255, 255, 0.04)",
                  color: projectFilter === f ? "rgba(255, 255, 255, 0.04)" : "#94a3b8",
                  border: `1px solid ${projectFilter === f ? "transparent" : "rgba(255, 255, 255, 0.10)"}`,
                  boxShadow: projectFilter === f ? "0 0 25px rgba(79, 70, 229, 0.35)" : "none",
                }}
                data-cursor-hover
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects
              .filter((p) => {
                if (projectFilter === "All") return true;
                if (projectFilter === "AI")
                  return /AI|bot|GPT|OpenAI/i.test(p.title + p.subtitle + p.description);
                if (projectFilter === "Healthcare")
                  return /health|transplant|hipaa|diet|welfore/i.test(
                    p.title + p.subtitle + p.description
                  );
                if (projectFilter === "IoT")
                  return /iot|gunlox|bluetooth|facial/i.test(p.title + p.subtitle + p.description);
                return /saas|invoice|kitchen|food|order/i.test(p.title + p.subtitle + p.description);
              })
              .map((p, i) => (
              <motion.article
                key={p.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className={`project-card-premium group relative flex h-full flex-col ${
                  p.featured ? "md:col-span-1" : ""
                }`}
                style={{
                  ["--card-gradient" as string]: `linear-gradient(90deg, ${p.gradient.includes("cyan") ? "#5eead4" : p.gradient.includes("lime") ? "#fbbf24" : p.gradient.includes("rose") ? "#fb7185" : p.gradient.includes("amber") ? "#fbbf24" : p.gradient.includes("indigo") ? "#818cf8" : "#5eead4"}, ${p.gradient.includes("violet") ? "#6366f1" : p.gradient.includes("teal") ? "#2dd4bf" : p.gradient.includes("fuchsia") ? "#d946ef" : p.gradient.includes("red") ? "#ef4444" : p.gradient.includes("purple") ? "#6366f1" : "#6366f1"})`,
                }}
              >
                {/* Gradient top bar */}
                <div className={`h-[3px] bg-gradient-to-r ${p.gradient}`} style={{ opacity: 0.8 }} />
                
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    {p.icon ? (
                      <span
                        className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${p.gradient}`}
                      >
                        <p.icon size={26} />
                      </span>
                    ) : (
                      <span className="text-4xl">{p.emoji}</span>
                    )}
                    {p.featured && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white"
                        style={{
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          boxShadow: "0 0 15px rgba(79, 70, 229, 0.35)",
                        }}
                      >
                        <Star size={11} fill="currentColor" /> FEATURED
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white transition group-hover:text-teal-300">
                    {p.title}
                  </h3>
                  <p className="text-sm font-semibold text-indigo-300">{p.subtitle}</p>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">{p.description}</p>
                  {p.impact && (
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-teal-500/15 text-[10px] font-black text-teal-300">
                        ✓
                      </span>
                      {p.impact}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-400 transition hover:border-teal-400/30 hover:text-teal-300"
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          background: "rgba(255, 255, 255, 0.04)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {p.tech.length > 4 && (
                      <span
                        className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-indigo-300"
                        style={{
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                          background: "rgba(99, 102, 241, 0.06)",
                        }}
                      >
                        +{p.tech.length - 4} more
                      </span>
                    )}
                  </div>
                  {p.links.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-3 pt-5">
                      {p.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-teal-300 transition hover:text-indigo-300"
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
                          data-cursor-hover
                        >
                          <ExternalLink size={13} /> {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {/* Ambient corner glow */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${p.gradient} opacity-10 blur-3xl transition-opacity group-hover:opacity-25`}
                />
              </motion.article>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ LIVE GITHUB ═══════════ */}
      <SectionReveal>
        <GitHubSection />
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <SectionReveal>
        <TestimonialsSection />
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ EDUCATION + ACHIEVEMENTS ═══════════ */}
      <SectionReveal>
        <section className="relative z-10 overflow-hidden py-24" style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.025)",
        }}>
          <div data-speed="0.32" className="gs-parallax pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full blur-[120px]" style={{ background: "rgba(99, 102, 241, 0.08)" }} />
          <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="neon-card p-7"
            >
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <GraduationCap className="text-teal-300" /> Education
              </h3>
              <div className="mt-5 space-y-4">
                {education.map((e) => (
                  <div
                    key={e.degree}
                    className="rounded-2xl p-4"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255, 255, 255, 0.025)",
                    }}
                  >
                    <p className="font-semibold text-white">{e.degree}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {e.school} • {e.period}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 rounded-2xl p-4 text-sm text-slate-400"
                style={{
                  border: "1px solid rgba(251, 191, 36, 0.15)",
                  background: "rgba(251, 191, 36, 0.04)",
                }}
              >
                <span className="font-bold text-amber-400">Stack:</span> MERN • NestJS •
                TypeScript • MongoDB / MySQL / Redis • AWS • Docker • Socket.io • Twilio
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="neon-card p-7"
              style={{ background: "linear-gradient(180deg, rgba(99, 102, 241, 0.06), transparent)" }}
            >
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <Award className="text-amber-400" /> Key Achievements
              </h3>
              <ul className="mt-5 space-y-3">
                {achievements.map((a, i) => (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 rounded-2xl p-4 text-sm leading-relaxed text-slate-400"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-black"
                      style={{
                        background: "linear-gradient(135deg, #fbbf24, #f97316)",
                        boxShadow: "0 0 12px rgba(251, 191, 36, 0.25)",
                      }}
                    >
                      {i + 1}
                    </span>
                    {a}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />

      {/* ═══════════ PROCESS ═══════════ */}
      <SectionReveal>
        <ProcessSection />
      </SectionReveal>

      {/* ═══════════ CONTACT (Premium) ═══════════ */}
      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-[2.5rem] p-8 text-center sm:p-14"
          style={{
            background: "linear-gradient(135deg, rgba(94, 234, 212, 0.07), rgba(11, 15, 23, 0.9), rgba(99, 102, 241, 0.09))",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 0 60px rgba(99, 102, 241, 0.12), 0 40px 80px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Animated glow orbs */}
          <div className="contact-glow-orb" style={{
            width: 300, height: 300, top: -100, left: -100,
            background: "rgba(94, 234, 212, 0.12)",
          }} />
          <div className="contact-glow-orb" style={{
            width: 250, height: 250, bottom: -80, right: -80,
            background: "rgba(99, 102, 241, 0.12)",
            animationDelay: "2s",
          }} />
          <div className="contact-glow-orb" style={{
            width: 200, height: 200, top: "50%", left: "50%", marginTop: -100, marginLeft: -100,
            background: "rgba(99, 102, 241, 0.08)",
            animationDelay: "3s",
          }} />

          {/* Top animated border */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
            background: "linear-gradient(90deg, transparent, #5eead4, #6366f1, #5eead4, transparent)",
            backgroundSize: "200% 100%",
            animation: "holographic 5s ease infinite",
          }} />

          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-300"
            style={{
              border: "1px solid rgba(94, 234, 212, 0.2)",
              background: "rgba(94, 234, 212, 0.06)",
              boxShadow: "0 0 20px rgba(94, 234, 212, 0.1)",
            }}
          >
            <Send size={13} /> Let's build something amazing
          </span>
          <h2 className="fluid-h2 mx-auto mt-5 max-w-2xl font-display gradient-title font-extrabold">
            Have an idea? Let's turn it into a{" "}
              <span className="text-brand-gradient">
              production app.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400 leading-relaxed">
            Immediate joiner. AI chatbots, voice bots, full-stack SaaS — reply within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={`mailto:${profile.email}`}
              className="btn-primary inline-flex max-w-full items-center justify-center gap-2 break-all rounded-full px-6 py-3.5 text-sm font-bold transition hover:scale-105 sm:px-8"
              data-cursor-hover
            >
              <Mail size={16} className="shrink-0" /> {profile.email}
            </a>
            <a
              href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition hover:border-teal-400/30 sm:px-8"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "rgba(255, 255, 255, 0.05)",
              }}
              data-cursor-hover
            >
              <Phone size={16} /> {profile.phone}
            </a>
            {profile.calendly && (
              <a
                href={profile.calendly}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-teal-300 transition hover:scale-105 sm:px-8"
                style={{
                  border: "1px solid rgba(94, 234, 212, 0.3)",
                  background: "rgba(94, 234, 212, 0.08)",
                }}
                data-cursor-hover
              >
                📅 Book a 30-min call
              </a>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-400 transition hover:text-white"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(255, 255, 255, 0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(94, 234, 212, 0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(94, 234, 212, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.08)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
                data-cursor-hover
              >
                <s.icon size={14} /> {s.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
          <ContactForm />
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="footer-glow relative z-10 pb-10 pt-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: "0 0 16px rgba(79, 70, 229, 0.35)",
                }}
              >
                {profile.avatarInitials}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">{profile.name}</p>
                <p className="text-[11px] text-slate-400">Full Stack Developer • AI Specialist</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-xs font-medium text-slate-400 transition hover:text-indigo-300"
                  data-cursor-hover
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-500/40 hover:text-indigo-300 hover:shadow-md"
                  data-cursor-hover
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
            <p className="inline-flex items-center gap-1.5">
              <MapPin size={12} /> © {currentYear} {profile.name} • {profile.location}
            </p>
            <p className="inline-flex items-center gap-1">
              Made with <Heart size={11} className="text-orange-400" fill="currentColor" /> in India
            </p>
          </div>
        </div>
      </footer>

      {/* floating: unified dock (copy + WhatsApp + top) + bottom-left AI chat */}
      <FloatingActions showTop={showTop} hidden={chatOpen} />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
