import test from 'node:test'
import assert from 'node:assert/strict'
import { CATALOGS, BRANDS, filterCatalog } from '../src/data/catalogs.js'

test('Hombre and Mujer have independent updated inventories', () => {
  const men = CATALOGS.hombre.products
  const women = CATALOGS.mujer.products
  assert.equal(men.length, 30)
  assert.equal(women.length, 7)
  assert.ok(men.every(p => p.category === 'hombre' && p.id.startsWith('h')))
  assert.ok(women.every(p => p.category === 'mujer' && p.id.startsWith('m')))
  assert.equal(new Set([...men, ...women].map(p => p.id)).size, 37)
  assert.ok(men.every(p => !women.some(w => w.id === p.id || w.colors === p.colors)))
  assert.ok([...men, ...women].every(p => p.sizes.length && p.colors.length && Number.isFinite(p.price)))
})

for (const collection of Object.values(CATALOGS)) {
  test(`${collection.label}: all three brand filters stay inside their own inventory`, () => {
    assert.deepEqual(BRANDS, ['Nike', 'Adidas', 'Puma'])
    for (const brand of BRANDS) {
      const result = filterCatalog(collection.products, { brand })
      assert.equal(result.length, collection.products.filter(p => p.brand === brand).length)
      assert.ok(result.every(p => p.category === collection.id && p.brand === brand))
    }
    assert.equal(filterCatalog(collection.products, { brand: 'todos' }).length, collection.products.length)
  })
  test(`${collection.label}: name search, accents, sorting and empty state`, () => {
    const product = collection.products[0]
    const query = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    assert.equal(filterCatalog(collection.products, { search: ` ${query} ` })[0].id, product.id)
    assert.equal(filterCatalog(collection.products, { search: 'no-existe-123' }).length, 0)
    const ascending = filterCatalog(collection.products, { sort: 'nombre-asc' }).map(p => p.name)
    const descending = filterCatalog(collection.products, { sort: 'nombre-desc' }).map(p => p.name)
    assert.deepEqual(ascending, [...descending].reverse())
  })
}

test('Verified brand metadata supports positive and combined queries', () => {
  // Controlled fixtures test future confirmed metadata without fabricating live inventory.
  const products = BRANDS.map((brand, index) => ({ id: `fixture-${index}`, category: 'hombre', name: `Modelo ${index}`, brand, reviews: index }))
  for (const [index, brand] of BRANDS.entries()) {
    assert.deepEqual(filterCatalog(products, { brand }).map(p => p.id), [`fixture-${index}`])
    assert.deepEqual(filterCatalog(products, { search: brand.toLowerCase() }).map(p => p.id), [`fixture-${index}`])
    assert.equal(filterCatalog(products, { brand, search: `Modelo ${index}` }).length, 1)
    assert.equal(filterCatalog(products, { brand, search: 'ausente' }).length, 0)
  }
})
