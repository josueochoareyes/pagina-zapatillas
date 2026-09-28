import { WHATSAPP_DISPLAY, generalMessage, waLink } from '../lib/whatsapp'
import StoreLink from './StoreLink'

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.5 3.68 1.4 5.2L2 22l5.1-1.6a9.8 9.8 0 004.94 1.32h.01c5.43 0 9.84-4.4 9.84-9.84C21.9 6.4 17.47 2 12.04 2zm0 17.9h-.01a8.2 8.2 0 01-4.16-1.14l-.3-.18-3.08.96.98-3-.19-.31a8.13 8.13 0 01-1.25-4.33c0-4.5 3.68-8.17 8.2-8.17 2.19 0 4.25.86 5.8 2.41a8.13 8.13 0 012.4 5.79c0 4.51-3.68 8.17-8.19 8.17zm4.5-6.12c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.17 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.29z" />
  </svg>
)

const COLLECTIONS = [
  ['Catálogo', '/catalogo', 'catalogo'],
  ['Hombre',   '/catalogo/hombre', 'hombre'],
  ['Mujer',    '/catalogo/mujer',  'mujer'],
]

const STORE_LINKS = [
  ['Inicio',    '/',          'inicio'],
  ['Nosotros',  '/nosotros',  'nosotros'],
]

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" aria-label="Pie de página">

      {/* ── CUERPO PRINCIPAL ── */}
      <div className="footer__body">
        <div className="shell footer__grid">

          {/* COLUMNA 1 — Branding */}
          <div className="footer__brand">
            <p className="footer__wordmark" aria-label="C&E Store">C&amp;E<span>STORE</span></p>
            <p className="footer__tagline">
              Las marcas que conoces.
              <br />
              <em>El estilo que buscas.</em>
            </p>
            <p className="footer__sub">Tienda multimarca de zapatillas.</p>

            {/* CTA WhatsApp */}
            <a
              className="footer__wa"
              href={waLink(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contactar por WhatsApp al ${WHATSAPP_DISPLAY}`}
            >
              <span className="footer__wa-icon">{WA_ICON}</span>
              <span className="footer__wa-body">
                <span className="footer__wa-label">¿Necesitas ayuda?</span>
                <span className="footer__wa-sub">Escríbenos por WhatsApp</span>
                <span className="footer__wa-num">{WHATSAPP_DISPLAY}</span>
              </span>
              <span className="footer__wa-arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          {/* COLUMNA 2 — Colecciones */}
          <nav className="footer__col" aria-label="Colecciones">
            <h4 className="footer__col-title">Colecciones</h4>
            <ul>
              {COLLECTIONS.map(([label, href, dest]) => (
                <li key={dest}>
                  <StoreLink
                    className="footer__link"
                    href={href}
                    destination={dest}
                    onNavigate={onNavigate}
                  >
                    <span>{label}</span>
                    <span className="footer__link-arrow" aria-hidden="true">→</span>
                  </StoreLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMNA 3 — C&E Store */}
          <nav className="footer__col" aria-label="C&E Store">
            <h4 className="footer__col-title">C&amp;E Store</h4>
            <ul>
              {STORE_LINKS.map(([label, href, dest]) => (
                <li key={dest}>
                  <StoreLink
                    className="footer__link"
                    href={href}
                    destination={dest}
                    onNavigate={onNavigate}
                  >
                    <span>{label}</span>
                    <span className="footer__link-arrow" aria-hidden="true">→</span>
                  </StoreLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Texto editorial de fondo */}
        <p className="footer__ghost" aria-hidden="true">C&amp;E</p>
      </div>

      {/* ── BARRA INFERIOR ── */}
      <div className="footer__bar">
        <div className="shell footer__bar-inner">
          <p className="footer__copy">
            © {new Date().getFullYear()} C&amp;E Store · Todos los derechos reservados.
          </p>
          <p className="footer__claim">
            Zapatillas. Marcas. <em>Tu estilo.</em>
          </p>
        </div>
      </div>

    </footer>
  )
}
