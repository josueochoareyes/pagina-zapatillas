export const STORE_NAME = 'C & E Store'

/**
 * Numero de WhatsApp con prefijo internacional y sin signos.
 * Si tu numero no es español, ajusta el prefijo (34 = España, 52 = México, 51 = Perú...).
 */
export const WHATSAPP_NUMBER = '51983629195'
export const WHATSAPP_DISPLAY = '+51 983 629 195'

const siteUrl = () => {
  if (typeof window === 'undefined') return ''
  return window.location.origin + window.location.pathname
}

export const waLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export const generalMessage = () =>
  [
    `Hola ${STORE_NAME},`,
    '',
    'Me gustaría recibir más información sobre las zapatillas que venden.',
    '',
    `Web: ${siteUrl()}`,
  ].join('\n')

export const productMessage = (product, colorway, size, includePrices = true) =>
  [
    `Hola ${STORE_NAME},`,
    '',
    `Me interesa este modelo: *${product.name}*`,
    `Color: ${colorway.name}`,
    `Talla: ${size ?? 'sin especificar'}`,
    ...(includePrices ? [`Precio: ${product.price} €`] : []),
    '',
    `¿Lo tienen disponible? ¿Me confirman el envío?`,
    '',
    `Web: ${siteUrl()}`,
  ].join('\n')

export const favoritesMessage = (products) => [
  products.length === 1 ? 'Hola, estoy interesado en este producto:' : 'Hola, estoy interesado en estos productos:',
  ...products.map(p => '\nMarca: ' + p.brand + '\nModelo: ' + p.name),
].join('\n')

export const cartMessage = (items) => [
  items.reduce((sum, item) => sum + item.qty, 0) === 1 ? 'Hola, quiero comprar el siguiente producto:' : 'Hola, quiero comprar los siguientes productos:',
  ...items.map(item => '\nMarca: ' + item.brand + '\nModelo: ' + item.name + '\nTalla: ' + item.size + '\nColor: ' + item.color.name + '\nCantidad: ' + item.qty),
].join('\n')
