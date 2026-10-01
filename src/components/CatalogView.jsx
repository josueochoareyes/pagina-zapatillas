import CatalogHeader from './CatalogHeader'
import CatalogControls from './CatalogControls'
import ProductGrid from './ProductGrid'

export default function CatalogView({ collection, resultCount, sort, onSort, onBack, onCollection, search, onSearch, activeBrand, onBrand, onReset, gridProps }) {
  const isFiltered = activeBrand !== 'todos' || search.trim() !== ''
  // Firma del filtro: al cambiarla se remonta la rejilla y las tarjetas
  // repiten su entrada (fade + translate) sin recargar la pagina.
  const signature = `${collection.id}|${activeBrand}|${sort}|${search.trim()}`
  return (
    <section className={`product-catalog product-catalog--${collection.id}`} id="catalogo" aria-label={`Catálogo ${collection.label}`}>
      <div className="product-catalog__shell">
        <CatalogHeader collection={collection} onBack={onBack} onCollection={onCollection} />
        <CatalogControls
          activeBrand={activeBrand}
          onBrand={onBrand}
          search={search}
          onSearch={onSearch}
          sort={sort}
          onSort={onSort}
          resultCount={resultCount}
          totalCount={collection.products.length}
          isFiltered={isFiltered}
          onReset={onReset}
        />
        <ProductGrid key={signature} {...gridProps} onReset={onReset} />
        <p className="product-catalog__note">Consulta disponibilidad y detalles de cada modelo por WhatsApp.</p>
      </div>
    </section>
  )
}
