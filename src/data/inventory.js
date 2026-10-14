import { menProducts as originalMen } from './menProducts.js'
import { womenProducts as originalWomen } from './womenProducts.js'
import { accessoryProducts as originalAccessories } from './accessoryProducts.js'
import { additions, additionalPhotos } from './imagenes2.js'

// Append only. Existing metadata and variant order also preserve saved carts.
const extend = products => products.map(product => {
  const extra = additions.find(item => item.targetId === product.id)
  return extra ? { ...product, colors: [...product.colors, ...extra.colors] } : product
})
const added = category => additions.filter(p => !p.targetId && p.category === category)
export const menProducts = [...extend(originalMen), ...added('hombre')]
export const womenProducts = [...extend(originalWomen), ...added('mujer')]
export const accessoryProducts = [...extend(originalAccessories), ...added('accesorios')]
export const clothingProducts = [...added('ropa-hombre'), ...added('ropa-mujer')]
export const photosFor = (product, color) => additionalPhotos.filter(p => p.productId === product.id && p.color === color.name).map(p => p.photo)
