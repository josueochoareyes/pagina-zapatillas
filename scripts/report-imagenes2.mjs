import fs from 'node:fs'
import { PRODUCTS } from '../src/data/products.js'
const before = JSON.parse(fs.readFileSync('tests/fixtures/catalog-before-imagenes2.json', 'utf8'))
const sources = JSON.parse(fs.readFileSync('src/data/imagenes2Sources.json', 'utf8'))
const categories = ['hombre', 'mujer', 'accesorios', 'ropa-hombre', 'ropa-mujer']
const counts = categories.map(category => ({
  category,
  previousProducts: before.products.filter(p => p.category === category).length,
  addedProducts: PRODUCTS.filter(p => p.category === category && !before.products.some(old => old.id === p.id)).length,
  addedVariants: sources.filter(s => s.category === category && s.status === 'variant').length,
  addedImages: sources.filter(s => s.category === category).length,
  galleryImages: sources.filter(s => s.category === category && s.status === 'additional-photo').length,
}))
const report = { previousProducts: before.products.length, previousVariants: before.products.reduce((n,p) => n+p.colors.length, 0), previousImages: Object.keys(before.images).length, counts, matchingColors: sources.filter(s => s.status === 'additional-photo'), exactDuplicatesOfPrevious: sources.filter(s => s.exactMatches.length), repeatedSourceImages: sources.filter(s => s.sameSourceImages.length), unidentified: ['Accesorios/Mochilas/Chambers/Azul.png: la carpeta indica Chambers, pero no especifica modelo. Se conserva como Mochilas Chambers, sin atribuir un modelo.'], availability: 'Por petición de la tienda se ofrecen tallas S/M/L/XL para ropa, 40–45 para calzado de hombre, 36–41 para calzado de mujer y Única para accesorios. Son opciones de selección; el stock se confirma por WhatsApp. Precios nuevos por confirmar, usando la convención interna de precio 0 y precios ocultos del catálogo.' }
fs.writeFileSync('output/imagenes2/report.json', JSON.stringify(report, null, 2) + '\n')
const lines = [
  '# Integración de Imagenes2', '',
  'Navegación: Catálogo → Calzados → Hombre/Mujer; Accesorios; Ropa → Hombre/Mujer. Las rutas anteriores de calzado siguen funcionando.', '',
  `Conservados: ${report.previousProducts} productos, ${report.previousVariants} variantes y ${report.previousImages} imágenes (incluye 3 portadas). Se comprueban metadatos, orden de variantes y SHA-256 de todas las imágenes anteriores y de las 65 imágenes fuente.`, '',
  '| Categoría | Productos anteriores | Productos nuevos | Variantes nuevas | Imágenes nuevas | Fotos adicionales |',
  '|---|---:|---:|---:|---:|---:|',
  ...counts.map(c => `| ${c.category} | ${c.previousProducts} | ${c.addedProducts} | ${c.addedVariants} | ${c.addedImages} | ${c.galleryImages} |`), '',
  '## Coincidencias revisadas', '',
  ...report.matchingColors.map(s => `- ${s.productId}, ${s.sourceColor || s.color}: foto adicional del color existente «${s.color}». Se conserva la variante y fotografía anterior. Fuente: ${s.source}`), '',
  `Duplicados exactos respecto a imágenes anteriores: ${report.exactDuplicatesOfPrevious.length}.`, '',
  'Fotos idénticas entre carpetas nuevas (se conserva cada clasificación de hombre/mujer):', '',
  ...report.repeatedSourceImages.map(s => `- ${s.source} = ${s.sameSourceImages.join(', ')}`), '',
  '## Datos por confirmar', '', ...report.unidentified.map(s => `- ${s}`), `- ${report.availability}`, '',
  'Los nombres y colores se conservan según las carpetas; los guiones bajos se muestran como espacios. El error de escritura «celesste_bebe» se muestra como «Celeste bebe». El color fuente «Celeste bebe» de CLSC se asocia al «Azul» existente tras comparar fotos. Run 70s «Gris y rojo» se asocia al «Gris y burdeos y blanco» existente.', '',
  'Pruebas: node --test tests/*.test.mjs; compilación: npm.cmd run build. Verificación funcional de navegación, filtros, fotos, variantes y carrito: tests/browser-imagenes2.mjs.', '',
]
fs.writeFileSync('output/imagenes2/informe.md', lines.join('\n'))
console.log(JSON.stringify(report, null, 2))
