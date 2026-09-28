import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Capa de persistencia que simula un backend.
 *
 * El catálogo es estático (import de JSON), así que el "servidor" es el propio
 * navegador: guardamos el estado en localStorage y lo rehidratamos al arrancar.
 * El formato lleva versión para poder migrar o invalidar cuando cambie el
 * modelo de datos sin romper sesiones ya guardadas.
 */

const NAMESPACE = 'ce-store'
const VERSION = 1

const slot = (key) => `${NAMESPACE}:${key}:v${VERSION}`

const readRaw = (key) => {
  try {
    return window.localStorage.getItem(slot(key))
  } catch {
    return null
  }
}

const writeRaw = (key, value) => {
  try {
    window.localStorage.setItem(slot(key), JSON.stringify(value))
    return true
  } catch {
    // Cuota llena o almacenamiento bloqueado (modo privado): la tienda sigue
    // funcionando en memoria, simplemente no recuerda entre recargas.
    return false
  }
}

const readJson = (key, fallback) => {
  const raw = readRaw(key)
  if (raw == null) return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    // Datos corruptos: los retiramos para no volver a fallar en cada arranque.
    try {
      window.localStorage.removeItem(slot(key))
    } catch {
      /* sin almacenamiento disponible */
    }
    return fallback
  }
}

/**
 * Estado que escribe en localStorage con el mismo formato que usaría una API.
 * `revive` rehidrata y sanea lo que llega del "servidor"; si devuelve null la
 * entrada se descarta (por ejemplo, un producto que ya no existe).
 */
export function usePersistentState(key, initial, revive) {
  const [state, setState] = useState(() => {
    const stored = readJson(key, null)
    if (stored == null) return initial
    const revived = revive ? revive(stored) : stored
    return revived ?? initial
  })

  const first = useRef(true)
  useEffect(() => {
    // El primer render rehidrata desde el almacenamiento: no hay que
    // reescribir lo que acabamos de leer.
    if (first.current) {
      first.current = false
      return
    }
    writeRaw(key, state)
  }, [key, state])

  return [state, setState]
}

/* ────────────────────────── Carrito ────────────────────────── */

const cartKey = (id, colorIndex, size) => `${id}::${colorIndex}::${size}`

const isValidLine = (line) =>
  line &&
  typeof line.id === 'string' &&
  typeof line.key === 'string' &&
  Number.isInteger(line.colorIndex) &&
  typeof line.size === 'string' &&
  Number.isFinite(line.price) &&
  line.color &&
  typeof line.color.name === 'string' &&
  Number.isInteger(line.qty) &&
  line.qty > 0

/**
 * Al rehidratar buscamos el producto real en el catálogo y refrescamos nombre,
 * precio y colorway. Así el carrito guardado nunca muestra datos rancios aunque
 * el catálogo cambie, que es justo lo que haría un backend al responder.
 */
const reviveCart = (stored, index) => {
  if (!Array.isArray(stored)) return null
  const lines = []
  for (const line of stored) {
    if (!isValidLine(line)) continue
    const product = index.get(line.id)
    if (!product) continue
    const color = product.colors[line.colorIndex]
    if (!color) continue
    const qty = Math.min(99, line.qty)
    lines.push({
      key: line.key,
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      color,
      colorIndex: line.colorIndex,
      size: line.size,
      qty,
    })
  }
  return lines
}

export function usePersistentCart(index) {
  const [cart, setCart] = usePersistentState('cart', [], (stored) => reviveCart(stored, index))

  const addLine = useCallback((product, colorIndex, size, qty = 1) => {
    setCart((prev) => {
      const key = cartKey(product.id, colorIndex, size)
      const found = prev.find((i) => i.key === key)
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          category: product.category,
          color: product.colors[colorIndex],
          colorIndex,
          size,
          qty: Math.min(99, qty),
        },
      ]
    })
  }, [setCart])

  const changeQty = useCallback((key, delta) => {
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0))
  }, [setCart])

  const removeLine = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }, [setCart])

  const clearCart = useCallback(() => setCart([]), [setCart])

  return { cart, setCart, addLine, changeQty, removeLine, clearCart, cartKey }
}

/* ────────────────────────── Favoritos ────────────────────────── */

const reviveWishes = (stored, index) => {
  if (!Array.isArray(stored)) return null
  // Descartamos ids que ya no están en el catálogo para no dejar ghosts.
  return stored.filter((id) => typeof id === 'string' && index.has(id))
}

export function usePersistentWishes(index) {
  const [ids, setIds] = usePersistentState('wishes', [], (stored) => reviveWishes(stored, index))
  const wishes = new Set(ids)

  const toggleWish = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [setIds])

  const clearWishes = useCallback(() => setIds([]), [setIds])

  return { wishes, toggleWish, clearWishes }
}

/** Herramienta de apoyo para los tests. */
export const clearPersisted = () => {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${NAMESPACE}:`))
      .forEach((k) => window.localStorage.removeItem(k))
  } catch {
    /* sin almacenamiento disponible */
  }
}
