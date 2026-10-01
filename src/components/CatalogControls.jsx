import { useEffect, useId, useRef, useState } from 'react'
import { BRANDS, SORT_OPTIONS } from '../data/catalogs'

const CHART = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>

/** Selector de ordenacion propio: mismo comportamiento que el <select> nativo. */
function SortSelect({ sort, onSort }) {
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(SORT_OPTIONS.findIndex((o) => o.id === sort))
  const wrap = useRef(null)
  const listId = useId()

  const current = SORT_OPTIONS.find((o) => o.id === sort) ?? SORT_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])

  const commit = (index) => {
    const option = SORT_OPTIONS[index]
    if (option) onSort(option.id)
    setOpen(false)
  }

  const onKeyDown = (event) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      setOpen(true)
      setCursor(SORT_OPTIONS.findIndex((o) => o.id === sort))
      return
    }
    if (!open) return
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false) }
    else if (event.key === 'ArrowDown') { event.preventDefault(); setCursor((i) => (i + 1) % SORT_OPTIONS.length) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setCursor((i) => (i - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length) }
    else if (event.key === 'Home') { event.preventDefault(); setCursor(0) }
    else if (event.key === 'End') { event.preventDefault(); setCursor(SORT_OPTIONS.length - 1) }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); commit(cursor) }
  }

  return (
    <div className="csort" ref={wrap} onKeyDown={onKeyDown}>
      <button
        type="button"
        className="csort__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => { setCursor(SORT_OPTIONS.findIndex((o) => o.id === sort)); setOpen((v) => !v) }}
      >
        <span className="csort__label">Ordenar</span>
        <span className="csort__value">{current.label}</span>
        <span className={`csort__caret ${open ? 'is-open' : ''}`} aria-hidden="true">{CHART}</span>
      </button>
      {open && (
        <ul className="csort__menu" id={listId} role="listbox" aria-label="Ordenar productos" tabIndex={-1}>
          {SORT_OPTIONS.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={option.id === sort}
              className={`csort__option ${option.id === sort ? 'is-selected' : ''} ${index === cursor ? 'is-cursor' : ''}`}
              onPointerEnter={() => setCursor(index)}
              onClick={() => commit(index)}
            >
              <span className="csort__tick" aria-hidden="true" />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Zona de control del catalogo. Solo recibe estado y callbacks:
 * el dataset y los productos los resuelve el contenedor, asi que
 * hombre y mujer nunca comparten productos ni filtros.
 */
export default function CatalogControls({ activeBrand, onBrand, search, onSearch, sort, onSort, resultCount, totalCount, isFiltered, onReset }) {
  return (
    <div className="ccontrols">
      <div className="ccontrols__head">
        <div className="ccontrols__brands">
          <span className="ccontrols__eyebrow" id="ccontrols-marca">Marca</span>
          <div className="crail" role="group" aria-labelledby="ccontrols-marca">
            {['todos', ...BRANDS].map((brand) => (
              <button
                type="button"
                key={brand}
                className={`crail__button ${activeBrand === brand ? 'is-selected' : ''}`}
                aria-pressed={activeBrand === brand}
                onClick={() => onBrand(brand)}
                onFocus={(event) => event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })}
              >
                {brand === 'todos' ? 'Todos' : brand}
              </button>
            ))}
          </div>
        </div>
        <div className="ccontrols__search">
          <label className="csearch" htmlFor="catalog-search">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
            <span className="sr-only">Buscar productos por nombre o marca</span>
            <input id="catalog-search" type="search" placeholder="Buscar productos" value={search} onChange={(event) => onSearch(event.target.value)} />
            {search !== '' && (
              <button type="button" className="csearch__clear" onClick={() => onSearch('')} aria-label="Borrar la búsqueda">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            )}
          </label>
        </div>
      </div>
      <div className="ccontrols__meta">
        <p className="ccount" role="status" aria-live="polite" aria-atomic="true">
          <strong>{resultCount}</strong> {resultCount === 1 ? 'modelo' : 'modelos'}
          {isFiltered && <span className="ccount__of"> de {totalCount}</span>}
        </p>
        <div className="ccontrols__tail">
          {isFiltered && (
            <button type="button" className="ccount__clear" onClick={onReset}>
              Limpiar filtros <span aria-hidden="true">×</span>
            </button>
          )}
          <SortSelect sort={sort} onSort={onSort} />
        </div>
      </div>
    </div>
  )
}
