import { COLLECTION_PHOTOS } from '../data/collectionPhotos'
import { byCategory } from '../data/products'
import { clothingProducts } from '../data/inventory'
import { useReveal } from '../lib/useReveal'
import CollectionCard from './CollectionCard'

const COPY = {
  accesorios: { photo: COLLECTION_PHOTOS.accesorios, line: 'Gorros, mochilas, bolsos y balones.', note: 'Completa tu estilo' },
  hombre: { photo: COLLECTION_PHOTOS.hombre, line: 'Explora la colección masculina.', note: 'Carácter en cada paso' },
  mujer: { photo: COLLECTION_PHOTOS.mujer, line: 'Explora la colección femenina.', note: 'Tu estilo, tu ritmo' },
}
const clothingPhoto = gender => COLLECTION_PHOTOS[`ropa-${gender}`]
const genderCollections = group => ['hombre', 'mujer'].map(gender => ({
  id: group === 'ropa' ? `ropa-${gender}` : gender,
  label: gender === 'hombre' ? 'Hombre' : 'Mujer',
  ...COPY[gender],
  ...(group === 'ropa' ? { photo: clothingPhoto(gender), line: 'Explora prendas para tu día a día.', note: 'Ropa para tu estilo' } : {}),
  count: byCategory(group === 'ropa' ? `ropa-${gender}` : gender).length,
}))
const ROOT_COLLECTIONS = [
  { id: 'calzados', label: 'Calzados', photo: COLLECTION_PHOTOS.calzados, line: 'Encuentra tu colección de hombre o mujer.', note: 'Carácter en cada paso', count: byCategory('hombre').length + byCategory('mujer').length },
  { id: 'accesorios', label: 'Accesorios', ...COPY.accesorios, count: byCategory('accesorios').length },
  { id: 'ropa', label: 'Ropa', photo: COLLECTION_PHOTOS.ropa, line: 'Prendas de hombre y mujer.', note: 'Viste a tu manera', count: clothingProducts.length },
]

export default function CollectionPicker({ onPick, group = 'picker', onBack }) {
  const [ref, visible] = useReveal()
  const COLLECTIONS = group === 'picker' ? ROOT_COLLECTIONS : genderCollections(group)
  return (
    <section className="picker" id="coleccion" aria-labelledby="collection-title">
      <div className="shell">
        <header ref={ref} className={`picker__head reveal ${visible ? 'is-in' : ''}`}>
          <div className="picker__eyeline">
            <span className="eyebrow">Catálogo{group !== 'picker' && ` / ${group === 'ropa' ? 'Ropa' : 'Calzados'}`}</span>
            {group !== 'picker' && <button type="button" className="product-catalog__back" onClick={onBack}>← Catálogo</button>}
            <span className="picker__edition">C&amp;E / Collection {new Date().getFullYear()}</span>
          </div>
          <div className="picker__intro">
            <h1 id="collection-title" className="picker__title">Elige tu<br /><em>colección</em><span aria-hidden="true">.</span></h1>
            <div className="picker__aside">
              <span className="picker__number" aria-hidden="true">{String(COLLECTIONS.length).padStart(2, '0')}</span>
              <p className="picker__lead">Todo para combinar a tu manera.<br />Elige por dónde quieres empezar.</p>
              <a className="picker__jump" href="#colecciones">Encuentra tu próximo favorito <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="picker__rule" aria-hidden="true"><span>01 — Selección de colecciones</span><span>Diseño para moverte</span></div>
        </header>
        <ul className={`picker__grid ${group !== 'picker' ? 'picker__grid--gender' : ''}`} id="colecciones" aria-label="Colecciones">
          {COLLECTIONS.map((collection, index) => <CollectionCard key={collection.id} collection={collection} index={index} onPick={onPick} />)}
        </ul>
      </div>
    </section>
  )
}
