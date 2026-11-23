// Textos del portafolio editorial (ES / EN). El contenido de proyectos, contacto y documentos sigue en data/content.
import type { Lang } from '../i18n/LanguageContext'
import type { HeroLine } from './FitLines'

export interface Copy {
  heroWide: HeroLine[]
  heroTall: string[]
  roles: string
  scroll: string
  folio: string
  manifesto: {
    notKnow: string[]
    first: string
    learn: string[]
    notOne: string[]
    who: string
  }
  index: { title: string; projects: (n: number) => string; hint: string }
  cta: { title: string; sub: string; card: string; mail: string }
  nav: { menu: string; close: string }
}

export const copy: Record<Lang, Copy> = {
  es: {
    heroWide: ['ME LE MIDO', 'A TODO'],
    heroTall: ['ME LE', 'MIDO A', 'TODO'],
    roles: 'Creadora digital · Diseñadora · Exploradora de IA · Docente',
    scroll: 'Sigue bajando',
    folio: 'Portafolio 2026',
    manifesto: {
      notKnow: ['NO SÉ.', 'Y ESO ME', 'ENCANTA.'],
      first: 'Cada cosa nueva es la primera vez. Llego como quien acaba de llegar al mundo: con los ojos abiertos de par en par.',
      learn: ['SI NO LO SÉ,', 'LO APRENDO.', 'LO QUE SÉ,', 'LO SIGO APRENDIENDO.'],
      notOne: ['NO SOY UNA PROFESIÓN.', 'NI UN ESTILO.', 'NI UNA SOLA FORMA DE TRABAJAR.'],
      who: 'Todavía no sé del todo quién soy. Me estoy aprendiendo.',
    },
    index: { title: 'Proyectos', projects: (n) => `${n} proyectos`, hint: 'Sigue bajando · elige uno' },
    cta: { title: 'HABLEMOS.', sub: 'Cuéntame tu idea y hagámosla realidad.', card: 'Ver mi tarjeta de contacto', mail: 'Escríbeme' },
    nav: { menu: 'Menú', close: 'Cerrar' },
  },
  en: {
    heroWide: ['I TAKE ON', 'ANYTHING'],
    heroTall: ['I TAKE', 'ON', 'ANYTHING'],
    roles: 'Digital creator · Designer · AI explorer · Educator',
    scroll: 'Keep scrolling',
    folio: 'Portfolio 2026',
    manifesto: {
      notKnow: ["I DON'T", 'KNOW.', 'AND I LOVE IT.'],
      first: 'Every new thing is a first time. I arrive like someone who just arrived in the world: eyes wide open.',
      learn: ["IF I DON'T KNOW IT,", 'I LEARN IT.', 'WHAT I KNOW,', 'I KEEP LEARNING.'],
      notOne: ["I'M NOT A PROFESSION.", 'NOT A STYLE.', 'NOT ONE WAY OF WORKING.'],
      who: "I don't fully know who I am yet. I'm learning myself.",
    },
    index: { title: 'Projects', projects: (n) => `${n} projects`, hint: 'Keep scrolling · pick one' },
    cta: { title: "LET'S TALK.", sub: "Tell me your idea and let's bring it to life.", card: 'See my contact card', mail: 'Write to me' },
    nav: { menu: 'Menu', close: 'Close' },
  },
}
