<template>
  <div ref="stage" class="duo-stage" :class="{ ready }">
    <transition name="pop-tag">
      <div v-if="lastTyped" class="typing-fx-tag" :key="typeCount">
        <span class="tag-icon">⌨️</span>
        <span class="tag-char">{{ lastTyped }}</span>
      </div>
    </transition>
    <!-- code tokens rain in, bounce and pile up on the floor -->
    <div ref="pile" class="tokens" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
// Floating three.js mechanical coding keyboard (dev side). Tap or type to press keys.
import { sfx } from '~/utils/instrumentSound'

const { accentHex } = useSide()
const stage = ref<HTMLDivElement>()
const ready = ref(false)
const lastTyped = ref('')
const typeCount = ref(0)
const pile = ref<HTMLDivElement>()
const CODE = [';', '{ }', '=>', '()', '</>', '[]', '::', '&&', '//', '++', '!=', '$', '#', 'const', 'fn', 'await', 'return', 'if', '<?php', 'vue']
let dispose = () => {}

onMounted(async () => {
  // three.js lands in its own chunk, after the page text has painted
  const THREE = await import('three')
  const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js')
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
  const el = stage.value
  if (!el) return

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)
  const sun = new THREE.DirectionalLight(0xffffff, 1.6)
  sun.position.set(-6, 14, 8); sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 8, bottom: -8 })
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(8, 4, -10); scene.add(rim)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.ShadowMaterial({ opacity: 0.22 }))
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.4; ground.receiveShadow = true; scene.add(ground)

  const accent = new THREE.Color(accentHex.value)
  const M = {
    body: new THREE.MeshPhysicalMaterial({ color: 0x9ea3aa, metalness: 0.85, roughness: 0.3, clearcoat: 0.3 }),
    key: new THREE.MeshPhysicalMaterial({ roughness: 0.5, clearcoat: 0.35 }),
    keyAccent: new THREE.MeshPhysicalMaterial({ color: accent, roughness: 0.5, clearcoat: 0.2 }),
  }
  const accentMats: any[] = []
  const glowable = (m: any) => { const c = m.clone(); c.emissive = accent.clone(); c.emissiveIntensity = 0; accentMats.push(c); return c }

  const device = new THREE.Group(); scene.add(device)
  const W = 16.6, D = 6.6, H = 0.9
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.35), M.body)
  body.castShadow = true; body.receiveShadow = true; device.add(body)

  /* mechanical coding keyboard, 15u wide */
  const front = new THREE.Group(); front.position.y = H / 2; device.add(front)
  const keys: any[] = []
  const ROWS = [[...Array(15).fill(1)], [1.5, ...Array(12).fill(1), 1.5], [1.75, ...Array(11).fill(1), 2.25], [2.25, ...Array(10).fill(1), 2.75], [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25]]
  const keyGeo: Record<number, any> = {}
  ROWS.forEach((row, r) => {
    let x = -7.5
    row.forEach((w, i) => {
      const g = (keyGeo[w] ??= new RoundedBoxGeometry(w - 0.1, 0.5, 0.9, 3, 0.12))
      const acc = (r === 0 && i === 0) || (r === 2 && i === row.length - 1)
      const mat = glowable(acc ? M.keyAccent : M.key)
      if (acc) mat.userData.isAccentBody = true
      else mat.userData.spread = (x + w / 2 + 7.5) / 15 + r * 0.04 // 0 (left) to ~1.2 (right): drives the key hue
      const k = new THREE.Mesh(g, mat); k.castShadow = true
      k.userData = { mat, down: 0, glow: 0 }
      k.position.set(x + w / 2, 0.25, -2 + r); x += w
      front.add(k); keys.push(k)
    })
  })

  // hit feedback: flash light + a pool of ripple rings
  const flash = new THREE.PointLight(accent, 0, 6, 2); front.add(flash)
  const ringGeo = new THREE.RingGeometry(0.62, 0.74, 48)
  const rings = [...Array(6)].map(() => {
    const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }))
    m.rotation.x = -Math.PI / 2; m.userData.t0 = -1; front.add(m); accentMats.push(m.material); return m
  })
  let ringI = 0

  /* ---------- interaction ---------- */
  // each press sends a wave through the neighbouring keys and pops a token out of the key
  const waves: { x: number; z: number; t0: number }[] = []
  let bounce = 0
  const v3 = new THREE.Vector3()
  type Tok = { el: HTMLSpanElement; x: number; y: number; vx: number; vy: number; r: number; vr: number; h: number; born: number }
  const toks: Tok[] = []
  let tokColors: string[] = []
  const MAX_TOKS = 45
  // spawn from the key (pops up), from the sky, or thrown in from a side
  function pop(m: any, text: string) {
    const box = pile.value!, W = box.clientWidth
    m.getWorldPosition(v3).project(camera)
    const r = canvas.getBoundingClientRect(), s = el!.getBoundingClientRect()
    const kx = (v3.x + 1) / 2 * r.width + r.left - s.left, ky = (1 - v3.y) / 2 * r.height + r.top - s.top
    const roll = Math.random()
    const start = roll < 0.45
      ? { x: kx, y: ky, vx: (Math.random() - 0.5) * 8, vy: -9 - Math.random() * 5 }
      : roll < 0.75
        ? { x: 20 + Math.random() * (W - 40), y: -30, vx: (Math.random() - 0.5) * 2, vy: 2 }
        : roll < 0.875
          ? { x: -40, y: 30 + Math.random() * 80, vx: 7 + Math.random() * 6, vy: -3 }
          : { x: W + 40, y: 30 + Math.random() * 80, vx: -7 - Math.random() * 6, vy: -3 }
    const span = document.createElement('span')
    span.className = 'token'
    span.textContent = text
    span.style.color = tokColors[Math.floor(Math.random() * tokColors.length)]
    span.style.fontSize = `${0.9 + Math.random() * 0.9}rem`
    box.appendChild(span)
    toks.push({ ...start, el: span, r: (Math.random() - 0.5) * 40, vr: (Math.random() - 0.5) * 14, h: span.offsetHeight, born: performance.now() })
    if (toks.length > MAX_TOKS) {
      const old = toks.shift()!
      old.el.animate([{ opacity: 1 }, { opacity: 0 }], 300).onfinish = () => old.el.remove()
    }
  }
  let lastStep = 0
  function stepTokens(now: number) {
    const k = Math.min(3, (now - (lastStep || now)) / 16.67) // frames elapsed at 60 fps, so slow screens fall at the same speed
    lastStep = now
    const box = pile.value
    if (!box || !toks.length) return
    const W = box.clientWidth, H = box.clientHeight
    for (const t of toks) {
      t.vy += 0.55 * k // gravity, px per 60fps-frame squared
      t.x += t.vx * k; t.y += t.vy * k; t.r += t.vr * k
      const floor = H - t.h / 2 - 6
      if (t.y >= floor) { // land: lose energy, slide, settle
        t.y = floor; t.vy *= -0.38; t.vx *= 0.88; t.vr *= 0.55
        if (Math.abs(t.vy) < 1.2) t.vy = 0
      }
      // side walls, once a thrown token is inside
      if (now - t.born > 400 && ((t.x < 12 && t.vx < 0) || (t.x > W - 12 && t.vx > 0))) t.vx *= -0.5
      t.el.style.transform = `translate(${t.x}px, ${t.y}px) translate(-50%, -50%) rotate(${t.r}deg)`
    }
  }
  function press(m: any, text?: string) {
    m.userData.down = 1
    sfx.click()
    if (!reduce) {
      waves.push({ x: m.position.x, z: m.position.z, t0: performance.now() })
      if (waves.length > 4) waves.shift()
      bounce = 1
      pop(m, text ?? CODE[Math.floor(Math.random() * CODE.length)])
    }
    flash.position.set(m.position.x, 0.8, m.position.z); flash.intensity = 50
    const r = rings[ringI++ % rings.length]; r.position.set(m.position.x, 0.28, m.position.z); r.userData.t0 = performance.now()
  }
  const release = (m: any) => { if (m) m.userData.down = 0 }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), look = new THREE.Vector2()
  const canvas = renderer.domElement
  function hit(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ptr, camera)
    return ray.intersectObjects(keys, false)[0]?.object ?? null
  }
  let holding: any = null
  canvas.addEventListener('pointerdown', e => {
    const m = hit(e); if (!m) return
    const r = canvas.getBoundingClientRect()
    look.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1) // lean toward the finger
    canvas.setPointerCapture(e.pointerId); holding = m; press(m)
    if (e.pointerType === 'touch') navigator.vibrate?.(8)
    lastTyped.value = 'TAP'
    typeCount.value++
  })
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect()
    look.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
    const m = hit(e); canvas.style.cursor = m ? 'pointer' : 'default'
    if (holding && m && m !== holding) { release(holding); holding = m; press(m) } // slide across keys
  })
  const end = () => { release(holding); holding = null }
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end)
  canvas.addEventListener('pointerleave', () => look.set(0, 0))

  const keyHeld = new Map<string, any>()
  const typing = (e: KeyboardEvent) => { const t = e.target as HTMLElement; return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e) || !visible) return
    const k = e.key.toLowerCase()
    const m = keys[(k.charCodeAt(0) * 7 + k.length) % keys.length]
    lastTyped.value = k.length === 1 ? k.toUpperCase() : k
    typeCount.value++
    keyHeld.set(k, m); press(m, k.length === 1 ? k : k.slice(0, 5))
  }
  const onKeyUp = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase(); release(keyHeld.get(k)); keyHeld.delete(k)
  }
  addEventListener('keydown', onKeyDown); addEventListener('keyup', onKeyUp)

  /* ---------- layout, loop ---------- */
  const fit = () => {
    const w = el.clientWidth, h = el.clientHeight
    renderer.setSize(w, h, false); camera.aspect = w / h
    const target = W * (camera.aspect < 1.2 ? 1.04 : 1.3)
    const d = Math.max(target / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.aspect, 18)
    camera.position.set(0, d * 0.62, d * 0.78); camera.lookAt(0, -0.2, 0)
    camera.setViewOffset(w, h, 0, h * 0.14, w, h) // keyboard sits high, the lower part is the floor
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(fit); ro.observe(el); fit()

  // keys take hues spread around the theme accent, left to right; the body is a deep tint of it
  const hsl = { h: 0, s: 0, l: 0 }
  function paint(c: string) {
    accent.set(c); flash.color.set(c)
    accent.getHSL(hsl)
    const sat = Math.max(0.55, hsl.s)
    for (const m of accentMats) {
      if (m.emissive) m.emissive.set(c); else m.color.set(c)
      if (m.userData.isAccentBody) m.color.set(c)
      else if (m.userData.spread !== undefined) m.color.setHSL((hsl.h - 0.12 + m.userData.spread * 0.24 + 1) % 1, Math.min(1, sat * 1.05), 0.5)
    }
    M.body.color.setHSL(hsl.h, 0.25, 0.32)
    tokColors = [-0.1, -0.05, 0, 0.05, 0.1].map(o => '#' + new THREE.Color().setHSL((hsl.h + o + 1) % 1, sat, 0.55).getHexString())
  }
  paint(accentHex.value)
  const stopAccent = watch(accentHex, paint)

  const tilt = new THREE.Vector2()
  let visible = true
  const { gsap } = await import('gsap')
  const frame = () => loop(performance.now())
  function loop(now: number) {
    tilt.lerp(look, 0.06) // float + lean toward the pointer
    bounce *= 0.88
    device.position.y = 0.7 + (reduce ? 0 : Math.sin(now / 1500) * 0.22) - bounce * 0.18
    device.rotation.set(reduce ? 0 : tilt.y * 0.1, reduce ? 0 : tilt.x * 0.16 + Math.sin(now / 2600) * 0.05, reduce ? 0 : -tilt.x * 0.04)
    for (const m of keys) { // ease toward pressed/rest; glow decays after release
      const u = m.userData
      let dip = 0
      for (const w of waves) {
        const dist = Math.hypot(m.position.x - w.x, m.position.z - w.z)
        const dt = now - w.t0 - dist * 24
        if (dt > 0 && dt < 320) dip += 0.13 * Math.max(0, 1 - dist / 9) * Math.sin((Math.PI * dt) / 320)
      }
      m.position.y += (0.25 - u.down * 0.2 - dip - m.position.y) * 0.45
      u.glow = u.down ? 0.9 : Math.max(u.glow * 0.9, dip * 5)
      u.mat.emissiveIntensity = u.glow
    }
    flash.intensity *= 0.86
    for (const r of rings) {
      if (r.userData.t0 < 0) continue
      const t = (now - r.userData.t0) / 480
      if (t >= 1) { r.material.opacity = 0; r.userData.t0 = -1; continue }
      r.scale.setScalar(1 + t * 1.8); r.material.opacity = 0.95 * (1 - t)
    }
    stepTokens(now)
    renderer.render(scene, camera)
  }
  // only animate while the keyboard is on screen
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    gsap.ticker.remove(frame) // one clock: the keyboard renders on GSAP's ticker, only while on screen
    if (visible) gsap.ticker.add(frame)
  })
  io.observe(el)
  ready.value = true

  dispose = () => {
    gsap.ticker.remove(frame); io.disconnect(); ro.disconnect()
    removeEventListener('keydown', onKeyDown); removeEventListener('keyup', onKeyUp)
    stopAccent(); pmrem.dispose(); renderer.dispose(); canvas.remove()
    toks.forEach(t => t.el.remove())
  }
})

onBeforeUnmount(() => dispose())
</script>

<style scoped>
.duo-stage {
  position: relative;
  width: 100%;
  height: clamp(360px, 64svh, 660px);
  touch-action: manipulation;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.duo-stage.ready { opacity: 1; }
.duo-stage :deep(canvas) { display: block; width: 100% !important; height: 100% !important; }
.typing-fx-tag {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: var(--bg-surface);
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  color: var(--accent);
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 4px 18px var(--accent-glow);
  pointer-events: none;
  z-index: 10;
}
.tokens {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 5;
  border-bottom: 1px solid var(--line); /* the floor */
}
.tokens :deep(.token) {
  position: absolute; left: 0; top: 0; white-space: nowrap; will-change: transform;
  font-family: var(--font-mono); font-weight: 500; line-height: 1;
}
.pop-tag-enter-active {
  animation: pop-bubble 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.pop-tag-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.pop-tag-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
@keyframes pop-bubble {
  0% { transform: translate(-50%, 8px) scale(0.85); opacity: 0; }
  50% { transform: translate(-50%, 0) scale(1.08); opacity: 1; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}
.duo-hint {
  position: absolute; left: 0; right: 0; bottom: 4px;
  text-align: center; font-size: 14px; color: var(--text-muted); pointer-events: none;
  padding: 0 16px;
}
@media (prefers-reduced-motion: reduce) { .duo-stage { transition: none; } }
</style>
