// Run with the Vite preview on :5173 and an isolated headless Chrome on :9333.
// Uses Node's built-in WebSocket; no browser-testing dependency is installed.
import fs from 'node:fs'
import assert from 'node:assert/strict'

fs.mkdirSync('output/nosotros', { recursive: true })
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
  const openAbout = async () => {
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/nosotros' })
    for (let n = 0; n < 50; n++) {
      if (await evaluate(`Boolean(document.querySelector('.about-page'))`)) break
      await pause(100)
    }
    await evaluate('Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3000))])')
  }
  await openAbout()
  await check(`document.querySelector('h1').textContent.includes('Las marcas que conoces.')`, 'Retail hero present')
  await check(`document.querySelectorAll('.about-brand-band ul:not([aria-hidden]) li').length === 6`, 'Six accessible brand names')
  await check(`!/certificado|cuero|acabado manual|2011|10%|CRAFTED|fabricamos/i.test(document.querySelector('main').innerText + document.querySelector('footer').innerText)`, 'No manufacturing, certification, founding or discount claims')
  for (const width of [1440, 1024, 768, 390, 320]) {
    await viewport(width, width < 600 ? 844 : 1000)
    await pause(200)
    await check(`document.documentElement.scrollWidth <= document.documentElement.clientWidth`, `${width}px: no page overflow`)
    await check(`[...document.querySelectorAll('.about-photo-story img')].every(img => img.complete && img.naturalWidth > 0 && Math.abs(img.width / img.height - img.naturalWidth / img.naturalHeight) < .01)`, `${width}px: photos loaded without distortion or cropping`)
    await check(`[...document.querySelectorAll('.about-page h1,.about-page h2,.about-page p,.about-link')].every(el => {const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth + 1})`, `${width}px: text and buttons fit`)
    await check(`getComputedStyle(document.querySelector('h1')).fontFamily === getComputedStyle(document.querySelector('.about-intro__bottom p')).fontFamily`, `${width}px: consistent typography`)
    await check(`getComputedStyle(document.querySelector('.about-brand-band__track')).animationName === 'none' && [...document.querySelectorAll('.about-page .reveal')].every(el => getComputedStyle(el).opacity === '1')`, `${width}px: reduced motion shows content and stops marquee`)
    if (width !== 1024) {
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: await evaluate('document.documentElement.scrollHeight'), scale: 1 } })
      fs.writeFileSync(`output/nosotros/nosotros-${width}.png`, Buffer.from(shot.data, 'base64'))
    }
  }
  await viewport(1440)
  for (const category of ['hombre', 'mujer']) {
    await click(`.about-finale a[href="/catalogo/${category}"]`)
    await check(`location.pathname === '/catalogo/${category}' && document.querySelectorAll('.product-card').length === 9 && [...document.querySelectorAll('.product-card')].every(el => el.dataset.category === '${category}')`, `Final CTA opens ${category} and own products`)
    await openAbout()
  }
  await click('.about-intro a[href="/catalogo"]')
  await check(`location.pathname === '/catalogo'`, 'Main CTA opens collection picker')
  await openAbout()
  await click('a[href="#marcas"]')
  await pause(100)
  await check(`location.hash === '#marcas' && document.querySelector('#marcas').getBoundingClientRect().top >= 0`, 'Brands anchor lands below header')
  await check(`[...document.querySelectorAll('footer a')].every(a => ['/', '/catalogo', '/catalogo/hombre', '/catalogo/mujer', '/nosotros', '/contacto'].includes(a.getAttribute('href')) || a.href.startsWith('https://wa.me/'))`, 'Footer contains only real navigation and configured WhatsApp')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  await openAbout()
  for (const selector of ['.about-brands', '.about-selection', '.about-showcase', '.about-pillars', '.about-culture', '.about-finale']) {
    await evaluate(`document.querySelector('${selector}').scrollIntoView({behavior:'instant',block:'center'})`)
    await pause(750)
    await check(`document.querySelector('${selector} .reveal').classList.contains('is-in')`, `${selector}: scroll reveal works`)
  }
  await evaluate(`document.querySelector('.about-brand-band').scrollIntoView({behavior:'instant',block:'center'})`)
  await click('.about-brand-band button')
  await check(`document.querySelector('.about-brand-band button').getAttribute('aria-pressed') === 'true' && getComputedStyle(document.querySelector('.about-brand-band__track')).animationPlayState === 'paused'`, 'Marquee pause control works')
  await click('.about-brand-band button')
  await check(`document.querySelector('.about-brand-band button').getAttribute('aria-pressed') === 'false'`, 'Marquee resume control works')
  await evaluate(`document.querySelector('.about-shoe').scrollIntoView({behavior:'instant',block:'center'})`)
  const rect = await evaluate(`(() => {const r=document.querySelector('.about-shoe').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  await send('Input.dispatchMouseEvent', {type:'mouseMoved',...rect})
  await pause(600)
  await check(`getComputedStyle(document.querySelector('.about-shoe__image')).transform !== 'none'`, 'Shoe responds to real mouse hover')
  await evaluate(`document.querySelector('.about-finale a').focus()`)
  await check(`document.activeElement.matches('.about-finale a') && getComputedStyle(document.activeElement).outlineStyle !== 'none'`, 'Keyboard focus is visible')
  await key('Enter',13)
  await check(`location.pathname === '/catalogo/hombre'`, 'Keyboard activates collection CTA')
  assert.deepEqual(errors, [], 'No browser errors or warnings')
  fs.writeFileSync('output/nosotros/checks.json', JSON.stringify({results, consoleErrors:errors},null,2))
  console.log(`PASS ${results.length} checks; console clean`)
} finally { ws.close() }
