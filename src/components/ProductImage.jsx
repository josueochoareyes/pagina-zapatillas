import { useLayoutEffect, useRef, useState } from 'react'

const analyses = new Map()

// Read a small preview only: the original image is never modified or exported.
function measureImage(image) {
  const cached = analyses.get(image.currentSrc)
  if (cached) return cached
  const result = { background: '#f7f7f7', bounds: [0, 0, 1, 1] }
  try {
    const canvas = document.createElement('canvas')
    const n = 128
    canvas.width = canvas.height = n
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(image, 0, 0, n, n)
    const { data } = ctx.getImageData(0, 0, n, n)
    const pixel = (x, y) => Array.from(data.slice((y * n + x) * 4, (y * n + x) * 4 + 4))
    const corners = [pixel(0, 0), pixel(n - 1, 0), pixel(0, n - 1), pixel(n - 1, n - 1)]
    const bg = [0, 1, 2, 3].map(c => [...corners].sort((a, b) => a[c] - b[c])[2][c])
    const transparent = corners.every(p => p[3] < 8)
    const uniform = transparent || corners.every(p => p.every((v, c) => Math.abs(v - bg[c]) < 12))
    if (!transparent) result.background = `rgb(${bg.slice(0, 3).join(', ')})`
    // Only trim plain studio margins; scene photography retains its full framing.
    if (uniform) {
      let left = n, top = n, right = -1, bottom = -1
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const p = pixel(x, y)
        const foreground = transparent ? p[3] > 8 : p[3] > 8 && p.slice(0, 3).some((v, c) => Math.abs(v - bg[c]) > 12)
        if (foreground) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y) }
      }
      if (right >= left && bottom >= top) {
        const pad = 5 // Preserve soft shadows and fine edges around the product.
        left = Math.max(0, left - pad); top = Math.max(0, top - pad)
        right = Math.min(n, right + pad + 1); bottom = Math.min(n, bottom + pad + 1)
        result.bounds = [left / n, top / n, (right - left) / n, (bottom - top) / n]
      }
    }
  } catch {
    // Remote photos without CORS remain visible with ordinary contain sizing.
  }
  analyses.set(image.currentSrc, result)
  return result
}

/** Shared photo canvas for cards, editorial products, details and cart. */
export default function ProductImage({ src, alt, className = '', loading = 'lazy', onError }) {
  const frame = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [loaded, setLoaded] = useState(null)
  const info = loaded?.src === src ? loaded : null
  useLayoutEffect(() => {
    if (!className.includes('modal__sneaker')) return
    const surface = frame.current.closest('.modal__media')
    surface?.style.setProperty('--photo-background', info?.background || '#f7f7f7')
    return () => surface?.style.removeProperty('--photo-background')
  }, [className, info])
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect))
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [])
  let placement
  if (info && size.width && size.height) {
    const [x, y, w, h] = info.bounds
    const scale = Math.min(size.width * .94 / (info.width * w), size.height * .94 / (info.height * h))
    placement = {
      width: info.width * scale, height: info.height * scale,
      left: (size.width - info.width * w * scale) / 2 - x * info.width * scale,
      top: (size.height - info.height * h * scale) / 2 - y * info.height * scale,
    }
  }
  return <span ref={frame} className={`product-photo ${className}`} style={{ backgroundColor: info?.background || '#f7f7f7' }}>
    <span className="product-photo__plane">
      <img key={src} src={src} alt={alt} loading={loading} decoding="async" style={placement}
        onLoad={event => {
          const img = event.currentTarget
          setLoaded({ src, width: img.naturalWidth, height: img.naturalHeight, ...measureImage(img) })
        }} onError={onError} />
    </span>
  </span>
}
