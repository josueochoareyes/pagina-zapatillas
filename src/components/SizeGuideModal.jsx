import { useEffect, useRef } from 'react'
import { SIZE_GUIDES } from '../data/sizeGuides'

/**
 * Modal de GUÍA DE TALLAS.
 *
 * No contiene datos: los lee de `data/sizeGuides.js`, que es el único archivo
 * donde se editan las equivalencias. `guide` decide si la tabla es la
 * masculina o la femenina; cada producto abre la de su colección.
 *
 * Las columnas no están fijas en el componente: llegan desde la configuración,
 * de modo que añadir o quitar una equivalencia es un cambio de datos, no de JSX.
 */

const cellValue = (row, col) => {
  const value = row[col.key]
  if (value == null) return '—'
  if (col.unit === 'cm') return `${value} cm`
  return String(value)
}

export default function SizeGuideModal({ guide = 'men', open, onClose }) {
  const closeRef = useRef(null)
  const data = SIZE_GUIDES[guide] ?? SIZE_GUIDES.men

  // Escape cierra SOLO la guía. El listener global de App.jsx también escucha en
  // window, así que stopPropagation no basta: se usa stopImmediatePropagation para
  // que el evento no alcance los handlers registrados antes.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopImmediatePropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  // Al abrir, el foco entra en la guía; al cerrar, vuelve al botón que la abrió.
  useEffect(() => {
    if (!open) return
    const returnTo = document.activeElement
    closeRef.current?.focus()
    return () => {
      // isConnected evita intentar enfocar un nodo ya desmontado si el modal
      // exterior se cerró antes que la guía.
      if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus()
    }
  }, [open, guide])

  if (!open) return null

  return (
    <div className="sguide" role="dialog" aria-modal="true" aria-label={data.title}>
      <button className="sguide__backdrop" type="button" onClick={onClose} tabIndex={-1} aria-label="Cerrar guía de tallas" />

      <div className="sguide__panel">
        <header className="sguide__head">
          <div className="sguide__headtext">
            <span className="sguide__eyebrow">{data.eyebrow}</span>
            <h2 className="sguide__title">{data.title}</h2>
          </div>
          <button className="sguide__close" type="button" onClick={onClose} aria-label="Cerrar guía de tallas" ref={closeRef}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="sguide__body">
          <p className="sguide__intro">{data.intro}</p>

          <div className="sguide__scroller" tabIndex={0} role="region" aria-label="Tabla de equivalencias de tallas">
            <table className="sguide__table">
              <caption className="sguide__caption">
                Equivalencias de talla {data.eyebrow.toLowerCase()}: talla peruana, talla estadounidense y largo del pie en centímetros.
              </caption>
              <thead>
                <tr>
                  {data.columns.map((col) => (
                    <th key={col.key} scope="col" className={col.primary ? 'is-primary' : undefined}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    {data.columns.map((col) => (
                      <td key={col.key} className={col.primary ? 'is-primary' : undefined}>
                        {cellValue(row, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="sguide__note">{data.note}</p>
        </div>
      </div>
    </div>
  )
}
