import ProductGrid from './ProductGrid'
import { useState } from 'react'
import { favoritesMessage, waLink } from '../lib/whatsapp'

export default function FavoritesView({ gridProps, onExplore }) {
  const [selected, setSelected] = useState(new Set())
  const chosen = gridProps.products.filter(product => selected.has(product.id))
  const allSelected = chosen.length === gridProps.products.length && chosen.length > 0
  const toggleSelection = id => setSelected(previous => {
    const next = new Set(previous)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  return (
    <section className="product-catalog favorites-view" aria-labelledby="favorites-title">
      <div className="product-catalog__shell">
        <header className="product-catalog__header">
          <button type="button" className="product-catalog__back" onClick={onExplore}>← Colecciones</button>
          <div className="product-catalog__intro"><div><h1 id="favorites-title">Tus <span>favoritos</span></h1><p className="product-catalog__description">Los modelos que van contigo, en un solo lugar.</p></div><p>{gridProps.products.length} guardados</p></div>
        </header>
        {gridProps.products.length ? <>
          <div className="favorites-selection">
            <label><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(gridProps.products.map(p => p.id)))} /> Seleccionar todos</label>
            <span role="status">{chosen.length} seleccionados</span>
            {chosen.length ? <a className="btn btn--wa" href={waLink(favoritesMessage(chosen))} target="_blank" rel="noopener noreferrer">Consultar seleccionados por WhatsApp</a> : <button className="btn btn--wa" disabled>Consultar seleccionados por WhatsApp</button>}
          </div>
          <ProductGrid {...gridProps} selected={selected} onSelect={toggleSelection} onToggleWish={id => {
            setSelected(previous => { const next = new Set(previous); next.delete(id); return next })
            gridProps.onToggleWish(id)
          }} />
        </> : <div className="catalog-empty"><h2>Tu próximo par está por descubrir.</h2><p>Toca el corazón de una zapatilla para guardarla aquí.</p><button type="button" className="btn btn--primary" onClick={onExplore}>Explorar colecciones</button></div>}
      </div>
    </section>
  )
}
