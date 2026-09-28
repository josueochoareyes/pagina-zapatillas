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
 await send('Page.enable'); await send('Runtime.enable');
 const ready = async () => {
  await pause(500);
  await evaluate('Promise.all([...document.querySelectorAll("main img")].map(i=>{i.loading="eager";return i.decode().catch(()=>{});} ))');
  await pause(300);
 };
 for(const width of [1440,390]) {
  await viewport(width,1000);
  for(const path of ['/catalogo/hombre','/catalogo/mujer','/']) {
   await send('Page.navigate',{url:'http://127.0.0.1:5173'+path}); await ready();
   assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
   if(path==='/') {
    await evaluate('document.querySelector(".edit").scrollIntoView({block:"center"})'); await pause(500);
   }
   const shot=await send('Page.captureScreenshot',{format:'png'});
   fs.writeFileSync(`output/presentation-${path.split('/').pop()||'home'}-${width}.png`,Buffer.from(shot.data,'base64'));
   if(path.includes('catalogo')) {
    assert.ok(await evaluate('[...document.querySelectorAll(".product-card__image")].every(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return Math.abs(r.width-p.width)<1&&Math.abs(r.height-p.height)<1})'));
    const point=await evaluate('(()=>{const r=document.querySelector(".product-card__image-link").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',...point}); await pause(700);
    assert.ok(await evaluate('getComputedStyle(document.querySelector(".product-card__image-link")).overflow === "hidden"'));
    const hover=await send('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(`output/presentation-hover-${path.split('/').pop()}-${width}.png`,Buffer.from(hover.data,'base64'));
   }
  }
 }
 await send('Page.navigate',{url:'http://127.0.0.1:5173/catalogo/hombre'}); await ready();
 for (const [w,h] of [[1200,600],[800,800],[600,1200]]) {
  const result=await evaluate(`(async()=>{
   const img=document.querySelector('.product-photo img');
   img.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#eee"/><rect x="${w*.15}" y="${h*.15}" width="${w*.7}" height="${h*.7}" fill="#253549"/></svg>');
   await img.decode(); await new Promise(r=>setTimeout(r,200));
   const ir=img.getBoundingClientRect(), fr=img.closest('.product-photo').getBoundingClientRect();
   return {ratio:ir.width/ir.height, visible:ir.x+ir.width*.15>=fr.x && ir.x+ir.width*.85<=fr.right && ir.y+ir.height*.15>=fr.y && ir.y+ir.height*.85<=fr.bottom};
  })()`);
  assert.ok(Math.abs(result.ratio-w/h)<.01 && result.visible, `Uncropped proportional ${w}x${h}`);
 }
 assert.deepEqual(errors.filter(e=>!e.includes('fetchPriority')),[]);
 console.log('PASS: full photo canvas, clipped soft hover, desktop/mobile, and horizontal/square/portrait fit.');
} finally { ws.close(); }
