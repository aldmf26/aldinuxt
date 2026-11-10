// The one driver: playhead position on the playlist, 0 (start of 2017) → 1 (end of 2026).
// The playlist section writes it from scroll; the transport bar and clips read it.
import { BARS, FIRST_YEAR } from '~/data/timeline'

export function usePlayhead() {
  const progress = useState('playhead', () => 0)
  const year = computed(() => FIRST_YEAR + progress.value * BARS)
  const bar = computed(() => Math.min(BARS, Math.floor(progress.value * BARS) + 1))
  return { progress, year, bar }
}
