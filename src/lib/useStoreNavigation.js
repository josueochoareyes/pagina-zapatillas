import { useCallback, useEffect, useState } from 'react'

const PATHS = { home: '/', picker: '/catalogo', about: '/nosotros', favorites: '/favoritos' }

const readLocation = () => {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const collection = path.match(/^\/catalogo\/(hombre|mujer|accesorios)$/)
  if (collection) return { stage: 'catalog', category: collection[1] }
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
    const path = next.stage === 'catalog' ? `/catalogo/${next.category}` : PATHS[next.stage]
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
