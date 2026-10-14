import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { PRODUCTS, sizeListFor } from '../src/data/products.js'
import { photosFor } from '../src/data/inventory.js'
import { CATALOGS, filterCatalog } from '../src/data/catalogs.js'
import { resolveCatalogPath } from './helpers/catalog-paths.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
const before = read('tests/fixtures/catalog-before-imagenes2.json')
const sources = read('src/data/imagenes2Sources.json')
const hash = p => createHash('sha256').update(fs.readFileSync(path.join(root, resolveCatalogPath(p)))).digest('hex')
const relative = url => path.relative(root, fileURLToPath(url)).replaceAll('\\', '/')

test('All 97 previous products, metadata, variant order and photographs are preserved', () => {
  assert.equal(before.products.length, 97)
  for (const old of before.products) {
    const current = PRODUCTS.find(p => p.id === old.id)
    assert.ok(current, old.id)
    const { colors, ...metadata } = current
    const { colors: oldColors, ...oldMetadata } = old
    assert.deepEqual(metadata, oldMetadata)
    assert.deepEqual(colors.slice(0, oldColors.length).map(c => ({ ...c, photo: relative(c.photo) })), oldColors.map(c => ({ ...c, photo: resolveCatalogPath(c.photo) })))
  }
  for (const [file, digest] of Object.entries(before.images)) assert.equal(hash(file), digest, file)
})

test('All 65 source images remain intact and are linked to the appropriate product and color', () => {
  assert.equal(sources.length, 65)
  assert.deepEqual(new Set(sources.map(s => s.source)), new Set(Object.keys(before.sources)))
  for (const s of sources) {
    assert.equal(hash(s.source), before.sources[s.source], s.source)
    assert.equal(hash(s.catalogPhoto), s.sha256, s.catalogPhoto)
    assert.equal(s.sha256, before.sources[s.source])
    assert.equal(s.visualReviewed, true)
    const p = PRODUCTS.find(p => p.id === s.productId)
    assert.ok(p, s.productId)
    assert.equal(p.category, s.category)
    assert.ok(CATALOGS[s.category].products.includes(p))
    const color = p.colors.find(c => c.name === s.color)
    assert.ok(color, `${s.productId}: ${s.color}`)
    assert.ok([color.photo, ...photosFor(p, color)].some(photo => relative(photo) === s.catalogPhoto), s.source)
  }
  assert.equal(new Set(PRODUCTS.map(p => p.id)).size, PRODUCTS.length)
})

test('New clothing uses source genders and garment types without fabricated size availability', () => {
  const clothes = PRODUCTS.filter(p => p.category.startsWith('ropa-'))
  assert.equal(clothes.length, 25)
  assert.equal(clothes.filter(p => p.category === 'ropa-hombre').length, 17)
  for (const p of clothes) {
    assert.deepEqual(p.sizes, [])
    assert.equal(p.sizePending, true)
    assert.deepEqual(sizeListFor(p.category), ['S', 'M', 'L', 'XL'])
    assert.ok(!/zapatillas/i.test(p.type))
    assert.ok(filterCatalog(CATALOGS[p.category].products, { search: p.type }).includes(p))
  }
})

test('Four visually matching colors add gallery photos without duplicating existing variants', () => {
  const gallery = sources.filter(s => s.status === 'additional-photo')
  assert.equal(gallery.length, 4)
  for (const s of gallery) {
    const beforeProduct = before.products.find(p => p.id === s.productId)
    assert.ok(beforeProduct.colors.some(c => c.name === s.color))
    assert.equal(PRODUCTS.find(p => p.id === s.productId).colors.filter(c => c.name === s.color).length, 1)
  }
})
