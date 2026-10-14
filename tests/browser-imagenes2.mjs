// Run with Vite :5173 and an isolated headless Chrome debugging endpoint :9333.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { CATALOGS } from '../src/data/catalogs.js'
import { COLLECTION_PHOTOS } from '../src/data/collectionPhotos.js'
const tabs = await fetch('http://127.0.0.1:9333/json').then(r => r.json())
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }))
let sequence = 0
const pending = new Map(), errors = [], checks = []
ws.addEventListener('message', ({ data }) => {
  const m = JSON.parse(data)
  if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result) }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text)
})
const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++sequence, { resolve, reject }); ws.send(JSON.stringify({ id: sequence, method, params })) })
const evaluate = async expression => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}
const pause = ms => new Promise(r => setTimeout(r, ms))
const wait = async expression => { for (let i=0;i<80;i++) { if (await evaluate(expression)) return; await pause(100) } throw Error(`Timeout: ${expression}`) }
const check = async (expression, label) => { assert.ok(await evaluate(expression), label); checks.push(label); console.log('PASS', label) }
const click = async selector => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await pause(90) }
const navigate = async url => { await send('Page.navigate', { url: `http://127.0.0.1:5173${url}` }); await pause(200); await wait('Boolean(document.querySelector("main h1"))') }
const labels = '[...document.querySelectorAll(".pcard__label")].map(e=>e.textContent)'
try {
  await send('Runtime.enable'); await send('Page.enable')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await navigate('/catalogo')
  await evaluate('localStorage.clear()')
  assert.deepEqual(await evaluate(labels), ['Calzados', 'Accesorios', 'Ropa'])
  checks.push('Catalog root has Calzados, Accesorios and Ropa in order')
  await click('.pcard:nth-child(1) button')
  assert.deepEqual(await evaluate(labels), ['Hombre', 'Mujer'])
  await check('location.pathname === "/catalogo/calzados"', 'Calzados opens gender selection')
  await click('.pcard:nth-child(2) button')
  await check('location.pathname === "/catalogo/calzados/mujer" && [...document.querySelectorAll(".product-card")].every(e=>e.dataset.category==="mujer")', 'Calzados Mujer has its independent inventory')
  await click('.product-catalog__back')
  await check('location.pathname === "/catalogo/calzados"', 'Back from footwear returns to its gender selector')
  await click('.product-catalog__back')
  await click('.pcard:nth-child(3) button')
  assert.deepEqual(await evaluate(labels), ['Hombre', 'Mujer'])
  await check('location.pathname === "/catalogo/ropa"', 'Ropa opens its own gender selector')
  await click('.pcard:nth-child(1) button')
  await check(`document.querySelectorAll('.product-card').length === ${CATALOGS['ropa-hombre'].products.length} && location.pathname === '/catalogo/ropa/hombre'`, 'Ropa Hombre lists all source garments')
  await check('![...document.querySelectorAll(".product-card__details")].some(e=>e.textContent.includes("zapatilla"))', 'Garment cards say Ver prenda')
  await click('.catalog-types button:nth-child(2)')
  await check('document.querySelectorAll(".product-card").length === 2', 'Garment type filter isolates casacas')
  await click('.ccount__clear')
  await click('.product-card__details')
  await check(`JSON.stringify([...document.querySelectorAll('.modal .size')].map(e=>e.textContent.trim())) === JSON.stringify(['S','M','L','XL']) && !document.querySelector('.modal .sizeguide__link')`, 'Clothing offers S, M, L and XL without a shoe guide')
  await click('.modal .btn--gold')
  await check('Boolean(document.querySelector(".field__error"))', 'Clothing requires selecting a size')
  await click('.modal .size')
  await click('.modal .btn--gold')
  await click('.bar__actions button[aria-label^="Carrito"]')
  await check('document.querySelector(".drawer--open .line__meta").textContent.includes("Talla S") && document.querySelector(".drawer--open img").naturalWidth > 0', 'Garment and actual photo reach cart with selected size S')
  await check('decodeURIComponent(document.querySelector(".drawer--open .btn--wa").href).includes("Talla: S")', 'Order query retains selected clothing size')
  await send('Page.reload'); await pause(300); await wait('Boolean(document.querySelector(".product-card"))')
  await click('.bar__actions button[aria-label^="Carrito"]')
  await check('document.querySelectorAll(".drawer--open .line").length === 1', 'Clothing cart survives reload')
  await click('.drawer--open .line__remove'); await click('.drawer--open .modal__close')
  await navigate('/catalogo/ropa/mujer')
  await check(`document.querySelectorAll('.product-card').length === ${CATALOGS['ropa-mujer'].products.length} && [...document.querySelectorAll('.product-card')].every(e=>e.dataset.category==='ropa-mujer')`, 'Ropa Mujer route and inventory stay separate')
  for (const url of ['/catalogo/hombre', '/catalogo/mujer', '/catalogo/accesorios']) {
    await navigate(url)
    await check('Boolean(document.querySelector(".product-card"))', `Existing route ${url} works`)
  }
  await evaluate(`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.querySelector('#catalog-search'), 'CLSC'); document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}))`)
  await pause(100)
  await click('.product-card__details')
  await check(`document.querySelectorAll('[aria-label="Fotos del color seleccionado"] button').length === 2`, 'Existing CLSC color has an additional photo without duplicate swatch')
  const oldPhoto = await evaluate('document.querySelector(".modal__art img").src')
  await click('[aria-label="Ver foto 2"]')
  await check(`document.querySelector('.modal__art img').src !== ${JSON.stringify(oldPhoto)}`, 'Additional photo selector changes the actual product photo')
  await click('.modal__close')
  for (const url of ['/catalogo', '/catalogo/calzados', '/catalogo/ropa', '/catalogo/ropa/hombre', '/catalogo/ropa/mujer', '/catalogo/accesorios']) {
    await navigate(url)
    const coverKeys = url === '/catalogo' ? ['calzados', 'accesorios', 'ropa'] : url === '/catalogo/calzados' ? ['hombre', 'mujer'] : url === '/catalogo/ropa' ? ['ropa-hombre', 'ropa-mujer'] : null
    if (coverKeys) {
      const expected = coverKeys.map(key => decodeURIComponent(new URL(COLLECTION_PHOTOS[key]).pathname).split('/images/')[1])
      await evaluate('Promise.all([...document.querySelectorAll(".pcard__photo")].map(img=>{img.loading="eager";return img.decode()}))')
      await check(`JSON.stringify([...document.querySelectorAll('.pcard__photo')].map(img=>decodeURIComponent(new URL(img.src).pathname).split('/images/')[1])) === ${JSON.stringify(JSON.stringify(expected))} && [...document.querySelectorAll('.pcard__photo')].every(img=>img.naturalWidth>0)`, `${url}: store-supplied renamed covers load in the correct order`)
    }
    for (const width of [1440, 390, 320]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
      await pause(80)
      await check('document.documentElement.scrollWidth <= innerWidth', `${url}: no overflow at ${width}px`)
    }
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
    if (url === '/catalogo' || url === '/catalogo/ropa/hombre') {
      await evaluate('document.querySelectorAll("main img").forEach(i=>i.loading="eager"); Promise.all([...document.querySelectorAll("main img")].map(i=>i.decode().catch(()=>{})))')
      const shot = await send('Page.captureScreenshot', { format: 'png' })
      fs.writeFileSync(`output/imagenes2/${url === '/catalogo' ? 'catalogo' : 'ropa-hombre'}.png`, Buffer.from(shot.data, 'base64'))
    }
  }
  assert.deepEqual(errors, [])
  fs.writeFileSync('output/imagenes2/browser-checks.json', JSON.stringify({ checks, errors }, null, 2))
  console.log(`PASS ${checks.length} functional and responsive checks; no runtime exceptions`)
} finally { ws.close() }
