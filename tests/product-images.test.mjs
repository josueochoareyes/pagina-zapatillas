import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from '../src/data/products.js'
import { additionalPhotos } from '../src/data/imagenes2.js'
import { COLLECTION_PHOTOS } from '../src/data/collectionPhotos.js'

test('Every catalog photo belongs to its collection, brand, model and color; no files are omitted', () => {
  const root = new URL('../images/Catalogo/', import.meta.url)
  const relativePhoto = photo => fileURLToPath(photo).slice(fileURLToPath(root).length).replaceAll('\\', '/')
  const covers = Object.values(COLLECTION_PHOTOS).map(relativePhoto)
  const files = fs.readdirSync(root, { recursive: true }).filter(p => /\.(png|jpe?g)$/i.test(p)).map(p => p.replaceAll('\\', '/')).sort()
  const used = PRODUCTS.flatMap(product => product.colors.map(color => {
    const path = fileURLToPath(color.photo)
    assert.ok(fs.existsSync(path), path)
    const relative = path.slice(fileURLToPath(root).length).replaceAll('\\', '/')
    const prefix = product.category === 'accesorios' ? 'Accesorios/' : product.category.startsWith('ropa-') ? `Ropa/${product.category === 'ropa-hombre' ? 'Hombre' : 'Mujer'}/` : `Calzados/${product.category === 'hombre' ? 'Hombre' : 'Mujer'}/`
    assert.ok(relative.startsWith(prefix), `${product.id}: ${relative}`)
    assert.ok(relative.split('/').includes(product.brand), `${product.id}: brand folder`)
    return relative
  })).concat(additionalPhotos.map(p => relativePhoto(p.photo)), covers).sort()
  assert.deepEqual(used, files)
  assert.deepEqual(fs.readdirSync(root).sort(), ['Accesorios', 'Calzados', 'Ropa'])
})
