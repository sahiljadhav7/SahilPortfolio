export type ProjectCategory = "Frontend" | "Backend" | "Fullstack";
export type ProjectStatus = "Live" | "In Progress";

export interface SiteProject {
  title: string;
  blurb: string;
  story?: string;
  stack: string[];
  year: string;
  links: {
    live?: string;
    source?: string;
  };
  featured?: boolean;
  status?: ProjectStatus;
  image?: string;
  categories: ProjectCategory[];
}

export interface SiteExperience {
  company: string;
  role: string;
  period: string;
  blurb: string;
  url?: string;
}

export interface SiteWriting {
  title: string;
  summary: string;
  date: string;
  url: string;
  readingTime?: string;
}

export interface SiteSkill {
  name: string;
  category:
    | "Languages"
    | "Frontend"
    | "Backend"
    | "Databases"
    | "DevOps & Tools";
}

export const site: {
  name: string;
  role: string;
  location: string;
  email: string;
  about: string[];
  tldr: string[];
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
    email: string;
    resume: string;
    discord: string;
    medium: string;
  };
  experience: SiteExperience[];
  projects: SiteProject[];
  skills: SiteSkill[];
  writing: SiteWriting[];
  github: {
    username: string;
  };
} = {
  name: "Sahil Jadhav",
  role: "Full Stack Developer",
  location: "Mumbai, India",
  email: "jadhavsahilcodes@gmail.com",
  about: [
    "I build polished full stack products with a strong bias toward frontend craft, type-safe architecture, and practical engineering decisions that ship quickly.",
    "My work spans React, Next.js, TypeScript, Node.js, Java, and Python, with experience across production features, API integrations, dashboards, and AI-assisted tooling.",
    "I care about clear systems, sharp UX, and momentum. That shows up in the way I design interfaces, structure codebases, and collaborate with teams.",
  ],
  tldr: [
    "2 internships across frontend and product engineering",
    "Published research paper in explainable AI",
    "Hands-on with React, Next.js, Node.js, and TypeScript",
    "Strong interest in developer tools, product UX, and AI workflows",
  ],
  socials: {
    github: "https://github.com/sahiljadhav7",
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/in/sahil-jadhav1/",
    email:
      "https://mail.google.com/mail/?view=cm&fs=1&to=jadhavsahilcodes@gmail.com",
    resume: "/Sahil-Jadhav-Resume.pdf",
    discord: "https://discord.com/",
    medium: "https://medium.com/",
  },
  experience: [
    {
      company: "JIO",
      role: "SDE Intern",
      period: "Dec 2025 - Feb 2026",
      blurb:
        "Built production-facing frontend features with React and Next.js, collaborated through Git-driven workflows, and supported API integrations across the stack.",
    },
    {
      company: "CONCERTO",
      role: "Frontend Developer Intern",
      period: "Jan 2024 - Feb 2024",
      blurb:
        "Developed the company homepage, delivered a new login experience, and rapidly evaluated frontend frameworks under tight delivery timelines.",
    },
  ],
  projects: [
    {
      title: "ForgeAI",
      blurb:
        "AI app builder that turns prompts into working React apps with code inspection, live preview, image-assisted prompting, and ZIP export.",
      story:
        "Designed as an AI-native build surface with prompt-to-app generation, instant previews, and iterative chat workflows.\n\nFocused on balancing speed with trust by exposing generated code, keeping the loop inspectable, and making exports straightforward.",
      stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Clerk"],
      year: "2026",
      links: {
        live: "https://forgeai.lol",
        source: "https://github.com/sahiljadhav7/ForgeAI",
      },
      featured: true,
      status: "Live",
      image: "/projects/forgeai.png",
      categories: ["Fullstack", "Frontend"],
    },
    {
      title: "Webscraper",
      blurb:
        "News intelligence platform with automated scraping, NLP analytics, REST APIs, Dockerized services, and a React dashboard.",
      story:
        "Combined scheduled scraping, analytics pipelines, and dashboard reporting into one system.\n\nThe engineering focus was reliable ingestion, understandable insights, and a clean split between the data pipeline and user-facing views.",
      stack: ["Node.js", "Selenium", "MongoDB", "React", "Docker", "NLP"],
      year: "2026",
      links: {
        source: "https://github.com/sahiljadhav7/Webscraper",
      },
      status: "In Progress",
      image: "/projects/webscraper.png",
      categories: ["Backend", "Fullstack"],
    },
    {
      title: "RupeeDash",
      blurb:
        "Typed React dashboard with persisted filters, charts, infinite scroll, CSV export, and an extensible data layer for future APIs.",
      story:
        "Built as a strong frontend systems exercise with typed state updates, client-side exports, and dashboard UX patterns.\n\nSet up with scalability in mind so richer APIs and testing could be layered in without reworking the app shell.",
      stack: ["React", "TypeScript", "Tailwind CSS", "Charts", "Zustand"],
      year: "2025",
      links: {
        source: "https://github.com/sahiljadhav7/RupeeDash",
      },
      image: "/projects/rupeedash.png",
      categories: ["Frontend"],
    },
    {
      title: "QRGenerator",
      blurb:
        "Client-side QR generator with debounced input, PNG and SVG export, and an Apple-inspired interface.",
      story:
        "Focused on speed, polish, and zero-server processing.\n\nThe implementation stayed lightweight while still supporting multiple export formats and responsive interactions.",
      stack: ["React", "TypeScript", "Canvas API", "SVG"],
      year: "2025",
      links: {
        source: "https://github.com/sahiljadhav7/QRGenerator",
      },
      image: "/projects/qr-generator.png",
      categories: ["Frontend"],
    },
    {
      title: "YumCraft",
      blurb:
        "Recipe management app for browsing, searching, and creating recipes with a responsive cross-platform UI.",
      story:
        "Started as a practical product UI exercise centered on approachable flows and adaptable layouts.\n\nThe core work focused on usability, responsiveness, and making CRUD interactions feel light.",
      stack: ["React", "JavaScript", "Node.js", "HTML/CSS"],
      year: "2024",
      links: {
        source: "https://github.com/sahiljadhav7/yumcraft",
      },
      image: "/projects/yumcraft.png",
      categories: ["Fullstack", "Frontend"],
    },
    {
      title: "SecondBrain",
      blurb:
        "Personal knowledge system for capturing, organizing, and retrieving ideas in a developer-friendly workflow.",
      story:
        "Explored how a note system can feel structured without becoming rigid.\n\nThe product direction leaned on searchability, fast capture, and a calm interface for long-term use.",
      stack: ["TypeScript", "React", "PostgreSQL"],
      year: "2024",
      links: {
        source: "https://github.com/sahiljadhav7/SecondBrain",
      },
      image: "/projects/secondbrain.png",
      categories: ["Fullstack"],
    },
  ],
  skills: [
    { name: "TypeScript", category: "Languages" },
    { name: "JavaScript", category: "Languages" },
    { name: "Python", category: "Languages" },
    { name: "Java", category: "Languages" },
    { name: "C++", category: "Languages" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Framer Motion", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Express", category: "Backend" },
    { name: "REST APIs", category: "Backend" },
    { name: "Prisma", category: "Backend" },
    { name: "PostgreSQL", category: "Databases" },
    { name: "MongoDB", category: "Databases" },
    { name: "MySQL", category: "Databases" },
    { name: "Redis", category: "Databases" },
    { name: "Git", category: "DevOps & Tools" },
    { name: "Docker", category: "DevOps & Tools" },
    { name: "Three.js", category: "DevOps & Tools" },
    { name: "BrowserStack", category: "DevOps & Tools" },
    { name: "CI/CD", category: "DevOps & Tools" },
  ],
  writing: [
    {
      title: "Building interfaces that feel fast before they are complex",
      summary:
        "Notes on the small layout, motion, and feedback decisions that make a frontend feel more trustworthy.",
      date: "2026-05-14",
      url: "https://medium.com/",
      readingTime: "4 min read",
    },
    {
      title: "What I learned shipping TypeScript-heavy product UIs",
      summary:
        "A practical look at state design, typed actions, and why good constraints usually improve speed.",
      date: "2026-02-06",
      url: "https://medium.com/",
      readingTime: "6 min read",
    },
    {
      title: "Using AI tools without giving up engineering clarity",
      summary:
        "A short piece on keeping AI-assisted workflows inspectable, debuggable, and useful in real projects.",
      date: "2025-11-19",
      url: "https://medium.com/",
      readingTime: "5 min read",
    },
  ],
  github: {
    username: "sahiljadhav7",
  },
};

export const HEADLINE_TITLES = [
  "Software Engineer",
  "Full Stack Developer",
  "TypeScript + React Builder",
  "Open Source Contributor",
  "AI Researcher",
] as const;

export const QUOTES = [
  {
    text: "Good interfaces disappear. Good systems keep showing up when the work gets real.",
    author: "Sahil Jadhav",
  },
  {
    text: "The best developer experience is usually just clarity delivered early.",
    author: "Sahil Jadhav",
  },
  {
    text: "A product earns trust one sharp interaction at a time.",
    author: "Sahil Jadhav",
  },
  {
    text: "Polish matters most when it makes complexity feel calm.",
    author: "Sahil Jadhav",
  },
  {
    text: "Shipping is easier when the architecture and the UI are pulling in the same direction.",
    author: "Sahil Jadhav",
  },
] as const;
