import { useId } from 'react'
import { shade, withAlpha } from '../lib/color'

export default function SneakerArt({ colorway, className = '', style, title }) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const g = (name) => `${uid}-${name}`

  const { base, accent, sole, laces } = colorway
  const upperTop = shade(base, 0.3)
  const upperMid = base
  const upperLow = shade(base, -0.28)
  const accentTop = shade(accent, 0.34)
  const accentLow = shade(accent, -0.3)
  const soleTop = shade(sole, 0.4)
  const soleLow = shade(sole, -0.34)

  return (
    <svg
      className={className}
      style={style}
      viewBox="18 34 364 180"
      role="img"
      aria-label={title || `Zapatilla color ${colorway.name}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={g('upper')} x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={upperTop} />
          <stop offset="52%" stopColor={upperMid} />
          <stop offset="100%" stopColor={upperLow} />
        </linearGradient>

        <linearGradient id={g('accent')} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={accentTop} />
          <stop offset="55%" stopColor={accent} />
          <stop offset="100%" stopColor={accentLow} />
        </linearGradient>

        <linearGradient id={g('sole')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={soleTop} />
          <stop offset="100%" stopColor={soleLow} />
        </linearGradient>

        <linearGradient id={g('sheen')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={g('shadow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="206" cy="201" rx="152" ry="10" fill={`url(#${g('shadow')})`} />

      <g className="sneaker-art__body">
        <path
          d="M40 182c-10 2-14 10-6 14h318c12 0 18-6 14-12-3-5-14-7-26-8H54c-7 0-11 2-14 6z"
          fill={shade(sole, -0.55)}
          stroke={withAlpha('#14171c', 0.3)}
          strokeWidth="1.2"
        />
        <path
          d="M40 182c-10 2-14 10-6 14h318c12 0 18-6 14-12-3-5-14-7-26-8H54c-7 0-11 2-14 6z"
          fill={`url(#${g('accent')})`}
          opacity="0.16"
        />

        <g stroke={withAlpha('#000000', 0.22)} strokeWidth="2" strokeLinecap="round">
          <path d="M78 196v-4M120 196v-4M162 196v-4M204 196v-4M246 196v-4M288 196v-4M322 196v-4" />
        </g>

        <path
          d="M52 152c-14 2-20 12-18 22 1 4 6 6 14 6h294c14 0 22-4 23-12 1-10-7-16-19-18z"
          fill={`url(#${g('sole')})`}
        />
        <path
          d="M52 152c-14 2-20 12-18 22 1 4 6 6 14 6h294"
          fill="none"
          stroke={withAlpha('#14171c', 0.26)}
          strokeWidth="1.8"
        />
        <path d="M62 158h286c8 0 13 2 16 5H56c2-3 4-4 6-5z" fill="#ffffff" opacity="0.5" />

        <path
          d="M54 152c-10-4-14-15-7-24 15-18 37-31 67-41 38-13 84-23 128-27 28-3 52-1 70 5 20 7 33 23 39 43 3 11 4 33 3 44-1 4-5 6-11 6H62c-4 0-7-2-8-6z"
          fill={`url(#${g('upper')})`}
          stroke={withAlpha('#000000', 0.3)}
          strokeWidth="1.2"
        />

        <path
          d="M54 152c-10-4-14-15-7-24 15-18 37-31 67-41l-24 71H62c-4 0-7-2-8-6z"
          fill={`url(#${g('sheen')})`}
        />

        <path
          d="M54 152c-10-4-14-15-7-24 13-16 31-26 53-34-8 18-14 40-16 63l-22 1c-3 0-6-2-8-6z"
          fill={shade(base, 0.14)}
          stroke={withAlpha('#000000', 0.24)}
          strokeWidth="1.1"
        />

        <path d="M232 58c8-9 24-11 33-4-7 5-15 9-21 12z" fill={shade(base, -0.42)} />

        <path
          d="M108 90c42-14 90-24 134-29l10 15c-40 5-84 16-124 30z"
          fill={shade(base, -0.36)}
          opacity="0.92"
        />

        <g stroke={laces} strokeWidth="3.6" strokeLinecap="round" fill="none">
          <path d="M136 84l5 16" />
          <path d="M166 78l6 15" />
          <path d="M196 71l7 15" />
          <path d="M226 64l8 15" />
        </g>
        <g fill={shade(base, -0.55)}>
          <circle cx="134" cy="82" r="2.4" />
          <circle cx="164" cy="76" r="2.4" />
          <circle cx="194" cy="69" r="2.4" />
          <circle cx="224" cy="62" r="2.4" />
        </g>

        <path
          d="M236 60c28-4 56-2 74 5 14 5 25 15 32 27-14-6-36-10-58-9-22 1-40-11-48-23z"
          fill={shade(base, -0.46)}
        />
        <path
          d="M240 63c26-3 51-1 68 5 12 4 21 12 27 21-13-6-32-9-52-8-20 1-36-9-43-18z"
          fill={`url(#${g('accent')})`}
          opacity="0.25"
        />

        <path
          d="M306 66c20 7 35 24 42 44 4 11 6 30 5 46l-31 2c2-30-4-66-16-92z"
          fill={`url(#${g('accent')})`}
          stroke={withAlpha('#000000', 0.22)}
          strokeWidth="1.1"
        />

        <path d="M300 62l14 6-4 10-14-7z" fill={shade(accent, -0.35)} />

        <path
          d="M124 158c44-8 92-28 132-56 20-14 36-25 48-32 6 9 4 18-4 27-32 33-94 61-148 65z"
          fill={`url(#${g('accent')})`}
          stroke={withAlpha('#000000', 0.24)}
          strokeWidth="1.1"
        />
        <path
          d="M132 156c42-9 88-28 126-54 19-13 34-24 45-30 4 6 3 12 0 17-34 31-90 56-140 61z"
          fill="#ffffff"
          opacity="0.28"
        />

        <path
          d="M158 138c38-12 76-31 108-53 12-8 21-13 27-15 4 5 3 10-1 15-31 26-80 47-124 58z"
          fill={`url(#${g('accent')})`}
          opacity="0.55"
        />

        <path
          d="M96 100c30-16 74-30 122-38"
          fill="none"
          stroke={withAlpha('#000000', 0.2)}
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
      </g>
    </svg>
  )
}
