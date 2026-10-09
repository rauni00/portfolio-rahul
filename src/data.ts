import {
  Bot,
  Briefcase,
  Cpu,
  Database,
  Globe,
  Mail,
  Cloud,
  Code2,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   👇 EDIT ONLY THIS FILE — the whole site updates automatically
   Everything is dynamic: text, links, skills, projects, etc.
   ============================================================ */

export const profile = {
  name: "Rahul Rauniyar",
  firstName: "Rahul",
  role: "Full Stack Developer",
  rotatingRoles: [
    "Full Stack Developer",
    "AI Chatbot Engineer",
    "MERN + NestJS Expert",
    "GenAI App Builder",
    "Voice Bot Developer",
  ],
  tagline:
    "Full Stack Developer with 4+ years building scalable web & AI-powered apps using MERN, NestJS and Generative AI — chatbots, email bots & voice bots that qualify leads 40% faster.",
  location: "Gurugram, Haryana, India",
  email: "rahulrauniyar700@gmail.com",
  phone: "+91-8546001170",
  availability: "Immediate Joiner • Open to Work",
  resumeLink: "#contact", // put your resume PDF link here, e.g. "/resume.pdf"
  avatarInitials: "RR",
  photo: "", // 👈 put your photo at public/photo.jpg and write "/photo.jpg" here — it auto-shows in the hero card
  githubUsername: "rauni00", // 👈 the live GitHub repos section fetches from this
  whatsapp: "918546001170", // WhatsApp chat button (country code + number, without +)
  ogSiteUrl: "https://rahulrauniyar.dev/",
};

export const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/rahul-rauniyar-99452a205/", icon: Globe },
  { label: "GitHub", href: "https://github.com/rauni00", icon: Code2 },
  { label: "Email", href: "mailto:rahulrauniyar700@gmail.com", icon: Mail },
];

export const stats = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 15, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "%", label: "Performance Boost" },
  { value: 40, suffix: "%", label: "Lead Qualification Lift" },
];

export interface SkillGroup {
  title: string;
  icon: LucideIcon;
  color: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    icon: Code2,
    color: "#22d3ee",
    skills: ["React.js", "Next.js", "Redux", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    icon: Briefcase,
    color: "#a78bfa",
    skills: ["NestJS", "Node.js", "Express.js", "JWT", "OAuth 2.0", "BullMQ", "RBAC", "Socket.io", "Microservices"],
  },
  {
    title: "AI & GenAI",
    icon: Bot,
    color: "#a3e635",
    skills: ["OpenAI GPT-4 / GPT-4o", "Embeddings API", "LLM Integration", "Prompt Engineering", "Vector Embeddings", "AI Chatbots", "Email Bot", "Voice Bot"],
  },
  {
    title: "Databases",
    icon: Database,
    color: "#f472b6",
    skills: ["MongoDB", "MySQL", "Redis"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "#fbbf24",
    skills: ["AWS Lambda", "EC2", "S3", "Serverless", "Docker", "Jenkins", "Azure", "CI/CD"],
  },
  {
    title: "Other Tech",
    icon: Cpu,
    color: "#34d399",
    skills: ["TypeScript", "JavaScript ES6", "Electron.js", "Twilio", "Payment Gateway", "Skyflow Vault", "Git", "Jira", "Postman"],
  },
];

export const marqueeSkills = [
  "React", "NestJS", "Node.js", "MongoDB", "OpenAI GPT-4", "Vector Embeddings",
  "Voice Bots", "Chatbots", "Redis", "AWS", "TypeScript", "Socket.io", "Docker", "MySQL",
];

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  points: string[];
  tags: string[];
}

export const experiences: Experience[] = [
  {
    company: "Cyber Vision Infotech Pvt Ltd",
    role: "Software Engineer",
    location: "Gurugram, Haryana",
    period: "Feb 2025 – May 2026",
    points: [
      "Worked extensively on AI bot systems — chatbot, email bot & voice bot — to automate workflows and boost engagement.",
      "Resolved complex technical challenges with advanced debugging tools, ensuring high system reliability.",
      "Collaborated with stakeholders to align deliverables with brand guidelines & project objectives.",
      "Optimized website & app performance, reducing load times by 30% and improving responsiveness.",
    ],
    tags: ["React", "NestJS", "OpenAI", "Redis", "MongoDB"],
  },
  {
    company: "OTS Solutions Pvt Ltd",
    role: "Associate Software Engineer",
    location: "Gurugram, Haryana",
    period: "Sep 2022 – Jan 2025",
    points: [
      "Delivered scalable apps in React, Angular, Vue, Node.js with MongoDB / MySQL.",
      "Designed backend APIs & integrations for financial trading and IoT platforms.",
      "Led full-stack development for secure healthcare and IoT applications.",
    ],
    tags: ["React", "Angular", "Vue", "Node.js", "IoT"],
  },
  {
    company: "Micronsol InfoTech (Freelance)",
    role: "Freelance Full Stack Developer",
    location: "Remote",
    period: "Jan 2022 – Jul 2022",
    points: [
      "Built full-stack apps with React, Node, Express, MongoDB & REST APIs with secure auth.",
      "Created scalable codebases, automated deployments & maintained documented GitHub repos.",
    ],
    tags: ["React", "Redux", "Express", "MongoDB"],
  },
];

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  links: { label: string; href: string }[];
  gradient: string;
  emoji: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Ultimabot AI",
    subtitle: "AI Chatbot • Email Bot • Voice Bot Platform",
    description:
      "AI-powered platform with chatbot, email bot & voice bot (inbound & outbound) to automate support, lead-gen & appointment booking. GPT + embeddings over website data, FAQs & PDFs. Calendly + Google Meet auto-booking. Redis caching for fast APIs.",
    tech: ["React", "Node", "NestJS", "MongoDB", "OpenAI", "Redis", "Calendly"],
    links: [
      { label: "Live App", href: "https://app.ultimabot.ai" },
      { label: "Website", href: "https://ultimabot.ai" },
    ],
    gradient: "from-cyan-400 via-sky-500 to-violet-600",
    emoji: "🤖",
    featured: true,
  },
  {
    title: "Ask Welfore",
    subtitle: "Diet Tracking App • 5K+ Users",
    description:
      "Diet tracking app with personalized plans, real-time analytics & visualization. Personalized diet plans, daily meal + nutrition tracking, intuitive food logging & progress charts.",
    tech: ["React", "Node", "Express", "MongoDB"],
    links: [{ label: "Live App", href: "https://app.askwelfore.com" }],
    gradient: "from-lime-300 via-emerald-400 to-teal-600",
    emoji: "🥗",
    featured: true,
  },
  {
    title: "Transplant Made Easy",
    subtitle: "Healthcare Desktop App (HIPAA Compliant)",
    description:
      "Cross-platform desktop app connecting kidney transplant candidates with donors. Skyflow Privacy Vault for patient data security & HIPAA compliance. Streamlined transplant workflows.",
    tech: ["React", "Electron.js", "Node.js", "MongoDB", "Skyflow Vault"],
    links: [],
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    emoji: "🏥",
  },
  {
    title: "Gunlox",
    subtitle: "Smart IoT Firearm Lock",
    description:
      "Smart firearm lock using Bluetooth & facial recognition. Built admin panel & integrated complex API services.",
    tech: ["Angular", "Node", "Express", "MongoDB"],
    links: [],
    gradient: "from-amber-300 via-orange-500 to-red-600",
    emoji: "🔒",
  },
  {
    title: "Mom's Kitchen",
    subtitle: "Online Food Ordering System",
    description:
      "User-friendly online food ordering system improving customer experience & operations. Base architecture + GitHub management.",
    tech: ["React", "Redux", "Express", "MongoDB"],
    links: [],
    gradient: "from-yellow-300 via-amber-400 to-orange-600",
    emoji: "🍱",
  },
  {
    title: "Invoice Builder",
    subtitle: "Drag-and-Drop Invoice Generator",
    description:
      "Drag-and-drop invoice template system for admins. One-click invoice generation for employees, reducing manual effort.",
    tech: ["React", "Redux", "Express", "MongoDB"],
    links: [{ label: "Live Demo", href: "https://pdf-invoice-editor.netlify.app" }],
    gradient: "from-indigo-400 via-violet-500 to-purple-700",
    emoji: "🧾",
  },
];

export const education = [
  { degree: "Master of Computer Applications (MCA)", school: "JSU Shikohabad", period: "2023 – 2025" },
  { degree: "Bachelor of Computer Applications (BCA)", school: "MCRPV Bhopal", period: "2019 – 2022" },
];

export const achievements = [
  "Developed production-ready AI chatbot, email bot & voice bot using OpenAI GPT and embeddings.",
  "Designed scalable Node.js servers using NestJS with modular architecture.",
  "AI chatbot solutions increasing lead qualification efficiency by 40%.",
  "Built privacy-compliant healthcare apps integrating Skyflow Vault.",
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

/* ---------- Services (What I do — recruiter/client attraction) ---------- */

export interface Service {
  emoji: string;
  title: string;
  desc: string;
  points: string[];
}

export const services: Service[] = [
  {
    emoji: "🤖",
    title: "AI Chatbot & Voice Bot Development",
    desc: "Bots that learn from your website data, FAQs and PDFs — qualifying leads and booking appointments on autopilot.",
    points: ["GPT-4o + Embeddings", "Chat / Email / Voice", "+40% lead qualification"],
  },
  {
    emoji: "⚡",
    title: "Full-Stack SaaS Apps (MERN + NestJS)",
    desc: "Modular NestJS backend, React frontend — production-ready, scalable architecture.",
    points: ["NestJS modular APIs", "Redis caching", "-30% load time"],
  },
  {
    emoji: "☁️",
    title: "Cloud, Realtime & Integrations",
    desc: "AWS serverless, Socket.io realtime, Twilio calls/SMS, payments, Calendly + Google Meet flows.",
    points: ["AWS Lambda / EC2 / S3", "Socket.io realtime", "Twilio + Payments"],
  },
];

/* ---------- Testimonials (social proof — naam/role badal lena) ---------- */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Rahul took our AI chatbot + voice bot system to production in record time. Lead qualification became visibly faster.",
    name: "Project Stakeholder",
    role: "Ultimabot AI",
    initials: "UB",
  },
  {
    quote:
      "He calmly debugs complex backend problems. The NestJS architecture is clean and scalable — the team found it easy to work with.",
    name: "Team Collaborator",
    role: "Cyber Vision Infotech",
    initials: "CV",
  },
  {
    quote:
      "The data-privacy implementation (Skyflow Vault) in our healthcare app was rock solid — compliance and UX, both well balanced.",
    name: "Healthcare Client",
    role: "Transplant Made Easy",
    initials: "TM",
  },
];

/* ---------- Work process (client ko process dikhao = trust) ---------- */

export interface ProcessStep {
  emoji: string;
  title: string;
  desc: string;
}

export const processSteps: ProcessStep[] = [
  {
    emoji: "🔍",
    title: "1. Discover",
    desc: "A requirement call to lock user flows and success metrics — with a free 30-min consultation.",
  },
  {
    emoji: "🎨",
    title: "2. Design",
    desc: "Clean UI + modular API design. Prototype first, full build after your approval.",
  },
  {
    emoji: "⚙️",
    title: "3. Develop",
    desc: "React + NestJS + AI integration with weekly demos, plus a production setup on Redis/AWS.",
  },
  {
    emoji: "🚀",
    title: "4. Deploy & Support",
    desc: "CI/CD deployment, monitoring, and post-launch support — you're never on your own.",
  },
];

/* ---------- Chatbot knowledge (portfolio assistant auto-replies) ---------- */

export const chatFaqs: { keys: string[]; reply: string }[] = [
  {
    keys: ["experience", "years", "exp", "kitna"],
    reply:
      "Rahul has 4+ years of experience across MERN, NestJS and GenAI — Cyber Vision (AI bots), OTS Solutions (healthcare + IoT), plus freelance projects.",
  },
  {
    keys: ["ai", "chatbot", "voice", "bot", "openai", "gpt"],
    reply:
      "Absolutely! AI bots are Rahul's core strength — at Ultimabot AI he built a chatbot, email bot and inbound/outbound voice bots (GPT-4o + embeddings, Redis caching). Lead qualification improved by 40%.",
  },
  {
    keys: ["project", "work", "portfolio", "ultimabot", "welfore"],
    reply:
      "Top projects: Ultimabot AI (AI support + lead-gen platform), Ask Welfore (5K+ users diet app), Transplant Made Easy (HIPAA healthcare desktop app), Gunlox (IoT smart lock), Invoice Builder. Check the projects section below!",
  },
  {
    keys: ["stack", "skill", "tech", "mern", "nestjs"],
    reply:
      "Stack: React, Next.js, NestJS, Node, Express, MongoDB, MySQL, Redis, OpenAI GPT-4o, AWS (Lambda/EC2/S3), Docker, Socket.io, Twilio, TypeScript.",
  },
  {
    keys: ["hire", "contact", "email", "phone", "join", "available", "salary", "ctc"],
    reply:
      "Rahul is an immediate joiner based in Gurugram, India. Email: rahulrauniyar700@gmail.com | Phone: +91-8546001170. Send a message from the contact section — you'll get a reply within 24 hours!",
  },
  {
    keys: ["resume", "cv"],
    reply:
      "For the resume, hit the 'Download Resume' button in the hero section or email rahulrauniyar700@gmail.com. (It auto-downloads once public/resume.pdf is added.)",
  },
  {
    keys: ["location", "where", "gurugram", "remote"],
    reply: "Based in Gurugram, Haryana, India. Open to both remote and on-site roles.",
  },
  {
    keys: ["education", "degree", "mca", "bca", "college"],
    reply: "MCA (JSU Shikohabad, 2023–25) and BCA (MCRPV Bhopal, 2019–22).",
  },
];
