import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Github,
  Globe,
  Mail,
  MapPin,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  Briefcase,
  Hammer,
  Layers3,
  Database,
  Code2,
  FilePenLine,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Fragment,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import {
  HEADLINE_TITLES,
  QUOTES,
  site,
  type ProjectCategory,
} from "@/config/site";
import { useGithubHeatmap } from "@/hooks/useGithubHeatmap";
import { useOpenSourcePRs } from "@/hooks/useOpenSourcePRs";
import type { ContributionStatus } from "@/lib/openSource";

type RoutePath =
  | "/"
  | "/projects"
  | "/experience"
  | "/open-source"
  | "/contact"
  | "/writing";
type ThemeMode = "dark" | "light";
type TechCategory =
  | "All"
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "DevOps & Tools";

type NavItem = {
  label: string;
  href: string;
  type: "route" | "section";
};

const navItems: NavItem[] = [
  { label: "About", href: "/#about", type: "section" },
  { label: "Projects", href: "/#projects", type: "section" },
  { label: "Experience", href: "/#experience", type: "section" },
  { label: "Open Source", href: "/#open-source", type: "section" },
  { label: "Contact", href: "/#contact", type: "section" },
  { label: "Reading", href: "/writing", type: "route" },
];

const sideIndexItems = [
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "open-source", label: "Open Source" },
  { id: "skills", label: "Skills" },
  { id: "writing", label: "Reading" },
  { id: "github", label: "GitHub" },
] as const;

const projectTabs: Array<"All" | ProjectCategory> = [
  "All",
  "Frontend",
  "Backend",
  "Fullstack",
];

const techTabs: TechCategory[] = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Tools",
];

const techTabIcons: Record<TechCategory, ReactNode> = {
  All: <Layers3 className="h-3.5 w-3.5" />,
  Languages: <Code2 className="h-3.5 w-3.5" />,
  Frontend: <Layers3 className="h-3.5 w-3.5" />,
  Backend: <Hammer className="h-3.5 w-3.5" />,
  Databases: <Database className="h-3.5 w-3.5" />,
  "DevOps & Tools": <Briefcase className="h-3.5 w-3.5" />,
};

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

function normalizePath(pathname: string): RoutePath {
  if (pathname === "/projects") return "/projects";
  if (pathname === "/experience") return "/experience";
  if (pathname === "/open-source") return "/open-source";
  if (pathname === "/contact") return "/contact";
  if (pathname === "/writing") return "/writing";
  return "/";
}

function navigateTo(path: string) {
  if (window.location.pathname + window.location.hash === path) {
    if (path.includes("#")) {
      scrollToHash(path.split("#")[1] ?? "");
    }
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function scrollToHash(id: string) {
  if (!id) return;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function useRoute() {
  const [route, setRoute] = useState<RoutePath>(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const onChange = () => {
      setRoute(normalizePath(window.location.pathname));
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setTimeout(() => scrollToHash(hash), 30);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return route;
}

function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme") as ThemeMode | null;
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const nextTheme = saved ?? preferred;
    document.documentElement.classList.toggle("light", nextTheme === "light");
    setTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("light", next === "light");
      window.localStorage.setItem("theme", next);
      return next;
    });
  };

  return { theme, toggleTheme };
}

function useActiveSection(enabled: boolean) {
  const [activeId, setActiveId] = useState<string>("about");

  useEffect(() => {
    if (!enabled) return;

    const sections = sideIndexItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.3, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return activeId;
}

function useOneko() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/oneko.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.getElementById("oneko")?.remove();
    };
  }, []);
}

function useKonamiAchievement() {
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let buffer: string[] = [];
    let typed = "";

    const trigger = () => {
      setBurst(Date.now());
      window.setTimeout(() => setBurst(0), 2200);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      buffer = [...buffer, key].slice(-konami.length);
      typed = `${typed}${key}`.slice(-12);

      if (typed.includes("anurag") || typed.includes("jha")) {
        trigger();
        typed = "";
      }

      if (buffer.join("|") === konami.join("|")) {
        trigger();
        buffer = [];
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return burst;
}

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Calcutta",
    });

    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 60000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

function Shell({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[760px] border-x border-dashed border-[var(--line)] px-6 sm:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function GapBand({ h = "h-7" }: { h?: string }) {
  return (
    <div className={cn("bg-stripes", h)}>
      <Shell />
    </div>
  );
}

function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="relative border-y border-[var(--line)] bg-stripes">
      <span className="absolute left-2 top-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" />
      <span className="absolute right-2 top-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" />
      <span className="absolute bottom-2 left-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" />
      <span className="absolute bottom-2 right-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" />
      <Shell className="flex min-h-16 flex-col justify-center gap-3 py-4 sm:min-h-[76px] sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl tracking-wide text-[var(--fg)]">
          {title}
        </h2>
        {aside ? <aside className="text-right">{aside}</aside> : null}
      </Shell>
    </div>
  );
}

function GitHubWordmark() {
  return <Github className="h-4 w-4" />;
}

function ThemeToggle({
  theme,
  toggleTheme,
}: {
  theme: ThemeMode;
  toggleTheme: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:rotate-45 hover:border-[var(--soft)]"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

function Nav({
  route,
  activeSection,
  theme,
  toggleTheme,
}: {
  route: RoutePath;
  activeSection: string;
  theme: ThemeMode;
  toggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const isItemActive = (item: NavItem) => {
    if (item.type === "route") return route === item.href;
    if (route !== "/") return false;
    return activeSection === item.href.replace("/#", "");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:rgb(from_var(--bg)_r_g_b_/_0.85)] backdrop-blur-md supports-[backdrop-filter]:bg-[color:rgb(from_var(--bg)_r_g_b_/_0.85)]">
      <Shell className="flex min-h-16 items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className="font-serif text-xl tracking-wide text-[var(--fg)]"
        >
          {site.name}
        </button>

        <div className="hidden items-center gap-5 sm:flex">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  item.type === "route"
                    ? navigateTo(item.href)
                    : navigateTo(item.href)
                }
                className={cn(
                  "group relative text-[13px] transition-colors",
                  active
                    ? "font-semibold text-[var(--fg)]"
                    : "text-[var(--muted)] hover:text-[var(--fg)]",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-px origin-left bg-[var(--fg)] transition-transform duration-200",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </button>
            );
          })}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Shell>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-[var(--line)] bg-[var(--bg)] bg-stripes sm:hidden"
          >
            <Shell className="py-2">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      item.type === "route"
                        ? navigateTo(item.href)
                        : navigateTo(item.href)
                    }
                    className="flex w-full items-center justify-between border-b border-dashed border-[var(--line)] py-3 text-left last:border-b-0"
                  >
                    <span
                      className={cn(
                        "text-sm",
                        active
                          ? "font-semibold text-[var(--fg)]"
                          : "text-[var(--muted)]",
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        active ? "bg-[var(--fg)]" : "bg-[var(--soft)]/40",
                      )}
                    />
                  </button>
                );
              })}
            </Shell>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeadlineIndex((current) => (current + 1) % HEADLINE_TITLES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.section {...pageTransition}>
      <Shell className="py-7 sm:py-9">
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl border border-[var(--line)]">
          <img
            src="/images/cover.jpg"
            alt="Editorial portfolio cover"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.35)] to-transparent" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_4px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_28px)]" />
          <div className="scanline absolute inset-0" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="glitch-text font-serif text-3xl leading-none tracking-tight sm:text-[38px]">
                {site.name}
              </h1>
              <div className="mt-2 flex min-h-6 items-center justify-center sm:justify-start">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={HEADLINE_TITLES[headlineIndex]}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="font-mono text-[13px] text-[var(--muted)]"
                  >
                    {HEADLINE_TITLES[headlineIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[11px] text-[var(--soft)] sm:justify-start">
                <MapPin className="h-3.5 w-3.5" />
                <span>{site.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </motion.section>
  );
}

function AboutSection() {
  return (
    <section id="about">
      <SectionHeader title="About" />
      <Shell className="grid gap-6 py-7 sm:grid-cols-[1.25fr_0.9fr] sm:py-8">
        <div className="space-y-3">
          {site.about.map((paragraph, index) => (
            <motion.div
              key={paragraph}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1,
              }}
              className="flex gap-3 text-[13.5px] leading-relaxed text-[var(--muted)]"
            >
              <span className="pt-1 text-[var(--soft)]">•</span>
              <p>{paragraph}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-5"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--soft)]">
            Developer Snapshot
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {site.tldr.map((item) => (
              <div
                key={item}
                className="flex gap-2 text-[13px] text-[var(--muted)]"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

function ContactSection() {
  const contactItems = [
    {
      label: "GitHub",
      href: site.socials.github,
      icon: <Github className="h-4 w-4" />,
    },
    {
      label: "LinkedIn",
      href: site.socials.linkedin,
      icon: <ExternalLink className="h-4 w-4" />,
    },
    {
      label: "Mail",
      href: site.socials.email,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      label: "Resume",
      href: site.socials.resume,
      icon: <FilePenLine className="h-4 w-4" />,
    },
  ];

  return (
    <section id="contact">
      <SectionHeader title="Contact" />
      <Shell className="py-1">
        <div className="grid grid-cols-2 sm:grid-cols-5">
          {contactItems.map((item) => {
            const isExternal = !item.href.startsWith("#");
            return (
              <a
                key={item.label}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="group border-b border-r border-[var(--line)] p-4 transition-colors hover:bg-[var(--hover)] sm:min-h-[126px]"
              >
                <div className="flex h-full flex-col justify-between gap-8">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)]">
                    {item.icon}
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[var(--fg)]">
                      {item.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--soft)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}

function ProjectTabs({
  active,
  onChange,
}: {
  active: "All" | ProjectCategory;
  onChange: (value: "All" | ProjectCategory) => void;
}) {
  return (
    <div className="inline-flex flex-wrap rounded-lg border border-[var(--line)] bg-[var(--chip)] p-0.5">
      {projectTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-md px-3 py-1.5 text-[12px] transition-colors",
            active === tab
              ? "bg-[var(--fg)] font-semibold text-[var(--bg)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--fg)]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof site.projects)[number] }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group rounded-xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--soft)] hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-lg border border-[var(--line)] bg-gradient-to-br from-[var(--chip)] via-[var(--card)] to-[color:rgb(from_var(--bg)_r_g_b_/_0.4)]">
        <div className="bg-stripes absolute inset-0 opacity-20" />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0"
          >
            <span className="absolute left-2.5 top-2.5 h-4 w-4 border-l border-t border-[var(--fg)]" />
            <span className="absolute right-2.5 top-2.5 h-4 w-4 border-r border-t border-[var(--fg)]" />
            <span className="absolute bottom-2.5 left-2.5 h-4 w-4 border-b border-l border-[var(--fg)]" />
            <span className="absolute bottom-2.5 right-2.5 h-4 w-4 border-b border-r border-[var(--fg)]" />
            <div className="absolute left-3 top-3 flex items-center gap-2 font-mono text-[10px] text-[var(--fg)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
              <span>REC</span>
            </div>
            <div className="absolute right-3 top-3 font-mono text-[10px] text-[var(--fg)]">
              ISO 400
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {project.status ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px]",
                project.status === "Live"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  project.status === "Live"
                    ? "animate-pulse bg-emerald-400"
                    : "bg-amber-300",
                )}
              />
              {project.status}
            </span>
          ) : null}
          {project.featured ? (
            <span className="rounded-full bg-amber-400/10 px-2.5 py-1 font-mono text-[10.5px] text-amber-500">
              Featured
            </span>
          ) : null}
        </div>

        <div className="absolute -bottom-3 -right-6 h-32 w-56 overflow-hidden rounded-lg border-4 border-[color:rgb(from_var(--bg)_r_g_b_/_0.4)] shadow-xl transition-all duration-300 group-hover:-bottom-1 group-hover:-right-4 sm:h-36 sm:w-64">
          {failed ? (
            <div className="flex h-full w-full items-center justify-center bg-[var(--chip)] font-serif text-2xl text-[var(--fg)]">
              {project.title}
            </div>
          ) : (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="h-full w-full object-cover"
              onError={() => setFailed(true)}
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-semibold tracking-wide text-[var(--fg)]">
          {project.title}
        </h3>
        <span className="font-mono text-xs text-[var(--soft)]">
          {project.year}
        </span>
      </div>
      <p className="mt-2 line-clamp-4 text-[13px] text-[var(--muted)]">
        {project.blurb}
      </p>

      {project.story ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex items-center gap-2 text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <span>
              {open ? "Hide engineering details" : "Show engineering details"}
            </span>
            {open ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 border-l-2 border-l-[var(--soft)] bg-[color:rgb(from_var(--chip)_r_g_b_/_0.6)] px-4 py-3 text-[12px] leading-relaxed text-[var(--muted)]">
                  {project.story.split("\n\n").map((paragraph) => (
                    <p key={paragraph} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded border border-[color:rgb(from_var(--line)_r_g_b_/_0.3)] bg-[var(--chip)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--muted)]"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {project.links.live ? (
          <a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--fg)]"
            aria-label={`${project.title} live`}
          >
            <Globe className="h-4 w-4" />
          </a>
        ) : null}
        {project.links.source ? (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--fg)]"
            aria-label={`${project.title} source`}
          >
            <GitHubWordmark />
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}

function ProjectsSection({ routeOnly = false }: { routeOnly?: boolean }) {
  const [activeTab, setActiveTab] = useState<"All" | ProjectCategory>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return site.projects.filter((project) => {
      const matchesCategory =
        activeTab === "All" ||
        project.categories.some((category) => category === activeTab);
      const matchesQuery =
        !query ||
        `${project.title} ${project.blurb} ${project.stack.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeTab, query]);

  return (
    <section id="projects">
      <SectionHeader
        title="Projects"
        aside={
          routeOnly ? null : (
            <ProjectTabs active={activeTab} onChange={setActiveTab} />
          )
        }
      />
      <Shell className="py-7 sm:py-8">
        {routeOnly ? (
          <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--soft)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--chip)] py-2.5 pl-9 pr-9 text-[13px] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--soft)] focus:border-[var(--soft)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--soft)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <ProjectTabs active={activeTab} onChange={setActiveTab} />
          </div>
        ) : null}

        <motion.div
          layout
          className={cn("mt-5 grid gap-4 sm:grid-cols-2", routeOnly ? "" : "")}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </Shell>
    </section>
  );
}

function ExperienceSection() {
  const metrics = [
    { value: "5+", label: "Projects" },
    { value: "100%", label: "TypeScript" },
    { value: "10+", label: "APIs" },
    { value: "500+", label: "Commits" },
  ];

  return (
    <section id="experience">
      <SectionHeader title="Experience" />
      <Shell className="py-2">
        {site.experience.map((job) => (
          <div
            key={`${job.company}-${job.period}`}
            className="border-t border-[var(--line)] py-5 first:border-t-0"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[16px] font-semibold tracking-wide text-[var(--fg)]">
                  {job.role} ·{" "}
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[var(--muted)]"
                    >
                      {job.company}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    job.company
                  )}
                </h3>
                <p className="mt-2 text-[13.5px] text-[var(--muted)]">
                  {job.blurb}
                </p>
              </div>
              <span className="font-mono text-[11px] text-[var(--soft)]">
                {job.period}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 divide-x divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)] bg-[color:rgb(from_var(--chip)_r_g_b_/_0.6)] sm:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="px-4 py-3">
                  <div className="text-[15px] font-bold text-[var(--fg)]">
                    {metric.value}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--soft)]">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Shell>
    </section>
  );
}

const RECENT_CONTRIBUTIONS_ON_HOME = 5;

const contributionStatusLabel: Record<ContributionStatus, string> = {
  merged: "Merged",
  open: "Open",
};

const contributionStatusColor: Record<ContributionStatus, string> = {
  merged: "text-[var(--status-merged)]",
  open: "text-[var(--status-open)]",
};

// GitHub's own Octicons (git-merge-16, git-pull-request-16), MIT licensed.
const contributionStatusIconPath: Record<ContributionStatus, string> = {
  merged:
    "M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z",
  open: "M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z",
};

function ContributionStatusIcon({
  status,
  className,
}: {
  status: ContributionStatus;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={cn("shrink-0", contributionStatusColor[status], className)}
    >
      <title>{contributionStatusLabel[status]}</title>
      <path d={contributionStatusIconPath[status]} />
    </svg>
  );
}

function OpenSourceSection({ routeOnly = false }: { routeOnly?: boolean }) {
  const { contributions, topRepositories, loading, allPRsUrl } =
    useOpenSourcePRs(site.github.username);
  const shown = routeOnly
    ? contributions
    : contributions.slice(0, RECENT_CONTRIBUTIONS_ON_HOME);

  return (
    <section id="open-source">
      <SectionHeader
        title="Open Source"
        aside={
          <div className="flex items-center gap-4 font-mono text-[11px] text-[var(--soft)]">
            {(["merged", "open"] as const).map((status) => (
              <span key={status} className="inline-flex items-center gap-1.5">
                <ContributionStatusIcon status={status} className="h-3 w-3" />
                {contributionStatusLabel[status]}
              </span>
            ))}
          </div>
        }
      />
      <Shell className="py-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--soft)]">
          Recent contributions
        </p>

        {shown.length === 0 ? (
          loading ? (
            <div className="mt-4 space-y-4" aria-hidden="true">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 w-3/4 rounded bg-[var(--hover)]" />
                  <div className="h-2.5 w-1/3 rounded bg-[var(--hover)]" />
                </div>
              ))}
            </div>
          ) : (
            <a
              href={allPRsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              View my PRs on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )
        ) : (
          <ul className="mt-2">
            {shown.map((contribution) => (
              <li key={contribution.url}>
                <a
                  href={contribution.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group -mx-2 flex gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-[var(--hover)]"
                >
                  <ContributionStatusIcon
                    status={contribution.status}
                    className="mt-[3px] h-3.5 w-3.5"
                  />
                  <span className="min-w-0">
                    <span className="block text-[14px] text-[var(--fg)]">
                      {contribution.title}
                      <span className="sr-only">
                        {" "}
                        ({contributionStatusLabel[contribution.status]})
                      </span>
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-[var(--soft)]">
                      {contribution.repo} · #{contribution.number} ·{" "}
                      {new Date(contribution.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric", timeZone: "UTC" },
                      )}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {!routeOnly && contributions.length > RECENT_CONTRIBUTIONS_ON_HOME ? (
          <a
            href="/open-source"
            onClick={(event) => {
              event.preventDefault();
              navigateTo("/open-source");
            }}
            className="mt-2 inline-block font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            View all →
          </a>
        ) : null}

        {topRepositories.length > 0 ? (
          <>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-[var(--soft)]">
              Most contributed to
            </p>
            <ul className="mt-2">
              {topRepositories.map((repository) => (
                <li key={repository.repo}>
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group -mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-2 font-mono text-[12px] transition-colors hover:bg-[var(--hover)]"
                  >
                    <span className="truncate text-[var(--fg)]">
                      {repository.repo}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[var(--soft)]">
                      {repository.count}{" "}
                      {repository.count === 1 ? "PR" : "PRs"}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Shell>
    </section>
  );
}

function TechStackSection() {
  const [activeTab, setActiveTab] = useState<TechCategory>("All");

  const filteredSkills = useMemo(
    () =>
      activeTab === "All"
        ? site.skills
        : site.skills.filter((skill) => skill.category === activeTab),
    [activeTab],
  );

  return (
    <section id="skills">
      <SectionHeader
        title="Tech Stack"
        aside={
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--soft)]">
            ( select tab to filter )
          </span>
        }
      />
      <Shell className="py-7 sm:py-8">
        <div className="flex flex-wrap gap-2">
          {techTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] transition-all duration-200",
                activeTab === tab
                  ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                  : "border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)]",
              )}
            >
              {techTabIcons[tab]}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="mt-5 flex flex-wrap gap-2.5">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.span
                key={skill.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 font-mono text-[12px] text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px] transition-all group-hover:brightness-110">
                  {skill.name.slice(0, 1)}
                </span>
                {skill.name}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      </Shell>
    </section>
  );
}

function WritingSection() {
  return (
    <section id="writing">
      <SectionHeader
        title="Writing"
        aside={
          <a
            href={site.socials.medium}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <span>Medium</span>
            <span>medium.com</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        }
      />
      <Shell className="divide-y divide-[var(--line)]">
        {site.writing.map((post) => (
          <a
            key={post.title}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-3 px-0 py-5 transition-colors hover:bg-[var(--hover)] sm:flex-row sm:items-start sm:gap-5"
          >
            <div className="w-20 shrink-0 font-mono text-[11px] text-[var(--soft)]">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[18px] text-[var(--fg)] transition-colors hover:text-[var(--muted)]">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-[13px] text-[var(--muted)]">
                {post.summary}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
              <span>{post.readingTime ?? "Read"}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </Shell>
    </section>
  );
}

function GitHubActivitySection() {
  const { weeks, monthLabels, opacitySteps, total, unavailable } =
    useGithubHeatmap(site.github.username);
  const profileUrl = `https://github.com/${site.github.username}`;
  // A narrow column for the weekday labels, then one per week.
  const columns = `12px repeat(${weeks.length}, minmax(0, 1fr))`;
  const scrollerRef = useRef<HTMLDivElement>(null);

  // On narrow screens the grid scrolls; start at the newest weeks, as GitHub does.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [weeks]);

  return (
    <section id="github">
      <SectionHeader
        title="GitHub Activity"
        aside={
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            @{site.github.username}
          </a>
        }
      />
      <Shell className="py-7 sm:py-8">
        {unavailable ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            View my activity on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <div ref={scrollerRef} className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div
                className="mb-2 grid gap-[3px]"
                style={{ gridTemplateColumns: columns }}
              >
                <span />
                {weeks.map((_, index) => (
                  <span
                    key={`month-${index}`}
                    className="overflow-visible whitespace-nowrap font-mono text-[10px] text-[var(--soft)]"
                  >
                    {monthLabels.find((item) => item.weekIndex === index)
                      ?.label ?? ""}
                  </span>
                ))}
              </div>

              <div
                className="grid grid-flow-col grid-rows-7 gap-[3px]"
                style={{ gridTemplateColumns: columns }}
              >
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <span
                    key={`day-${index}`}
                    className="flex items-center font-mono text-[10px] leading-none text-[var(--soft)]"
                  >
                    {day}
                  </span>
                ))}
                {weeks.map((week, weekIndex) => (
                  <Fragment key={weekIndex}>
                    {week.map((cell, dayIndex) =>
                      cell ? (
                        <div
                          key={cell.date}
                          title={`${cell.date}: ${cell.count} ${
                            cell.count === 1 ? "contribution" : "contributions"
                          }`}
                          className="aspect-square rounded-[2px] bg-[var(--fg)] transition-transform duration-200 hover:scale-125"
                          style={{ opacity: opacitySteps[cell.level] }}
                        />
                      ) : (
                        <div
                          key={`pad-${weekIndex}-${dayIndex}`}
                          className="aspect-square"
                        />
                      ),
                    )}
                  </Fragment>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] text-[var(--soft)]">
                <span>
                  {total === null
                    ? "Loading contributions…"
                    : `${total.toLocaleString()} ${
                        total === 1 ? "contribution" : "contributions"
                      } in the last year`}
                </span>
                <span className="flex items-center gap-2">
                  <span>Less</span>
                  {opacitySteps.map((opacity) => (
                    <span
                      key={opacity}
                      className="size-[10px] rounded-[2px] bg-[var(--fg)]"
                      style={{ opacity }}
                    />
                  ))}
                  <span>More</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </Shell>
    </section>
  );
}

function FooterSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const time = useClock();

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % QUOTES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer>
      <SectionHeader title="Scrolled Too Far" />
      <Shell className="flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
        <p className="max-w-[480px] text-[13.5px] text-[var(--muted)]">
          Still here? That usually means we should talk about the product, the
          role, or the next thing worth building.
        </p>
        <a
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--fg)] px-4 py-2 text-[13px] text-[var(--bg)] transition-all duration-200 hover:-translate-y-0.5"
        >
          Let&apos;s Talk
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </Shell>

      <GapBand />

      <div className="border-y border-[var(--line)]">
        <Shell className="flex min-h-[160px] items-center justify-center py-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-[560px]"
            >
              <p className="font-serif text-3xl text-[var(--soft)]">&quot;</p>
              <p className="font-serif text-[20px] italic text-[var(--fg)] sm:text-[22px]">
                {QUOTES[quoteIndex]?.text}
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--soft)]">
                {QUOTES[quoteIndex]?.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </Shell>
      </div>

      <GapBand h="h-5" />

      <div className="border-t border-[var(--line)]">
        <Shell className="flex flex-col gap-2 py-4 text-[12px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Designed &amp; Developed by {site.name}</p>
          <p>© 2026 {site.name}</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>{site.location}</span>
            <span>{time}</span>
          </div>
        </Shell>
      </div>
    </footer>
  );
}

function SideIndex({ activeId }: { activeId: string }) {
  return (
    <div className="fixed left-[calc(50%+410px)] top-[26vh] hidden xl:block">
      <div className="space-y-3">
        {sideIndexItems.map((item) => {
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(`/#${item.id}`)}
              className="group flex items-center gap-2"
            >
              <span
                className={cn(
                  "h-px bg-[var(--fg)] transition-all duration-200",
                  active ? "w-4" : "w-0 group-hover:w-2",
                )}
              />
              <span
                className={cn(
                  "text-[12px] transition-colors",
                  active
                    ? "font-semibold text-[var(--fg)]"
                    : "text-[var(--soft)] group-hover:text-[var(--fg)]",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConfettiOverlay({ burst }: { burst: number }) {
  if (!burst) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {Array.from({ length: 28 }, (_, index) => (
        <span
          key={`${burst}-${index}`}
          className="confetti-piece"
          style={
            {
              left: `${(index * 13) % 100}%`,
              animationDelay: `${(index % 8) * 0.06}s`,
              ["--drift" as string]: `${(index % 5) - 2}vw`,
              ["--spin" as string]: `${(index % 2 === 0 ? 1 : -1) * 360}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function HomePage() {
  return (
    <motion.main {...pageTransition}>
      <Hero />
      <GapBand />
      <AboutSection />
      <GapBand />
      <ContactSection />
      <GapBand />
      <ProjectsSection />
      <GapBand />
      <ExperienceSection />
      <GapBand />
      <OpenSourceSection />
      <GapBand />
      <TechStackSection />
      <GapBand />
      <WritingSection />
      <GapBand />
      <GitHubActivitySection />
      <GapBand />
      <FooterSection />
    </motion.main>
  );
}

function RoutePage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.main {...pageTransition}>
      <Shell className="py-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--soft)]">
          {title}
        </p>
      </Shell>
      {children}
      <GapBand />
      <FooterSection />
    </motion.main>
  );
}

export default function App() {
  const route = useRoute();
  const { theme, toggleTheme } = useThemeMode();
  const activeSection = useActiveSection(route === "/");
  const burst = useKonamiAchievement();
  useOneko();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Nav
        route={route}
        activeSection={activeSection}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      {route === "/" ? <SideIndex activeId={activeSection} /> : null}

      <AnimatePresence mode="wait">
        <motion.div key={route}>
          {route === "/" ? (
            <HomePage />
          ) : null}
          {route === "/projects" ? (
            <RoutePage title="Projects">
              <ProjectsSection routeOnly />
            </RoutePage>
          ) : null}
          {route === "/experience" ? (
            <RoutePage title="Experience">
              <ExperienceSection />
            </RoutePage>
          ) : null}
          {route === "/open-source" ? (
            <RoutePage title="Open Source">
              <OpenSourceSection routeOnly />
            </RoutePage>
          ) : null}
          {route === "/contact" ? (
            <RoutePage title="Contact">
              <ContactSection />
            </RoutePage>
          ) : null}
          {route === "/writing" ? (
            <RoutePage title="Writing">
              <WritingSection />
            </RoutePage>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <ConfettiOverlay burst={burst} />
    </div>
  );
}
