import { useEffect, useRef, useState } from 'react'

/** Activa una clase "is-visible" cuando el elemento entra en pantalla. */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px', ...options }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, visible]
}
