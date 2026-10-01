import { BENEFITS } from './Benefits'
import { WHATSAPP_DISPLAY, generalMessage, waLink } from '../lib/whatsapp'

const LINKS = [
  { label: 'Inicio', go: 'inicio' },
  { label: 'Catálogo', go: 'catalogo', kids: true },
  { label: 'Nosotros', go: 'nosotros' },
]

const KIDS = [
  { label: 'Hombre', go: 'hombre', note: 'Zapatillas con carácter deportivo' },
  { label: 'Accesorios', go: 'accesorios', note: 'Mochilas y balones para cada día' },
  { label: 'Mujer', go: 'mujer', note: 'Diseño para cada movimiento' },
]

/** Menú móvil a pantalla completa, con tipografía editorial. */
export default function MobileMenu({ open, onNavigate, onClose, wishCount, hidePrices = false, showWishCount = false }) {
  if (!open) return null

  const go = (target) => {
    onClose()
    onNavigate(target)
  }

  return (
    <div className="mnav" role="dialog" aria-modal="true" aria-label="Menú">
      <nav className="mnav__nav">
        <ul className="mnav__list">
          {LINKS.map((l, i) => (
            <li className="mnav__item" key={l.go} style={{ '--i': i }}>
              <a
                className="mnav__link"
                href="#top"
                onClick={(e) => {
                  e.preventDefault()
                  go(l.go)
                }}
              >
                {l.label}
              </a>

              {l.kids && (
                <ul className="mnav__kids">
                  {KIDS.map((k) => (
                    <li key={k.go}>
                      <a
                        className="mnav__kid"
                        href="#catalogo"
                        onClick={(e) => {
                          e.preventDefault()
                          go(k.go)
                        }}
                      >
                        <span>{k.label}</span>
                        <em>{k.note}</em>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mnav__foot">
        <ul className="mnav__perks">
          {BENEFITS.map((b) => (
            <li key={b.id}>
              {b.label}
              <em>{hidePrices && b.id === 'envio' ? 'Consulta las opciones de envío' : b.note}</em>
            </li>
          ))}
        </ul>

        <div className="mnav__meta">
          {showWishCount && (
            <span>
              Favoritos <strong>{wishCount}</strong>
            </span>
          )}
          <a href={waLink(generalMessage())} target="_blank" rel="noopener noreferrer">
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  )
}
