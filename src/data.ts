export interface Project {
  name: string;
  description: string;
  tags: string[];
  github: string;
  icon: string;
  live?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  date: string;
  bullets: string[];
}

export const PROJECTS: Project[] = [
  {
    name: "Webscraper",
    description:
      "Full-stack news intelligence platform scraping El País articles. Automated pipeline with node-cron, NLP analytics (sentiment, keywords, word frequency), REST APIs with Express (MVC), MongoDB, React dashboard with Chart.js, containerized with Docker.",
    tags: ["Node.js", "Selenium", "MongoDB", "React", "Docker", "NLP"],
    github: "https://github.com/sahiljadhav7/Webscraper",
    icon: "🔍",
  },
  {
    name: "RupeeDash",
    description:
      "A React 18 + TypeScript SPA built on Vite/SWC, using Zustand with persist middleware for state, Recharts for data visualization, and shadcn/ui (Radix + Tailwind) for the component layer. Features an IntersectionObserver-based infinite scroll, a generic typed setFilter<K> action for filter state mutations, synchronous dark mode injection pre-hydration, and filtered CSV export via the Blob API. TanStack Query is scaffolded for future API integration, and Playwright is set up for E2E testing.",
    tags: [
      "React",
      "TypeScript",
      "REST API",
      "Tailwind CSS",
      "Charts.js",
      "Zustand",
    ],
    github: "https://github.com/sahiljadhav7/RupeeDash",
    icon: "📈",
  },
  {
    name: "QRGenerator",
    description:
      "Responsive React app generating QR codes in real-time as users type. Debounced input handling, multi-format export (PNG 512px + SVG), 100% client-side with zero server uploads, high error correction, and an Apple-inspired UI.",
    tags: ["React", "TypeScript", "Canvas API", "SVG"],
    github: "https://github.com/sahiljadhav7/QRGenerator",
    icon: "🔲",
  },
  {
    name: "YumCraft",
    description:
      "Recipe management app letting users search and add recipes. Dynamic UI for responsiveness and engagement, cross-platform (web + mobile) compatible.",
    tags: ["React", "JavaScript", "Node.js", "HTML/CSS"],
    github: "https://github.com/sahiljadhav7/yumcraft",
    icon: "🍳",
  },

  {
    name: "SecondBrain",
    description:
      "Personal knowledge management system for capturing, organizing, and retrieving ideas — built for developers.",
    tags: ["TypeScript", "React", "PostgreSQL"],
    github: "https://github.com/sahiljadhav7/SecondBrain",
    icon: "🧠",
  },
  {
    name: "XAI",
    description:
      "Explainable AI for Disease Diagnosis: ML model for CKD prediction and CNN for lung disease detection, with SHAP and Grad-CAM interpretability techniques.",
    tags: ["Flask", "Charts.js", "Node.js"],
    github: "https://github.com/sahiljadhav7/XAI",
    icon: "💰",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    role: "SDE Intern",
    company: "JIO",
    location: "Navi Mumbai",
    date: "Dec 2025 – Feb 2026",
    bullets: [
      "Developed the frontend of a production project using React and Next.js.",
      "Collaborated with the team using Git for version control and task management.",
      "Worked on backend-related API integrations using Java.",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "CONCERTO",
    location: "Navi Mumbai",
    date: "Jan 2024 – Feb 2024",
    bullets: [
      "Developed the company homepage using JavaScript, HTML, and CSS.",
      "Designed and implemented a login page for new users.",
      "Explored and experimented with multiple frontend frameworks under a tight timeline.",
    ],
  },
];

export const EXTRAS: string[] = [
  'Published research paper "Explainable AI for Disease Diagnosis" in IRE Journals (Mar 2026) — ML for CKD prediction, CNN for lung disease detection with SHAP and Grad-CAM interpretability.',
  "Head of Management and Sponsors — college tech fest (FY 2023–2024).",
  "Conducted a webinar on Introduction to Web Development for TY students (Summer 2024).",
];

export const SKILLS = {
  Languages: ["JavaScript", "TypeScript", "Python", "C++", "Java"],
  "Frameworks / Tools": [
    "React.js",
    "Next.js",
    "Node.js",
    "Express",
    "Git",
    "Three.js",
  ],
  Databases: ["MySQL", "MongoDB", "Redis", "Firebase"],
  Other: ["CI/CD", "Docker", "REST APIs", "BrowserStack", "Tailwind CSS"],
};

export const TYPED_STRINGS: string[] = [
  "Software Engineer",
  "Full Stack Developer",
  "TypeScript + React Builder",
  "Open Source Contributor",
  "AI Researcher",
];
