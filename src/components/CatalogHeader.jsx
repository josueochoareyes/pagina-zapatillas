import { CATEGORIES } from '../data/products'
export default function CatalogHeader({ collection, onBack, onCollection }) {
  return (
    <header className="product-catalog__header">
      <div className="product-catalog__navigation">
        <button type="button" className="product-catalog__back" onClick={onBack}><span aria-hidden="true">←</span> Colecciones</button>
        <nav aria-label="Cambiar colección" className="collection-switch">
          {CATEGORIES.map(({ id, label }) => (
            <button key={id} type="button" aria-current={collection.id === id ? 'page' : undefined} onClick={() => onCollection(id)}>
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="product-catalog__intro">
        <div>
          <p className="product-catalog__eyebrow">C&amp;E / {new Date().getFullYear()}</p>
          <h1>Colección <span>{collection.label}</span></h1>
          <p className="product-catalog__description">{collection.description}</p>
        </div>
        <p className="product-catalog__editorial">{collection.editorial}<span>{collection.products.length} modelos para descubrir</span></p>
      </div>
    </header>
  )
}
