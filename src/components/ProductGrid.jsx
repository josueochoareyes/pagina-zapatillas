import ProductCard from './ProductCard'

export default function ProductGrid({ products, wishes, onToggleWish, onOpen, onQuickAdd, onReset, selected, onSelect }) {
  if (!products.length) return (
    <div className="catalog-empty">
      <span className="catalog-empty__mark" aria-hidden="true">↗</span>
      <h2>No encontramos zapatillas con estos filtros.</h2>
      <p>Prueba con otro nombre o descubre todas las marcas de esta colección.</p>
      <button type="button" className="btn btn--primary" onClick={onReset}>Limpiar filtros</button>
    </div>
  )
  return (
    <div className="product-grid">
      {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} wished={wishes.has(product.id)} onToggleWish={onToggleWish} onOpen={onOpen} onQuickAdd={onQuickAdd} selected={selected?.has(product.id)} onSelect={onSelect} />)}
    </div>
  )
}
