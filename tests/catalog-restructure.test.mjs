import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from '../src/data/products.js'
import { COLLECTION_PHOTOS } from '../src/data/collectionPhotos.js'
import { resolveCatalogPath } from './helpers/catalog-paths.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const before = JSON.parse(fs.readFileSync(new URL('./fixtures/catalog-before-restructure.json', import.meta.url),'utf8'))
test('Reorganization preserves all 148 products, 180 variants and 191 image files byte for byte', () => {
  const products = PRODUCTS.map(p => ({ ...p, colors:p.colors.map(c => ({ ...c,photo:path.relative(root,fileURLToPath(c.photo)).replaceAll('\\','/') })) }))
  const expected = before.products.map(p => ({ ...p, colors:p.colors.map(c=>({...c,photo:resolveCatalogPath(c.photo)})) }))
  assert.equal(products.length,148)
  assert.equal(products.reduce((n,p)=>n+p.colors.length,0),180)
  assert.deepEqual(products, expected)
  assert.equal(Object.keys(before.images).length,191)
  for (const [file,digest] of Object.entries(before.images)) {
    const current = path.join(root,resolveCatalogPath(file))
    assert.equal(createHash('sha256').update(fs.readFileSync(current)).digest('hex'),digest,file)
  }
})

test('Store-supplied main and gender covers use the renamed files', () => {
  const expected = {
    calzados:'Calzados/imagen-principal-calzados.png',hombre:'Calzados/hombre-zapatillas.png',mujer:'Calzados/mujer-zapatillas.png',
    accesorios:'Accesorios/imagen-principal-accesorios.png',ropa:'Ropa/imagen-principal-ropa.png','ropa-hombre':'Ropa/hombre.png','ropa-mujer':'Ropa/mujer.png',
  }
  for (const [key,file] of Object.entries(expected)) assert.equal(fileURLToPath(COLLECTION_PHOTOS[key]),path.join(root,'images/Catalogo',file))
})
