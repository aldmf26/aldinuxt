<template>
  <div ref="stage" class="duo-stage" :class="{ ready }">
    <p class="duo-hint">{{ side === 'dev' ? $t('hero.hintDev') : touch ? $t('hero.hintProducerTouch') : $t('hero.hintProducer') }}</p>
  </div>
</template>

<script setup lang="ts">
// One floating three.js instrument with two faces: mechanical coding keyboard (dev)
// and a pad + keys MIDI controller (producer). Flipping follows the side state.
import { sfx, type PadName } from '~/utils/instrumentSound'

const { side, accentHex } = useSide()
const stage = ref<HTMLDivElement>()
const ready = ref(false)
const touch = matchMedia('(pointer: coarse)').matches // keyboard hints mean nothing on a phone
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
    key: new THREE.MeshPhysicalMaterial({ color: 0xf3f4f5, roughness: 0.55, clearcoat: 0.2 }),
    keyAccent: new THREE.MeshPhysicalMaterial({ color: accent, roughness: 0.5, clearcoat: 0.2 }),
    ivory: new THREE.MeshPhysicalMaterial({ color: 0xf7f6f2, roughness: 0.35, clearcoat: 0.6 }),
    ebony: new THREE.MeshPhysicalMaterial({ color: 0x0e0f10, roughness: 0.3, clearcoat: 0.8 }),
    plate: new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: 0.6, metalness: 0.2 }),
    knob: new THREE.MeshPhysicalMaterial({ color: 0x1a1b1e, roughness: 0.4, clearcoat: 0.5 }),
    knobCap: new THREE.MeshStandardMaterial({ color: 0xd9dbde, roughness: 0.3, metalness: 0.8 }),
  }
  const BODY = { dev: 0x9ea3aa, producer: 0x2a2c30 }
  const accentMats: any[] = []
  const glowable = (m: any) => { const c = m.clone(); c.emissive = accent.clone(); c.emissiveIntensity = 0; accentMats.push(c); return c }
  const font = getComputedStyle(document.body).fontFamily

  const device = new THREE.Group(); scene.add(device)
  const W = 16.6, D = 6.6, H = 0.9
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.35), M.body)
  body.castShadow = true; body.receiveShadow = true; device.add(body)
  const pressables: any[] = []
  const add = (parent: any, mesh: any, u: any) => { mesh.castShadow = true; mesh.userData = { ...u, down: 0, glow: 0 }; parent.add(mesh); pressables.push(mesh); return mesh }

  /* front: mechanical coding keyboard, 15u wide */
  const front = new THREE.Group(); front.position.y = H / 2; device.add(front)
  const ROWS = [[...Array(15).fill(1)], [1.5, ...Array(12).fill(1), 1.5], [1.75, ...Array(11).fill(1), 2.25], [2.25, ...Array(10).fill(1), 2.75], [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25]]
  const keyGeo: Record<number, any> = {}
  ROWS.forEach((row, r) => {
    let x = -7.5
    row.forEach((w, i) => {
      const g = (keyGeo[w] ??= new RoundedBoxGeometry(w - 0.1, 0.5, 0.9, 3, 0.12))
      const acc = (r === 0 && i === 0) || (r === 2 && i === row.length - 1)
      const mat = glowable(acc ? M.keyAccent : M.key)
      if (acc) mat.userData.isAccentBody = true
      const k = add(front, new THREE.Mesh(g, mat), { kind: 'key', rest: 0.25, depth: 0.2, glowMax: 0.9, mats: [mat] })
      k.position.set(x + w / 2, 0.25, -2 + r); x += w
    })
  })

  /* back: mini pad controller — knobs, 8 backlit pads, 2-octave keybed (built upright, flipped under) */
  const back = new THREE.Group(); back.rotation.x = Math.PI; back.position.y = -H / 2; device.add(back)
  const plate = new THREE.Mesh(new RoundedBoxGeometry(5.8, 0.08, 5.6, 2, 0.04), M.plate); plate.position.set(-4.9, 0.04, 0); back.add(plate)
  const FL = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '[', '=', ']'] // FL Studio typing keyboard: Q = C
  const label = (txt: string, bg: string, fg: string, sz = 40) => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 256
    const x = c.getContext('2d')!
    x.fillStyle = bg; x.fillRect(0, 0, 64, 256); x.fillStyle = fg; x.font = `800 ${sz}px ${font}`; x.textAlign = 'center'; x.fillText(txt.toUpperCase(), 32, 236)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
  }
  const knobGeo = new THREE.CylinderGeometry(0.34, 0.38, 0.42, 32), capGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.44, 8)
  const knobs: any[] = []
  for (let i = 0; i < 4; i++) {
    const k = new THREE.Group(); k.position.set(-7.05 + i * 1.42, 0.29, -1.9)
    const b = new THREE.Mesh(knobGeo, M.knob); b.castShadow = true
    const c = new THREE.Mesh(capGeo, M.knobCap); c.position.set(0, 0.01, -0.22)
    k.add(b, c); k.rotation.y = (i - 1.5) * 0.6; back.add(k); knobs.push(k)
  }
  /* back: drum pad grid 3x3 seperti drum pad controller — baris bawah = kick · hat · snare */
  const PAD_ROWS: PadName[][] = [
    ['clap', 'open', 'rim'],   // baris atas
    ['808', 'perc', 'clap'],   // baris tengah
    ['kick', 'hat', 'snare']   // baris bawah
  ]
  const PAD_KEYS: string[][] = [
    ['a', 's', 'd'],
    ['z', 'x', 'c'],
    ['q', 'w', 'e']
  ]
  const padByKey: Record<string, PadName> = {}
  PAD_ROWS.forEach((row, ri) => row.forEach((name, ci) => { padByKey[PAD_KEYS[ri][ci]] = name }))
  const padGeo = new RoundedBoxGeometry(1.5, 0.36, 1.5, 3, 0.12)
  const padSide = new THREE.MeshStandardMaterial({ color: 0x2c2e33, roughness: 0.9 })
  const padColors: Record<string, number> = { kick: 0x2ecc40, hat: 0x1abc9c, snare: 0xe74c3c, clap: 0x9b59b6, open: 0x3498db, '808': 0xf1c40f, perc: 0xe67e22, rim: 0x95a5a6 }
  PAD_ROWS.forEach((row, ri) => {
    const z = 0.05 + ri * 1.75
    const cx = -(row.length - 1) * 1.75 / 2
    row.forEach((name, ci) => {
      const key = PAD_KEYS[ri][ci]
      const c = document.createElement('canvas'); c.width = c.height = 200
      const x = c.getContext('2d')!
      const base = padColors[name] ?? 0x3a3d42
      const grd = x.createRadialGradient(100, 100, 10, 100, 100, 100)
      grd.addColorStop(0, '#fff')
      grd.addColorStop(0.45, '#' + base.toString(16).padStart(6, '0'))
      grd.addColorStop(1, '#' + Math.floor(base * 0.6).toString(16).padStart(6, '0'))
      x.fillStyle = grd
      x.fillRect(0, 0, 200, 200)
      x.fillStyle = '#fff'
      x.font = `800 52px ${font}`
      x.textAlign = 'center'
      x.fillText(name.toUpperCase(), 100, 128)
      x.fillStyle = 'rgba(255,255,255,0.85)'
      x.font = `600 30px ${font}`
      x.fillText(key.toUpperCase(), 100, 170)
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
      const top = glowable(new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.75 }))
      const p = add(back, new THREE.Mesh(padGeo, [padSide, padSide, top, padSide, padSide, padSide]), { kind: 'pad', name, rest: 0.24, depth: 0.16, glowMax: 3.2, mats: [top] })
      p.position.set(cx + ci * 1.75, 0.24, z)
    })
  })
  const WHITE = [0, 2, 4, 5, 7, 9, 11], BASE = 261.63 // C4
  const wn = 14, ww = 0.66, px = -1.6
  const wGeo = new RoundedBoxGeometry(ww - 0.05, 0.45, 4.6, 2, 0.05), bGeo = new RoundedBoxGeometry(0.4, 0.6, 2.8, 2, 0.05)
  function pianoKey(semi: number, geo: any, base: any, pos: { x: number; z: number }, rest: number) {
    const b = glowable(base); const mats = [b]; let mat: any = b
    if (FL[semi]) {
      const top = glowable(new THREE.MeshPhysicalMaterial({ map: label(FL[semi], '#' + base.color.getHexString(), '#8a8d92', base === M.ebony ? 30 : 40), roughness: base.roughness, clearcoat: base.clearcoat }))
      mats.push(top); mat = [b, b, top, b, b, b]
    }
    // pivot at the back edge so the key tips down like a real keybed
    const pivot = new THREE.Group(); pivot.position.set(pos.x, rest, pos.z - geo.parameters.depth / 2); back.add(pivot)
    const k = new THREE.Mesh(geo, mat); k.castShadow = true; k.position.z = geo.parameters.depth / 2; pivot.add(k)
    k.userData = { kind: 'piano', semi, f: BASE * 2 ** (semi / 12), rest, tilt: 0.11, glowMax: 1.1, mats, pivot, down: 0, glow: 0 }
    pressables.push(k)
  }
  for (let i = 0; i < wn; i++) pianoKey(Math.floor(i / 7) * 12 + WHITE[i % 7], wGeo, M.ivory, { x: px + i * ww + ww / 2, z: 0.2 }, 0.22)
  for (let i = 0; i < wn - 1; i++) { const n = i % 7; if (n === 2 || n === 6) continue; pianoKey(Math.floor(i / 7) * 12 + WHITE[n] + 1, bGeo, M.ebony, { x: px + (i + 1) * ww, z: -0.7 }, 0.42) }

  // hit feedback: one moving flash light + a pool of ripple rings
  const flash = new THREE.PointLight(accent, 0, 6, 2); back.add(flash)
  const ringGeo = new THREE.RingGeometry(0.62, 0.74, 48)
  const rings = [...Array(6)].map(() => {
    const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }))
    m.rotation.x = -Math.PI / 2; m.userData.t0 = -1; back.add(m); accentMats.push(m.material); return m
  })
  let ringI = 0

  /* ---------- interaction ---------- */
  function press(m: any) {
    const u = m.userData; u.down = 1; u.glow = u.glowMax
    if (u.kind === 'pad') {
      sfx[u.name as PadName]()
      flash.position.set(m.position.x, 1.4, m.position.z); flash.intensity = 40
      const r = rings[ringI++ % rings.length]; r.position.set(m.position.x, 0.45, m.position.z); r.userData.t0 = performance.now()
      knobs.forEach((k, i) => (k.rotation.y += (i % 2 ? -1 : 1) * 0.15))
    } else if (u.kind === 'piano') sfx.piano(u.f)
    else sfx.click()
  }
  const release = (m: any) => { if (m) m.userData.down = 0 }
  const tap = (m: any) => { press(m); setTimeout(() => release(m), 70) }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), look = new THREE.Vector2()
  const canvas = renderer.domElement
  function hit(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ptr, camera)
    const h = ray.intersectObjects(pressables, false)[0]
    // only the face turned toward the camera is playable
    return h && (h.object.parent === front) === (side.value === 'dev') ? h.object : null
  }
  let roll: ReturnType<typeof setInterval> | undefined, holding: any = null
  const startRoll = (m: any) => { clearInterval(roll); roll = setInterval(() => tap(m), 70) } // hold HAT = trap hi-hat roll
  canvas.addEventListener('pointerdown', e => {
    const m = hit(e); if (!m) return
    canvas.setPointerCapture(e.pointerId); holding = m; press(m)
    if (m.userData.name === 'hat') startRoll(m)
  })
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect()
    look.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
    const m = hit(e); canvas.style.cursor = m ? 'pointer' : 'default'
    if (holding && m && m !== holding) { release(holding); clearInterval(roll); holding = m; press(m); if (m.userData.name === 'hat') startRoll(m) } // slide = glissando
  })
  const end = () => { release(holding); holding = null; clearInterval(roll) }
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end)
  canvas.addEventListener('pointerleave', () => look.set(0, 0))

  const pianoKeys = pressables.filter(m => m.userData.kind === 'piano').sort((a, b) => a.userData.semi - b.userData.semi)
  const padKeys = pressables.filter(m => m.userData.kind === 'pad')
  const codeKeys = pressables.filter(m => m.userData.kind === 'key')
  const keyHeld = new Map<string, any>()
  const typing = (e: KeyboardEvent) => { const t = e.target as HTMLElement; return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e) || !visible) return
    const k = e.key.toLowerCase(); let m
    if (side.value === 'dev') m = codeKeys[(k.charCodeAt(0) * 7 + k.length) % codeKeys.length]
    else {
      const pi = FL.indexOf(k), pname = padByKey[k]
      m = pi > -1 ? pianoKeys[pi] : pname ? padKeys.find(p => p.userData.name === pname) ?? null : null
      if (m) e.preventDefault()
    }
    if (!m) return
    keyHeld.set(k, m); press(m)
    if (m.userData.name === 'hat') startRoll(m) // hold Z = hi-hat roll
  }
  const onKeyUp = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase(), m = keyHeld.get(k); if (!m) return
    keyHeld.delete(k); release(m); if (m.userData.name === 'hat') clearInterval(roll)
  }
  addEventListener('keydown', onKeyDown); addEventListener('keyup', onKeyUp)

  /* ---------- layout, flip, loop ---------- */
  const fit = () => {
    const w = el.clientWidth, h = el.clientHeight
    renderer.setSize(w, h, false); camera.aspect = w / h
    const target = W * (camera.aspect < 1.2 ? 1.04 : 1.1)
    const d = Math.max(target / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.aspect, 18)
    camera.position.set(0, d * 0.62, d * 0.78); camera.lookAt(0, -0.2, 0); camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(fit); ro.observe(el); fit()

  let flipFrom = 0, flipTo = side.value === 'producer' ? Math.PI : 0, flipStart = -1, curFlip = flipTo
  M.body.color.setHex(BODY[side.value])
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const stopSide = watch(side, s => {
    flipFrom = curFlip; flipTo = s === 'producer' ? Math.PI : 0; flipStart = reduce ? -1 : performance.now()
    M.body.color.setHex(BODY[s]); end()
  })
  const stopAccent = watch(accentHex, c => {
    accent.set(c); flash.color.set(c)
    for (const m of accentMats) { if (m.emissive) m.emissive.set(c); else m.color.set(c); if (m.userData.isAccentBody) m.color.set(c) }
  })

  const tilt = new THREE.Vector2()
  let raf = 0, visible = true
  function loop(now: number) {
    let f = flipTo, lift = 0
    if (flipStart >= 0) {
      const t = Math.min(1, (now - flipStart) / 1100)
      f = flipFrom + (flipTo - flipFrom) * ease(t); lift = Math.sin(Math.PI * t) * 1.8
      if (t >= 1) flipStart = -1
    }
    curFlip = f
    tilt.lerp(look, 0.06) // float + lean toward the pointer
    device.position.y = 0.7 + (reduce ? 0 : Math.sin(now / 1500) * 0.22) + lift
    device.rotation.set(f + (reduce ? 0 : tilt.y * 0.1), reduce ? 0 : tilt.x * 0.16 + Math.sin(now / 2600) * 0.05, reduce ? 0 : -tilt.x * 0.04)
    for (const m of pressables) { // ease toward pressed/rest; glow decays after release
      const u = m.userData
      if (u.pivot) u.pivot.rotation.x += (u.down * u.tilt - u.pivot.rotation.x) * 0.45
      else m.position.y += (u.rest - u.down * u.depth - m.position.y) * 0.45
      const g = u.down ? u.glowMax : u.glow * 0.9; u.glow = g
      for (const mt of u.mats) mt.emissiveIntensity = g
    }
    flash.intensity *= 0.86
    for (const r of rings) {
      if (r.userData.t0 < 0) continue
      const t = (now - r.userData.t0) / 480
      if (t >= 1) { r.material.opacity = 0; r.userData.t0 = -1; continue }
      r.scale.setScalar(1 + t * 1.6); r.material.opacity = 0.9 * (1 - t)
    }
    renderer.render(scene, camera)
    raf = requestAnimationFrame(loop)
  }
  // only animate while the instrument is on screen
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    cancelAnimationFrame(raf)
    if (visible) raf = requestAnimationFrame(loop)
  })
  io.observe(el)
  ready.value = true

  dispose = () => {
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); clearInterval(roll)
    removeEventListener('keydown', onKeyDown); removeEventListener('keyup', onKeyUp)
    stopSide(); stopAccent(); pmrem.dispose(); renderer.dispose(); canvas.remove()
  }
})

onBeforeUnmount(() => dispose())
</script>

<style scoped>
.duo-stage {
  position: relative;
  width: 100%;
  height: clamp(240px, min(46svh, 70vw), 600px);
  touch-action: manipulation;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.duo-stage.ready { opacity: 1; }
.duo-stage :deep(canvas) { display: block; width: 100% !important; height: 100% !important; }
.duo-hint {
  position: absolute; left: 0; right: 0; bottom: 4px;
  text-align: center; font-size: 14px; color: var(--text-muted); pointer-events: none;
  padding: 0 16px;
}
@media (prefers-reduced-motion: reduce) { .duo-stage { transition: none; } }
</style>
