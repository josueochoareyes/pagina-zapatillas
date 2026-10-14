# Inventario e imágenes

- `menProducts.js`: 49 modelos de hombre; `womenProducts.js`: 42 de mujer; `accessoryProducts.js`: 6 accesorios.
- Las carpetas principales son exclusivamente `images/Catalogo/Calzados`, `Accesorios` y `Ropa`. Calzados y Ropa contienen `Hombre` y `Mujer`; cada producto conserva su marca, modelo y color. `collectionPhotos.js` conecta las siete portadas suministradas por la tienda.
- Las variantes se importan mediante `new URL(..., import.meta.url)` para incluir los archivos locales en la compilación de Vite. Tarjetas, detalles, favoritos y carrito comparten las mismas fotos.
- La incorporación de octubre de 2026 revisó las 73 referencias de `nuevas-zapatillas`: 69 variantes únicas, 61 fotografías añadidas y 8 variantes ya presentes. Se conservaron las 61 imágenes anteriores y los 43 productos originales, incluidas sus variantes.
- `catalogSources.json` registra referencia original, código, modelo, categoría investigada, colores, página de consulta, URL de la imagen y destino en el catálogo. `status: existing` identifica referencias ya cubiertas por fotos anteriores.
- Las nuevas fotos muestran solo el calzado. La foto de DC Mikey Taylor procede de `nuevas-zapatillas/56.jpeg`, con el fondo retirado mediante imagegen; su procedencia está indicada en el registro.
- La referencia `5.jpeg` tenía un código anotado que no correspondía a la foto. La coincidencia visual investigada es Boston 11 GY2585; se documentó la corrección.
- Por indicación de la tienda, todas las zapatillas se organizan en Hombre o Mujer, sin una colección Infantil y sin usar las tallas como criterio de clasificación. Se conservan los nombres comerciales K, Jr y GS y la clasificación del fabricante en el registro de fuentes.
- Las bolitas nuevas muestran los colores de cada combinación, incluso cuando hay tres o más; las anteriores conservan su apariencia. El buscador admite marca, modelo, color y los códigos de las variantes nuevas.
- Los precios siguen por confirmar con la tienda. Las anotaciones de tallas y conversiones investigadas figuran en el registro cuando están disponibles; no certifican stock. Los rangos de selección del catálogo deben validarse con el inventario de la tienda.

Validación: `node --test tests/catalogs.test.mjs tests/product-images.test.mjs tests/catalog-import.test.mjs` y `npm.cmd run build`. `tests/browser-images.mjs` recorre todos los productos y variantes con Vite en el puerto 5173 y un Chrome de pruebas en el 9333. `tests/fixtures/catalog-before-import.json` comprueba que los archivos anteriores y sus productos siguen intactos.
