import { useEffect, useState } from "react";
import { Bot, Briefcase, Cpu, Database, Globe, Mail, Cloud, Code2, type LucideIcon } from "lucide-react";
import { getPortfolioContent, logPortfolioVisit } from "./api";
import * as fallback from "../data";
import type { Experience, ProcessStep, Project, Service, SkillGroup, Testimonial } from "../data";

const ICONS: Record<string, LucideIcon> = { Bot, Briefcase, Cpu, Database, Globe, Mail, Cloud, Code2 };
const iconOf = (name?: string, def: LucideIcon = Code2): LucideIcon =>
  (name && ICONS[name]) || def;

const asStrings = (v: any): string[] => (Array.isArray(v) ? v.map(String) : []);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* "2025-02" (or ISO date) -> "Feb 2025". Manual parse avoids timezone shifts. */
function fmtMonth(v: any): string {
  if (!v) return "";
  const m = String(v).slice(0, 7).match(/^(\d{4})-(\d{2})/);
  if (!m) return "";
  const mi = parseInt(m[2], 10);
  if (mi < 1 || mi > 12) return "";
  return `${MONTHS[mi - 1]} ${m[1]}`;
}

/* Experience dates -> "Feb 2025 – May 2026" / "Feb 2025 – Present".
   Old docs with only a period string keep showing it as-is. */
function fmtPeriod(e: any): string {
  const start = fmtMonth(e.startDate);
  const end = e.isCurrent ? "Present" : fmtMonth(e.endDate);
  const built = [start, end].filter(Boolean).join(" – ");
  return built || e.period || "";
}

export interface PortfolioData {
  profile: any;
  socials: Array<{ label: string; href: string; icon: LucideIcon }>;
  stats: Array<{ value: number; suffix: string; label: string }>;
  skillGroups: SkillGroup[];
  marqueeSkills: string[];
  experiences: Experience[];
  projects: Project[];
  education: Array<{ degree: string; school: string; period: string }>;
  achievements: string[];
  services: Service[];
  testimonials: Testimonial[];
  testimonialNote: string;
  processSteps: ProcessStep[];
  chatFaqs: Array<{ keys: string[]; reply: string }>;
  navLinks: Array<{ label: string; href: string }>;
  live: boolean;
}

function normalize(remote: any): PortfolioData {
  const p = remote.profile ?? {};
  return {
    profile: {
      ...fallback.profile,
      ...p,
      rotatingRoles: p.rotatingRoles?.length ? p.rotatingRoles : fallback.profile.rotatingRoles,
      openToWork: p.openToWork ?? true,
    },
    socials: (p.socials?.length ? p.socials : fallback.socials).map((s: any) => ({
      ...s,
      icon: typeof s.icon === "string" ? iconOf(s.icon, Globe) : s.icon,
    })),
    stats: p.stats?.length ? p.stats : fallback.stats,
    skillGroups: (remote.skillGroups?.length ? remote.skillGroups : fallback.skillGroups).map((g: any) => ({
      ...g,
      icon: typeof g.icon === "string" ? iconOf(g.icon) : g.icon ?? Code2,
      skills: asStrings(g.skills),
    })),
    marqueeSkills: p.marqueeSkills?.length ? p.marqueeSkills : fallback.marqueeSkills,
    experiences: (remote.experiences?.length ? remote.experiences : fallback.experiences).map((e: any) => ({
      ...e,
      period: fmtPeriod(e),
    })),
    projects: remote.projects?.length ? remote.projects : fallback.projects,
    education: remote.education?.length ? remote.education : fallback.education,
    achievements: (remote.achievements?.length ? remote.achievements : fallback.achievements).map((a: any) =>
      typeof a === "string" ? a : a.text ?? "",
    ).filter(Boolean),
    services: remote.services?.length ? remote.services : fallback.services,
    testimonials: remote.testimonials?.length ? remote.testimonials : fallback.testimonials,
    testimonialNote: p.testimonialNote || fallback.testimonialNote,
    processSteps: remote.processSteps?.length ? remote.processSteps : fallback.processSteps,
    chatFaqs: remote.chatFaqs?.length ? remote.chatFaqs : fallback.chatFaqs,
    // Header menu stays static (data.ts) — no need to manage it from the CMS
    navLinks: fallback.navLinks,
    live: true,
  };
}

const fallbackData: PortfolioData = {
  profile: fallback.profile,
  socials: fallback.socials,
  stats: fallback.stats,
  skillGroups: fallback.skillGroups,
  marqueeSkills: fallback.marqueeSkills,
  experiences: fallback.experiences,
  projects: fallback.projects,
  education: fallback.education,
  achievements: fallback.achievements,
  services: fallback.services,
  testimonials: fallback.testimonials,
  testimonialNote: fallback.testimonialNote,
  processSteps: fallback.processSteps,
  chatFaqs: fallback.chatFaqs,
  navLinks: fallback.navLinks,
  live: false,
};

/* A single fetch shared by all components + automatic visit logging */
let cache: PortfolioData | null = null;
let inflight: Promise<PortfolioData> | null = null;

function loadOnce(): Promise<PortfolioData> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = getPortfolioContent().then((remote) => {
      cache = remote ? normalize(remote) : fallbackData;
      return cache;
    });
  }
  return inflight;
}

export function usePortfolio(): { data: PortfolioData; loading: boolean } {
  const [data, setData] = useState<PortfolioData>(cache ?? fallbackData);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    let alive = true;
    loadOnce().then((d) => {
      if (alive) {
        setData(d);
        setLoading(false);
      }
    });
    logPortfolioVisit(window.location.pathname);
    return () => {
      alive = false;
    };
  }, []);
  return { data, loading };
}
