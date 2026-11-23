import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { homeAsset } from '../data/assets'
import Skills from './Skills'


// Rejilla de líneas horizontales finas (como el poster de referencia).
export function gridStyle(dark = false, step = 64): CSSProperties {
  const line = dark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.16)'
  return { backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${step - 1}px, ${line} ${step - 1}px, ${line} ${step}px)` }
}

function Reveal({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const T = {
  es: {
    c1: 'a lo que no conozco',
    lines: ['No le tengo', 'miedo a lo', 'desconocido,', 'le tengo'],
    cardsTitle: 'Veces que le gané al “no”',
    cards: [
      { said: "Tienes que elegir una sola disciplina.", head: ['MUCHAS','DISCIPLINAS.'], answer: "No elegí una sola. Soy diseñadora industrial, UX/UI, gráfica y creadora digital. He encontrado la manera de conectar distintas disciplinas y convertir esa versatilidad en una fortaleza." },
      { said: "Para liderar necesitas décadas de experiencia.", head: ['LIDERO','DISEÑO Y','COMUNICACIÓN.'], answer: "La experiencia también se construye asumiendo retos. Hoy lidero el área de diseño en SGI y estoy al frente de la comunicación de todo un pregrado." },
      { said: "No sabes de UX/UI ni de desarrollo. No puedes diseñar una aplicación.", head: ['MÁS DE 5 MÓDULOS','EN PRODUCCIÓN.'], answer: "Hoy lidero el diseño UX/UI de una aplicación en producción con cerca de 400 usuarios. Empecé desde cero, aprendiendo sobre la marcha y usando la IA como aliada en el proceso." },
      { said: "Para enseñar necesitas años de experiencia.", head: ['DOCENTE','DE PLANTA.'], answer: "Hoy soy docente de planta y lidero el Semillero Álgora. Pasé de no tener experiencia frente a un aula a formar, orientar y acompañar nuevos procesos creativos." },
      { said: "Hacer un videojuego requiere saber programar.", head: ['UN VIDEOJUEGO','DESDE CERO.'], answer: "Creé desde cero un videojuego de cinco niveles sin saber programar. Aprendí a utilizar nuevas herramientas, explorar la IA y convertir una idea en una experiencia jugable. Se llama “La travesía de Briel”." },
    ],
    words: ['admiración.', 'pasión.', 'respeto.', 'curiosidad.', 'asombro.', 'fascinación.', 'ganas.', 'cariño.'],
    ring: 'CADA COSA NUEVA ES LA PRIMERA VEZ · ',
    first: 'Cada cosa nueva es la primera vez. Llego como quien acaba de llegar al mundo: con los ojos abiertos de par en par.',
    c2: 'mirar sin saber',
    learn: 'APRENDO',
    learnSmall: 'Si no lo sé, lo aprendo. Lo que sé, lo sigo aprendiendo.',
    c3: 'en proceso',
    notOne: 'No soy una profesión. Ni un estilo. Ni una sola forma de trabajar.',
    roles: ['DISEÑADORA', 'CREADORA', 'DOCENTE', 'EXPLORADORA DE IA'],
    all: 'TODO.',
    who: 'todavía no sé quién soy.',
    learning: 'me estoy aprendiendo',
    c5: 'versión en construcción',
  },
  en: {
    c1: 'of what I don\'t know',
    lines: ["I'm not afraid", 'of the', 'unknown,', 'I feel'],
    cardsTitle: 'Times I beat the “no”',
    cards: [
      { said: "You have to choose just one discipline.", head: ['MANY','DISCIPLINES.'], answer: "I didn't choose just one. I'm an industrial, UX/UI and graphic designer and a digital creator. I've found a way to connect different disciplines and turn that versatility into a strength." },
      { said: "To lead you need decades of experience.", head: ['I LEAD','DESIGN AND','COMMS.'], answer: "Experience is also built by taking on challenges. Today I lead the design area at SGI and I’m in charge of the communications of an entire degree program." },
      { said: "You don't know UX/UI or development. You can't design an app.", head: ['5+ MODULES','IN PRODUCTION.'], answer: "Today I lead the UX/UI design of an app in production with about 400 users. I started from scratch, learning along the way and using AI as an ally in the process." },
      { said: "To teach you need years of experience.", head: ['FULL-TIME','LECTURER.'], answer: "Today I’m a full-time lecturer and I lead Semillero Álgora. I went from having no classroom experience to guiding, mentoring and supporting new creative processes." },
      { said: "Making a video game requires knowing how to code.", head: ['A GAME','FROM SCRATCH.'], answer: "I built a five-level video game from scratch without knowing how to code. I learned to use new tools, explore AI and turn an idea into a playable experience. It’s called “La travesía de Briel”." },
    ],
    words: ['awe.', 'wonder.', 'passion.', 'respect.', 'curiosity.', 'fascination.', 'drive.', 'love.'],
    ring: 'EVERY NEW THING IS A FIRST TIME · ',
    first: 'Every new thing is a first time. I arrive like someone who just arrived in the world: eyes wide open.',
    c2: 'looking without knowing',
    learn: 'I LEARN',
    learnSmall: "If I don't know it, I learn it. What I know, I keep learning.",
    c3: 'in progress',
    notOne: "I'm not a profession. Not a style. Not one way of working.",
    roles: ['DESIGNER', 'CREATOR', 'EDUCATOR', 'AI EXPLORER'],
    all: 'ALL OF IT.',
    who: "i don't know who i am yet.",
    learning: "i'm learning myself",
    c5: 'version in progress',
  },
}

// 01 · Repetición: "NO LE TENGO MIEDO" se repite hasta que el contorno se llena en "LE TENGO ADMIRACIÓN."
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

// La última palabra sube y da paso a otra: admiración, pasión, respeto…
function RollingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  const [w, setW] = useState<number | null>(null)
  const meas = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => window.clearInterval(id)
  }, [words.length])
  useLayoutEffect(() => {
    if (meas.current) setW(meas.current.offsetWidth)
  }, [i])
  return (
    <motion.span
      className="relative block"
      style={{ height: '0.98em', lineHeight: 0.98, clipPath: 'inset(0 -4% -28% -4%)' }}
      initial={false}
      animate={w === null ? undefined : { width: w }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <span ref={meas} className="invisible absolute left-0 top-0 block whitespace-nowrap pr-[0.08em] leading-[0.98] font-medium tracking-[-0.055em]" aria-hidden>{words[i]}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          className="absolute left-0 top-0 block whitespace-nowrap leading-[0.98] font-medium tracking-[-0.055em]"
          initial={{ y: '115%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-115%' }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

// 01 · La palabra se repite en tres filas gigantes, cortadas por los bordes; un fragmento de foto se cuela entre las filas
// y la fila del medio queda por encima, como en un cartel de tipografía.
function NotKnow({ tx }: { tx: (typeof T)['es'] }) {
  return (
    <>
      {/* Frase, sola sobre negro */}
      <section className="flex min-h-[50svh] items-center justify-center bg-black px-5 py-16 text-center md:min-h-[70svh] md:py-24 text-[#efe9df] md:px-8">
        <div style={{ fontSize: 'clamp(22px,3.9vw,98px)', lineHeight: 0.98 }}>
          <Reveal>
            <span className="block font-medium tracking-[-0.055em] md:whitespace-nowrap">{tx.lines.slice(0, -1).join(' ')}</span>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="inline-flex items-start gap-[0.25em] font-medium tracking-[-0.055em]">
              <span className="whitespace-nowrap">{tx.lines[tx.lines.length - 1]}</span>
              <RollingWord words={tx.words} />
            </span>
          </Reveal>
        </div>
      </section>

      {/* Cards sobre la foto */}
      <section className="relative bg-black text-[#efe9df]">
        <div className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <img src={homeAsset('manifiesto-fondo.jpg')} alt="" draggable={false} className="h-full w-full object-cover object-center" style={{ filter: 'grayscale(1) brightness(0.45) contrast(1.1)' }} />
            <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '220px 220px' }} />
          </div>
        </div>
        <div className="relative flex min-h-[100svh] flex-col justify-center px-5 py-20 md:px-8">
          <CardsCarousel tx={tx} />
        </div>
      </section>
    </>
  )
}

// Carrusel lateral de cards: scroll-snap horizontal + flechas.
function CardsCarousel({ tx }: { tx: (typeof T)['es'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const go = (d: number) => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector('article') as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : el.clientWidth
    el.scrollBy({ left: d * step, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector('article') as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : el.clientWidth
    setIdx(Math.max(0, Math.min(tx.cards.length - 1, Math.round(el.scrollLeft / step))))
  }
  const n = tx.cards.length
  const btn = 'flex h-10 w-10 items-center justify-center rounded-full border border-[#efe9df]/40 text-lg transition-colors duration-300 hover:bg-[#efe9df] hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit'
  return (
    <div className="min-w-0">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em]">{tx.cardsTitle}</p>
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] tabular-nums tracking-[0.08em] opacity-70 md:inline">{String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <button type="button" aria-label="Anterior" disabled={idx === 0} onClick={() => go(-1)} className={btn}>←</button>
          <button type="button" aria-label="Siguiente" disabled={idx === n - 1} onClick={() => go(1)} className={btn}>→</button>
        </div>
      </div>
      <div ref={ref} onScroll={onScroll} className="-mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-5 md:-mr-8 md:pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tx.cards.map((c, i) => (
          <article key={i} className="flex min-h-[400px] w-[78%] max-w-[400px] shrink-0 snap-start flex-col justify-between rounded-none border border-[#efe9df]/25 border-t-[3px] border-t-[#efe9df] bg-white/[0.08] p-7 shadow-none backdrop-blur-xl md:min-h-[480px] md:w-[420px] md:max-w-[420px] md:p-8">
            <div className="flex items-start justify-between gap-4 text-[11px] font-medium uppercase tracking-[0.08em]">
              <span className="tabular-nums opacity-70">{String(i + 1).padStart(2, '0')} / {String(tx.cards.length).padStart(2, '0')}</span>
            </div>

            {/* Arriba, lo que me dijeron; abajo, cómo le gané */}
            <h2 className="mt-10 text-[clamp(30px,2.9vw,52px)] font-medium leading-[0.98] tracking-[-0.045em]">“{c.said}”</h2>
            <p className="mt-auto border-t border-[#efe9df]/25 pt-5 text-[clamp(14px,1.1vw,17px)] leading-[1.35] tracking-[-0.01em] opacity-90">{c.answer}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default function Manifesto() {
  const { lang } = useLang()
  const tx = T[lang]
  return (
    <>
      <NotKnow tx={tx} />
      <Skills />
    </>
  )
}
