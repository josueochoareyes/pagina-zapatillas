import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import EditFeature from './components/EditFeature'
import Values from './components/Values'
import CollectionPicker from './components/CollectionPicker'
import CatalogView from './components/CatalogView'
import About from './components/About'
import FavoritesView from './components/FavoritesView'
import ProductModal from './components/ProductModal'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import { PRODUCTS } from './data/products'
import { CATALOGS, filterCatalog } from './data/catalogs'
import { useStoreNavigation } from './lib/useStoreNavigation'
import { usePersistentCart, usePersistentWishes } from './lib/useStore'
import { generalMessage } from './lib/whatsapp'

const FREE_SHIPPING_FROM = 120

const PRODUCT_INDEX = new Map(PRODUCTS.map((p) => [p.id, p]))

export default function App() {
  const { stage, category, setStage, openCollection } = useStoreNavigation()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('destacados')
  const [activeBrand, setActiveBrand] = useState('todos')
  const [modalId, setModalId] = useState(null)
  const [modalColorIndex, setModalColorIndex] = useState(0)
  const { cart, addLine, changeQty, removeLine } = usePersistentCart(PRODUCT_INDEX)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const { wishes, toggleWish } = usePersistentWishes(PRODUCT_INDEX)
  const [menuOpen, setMenuOpen] = useState(false)

  const collection = CATALOGS[category]

  useEffect(() => {
    setActiveBrand('todos')
    setSearch('')
    setSort('destacados')
  }, [category])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [stage, category])

  const visible = useMemo(() => filterCatalog(collection.products, { brand: activeBrand, search, sort }), [collection, activeBrand, search, sort])

  const modalProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === modalId) || null,
    [modalId]
  )

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart])
  const wishCount = wishes.size

  useEffect(() => {
    document.body.classList.toggle('is-locked', cartOpen || Boolean(modalId) || menuOpen)
    return () => document.body.classList.remove('is-locked')
  }, [cartOpen, modalId, menuOpen])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setModalId(null)
        setCartOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const addToCart = (product, colorIndex, size, qty = 1) => {
    addLine(product, colorIndex, size, qty)
    setModalId(null)
    setToast({ text: `${product.name} añadido al carrito`, tone: 'ok' })
  }

  const resetFilters = () => {
    setSearch('')
    setActiveBrand('todos')
  }

  const goCollection = (id) => {
    resetFilters()
    setSort('destacados')
    openCollection(id)
  }

  const navigate = (target) => {
    if (['novedades', 'ofertas', 'nuevos', 'top', 'limitadas'].includes(target)) {
      resetFilters()
      setSort(['novedades', 'nuevos'].includes(target) ? 'novedades' : 'destacados')
      setStage('catalog')
      return
    }
    if (target === 'ventajas') {
      setStage('home')
      requestAnimationFrame(() => {
        requestAnimationFrame(() =>
          document.getElementById('ventajas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        )
      })
      return
    }
    if (target === 'hombre' || target === 'mujer') {
      goCollection(target)
      return
    }
    if (target === 'catalogo') {
      setStage('picker')
      return
    }
    if (target === 'nosotros') {
      setStage('about')
      return
    }
    if (target === 'inicio') {
      setStage('home')
      return
    }
    setStage('home')
  }

  const openProduct = (id, colorIndex = 0) => {
    setModalColorIndex(colorIndex)
    setModalId(id)
  }
  const gridProps = {
    products: visible,
    wishes,
    onToggleWish: toggleWish,
    onOpen: openProduct,
    onQuickAdd: (p, ci) => openProduct(p.id, ci),
  }

  const isCatalog = stage === 'catalog' || stage === 'favorites'
  // Buscador, favoritos y carrito solo existen dentro de /catalogo/hombre y
  // /catalogo/mujer. En el resto de la tienda el navbar es solo navegación.
  const showStoreActions = stage === 'catalog' || stage === 'favorites'

  return (
    <div className={`app ${isCatalog ? 'app--catalog' : ''} ${stage === 'about' ? 'app--about' : ''}`}>
      <Header
        cartCount={cartCount}
        wishCount={wishCount}
        showStoreActions={showStoreActions}
        onOpenCart={() => { setMenuOpen(false); setCartOpen(true) }}
        onOpenWish={() => { setMenuOpen(false); setStage('favorites') }}
        onNavigate={navigate}
        onSearch={() => {
          setMenuOpen(false)
          if (stage !== 'catalog') setStage('catalog')
          requestAnimationFrame(() => {
            document.getElementById('catalog-search')?.focus()
          })
        }}
        menuOpen={menuOpen}
        onToggleMenu={(val) => setMenuOpen(val ?? !menuOpen)}
        stage={stage}
      />

      <main>
        {stage === 'home' && (
          <>
            <Hero onExplore={() => setStage('picker')} />
            <EditFeature onExplore={() => setStage('picker')} />
            <Values />
          </>
        )}

        {stage === 'picker' && (
          <CollectionPicker onPick={goCollection} />
        )}

        {stage === 'catalog' && (
          <CatalogView
            collection={collection}
            resultCount={visible.length}
            sort={sort}
            onSort={setSort}
            onBack={() => setStage('picker')}
            onCollection={goCollection}
            search={search}
            onSearch={setSearch}
            activeBrand={activeBrand}
            onBrand={setActiveBrand}
            onReset={resetFilters}
            gridProps={gridProps}
          />
        )}

        {stage === 'favorites' && <FavoritesView gridProps={{ ...gridProps, products: PRODUCTS.filter((product) => wishes.has(product.id)) }} onExplore={() => setStage('picker')} />}

        {stage === 'about' && <About onNavigate={navigate} />}
      </main>

      {/* El pie se omite en /catalogo: la vista cierra con las dos cards. */}
      {stage !== 'picker' && <Footer onNavigate={navigate} />}

      <ProductModal
        key={modalId ?? 'closed'}
        hidePrices={isCatalog}
        product={modalProduct}
        initialColorIndex={modalColorIndex}
        wished={modalProduct ? wishes.has(modalProduct.id) : false}
        onToggleWish={toggleWish}
        onClose={() => setModalId(null)}
        onAdd={addToCart}
      />

      <CartDrawer
        hidePrices={isCatalog}
        open={cartOpen}
        items={cart}
        count={cartCount}
        total={cartTotal}
        freeFrom={FREE_SHIPPING_FROM}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeLine}
      />

      <div className={`toast ${toast ? 'toast--on' : ''}`} role="status" aria-live="polite">
        <span className="toast__dot" />
        {toast?.text ?? ''}
      </div>

      <WhatsAppFab message={generalMessage()} />
    </div>
  )
}
