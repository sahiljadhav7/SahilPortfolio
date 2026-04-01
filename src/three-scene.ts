import * as THREE from 'three'

interface ParticleConfig {
  count: number
  spread: number
  size: number
  color: number
}

export class ThreeScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private particles!: THREE.Points
  private mouse = new THREE.Vector2(0, 0)
  private clock = new THREE.Clock()
  private animFrameId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 25

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)

    this.createParticleField({
      count: 2800,
      spread: 80,
      size: 0.045,
      color: 0x63b3ed,
    })
    this.createNebulaClouds()
    this.setupEventListeners()
    this.animate()
  }

  private createParticleField(config: ParticleConfig): void {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(config.count * 3)
    const colors = new Float32Array(config.count * 3)

    const primaryColor = new THREE.Color(config.color)
    const accentColor = new THREE.Color(0xbc8cff)
    const dimColor = new THREE.Color(0x8b949e)

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * config.spread
      positions[i3 + 1] = (Math.random() - 0.5) * config.spread
      positions[i3 + 2] = (Math.random() - 0.5) * config.spread

      const rng = Math.random()
      const chosen = rng < 0.6 ? primaryColor : rng < 0.8 ? accentColor : dimColor
      colors[i3] = chosen.r
      colors[i3 + 1] = chosen.g
      colors[i3 + 2] = chosen.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: config.size,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  private createNebulaClouds(): void {
    const colors = [0x63b3ed, 0xbc8cff]
    colors.forEach((color, i) => {
      const geo = new THREE.BufferGeometry()
      const count = 400
      const pos = new Float32Array(count * 3)
      for (let j = 0; j < count; j++) {
        const j3 = j * 3
        const radius = 5 + Math.random() * 8
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        pos[j3] = radius * Math.sin(phi) * Math.cos(theta) + (i === 0 ? -8 : 8)
        pos[j3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + (i === 0 ? 4 : -4)
        pos[j3 + 2] = radius * Math.cos(phi)
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({
        size: 0.12,
        color,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
      })
      this.scene.add(new THREE.Points(geo, mat))
    })
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('mousemove', this.onMouseMove)
  }

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
    this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate)
    const elapsed = this.clock.getElapsedTime()

    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.025
      this.particles.rotation.x = elapsed * 0.012
    }

    // Subtle camera drift following mouse
    this.camera.position.x += (this.mouse.x * 1.8 - this.camera.position.x) * 0.04
    this.camera.position.y += (this.mouse.y * 1.2 - this.camera.position.y) * 0.04
    this.camera.lookAt(this.scene.position)

    this.renderer.render(this.scene, this.camera)
  }

  public destroy(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('mousemove', this.onMouseMove)
    this.renderer.dispose()
  }
}
