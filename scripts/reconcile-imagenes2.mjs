import fs from 'node:fs'
import { additions, additionalPhotos } from '../src/data/imagenes2.js'
const sources = JSON.parse(fs.readFileSync('src/data/imagenes2Sources.json', 'utf8'))
const matches = [
  ['h-adidas-run-70s', 'Gris y rojo', 'Gris y burdeos y blanco'],
  ['a-adidas-clsc-bars-bp', 'Celeste bebe', 'Azul'],
]
for (const [id, incoming, existing] of matches) {
  const p = additions.find(p => p.targetId === id)
  const c = p?.colors.find(c => c.name === incoming)
  if (!c) continue
  additionalPhotos.push({ productId: id, color: existing, photo: c.photo })
  p.colors.splice(p.colors.indexOf(c), 1)
  const s = sources.find(s => s.productId === id && s.color === incoming)
  s.sourceColor = incoming; s.color = existing; s.status = 'additional-photo'
  s.note = 'Visual comparison confirms existing color; original name and photo preserved.'
}
for (const p of additions) {
  if (p.category?.startsWith('ropa-')) p.type = ({ casacas: 'Casacas', conjunto: 'Conjuntos', conjuntos: 'Conjuntos', polera: 'Poleras', polos: 'Polos', pantalones: 'Pantalones', tops: 'Tops' })[p.type.toLowerCase()] || p.type
  for (const c of p.colors) c.sizePending = true
}
const serialize = value => JSON.stringify(value, null, 2).replace(/"photo": "([^"]+)"/g, (_, url) => {
  const relative = decodeURIComponent(url.slice(url.indexOf('/images/') + 1))
  return `"photo": new URL(${JSON.stringify('../../' + relative)}, import.meta.url).href`
})
fs.writeFileSync('src/data/imagenes2.js', `// Source folders and visual comparisons recorded in imagenes2Sources.json.\nexport const additions = ${serialize(additions.filter(p => !p.targetId || p.colors.length))}\nexport const additionalPhotos = ${serialize(additionalPhotos)}\n`)
fs.writeFileSync('src/data/imagenes2Sources.json', JSON.stringify(sources, null, 2) + '\n')
