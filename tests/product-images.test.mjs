import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from '../src/data/products.js'

test('Every catalog photo belongs to its collection, brand, model and color; no files are omitted', () => {
  const root = new URL('../images/Catalogo/', import.meta.url)
  const files = fs.readdirSync(root, { recursive: true }).filter(p => /^(hombres|mujeres|Accesorios)[\\/].*\.(png|jpe?g)$/i.test(p)).map(p => p.replaceAll('\\', '/')).sort()
  const used = PRODUCTS.flatMap(product => product.colors.map(color => {
    const path = fileURLToPath(color.photo)
    assert.ok(fs.existsSync(path), path)
    const relative = path.slice(fileURLToPath(root).length).replaceAll('\\', '/')
    const parts = relative.split('/')
    const category = parts.shift()
    if (category === 'Accesorios') assert.equal(parts.shift(), product.type)
    const [brand, model, filename] = parts
    assert.equal(category, product.category === 'accesorios' ? 'Accesorios' : product.category === 'hombre' ? 'hombres' : 'mujeres')
    assert.equal(brand, product.brand)
    assert.equal(model, product.name)
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    assert.equal(normalize(filename.replace(/\.[^.]+$/, '').replaceAll('_', ' ')), normalize(color.name))
    return relative
  })).sort()
  assert.deepEqual(used, files)
})
