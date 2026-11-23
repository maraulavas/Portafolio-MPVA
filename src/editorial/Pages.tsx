import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { useContent } from '../i18n/useContent'
import { homeAsset } from '../data/assets'

const EASE = [0.65, 0, 0.35, 1] as const
const FONT = { fontFamily: "'Neue Montreal', Inter, sans-serif", fontWeight: 500 } as const
const label = 'text-[11px] uppercase tracking-[0.08em]'

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white text-black" style={FONT}>
      {children}
    </div>
  )
}

type AboutCard = { title: string; items: string[] }
const CARDS: Record<'es' | 'en', AboutCard[]> = {
  es: [
    { title: 'Quién soy', items: ['Diseñadora multidisciplinar: industrial, gráfica y UX/UI.', 'Integro la inteligencia artificial en mis procesos creativos; el criterio y las decisiones de diseño siempre son míos.', 'Español e inglés (C1, iTEP 2023).'] },
    { title: 'Experiencia', items: ['2024 – Actualidad|Líder de diseño y UX/UI en SGI S.A.S.', '2025 – 2026|Docente de planta y líder de comunicaciones del pregrado de Creación Digital, Universidad El Bosque.', '2024 / 2026|Proyectos freelance para Behome y Mainatek.'] },
    { title: 'Educación', items: ['2019 – 2024|Diseño Industrial, Universidad El Bosque.', '2025|UX/UI: Diseño de Productos Digitales, Universidad de los Andes.'] },
  ],
  en: [
    { title: 'Who I am', items: ['Multidisciplinary designer: industrial, graphic and UX/UI.', 'I bring artificial intelligence into my creative processes; the judgment and design decisions are always mine.', 'Spanish and English (C1, iTEP 2023).'] },
    { title: 'Experience', items: ['2024 – Present|Design and UX/UI lead at SGI S.A.S.', '2025 – 2026|Full-time lecturer and communications lead for the Creación Digital undergraduate program, Universidad El Bosque.', '2024 / 2026|Freelance projects for Behome and Mainatek.'] },
    { title: 'Education', items: ['2019 – 2024|Industrial Design, Universidad El Bosque.', '2025|UX/UI: Digital Product Design, Universidad de los Andes.'] },
  ],
}

const POEM: Record<'es' | 'en', { title: string; sub: string; stanzas: string[][] }> = {
  es: {
    title: '¿Quién soy realmente?',
    sub: 'Primera vez',
    stanzas: [
      ['Llegué al mundo hace poco', 'y todavía no se me quita el asombro.', 'Cada cosa que toco es la primera vez:', 'la luz, el borde, el ruido de lo que empieza.'],
      ['No le tengo miedo a lo que no conozco,', 'le tengo admiración.', 'Lo desconocido es una puerta', 'que alguien dejó entreabierta para mí.'],
      ['Lo que no sé, lo aprendo.', 'Lo que sé, lo sigo aprendiendo.', 'Cambio, y el cambio me sienta bien,', 'como si mi cuerpo hubiera nacido para mudarse.'],
      ['No soy una profesión.', 'No soy un estilo.', 'No soy una sola manera de hacer las cosas.', 'Soy lo que el reto me pida y algo más.'],
      ['Todavía no sé del todo quién soy.', 'Me estoy descubriendo despacio,', 'como se descubre una ciudad', 'caminándola sin mapa.'],
      ['Y cada vez que creo conocerme,', 'algo nuevo me llama,', 'y me voy detrás,', 'con los ojos abiertos de par en par.'],
    ],
  },
  en: {
    title: 'Who am I, really?',
    sub: 'First time',
    stanzas: [
      ['I arrived in the world not long ago', 'and the wonder hasn’t worn off.', 'Everything I touch is a first time:', 'the light, the edge, the sound of something beginning.'],
      ['I’m not afraid of what I don’t know,', 'I admire it.', 'The unknown is a door', 'someone left ajar for me.'],
      ['What I don’t know, I learn.', 'What I know, I keep learning.', 'I change, and change suits me,', 'as if my body were born to move.'],
      ['I’m not a profession.', 'I’m not a style.', 'I’m not one single way of doing things.', 'I’m whatever the challenge asks of me, and something more.'],
      ['I don’t fully know who I am yet.', 'I’m discovering myself slowly,', 'the way you discover a city', 'by walking it without a map.'],
      ['And every time I think I know myself,', 'something new calls me,', 'and I follow it,', 'eyes wide open.'],
    ],
  },
}


const HERO_IMGS = ['about-hero-4.jpg', 'about-hero-espejo.jpg']

// Mosaico: la foto se parte en una retícula y cada pieza cambia a la siguiente en cascada.
function TileSlideshow() {
  const [cols, setCols] = useState(6)
  const rows = 4
  useEffect(() => {
    const on = () => setCols(window.innerWidth < 768 ? 3 : 6)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const n = cols * rows
  const [tiles, setTiles] = useState<number[]>(() => Array(24).fill(0))
  const cur = useRef(0)
  const timers = useRef<number[]>([])
  // orden de la ola: de arriba-izquierda hacia abajo-derecha, con algo de azar
  const order = useMemo(
    () => Array.from({ length: n }, (_, i) => {
      const r = Math.floor(i / cols), c = i % cols
      return r + c + Math.random() * 2.2
    }),
    [n, cols],
  )
  useEffect(() => {
    setTiles(Array(n).fill(cur.current))
    // Cascada continua: cada pieza cambia sola cada PERIOD ms, desfasada según su lugar en la ola.
    const PERIOD = 4200
    const sorted = order.map((v, i) => [v, i] as const).sort((x, y) => x[0] - y[0])
    const ids: number[] = []
    sorted.forEach(([, i], k) => {
      const flip = () => setTiles((t) => { const c = t.slice(); c[i] = (c[i] + 1) % HERO_IMGS.length; return c })
      ids.push(window.setTimeout(() => {
        flip()
        ids.push(window.setInterval(flip, PERIOD))
      }, 600 + (k * PERIOD) / n))
    })
    const id = 0
    timers.current = ids
    return () => {
      void id
      timers.current.forEach((t) => { clearTimeout(t); clearInterval(t) })
      timers.current = []
    }
  }, [n, order])
  return (
    <div
      className="absolute inset-0 grid gap-px bg-white/30"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, filter: 'brightness(0.72) contrast(1.05)' }}
      aria-hidden
    >
      {Array.from({ length: n }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols
        return (
          <div key={i} className="relative overflow-hidden">
            <img
              src={homeAsset(HERO_IMGS[tiles[i] ?? 0])}
              alt=""
              draggable={false}
              className="absolute max-w-none object-cover object-center"
              style={{ width: `${cols * 100}%`, height: `${rows * 100}%`, left: `-${c * 100}%`, top: `-${r * 100}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}

// Portada de "Sobre mí": foto a pantalla completa, título a la izquierda y descripción a la derecha.
const BIO = {
  es: [
    'Me interesan los proyectos que me sacan de lo conocido. Me gusta cuestionar, experimentar y encontrar nuevas formas de resolver las cosas. Prefiero equivocarme, aprender y descubrir nuevas posibilidades antes que seguir siempre el mismo camino.',
  ],
  en: [
    "I'm drawn to projects that take me out of the familiar. I like to question, experiment and find new ways of solving things. I'd rather get it wrong, learn and discover new possibilities than always follow the same path.",
  ],
} as const

function AboutHero({ es }: { name?: string; description?: string; es: boolean }) {
  return (
    <section className="relative flex h-[calc(100svh-56px)] min-h-[560px] flex-col overflow-hidden bg-black text-white">
      <TileSlideshow />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" aria-hidden />
      <div className="relative z-10 mt-auto grid items-end gap-8 px-5 pb-10 md:grid-cols-[1.3fr_1fr] md:px-8 md:pb-14">
        <motion.h1
          className="font-medium uppercase leading-[0.82] tracking-[-0.06em]"
          style={{ fontSize: 'min(17vw, 26svh)' }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        >
          {es ? 'Sobre' : 'About'}
          <br />
          {es ? 'mí' : 'me'}
        </motion.h1>
        <motion.div
          className="flex max-w-[54ch] flex-col gap-3 text-[clamp(14px,1.15vw,18px)] font-medium leading-[1.35] tracking-[-0.012em] md:justify-self-end"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
        >
          {BIO[es ? 'es' : 'en'].map((t) => (
            <p key={t}>{t}</p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function AboutPage(_: { onContact?: () => void }) {
  const { lang } = useLang()
  const es = lang === 'es'
  return (
    <Page>
      {/* Presentación: foto a pantalla completa, retícula y una palabra con letras escalonadas */}
      <AboutHero es={es} />

      {/* Cuatro cards: todo sobre mí de un vistazo (mismo lenguaje que las cards del manifiesto) */}
      <section className="bg-white text-black">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3">
          {CARDS[lang].map((c, i) => {
                        return (
              <motion.article
                key={c.title}
                className={`relative flex min-h-[360px] flex-col sm:min-h-[510px] p-5 md:p-8 bg-white text-black border-b-[3px] border-black ${i > 0 ? 'sm:border-l-[3px]' : ''} ${i === 2 ? 'sm:max-xl:border-l-0' : ''}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6% 0px' }}
                transition={{ duration: 0.9, delay: 0.07 * i, ease: EASE }}
              >
                <div className="flex items-start justify-between gap-4 text-[11px] font-medium uppercase tracking-[0.08em]">
                  <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')} / 03</span>
                </div>
                <h3 className="mt-10 text-[clamp(30px,2.9vw,54px)] font-medium uppercase leading-[0.9] tracking-[-0.05em]">{c.title}</h3>
                <ul className="mt-auto flex flex-col pt-12">
                  {c.items.map((it) => {
                    const [d, t] = it.includes('|') ? it.split('|') : [null, it]
                    return (
                      <li key={it} className="border-t border-current/30 py-3 first:border-t-0 text-[clamp(14px,1vw,16px)] font-medium leading-[1.25] tracking-[-0.01em]">
                        {d && <span className="mb-1 block text-[11px] uppercase tabular-nums tracking-[0.08em] opacity-55">{d}</span>}
                        <span className="opacity-90">{t}</span>
                      </li>
                    )
                  })}
                </ul>
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* Poema: doble página, texto a la izquierda y foto en trama a la derecha; la frase final ocupa todo el ancho */}
      <section className="relative bg-black text-white">
        <div className="grid md:min-h-[100svh] md:grid-cols-2">
          <div className="flex flex-col px-5 pb-12 pt-16 md:px-8 md:pb-14 md:pt-20">
            <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.08em]">
              <span>({POEM[lang].sub})</span>
              <span className="h-px w-8 bg-white" aria-hidden />
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 md:mt-12">
              {[POEM[lang].stanzas.slice(0, 3), POEM[lang].stanzas.slice(3, 5)].map((col, ci) => (
                <div key={ci} className="flex flex-col gap-6">
                  {col.map((st, i) => (
                    <motion.p
                      key={i}
                      className="text-[clamp(14px,1.05vw,17px)] font-medium leading-[1.4] tracking-[-0.005em]"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-8% 0px' }}
                      transition={{ duration: 1, delay: ci * 0.12 + i * 0.08, ease: EASE }}
                    >
                      {st.map((ln) => (
                        <span key={ln} className="block">
                          {ln}
                        </span>
                      ))}
                    </motion.p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[60svh] overflow-hidden md:min-h-0">
            <img
              src={homeAsset('poema-foto.jpg')}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover "
              style={{ objectPosition: '38% 50%', filter: 'grayscale(1) contrast(1.1) brightness(1.25)' }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply"
              style={{ backgroundImage: 'radial-gradient(circle, #000 0.9px, transparent 1.5px)', backgroundSize: '4px 4px' }}
              aria-hidden
            />
          </div>
        </div>
        <motion.p
          className="text-right px-5 pb-16 pt-10 font-medium leading-[1.02] tracking-[-0.045em] md:absolute md:inset-x-0 md:bottom-0 md:z-10 md:bg-gradient-to-t md:from-black md:via-black/70 md:to-transparent md:px-8 md:pb-10 md:pt-40"
          style={{ fontSize: 'clamp(24px,3.5vw,72px)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {(() => {
            const l = POEM[lang].stanzas[POEM[lang].stanzas.length - 1]
            return [l.slice(0, 2).join(' '), l.slice(2).join(' ')].map((ln) => (
              <span key={ln} className="block md:whitespace-nowrap">
                {ln}
              </span>
            ))
          })()}
        </motion.p>
      </section>
    </Page>
  )
}

export function DocumentsPage() {
  const { lang } = useLang()
  const { documents } = useContent()
  const es = lang === 'es'
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-black text-white md:overflow-hidden" style={FONT}>
      <section className="grid min-h-full gap-8 px-5 pb-10 pt-20 md:h-full md:grid-cols-[1.35fr_1fr] md:grid-rows-[minmax(0,1fr)] md:px-8 md:py-10">
        <div className="relative min-h-[48svh] overflow-hidden bg-neutral-900 md:min-h-0">
          <img src={homeAsset('documentos-foto.jpg')} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)]" style={{ objectPosition: '48% 40%', transform: 'translateY(-9%) scale(1.45)', transformOrigin: '48% 36%' }} />
          <div
            className="pointer-events-none absolute inset-0 opacity-35 mix-blend-multiply"
            style={{ backgroundImage: 'radial-gradient(circle, #000 0.9px, transparent 1.5px)', backgroundSize: '4px 4px' }}
            aria-hidden
          />
        </div>
        <div className="flex min-h-0 flex-col justify-between">
          <div>
          <h1 className="text-[clamp(44px,min(7.2vw,13svh),140px)] font-medium uppercase leading-[0.86] tracking-[-0.05em]">
            <span className="block">DOCU</span>
            <span className="block">{es ? 'MENTOS.' : 'MENTS.'}</span>
          </h1>
          <p className="mb-10 mt-5 max-w-[40ch] text-[clamp(16px,1.4vw,22px)] leading-[1.2] opacity-80">{es ? 'Mira mi portafolio y mi hoja de vida.' : 'View my portfolio and resume.'}</p>
          </div>
          <div>
          {documents.map((d, i) => {
            const ext = (d.filename?.split('.').pop() ?? 'pdf').toUpperCase()
            return (
              <a
                key={d.id}
                href={d.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => d.href === '#' && e.preventDefault()}
                className="group flex cursor-pointer flex-col gap-2 border-t border-white/25 py-5 transition-colors duration-300 last:border-b hover:bg-white hover:text-black -mx-3 px-3"
              >
                <span className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">
                  <span>{String(i + 1).padStart(2, '0')} · {ext} · {d.sizeHint}</span>
                  <span>{es ? 'Ver' : 'View'}</span>
                </span>
                <span className="flex items-baseline justify-between gap-4 text-[clamp(18px,1.9vw,32px)] font-medium leading-[1.05] tracking-[-0.02em]">
                  <span>{d.label}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </span>
              </a>
            )
          })}
          </div>
        </div>
      </section>
    </div>
  )
}

export function ContactPage() {
  const { lang } = useLang()
  const { contact } = useContent()
  const es = lang === 'es'
  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-black text-white" style={FONT}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black" aria-hidden>
        <img src={homeAsset('contacto-fondo.jpg')} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'grayscale(1) brightness(0.38) contrast(1.1)' }} />
      </div>
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-16 text-center md:px-8">
        <p className={`${label} mb-5 opacity-70`}>{contact.role}</p>
        <h1 className="text-[clamp(56px,12vw,220px)] font-medium uppercase leading-[0.84] tracking-[-0.05em]">{es ? 'Hablemos.' : "Let's talk."}</h1>
        <p className="mt-6 max-w-[40ch] text-[clamp(16px,1.6vw,24px)] leading-[1.2] opacity-90">{contact.description}</p>
        <div className="mt-12 grid w-full max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-2">
          {contact.links.filter((l) => l.id !== 'behance').map((l) => (
            <a
              key={l.id}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[170px] cursor-pointer flex-col justify-between border border-[#efe9df]/25 border-t-[3px] border-t-[#efe9df] bg-white/[0.08] p-6 text-left backdrop-blur-xl transition-colors duration-500 hover:bg-white hover:text-black"
            >
              <span className="flex items-center justify-between">
                <span className={label}>{l.label}</span>
                <span className="text-[22px] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </span>
              <span className="break-words text-[clamp(15px,1.45vw,24px)] font-medium uppercase leading-[1] tracking-[-0.02em]">{l.value}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
