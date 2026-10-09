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
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Rocket,
  Send,
  Sparkles,
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
// three.js is heavy — split into its own chunk, loaded only for the hero
const Robot3D = lazy(() => import("./components/Robot3D"));

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
import {
  profile,
  socials,
  stats,
  skillGroups,
  marqueeSkills,
  experiences,
  projects,
  education,
  achievements,
  navLinks,
} from "./data";

const currentYear = new Date().getFullYear();

/* ---------- helpers ---------- */

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    const speed = deleting ? 35 : 70;
    const t = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return text;
}

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
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
        <Sparkles size={13} /> {kicker}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-slate-400">{sub}</p>}
    </motion.div>
  );
}

/* ---------- main ---------- */

export default function App() {
  const typed = useTypewriter(profile.rotatingRoles);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  // mouse glow
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glowX = useTransform(mx, (v) => v - 250);
  const glowY = useTransform(my, (v) => v - 250);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mx, my]);

  return (
    <div className="relative min-h-screen bg-[#05070f] font-body text-slate-200 antialiased">
      <Preloader />
      <GsapEffects />
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-cyan-400 via-violet-400 to-lime-300"
      />
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none fixed left-0 top-0 z-[5] hidden h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px] md:block"
      />
      <div className="grid-bg pointer-events-none fixed inset-0 z-0" />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 px-4 py-3 shadow-2xl sm:px-6">
          <a href="#home" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 font-display text-sm font-bold text-black shadow-lg shadow-cyan-500/30 transition-transform group-hover:rotate-12">
              {profile.avatarInitials}
            </span>
            <span className="font-display text-sm font-bold text-white sm:text-base">
              {profile.name}
              <span className="block text-[11px] font-normal text-cyan-300">
                {profile.availability}
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2 text-sm font-bold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40"
            >
              Hire Me <ArrowRight size={15} />
            </a>
          </nav>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
            aria-label="menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
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
                  className="block rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="relative z-10 overflow-hidden pb-16 pt-32 sm:pt-40">
        {/* blobs (GSAP parallax targets) */}
        <div data-speed="0.35" className="gs-parallax pointer-events-none absolute -left-32 top-20 h-96 w-96 animate-blob rounded-full bg-cyan-500/25 blur-[110px]" />
        <div
          data-speed="0.2"
          className="gs-parallax pointer-events-none absolute -right-32 top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-violet-600/25 blur-[120px]"
          style={{ animationDelay: "-4s" }}
        />
        <div data-speed="0.45" className="gs-parallax pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-lime-400/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          {/* GSAP-driven entrance (see GsapEffects) — no Framer here */}
          <div>
            <div
              data-gs-badge
              className="feature-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-lime-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
              </span>
              {profile.availability}
            </div>

            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              <span className="block overflow-hidden pb-1">
                <span data-gs-line className="block text-slate-200">
                  Hi, I'm{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-200 bg-clip-text text-transparent">
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

            <div data-gs-fade className="mt-4 flex h-8 items-center font-display text-lg text-cyan-300 sm:text-xl">
              <span className="mr-2 text-slate-500">&gt;_</span>
              {typed}
              <span className="ml-1 inline-block h-5 w-[3px] animate-pulse bg-cyan-300" />
            </div>

            <p data-gs-fade className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              {profile.tagline}
            </p>

            <div data-gs-fade className="mt-7 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="primary-button magnetic group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-7 py-3 text-sm font-bold text-black shadow-[0_10px_35px_rgba(34,211,238,0.35)] transition hover:scale-[1.02]"
              >
                <Rocket size={16} /> View My Work
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={profile.resumeLink}
                {...(profile.resumeLink.endsWith(".pdf")
                  ? { download: "Rahul-Rauniyar-Resume.pdf" }
                  : {})}
                className="secondary-button magnetic inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
              >
                <Download size={16} /> Download Resume
              </a>
              <a
                href="#contact"
                className="ghost-button magnetic inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-7 py-3 text-sm font-semibold text-lime-200 transition hover:bg-lime-300 hover:text-black"
              >
                Hire / Contact
              </a>
            </div>

            <div data-gs-fade className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-cyan-300" /> {profile.location}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Phone size={15} className="text-cyan-300" /> {profile.phone}
              </span>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  data-gs-stat
                  className="soft-card card-shine rounded-2xl p-4 text-center"
                >
                  <div className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🤖 tall 3D robot (right side — like the reference design) */}
          <div data-gs-robot className="relative mx-auto w-full max-w-xl">
            <div className="hero-shell absolute inset-6 -z-10 rounded-[2rem]" />
            <div className="absolute inset-0 -z-10 animate-spin-slow rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-transparent blur-2xl" />
            <div className="absolute -left-2 top-8 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[11px] font-semibold text-cyan-200 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
              AI automations • SaaS • Voice bots
            </div>
            <HeroErrorBoundary>
            <Suspense
              fallback={
                <div className="grid h-[500px] place-items-center">
                  <div className="text-center">
                    <Loader2 size={28} className="mx-auto animate-spin text-cyan-300" />
                    <p className="mt-3 text-xs font-semibold tracking-[0.25em] text-cyan-300">
                      LOADING 3D ROBOT
                    </p>
                  </div>
                </div>
              }
            >
              <Robot3D height={500} />
            </Suspense>
            </HeroErrorBoundary>
          </div>

          <div
            data-gs-chip="a"
            className="glass-panel pointer-events-none absolute right-10 top-24 hidden rounded-2xl border border-white/10 px-3 py-2 text-xs font-semibold text-white shadow-xl lg:block"
          >
            🤖 GPT-4o + Embeddings
          </div>
          <div
            data-gs-chip="b"
            className="glass-panel pointer-events-none absolute bottom-24 right-16 hidden rounded-2xl border border-white/10 px-3 py-2 text-xs font-semibold text-white shadow-xl lg:block"
          >
            ⚡ Redis • -30% load time
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="relative z-10 overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
        <div className="flex w-max animate-marquee gap-3">
          {[...marqueeSkills, ...marqueeSkills].map((s, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border border-white/10 bg-black/40 px-5 py-2 text-sm font-semibold text-slate-300"
            >
              ✦ {s}
            </span>
          ))}
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <ServicesSection />

      {/* ================= SKILLS ================= */}
      <section id="skills" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading
          kicker="Tech Arsenal"
          title="Skills that ship production apps"
          sub="Frontend to backend to GenAI — full stack, end to end."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <motion.div
              key={g.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6 }}
              className="card-shine group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6"
            >
              <div
                className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: `${g.color}22`, color: g.color, border: `1px solid ${g.color}44` }}
              >
                <g.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">{g.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-300 transition group-hover:border-white/20 hover:!border-cyan-400/60 hover:text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section id="experience" className="relative z-10 border-y border-white/5 bg-white/[0.015] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            kicker="Career Journey"
            title="Where I've worked & what I delivered"
          />
          <div className="relative space-y-6 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-gradient-to-b before:from-cyan-400 before:via-violet-500 before:to-transparent sm:before:left-1/2">
            {experiences.map((e, i) => (
              <motion.div
                key={e.company}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={`relative flex sm:w-1/2 ${
                  i % 2 === 0
                    ? "sm:pr-10"
                    : "sm:ml-auto sm:flex-row-reverse sm:pl-10 sm:text-left"
                } pl-12 sm:pl-0`}
              >
                <span
                  className={`absolute left-3 top-6 grid h-9 w-9 place-items-center rounded-full border border-cyan-400/40 bg-[#0b1020] text-cyan-300 sm:left-auto ${
                    i % 2 === 0 ? "sm:-right-[18px]" : "sm:-left-[18px]"
                  }`}
                >
                  <Briefcase size={15} />
                </span>
                <div className="card-shine w-full rounded-3xl border border-white/10 bg-[#0b1020]/80 p-6 shadow-xl">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                    {e.period}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-white">{e.role}</h3>
                  <p className="text-sm font-semibold text-violet-300">
                    {e.company} • {e.location}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[11px] text-slate-300"
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

      {/* ================= PROJECTS ================= */}
      <section id="projects" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading
          kicker="Featured Work"
          title="Projects with real users & revenue impact"
          sub="AI platforms, healthcare, IoT, SaaS — all production-ready."
        />
        {/* filter tabs — interaction + attraction */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["All", "AI", "Healthcare", "IoT", "SaaS"].map((f) => (
            <button
              key={f}
              onClick={() => setProjectFilter(f)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                projectFilter === f
                  ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:text-white"
              }`}
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
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -8 }}
              className={`card-shine group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] ${
                p.featured ? "md:col-span-1 ring-1 ring-cyan-400/30" : ""
              }`}
            >
              <div className={`h-2 bg-gradient-to-r ${p.gradient}`} />
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{p.emoji}</span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-1 text-[11px] font-bold text-black">
                      <Sparkles size={12} /> FEATURED
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-white transition group-hover:text-cyan-200">
                  {p.title}
                </h3>
                <p className="text-sm font-semibold text-violet-300">{p.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-400 hover:text-black"
                      >
                        <ExternalLink size={13} /> {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${p.gradient} opacity-20 blur-3xl transition group-hover:opacity-40`}
              />
            </motion.article>
          ))}
        </div>
      </section>

      {/* ================= LIVE GITHUB ================= */}
      <GitHubSection />

      {/* ================= TESTIMONIALS ================= */}
      <TestimonialsSection />

      {/* ================= EDUCATION + ACHIEVEMENTS ================= */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.015] py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-[#0b1020] p-7"
          >
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <GraduationCap className="text-cyan-300" /> Education
            </h3>
            <div className="mt-5 space-y-4">
              {education.map((e) => (
                <div
                  key={e.degree}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="font-semibold text-white">{e.degree}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {e.school} • {e.period}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-lime-300/20 bg-lime-300/5 p-4 text-sm text-slate-300">
              <span className="font-bold text-lime-300">Stack:</span> MERN • NestJS •
              TypeScript • MongoDB / MySQL / Redis • AWS • Docker • Socket.io • Twilio
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-violet-600/15 to-transparent p-7"
          >
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <Award className="text-amber-300" /> Key Achievements
            </h3>
            <ul className="mt-5 space-y-3">
              {achievements.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-slate-300"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-xs font-black text-black">
                    {i + 1}
                  </span>
                  {a}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ================= PROCESS (client journey) ================= */}
      <ProcessSection />

      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-[#0b1020] to-violet-600/15 p-8 text-center sm:p-14"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-600/25 blur-[90px]" />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
            <Send size={13} /> Let's build something amazing
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold text-white sm:text-5xl">
            Have an idea? Let's turn it into a{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              production app.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Immediate joiner. AI chatbots, voice bots, full-stack SaaS — reply within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex max-w-full items-center justify-center gap-2 break-all rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-bold text-black shadow-xl shadow-cyan-500/30 transition hover:scale-105 sm:px-8"
            >
              <Mail size={16} className="shrink-0" /> {profile.email}
            </a>
            <a
              href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/50 sm:px-8"
            >
              <Phone size={16} /> {profile.phone}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
              >
                <s.icon size={14} /> {s.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
          <ContactForm />
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-slate-500 sm:flex-row sm:px-8">
          <p>
            © {currentYear} {profile.name} • Built with React + Vite + Tailwind + Framer Motion
          </p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin size={13} /> {profile.location}
          </p>
        </div>
      </footer>

      {/* floating: whatsapp + copy-email + back-to-top + AI chat */}
      <FloatingActions showTop={showTop} />
      <ChatWidget />
    </div>
  );
}
