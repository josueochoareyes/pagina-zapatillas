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
 await send('Page.enable'); await send('Runtime.enable'); await viewport(1440,1000);
 await send('Page.navigate',{url:'http://127.0.0.1:5173/catalogo/hombre'}); await pause(700);
 await evaluate('localStorage.removeItem("ce-store:cart:v1");localStorage.removeItem("ce-store:wishes:v1")');
 await send('Page.reload'); await pause(700);
 await click('[data-product-id="h-nike-01"] .product-card__wish');
 await click('[data-product-id="h-nike-02"] .product-card__wish');
 await click('button[aria-label^="Favoritos,"]');
 assert.equal(await evaluate('document.querySelector(".favorites-selection button").disabled'),true);
 await click('.favorite-select input');
 const link=async selector=>new URL(await evaluate(`document.querySelector(${JSON.stringify(selector)}).href`));
 let url=await link('.favorites-selection a');
 assert.equal(url.pathname,'/51983629195');
 let message=url.searchParams.get('text');
 assert.ok(message.includes('Marca: Nike') && message.includes("Dise\u00f1o: Air Force 1 '07 LV8 Denim"));
 assert.ok(!message.includes('Talla:')&&!message.includes('Color:')&&!message.includes('Precio:'));
 await click('.favorites-selection input');
 assert.equal(await evaluate('document.querySelectorAll(".favorite-select input:checked").length'),2);
 await click('.favorite-select input');
 message=(await link('.favorites-selection a')).searchParams.get('text');
 assert.ok(!message.includes('Denim')&&message.includes('Nike Air Force 1'));
 await click('[data-product-id="h-nike-02"] .product-card__swatches button:nth-child(2)');
 await click('[data-product-id="h-nike-02"] .product-card__add');
 assert.equal(await evaluate('document.querySelector(".modal .swatches button:nth-child(2)").getAttribute("aria-pressed")'),'true');
 await click('.modal .btn--gold');
 assert.ok(await evaluate('Boolean(document.querySelector(".field__error"))'));
 assert.equal(await evaluate('document.querySelectorAll(".drawer .line").length'),0);
 await evaluate('[...document.querySelectorAll(".modal .size")].find(b=>b.textContent==="46").click()'); await pause(70);
 await click('.modal .btn--gold');
 await click('button[aria-label^="Carrito,"]');
 message=(await link('.drawer__foot a')).searchParams.get('text');
 assert.ok(message.includes('Marca: Nike')&&message.includes('Talla: 46')&&message.includes('Color: Negro'));
 assert.equal(await evaluate('document.querySelectorAll(".drawer__foot a,.drawer__foot button").length'),1);
 await click('.drawer__head button');
 await click('[data-product-id="h-nike-01"] .product-card__add');
 await evaluate('[...document.querySelectorAll(".modal .size")].find(b=>b.textContent==="41").click()'); await pause(70);
 await click('.modal .btn--gold');
 await click('button[aria-label^="Carrito,"]');
 assert.equal(await evaluate('document.querySelectorAll(".drawer .line").length'),2);
 message=(await link('.drawer__foot a')).searchParams.get('text');
 assert.ok(message.includes('los siguientes productos')&&message.includes('Talla: 41')&&message.includes('Color: Beige')&&message.includes('Talla: 46')&&message.includes('Color: Negro'));
 await send('Page.reload'); await pause(700);
 await click('button[aria-label^="Carrito,"]');
 assert.equal((await link('.drawer__foot a')).searchParams.get('text'),message);
 for(const width of [1440,390]) {
  await viewport(width,1000);await pause(300);
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`output/orders-cart-${width}.png`,Buffer.from(shot.data,'base64'));
 }
 await click('.drawer__head button');
 await click('.favorites-selection input');
 await pause(300);
 const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('output/orders-favorites-mobile.png',Buffer.from(shot.data,'base64'));
 assert.deepEqual(errors,[]);
 console.log('PASS: favorites subset/all, exact WhatsApp recipient/messages, explicit sizes and preserved colors, multiple cart lines, persistence, single checkout, desktop/mobile; no console errors. No messages sent.');
} finally { ws.close(); }
