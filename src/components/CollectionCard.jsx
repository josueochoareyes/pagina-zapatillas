import { useReveal } from '../lib/useReveal'

export default function CollectionCard({ collection, index, onPick }) {
  const [ref, visible] = useReveal()
  const number = String(index + 1).padStart(2, '0')

  return (
    <li ref={ref} className={`pcard reveal ${visible ? 'is-in' : ''}`}>
      <button
        className="pcard__hit"
        type="button"
        onClick={() => onPick(collection.id)}
        aria-label={`Ver colección ${collection.label}, ${collection.count} modelos`}
      >
        <img className="pcard__photo" src={collection.photo} alt="" decoding="async" />
        <span className="pcard__veil" aria-hidden="true" />
        <span className="pcard__top">
          <span>Colección {number}</span>
          <span>{collection.count} modelos</span>
        </span>
        <span className="pcard__edition" aria-hidden="true">C&amp;E / {number}</span>
        <span className="pcard__body">
          <span className="pcard__label">{collection.label}</span>
          <span className="pcard__line">{collection.line}</span>
          <span className="pcard__cta">Ver colección <span aria-hidden="true">→</span></span>
        </span>
      </button>
      <div className="pcard__caption" aria-hidden="true">
        <span>{number} / {collection.note}</span><span>C &amp; E Store</span>
      </div>
    </li>
  )
}
