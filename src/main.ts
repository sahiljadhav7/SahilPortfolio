import './style.css'
import { ThreeScene } from './three-scene'
import { PROJECTS, EXPERIENCES, TYPED_STRINGS } from './data'

// ===== Three.js Init =====
const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement
new ThreeScene(canvas)

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar')!
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20)
})

// ===== Hamburger Menu =====
const hamburger = document.getElementById('hamburger')!
const mobileMenu = document.getElementById('mobile-menu')!
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open')
  mobileMenu.classList.toggle('open')
})
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open')
    mobileMenu.classList.remove('open')
  })
})

// ===== Typed Text Animation =====
;(function initTyped(): void {
  const el = document.getElementById('typed-text')!
  let stringIndex = 0
  let charIndex = 0
  let isDeleting = false

  const type = (): void => {
    const current = TYPED_STRINGS[stringIndex]
    el.textContent = isDeleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++)

    let delay = isDeleting ? 60 : 100

    if (!isDeleting && charIndex > current.length) {
      delay = 1800
      isDeleting = true
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false
      charIndex = 0
      stringIndex = (stringIndex + 1) % TYPED_STRINGS.length
      delay = 300
    }

    setTimeout(type, delay)
  }

  setTimeout(type, 800)
})()

// ===== Scroll Reveal =====
;(function initScrollReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  )

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})()

// ===== Animated Counters =====
;(function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('.stat-num')

  const animate = (el: HTMLElement, target: number): void => {
    const duration = 1500
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      el.textContent = String(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const target = parseInt(el.dataset.target ?? '0', 10)
          animate(el, target)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.5 }
  )

  counters.forEach((el) => observer.observe(el))
})()

// ===== Render Projects =====
;(function renderProjects(): void {
  const grid = document.getElementById('projects-grid')!

  const githubIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>`
  const externalIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`

  grid.innerHTML = PROJECTS.map((p, i) => `
    <div class="project-card reveal" style="--i:${i}">
      <div class="project-card-top">
        <span class="project-icon">${p.icon}</span>
        <div class="project-links">
          <a href="${p.github}" target="_blank" rel="noopener" aria-label="GitHub">${githubIcon}</a>
          ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" aria-label="Live Demo">${externalIcon}</a>` : ''}
        </div>
      </div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="project-tags">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `).join('')

  // Re-observe newly created reveal elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
  )
  grid.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})()

// ===== Render Experience =====
;(function renderExperience(): void {
  const timeline = document.getElementById('timeline')!

  timeline.innerHTML = EXPERIENCES.map((exp, i) => `
    <div class="timeline-item reveal" style="--i:${i}">
      <div class="timeline-date">${exp.date}</div>
      <div class="timeline-role">${exp.role}</div>
      <div class="timeline-company">${exp.company}</div>
      <ul class="timeline-desc">
        ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )
  timeline.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})()
