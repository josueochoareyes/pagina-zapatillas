import { menProducts } from './menProducts.js'
import { womenProducts } from './womenProducts.js'

// Combined inventory with real products from Nike, Adidas, and Puma
// Men: 12 products (4 Nike, 4 Adidas, 4 Puma)
// Women: 12 products (4 Nike, 4 Adidas, 4 Puma)
// Total: 24 products with real images and proper brand filtering
export const PRODUCTS = [...menProducts, ...womenProducts]

export const CATEGORIES = [
  { id: 'hombre', label: 'Hombre', kicker: 'Colección urbana', tagline: 'Carácter deportivo en cada paso', statement: 'Una selección diseñada para moverte a tu manera.' },
  { id: 'mujer', label: 'Mujer', kicker: 'Colección contemporánea', tagline: 'Ligereza y diseño con carácter', statement: 'Diseño, comodidad y estilo para cada movimiento.' },
]

export const MEN_SIZES = ['40', '41', '42', '43', '44', '45']
export const WOMEN_SIZES = ['36', '37', '38', '39', '40', '41']
export const sizeListFor = (category) => category === 'mujer' ? WOMEN_SIZES : MEN_SIZES
export const formatPrice = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
export const byCategory = (id) => id === 'hombre' ? menProducts : id === 'mujer' ? womenProducts : []
