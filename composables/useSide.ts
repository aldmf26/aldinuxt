// Which face of the portfolio the visitor is on, plus the accent finish.
// Both live on <html> as data attributes so CSS tokens follow them in one place.
export type Side = 'dev' | 'producer'

export const ACCENTS = [
  { id: 'oranye', hex: '#ff5a1f', label: 'Dark Mode · Warm Ember' },
  { id: 'biru', hex: '#2a62f2', label: 'Dark Mode · Cyber Navy' },
  { id: 'hijau', hex: '#22b366', label: 'Light Mode · Mint Sage' },
  { id: 'kuning', hex: '#ffc21f', label: 'Light Mode · Daylight Studio' },
] as const
export type AccentId = (typeof ACCENTS)[number]['id']

const read = <T extends string>(key: string, allowed: readonly string[], fallback: T): T => {
  try {
    const v = localStorage.getItem(key)
    return (v && allowed.includes(v) ? v : fallback) as T
  } catch {
    return fallback
  }
}
const save = (key: string, v: string) => {
  try { localStorage.setItem(key, v) } catch {}
}

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Circular reveal from the tap point; instant when unsupported or reduced motion.
function reveal(apply: () => void, x?: number, y?: number) {
  const vt = (document as any).startViewTransition
  if (!vt || reduceMotion() || x === undefined || y === undefined) return apply()
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  vt.call(document, apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

export function useSide() {
  const side = useState<Side>('side', () => 'dev')
  const accent = useState<AccentId>('accent', () => 'oranye')

  const paint = () => {
    const el = document.documentElement
    el.dataset.side = side.value
    el.dataset.accent = accent.value
  }

  function setSide(s: Side, e?: MouseEvent) {
    if (s === side.value) return
    side.value = s // state flips now; only the paint waits for the transition snapshot
    save('aldi-side', s)
    reveal(paint, e?.clientX, e?.clientY)
  }

  function setAccent(a: AccentId, e?: MouseEvent) {
    if (a === accent.value) return
    accent.value = a
    save('aldi-accent', a)
    reveal(paint, e?.clientX, e?.clientY)
  }

  function restore() {
    side.value = read('aldi-side', ['dev', 'producer'], 'dev')
    accent.value = read('aldi-accent', ACCENTS.map(a => a.id), 'oranye')
    paint()
  }

  const accentHex = computed(() => ACCENTS.find(a => a.id === accent.value)!.hex)

  return { side, accent, accentHex, setSide, setAccent, restore }
}
