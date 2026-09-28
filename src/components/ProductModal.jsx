import { swatchBackground } from '../lib/swatch'
import { useEffect, useState } from 'react'
import ProductVisual from './ProductVisual'
import SizeGuideModal from './SizeGuideModal'
import { formatPrice, sizeListFor } from '../data/products'
import { guideKeyFor } from '../data/sizeGuides'
import { productMessage, waLink } from '../lib/whatsapp'

export default function ProductModal({ product, wished, onToggleWish, onClose, onAdd, hidePrices = false, initialColorIndex = 0 }) {
  const [colorIndex, setColorIndex] = useState(initialColorIndex)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    if (product) {
      setColorIndex(initialColorIndex)
      setSize(null)
      setQty(1)
      setSizeError(false)
      setGuideOpen(false)
    }
  }, [product, initialColorIndex])

  if (!product) return null

  const colorway = product.colors[colorIndex]
  const run = [...new Set([...sizeListFor(product.category), ...(product.sizes ?? [])])].sort((a, b) => Number(a) - Number(b))
  const sizes = product.sizes ?? run
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const submit = () => {
    if (!size) {
      setSizeError(true)
      return
    }
    onAdd(product, colorIndex, size, qty)
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="modal__backdrop" type="button" onClick={onClose} aria-label="Cerrar" />

      <div className="modal__panel" style={{ '--cw-base': colorway.base, '--cw-accent': colorway.accent }}>
        <button className="modal__close" type="button" onClick={onClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="modal__media">
          <span className="modal__glow" aria-hidden="true" />
          <span className="modal__grid" aria-hidden="true" />

          <div className="modal__art" key={colorway.name}>
            <ProductVisual product={product} className="modal__sneaker" colorway={colorway} />
          </div>

          <div className="modal__thumbs">
            {product.colors.map((cw, i) => (
              <button
                key={cw.name}
                type="button"
                className={`thumb ${i === colorIndex ? 'is-on' : ''}`}
                onClick={() => setColorIndex(i)}
                style={{ '--c': cw.swatch, '--c2': cw.base }}
                aria-label={cw.name}
                aria-pressed={i === colorIndex}
              >
                <ProductVisual product={product} colorway={cw} className="thumb__art" />
              </button>
            ))}
          </div>
        </div>

        <div className="modal__info">
          <p className="modal__brand">{product.brand || 'Marca por confirmar'}</p>
          <h3 className="modal__name">{product.name}</h3>
          <p className="modal__type">{product.type}</p>

          {!hidePrices && <div className="modal__price">
            {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
            <strong>{formatPrice(product.price)}</strong>
            {discount > 0 && <span className="chip chip--sale">Ahorras {discount}%</span>}
          </div>}

          <div className="field">
            <p className="field__label">
              Color · <strong>{colorway.name}</strong>
            </p>
            <div className="swatches swatches--lg" role="group" aria-label="Elige color">
              {product.colors.map((cw, i) => (
                <button
                  key={cw.name}
                  type="button"
                  className={`swatch swatch--ring ${i === colorIndex ? 'is-on' : ''}`}
                  style={{ background: swatchBackground(cw) }}
                  onClick={() => setColorIndex(i)}
                  title={cw.name}
                  aria-label={cw.name}
                  aria-pressed={i === colorIndex}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <div className="field__labelrow">
              <p className="field__label">Talla</p>
              <button className="sizeguide__link" type="button" onClick={() => setGuideOpen(true)}>
                Guía de tallas
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="sizes" role="group" aria-label="Elige talla">
              {run.map((s) => {
                const out = !sizes.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    className={`size ${size === s ? 'is-on' : ''} ${out ? 'is-out' : ''}`}
                    onClick={() => {
                      if (out) return
                      setSize(s)
                      setSizeError(false)
                    }}
                    aria-pressed={size === s}
                    disabled={out}
                    title={out ? 'Talla agotada' : undefined}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            {sizeError && <p className="field__error">Selecciona una talla para continuar</p>}
          </div>

          <div className="field field--row">
            <div>
              <p className="field__label">Cantidad</p>
              <div className="qty">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar uno">
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Sumar uno">
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              className={`btn btn--icon ${wished ? 'is-on' : ''}`}
              onClick={() => onToggleWish(product.id)}
              aria-pressed={wished}
              aria-label="Favorito"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7">
                <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0112 7.6a4.4 4.4 0 017.5 2.8C19.5 15.4 12 20 12 20z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <button className="btn btn--gold btn--block" type="button" onClick={submit}>
            Añadir al carrito{!hidePrices && ` · ${formatPrice(product.price * qty)}`}
          </button>

          <a
            className="btn btn--wa btn--block"
            href={waLink(productMessage(product, colorway, size, !hidePrices))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.5 3.68 1.4 5.2L2 22l5.1-1.6a9.8 9.8 0 004.94 1.32h.01c5.43 0 9.84-4.4 9.84-9.84C21.9 6.4 17.47 2 12.04 2zm0 17.9h-.01a8.2 8.2 0 01-4.16-1.14l-.3-.18-3.08.96.98-3-.19-.31a8.13 8.13 0 01-1.25-4.33c0-4.5 3.68-8.17 8.2-8.17 2.19 0 4.25.86 5.8 2.41a8.13 8.13 0 012.4 5.79c0 4.51-3.68 8.17-8.19 8.17zm4.5-6.12c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.17 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.29z" />
            </svg>
            Consultar por WhatsApp
          </a>

            <ul className="modal__perks">
              <li>{hidePrices ? 'Consulta las opciones de envío' : 'Envío gratis desde 35€'}</li>
            </ul>
        </div>
      </div>

      {/* Guía de tallas: la tabla depende de la colección del producto. */}
      <SizeGuideModal guide={guideKeyFor(product.category)} open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  )
}
