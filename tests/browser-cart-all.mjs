// End-to-end cart and WhatsApp payload audit. Never opens or sends WhatsApp messages.
// Requires local Vite :5173 and isolated Chrome with remote debugging :9333.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { CATALOGS } from '../src/data/catalogs.js'
import { cartMessage, waLink, WHATSAPP_NUMBER } from '../src/lib/whatsapp.js'

const tabs = await fetch('http://127.0.0.1:9333/json').then(r => r.json())
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map(), errors = [], results = []
ws.addEventListener('message', ({ data }) => {
  const m = JSON.parse(data)
  if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result) }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text)
})
const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })) })
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}
const pause = ms => new Promise(r => setTimeout(r, ms))
const wait = async expression => { for (let n=0;n<80;n++) { if (await evaluate(expression)) return; await pause(100) } throw Error(`Timeout ${expression}`) }

try {
  await send('Runtime.enable'); await send('Page.enable')
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/catalogo' })
  await pause(300); await wait('Boolean(document.querySelector(".pcard"))')
  await evaluate('localStorage.clear()')
  for (const collection of Object.values(CATALOGS)) {
    await send('Page.navigate', { url: `http://127.0.0.1:5173/catalogo/${collection.id}` })
    await pause(250); await wait(`Boolean(document.querySelector('.product-catalog--${collection.id} .product-card'))`)
    for (const product of collection.products) {
      for (let ci=0;ci<product.colors.length;ci++) {
        const result = await evaluate(`(async () => {
          const tick = () => new Promise(r=>setTimeout(r,20));
          const click = async selector => { const el=document.querySelector(selector); if(!el) throw Error('Missing '+selector); el.click(); await tick(); };
          await click(${JSON.stringify(`[data-product-id="${product.id}"] .product-card__details`)});
          await click('.modal .swatches button:nth-child(${ci+1})');
          const options=[...document.querySelectorAll('.modal .size:not(:disabled)')];
          if (!options.length) throw Error('No selectable sizes');
          const size=options.at(-1).textContent.trim(); options.at(-1).click(); await tick();
          const direct = document.querySelector('.modal .btn--wa').href;
          await click('.modal .qty button[aria-label="Sumar uno"]');
          await click('.modal .btn--gold');
          if(document.querySelector('.modal')) throw Error('Add did not close product');
          await click('.bar__actions button[aria-label^="Carrito"]');
          const line=document.querySelector('.drawer--open .line');
          const result={size,options:options.map(e=>e.textContent.trim()),direct,href:document.querySelector('.drawer--open .btn--wa').href,
            name:line.querySelector('.line__name').textContent,brand:line.querySelector('.line__brand').textContent,
            meta:line.querySelector('.line__meta').textContent,qty:line.querySelector('.qty span').textContent.trim(),
            lines:document.querySelectorAll('.drawer--open .line').length};
          await click('.drawer--open .line__remove');
          await click('.drawer--open .modal__close');
          return result;
        })()`)
        const expected = { ...product, color: product.colors[ci], size: result.size, qty: 2 }
        assert.equal(result.name, product.name)
        assert.equal(result.brand, product.brand)
        assert.ok(result.meta.includes(product.colors[ci].name))
        assert.ok(result.meta.includes(`Talla ${result.size}`))
        assert.equal(result.qty, '2'); assert.equal(result.lines, 1)
        assert.equal(new URL(result.href).pathname, `/${WHATSAPP_NUMBER}`)
        assert.equal(new URL(result.href).searchParams.get('text'), cartMessage([expected]))
        const direct = new URL(result.direct)
        assert.equal(direct.pathname, `/${WHATSAPP_NUMBER}`)
        const message = direct.searchParams.get('text')
        assert.ok(message.includes(product.name))
        assert.ok(message.includes(`Color: ${product.colors[ci].name}`))
        assert.ok(message.includes(`Talla: ${result.size}`))
        if (collection.id.startsWith('ropa-')) assert.deepEqual(result.options, ['S','M','L','XL'])
        results.push({ productId: product.id, color: product.colors[ci].name, size: result.size, quantity: 2, passed: true })
      }
      console.log('PASS', product.id, product.colors.length, 'variants: cart + WhatsApp')
    }
  }
  // Mixed-category order, quantity updates and reload persistence.
  await evaluate('localStorage.clear()')
  const mixed = []
  for (const category of ['hombre','ropa-mujer','accesorios']) {
    const product=CATALOGS[category].products[0]
    await send('Page.navigate',{url:`http://127.0.0.1:5173/catalogo/${category}`})
    await pause(250); await wait(`Boolean(document.querySelector('[data-product-id="${product.id}"]'))`)
    const size=await evaluate(`(async()=>{
      const tick=()=>new Promise(r=>setTimeout(r,30));
      document.querySelector('[data-product-id="${product.id}"] .product-card__details').click(); await tick();
      const s=document.querySelector('.modal .size:not(:disabled)'); const size=s.textContent.trim(); s.click(); await tick();
      document.querySelector('.modal .btn--gold').click(); await tick(); return size;
    })()`)
    mixed.push({...product,color:product.colors[0],size,qty:1})
  }
  await evaluate(`document.querySelector('.bar__actions button[aria-label^="Carrito"]').click()`)
  await pause(100)
  assert.equal(await evaluate(`document.querySelector('.drawer--open .btn--wa').href`),waLink(cartMessage(mixed)))
  await evaluate(`document.querySelector('.drawer--open .qty button[aria-label="Sumar"]').click()`)
  await pause(100); mixed[0].qty=2
  assert.equal(await evaluate(`document.querySelector('.drawer--open .btn--wa').href`),waLink(cartMessage(mixed)))
  await send('Page.reload'); await pause(300); await wait('Boolean(document.querySelector(".product-card"))')
  await evaluate(`document.querySelector('.bar__actions button[aria-label^="Carrito"]').click()`); await pause(100)
  assert.equal(await evaluate(`document.querySelector('.drawer--open .btn--wa').href`),waLink(cartMessage(mixed)))
  assert.deepEqual(errors,[])
  fs.mkdirSync('output/imagenes2',{recursive:true})
  const report={products:Object.values(CATALOGS).reduce((n,c)=>n+c.products.length,0),variants:results.length,results,mixedOrder:true,quantityChange:true,persistence:true,errors}
  fs.writeFileSync('output/imagenes2/cart-audit.json',JSON.stringify(report,null,2))
  console.log(`PASS: ${report.products} products / ${report.variants} variants; selected sizes, colors, quantities, WhatsApp URLs, mixed order and reload persistence. No messages sent.`)
} finally { ws.close() }
