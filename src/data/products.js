import { menProducts, womenProducts, accessoryProducts, clothingProducts } from './inventory.js'

export const PRODUCTS = [...menProducts, ...womenProducts, ...accessoryProducts, ...clothingProducts]

export const CATEGORIES = [
  { id: 'ropa-hombre', label: 'Ropa · Hombre' },
  { id: 'ropa-mujer', label: 'Ropa · Mujer' },
  { id: 'hombre', label: 'Hombre', kicker: 'Colección urbana', tagline: 'Carácter deportivo en cada paso', statement: 'Una selección diseñada para moverte a tu manera.' },
  { id: 'mujer', label: 'Mujer', kicker: 'Colección contemporánea', tagline: 'Ligereza y diseño con carácter', statement: 'Diseño, comodidad y estilo para cada movimiento.' },
  { id: 'accesorios', label: 'Accesorios', kicker: 'Complementa tu estilo', tagline: 'Todo para acompañarte', statement: 'Gorros, mochilas, bolsos y balones para tu día a día.' },
]

export const MEN_SIZES = ['40', '41', '42', '43', '44', '45']
export const WOMEN_SIZES = ['36', '37', '38', '39', '40', '41']
export const CLOTHING_SIZES = ['S', 'M', 'L', 'XL']
export const sizeListFor = (category) => category.startsWith('ropa-') ? CLOTHING_SIZES : category === 'accesorios' ? ['Única'] : category === 'mujer' ? WOMEN_SIZES : MEN_SIZES
export const formatPrice = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
export const byCategory = (id) => id === 'hombre' ? menProducts : id === 'mujer' ? womenProducts : id === 'accesorios' ? accessoryProducts : clothingProducts.filter(p => p.category === id)
