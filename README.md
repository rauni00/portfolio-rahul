# Rahul Rauniyar — Full Stack Developer Portfolio

Modern, animated portfolio for **Rahul Rauniyar** (Full Stack Developer — MERN, NestJS, GenAI) based in Gurugram, India.

Built with **React 19 + TypeScript + Vite + Tailwind CSS 4**, with a 3D hero robot, GSAP + Framer Motion animations, AI assistant chat widget, and live GitHub section.

- 🌐 Live site: https://rahulrauniyar.dev/
- 📧 Email: rahulrauniyar700@gmail.com
- 💼 LinkedIn: https://linkedin.com/in/rahul-rauniyar-99452a205/
- 🐙 GitHub: https://github.com/rauni00

## ✨ Features

- **Animated hero** — typewriter roles, stats count-up, mouse glow, scroll progress bar
- **3D robot** (`src/components/Robot3D.tsx`, lazy-loaded) with `HeroErrorBoundary` + `AgentConsole` fallback so the page never goes blank on WebGL failure
- **GSAP effects** (`GsapEffects.tsx`) + Framer Motion scroll reveals, marquee skills strip
- **Sections:** Services, Skills, Experience timeline, filterable Projects, Live GitHub, Testimonials, Education + Achievements, Work Process, Contact
- **AI chat widget** — rule-based portfolio assistant with quick prompts + voice greeting (SpeechSynthesis, once per tab)
- **Floating actions** — WhatsApp button, copy-email, back-to-top
- **Lead-capture contact form** — opens `mailto:` with prefilled subject/body
- **SEO + PWA ready** — Open Graph/Twitter meta, canonical, JSON-LD `Person` schema, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, GSAP |
| 3D | Three.js, @react-three/fiber, @react-three/drei, @splinetool/react-spline |
| Icons | lucide-react |
| Lint | Oxlint (`npm run lint`) |
| Data | Single source of truth in `src/data.ts` |

## 🚀 Getting Started

```bash
# install
npm install

# dev server (HMR)
npm run dev

# type-check + production build
npm run build

# preview production build
npm run preview

# lint
npm run lint
```

Requires **Node.js 18+** (Node 20 recommended).

## ✏️ Customize (only 1 file)

All text, links, skills, jobs, projects, FAQs live in **`src/data.ts`** — the whole site updates automatically:

- `profile` — name, role, tagline, location, email, phone, `resumeLink`, `photo`, `githubUsername`, `whatsapp`
- `socials`, `stats`, `skillGroups`, `marqueeSkills`
- `experiences`, `projects`, `education`, `achievements`
- `services`, `testimonials`, `processSteps`, `chatFaqs`, `navLinks`

Tips:
- Resume: put PDF at `public/resume.pdf` and set `resumeLink: "/resume.pdf"` (auto-download enabled for `.pdf` links).
- Photo: put at `public/photo.jpg` and set `photo: "/photo.jpg"`.
- GitHub section fetches from `profile.githubUsername` via the public GitHub API.

## 📁 Project Structure

```
├── index.html                  # SEO meta, OG tags, fonts, JSON-LD
├── public/
│   ├── favicon.svg, icons.svg
│   ├── manifest.webmanifest
│   ├── robots.txt, sitemap.xml
│   └── models/robot.glb        # hero 3D model
├── src/
│   ├── main.tsx, index.css
│   ├── App.tsx                 # all page sections
│   ├── data.ts                 # 👈 edit only this file
│   └── components/
│       ├── Robot3D.tsx         # lazy 3D hero
│       ├── AgentConsole.tsx    # 3D fallback UI
│       ├── GsapEffects.tsx     # GSAP parallax/entrance
│       ├── Upgrades.tsx        # Preloader, Services, Testimonials, ContactForm, FloatingActions, ChatWidget
│       ├── More.tsx            # ProcessSection, GitHubSection
│       ├── Robot.tsx
│       └── GsapEffects.tsx
├── vite.config.ts
└── tsconfig*.json
```

## 📦 Deployment

Static output (`dist/`, ignored by git). Any static host works:

```bash
npm run build
```

- **Vercel / Netlify:** build command `npm run build`, output dir `dist`
- Update `index.html` canonical + OG URLs and `public/sitemap.xml` with your domain.

## 📬 Contact

**Rahul Rauniyar** — Immediate Joiner, open to remote + on-site roles.

- Email: rahulrauniyar700@gmail.com
- Phone/WhatsApp: +91-8546001170
- Location: Gurugram, Haryana, India
