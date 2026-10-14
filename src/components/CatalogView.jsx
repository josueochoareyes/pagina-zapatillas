import CatalogHeader from './CatalogHeader'
import CatalogControls from './CatalogControls'
import ProductGrid from './ProductGrid'
import { brandsForCatalog } from '../data/catalogs'

export default function CatalogView({ collection, resultCount, sort, onSort, onBack, onCollection, search, onSearch, activeBrand, onBrand, activeType = 'todos', onType, onReset, gridProps }) {
  const isFiltered = activeBrand !== 'todos' || activeType !== 'todos' || search.trim() !== ''
  // Firma del filtro: al cambiarla se remonta la rejilla y las tarjetas
  // repiten su entrada (fade + translate) sin recargar la pagina.
  const signature = `${collection.id}|${activeBrand}|${activeType}|${sort}|${search.trim()}`
  return (
    <section className={`product-catalog product-catalog--${collection.id}`} id="catalogo" aria-label={`Catálogo ${collection.label}`}>
      <div className="product-catalog__shell">
        <CatalogHeader collection={collection} onBack={onBack} onCollection={onCollection} />
        {(collection.id.startsWith('ropa-') || collection.id === 'accesorios') && <div className="catalog-types" role="group" aria-label="Tipo de producto">
          {['todos', ...new Set(collection.products.map(p => p.type))].map(type => <button key={type} type="button" className={`crail__button ${activeType === type ? 'is-selected' : ''}`} aria-pressed={activeType === type} onClick={() => onType(type)}>{type === 'todos' ? 'Todos los tipos' : type}</button>)}
        </div>}
        <CatalogControls
          brands={brandsForCatalog(collection.products)}
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
