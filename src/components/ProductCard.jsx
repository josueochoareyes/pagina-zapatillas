import { useState } from 'react'
import { swatchBackground } from '../lib/swatch'
import ProductVisual from './ProductVisual'
import { useReveal } from '../lib/useReveal'

export default function ProductCard({ product, index, wished, onToggleWish, onOpen, onQuickAdd, selected, onSelect }) {
  const [colorIndex, setColorIndex] = useState(0)
  const [ref, visible] = useReveal({ rootMargin: '0px 0px 40px 0px' })
  const colorway = product.colors[colorIndex]
  return (
    <article ref={ref} className={`product-card ${visible ? 'is-visible' : ''}`} data-product-id={product.id} data-category={product.category} data-brand={product.brand} style={{ '--enter-delay': `${(index % 4) * 35}ms` }}>
      <div className="product-card__visual">
        <button type="button" className="product-card__image-link" onClick={() => onOpen(product.id, colorIndex)} aria-label={`Ver detalles de ${product.name}`}>
          <ProductVisual product={product} colorway={colorway} className="product-card__image" loading={index < 4 ? 'eager' : 'lazy'} />
        </button>
        <button className={`product-card__wish ${wished ? 'is-selected' : ''}`} type="button" onClick={() => onToggleWish(product.id)} aria-label={`${wished ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`} aria-pressed={wished}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 20s-8-4.8-8-10a4.4 4.4 0 018-2.4A4.4 4.4 0 0120 10c0 5.2-8 10-8 10z" /></svg>
        </button>
      </div>
      <div className="product-card__body">
        {onSelect && <label className="favorite-select"><input type="checkbox" checked={Boolean(selected)} onChange={() => onSelect(product.id)} aria-label={`Seleccionar ${product.brand} ${product.name}`} /> Seleccionar para consultar</label>}
        <p className="product-card__brand">{product.brand || 'Marca por confirmar'}</p>
        <h2 className="product-card__name"><button type="button" onClick={() => onOpen(product.id, colorIndex)}>{product.name}</button></h2>
        <div className="product-card__colors">
          <span>{product.colors.length} {product.colors.length === 1 ? 'color' : 'colores'}</span>
          <div className="product-card__swatches" role="group" aria-label={`Colores de ${product.name}`}>
            {product.colors.map((color, i) => (
              <button
                type="button"
                key={color.name}
                className={i === colorIndex ? 'is-selected' : ''}
                onPointerEnter={(event) => { if (event.pointerType !== 'touch') setColorIndex(i) }}
                onFocus={() => setColorIndex(i)}
                onClick={() => setColorIndex(i)}
                aria-label={`Ver color ${color.name}`}
                aria-pressed={i === colorIndex}
                title={color.name}
              >
                <span style={{ background: swatchBackground(color) }} />
              </button>
            ))}
          </div>
        </div>
        <div className="product-card__actions">
          <button className="product-card__details" type="button" onClick={() => onOpen(product.id, colorIndex)}>Ver zapatilla <span aria-hidden="true">→</span></button>
          <button className="product-card__add" type="button" onClick={() => onQuickAdd(product, colorIndex)} aria-label={`Añadir ${product.name} al carrito`} title="Añadir al carrito">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 016 0v2M9 14h6m-3-3v6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </article>
  )
}
