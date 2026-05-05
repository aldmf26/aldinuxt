// useThree — Three.js scene setup for particle background
import * as THREE from 'three'

interface ThreeOptions {
  container: Ref<HTMLElement | null>
  particleCount?: number
  color?: string
}

let particleMaterial: THREE.ShaderMaterial | null = null

function getCSSVar(name: string) {
  if (typeof document === 'undefined') return '#C8F580'
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function updateParticleColor() {
  if (!particleMaterial) return
  const hex = getCSSVar('--accent')
  const newColor = new THREE.Color(hex)
  if (particleMaterial.uniforms && particleMaterial.uniforms.uColor) {
      particleMaterial.uniforms.uColor.value.set(newColor.r, newColor.g, newColor.b)
  }
  // User explicitly requested needsUpdate
  particleMaterial.needsUpdate = true
}

export const useThree = (options: ThreeOptions) => {
  const { container, particleCount = 800, color = '#C8F580' } = options

  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let particles: THREE.Points
  let animationId: number
  let mouse = { x: 0, y: 0 }
  let isVisible = true
  let observer: IntersectionObserver | null = null

  const vertexShader = `
    attribute float aSize;
    attribute float aOpacity;
    varying float vOpacity;
    uniform float uTime;
    uniform vec2 uMouse;

    void main() {
      vOpacity = aOpacity;
      vec3 pos = position;

      // Gentle wave motion
      pos.y += sin(pos.x * 0.3 + uTime * 0.5) * 2.0;
      pos.y += cos(pos.z * 0.2 + uTime * 0.3) * 1.5;

      // Mouse repulsion
      vec2 diff = pos.xy - uMouse * 40.0;
      float dist = length(diff);
      if (dist < 80.0) {
        float force = (80.0 - dist) / 80.0;
        pos.xy += normalize(diff) * force * 8.0;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying float vOpacity;
    uniform vec3 uColor;

    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;

      float alpha = smoothstep(0.5, 0.1, d) * vOpacity;
      gl_FragColor = vec4(uColor, alpha);
    }
  `

  const init = () => {
    if (!container.value || typeof window === 'undefined') return

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    // Scene
    scene = new THREE.Scene()

    // Camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 50

    // Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.value.appendChild(renderer.domElement)

    // Particles
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a wide waveform shape
      positions[i * 3] = (Math.random() - 0.5) * 120     // x: wide spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40  // y: vertical spread for waveform
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30  // z: depth

      sizes[i] = Math.random() * 3 + 0.5
      opacities[i] = Math.random() * 0.35 + 0.05 // 5-40% opacity
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))

    const threeColor = new THREE.Color(getCSSVar('--accent'))

    particleMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    particles = new THREE.Points(geometry, particleMaterial)
    scene.add(particles)

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / width) * 2 - 1
      mouse.y = -(e.clientY / height) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Visibility observer — only render when visible
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(container.value)

    // Resize handler
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!container.value) return
        const w = container.value.clientWidth
        const h = container.value.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }, 200)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Animate
    const clock = new THREE.Clock()
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsed = clock.getElapsedTime()
      if (particleMaterial) {
          particleMaterial.uniforms.uTime.value = elapsed
          particleMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y)
      }

      // Slow rotation
      particles.rotation.y = elapsed * 0.02
      particles.rotation.x = Math.sin(elapsed * 0.1) * 0.05

      renderer.render(scene, camera)
    }
    animate()
  }

  const destroy = () => {
    if (animationId) cancelAnimationFrame(animationId)
    if (observer) observer.disconnect()
    if (renderer) {
      renderer.dispose()
      renderer.domElement.remove()
    }
    if (particles) {
      particles.geometry.dispose()
      if (particleMaterial) particleMaterial.dispose()
    }
    particleMaterial = null
  }

  onMounted(() => {
    // Only init on desktop
    if (window.innerWidth > 768) {
      init()
    }
  })

  onUnmounted(() => {
    destroy()
  })

  return { init, destroy }
}
