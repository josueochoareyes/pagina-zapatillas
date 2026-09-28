import ProductVisual from './ProductVisual'
import { formatPrice } from '../data/products'
import { cartMessage, waLink } from '../lib/whatsapp'

export default function CartDrawer({ open, items, count, total, freeFrom, onClose, onChangeQty, onRemove, hidePrices = false }) {
  const missing = Math.max(0, freeFrom - total)
  const progress = Math.min(100, (total / freeFrom) * 100)

  return (
    <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
      <button className="drawer__backdrop" type="button" onClick={onClose} tabIndex={-1} aria-label="Cerrar carrito" />

      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Carrito">
        <header className="drawer__head">
          <h3>
            Tu carrito <span className="drawer__count">{count}</span>
          </h3>
          <button className="modal__close" type="button" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {!hidePrices && <div className="drawer__ship">
          {missing > 0 ? (
            <p>
              Te faltan <strong>{formatPrice(missing)}</strong> para el envío gratis
            </p>
          ) : (
            <p className="is-ok">¡Envío gratis conseguido!</p>
          )}
          <span className="ship__bar">
            <span className="ship__fill" style={{ width: `${progress}%` }} />
          </span>
        </div>}

        <div className="drawer__items">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <p>Tu carrito está vacío</p>
              <button className="btn btn--outline btn--sm" type="button" onClick={onClose}>
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <article className="line" key={item.key}>
                <div className="line__art" style={{ '--cw-base': item.color.base }}>
                  <ProductVisual product={item} colorway={item.color} className="line__sneaker" />
                </div>
                <div className="line__info">
                  <p className="line__brand">{item.brand}</p>
                  <h4 className="line__name">{item.name}</h4>
                  <p className="line__meta">
                    {item.color.name} · Talla {item.size}
                  </p>
                  <div className="line__bottom">
                    <div className="qty qty--sm">
                      <button type="button" onClick={() => onChangeQty(item.key, -1)} aria-label="Restar">
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => onChangeQty(item.key, 1)} aria-label="Sumar">
                        +
                      </button>
                    </div>
                    {!hidePrices && <p className="line__price">{formatPrice(item.price * item.qty)}</p>}
                  </div>
                </div>
                <button className="line__remove" type="button" onClick={() => onRemove(item.key)} aria-label={`Quitar ${item.name}`}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M6 7h12M10 7V5h4v2M9 7l.7 12h4.6L15 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </article>
            ))
          )}
        </div>

        <footer className="drawer__foot">
          <div className="drawer__totals">
            <span>{hidePrices ? 'Artículos seleccionados' : 'Subtotal'}</span>
            <strong>{hidePrices ? count : formatPrice(total)}</strong>
          </div>

          {items.length ? <a
            className="btn btn--wa btn--block"
            href={waLink(cartMessage(items))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.5 3.68 1.4 5.2L2 22l5.1-1.6a9.8 9.8 0 004.94 1.32h.01c5.43 0 9.84-4.4 9.84-9.84C21.9 6.4 17.47 2 12.04 2zm0 17.9h-.01a8.2 8.2 0 01-4.16-1.14l-.3-.18-3.08.96.98-3-.19-.31a8.13 8.13 0 01-1.25-4.33c0-4.5 3.68-8.17 8.2-8.17 2.19 0 4.25.86 5.8 2.41a8.13 8.13 0 012.4 5.79c0 4.51-3.68 8.17-8.19 8.17zm4.5-6.12c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.17 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.29z" />
            </svg>
            Confirmar pedido por WhatsApp
          </a> : <button className="btn btn--wa btn--block" disabled>Confirmar pedido por WhatsApp</button>}
        </footer>
      </aside>
    </div>
  )
}
