/**
 * GUÍA DE TALLAS — fuente única de datos.
 * ============================================================================
 * Este archivo es el ÚNICO lugar donde se editan las equivalencias de talla.
 * SizeGuideModal.jsx no contiene ninguna cifra: solo lee de aquí.
 *
 * ── POR QUÉ SOLO HAY TALLAS PE, US Y LARGO ────────────────────────────────
 * La tienda vende en Perú, y en Perú el calzado se numera con el sistema
 * europeo: la talla peruana ES la europea, sin ninguna conversión. Por eso
 * una columna "EU" al lado de "PE" solo repetiría el mismo número. Se muestra
 * una sola columna, la peruana, que es la que ve el cliente al comprar.
 *
 * ── DÓNDE ESTÁN LOS DATOS Y CÓMO SE HAN CRUZADO ──────────────────────────
 * 1. PE = EU. En Perú el número de talla es el europeo, sin conversión.
 *    Fuente: Ripley/Saga Falabella Perú ("en Perú se usa la misma numeración
 *    que en Europa") y Sneakers Perú.
 *
 * 2. Largo del pie (cm). Es la única medida real: la norma europea Paris
 *    point (UNE-EN ISO 9237) define la talla como
 *        largo interior del zapato = largo del pie + 1,5 cm (margen de ajuste)
 *        paso entre tallas = 2/3 cm
 *    de donde salen los valores de esta tabla. Están contrastados con las
 *    tablas de tallas de retail de Perú y con los catálogos de Nike y Puma.
 *    Ojo: las tablas de retail redondean el largo al medio punto más cercano de
 *    la talla US, así que la progresión no es de 2/3 cm exactos, sino un poco
 *    irregular. Se conserva la progresión de retail porque es la que el cliente
 *    encuentra al comparar con otras tiendas.
 *
 * 3. Talla US. Se deriva de la longitud con las fórmulas oficiales del sistema
 *    estadounidense, que parten del largo de la horma en pulgadas:
 *        US hombre = (largo en pulgadas x 3) - 24
 *        US mujer  = (largo en pulgadas x 3) - 23
 *    Redondeadas a medios, dan los valores de abajo. Para un mismo número PE
 *    el resultado US no es el mismo en hombre que en mujer, por eso hay dos
 *    guías separadas.
 *
 * ── DIFERENCIA ENTRE HOMBRE Y MUJER ───────────────────────────────────────
 * El número PE/EU y el largo del pie son unisex: para un pie de 25 cm da igual
 * en las dos guías. Lo que cambia es la talla US, que corre 1 a 1,5 números por
 * encima en mujer. Ese es el motivo de las dos tablas separadas.
 *
 * ── SI CAMBIA EL RANGO DEL CATÁLOGO ────────────────────────────────────────
 * HOMBRE usa MEN_EU, MUJER usa WOMEN_EU. Si mañana los productos cubren otras
 * tallas, ajusta esos dos números y la tabla se reconstruye sola.
 * ============================================================================
 */

/**
 * Una talla peruana con sus equivalencias. `pe` es también la talla europea:
 * en Perú ambos números son el mismo, por eso no se duplica en la tabla.
 * `us` y `foot` van en número.
 */
const row = (pe, us, foot) => ({
  id: String(pe),
  pe: String(pe),
  us,
  foot,
})

/**
 * Rango de tallas realmente disponible en el catálogo.
 *   HOMBRE → 40 a 45  (ver menProducts.js)
 *   MUJER  → 36 a 41  (ver womenProducts.js)
 */
const MEN_ROWS = [
  row(40, 7, 25.0),
  row(41, 8, 25.8),
  row(42, 8.5, 26.2),
  row(43, 9.5, 27.1),
  row(44, 10, 27.5),
  row(45, 11, 28.3),
]

const WOMEN_ROWS = [
  row(36, 5.5, 22.5),
  row(37, 6, 22.9),
  row(38, 7, 23.7),
  row(39, 8, 24.5),
  row(40, 8.5, 25.0),
  row(41, 9.5, 25.8),
]

const COLUMNS = [
  { key: 'pe', label: 'Talla PE', primary: true },
  { key: 'us', label: 'Talla US' },
  { key: 'foot', label: 'Largo del pie', unit: 'cm' },
]

const INTRO =
  'En Perú el calzado se numera con el sistema europeo, así que tu talla peruana es la misma que la talla europea. Mide tu pie del talón al dedo más largo en centímetros y busca ese número en la última columna.'

const NOTE =
  'El largo del pie es la única medida real de la tabla: es lo que debes medir en casa. La talla peruana coincide con la europea, por eso no hay dos columnas. La talla US cambia según el género: en mujer corre de 1 a 1,5 números por encima que en hombre para el mismo pie. Las equivalencias son orientativas y pueden variar según la marca y el modelo; si estás entre dos tallas, elige la mayor.'

export const SIZE_GUIDES = {
  men: {
    id: 'men',
    title: 'Guía de tallas — Hombre',
    eyebrow: 'Hombre',
    intro: INTRO,
    note: NOTE,
    columns: COLUMNS,
    rows: MEN_ROWS,
  },

  women: {
    id: 'women',
    title: 'Guía de tallas — Mujer',
    eyebrow: 'Mujer',
    intro: INTRO,
    note: NOTE,
    columns: COLUMNS,
    rows: WOMEN_ROWS,
  },
}

/** 'hombre' | 'mujer' → 'men' | 'women' */
export const guideKeyFor = (category) => (category === 'mujer' ? 'women' : 'men')
