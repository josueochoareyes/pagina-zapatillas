import { useState } from 'react'
import nike from '../../images/brands/nike.svg'
import adidas from '../../images/brands/adidas.svg'
import puma from '../../images/brands/puma.svg'

const LOGOS = {
  Nike: { src: nike, id: 'nike' },
  Adidas: { src: adidas, id: 'adidas' },
  Puma: { src: puma, id: 'puma' },
}

export default function BrandMarquee() {
  const [paused, setPaused] = useState(false)
  // La selección visual es independiente de las marcas del catálogo.
  const shown = ['Nike', 'Adidas', 'Puma']

  // Duplicamos las marcas múltiples veces para asegurar scroll infinito sin espacios
  const duplicates = Array.from({ length: 6 }, (_, i) => i)

  return <div className={`about-brand-band ${paused ? 'is-paused' : ''}`}>
    <div className="about-brand-band__window"><div className="about-brand-band__track">{duplicates.map(duplicate => <ul key={duplicate} aria-label={duplicate === 0 ? 'Marcas de la tienda' : undefined} aria-hidden={duplicate > 0 || undefined}>{shown.map(brand => <li key={`${duplicate}-${brand}`}><img className={`about-brand-logo about-brand-logo--${LOGOS[brand].id}`} src={LOGOS[brand].src} alt={duplicate === 0 ? brand : ''} width="144" height="64" decoding="async" /></li>)}</ul>)}</div></div>
    <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Reanudar movimiento' : 'Pausar movimiento'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
  </div>
}
