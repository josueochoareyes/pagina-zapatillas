import fs from 'node:fs'
const manifest = JSON.parse(fs.readFileSync(new URL('../../src/data/catalogImageMoves.json', import.meta.url), 'utf8'))
const moves = new Map([...manifest.files, ...manifest.aliases].map(f => [f.from, f.to]))
// Keep historical fixtures immutable; resolve paths after the authorized move.
export const resolveCatalogPath = oldPath => moves.get(oldPath) ?? oldPath
