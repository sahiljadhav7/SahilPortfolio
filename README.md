# Sahil Jadhav — Personal Portfolio

A production-grade personal portfolio website built with **React**, **TypeScript**, and **Vite**, featuring animated Three.js shader backgrounds, smooth scroll-reveal animations, and real career data.

---

## ✨ Features

- **Animated GLSL Shader Background** — Full-screen WebGL ripple animation rendered via Three.js
- **Paper Shader Hero** — Split-panel hero section with a `@paper-design/shaders-react` dithering animation
- **Animated Pill Navbar** — Floating frosted-glass navbar with `motion/react` animations and smooth mobile drawer
- **Scroll-Reveal Sections** — `IntersectionObserver`-based reveal animations on all sections
- **Typed Subtitle** — Cycling typewriter effect in the hero
- **Project Cards** — Hover gradient effects with GitHub links
- **Experience Timeline** — Animated vertical timeline
- **Responsive** — Mobile menu, responsive grids, fluid clamp typography

---

## 🗂️ Project Structure

```
Portfolio_Website/
├── index.html                   # App entry HTML
├── vite.config.ts               # Vite config (path aliases, port 3000)
├── tsconfig.json                # Browser TypeScript config
├── tsconfig.node.json           # Node.js TypeScript config (for vite.config.ts)
├── package.json
└── src/
    ├── main.tsx                 # React root mount
    ├── App.tsx                  # Main app — all sections composed here
    ├── data.ts                  # All site content (projects, experience, skills)
    ├── three-scene.ts           # Standalone Three.js scene utilities
    ├── index.css                # Global styles + Tailwind directives + Google Fonts
    ├── style.css                # Legacy CSS (section/component styles)
    ├── lib/
    │   └── utils.ts             # Tailwind class merge utility (cn helper)
    └── components/
        └── ui/
            ├── navbar-1.tsx                         # Animated floating pill navbar
            ├── portfolio-hero-with-paper-shaders.tsx # Split hero panel
            └── shader-animation.tsx                  # Full-screen WebGL shader bg
```

---

## 🏗️ Architecture

### Component Hierarchy

```
App
├── ShaderAnimation          ← fixed -z-10 full-screen WebGL background
├── Navbar1                  ← fixed floating pill nav (motion/react)
├── ResumePage (hero)        ← split panel: bio left, Dithering shader right
│   └── Dithering            ← @paper-design/shaders-react wave animation
├── AboutSection             ← bio + skill tags grid
├── ProjectsSection          ← auto-fill card grid
│   └── ProjectCard × N      ← hover gradient, GitHub link
├── ExperienceSection        ← vertical timeline
│   └── ExperienceItem × N
├── ExtrasSection            ← research / achievements bullets
├── ContactSection           ← email CTA + social links
└── Footer
```

### Data Flow

All site content lives in **`src/data.ts`** as typed exports. No CMS or API — update that file to change project cards, experience entries, skills, or typed strings.

```ts
PROJECTS[]     → ProjectsSection  → ProjectCard
EXPERIENCES[]  → ExperienceSection → ExperienceItem
SKILLS{}       → AboutSection (skill tag grid)
EXTRAS[]       → ExtrasSection
TYPED_STRINGS[]→ Hero typewriter effect (main.ts)
```

### Animations

| Mechanism | Used For |
|---|---|
| `IntersectionObserver` (`useReveal` hook) | Section/card scroll-reveal fade+slide |
| `motion/react` (`motion.div`, `AnimatePresence`) | Navbar item entrances, mobile menu slide |
| `requestAnimationFrame` (Three.js loop) | WebGL shader background animation |
| CSS `transition` | Hover effects, navbar scroll blur |
| Typewriter loop (`setInterval`) | Hero subtitle cycling text |

### Styling Architecture

- **Tailwind CSS v3** — utility classes for all layout and component styling
- **`src/index.css`** — Tailwind directives, Google Fonts import, CSS variables
- **`src/style.css`** — Legacy CSS for older vanilla-JS sections (navbar, hero, cards)
- **CSS Variables** — `--bg`, `--accent`, `--font-mono`, `--font-sans` defined in `:root`

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 |
| 3D / WebGL | Three.js |
| Shader FX | `@paper-design/shaders-react` |
| Animations | `motion/react` |
| Icons | `lucide-react` |
| Font | Inter + JetBrains Mono (Google Fonts) |
| Linting | TypeScript strict mode |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sahiljadhav7/portfolio
cd portfolio

# 2. Install dependencies
npm install

# 3. Start the development server (opens at http://localhost:3000)
npm run dev
```

### Build for Production

```bash
npm run build       # Outputs to /dist
npm run preview     # Preview the production build locally
```

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "three": "^0.164.0",
    "@paper-design/shaders-react": "0.0.72",
    "motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.1",
    "gsap": "^3.12.5"
  },
  "devDependencies": {
    "vite": "^5.2.10",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.4",
    "@types/node": "^20.0.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

---

## ✏️ Customisation

### Update Your Content

Edit **`src/data.ts`** — all sections pull data from here:

```ts
// Add a new project
export const PROJECTS: Project[] = [
  {
    name: 'MyProject',
    description: 'What it does...',
    tags: ['React', 'TypeScript'],
    github: 'https://github.com/you/myproject',
    icon: '🛠️',
  },
  ...
]
```

### Change the Shader Colors

In `src/components/ui/portfolio-hero-with-paper-shaders.tsx`:
```tsx
<Dithering
  colorBack="hsl(0, 0%, 0%)"       // background color
  colorFront="hsl(260, 80%, 65%)"  // foreground/pattern color
  shape="wave"
  speed={0.1}
/>
```

### Change the Background Shader

The GLSL fragment shader is inline in `src/components/ui/shader-animation.tsx`. Edit the `fragmentShader` string to change the visual effect.

---

## 📁 Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:

```ts
// Use @/ instead of ../../
import { Navbar1 } from '@/components/ui/navbar-1'
import { PROJECTS } from '@/data'
```

---

## 📄 License

MIT — feel free to fork and adapt for your own portfolio.

---

*Designed & built by **Sahil Jadhav** · 2025*
