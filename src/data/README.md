# Inventario e imágenes

- `menProducts.js` y `womenProducts.js`: 12 modelos por colección, de Nike, Adidas y Puma.
- Cada variante usa la foto de `images/Catalogo/hombres|mujeres/Marca/Modelo/Color.png` mediante `new URL(..., import.meta.url)`, para que Vite incluya el archivo al compilar.
- Inicio usa las dos fotos de `Inicio/Zapatillas Suede Dressed` y la foto de `Inicio/Delamarcaqueeliges`.
- Las portadas del catálogo y las fotos de Nosotros se importan desde sus carpetas correspondientes.
- Las bolitas representan el nombre del color; las combinaciones muestran ambas mitades.
- Las fotos también se usan en detalles y carrito. Cada apertura de detalles reinicia su estado para evitar índices de color de otro producto.

Comprobaciones: `node --test tests/catalogs.test.mjs tests/product-images.test.mjs` y `npm.cmd run build`. `tests/browser-images.mjs` recorre productos y variantes con la vista previa en el puerto 5173 y Chrome de pruebas en el 9333.
