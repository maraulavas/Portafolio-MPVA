import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

const EASE = [0.22, 1, 0.36, 1] as const

type Group = { name: string; items: string[] }

const DATA: Record<'es' | 'en', { kicker: string; title: string[]; intro: string; foot: string; groups: Group[] }> = {
  es: {
    kicker: 'Habilidades',
    title: ['Lo que sé', 'hacer.'],
    intro: 'Seis áreas, un solo sistema: cada una alimenta a las demás.',
    foot: 'Y lo que todavía no sé, lo aprendo.',
    groups: [
      { name: 'Producto digital', items: ['Diseño UX/UI', 'Sitios web', 'Frontend con IA', 'Investigación con usuarios'] },
      { name: 'Diseño y marca', items: ['Diseño industrial', 'Diseño gráfico', 'Branding e identidad visual', 'Ilustración digital'] },
      { name: 'Inteligencia artificial', items: ['IA en procesos creativos', 'Imagen y video con IA', 'Prompting y dirección creativa con IA'] },
      { name: 'Contenido y movimiento', items: ['Contenido para redes', '3D', 'Renderizado', 'Comunicación estratégica'] },
      { name: 'Juego', items: ['Videojuegos'] },
      { name: 'Habilidades blandas', items: ['Docencia universitaria', 'Liderazgo de equipos creativos', 'Resolución de problemas', 'Aprendizaje autónomo'] },
    ],
  },
  en: {
    kicker: 'Skills',
    title: ['What I', 'can do.'],
    intro: 'Six areas, one system: each one feeds the others.',
    foot: 'And what I don’t know yet, I learn.',
    groups: [
      { name: 'Digital product', items: ['UX/UI design', 'Websites', 'Front-end with AI', 'User research'] },
      { name: 'Design & brand', items: ['Industrial design', 'Graphic design', 'Branding & visual identity', 'Digital illustration'] },
      { name: 'Artificial intelligence', items: ['AI in creative processes', 'AI image & video', 'Prompting & creative direction with AI'] },
      { name: 'Content & motion', items: ['Social content', '3D', 'Rendering', 'Strategic communication'] },
      { name: 'Play', items: ['Video games'] },
      { name: 'Soft skills', items: ['University teaching', 'Leading creative teams', 'Problem solving', 'Self-directed learning'] },
    ],
  },
}

const FINAL = { es: 'Mis habilidades', en: 'My skills' } as const

// Máquina de escribir en bucle: escribe una frase, la borra, escribe la otra, y así siempre.
function Typewriter({ first, last }: { first: string; last: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [text, setText] = useState('')
  useEffect(() => {
    if (!inView) return
    let dead = false
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
    ;(async () => {
      const words = [first, last]
      let cur = ''
      await wait(500)
      for (let k = 0; !dead; k++) {
        const w = words[k % 2]
        for (let i = 1; i <= w.length && !dead; i++) { cur = w.slice(0, i); setText(cur); await wait(75) }
        await wait(1600)
        for (let i = w.length - 1; i >= 0 && !dead; i--) { setText(w.slice(0, i)); await wait(40) }
        await wait(350)
      }
    })()
    return () => { dead = true }
  }, [inView, first, last])
  return (
    <h2 ref={ref} aria-label={last} className="mb-8 flex h-[1.05em] items-center justify-center font-medium leading-none tracking-[-0.05em] md:mb-9" style={{ fontSize: 'clamp(30px,3.8vw,60px)' }}>
      <span aria-hidden>{text}</span>
      <motion.span
        aria-hidden
        className="ml-[0.06em] inline-block h-[0.85em] w-[0.055em] bg-black"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
      />
    </h2>
  )
}

export default function Skills() {
  const { lang } = useLang()
  const d = DATA[lang]
  const all = d.groups.flatMap((g) => g.items)
  const [hov, setHov] = useState<number | null>(null)
  return (
    <section className="flex flex-col items-center justify-center bg-white px-5 py-28 md:py-44 text-center text-black md:px-8">
      <Typewriter key={lang} first={d.title.join(' ')} last={FINAL[lang]} />
      <motion.p
        className="mx-auto max-w-[860px] text-[clamp(14px,1.4vw,22px)] font-medium leading-[1.35] tracking-[-0.03em]"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
        onMouseLeave={() => setHov(null)}
      >
        {all.map((it, i) => (
          <span key={it}>
            <span onMouseEnter={() => setHov(i)} className="cursor-default whitespace-nowrap transition-opacity duration-300" style={{ opacity: hov === null || hov === i ? 1 : 0.2 }}>
              {it}
            </span>
            {i < all.length - 1 && (
              <>
                <span className="mx-[0.4em] opacity-30">·</span>
                {'\u200b'}
              </>
            )}
          </span>
        ))}
      </motion.p>
      <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">{d.foot}</p>
    </section>
  )
}
