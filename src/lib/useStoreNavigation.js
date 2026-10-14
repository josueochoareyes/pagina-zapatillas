import { useCallback, useEffect, useState } from 'react'

const PATHS = { home: '/', picker: '/catalogo', calzados: '/catalogo/calzados', ropa: '/catalogo/ropa', about: '/nosotros', favorites: '/favoritos' }

const readLocation = () => {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const collection = path.match(/^\/catalogo\/(?:(?:calzados\/)?(hombre|mujer)|accesorios|ropa\/(hombre|mujer)|ropa-(hombre|mujer))$/)
  if (collection) return { stage: 'catalog', category: collection[2] || collection[3] ? `ropa-${collection[2] || collection[3]}` : collection[1] || 'accesorios' }
  const stage = Object.keys(PATHS).find((s) => PATHS[s] === path)
  if (stage) return { stage, category: 'hombre' }
  // Cualquier ruta que ya no exista (por ejemplo /contacto) vuelve al inicio.
  return { stage: 'home', category: 'hombre', unknown: path }
}

export function useStoreNavigation() {
  const [view, setView] = useState(readLocation)

  // Si la URL inicial no corresponde a ninguna pantalla, la corregimos sin
  // dejar una entrada de historial extra.
  useEffect(() => {
    if (view.unknown) window.history.replaceState(null, '', PATHS.home)
  }, [view.unknown])

  useEffect(() => {
    const onPopState = () => setView(readLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  const transition = useCallback((next) => {
    const path = next.stage === 'catalog' ? next.category.startsWith('ropa-') ? `/catalogo/ropa/${next.category.slice(5)}` : next.category === 'accesorios' ? '/catalogo/accesorios' : `/catalogo/calzados/${next.category}` : PATHS[next.stage]
    if (window.location.pathname !== path || window.location.hash) window.history.pushState(null, '', path)
    // `unknown` solo sirve en la lectura inicial: no debe viajar en la navegación.
    setView({ stage: next.stage, category: next.category })
  }, [])
  return {
    stage: view.stage,
    category: view.category,
    setStage: (stage) => transition({ stage, category: view.category }),
    openCollection: (category = view.category) => transition({ stage: 'catalog', category }),
  }
}
