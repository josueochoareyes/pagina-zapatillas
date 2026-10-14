import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=fileURLToPath(new URL('../',import.meta.url))
const walk=dir=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`])
const actual=new Map(walk('images/Catalogo').map(file=>[file.toLowerCase(),file]))
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/data/catalogImageMoves.json'),'utf8'))
const fixes=manifest.files.filter(f=>actual.get(f.to.toLowerCase())!==f.to).map(f=>[f.to,actual.get(f.to.toLowerCase())])
if(fixes.some(([,to])=>!to)) throw Error('A migrated image is missing')
for(const file of walk('src/data').filter(f=>/\.(js|json)$/.test(f))){
  let text=fs.readFileSync(path.join(root,file),'utf8')
  for(const [from,to]of fixes) text=text.split(from).join(to)
  fs.writeFileSync(path.join(root,file),text)
}
console.log(JSON.stringify({caseCorrections:fixes},null,2))
