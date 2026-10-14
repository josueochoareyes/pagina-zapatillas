import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { BRANDS, CATALOGS, brandsForCatalog } from '../src/data/catalogs.js'

for (const collection of Object.values(CATALOGS)) {
  const brands = brandsForCatalog(collection.products)
  const counts = Object.fromEntries(brands.map(brand => [brand, collection.products.filter(p => p.brand === brand).length]))
  const missingPhotos = collection.products.flatMap(p => p.colors.filter(c => !c.photo || !fs.existsSync(fileURLToPath(c.photo))).map(c => `${p.id}: ${c.name}`))
  console.log(JSON.stringify({ section: collection.id, brands: counts, hiddenOnlyHere: BRANDS.filter(b => !brands.includes(b)), missingPhotos }, null, 2))
  if (missingPhotos.length) process.exitCode = 1
}
