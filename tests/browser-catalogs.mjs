// Run with the Vite preview on :5173 and an isolated headless Chrome on :9333.
// Uses Node's built-in WebSocket; no browser-testing dependency is installed.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { CATALOGS, BRANDS } from '../src/data/catalogs.js'

fs.mkdirSync('output/catalogos', { recursive: true })
const tabs = await fetch('http://127.0.0.1:9333/json').then(r => r.json())
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }))
let id = 0
const pending = new Map()
const errors = []
const results = []
ws.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.id) {
    const callback = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) callback.reject(message.error)
    else callback.resolve(message.result)
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) errors.push(message.params.args.map(a => a.value).join(' '))
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject })
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const check = async (expression, message) => {
  assert.ok(await evaluate(expression), message)
  results.push(message)
  console.log('PASS', message)
}
const click = async selector => {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  await pause(70)
}
const search = async value => {
  await evaluate(`(() => { const el = document.getElementById('catalog-search'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input', { bubbles: true })); })()`)
  await pause(70)
}
const brand = async value => {
  await evaluate(`[...document.querySelectorAll('.brand-filter__button')].find(el => el.textContent === ${JSON.stringify(value)}).click()`)
  await pause(70)
}
const viewport = (width, height = 1000) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
const key = async (name, code) => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code: name, windowsVirtualKeyCode: code, ...(name === 'Enter' ? { text: '\r' } : {}) })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name, windowsVirtualKeyCode: code })
  await pause(70)
}

try {
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Page.bringToFront')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  for (const collection of Object.values(CATALOGS)) {
    await send('Page.navigate', { url: `http://127.0.0.1:5173/catalogo/${collection.id}` })
    for (let n = 0; n < 50; n++) {
      if (await evaluate(`Boolean(document.querySelector('.product-catalog--${collection.id} .product-card'))`)) break
      await pause(150)
    }
    await check(`document.querySelectorAll('.product-card').length === 12 && [...document.querySelectorAll('.product-card')].every(el => el.dataset.category === '${collection.id}')`, `${collection.label}: 12 own products, no mixed inventory`)
    await evaluate('Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3000))])')
    for (const width of [1440, 1024, 768, 390, 320]) {
      await viewport(width, width <= 390 ? 844 : 1000)
      await evaluate('window.scrollTo({top:0,behavior:"instant"})')
      await pause(100)
      const layout = await evaluate(`({ width: innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, columns: getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns.split(' ').length, cards: document.querySelectorAll('.product-card').length, font: getComputedStyle(document.querySelector('.product-card__name')).fontFamily, titleFont: getComputedStyle(document.querySelector('h1')).fontFamily })`)
      assert.ok(layout.scroll <= layout.client, `${collection.label} ${width}px: horizontal page overflow`)
      assert.equal(layout.columns, width === 1440 ? 4 : width >= 768 ? 3 : width === 390 ? 2 : 1)
      assert.equal(layout.font, layout.titleFont)
      results.push(`${collection.label} ${width}px: ${layout.columns} columns, no overflow, one font`)
      console.log('LAYOUT', collection.id, width, layout)
      await check(`!document.querySelector('main').innerText.includes('€') && !document.querySelector('.product-catalog input[type="range"]')`, `${collection.label} ${width}px: no prices or range filters`)
      if (width === 1440 || width === 390) {
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: await evaluate('document.documentElement.scrollHeight'), scale: 1 } })
        fs.writeFileSync(`output/catalogos/${collection.id}-${width === 1440 ? 'desktop' : 'mobile'}.png`, Buffer.from(shot.data, 'base64'))
      }
    }
    await viewport(1440)
    for (const name of BRANDS) {
      await brand(name)
      const expected = collection.products.filter(p => p.brand === name).length
      await check(`document.querySelectorAll('.product-card').length === ${expected} && document.querySelector('.catalog-results strong').textContent === '${expected}' && [...document.querySelectorAll('.product-card')].every(el => el.dataset.brand === ${JSON.stringify(name)} && el.dataset.category === '${collection.id}')`, `${collection.label}: ${name} filter and counter (${expected} confirmed models)`)
      if (!expected) await check(`Boolean(document.querySelector('.catalog-empty button'))`, `${collection.label}: ${name} has recoverable empty state`)
      await brand('Todos')
      await search(name)
      await check(`document.querySelectorAll('.product-card').length === ${expected}`, `${collection.label}: search by ${name}`)
      await search('')
    }
    await search(collection.products[0].name.toUpperCase())
    await check(`document.querySelectorAll('.product-card').length === 1 && document.querySelector('.catalog-results').textContent.includes('1 modelo')`, `${collection.label}: name search and singular counter`)
    await search('inexistente-12345')
    await click('.catalog-empty button')
    await check(`document.querySelectorAll('.product-card').length === 12 && document.getElementById('catalog-search').value === ''`, `${collection.label}: clear filters restores collection`)
    await evaluate(`(() => { const el=document.querySelector('.catalog-sort select'); el.value='nombre-asc'; el.dispatchEvent(new Event('change',{bubbles:true})); })()`)
    await pause(80)
    const actualNames = await evaluate(`[...document.querySelectorAll('.product-card__name')].map(el => el.textContent)`)
    assert.deepEqual(actualNames, [...actualNames].sort((a,b) => a.localeCompare(b,'es')))
    await click('.product-card__wish')
    await check(`document.querySelector('.product-card__wish').getAttribute('aria-pressed') === 'true'`, `${collection.label}: favorite selected`)
    await click('.bar__actions button[aria-label^="Favoritos"]')
    await check(`document.querySelectorAll('.favorites-view .product-card').length === 1`, `${collection.label}: header opens saved favorites`)
    await click('.favorites-view .product-card__wish')
    await check(`Boolean(document.querySelector('.favorites-view .catalog-empty'))`, `${collection.label}: removing favorite updates saved list`)
    await click('.favorites-view .catalog-empty button')
    await click(`.pcard__hit[aria-label*="${collection.label}"]`)
    await evaluate('document.querySelector(".product-card__swatches").scrollIntoView({block:"center",behavior:"instant"})')
    const swatchPoint = await evaluate('(() => { const r = document.querySelector(".product-card__swatches button:nth-child(2)").getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()')
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...swatchPoint })
    await pause(80)
    await check(`document.querySelector('.product-card__swatches button:nth-child(2)').getAttribute('aria-pressed') === 'true' && document.querySelector('.product-card__image').getAttribute('aria-label').includes(document.querySelector('.product-card__swatches button:nth-child(2)').title)`, `${collection.label}: pointer hover changes the product color without clicking`)
    await evaluate('document.querySelector(".product-card__swatches button:nth-child(3)").focus()')
    await check(`document.querySelector('.product-card__swatches button:nth-child(3)').getAttribute('aria-pressed') === 'true'`, `${collection.label}: keyboard focus previews color`)
    await click('.product-card__swatches button:nth-child(2)')
    await check(`document.querySelector('.product-card__swatches button:nth-child(2)').getAttribute('aria-pressed') === 'true'`, `${collection.label}: color selection`)
    await click('.product-card__add')
    await click('.bar__actions button[aria-label^="Carrito"]')
    await check(`document.querySelectorAll('.drawer--open .line').length === 1 && !document.querySelector('.drawer--open').innerText.includes('€')`, `${collection.label}: quick add and cart without prices`)
    await click('.drawer--open .qty button[aria-label="Sumar"]')
    await check(`document.querySelector('.drawer--open .qty span').textContent === '2'`, `${collection.label}: cart quantity`)
    await click('.drawer--open .line__remove')
    await key('Escape', 27)
    await evaluate('document.querySelector(".product-card__image-link").focus()')
    await key('Enter', 13)
    await check(`Boolean(document.querySelector('.modal')) && !document.querySelector('.modal').innerText.includes('€')`, `${collection.label}: keyboard product details without prices`)
    await click('.modal .btn--gold')
    await click('.bar__actions button[aria-label^="Carrito"]')
    await check(`document.querySelectorAll('.drawer--open .line').length === 1`, `${collection.label}: add from product details`)
    await key('Escape',27)
    await click('.bar__actions button[aria-label^="Buscar"]')
    await check(`document.activeElement.id === 'catalog-search'`, `${collection.label}: header search focuses input`)
    await viewport(390,844)
    await click('.iconbtn--burger')
    await check(`document.querySelector('.iconbtn--burger').getAttribute('aria-expanded') === 'true'`, `${collection.label}: mobile menu`)
    await check(`!document.querySelector('.mnav').innerText.includes('€')`, `${collection.label}: mobile menu does not expose prices`)
    await key('Escape',27)
    await viewport(1440)
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
    await evaluate('document.querySelector(".product-card__image-link").scrollIntoView({block:"center",behavior:"instant"})')
    const point = await evaluate('(() => { const r = document.querySelector(".product-card__image-link").getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()')
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point })
    await pause(500)
    await check(`(() => { const matrix = new DOMMatrix(getComputedStyle(document.querySelector('.product-card__image')).transform); return Math.hypot(matrix.a, matrix.b) > 1.1 && matrix.f < -8; })()`, `${collection.label}: image lifts and projects out of the card`)
    await check(`new DOMMatrix(getComputedStyle(document.querySelector('.product-card')).transform).f < -4`, `${collection.label}: card lifts on hover`)
    const hoverShot = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(`output/catalogos/${collection.id}-hover.png`, Buffer.from(hoverShot.data, 'base64'))
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await pause(100)
    await check(`getComputedStyle(document.querySelector('.product-card__image')).transform === 'none'`, `${collection.label}: reduced motion respected`)
    await check(`getComputedStyle(document.querySelector('.product-card')).transform === 'none'`, `${collection.label}: reduced motion also disables card lift`)
  }
  await search('no-resultados')
  await click('.collection-switch button:first-child')
  await check(`document.querySelectorAll('.product-card').length === 12 && location.pathname === '/catalogo/hombre'`, 'Switching collections resets filters and updates URL')
  await evaluate('history.back()')
  await pause(200)
  await check(`Boolean(document.querySelector('.product-catalog--mujer'))`, 'Browser Back restores correct collection')
  assert.deepEqual(errors, [], 'No console errors or warnings')
  fs.writeFileSync('output/catalogos/comprobaciones.json', JSON.stringify({ results, errors }, null, 2))
  console.log('COMPLETE', results.length, 'checks; no console errors or warnings')
} finally {
  ws.close()
}
