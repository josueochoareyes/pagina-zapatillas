import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from '../src/data/products.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])
const relative = p => path.relative(root, p).replaceAll('\\', '/')
const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const json = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n')
const baselinePath = 'tests/fixtures/catalog-before-imagenes2.json'
if (fs.existsSync(path.join(root, baselinePath))) throw Error('Import already recorded; refusing to replace baseline')
const snapshot = PRODUCTS.map(p => ({ ...p, colors: p.colors.map(c => ({ ...c, photo: relative(fileURLToPath(c.photo)) })) }))
const oldFiles = walk(path.join(root, 'images/Catalogo'))
const sourceFiles = walk(path.join(root, 'Imagenes2/Imagenes2')).sort()
json(baselinePath, { products: snapshot, images: Object.fromEntries(oldFiles.map(p => [relative(p), hash(p)])), sources: Object.fromEntries(sourceFiles.map(p => [relative(p), hash(p)])) })
const palette = { negro: '#191919', blanco: '#f5f5f5', azul: '#3265a0', gris: '#92969b', rosa: '#e4a0bb', verde: '#6e783b', marron: '#79503b', coral: '#ef977b', celeste: '#b7d3e5', lila: '#c9c2df', rojo: '#c93843' }
const additions = [], photos = [], sources = [], groups = new Map()
for (const file of sourceFiles) {
  const source = relative(file)
  const parts = source.split('/').slice(2)
  const section = parts.shift()
  let category, brand, type, name
  if (section === 'Ropa') {
    category = `ropa-${parts.shift().toLowerCase()}`
    brand = parts.shift(); type = parts.shift(); name = parts.shift()
  } else if (section === 'Zapatillas') {
    category = parts.shift().toLowerCase(); brand = parts.shift(); name = parts.shift(); type = /sandalias/i.test(name) ? 'Sandalias' : 'Zapatillas'
  } else {
    category = 'accesorios'; type = parts.shift(); brand = parts.shift()
    // Chambers is the only folder with no model: retain its stated brand and type.
    name = parts.length > 1 ? parts.shift() : `${type} ${brand}`
  }
  const filename = parts.pop()
  const colorName = path.parse(filename).name.replaceAll('_', ' ').replace(/^celesste bebe$/i, 'Celeste bebe')
  const key = `${category}|${normalize(brand)}|${normalize(name)}`
  let product = groups.get(key)
  if (!product) {
    const existing = PRODUCTS.find(p => p.category === category && normalize(p.brand) === normalize(brand) && normalize(p.name) === normalize(name))
    product = { id: existing?.id ?? `${category === 'hombre' ? 'h' : category === 'mujer' ? 'm' : category === 'accesorios' ? 'a' : category}-${slug(brand)}-${slug(name)}`, category, brand, name, type, price: 0, sizes: [], sizePending: true, colors: [], existing }
    groups.set(key, product)
  }
  const existingColor = product.existing?.colors.find(c => normalize(c.name) === normalize(colorName))
  // Use the canonical category tree; COPYFILE_EXCL still prevents overwrites.
  const catalogPhoto = `images/Catalogo/${source.split('/').slice(2).join('/')}`.replace('/Zapatillas/', '/Calzados/')
  const dest = path.join(root, catalogPhoto)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(file, dest, fs.constants.COPYFILE_EXCL)
  const exactMatches = oldFiles.filter(p => hash(p) === hash(file)).map(relative)
  const sameSourceImages = sources.filter(s => s.sha256 === hash(file)).map(s => s.source)
  const entry = { source, catalogPhoto, productId: product.id, category, color: existingColor?.name ?? colorName, sha256: hash(file), visualReviewed: true, status: existingColor ? 'additional-photo' : 'variant', exactMatches, sameSourceImages }
  sources.push(entry)
  if (existingColor) photos.push({ productId: product.id, color: existingColor.name, photo: catalogPhoto })
  else {
    const swatches = Object.entries(palette).filter(([word]) => normalize(colorName).includes(word)).map(([,hex]) => hex)
    const base = swatches[0] ?? '#92969b'
    product.colors.push({ name: colorName, base, accent: swatches[1] ?? base, sole: '#f5f5f5', laces: base, swatch: base, swatches: swatches.length ? swatches : [base], photo: catalogPhoto })
  }
}
for (const p of groups.values()) {
  const { existing, ...data } = p
  if (!existing) additions.push(data)
  else if (data.colors.length) additions.push({ targetId: existing.id, colors: data.colors })
}
const serialize = data => JSON.stringify(data, null, 2).replace(/"(images\/Catalogo\/[^"\n]+)"/g, (_, p) => `new URL(${JSON.stringify('../../' + p)}, import.meta.url).href`)
fs.writeFileSync(path.join(root, 'src/data/imagenes2.js'), `// Generated from source folders; see imagenes2Sources.json. Original data remains unchanged.\nexport const additions = ${serialize(additions)}\nexport const additionalPhotos = ${serialize(photos)}\n`)
json('src/data/imagenes2Sources.json', sources)
console.log(JSON.stringify({ previousProducts: snapshot.length, previousImages: oldFiles.length, sourceImages: sourceFiles.length, newProducts: additions.filter(p => !p.targetId).length, newVariants: sources.filter(s => s.status === 'variant').length, additionalPhotos: photos }, null, 2))
