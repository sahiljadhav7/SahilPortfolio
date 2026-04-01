import { useEffect, useRef, useState } from 'react'
import ResumePage from '@/components/ui/portfolio-hero-with-paper-shaders'
import { Navbar1 } from '@/components/ui/navbar-1'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { PROJECTS, EXPERIENCES, EXTRAS, SKILLS } from '@/data'

// ── Shared reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}


// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ tag, title }: { tag: string; title: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <span className="font-mono text-xs text-blue-400 tracking-widest uppercase">{tag}</span>
      <h2 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">{title}</h2>
    </div>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  const { ref, visible } = useReveal()
  const skillCategories = Object.entries(SKILLS)
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="01. About" title="Who I am" />
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Bio */}
          <div ref={ref} className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Software Engineer with hands-on experience through two internships (JIO, CONCERTO). Currently
              completing a B.E. in EXTC with a minor in DSA at Lokmanya Tilak College of Engineering (2022–2026).
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Published ML researcher, hackathon team lead, and open source contributor. I build real-world
              apps using React, Next.js, Node.js, and Python — focused on clean architecture and great UX.
            </p>
            <div className="flex gap-8 pt-6 border-t border-white/5">
              {[{ num: '15', label: 'GitHub Repos' }, { num: '2', label: 'Internships' }, { num: '1', label: 'Published Paper' }].map(s => (
                <div key={s.label}>
                  <span className="block font-mono text-2xl font-bold text-blue-400">{s.num}</span>
                  <span className="text-xs text-zinc-500 mt-1 block">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-5">
            {skillCategories.map(([label, tags], i) => (
              <div
                key={label}
                className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${(i + 2) * 80}ms` }}
              >
                <h4 className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-2">{label}</h4>
                <div className="flex flex-wrap gap-2">
                  {(tags as string[]).map(t => (
                    <span key={t} className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-white/5 px-2.5 py-1 rounded hover:border-blue-400/40 hover:text-blue-300 transition-colors">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ p, index }: { p: typeof PROJECTS[0]; index: number }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`group relative bg-zinc-900 border border-white/5 rounded-xl p-6 flex flex-col hover:border-blue-400/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex justify-between items-start mb-4">
        <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-blue-400 transition-colors ml-auto" aria-label={`${p.name} on GitHub`}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
          </svg>
        </a>
      </div>
      <h3 className="font-semibold text-white mb-2">{p.name}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed flex-1">{p.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {p.tags.map(t => <span key={t} className="font-mono text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{t}</span>)}
      </div>
    </div>
  )
}

// ── Projects Section ──────────────────────────────────────────────────────────
function ProjectsSection() {
  return (
    <section id="projects" className="py-28 px-6 bg-zinc-950/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="02. Projects" title="Things I've built" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((p, i) => <ProjectCard key={p.name} p={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}

// ── Experience Item ───────────────────────────────────────────────────────────
function ExperienceItem({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`relative pb-12 last:pb-0 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-blue-400 ring-4 ring-blue-400/20 ring-offset-1 ring-offset-black" />
      <span className="font-mono text-xs text-blue-400 tracking-widest uppercase">{exp.date}</span>
      <h3 className="text-lg font-semibold mt-1">{exp.role}</h3>
      <p className="text-sm text-zinc-400 mb-3">{exp.company} · {exp.location}</p>
      <ul className="space-y-1.5">
        {exp.bullets.map(b => (
          <li key={b} className="text-sm text-zinc-400 flex gap-2">
            <span className="text-blue-400 mt-0.5 shrink-0">▸</span>{b}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Experience Section ────────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="03. Experience" title="Where I've worked" />
        <div className="relative pl-6 border-l border-white/10">
          {EXPERIENCES.map((exp, i) => <ExperienceItem key={exp.company} exp={exp} index={i} />)}
        </div>
      </div>
    </section>
  )
}

// ── Extras Section ────────────────────────────────────────────────────────────
function ExtrasSection() {
  const { ref, visible } = useReveal()
  return (
    <section className="py-20 px-6 bg-zinc-950/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="04. Extra" title="Beyond the code" />
        <div ref={ref} className={`space-y-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <ul className="space-y-4">
          {EXTRAS.map(e => (
            <li key={e} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
              <span className="text-blue-400 mt-0.5 shrink-0">▸</span>{e}
            </li>
          ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
  const { ref, visible } = useReveal()
  const socials = [
    {
      label: 'GitHub', href: 'https://github.com/sahiljadhav7',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" /></svg>,
    },
    {
      label: 'LinkedIn', href: 'https://www.linkedin.com/in/sahil-jadhav1/',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    },
  ]
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-lg mx-auto text-center">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-mono text-xs text-blue-400 tracking-widest uppercase">05. Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 tracking-tight">Let's build something together</h2>
          <p>jadhavsahilcodes@gmail(dot)com</p>
          <div className="flex justify-center gap-6 mt-12">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-zinc-500 hover:text-blue-400 hover:-translate-y-0.5 transition-all">{s.icon}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 text-center font-mono text-xs text-zinc-600">
      Designed & Built by <span className="text-blue-400">Sahil Jadhav</span> · 2025
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen text-white">
      <ShaderAnimation />
      <Navbar1 />
      <div id="hero" className="pt-16"><ResumePage /></div>
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <ExtrasSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
