import { menProducts } from './menProducts.js'
import { womenProducts } from './womenProducts.js'
import { accessoryProducts } from './accessoryProducts.js'

export const PRODUCTS = [...menProducts, ...womenProducts, ...accessoryProducts]

export const CATEGORIES = [
  { id: 'hombre', label: 'Hombre', kicker: 'Colección urbana', tagline: 'Carácter deportivo en cada paso', statement: 'Una selección diseñada para moverte a tu manera.' },
  { id: 'mujer', label: 'Mujer', kicker: 'Colección contemporánea', tagline: 'Ligereza y diseño con carácter', statement: 'Diseño, comodidad y estilo para cada movimiento.' },
  { id: 'accesorios', label: 'Accesorios', kicker: 'Complementa tu estilo', tagline: 'Todo para acompañarte', statement: 'Mochilas y balones para tu día a día.' },
]

export const MEN_SIZES = ['40', '41', '42', '43', '44', '45']
export const WOMEN_SIZES = ['36', '37', '38', '39', '40', '41']
export const sizeListFor = (category) => category === 'accesorios' ? ['Única'] : category === 'mujer' ? WOMEN_SIZES : MEN_SIZES
export const formatPrice = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
export const byCategory = (id) => id === 'hombre' ? menProducts : id === 'mujer' ? womenProducts : id === 'accesorios' ? accessoryProducts : []
