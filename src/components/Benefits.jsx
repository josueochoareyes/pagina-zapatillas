export const BENEFITS = [
  {
    id: 'envio',
    label: 'Consulta de envíos',
    note: 'Infórmate por WhatsApp',
    icon: (
      <path
        d="M3 8.5h10v8H3zM13 11h4l3 3v2.5h-7zM6.5 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM16.5 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'rapido',
    label: 'Atención',
    note: 'Resolvemos tus dudas',
    icon: (
      <>
        <path d="M12 4.5v6.8l4.2 2.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="8" />
      </>
    ),
  },
  {
    id: 'devolucion',
    label: 'Hombre y mujer',
    note: 'Explora las colecciones',
    icon: (
      <>
        <path d="M4.5 12a7.5 7.5 0 1113.4 4.7" strokeLinecap="round" />
        <path d="M17.9 12.6v4.1h-4.1" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: 'marcas',
    label: 'Multimarca',
    note: 'Diferentes estilos',
    icon: (
      <>
        <path d="M7 5.5c2.6 0 3.4 2.2 3 4.2-.5 2.6.6 4.3 2.6 4.8 2.3.6 3.2 2.2 2.4 4" strokeLinecap="round" />
        <path d="M7 5.5C5.4 8 5 10.4 5.6 13c.5 2.4-.3 4-1.6 5" strokeLinecap="round" opacity=".5" />
        <path d="M11 5c2.8 0 3.8 2.2 3.4 4.4" strokeLinecap="round" opacity=".5" />
      </>
    ),
  },
]

/** Bloque informativo slim que vive justo debajo del header. */
export default function Benefits({ className = '' }) {
  return (
    <div className={`perks ${className}`}>
      <ul className="perks__list shell">
        {BENEFITS.map((b) => (
          <li className="perks__item" key={b.id}>
            <svg
              className="perks__icon"
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {b.icon}
            </svg>
            <span className="perks__text">
              <strong>{b.label}</strong>
              <span className="perks__note">{b.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
