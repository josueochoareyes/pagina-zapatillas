import { useReveal } from '../lib/useReveal'
import editorialPhoto from '../../images/Inicio/Delamarcaqueeliges/png.png'
import ProductImage from './ProductImage'


/**
 * Bloque editorial que cierra el hero. Una sola pieza de la selección,
 * mucha aire y una composición visual en lugar de una rejilla de productos.
 */
export default function EditFeature({ onExplore }) {
  const [ref, visible] = useReveal()

  return (
    <section className="edit" id="edit" ref={ref}>
      <div className={`shell edit__inner reveal ${visible ? 'is-in' : ''}`}>
        <div className="edit__visual">
          <span className="edit__disc" aria-hidden="true" />
          <span className="edit__ring" aria-hidden="true" />
          <ProductImage src={editorialPhoto} className="edit__sneaker" alt="Selección de marcas de C & E Store" loading="lazy" />
          <p className="edit__fig">
            <span>Fig. 01</span>
            {EDIT.name} — {EDIT_COLOR.name}
          </p>
        </div>

        <div className="edit__copy">
          <span className="eyebrow">Pieza destacada</span>
          <h2 className="edit__title">
            De la marca
            <br />
            <em>que eliges</em>
          </h2>
          <p className="edit__lead">
            Una de las piezas de nuestra selección actual. Mira sus colores, comprueba
            tu talla y confírmala por WhatsApp cuando la tengas decidida.
          </p>          <button className="btn btn--primary" type="button" onClick={onExplore}>
            Ver colección
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  )
}
