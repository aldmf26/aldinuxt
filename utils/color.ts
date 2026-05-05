/**
 * Converts a hex color to an rgba string.
 * @param hex - The hex color string (e.g., #C8F580)
 * @param opacity - Opacity value from 0 to 1
 * @returns rgba string
 */
export function hexToRgba(hex: string, opacity: number): string {
  if (!hex) return `rgba(255, 255, 255, ${opacity})`
  
  // Remove the hash if it exists
  hex = hex.replace('#', '')

  // Handle shorthand hex (e.g., 03F)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
