import { useReveal } from '../lib/useReveal'

/*
 * C & E Store es una tienda multimarca: no fabrica ni diseña.
 * Las cifras reales viven en las estadísticas del hero; aquí solo conceptos.
 */
const PILLARS = [
  {
    n: '01',
    title: ['Selección', 'multimarca'],
    text: 'Nike, Adidas y Puma en un mismo lugar.',
    meta: 'Deportivo · Urbano · Clásico',
  },
  {
    n: '02',
    title: ['Para cada', 'estilo'],
    text: 'Zapatillas para hombre y mujer, y accesorios para completar tu estilo.',
    meta: 'Hombre · Mujer · Accesorios',
  },
  {
    n: '03',
    title: ['Compra', 'fácil'],
    text: 'Elige tu modelo y color, y confirma los detalles de tu pedido por WhatsApp.',
    meta: 'Carrito · WhatsApp',
  },
]

/** Cierre editorial del hero: un índice de lo que la tienda ofrece de verdad. */
export default function Values() {
  const [ref, visible] = useReveal()

  return (
    <section className="values" id="ventajas" ref={ref}>
      <div className="shell">
        <header className={`values__head reveal ${visible ? 'is-in' : ''}`}>
          <p className="values__kicker">Lo que encuentras aquí</p>
          <p className="values__note">C &amp; E Store · Tienda multimarca</p>
        </header>

        <ol className="values__row">
          {PILLARS.map((v, i) => (
            <li
              key={v.n}
              className={`value reveal ${visible ? 'is-in' : ''}`}
              style={{ '--d': `${140 + i * 90}ms` }}
            >
              <span className="value__n" aria-hidden="true">
                {v.n}
              </span>
              <h3 className="value__title">
                {v.title[0]}
                <br />
                <span>{v.title[1]}</span>
              </h3>
              <p className="value__text">{v.text}</p>
              <p className="value__meta">{v.meta}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
