export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function normalizeHex(hex) {
  let h = String(hex).trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) h = '888888'
  return h
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex)
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }) {
  const to = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/** amount > 0 aclara hacia blanco, amount < 0 oscurece hacia negro. */
export function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  const target = amount >= 0 ? 255 : 0
  const k = Math.abs(amount)
  return rgbToHex({
    r: r + (target - r) * k,
    g: g + (target - g) * k,
    b: b + (target - b) * k,
  })
}

export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function isLight(hex) {
  const { r, g, b } = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62
}

export function readableOn(hex) {
  return isLight(hex) ? '#0b0d13' : '#ffffff'
}

export function mix(a, b, k) {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return rgbToHex({
    r: A.r + (B.r - A.r) * k,
    g: A.g + (B.g - A.g) * k,
    b: A.b + (B.b - A.b) * k,
  })
}
