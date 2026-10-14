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
            C &amp; E Store
          </p>
        </div>

        <div className="edit__copy">
          <span className="eyebrow">Marcas para tu día a día</span>
          <h2 className="edit__title">
            De la marca
            <br />
            <em>que eliges</em>
          </h2>
          <p className="edit__lead">
            Combina tus calzados favoritos con ropa y accesorios de nuestra selección.
            Descubre las marcas, elige tus colores y dale tu toque a cada conjunto.
          </p>          <button className="btn btn--primary" type="button" onClick={onExplore}>
            Explorar catálogo
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  )
}
