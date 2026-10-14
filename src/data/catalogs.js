import { menProducts, womenProducts, accessoryProducts, clothingProducts } from './inventory.js'

export const BRANDS = [...new Set(['Nike', 'Adidas', 'Puma',
  ...[...menProducts, ...womenProducts, ...accessoryProducts, ...clothingProducts].map(product => product.brand),
])]

// Preserve the store's brand order, but expose only this collection's inventory.
export const brandsForCatalog = products => BRANDS.filter(brand => products.some(product => product.brand === brand))

export const CATALOGS = {
  'ropa-hombre': { id: 'ropa-hombre', label: 'Ropa · Hombre', description: 'Casacas, conjuntos, poleras y polos para tu día a día.', editorial: 'Viste a tu manera.', products: clothingProducts.filter(p => p.category === 'ropa-hombre') },
  'ropa-mujer': { id: 'ropa-mujer', label: 'Ropa · Mujer', description: 'Descubre casacas, conjuntos, pantalones, poleras y tops.', editorial: 'Tu estilo en cada prenda.', products: clothingProducts.filter(p => p.category === 'ropa-mujer') },
  accesorios: { id: 'accesorios', label: 'Accesorios', description: 'Gorros, mochilas, bolsos y balones para acompañarte cada día.', editorial: 'Completa tu estilo.', products: accessoryProducts },
  hombre: {
    id: 'hombre',
    label: 'Hombre',
    description: 'Una selección diseñada para moverte a tu manera.',
    editorial: 'El ritmo lo marcas tú.',
    products: menProducts,
  },
  mujer: {
    id: 'mujer',
    label: 'Mujer',
    description: 'Diseño, comodidad y estilo para cada movimiento.',
    editorial: 'Cada paso, muy tuyo.',
    products: womenProducts,
  },
}

export const SORT_OPTIONS = [
  { id: 'destacados', label: 'Destacados' },
  { id: 'novedades', label: 'Más recientes' },
  { id: 'nombre-asc', label: 'Nombre A-Z' },
  { id: 'nombre-desc', label: 'Nombre Z-A' },
]

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()
const compareNames = (a, b) => a.name.localeCompare(b.name, 'es')
// Los productos ya no llevan rating, reviews ni badge: son datos ficticios y
// la tienda no muestra valoraciones. "Destacados" mantiene el orden del
// catálogo (su orden editorial) y "Más recientes" ordena por id.
const SORTS = {
  destacados: () => 0,
  novedades: (a, b) => b.id.localeCompare(a.id),
  'nombre-asc': compareNames,
  'nombre-desc': (a, b) => compareNames(b, a),
}

/** Receives a single collection; never expands to the combined inventory. */
export function filterCatalog(products, { brand = 'todos', type = 'todos', search = '', sort = 'destacados' }) {
  const query = normalize(search)
  return products.filter((product) =>
    (brand === 'todos' || product.brand === brand) &&
    (type === 'todos' || normalize(product.type || '') === normalize(type)) &&
    (!query || normalize(`${product.name} ${product.brand} ${product.type || ''} ${(product.colors || []).map(color => `${color.name} ${color.sku || ''}`).join(' ')}`).includes(query))
  ).sort(SORTS[sort] ?? SORTS.destacados)
}
