import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, useUI } from '../i18n/LanguageContext'
import { useContent } from '../i18n/useContent'
import { useIsMobile } from '../mobile/useIsMobile'
import type { ProjectAreaId, WindowId } from '../data/content'
import ProjectsWindow from '../components/windows/ProjectsWindow'
import FitLines from './FitLines'
import Sheet from './Sheet'
import Manifesto from './Manifesto'
import HeroPhotos from './HeroPhotos'
import ProjectColumns from './ProjectColumns'
import Intro from './Intro'
import { AboutPage, ContactPage, DocumentsPage } from './Pages'
import { copy } from './copy'
import { popBack } from '../mobile/backStack'
import { homeAsset } from '../data/assets'

const ROLES = {
  es: ['Creadora digital', 'Diseñadora UX/UI', 'Diseñadora industrial', 'Exploradora de IA', 'Docente', 'Branding', 'Producto digital', 'Contenido', '3D'],
  en: ['Digital creator', 'UX/UI designer', 'Industrial designer', 'AI explorer', 'Teacher', 'Branding', 'Digital product', 'Content', '3D'],
}

const NAV: WindowId[] = ['about', 'projects', 'documents', 'contact']

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}


export default function Editorial() {
  const { lang, setLang } = useLang()
  const t = useUI()
  const { contact } = useContent()
  const mobile = useIsMobile()
  const c = copy[lang]
  const [sheet, setSheet] = useState<{ id: WindowId; area?: ProjectAreaId; project?: string; token: number } | null>(null)
  const [menu, setMenu] = useState(false)
  const [narrow, setNarrow] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 979px)').matches : false))
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 979px)')
    const on = () => {
      setNarrow(mq.matches)
      if (!mq.matches) setMenu(false)
    }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  // Celular: el "atrás" (botón de la pantalla, gesto o botón del navegador) cierra el detalle de proyecto abierto.
  useEffect(() => {
    if (!mobile) return
    const onPop = () => {
      popBack()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [mobile])
  const langToggle = (layoutId: string, dark = false) => (
    <span className={`relative flex rounded-full p-[3px] ${dark ? 'bg-white/15' : 'bg-black/[0.07]'}`} role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`relative cursor-pointer rounded-full px-3 py-1 text-[12px] uppercase leading-none transition-colors duration-300 ${lang === l ? (dark ? 'text-black' : 'text-white') : dark ? 'text-white/60 hover:text-white' : 'text-black/55 hover:text-black'}`}>
          {lang === l && <motion.span layoutId={layoutId} className={`absolute inset-0 rounded-full ${dark ? 'bg-white' : 'bg-black'}`} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="relative">{l}</span>
        </button>
      ))}
    </span>
  )
  const open = (id: WindowId, area?: ProjectAreaId, project?: string) => {
    setMenu(false)
    document.querySelector('[data-sheet-scroll]')?.scrollTo({ top: 0, behavior: 'smooth' })
    setSheet({ id, area, project, token: Date.now() })
  }
  const home = () => {
    setSheet(null)
    setMenu(false)
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const homeLabel = lang === 'es' ? 'Inicio' : 'Home'
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800

  return (
    <>
      {/* Barra fija: se invierte sola sobre fondos blancos y negros */}
      <header className="fixed inset-x-0 top-0 z-[70] flex h-14 items-center justify-between border-b border-black/10 bg-white/90 px-5 text-black backdrop-blur-md md:px-8">
        <button type="button" onClick={() => { setSheet(null); setMenu(false) }} className="pointer-events-auto flex cursor-pointer items-center gap-2.5 text-left text-[13px] font-medium uppercase tracking-[0.06em]"><img src="/favicon.svg" alt="" draggable={false} className="h-7 w-7" /><span className="max-[399px]:hidden">Maria Paula Vásquez Arango</span></button>
        <nav className="pointer-events-auto flex items-center gap-6 text-[13px] font-medium uppercase tracking-[0.06em]">
          {!narrow && (
            <>
              <button type="button" onClick={home} className={`cursor-pointer uppercase hover:underline ${sheet === null ? 'underline underline-offset-4' : ''}`}>
                {homeLabel}
              </button>
              {NAV.map((id) => (
                <button key={id} type="button" onClick={() => open(id)} className={`cursor-pointer uppercase hover:underline ${sheet?.id === id ? 'underline underline-offset-4' : ''}`}>
                  {t.windows[id].label}
                </button>
              ))}
              {langToggle('lang-thumb')}
            </>
          )}
          {narrow && (
            <button type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} className="cursor-pointer uppercase">
              {menu ? c.nav.close : c.nav.menu}
            </button>
          )}
        </nav>
      </header>

      {/* Menú lateral (menos de 980 px): entra por la derecha y se cierra al pulsar afuera */}
      <AnimatePresence>
        {narrow && menu && (
          <>
            <motion.div key="menu-bg" className="fixed inset-0 z-[64] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={() => setMenu(false)} aria-hidden />
            <motion.aside
              key="menu-panel"
              className="fixed bottom-0 right-0 top-14 z-[66] flex w-[min(340px,86vw)] flex-col gap-1 overflow-y-auto bg-black px-6 pb-8 pt-6 text-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {[{ id: 'home', label: homeLabel, active: sheet === null, go: home }, ...NAV.map((id) => ({ id, label: t.windows[id].label, active: sheet?.id === id, go: () => open(id) }))].map((it) => (
                <button key={it.id} type="button" onClick={it.go} className={`cursor-pointer border-b border-white/30 py-4 text-left text-[clamp(26px,7vw,36px)] font-medium uppercase leading-none tracking-[-0.03em] ${it.active ? '' : 'opacity-70 hover:opacity-100'}`}>
                  {it.label}
                </button>
              ))}
              <div className="mt-8 self-start text-[13px] font-medium">{langToggle('lang-thumb-menu', true)}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-white text-black" style={{ fontFamily: "'Neue Montreal', Inter, sans-serif", fontWeight: 500 }}>
        <div>
        {/* 00 · Hero */}
        <section className="relative flex min-h-[100svh] flex-col bg-black px-5 pb-0 pt-20 text-white md:px-8">
          <HeroPhotos />
          <div className="relative z-10 flex flex-1 items-center">
            <FitLines key={lang + mobile} lines={mobile ? c.heroTall : c.heroWide} maxHeight={vh * 0.72} />
          </div>
          <div className="relative z-10 -mx-5 overflow-hidden border-t border-white/20 bg-black py-3 text-white md:-mx-8" role="group" aria-label={ROLES[lang].join(', ')}>
            <motion.div className="flex w-max" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 38, ease: 'linear', repeat: Infinity }}>
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0 items-center" aria-hidden>
                  {ROLES[lang].map((r) => (
                    <span key={r} className="flex items-center text-[clamp(18px,1.9vw,30px)] font-medium uppercase tracking-[-0.01em]">
                      <span className="px-6 md:px-10">{r}</span>
                      <span className="text-[0.6em] opacity-60">●</span>
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <Intro onAbout={() => open('about')} />

        <ProjectColumns onOpen={(a) => open('projects', a)} />

        <Manifesto />

        {/* Cierre */}
        <section className="flex min-h-[60svh] flex-col justify-end bg-black px-5 pb-10 pt-16 text-white md:px-8 md:pb-14">
          <div className="grid items-end gap-14 md:grid-cols-[1.35fr_1fr] md:gap-10">
            <div>
              <Reveal>
                <h2 className="text-[clamp(64px,12.5vw,240px)] font-medium uppercase leading-[0.86] tracking-[-0.05em]">{(lang === 'es' ? ['HABLE', 'MOS.'] : c.cta.title.split(' ')).map((ln) => (
                    <span key={ln} className="block">
                      {ln}
                    </span>
                  ))}
                </h2>
              </Reveal>
              <p className="mt-6 max-w-[30ch] text-[clamp(16px,1.6vw,26px)] leading-tight opacity-80">{c.cta.sub}</p>
            </div>
            <div className="flex flex-col">
              <motion.div
                className="relative mb-6 aspect-[32/9] overflow-hidden bg-neutral-900"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={homeAsset('cierre-foto.jpg')}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_brightness(0.92)] [transition:filter_0.6s_ease,transform_0.9s_ease] hover:[filter:grayscale(0)]"
                  style={{ objectPosition: '50% 0%', transform: 'translate(6%, -40px) scale(1.9)', transformOrigin: '45% 3%' }}
                />
              </motion.div>
              {contact.links.filter((l) => l.id !== 'behance').map((l) => (
                <a key={l.id} href={l.href} target="_blank" rel="noreferrer" className="group flex flex-col gap-2 border-t border-white/30 py-5 first:border-t-[3px] first:border-white">
                  <span className="text-[11px] uppercase tracking-[0.08em] opacity-60">{l.label}</span>
                  <span className="break-words text-[clamp(16px,1.7vw,28px)] font-medium leading-[1.05] tracking-[-0.03em] underline-offset-4 group-hover:underline">{l.value} ↗</span>
                </a>
              ))}
            </div>
          </div>

        </section>
        </div>
      </main>

      <AnimatePresence>
        {sheet && (
          <Sheet key={sheet.id} title={t.windows[sheet.id].label} closeLabel={c.nav.close} onClose={() => setSheet(null)}>
            {sheet.id === 'projects' ? (
              <ProjectsWindow compact={mobile} openArea={sheet.area ?? 'uxui'} openAreaToken={sheet.token} openProject={sheet.project && sheet.area ? { area: sheet.area, id: sheet.project, token: sheet.token } : null} />
            ) : sheet.id === 'about' ? (
              <AboutPage key={lang} onContact={() => open('contact')} />
            ) : sheet.id === 'documents' ? (
              <DocumentsPage />
            ) : (
              <ContactPage />
            )}
          </Sheet>
        )}
      </AnimatePresence>
    </>
  )
}
