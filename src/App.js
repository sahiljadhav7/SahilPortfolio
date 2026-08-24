import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRight, ChevronDown, ChevronUp, ExternalLink, Github, Globe, Mail, MapPin, Menu, Moon, Search, Sun, X, Briefcase, Hammer, Layers3, Database, Code2, FilePenLine, } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useMemo, useState, } from "react";
import { cn } from "@/lib/utils";
import { HEADLINE_TITLES, QUOTES, site } from "@/config/site";
import { useGithubHeatmap } from "@/hooks/useGithubHeatmap";
const navItems = [
    { label: "About", href: "/#about", type: "section" },
    { label: "Projects", href: "/#projects", type: "section" },
    { label: "Experience", href: "/#experience", type: "section" },
    { label: "Contact", href: "/#contact", type: "section" },
    { label: "Writing", href: "/writing", type: "route" },
];
const sideIndexItems = [
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "writing", label: "Writing" },
    { id: "github", label: "GitHub" },
];
const projectTabs = [
    "All",
    "Frontend",
    "Backend",
    "Fullstack",
];
const techTabs = [
    "All",
    "Languages",
    "Frontend",
    "Backend",
    "Databases",
    "DevOps & Tools",
];
const techTabIcons = {
    All: _jsx(Layers3, { className: "h-3.5 w-3.5" }),
    Languages: _jsx(Code2, { className: "h-3.5 w-3.5" }),
    Frontend: _jsx(Layers3, { className: "h-3.5 w-3.5" }),
    Backend: _jsx(Hammer, { className: "h-3.5 w-3.5" }),
    Databases: _jsx(Database, { className: "h-3.5 w-3.5" }),
    "DevOps & Tools": _jsx(Briefcase, { className: "h-3.5 w-3.5" }),
};
const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
};
function normalizePath(pathname) {
    if (pathname === "/projects")
        return "/projects";
    if (pathname === "/experience")
        return "/experience";
    if (pathname === "/contact")
        return "/contact";
    if (pathname === "/writing")
        return "/writing";
    return "/";
}
function navigateTo(path) {
    if (window.location.pathname + window.location.hash === path) {
        if (path.includes("#")) {
            scrollToHash(path.split("#")[1] ?? "");
        }
        return;
    }
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
}
function scrollToHash(id) {
    if (!id)
        return;
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
function useRoute() {
    const [route, setRoute] = useState(() => normalizePath(window.location.pathname));
    useEffect(() => {
        const onChange = () => {
            setRoute(normalizePath(window.location.pathname));
            const hash = window.location.hash.replace("#", "");
            if (hash) {
                setTimeout(() => scrollToHash(hash), 30);
            }
            else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
        window.addEventListener("popstate", onChange);
        return () => window.removeEventListener("popstate", onChange);
    }, []);
    return route;
}
function useThemeMode() {
    const [theme, setTheme] = useState("dark");
    useEffect(() => {
        const saved = window.localStorage.getItem("theme");
        const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
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
function useActiveSection(enabled) {
    const [activeId, setActiveId] = useState("about");
    useEffect(() => {
        if (!enabled)
            return;
        const sections = sideIndexItems
            .map((item) => document.getElementById(item.id))
            .filter(Boolean);
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible?.target.id) {
                setActiveId(visible.target.id);
            }
        }, { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.3, 0.5] });
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
        let buffer = [];
        let typed = "";
        const trigger = () => {
            setBurst(Date.now());
            window.setTimeout(() => setBurst(0), 2200);
        };
        const onKeyDown = (event) => {
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
function useCommandPaletteShortcuts(open, close) {
    useEffect(() => {
        const onKeyDown = (event) => {
            const isMeta = event.metaKey || event.ctrlKey;
            if (isMeta && event.key.toLowerCase() === "k") {
                event.preventDefault();
                open();
            }
            if (event.key === "Escape") {
                close();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [close, open]);
}
function Shell({ children, className }) {
    return (_jsx("div", { className: cn("mx-auto w-full max-w-[760px] border-x border-dashed border-[var(--line)] px-6 sm:px-8", className), children: children }));
}
function GapBand({ h = "h-7" }) {
    return (_jsx("div", { className: cn("bg-stripes", h), children: _jsx(Shell, {}) }));
}
function SectionHeader({ title, aside, }) {
    return (_jsxs("div", { className: "relative border-y border-[var(--line)] bg-stripes", children: [_jsx("span", { className: "absolute left-2 top-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" }), _jsx("span", { className: "absolute right-2 top-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" }), _jsx("span", { className: "absolute bottom-2 left-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" }), _jsx("span", { className: "absolute bottom-2 right-2 h-[3px] w-[3px] rounded-full bg-[var(--fg)] opacity-40" }), _jsxs(Shell, { className: "flex min-h-16 flex-col justify-center gap-3 py-4 sm:min-h-[76px] sm:flex-row sm:items-center sm:justify-between", children: [_jsx("h2", { className: "font-serif text-2xl tracking-wide text-[var(--fg)]", children: title }), aside ? _jsx("aside", { className: "text-right", children: aside }) : null] })] }));
}
function GitHubWordmark() {
    return _jsx(Github, { className: "h-4 w-4" });
}
function ThemeToggle({ theme, toggleTheme, }) {
    return (_jsx("button", { type: "button", onClick: toggleTheme, "aria-label": "Toggle theme", className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:rotate-45 hover:border-[var(--soft)]", children: theme === "dark" ? _jsx(Sun, { className: "h-4 w-4" }) : _jsx(Moon, { className: "h-4 w-4" }) }));
}
function Nav({ route, activeSection, theme, toggleTheme, onOpenPalette, }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [route]);
    const isItemActive = (item) => {
        if (item.type === "route")
            return route === item.href;
        if (route !== "/")
            return false;
        return activeSection === item.href.replace("/#", "");
    };
    return (_jsxs("nav", { className: "sticky top-0 z-40 border-b border-[var(--line)] bg-[color:rgb(from_var(--bg)_r_g_b_/_0.85)] backdrop-blur-md supports-[backdrop-filter]:bg-[color:rgb(from_var(--bg)_r_g_b_/_0.85)]", children: [_jsxs(Shell, { className: "flex min-h-16 items-center justify-between gap-6", children: [_jsx("button", { type: "button", onClick: () => navigateTo("/"), className: "font-serif text-xl tracking-wide text-[var(--fg)]", children: site.name }), _jsxs("div", { className: "hidden items-center gap-5 sm:flex", children: [navItems.map((item) => {
                                const active = isItemActive(item);
                                return (_jsxs("button", { type: "button", onClick: () => item.type === "route" ? navigateTo(item.href) : navigateTo(item.href), className: cn("group relative text-[13px] transition-colors", active
                                        ? "font-semibold text-[var(--fg)]"
                                        : "text-[var(--muted)] hover:text-[var(--fg)]"), children: [item.label, _jsx("span", { className: cn("absolute inset-x-0 -bottom-1 h-px origin-left bg-[var(--fg)] transition-transform duration-200", active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100") })] }, item.label));
                            }), _jsx("button", { type: "button", onClick: onOpenPalette, "aria-label": "Open command palette", className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--soft)]", children: _jsx(Search, { className: "h-4 w-4" }) }), _jsx(ThemeToggle, { theme: theme, toggleTheme: toggleTheme })] }), _jsxs("div", { className: "flex items-center gap-2 sm:hidden", children: [_jsx("button", { type: "button", onClick: onOpenPalette, "aria-label": "Open command palette", className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)]", children: _jsx(Search, { className: "h-4 w-4" }) }), _jsx(ThemeToggle, { theme: theme, toggleTheme: toggleTheme }), _jsx("button", { type: "button", onClick: () => setOpen((current) => !current), "aria-label": "Toggle menu", className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)]", children: open ? _jsx(X, { className: "h-4 w-4" }) : _jsx(Menu, { className: "h-4 w-4" }) })] })] }), _jsx(AnimatePresence, { children: open ? (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.25, ease: "easeOut" }, className: "overflow-hidden border-t border-[var(--line)] bg-[var(--bg)] bg-stripes sm:hidden", children: _jsx(Shell, { className: "py-2", children: navItems.map((item) => {
                            const active = isItemActive(item);
                            return (_jsxs("button", { type: "button", onClick: () => item.type === "route" ? navigateTo(item.href) : navigateTo(item.href), className: "flex w-full items-center justify-between border-b border-dashed border-[var(--line)] py-3 text-left last:border-b-0", children: [_jsx("span", { className: cn("text-sm", active
                                            ? "font-semibold text-[var(--fg)]"
                                            : "text-[var(--muted)]"), children: item.label }), _jsx("span", { className: cn("h-2 w-2 rounded-full", active ? "bg-[var(--fg)]" : "bg-[var(--soft)]/40") })] }, item.label));
                        }) }) })) : null })] }));
}
function Hero({ onOpenPalette }) {
    const avatars = ["/profile.jpg", "/profile2.png"];
    const [avatarIndex, setAvatarIndex] = useState(0);
    const [headlineIndex, setHeadlineIndex] = useState(0);
    const [avatarFailed, setAvatarFailed] = useState(false);
    useEffect(() => {
        const id = window.setInterval(() => {
            setHeadlineIndex((current) => (current + 1) % HEADLINE_TITLES.length);
        }, 3200);
        return () => window.clearInterval(id);
    }, []);
    const rotateAvatar = () => {
        setAvatarFailed(false);
        setAvatarIndex((current) => (current + 1) % avatars.length);
    };
    return (_jsx(motion.section, { ...pageTransition, children: _jsxs(Shell, { className: "py-7 sm:py-9", children: [_jsxs("div", { className: "relative h-36 overflow-hidden rounded-xl border border-[var(--line)] sm:h-44", children: [_jsx("img", { src: "/images/cover.jpg", alt: "Editorial portfolio cover", className: "h-full w-full object-cover opacity-65 grayscale" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.35)] to-transparent" }), _jsx("div", { className: "absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_4px)]" }), _jsx("div", { className: "absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_28px)]" }), _jsx("div", { className: "scanline absolute inset-0" })] }), _jsxs("div", { className: "mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left", children: [_jsxs("div", { className: "flex flex-col items-center gap-4 sm:flex-row sm:items-end", children: [_jsxs("div", { className: "group relative", children: [_jsxs("button", { type: "button", onClick: rotateAvatar, className: "relative block overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--chip)]", children: [avatarFailed ? (_jsx("div", { className: "flex h-20 w-20 items-center justify-center font-serif text-lg text-[var(--fg)]", children: "SJ" })) : (_jsx("img", { src: avatars[avatarIndex], alt: site.name, className: "h-20 w-20 object-cover grayscale", onError: () => setAvatarFailed(true) })), _jsx("span", { className: "absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.10)_0,rgba(255,255,255,0.10)_1px,transparent_1px,transparent_4px)] opacity-[0.18] transition-opacity duration-200 group-hover:opacity-[0.30]" })] }), _jsx("button", { type: "button", onClick: rotateAvatar, className: "absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] opacity-100 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100", "aria-label": "Rotate avatar", children: _jsx(ChevronDown, { className: "h-3.5 w-3.5 rotate-[-90deg]" }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "glitch-text font-serif text-3xl leading-none tracking-tight sm:text-[38px]", children: site.name }), _jsx("div", { className: "mt-2 flex min-h-6 items-center justify-center sm:justify-start", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.p, { initial: { y: 12, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -12, opacity: 0 }, transition: { duration: 0.3, ease: "easeOut" }, className: "font-mono text-[13px] text-[var(--muted)]", children: HEADLINE_TITLES[headlineIndex] }, HEADLINE_TITLES[headlineIndex]) }) }), _jsxs("div", { className: "mt-2 flex items-center justify-center gap-1.5 font-mono text-[11px] text-[var(--soft)] sm:justify-start", children: [_jsx(MapPin, { className: "h-3.5 w-3.5" }), _jsx("span", { children: site.location })] })] })] }), _jsxs("button", { type: "button", onClick: onOpenPalette, className: "inline-flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--chip)] px-3 py-2 font-mono text-[11px] text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--fg)]", children: [_jsx(Search, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Command Palette" }), _jsx("span", { className: "rounded border border-[var(--line)] px-1.5 py-0.5", children: "\u2318K" })] })] })] }) }));
}
function AboutSection() {
    return (_jsxs("section", { id: "about", children: [_jsx(SectionHeader, { title: "About" }), _jsxs(Shell, { className: "grid gap-6 py-7 sm:grid-cols-[1.25fr_0.9fr] sm:py-8", children: [_jsx("div", { className: "space-y-3", children: site.about.map((paragraph, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: {
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                                delay: index * 0.1,
                            }, className: "flex gap-3 text-[13.5px] leading-relaxed text-[var(--muted)]", children: [_jsx("span", { className: "pt-1 text-[var(--soft)]", children: "\u2022" }), _jsx("p", { children: paragraph })] }, paragraph))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }, className: "rounded-xl border border-[var(--line)] bg-[var(--card)] p-5", children: [_jsx("p", { className: "font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--soft)]", children: "Developer Snapshot" }), _jsx("div", { className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2", children: site.tldr.map((item) => (_jsxs("div", { className: "flex gap-2 text-[13px] text-[var(--muted)]", children: [_jsx("span", { className: "mt-1 h-2 w-2 rounded-full bg-emerald-500" }), _jsx("span", { children: item })] }, item))) })] })] })] }));
}
function ContactSection() {
    const contactItems = [
        {
            label: "GitHub",
            href: site.socials.github,
            icon: _jsx(Github, { className: "h-4 w-4" }),
        },
        {
            label: "LinkedIn",
            href: site.socials.linkedin,
            icon: _jsx(ExternalLink, { className: "h-4 w-4" }),
        },
        {
            label: "Twitter",
            href: site.socials.twitter,
            icon: _jsx(ExternalLink, { className: "h-4 w-4" }),
        },
        {
            label: "Mail",
            href: site.socials.email,
            icon: _jsx(Mail, { className: "h-4 w-4" }),
        },
        {
            label: "Resume",
            href: site.socials.resume,
            icon: _jsx(FilePenLine, { className: "h-4 w-4" }),
        },
    ];
    return (_jsxs("section", { id: "contact", children: [_jsx(SectionHeader, { title: "Contact" }), _jsx(Shell, { className: "py-1", children: _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5", children: contactItems.map((item) => {
                        const isMail = item.href.startsWith("mailto:");
                        const isExternal = !item.href.startsWith("/") && !item.href.startsWith("#") && !isMail;
                        return (_jsx("a", { href: item.href, target: isExternal ? "_blank" : undefined, rel: isExternal ? "noreferrer" : undefined, className: "group border-b border-r border-[var(--line)] p-4 transition-colors hover:bg-[var(--hover)] sm:min-h-[126px]", children: _jsxs("div", { className: "flex h-full flex-col justify-between gap-8", children: [_jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--chip)] text-[var(--fg)]", children: item.icon }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-[13px] text-[var(--fg)]", children: item.label }), _jsx(ArrowUpRight, { className: "h-4 w-4 text-[var(--soft)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })] })] }) }, item.label));
                    }) }) })] }));
}
function ProjectTabs({ active, onChange, }) {
    return (_jsx("div", { className: "inline-flex flex-wrap rounded-lg border border-[var(--line)] bg-[var(--chip)] p-0.5", children: projectTabs.map((tab) => (_jsx("button", { type: "button", onClick: () => onChange(tab), className: cn("rounded-md px-3 py-1.5 text-[12px] transition-colors", active === tab
                ? "bg-[var(--fg)] font-semibold text-[var(--bg)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--fg)]"), children: tab }, tab))) }));
}
function ProjectCard({ project }) {
    const [open, setOpen] = useState(false);
    const [failed, setFailed] = useState(false);
    return (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: { duration: 0.25, ease: "easeOut" }, className: "group rounded-xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--soft)] hover:shadow-md", children: [_jsxs("div", { className: "relative h-48 w-full overflow-hidden rounded-lg border border-[var(--line)] bg-gradient-to-br from-[var(--chip)] via-[var(--card)] to-[color:rgb(from_var(--bg)_r_g_b_/_0.4)]", children: [_jsx("div", { className: "bg-stripes absolute inset-0 opacity-20" }), _jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 0 }, whileHover: { opacity: 1 }, className: "pointer-events-none absolute inset-0", children: [_jsx("span", { className: "absolute left-2.5 top-2.5 h-4 w-4 border-l border-t border-[var(--fg)]" }), _jsx("span", { className: "absolute right-2.5 top-2.5 h-4 w-4 border-r border-t border-[var(--fg)]" }), _jsx("span", { className: "absolute bottom-2.5 left-2.5 h-4 w-4 border-b border-l border-[var(--fg)]" }), _jsx("span", { className: "absolute bottom-2.5 right-2.5 h-4 w-4 border-b border-r border-[var(--fg)]" }), _jsxs("div", { className: "absolute left-3 top-3 flex items-center gap-2 font-mono text-[10px] text-[var(--fg)]", children: [_jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-rose-500" }), _jsx("span", { children: "REC" })] }), _jsx("div", { className: "absolute right-3 top-3 font-mono text-[10px] text-[var(--fg)]", children: "ISO 400" })] }) }), _jsxs("div", { className: "absolute left-4 top-4 flex flex-wrap gap-2", children: [project.status ? (_jsxs("span", { className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px]", project.status === "Live"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-amber-500/20 text-amber-300"), children: [_jsx("span", { className: cn("h-2 w-2 rounded-full", project.status === "Live" ? "animate-pulse bg-emerald-400" : "bg-amber-300") }), project.status] })) : null, project.featured ? (_jsx("span", { className: "rounded-full bg-amber-400/10 px-2.5 py-1 font-mono text-[10.5px] text-amber-500", children: "Featured" })) : null] }), _jsx("div", { className: "absolute -bottom-3 -right-6 h-32 w-56 overflow-hidden rounded-lg border-4 border-[color:rgb(from_var(--bg)_r_g_b_/_0.4)] shadow-xl transition-all duration-300 group-hover:-bottom-1 group-hover:-right-4 sm:h-36 sm:w-64", children: failed ? (_jsx("div", { className: "flex h-full w-full items-center justify-center bg-[var(--chip)] font-serif text-2xl text-[var(--fg)]", children: project.title })) : (_jsx("img", { src: project.image, alt: `${project.title} screenshot`, className: "h-full w-full object-cover", onError: () => setFailed(true) })) })] }), _jsxs("div", { className: "mt-5 flex items-start justify-between gap-3", children: [_jsx("h3", { className: "text-[16px] font-semibold tracking-wide text-[var(--fg)]", children: project.title }), _jsx("span", { className: "font-mono text-xs text-[var(--soft)]", children: project.year })] }), _jsx("p", { className: "mt-2 line-clamp-4 text-[13px] text-[var(--muted)]", children: project.blurb }), project.story ? (_jsxs("div", { className: "mt-4", children: [_jsxs("button", { type: "button", onClick: () => setOpen((current) => !current), className: "inline-flex items-center gap-2 text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]", children: [_jsx("span", { children: open ? "Hide engineering details" : "Show engineering details" }), open ? _jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : _jsx(ChevronDown, { className: "h-3.5 w-3.5" })] }), _jsx(AnimatePresence, { initial: false, children: open ? (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2, ease: "easeOut" }, className: "overflow-hidden", children: _jsx("div", { className: "mt-3 border-l-2 border-l-[var(--soft)] bg-[color:rgb(from_var(--chip)_r_g_b_/_0.6)] px-4 py-3 text-[12px] leading-relaxed text-[var(--muted)]", children: project.story.split("\n\n").map((paragraph) => (_jsx("p", { className: "mb-3 last:mb-0", children: paragraph }, paragraph))) }) })) : null })] })) : null, _jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: project.stack.map((item) => (_jsx("span", { className: "rounded border border-[color:rgb(from_var(--line)_r_g_b_/_0.3)] bg-[var(--chip)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--muted)]", children: item }, item))) }), _jsxs("div", { className: "mt-4 flex items-center gap-3", children: [project.links.live ? (_jsx("a", { href: project.links.live, target: "_blank", rel: "noreferrer", className: "text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--fg)]", "aria-label": `${project.title} live`, children: _jsx(Globe, { className: "h-4 w-4" }) })) : null, project.links.source ? (_jsx("a", { href: project.links.source, target: "_blank", rel: "noreferrer", className: "text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--fg)]", "aria-label": `${project.title} source`, children: _jsx(GitHubWordmark, {}) })) : null] })] }));
}
function ProjectsSection({ routeOnly = false }) {
    const [activeTab, setActiveTab] = useState("All");
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => {
        return site.projects.filter((project) => {
            const matchesCategory = activeTab === "All" ||
                project.categories.some((category) => category === activeTab);
            const matchesQuery = !query ||
                `${project.title} ${project.blurb} ${project.stack.join(" ")}`
                    .toLowerCase()
                    .includes(query.toLowerCase());
            return matchesCategory && matchesQuery;
        });
    }, [activeTab, query]);
    return (_jsxs("section", { id: "projects", children: [_jsx(SectionHeader, { title: "Projects", aside: routeOnly ? null : _jsx(ProjectTabs, { active: activeTab, onChange: setActiveTab }) }), _jsxs(Shell, { className: "py-7 sm:py-8", children: [routeOnly ? (_jsxs("div", { className: "flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "relative w-full sm:max-w-md", children: [_jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--soft)]" }), _jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search projects", className: "w-full rounded-lg border border-[var(--line)] bg-[var(--chip)] py-2.5 pl-9 pr-9 text-[13px] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--soft)] focus:border-[var(--soft)]" }), query ? (_jsx("button", { type: "button", onClick: () => setQuery(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--soft)]", "aria-label": "Clear search", children: _jsx(X, { className: "h-4 w-4" }) })) : null] }), _jsx(ProjectTabs, { active: activeTab, onChange: setActiveTab })] })) : null, _jsx(motion.div, { layout: true, className: cn("mt-5 grid gap-4 sm:grid-cols-2", routeOnly ? "" : ""), children: _jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((project) => (_jsx(ProjectCard, { project: project }, project.title))) }) })] })] }));
}
function ExperienceSection() {
    const metrics = [
        { value: "5+", label: "Projects" },
        { value: "100%", label: "TypeScript" },
        { value: "10+", label: "APIs" },
        { value: "500+", label: "Commits" },
    ];
    return (_jsxs("section", { id: "experience", children: [_jsx(SectionHeader, { title: "Experience" }), _jsx(Shell, { className: "py-2", children: site.experience.map((job) => (_jsxs("div", { className: "border-t border-[var(--line)] py-5 first:border-t-0", children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-[16px] font-semibold tracking-wide text-[var(--fg)]", children: [job.role, " \u00B7", " ", job.url ? (_jsxs("a", { href: job.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1.5 hover:text-[var(--muted)]", children: [job.company, _jsx(ExternalLink, { className: "h-3.5 w-3.5" })] })) : (job.company)] }), _jsx("p", { className: "mt-2 text-[13.5px] text-[var(--muted)]", children: job.blurb })] }), _jsx("span", { className: "font-mono text-[11px] text-[var(--soft)]", children: job.period })] }), _jsx("div", { className: "mt-4 grid grid-cols-2 divide-x divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)] bg-[color:rgb(from_var(--chip)_r_g_b_/_0.6)] sm:grid-cols-4", children: metrics.map((metric) => (_jsxs("div", { className: "px-4 py-3", children: [_jsx("div", { className: "text-[15px] font-bold text-[var(--fg)]", children: metric.value }), _jsx("div", { className: "font-mono text-[9px] uppercase tracking-widest text-[var(--soft)]", children: metric.label })] }, metric.label))) })] }, `${job.company}-${job.period}`))) })] }));
}
function TechStackSection() {
    const [activeTab, setActiveTab] = useState("All");
    const filteredSkills = useMemo(() => activeTab === "All"
        ? site.skills
        : site.skills.filter((skill) => skill.category === activeTab), [activeTab]);
    return (_jsxs("section", { id: "skills", children: [_jsx(SectionHeader, { title: "Tech Stack", aside: _jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-[var(--soft)]", children: "( select tab to filter )" }) }), _jsxs(Shell, { className: "py-7 sm:py-8", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: techTabs.map((tab) => (_jsxs("button", { type: "button", onClick: () => setActiveTab(tab), className: cn("inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] transition-all duration-200", activeTab === tab
                                ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                                : "border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)]"), children: [techTabIcons[tab], _jsx("span", { children: tab })] }, tab))) }), _jsx(motion.div, { layout: true, className: "mt-5 flex flex-wrap gap-2.5", children: _jsx(AnimatePresence, { mode: "popLayout", children: filteredSkills.map((skill) => (_jsxs(motion.span, { layout: true, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { type: "spring", stiffness: 300, damping: 25 }, className: "group inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 font-mono text-[12px] text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]", children: [_jsx("span", { className: "inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px] transition-all group-hover:brightness-110", children: skill.name.slice(0, 1) }), skill.name] }, skill.name))) }) })] })] }));
}
function WritingSection() {
    return (_jsxs("section", { id: "writing", children: [_jsx(SectionHeader, { title: "Writing", aside: _jsxs("a", { href: site.socials.medium, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]", children: [_jsx("span", { children: "Medium" }), _jsx("span", { children: "medium.com" }), _jsx(ArrowUpRight, { className: "h-3.5 w-3.5" })] }) }), _jsx(Shell, { className: "divide-y divide-[var(--line)]", children: site.writing.map((post) => (_jsxs("a", { href: post.url, target: "_blank", rel: "noreferrer", className: "flex flex-col gap-3 px-0 py-5 transition-colors hover:bg-[var(--hover)] sm:flex-row sm:items-start sm:gap-5", children: [_jsx("div", { className: "w-20 shrink-0 font-mono text-[11px] text-[var(--soft)]", children: new Date(post.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h3", { className: "font-serif text-[18px] text-[var(--fg)] transition-colors hover:text-[var(--muted)]", children: post.title }), _jsx("p", { className: "mt-1 line-clamp-2 text-[13px] text-[var(--muted)]", children: post.summary })] }), _jsxs("div", { className: "flex items-center gap-2 text-[12px] text-[var(--muted)]", children: [_jsx("span", { children: post.readingTime ?? "Read" }), _jsx(ArrowUpRight, { className: "h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })] })] }, post.title))) })] }));
}
function GitHubActivitySection() {
    const { weeks, monthLabels, opacitySteps } = useGithubHeatmap(site.github.username, site.github.contributionsLastYear);
    return (_jsxs("section", { id: "github", children: [_jsx(SectionHeader, { title: "GitHub Activity", aside: _jsxs("a", { href: `https://github.com/${site.github.username}`, target: "_blank", rel: "noreferrer", className: "font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]", children: ["@", site.github.username] }) }), _jsx(Shell, { className: "py-7 sm:py-8", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("div", { className: "min-w-[640px]", children: [_jsx("div", { className: "mb-2 grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[3px] pl-10", children: Array.from({ length: 53 }, (_, index) => {
                                    const label = monthLabels.find((item) => item.index === index)?.label;
                                    return (_jsx("span", { className: "font-mono text-[10px] text-[var(--soft)]", children: label ?? "" }, `month-${index}`));
                                }) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "grid grid-rows-7 gap-[3px] pt-[2px] font-mono text-[10px] text-[var(--soft)]", children: ["S", "M", "T", "W", "T", "F", "S"].map((day) => (_jsx("span", { className: "h-[10px]", children: day }, day))) }), _jsx("div", { className: "grid grid-flow-col grid-rows-7 gap-[3px]", children: weeks.map((week) => (_jsx(Fragment, { children: week.days.map((cell) => (_jsx("div", { title: `${cell.date}: ${cell.count} contributions`, className: "size-[10px] rounded-[2px] bg-[var(--fg)] transition-transform duration-200 hover:scale-125", style: { opacity: opacitySteps[cell.level] } }, cell.date))) }, week.weekIndex))) })] }), _jsxs("div", { className: "mt-4 flex items-center justify-end gap-2 font-mono text-[10px] text-[var(--soft)]", children: [_jsx("span", { children: "Less" }), opacitySteps.map((opacity) => (_jsx("span", { className: "size-[10px] rounded-[2px] bg-[var(--fg)]", style: { opacity } }, opacity))), _jsx("span", { children: "More" })] })] }) }) })] }));
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
    return (_jsxs("footer", { children: [_jsx(SectionHeader, { title: "Scrolled Too Far" }), _jsxs(Shell, { className: "flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center", children: [_jsx("p", { className: "max-w-[480px] text-[13.5px] text-[var(--muted)]", children: "Still here? That usually means we should talk about the product, the role, or the next thing worth building." }), _jsxs("a", { href: "/#contact", className: "inline-flex items-center gap-2 rounded-lg bg-[var(--fg)] px-4 py-2 text-[13px] text-[var(--bg)] transition-all duration-200 hover:-translate-y-0.5", children: ["Let's Talk", _jsx(ArrowUpRight, { className: "h-4 w-4" })] })] }), _jsx(GapBand, {}), _jsx("div", { className: "border-y border-[var(--line)]", children: _jsx(Shell, { className: "flex min-h-[160px] items-center justify-center py-8 text-center", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.5, ease: "easeOut" }, className: "max-w-[560px]", children: [_jsx("p", { className: "font-serif text-3xl text-[var(--soft)]", children: "\"" }), _jsx("p", { className: "font-serif text-[20px] italic text-[var(--fg)] sm:text-[22px]", children: QUOTES[quoteIndex]?.text }), _jsx("p", { className: "mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--soft)]", children: QUOTES[quoteIndex]?.author })] }, quoteIndex) }) }) }), _jsx(GapBand, { h: "h-5" }), _jsx("div", { className: "border-t border-[var(--line)]", children: _jsxs(Shell, { className: "flex flex-col gap-2 py-4 text-[12px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("p", { children: ["Designed & Developed by ", site.name] }), _jsxs("p", { children: ["\u00A9 2026 ", site.name] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500" }), _jsx("span", { children: site.location }), _jsx("span", { children: time })] })] }) })] }));
}
function SideIndex({ activeId }) {
    return (_jsx("div", { className: "fixed left-[calc(50%+410px)] top-[26vh] hidden xl:block", children: _jsx("div", { className: "space-y-3", children: sideIndexItems.map((item) => {
                const active = activeId === item.id;
                return (_jsxs("button", { type: "button", onClick: () => navigateTo(`/#${item.id}`), className: "group flex items-center gap-2", children: [_jsx("span", { className: cn("h-px bg-[var(--fg)] transition-all duration-200", active ? "w-4" : "w-0 group-hover:w-2") }), _jsx("span", { className: cn("text-[12px] transition-colors", active
                                ? "font-semibold text-[var(--fg)]"
                                : "text-[var(--soft)] group-hover:text-[var(--fg)]"), children: item.label })] }, item.id));
            }) }) }));
}
function CommandPalette({ open, onClose, onToggleTheme, }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const commands = useMemo(() => [
        { id: "about", label: "Go to About", hint: "/", action: () => navigateTo("/#about") },
        {
            id: "projects",
            label: "Go to Projects",
            hint: "/projects",
            action: () => navigateTo("/projects"),
        },
        {
            id: "experience",
            label: "Go to Experience",
            hint: "/experience",
            action: () => navigateTo("/experience"),
        },
        {
            id: "contact",
            label: "Go to Contact",
            hint: "/contact",
            action: () => navigateTo("/contact"),
        },
        {
            id: "writing",
            label: "Go to Writing",
            hint: "/writing",
            action: () => navigateTo("/writing"),
        },
        {
            id: "github",
            label: "Open GitHub",
            hint: "external",
            action: () => window.open(site.socials.github, "_blank", "noreferrer"),
        },
        {
            id: "linkedin",
            label: "Open LinkedIn",
            hint: "external",
            action: () => window.open(site.socials.linkedin, "_blank", "noreferrer"),
        },
        {
            id: "theme",
            label: "Toggle Theme",
            hint: "light/dark",
            action: () => onToggleTheme(),
        },
    ], [onToggleTheme]);
    useEffect(() => {
        if (!open)
            return;
        setSelectedIndex(0);
        const onKeyDown = (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex((current) => (current + 1) % commands.length);
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex((current) => (current - 1 + commands.length) % commands.length);
            }
            if (event.key === "Enter") {
                event.preventDefault();
                commands[selectedIndex]?.action();
                onClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [commands, onClose, open, selectedIndex]);
    return (_jsx(AnimatePresence, { children: open ? (_jsx(motion.div, { className: "fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[14vh]", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, children: _jsxs(motion.div, { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 14 }, transition: { duration: 0.2, ease: "easeOut" }, onClick: (event) => event.stopPropagation(), className: "w-full max-w-xl overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)] shadow-2xl", children: [_jsx("div", { className: "border-b border-[var(--line)] px-4 py-3 font-mono text-[11px] text-[var(--soft)]", children: "Command Palette" }), _jsx("div", { className: "p-2", children: commands.map((command, index) => (_jsxs("button", { type: "button", onClick: () => {
                                command.action();
                                onClose();
                            }, className: cn("flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-mono text-[12px] transition-colors", selectedIndex === index
                                ? "bg-[var(--hover)] text-[var(--fg)]"
                                : "text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)]"), children: [_jsx("span", { children: command.label }), _jsx("span", { className: "text-[var(--soft)]", children: command.hint })] }, command.id))) })] }) })) : null }));
}
function ConfettiOverlay({ burst }) {
    if (!burst)
        return null;
    return (_jsx("div", { className: "pointer-events-none fixed inset-0 z-[60] overflow-hidden", children: Array.from({ length: 28 }, (_, index) => (_jsx("span", { className: "confetti-piece", style: {
                left: `${(index * 13) % 100}%`,
                animationDelay: `${(index % 8) * 0.06}s`,
                ["--drift"]: `${(index % 5) - 2}vw`,
                ["--spin"]: `${(index % 2 === 0 ? 1 : -1) * 360}deg`,
            } }, `${burst}-${index}`))) }));
}
function HomePage({ onOpenPalette }) {
    return (_jsxs(motion.main, { ...pageTransition, children: [_jsx(Hero, { onOpenPalette: onOpenPalette }), _jsx(GapBand, {}), _jsx(AboutSection, {}), _jsx(GapBand, {}), _jsx(ContactSection, {}), _jsx(GapBand, {}), _jsx(ProjectsSection, {}), _jsx(GapBand, {}), _jsx(ExperienceSection, {}), _jsx(GapBand, {}), _jsx(TechStackSection, {}), _jsx(GapBand, {}), _jsx(WritingSection, {}), _jsx(GapBand, {}), _jsx(GitHubActivitySection, {}), _jsx(GapBand, {}), _jsx(FooterSection, {})] }));
}
function RoutePage({ title, children, }) {
    return (_jsxs(motion.main, { ...pageTransition, children: [_jsx(Shell, { className: "py-8", children: _jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-[var(--soft)]", children: title }) }), children, _jsx(GapBand, {}), _jsx(FooterSection, {})] }));
}
export default function App() {
    const route = useRoute();
    const { theme, toggleTheme } = useThemeMode();
    const [paletteOpen, setPaletteOpen] = useState(false);
    const activeSection = useActiveSection(route === "/");
    const burst = useKonamiAchievement();
    useOneko();
    useCommandPaletteShortcuts(() => setPaletteOpen(true), () => setPaletteOpen(false));
    return (_jsxs("div", { className: "min-h-screen bg-[var(--bg)] text-[var(--fg)]", children: [_jsx(Nav, { route: route, activeSection: activeSection, theme: theme, toggleTheme: toggleTheme, onOpenPalette: () => setPaletteOpen(true) }), route === "/" ? _jsx(SideIndex, { activeId: activeSection }) : null, _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { children: [route === "/" ? _jsx(HomePage, { onOpenPalette: () => setPaletteOpen(true) }) : null, route === "/projects" ? (_jsx(RoutePage, { title: "Projects", children: _jsx(ProjectsSection, { routeOnly: true }) })) : null, route === "/experience" ? (_jsx(RoutePage, { title: "Experience", children: _jsx(ExperienceSection, {}) })) : null, route === "/contact" ? (_jsx(RoutePage, { title: "Contact", children: _jsx(ContactSection, {}) })) : null, route === "/writing" ? (_jsx(RoutePage, { title: "Writing", children: _jsx(WritingSection, {}) })) : null] }, route) }), _jsx(CommandPalette, { open: paletteOpen, onClose: () => setPaletteOpen(false), onToggleTheme: toggleTheme }), _jsx(ConfettiOverlay, { burst: burst })] }));
}
