import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, ExternalLink, GitFork, Loader2, Sparkles, Star, Users } from "lucide-react";
import { processSteps, profile } from "../data";

/* ================= WORK PROCESS ================= */

export function ProcessSection() {
  return (
    <section id="process" className="relative z-10 border-y border-white/5 bg-white/[0.015] py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            <Sparkles size={13} /> How I work
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
            Idea se launch tak — clear process
          </h2>
          <p className="mt-3 text-slate-400">
            No confusion, no delays. You get a demo + update at every stage.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="card-shine relative rounded-3xl border border-white/10 bg-[#0b1020] p-6"
            >
              <span className="pointer-events-none absolute right-4 top-3 font-display text-5xl font-black text-white/5">
                {i + 1}
              </span>
              <span className="text-4xl">{s.emoji}</span>
              <h3 className="mt-3 font-display text-base font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{s.desc}</p>
              {i < processSteps.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/40 bg-[#05070f] text-xs text-cyan-300 lg:inline-flex">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= LIVE GITHUB ================= */

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface GhUser {
  public_repos: number;
  followers: number;
  following: number;
}

export function GitHubSection() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [user, setUser] = useState<GhUser | null>(null);
  const [failed, setFailed] = useState(false);
  const username = profile.githubUsername;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
          fetch(`https://api.github.com/users/${username}`),
        ]);
        if (!r1.ok || !r2.ok) throw new Error("gh");
        const reposJson = (await r1.json()) as Repo[];
        const userJson = (await r2.json()) as GhUser;
        if (alive) {
          setRepos(reposJson);
          setUser(userJson);
        }
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [username]);

  return (
    <section id="github" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
          <Code2 size={13} /> Live from GitHub
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
          Code that's live right now
        </h2>
        <p className="mt-3 text-slate-400">
          This section loads live from the GitHub API — auto-fresh on every push.{" "}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-300 hover:underline"
          >
            @{username} →
          </a>
        </p>
      </div>

      {user && (
        <div className="mx-auto mb-6 flex max-w-xl justify-center gap-3">
          {[
            { v: user.public_repos, l: "Public Repos" },
            { v: user.followers, l: "Followers" },
            { v: user.following, l: "Following" },
          ].map((s) => (
            <div
              key={s.l}
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center"
            >
              <div className="font-display text-xl font-extrabold text-white">{s.v}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {!repos && !failed && (
        <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
          <Loader2 size={18} className="animate-spin text-cyan-300" /> Fetching the latest repos from GitHub…
        </div>
      )}

      {failed && (
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#0b1020] p-8 text-center">
          <Users className="mx-auto text-slate-500" size={28} />
          <p className="mt-3 text-sm text-slate-400">
            GitHub isn't reachable right now (rate-limit / offline). View the profile directly:
          </p>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-bold text-black"
          >
            <ExternalLink size={14} /> github.com/{username}
          </a>
        </div>
      )}

      {repos && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <motion.a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="card-shine group rounded-3xl border border-white/10 bg-[#0b1020] p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-display text-base font-bold text-white group-hover:text-cyan-200">
                  📦 {r.name}
                </h3>
                <ExternalLink size={14} className="shrink-0 text-slate-500 group-hover:text-cyan-300" />
              </div>
              <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-slate-400">
                {r.description || "No description yet — the code speaks for itself. 👆"}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                {r.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
                    {r.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Star size={13} className="text-amber-300" /> {r.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitFork size={13} className="text-slate-500" /> {r.forks_count}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}
