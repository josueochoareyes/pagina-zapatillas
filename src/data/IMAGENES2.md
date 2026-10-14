# Integración de Imagenes2 — 14 de octubre de 2026

El catálogo se abre en Calzados, Accesorios y Ropa. Calzados y Ropa tienen sus propios selectores de Hombre/Mujer; no existe sección infantil. Las rutas anteriores `/catalogo/hombre` y `/catalogo/mujer` siguen vigentes.

`inventory.js` amplía los datos originales sin modificar sus archivos: 97 productos y 119 variantes anteriores. `imagenes2.js` contiene los añadidos y las fotos adicionales; `imagenes2Sources.json` registra las 65 imágenes revisadas y su asociación.

Se añadieron 51 productos, 61 variantes y 65 archivos, conservando todas las fuentes. Posteriormente se reorganizaron las imágenes en `images/Catalogo/Calzados`, `Accesorios` y `Ropa`. `catalogImageMoves.json` registra las rutas anteriores, las nuevas y los hashes; las pruebas conservan sus inventarios históricos sin reescribirlos. Las 122 imágenes anteriores (119 fotos de producto y 3 portadas) conservan su contenido. Las cuatro portadas nuevas están conectadas mediante `collectionPhotos.js`.

| Categoría | Productos nuevos | Variantes nuevas | Imágenes nuevas |
|---|---:|---:|---:|
| Calzados hombre | 9 | 11 | 14 |
| Calzados mujer | 1 | 1 | 1 |
| Accesorios | 16 | 19 | 20 |
| Ropa hombre | 17 | 20 | 20 |
| Ropa mujer | 8 | 10 | 10 |

Cuatro coincidencias visuales usan fotos adicionales sin duplicar variantes: Boston 11 negro, Air Max Systm negro, Run 70s gris/burdeos y CLSC BARS BP azul/celeste. La variante anterior mantiene su nombre, foto y posición. CLSC rosa bebé es una combinación más clara y se conserva como color nuevo.

Hay seis archivos idénticos entre las carpetas de ropa de hombre y mujer: Deportiva Perú blanco, Polera Adicolor azul marino, Buzo Essentials 3 Tiras azul/negro/rosa y Buzo Puma con Capucha negro. Se conserva la clasificación de ambas carpetas. No hay duplicados exactos con las imágenes anteriores.

Por petición posterior de la tienda, las opciones de selección nuevas son S/M/L/XL en ropa, 40–45 en calzado de hombre, 36–41 en calzado de mujer y Única en accesorios. Estas opciones no certifican stock; la disponibilidad se confirma por WhatsApp. La ropa no usa tallas ni guía de calzado y el carrito conserva la talla seleccionada. Los precios nuevos siguen la convención de precio interno 0 y permanecen ocultos en el catálogo.

Chambers no incluye modelo en la fuente; se muestra como «Mochilas Chambers». No se inventa una referencia comercial. No hay imágenes sin conectar al catálogo.

`tests/fixtures/catalog-before-imagenes2.json` conserva el estado completo anterior y los hashes de fotos y fuentes. `tests/imagenes2.test.mjs` verifica su conservación y la conexión de cada imagen nueva; `tests/browser-imagenes2.mjs` verifica navegación, filtros, fotos adicionales, ropa y persistencia del carrito.

Ejecutar:

- `node --test tests/*.test.mjs`
- `npm.cmd run build`
- `node tests/browser-imagenes2.mjs`
- `node tests/browser-images.mjs`

Las pruebas de navegador requieren Vite en 5173 y Chrome de pruebas en 9333. `node scripts/report-imagenes2.mjs` genera el desglose y las coincidencias en `output/imagenes2/informe.md` y `report.json`.
