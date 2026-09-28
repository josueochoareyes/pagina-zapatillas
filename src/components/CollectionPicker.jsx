import hombrePhoto from '../../images/Catalogo/hombre.png'
import mujerPhoto from '../../images/Catalogo/mujer.png'
import { CATEGORIES, byCategory } from '../data/products'
import { useReveal } from '../lib/useReveal'
import CollectionCard from './CollectionCard'

const COPY = {
  hombre: { photo: hombrePhoto, line: 'Explora la colección masculina.', note: 'Carácter en cada paso' },
  mujer: { photo: mujerPhoto, line: 'Explora la colección femenina.', note: 'Tu estilo, tu ritmo' },
}
const COLLECTIONS = CATEGORIES.map((category) => ({
  ...category, ...COPY[category.id], count: byCategory(category.id).length,
}))

export default function CollectionPicker({ onPick }) {
  const [ref, visible] = useReveal()
  return (
    <section className="picker" id="coleccion" aria-labelledby="collection-title">
      <div className="shell">
        <header ref={ref} className={`picker__head reveal ${visible ? 'is-in' : ''}`}>
          <div className="picker__eyeline">
            <span className="eyebrow">Catálogo</span>
            <span className="picker__edition">C&amp;E / Collection {new Date().getFullYear()}</span>
          </div>
          <div className="picker__intro">
            <h1 id="collection-title" className="picker__title">Elige tu<br /><em>colección</em><span aria-hidden="true">.</span></h1>
            <div className="picker__aside">
              <span className="picker__number" aria-hidden="true">02</span>
              <p className="picker__lead">Dos selecciones distintas, mismo estándar.<br />Elige por dónde quieres empezar.</p>
              <a className="picker__jump" href="#colecciones">Encuentra tu próximo par <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="picker__rule" aria-hidden="true"><span>01 — Selección de colecciones</span><span>Diseño para moverte</span></div>
        </header>
        <ul className="picker__grid" id="colecciones" aria-label="Colecciones">
          {COLLECTIONS.map((collection, index) => <CollectionCard key={collection.id} collection={collection} index={index} onPick={onPick} />)}
        </ul>
      </div>
    </section>
  )
}
