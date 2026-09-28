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
  const navigate = async path => {
    await send('Page.navigate', { url: `http://127.0.0.1:5173${path}` })
    await pause(600)
  }
  const decoded = async selector => evaluate(`(async () => { const images = [...document.querySelectorAll(${JSON.stringify(selector)})]; if (!images.length) return false; images.forEach(img => img.loading = "eager"); await Promise.race([Promise.all(images.map(img => img.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 8000))]); return images.every(img => img.naturalWidth > 0); })()`)
  for (const path of ['/', '/catalogo', '/nosotros']) {
    await navigate(path)
    assert.ok(await decoded('main img'), `${path}: images load`)
  }
  let variants = 0
  for (const collection of Object.values(CATALOGS)) {
    await navigate(`/catalogo/${collection.id}`)
    for (const product of collection.products) {
      const card = `[data-product-id="${product.id}"]`
      for (let i = 0; i < product.colors.length; i++) {
        await click(`${card} .product-card__swatches button:nth-child(${i + 1})`)
        assert.ok(await decoded(`${card} img`), `${product.id}: card color ${i}`)
      }
      await click(`${card} .product-card__image-link`)
      for (let i = 0; i < product.colors.length; i++) {
        await click(`.modal .swatches button:nth-child(${i + 1})`)
        assert.ok(await decoded('.modal__art img'), `${product.id}: modal color ${i}`)
        variants++
      }
      await click('.modal__close')
      console.log('PASS', product.id, product.name)
    }
    await viewport(390, 844)
    assert.ok(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'No mobile horizontal overflow')
    await viewport(1440)
  }
  assert.deepEqual(errors, [])
  console.log(`PASS: 24 products, ${variants} variants, home/catalog/about images, mobile layout; no runtime errors`)
} finally {
  ws.close()
}
