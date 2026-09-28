import { swatchBackground } from '../lib/swatch'
﻿import { useEffect, useMemo, useState } from 'react'
import SneakerArt from './SneakerArt'
import ProductImage from './ProductImage'
import brownPhoto from '../../images/Inicio/Zapatillas Suede Dressed/Marron.png'
import blackPhoto from '../../images/Inicio/Zapatillas Suede Dressed/Negro.png'
import { PRODUCTS } from '../data/products'
import { BRANDS } from '../data/catalogs'

const FEATURED = PRODUCTS.find((p) => p.id === 'h-puma-02') || PRODUCTS[0]

/*
 * La tienda no muestra precios ni descuentos en portada: se confirman por
 * WhatsApp. Aquí solo van cifras del catálogo que existen en los datos,
 * sin valoraciones, ventas ni plazos de envío inventados.
 */
const STATS = [
  [String(PRODUCTS.length), 'Modelos', 'disponibles'],
  [String(BRANDS.length), 'Marcas', 'en la tienda'],
  ['2', 'Colecciones', 'hombre y mujer'],
]

export default function Hero({ onExplore }) {
  const heroColors = useMemo(() => FEATURED.colors.map(color => ({ ...color, photo: color.name === 'Negro' ? blackPhoto : brownPhoto })), [])
  const defaultIndex = heroColors.findIndex((c) => c.name.includes('Oro') || c.name.includes('Marrón'))
  const [shown, setShown] = useState(heroColors[defaultIndex >= 0 ? defaultIndex : 0])
  const [on, setOn] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className="hero" id="top">
      <span className="hero__bg" aria-hidden="true" />

      <div className="shell hero__inner">
        <div className="hero__copy">
          <span className={`eyebrow reveal ${on ? 'is-in' : ''}`} style={{ '--d': '0ms' }}>
            Nueva temporada 2026
          </span>

          <h1 className="hero__title">
            <span className={`tline reveal ${on ? 'is-in' : ''}`} style={{ '--d': '70ms' }}>
              Zapatillas
            </span>
            <span className={`tline reveal ${on ? 'is-in' : ''}`} style={{ '--d': '140ms' }}>
              que <em>declaran</em>
            </span>
            <span className={`tline reveal ${on ? 'is-in' : ''}`} style={{ '--d': '210ms' }}>
              tu estilo
            </span>
          </h1>

          <p className={`hero__lead reveal ${on ? 'is-in' : ''}`} style={{ '--d': '300ms' }}>
            Una tienda multimarca con colecciones de <strong>hombre</strong> y <strong>mujer</strong>.
            Elige tu modelo, tu talla y tu color, y confírmalo con nosotros.
          </p>

          <div className={`hero__cta reveal ${on ? 'is-in' : ''}`} style={{ '--d': '370ms' }}>
            <button className="btn btn--primary" type="button" onClick={onExplore}>
              Ver catálogo
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a className="btn btn--quiet" href="#ventajas">
              Por qué C &amp; E Store
            </a>
          </div>

          <dl className={`hero__stats reveal ${on ? 'is-in' : ''}`} style={{ '--d': '440ms' }}>
            {STATS.map(([n, l1, l2]) => (
              <div key={l1} className="stat">
                <dt className="stat__num">{n}</dt>
                <dd className="stat__label">
                  {l1}
                  <br />
                  {l2}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure
          className={`hero__stage reveal ${on ? 'is-in' : ''}`}
          style={{ '--d': '170ms', '--cw-accent': shown.accent }}
        >
          <p className="hero__index" aria-hidden="true">
            01 <span>/ {PRODUCTS.length}</span>
          </p>

          <div className="hero__panel">
            <span className="hero__guides" aria-hidden="true" />
            <span className="hero__ground" aria-hidden="true" />
            <p className="hero__stamp" aria-hidden="true">
              C &amp; E — Tienda multimarca
            </p>

            <div className="hero__art" key={shown.name}>
              {shown.photo ? (
                <ProductImage
                  src={shown.photo} 
                  alt={`${FEATURED.name} - ${shown.name}`}
                  className="hero__sneaker-photo"
                  loading="eager"
                />
              ) : (
                <SneakerArt colorway={shown} className="hero__sneaker" title={FEATURED.name} />
              )}
            </div>
          </div>

          <figcaption className="hero__meta">
            <div className="hero__id">
              <p className="hero__id-brand">{FEATURED.brand}</p>
              <h2 className="hero__id-name">{FEATURED.name}</h2>
              <p className="hero__id-type">
                {FEATURED.type} · <span>{shown.name}</span>
              </p>
            </div>
          </figcaption>

          <div className="hero__colors">
            <span className="hero__colors-label">Color</span>
            <div className="swatches swatches--lg" role="group" aria-label="Colores del producto destacado">
              {heroColors.map((cw) => (
                <button
                  key={cw.name}
                  type="button"
                  className={`swatch swatch--ring ${cw.name === shown.name ? 'is-on' : ''}`}
                  style={{ background: swatchBackground(cw) }}
                  onClick={() => setShown(cw)}
                  onMouseEnter={() => setShown(cw)}
                  title={cw.name}
                  aria-label={`Ver ${cw.name}`}
                  aria-pressed={cw.name === shown.name}
                />
              ))}
            </div>
            <span className="hero__color-name">{shown.name}</span>
          </div>
        </figure>
      </div>
    </section>
  )
}
