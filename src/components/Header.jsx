import { useEffect, useState } from 'react'
import MobileMenu from './MobileMenu'

const LINKS = [
  { label: 'Inicio', go: 'inicio' },
  { label: 'Catálogo', go: 'catalogo' },
  { label: 'Nosotros', go: 'nosotros' },
]

const HREF = {
  inicio: '#top',
  catalogo: '#catalogo',
  nosotros: '#nosotros',
}

export default function Header({
  cartCount,
  wishCount,
  showStoreActions = false,
  onOpenCart,
  onOpenWish,
  onNavigate,
  onSearch,
  menuOpen,
  onToggleMenu,
  stage = 'home',
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isOn = (go) => {
    if (go === 'inicio') return stage === 'home'
    if (go === 'catalogo') return stage === 'picker' || stage === 'catalog' || stage === 'favorites'
    if (go === 'nosotros') return stage === 'about'
    return false
  }

  return (
    <div className={`masthead ${scrolled ? 'masthead--solid' : ''} ${menuOpen ? 'masthead--menu' : ''}`}>
      <header className="bar">
        <div className="shell bar__inner">
          <a
            className="logo"
            href="#top"
            aria-label="C &amp; E Store, inicio"
            onClick={(e) => {
              e.preventDefault()
              onToggleMenu?.(false)
              onNavigate('inicio')
            }}
          >
            <span className="logo__mark">C&amp;E</span>
            <span className="logo__sub">Store</span>
          </a>

          <nav className="nav" aria-label="Principal">
            {LINKS.map((l) => (
              <a
                key={l.go}
                className={`nav__link ${isOn(l.go) ? 'is-on' : ''}`}
                href={HREF[l.go]}
                aria-current={isOn(l.go) ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  onToggleMenu?.(false)
                  onNavigate(l.go)
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="bar__actions">
            {/* Búsqueda, favoritos y carrito únicamente dentro del catálogo. */}
            {showStoreActions && (
              <>
                <button className="iconbtn" type="button" aria-label="Buscar en el catálogo" onClick={onSearch}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="M16 16l4.5 4.5" strokeLinecap="round" />
                  </svg>
                </button>

                <button className="iconbtn iconbtn--count" type="button" aria-label={`Favoritos, ${wishCount} guardados`} onClick={onOpenWish}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0112 8.2a4.1 4.1 0 017.5 2.4C19.5 15.6 12 20 12 20z" strokeLinejoin="round" />
                  </svg>
                  {wishCount > 0 && <span className="iconbtn__count">{wishCount}</span>}
                </button>

                <button className="iconbtn iconbtn--count" type="button" aria-label={`Carrito, ${cartCount} artículos`} onClick={onOpenCart}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M4.6 8h14.8l-1.3 10.4a1.8 1.8 0 01-1.8 1.6H7.7a1.8 1.8 0 01-1.8-1.6L4.6 8z" strokeLinejoin="round" />
                    <path d="M9.2 8V6.4a2.8 2.8 0 015.6 0V8" strokeLinecap="round" />
                  </svg>
                  {cartCount > 0 && <span className="iconbtn__count">{cartCount}</span>}
                </button>
              </>
            )}

            <button
              className="iconbtn iconbtn--burger"
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              onClick={() => onToggleMenu?.()}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        hidePrices={stage === 'catalog' || stage === 'favorites'}
        showWishCount={showStoreActions}
        open={menuOpen}
        onNavigate={onNavigate}
        onClose={() => onToggleMenu?.(false)}
        wishCount={wishCount}
      />
    </div>
  )
}
