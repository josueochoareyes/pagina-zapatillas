import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from '../src/data/products.js'

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const safe = relative => {
  const absolute = path.resolve(root, relative)
  const within = path.relative(root, absolute)
  if (!within || within.startsWith('..') || path.isAbsolute(within)) throw Error(`Unsafe workspace path: ${relative}`)
  return absolute
}
const relative = absolute => path.relative(root, absolute).replaceAll('\\', '/')
const walk = dir => fs.readdirSync(safe(dir), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`])
const hash = file => createHash('sha256').update(fs.readFileSync(safe(file))).digest('hex')
const prefixes = [
  ['images/Catalogo/hombres/', 'images/Catalogo/Calzados/Hombre/'],
  ['images/Catalogo/mujeres/', 'images/Catalogo/Calzados/Mujer/'],
  ['images/Catalogo/Importacion2/Zapatillas/', 'images/Catalogo/Calzados/'],
  ['images/Catalogo/Importacion2/Accesorios/', 'images/Catalogo/Accesorios/'],
  ['images/Catalogo/Importacion2/Ropa/', 'images/Catalogo/Ropa/'],
]
const movedPath = file => {
  const prefix = prefixes.find(([old]) => file.startsWith(old))
  return prefix ? prefix[1] + file.slice(prefix[0].length) : file
}
const manifestFile = 'src/data/catalogImageMoves.json'
if (fs.existsSync(safe(manifestFile))) throw Error('Migration already recorded; refusing to repeat or replace the baseline')
const files = walk('images/Catalogo').map(from => ({ from, to: movedPath(from), sha256: hash(from) }))
const aliases = [
  ['images/Catalogo/hombre.png', 'images/Catalogo/Calzados/hombre-zapatillas.png'],
  ['images/Catalogo/mujer.png', 'images/Catalogo/Calzados/mujer-zapatillas.png'],
  ['images/Catalogo/accesorios.png', 'images/Catalogo/Accesorios/imagen-principal-accesorios.png'],
].map(([from,to]) => ({ from,to,sha256:hash(to) }))
// Validate every move and destination before modifying any source or image.
const destinations = new Set()
for (const f of files) {
  safe(f.from); safe(f.to)
  if (destinations.has(f.to.toLowerCase())) throw Error(`Conflicting destination: ${f.to}`)
  destinations.add(f.to.toLowerCase())
  if (f.from !== f.to && fs.existsSync(safe(f.to))) throw Error(`Refusing to overwrite ${f.to}`)
}
const baseline = {
  products: PRODUCTS.map(p => ({ ...p, colors: p.colors.map(c => ({ ...c, photo:relative(fileURLToPath(c.photo)) })) })),
  images: Object.fromEntries(files.map(f => [f.from,f.sha256])),
}
const changes = [...files.filter(f => f.from !== f.to), ...aliases]
const updatedSources = walk('src/data').filter(f => /\.(js|json)$/.test(f)).map(file => {
  let text=fs.readFileSync(safe(file),'utf8')
  for (const f of changes) text=text.split(f.from).join(f.to)
  return [file,text]
})
fs.writeFileSync(safe('tests/fixtures/catalog-before-restructure.json'), JSON.stringify(baseline,null,2)+'\n')
fs.writeFileSync(safe(manifestFile), JSON.stringify({ files, aliases },null,2)+'\n')
for (const f of changes.filter(f => !aliases.includes(f))) {
  fs.mkdirSync(path.dirname(safe(f.to)),{recursive:true})
  fs.renameSync(safe(f.from),safe(f.to))
  if (hash(f.to)!==f.sha256) throw Error(`Hash changed: ${f.to}`)
}
for (const [file,text] of updatedSources) fs.writeFileSync(safe(file),text)
// Only remove now-empty directories inside the explicitly named legacy subtrees.
const removeEmpty = dir => {
  const absolute=safe(dir)
  if (!fs.existsSync(absolute)) return
  for (const e of fs.readdirSync(absolute,{withFileTypes:true})) if(e.isDirectory()) removeEmpty(`${dir}/${e.name}`)
  if (!fs.readdirSync(absolute).length) fs.rmdirSync(absolute)
}
for (const dir of ['images/Catalogo/hombres','images/Catalogo/mujeres','images/Catalogo/Importacion2']) removeEmpty(dir)
console.log(JSON.stringify({ movedImages:files.filter(f=>f.from!==f.to).length,preservedImages:files.length,products:PRODUCTS.length,rootFolders:fs.readdirSync(safe('images/Catalogo')) },null,2))
