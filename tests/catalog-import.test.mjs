import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { PRODUCTS, CATEGORIES } from '../src/data/products.js'
import { BRANDS, filterCatalog } from '../src/data/catalogs.js'
import { swatchBackground } from '../src/lib/swatch.js'
import { resolveCatalogPath } from './helpers/catalog-paths.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const baseline = JSON.parse(fs.readFileSync(new URL('./fixtures/catalog-before-import.json', import.meta.url), 'utf8'))
const sources = JSON.parse(fs.readFileSync(new URL('../src/data/catalogSources.json', import.meta.url), 'utf8'))

test('All previous photos are retained byte for byte, with their original product variants', () => {
  for (const [filename, expected] of Object.entries(baseline.images)) {
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, resolveCatalogPath(`images/Catalogo/${filename}`)))).digest('hex'), expected, filename)
  }
  for (const original of baseline.products) {
    const current = PRODUCTS.find(product => product.id === original.id)
    assert.ok(current, original.id)
    const { colors, ...metadata } = original
    const { colors: currentColors, ...currentMetadata } = current
    assert.deepEqual(currentMetadata, metadata)
    for (const color of colors) {
      const match = currentColors.find(variant => variant.name === color.name)
      assert.ok(match, `${original.id}: ${color.name}`)
      const photo = path.relative(root, fileURLToPath(match.photo)).replaceAll('\\', '/')
      assert.deepEqual({ ...match, photo }, { ...color, photo: resolveCatalogPath(color.photo) })
    }
  }
})

test('Each new variant has a source, matching collection and locally bundled photograph', () => {
  const added = sources.filter(source => source.status === 'added')
  assert.ok(added.length > 0)
  for (const source of added) {
    assert.match(source.sourceUrl, /^https:\/\//)
    if (source.imageOrigin === 'original-photo-background-removal') assert.match(source.originalPhoto, /^nuevas-zapatillas\/[0-9]+\.jpeg$/)
    else assert.match(source.imageUrl, /^https:\/\//)
    assert.equal(source.visualVerified, true, source.sku)
    const product = PRODUCTS.find(product => product.id === source.productId)
    assert.ok(product, source.sku)
    assert.ok(BRANDS.includes(product.brand))
    const color = product.colors.find(color => color.sku === source.sku)
    assert.ok(color, source.sku)
    assert.equal(path.relative(root, fileURLToPath(color.photo)).replaceAll('\\', '/'), source.catalogPhoto)
    assert.ok(filterCatalog([product], { search: source.sku }).includes(product))
  }
})

test('Three color combinations show all their confirmed swatch colors', () => {
  const color = PRODUCTS.flatMap(product => product.colors).find(color => color.swatches?.length >= 3)
  assert.ok(color)
  const background = swatchBackground(color)
  assert.ok(color.swatches.every(hex => background.includes(hex)))
})

test('All 73 original references are accounted for without duplicating variants', () => {
  const removedDuplicates = new Set([15, 19, 20, 28, 35, 79])
  const expected = Array.from({ length: 79 }, (_, index) => index + 1).filter(number => !removedDuplicates.has(number))
  const covered = [...new Set(sources.flatMap(source => source.sourceNumbers))].sort((a,b) => a-b)
  assert.deepEqual(covered, expected)
  assert.equal(new Set(sources.map(source => source.sku)).size, sources.length)
  assert.ok(sources.every(source => ['added', 'existing'].includes(source.status)))
})

test('Every footwear reference belongs to Hombre or Mujer regardless of size', () => {
  const junior = sources.filter(source => /infantil|junior|juvenil/i.test(source.gender))
  assert.ok(junior.length > 0)
  for (const source of junior) assert.ok(['hombre', 'mujer'].includes(PRODUCTS.find(product => product.id === source.productId)?.category), source.sku)
  assert.deepEqual(CATEGORIES.map(category => category.id).sort(), ['accesorios', 'hombre', 'mujer', 'ropa-hombre', 'ropa-mujer'])
})
