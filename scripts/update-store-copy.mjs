import fs from 'node:fs'

const edits = {
  'src/components/Hero.jsx': [
    ["import { PRODUCTS, CATEGORIES }", "import { PRODUCTS }"],
    ["[String(PRODUCTS.length), 'Modelos', 'disponibles']", "[String(PRODUCTS.length), 'Modelos', 'en el catálogo']"],
    ["[String(CATEGORIES.length), 'Colecciones', 'para elegir']", "['3', 'Categorías', 'para explorar']"],
    ['              Zapatillas', '              Tu estilo'],
    ['              que <em>declaran</em>', '              en cada'],
    ['              tu estilo', '              <em>detalle</em>'],
    ['Una tienda multimarca con colecciones de <strong>hombre</strong>, <strong>mujer</strong> y <strong>accesorios</strong>.', 'Descubre <strong>calzados</strong>, <strong>ropa</strong> y <strong>accesorios</strong> para tu día a día.'],
    ['Elige tu modelo, tu talla y tu color, y confírmalo con nosotros.', 'Explora las colecciones de hombre y mujer, encuentra tus favoritos y consulta tu pedido por WhatsApp.'],
    ['alt="C & E Store ? tienda multimarca"', 'alt="C & E Store, tienda multimarca de calzados, ropa y accesorios"'],
  ],
  'src/components/EditFeature.jsx': [
    ['<span className="eyebrow">Pieza destacada</span>', '<span className="eyebrow">Marcas para tu día a día</span>'],
    ['Una de las piezas de nuestra selección actual. Mira sus colores, comprueba\n            tu talla y confírmala por WhatsApp cuando la tengas decidida.', 'Combina tus calzados favoritos con ropa y accesorios de nuestra selección.\n            Descubre las marcas, elige tus colores y dale tu toque a cada conjunto.'],
    ['            Ver colección', '            Explorar catálogo'],
  ],
  'src/components/Values.jsx': [
    ['Zapatillas para hombre y mujer, y accesorios para completar tu estilo.', 'Calzados, ropa y accesorios para combinar a tu manera.'],
    ['Hombre · Mujer · Accesorios', 'Calzados · Ropa · Accesorios'],
    ['Elige tu modelo y color, y confirma los detalles de tu pedido por WhatsApp.', 'Guarda tus favoritos, añade productos al carrito y confirma tu pedido por WhatsApp.'],
  ],
  'src/components/About.jsx': [
    ['C &amp; E Store es una tienda multimarca donde reunimos zapatillas para hombre y mujer, mochilas y balones de marcas reconocidas para que encuentres lo que mejor encaje con tu estilo.', 'En C &amp; E Store reunimos calzados, ropa y accesorios de diferentes marcas para acompañarte en tu día a día. Explora nuestras colecciones de hombre y mujer y encuentra combinaciones que vayan contigo.'],
    ['No todos buscan lo mismo. Por eso reunimos modelos de diferentes marcas, estilos y siluetas para que puedas encontrar zapatillas y accesorios que realmente vayan contigo.', 'Cada persona tiene su forma de vestir. Por eso reunimos calzados, prendas y accesorios de diferentes marcas y estilos: desde un conjunto deportivo hasta los detalles que completan tu look de diario.'],
    ['<dt>Hombre + Mujer + Accesorios</dt><dd>Tres colecciones para explorar a tu manera.</dd>', '<dt>Calzados, ropa y accesorios</dt><dd>Tres categorías para combinar a tu manera.</dd>'],
    ['Más que zapatillas.<br /><em>Forma parte<br />de tu estilo.</em>', 'Tu forma de vestir.<br /><em>Tu forma<br />de expresarte.</em>'],
    ['Las zapatillas dejaron de ser solamente calzado. Hoy forman parte de la música, el deporte, la moda urbana y la manera en la que cada persona expresa su estilo.', 'Los calzados que eliges, las prendas que combinas y los accesorios que llevas cuentan algo de ti. El deporte, la música y la vida cotidiana también inspiran tu forma de vestir.'],
    ['En C &amp; E Store reunimos diferentes propuestas para que encuentres la que encaje contigo.', 'En C &amp; E Store puedes explorar esas opciones en un mismo lugar y combinarlas a tu manera.'],
    ['Tu siguiente paso empieza aquí', 'Tu próxima combinación empieza aquí'],
    ['Explora nuestras colecciones y descubre diferentes marcas, estilos y modelos.', 'Empieza por calzados, descubre nuestra ropa o encuentra el accesorio que completa tu conjunto.'],
    ['href="/catalogo/hombre" destination="hombre">Ver Hombre', 'href="/catalogo/calzados" destination="calzados">Ver Calzados'],
    ['href="/catalogo/mujer" destination="mujer">Ver Mujer', 'href="/catalogo/ropa" destination="ropa">Ver Ropa'],
  ],
  'src/components/MobileMenu.jsx': [
    ["{ label: 'Hombre', go: 'hombre', note: 'Zapatillas con carácter deportivo' }", "{ label: 'Calzados', go: 'calzados', note: 'Colecciones de hombre y mujer' }"],
    ["note: 'Mochilas y balones para cada día'", "note: 'Gorros, mochilas, bolsos y balones'"],
    ["{ label: 'Mujer', go: 'mujer', note: 'Diseño para cada movimiento' }", "{ label: 'Ropa', go: 'ropa', note: 'Prendas para hombre y mujer' }"],
  ],
  'src/components/Footer.jsx': [
    ['Tienda multimarca de calzados, accesorios y ropa.', 'Tienda multimarca de calzados, ropa y accesorios.'],
    ['Zapatillas. Accesorios. <em>Tu estilo.</em>', 'Calzados. Ropa. Accesorios. <em>Tu estilo.</em>'],
  ],
  'src/components/CollectionPicker.jsx': [
    ['Explora mochilas y balones.', 'Gorros, mochilas, bolsos y balones.'],
    ['Una colección para cada etapa.<br />Elige por dónde quieres empezar.', 'Todo para combinar a tu manera.<br />Elige por dónde quieres empezar.'],
  ],
  'src/data/catalogs.js': [
    ['Mochilas y balones para acompañarte cada día.', 'Gorros, mochilas, bolsos y balones para acompañarte cada día.'],
  ],
  'src/data/products.js': [
    ['Mochilas y balones para tu día a día.', 'Gorros, mochilas, bolsos y balones para tu día a día.'],
  ],
  'src/lib/whatsapp.js': [
    ['Me gustaría recibir más información sobre las zapatillas y accesorios que venden.', 'Me gustaría recibir más información sobre sus calzados, ropa y accesorios.'],
  ],
  'index.html': [
    ['Catálogo y tienda de zapatillas y accesorios. Colecciones de hombre, mujer y accesorios. Consultas por WhatsApp.', 'Tienda multimarca de calzados, ropa y accesorios. Explora las colecciones de hombre y mujer y consulta tu pedido por WhatsApp.'],
    ['C &amp; E Store · Zapatillas Premium', 'C &amp; E Store · Calzados, Ropa y Accesorios'],
  ],
}

// Validate every expected phrase before writing so stale inputs fail without partial edits.
const prepared = Object.entries(edits).map(([file, replacements]) => {
  let text = fs.readFileSync(file, 'utf8')
  for (const [old, updated] of replacements) {
    const actual = old.includes('\n') && text.includes('\r\n') ? old.replaceAll('\n', '\r\n') : old
    if (!text.includes(actual)) throw Error(`Expected phrase missing in ${file}: ${old}`)
    text = text.replace(actual, updated.includes('\n') && text.includes('\r\n') ? updated.replaceAll('\n', '\r\n') : updated)
  }
  return [file, text]
})
for (const [file, text] of prepared) fs.writeFileSync(file, text)
console.log(`Updated store copy in ${prepared.length} files.`)
