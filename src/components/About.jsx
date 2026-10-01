import menPhoto from '../../images/Nosotros/Actitud_deportiva.jpg'
import womenPhoto from '../../images/Nosotros/Estilo_de_diario.png'
import { useReveal } from '../lib/useReveal'
import { BRANDS } from '../data/catalogs'
import StoreLink from './StoreLink'
import BrandMarquee from './BrandMarquee'

function Reveal({ children, className = '', id }) {
  const [ref, visible] = useReveal({ threshold: 0.05 })
  return <section id={id} ref={ref} className={`about-section ${className}`}><div className={`about-wrap reveal ${visible ? 'is-in' : ''}`}>{children}</div></section>
}

const PILLARS = [
  ['Variedad', 'Diferentes marcas y estilos para que tengas más opciones donde elegir.'],
  ['Estilo', 'Modelos para diferentes formas de vestir y diferentes momentos.'],
  ['Experiencia', 'Una tienda sencilla de explorar, comparar y disfrutar.'],
]

export default function About({ onNavigate }) {
  const linkProps = { onNavigate, className: 'about-link' }
  return (
    <div className="about-page">
      <Reveal className="about-intro">
        <p className="about-kicker">Sobre C &amp; E Store <span>Una tienda. Diferentes estilos.</span></p>
        <h1>Las marcas que conoces.<br /><em>El estilo que buscas.</em></h1>
        <div className="about-intro__bottom">
          <p>C &amp; E Store es una tienda multimarca donde reunimos zapatillas de marcas reconocidas para que encuentres el par que mejor encaje con tu estilo.</p>
          <div className="about-actions">
            <StoreLink {...linkProps} href="/catalogo" destination="catalogo">Explorar catálogo <span aria-hidden="true">↗</span></StoreLink>
            <a className="about-text-link" href="#marcas">Conocer las marcas <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="about-photo-story">
          <figure><img src={menPhoto} alt="Zapatilla Nike roja sobre un fondo rojo" width="1000" height="667" fetchPriority="high" /><figcaption><span>01 / Actitud deportiva</span><span>Muévete a tu manera</span></figcaption></figure>
          <figure><img src={womenPhoto} alt="Zapatilla Nike en tonos tierra sobre una tela mostaza" width="1000" height="714" /><figcaption><span>02 / Estilo de diario</span><span>Encuentra el tuyo</span></figcaption></figure>
        </div>
      </Reveal>
      <Reveal id="marcas" className="about-brands">
        <div className="about-heading-row"><h2>Marcas que forman<br /><em>parte de tu estilo.</em></h2><p>Explora diferentes estilos, siluetas y propuestas de algunas de las marcas más reconocidas del mundo.</p></div>
        <BrandMarquee brands={BRANDS} />
      </Reveal>
      <Reveal className="about-selection">
        <div className="about-selection__intro"><span className="about-section-number" aria-hidden="true">01 /</span><h2>Una selección<br />para cada estilo.</h2><div><p>No todos buscan lo mismo. Por eso reunimos modelos de diferentes marcas, estilos y siluetas para que puedas encontrar unas zapatillas que realmente vayan contigo.</p><ul className="about-style-tags" aria-label="Estilos para descubrir">{['Urbano', 'Deportivo', 'Casual', 'Clásico', 'De diario'].map(style => <li key={style}>{style}</li>)}</ul></div></div>
        <dl className="about-facts"><div><dt>{BRANDS.length} marcas</dt><dd>Una selección multimarca.</dd></div><div><dt>Hombre + Mujer + Accesorios</dt><dd>Tres colecciones para explorar a tu manera.</dd></div><div><dt>Diferentes propuestas</dt><dd>Más opciones para encontrar tu estilo.</dd></div></dl>
      </Reveal>
      <Reveal className="about-pillars">
        <div><p className="about-kicker">Nuestra forma de seleccionar</p><h2>Lo que buscamos<br />en cada selección.</h2></div>
        <ol>{PILLARS.map(([title, description], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
      </Reveal>
      <Reveal className="about-culture">
        <span className="about-culture__backdrop" aria-hidden="true">Estilo</span>
        <p className="about-kicker">Lo que llevas también habla de ti</p>
        <h2>Más que zapatillas.<br /><em>Forma parte<br />de tu estilo.</em></h2>
        <div className="about-culture__copy"><p>Las zapatillas dejaron de ser solamente calzado. Hoy forman parte de la música, el deporte, la moda urbana y la manera en la que cada persona expresa su estilo.</p><p>En C &amp; E Store reunimos diferentes propuestas para que encuentres la que encaje contigo.</p></div>
        <p className="about-culture__line">Música <span>Deporte</span> Moda urbana <span>Tu identidad</span></p>
      </Reveal>
      <Reveal id="redes" className="about-social">
        <div className="about-social__copy">
          <p className="about-kicker">Nuestras redes</p>
          <h2>El estilo sigue.<br /><em>Conecta con nosotros.</em></h2>
          <p className="about-social__lead">Sigue a C &amp; E Store en Facebook y descubre lo que compartimos con nuestra comunidad.</p>
        </div>
        <a className="facebook-card" href="https://www.facebook.com/share/16D2yPLvDo5/" target="_blank" rel="noopener noreferrer" aria-label="Visitar C & E Store en Facebook (abre en otra pestaña)">
          <span className="facebook-card__top"><span>Encuéntranos en</span><span aria-hidden="true">↗</span></span>
          <span className="facebook-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="52" height="52" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.098 24 12.073z" /></svg></span>
          <span className="facebook-card__name">Facebook</span>
          <span className="facebook-card__store">C &amp; E Store</span>
          <span className="facebook-card__cta">Visitar nuestra página <span aria-hidden="true">→</span></span>
        </a>
      </Reveal>
      <Reveal className="about-finale">
        <div><p className="about-kicker">Tu siguiente paso empieza aquí</p><h2>Encuentra<br />tu próximo par.</h2></div>
        <div><p>Explora nuestras colecciones y descubre diferentes marcas, estilos y modelos.</p><div className="about-actions"><StoreLink {...linkProps} href="/catalogo/hombre" destination="hombre">Ver Hombre <span aria-hidden="true">→</span></StoreLink><StoreLink {...linkProps} href="/catalogo/mujer" destination="mujer">Ver Mujer <span aria-hidden="true">→</span></StoreLink></div></div>
      </Reveal>
    </div>
  )
}
