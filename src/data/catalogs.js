import { menProducts } from './menProducts.js'
import { womenProducts } from './womenProducts.js'

export const BRANDS = ['Nike', 'Adidas', 'Puma']

export const CATALOGS = {
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
export function filterCatalog(products, { brand = 'todos', search = '', sort = 'destacados' }) {
  const query = normalize(search)
  return products.filter((product) =>
    (brand === 'todos' || product.brand === brand) &&
    (!query || normalize(`${product.name} ${product.brand}`).includes(query))
  ).sort(SORTS[sort] ?? SORTS.destacados)
}
