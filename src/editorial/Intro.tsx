import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { homeAsset } from '../data/assets'

const COPY = {
  es: {
    text: 'Soy Maria Paula. Diseño, exploro, enseño y experimento. Mi trabajo no cabe en una sola disciplina: conecta ideas, personas, tecnología y distintas formas de crear. Me gusta aprender haciendo, moverme entre lo que conozco y lo que todavía está por descubrir, y encontrar posibilidades donde otros ven límites. La curiosidad me mueve. El diseño es mi forma de explorarla.',
    more: 'Conóceme',
  },
  en: {
    text: "I'm Maria Paula. I design, explore, teach and experiment. My work doesn't fit in a single discipline: it connects ideas, people, technology and different ways of creating. I like learning by doing, moving between what I know and what is still waiting to be discovered, and finding possibilities where others see limits. Curiosity moves me. Design is my way of exploring it.",
    more: 'Get to know me',
  },
} as const

const EASE = [0.22, 1, 0.36, 1] as const

export default function Intro({ onAbout }: { onAbout?: () => void }) {
  const { lang } = useLang()
  const c = COPY[lang]
  const words = c.text.split(' ')
  const second = words.findIndex((w) => /^(mueve\.|me\.)$/.test(w))
  const pics: Record<number, { file: string; pos: string; tf?: string; origin?: string }> = {
    2: { file: 'intro-foto.jpg', pos: '50% 28%', tf: 'translateY(16%) scale(4)', origin: '50% 30%' },
    [second]: { file: 'hero-n3.jpg', pos: '50% 50%', tf: 'translateY(12%) scale(5)', origin: '49% 30%' },
  }
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-white px-5 py-28 md:py-44 text-black md:px-8">
      <div className="relative z-10 flex max-w-[1000px] flex-col items-center text-center">
        <motion.p
          key={lang}
          className="text-[clamp(16px,1.7vw,30px)] font-medium leading-[1.1] tracking-[-0.035em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ staggerChildren: 0.03 }}
        >
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span className="mr-[0.26em] inline-block" variants={{ hidden: { opacity: 0.08, y: 10 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: EASE }}>
                {w}
              </motion.span>
              {pics[i] && (
                <motion.span
                  className="group relative mr-[0.26em] inline-block h-[1.35em] w-[2.1em] -my-[0.3em] align-middle overflow-hidden bg-neutral-200"
                  variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <img
                    src={homeAsset(pics[i].file)}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)] [transition:filter_0.55s_ease] group-hover:[filter:grayscale(0)]"
                    style={{ objectPosition: pics[i].pos, transform: pics[i].tf, transformOrigin: pics[i].origin }}
                  />
                </motion.span>
              )}
            </Fragment>
          ))}
        </motion.p>
        <motion.div
          className="mt-14 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          <button type="button" onClick={onAbout} className="group flex cursor-pointer items-center gap-4 rounded-full bg-black py-2 pl-6 pr-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-black/80">
            {c.more}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[16px] text-black transition-transform duration-500 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
