import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useSpring, useTransform } from 'framer-motion'
import type { ProjectArea, ProjectAreaId } from '../../data/content'
import { useLang } from '../../i18n/LanguageContext'
import { useIsMobile } from '../../mobile/useIsMobile'
import SkyBackground, { WindCanvas } from './SkyBackground'
import HoverTitle from './HoverTitle'
import FloatingVersions from './FloatingVersions'
import LivelyText from './LivelyText'
import { homeAsset } from '../../data/assets'

// Palabras que giran hacia arriba bajo el título (Diseñadora → Creadora → …).
function RotatingText({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2400)
    return () => window.clearInterval(id)
  }, [words.length])
  return (
    <span className="relative inline-grid overflow-hidden whitespace-nowrap" style={{ height: '1.35em' }}>
      {words.map((w) => (
        <span key={w} aria-hidden className="invisible col-start-1 row-start-1 block">
          {w}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: '70%', opacity: 0, filter: 'blur(3px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-70%', opacity: 0, filter: 'blur(3px)' }}
          transition={{ duration: 0.95, ease: [0.45, 0, 0.2, 1] }}
          className="col-start-1 row-start-1 block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Inicio con scroll: el prado y el título; al hacer scroll la cámara sube hacia el cielo y aparecen las versiones de Paula.
export default function HomeScroll({
  title,
  portfolioLabel,
  areas,
  images,
  onOpen,
  hideCards = false,
  resetToken = 0,
  onScrolled,
  onContact,
  onOutro,
}: {
  title: { start: string; end: string }
  portfolioLabel: string
  areas: ProjectArea[]
  images: Record<ProjectAreaId, string | undefined>
  onOpen: (id: ProjectAreaId) => void
  hideCards?: boolean
  resetToken?: number
  onScrolled?: (scrolled: boolean) => void
  onContact?: () => void
  onOutro?: (outro: boolean) => void
}) {
  const { lang } = useLang()
  const mobile = useIsMobile()
  const target = useRef(0)
  const progress = useSpring(0, { stiffness: 60, damping: 20, mass: 0.7 })
  const [active, setActive] = useState(false)
  const [outro, setOutro] = useState(false)
  const [meadowOn, setMeadowOn] = useState(false)

  // Volver al prado (botón de inicio).
  useEffect(() => {
    if (!resetToken) return
    target.current = 0
    progress.set(0)
  }, [resetToken, progress])

  useEffect(() => onOutro?.(outro), [outro, onOutro])

  useMotionValueEvent(progress, 'change', (v) => {
    setActive(v > 0.88 && v < 1.3)
    setOutro(v > 1.6)
    setMeadowOn(v > 1.0)
    onScrolled?.(v > 0.12)
  })

  // Scroll virtual: la rueda (o las flechas / Re Pág / Av Pág) mueve el progreso de 0 a 1.
  useEffect(() => {
    function set(v: number) {
      target.current = Math.max(0, Math.min(2, v))
      progress.set(target.current)
    }
    function onWheel(e: WheelEvent) {
      const t = e.target as HTMLElement | null
      if (t?.closest('[data-window], [data-cards]')) return
      set(target.current + e.deltaY * 0.0011)
    }
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (t && /input|textarea|select/i.test(t.tagName)) return
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) set(target.current + 0.35)
      else if (['ArrowUp', 'PageUp'].includes(e.key)) set(target.current - 0.35)
    }
    let ty = 0
    let tx = 0
    function onTouchStart(e: TouchEvent) {
      ty = e.touches[0].clientY
      tx = e.touches[0].clientX
    }
    function onTouchMove(e: TouchEvent) {
      const t = e.target as HTMLElement | null
      if (t?.closest('[data-window], [data-cards]')) return
      const y = e.touches[0].clientY
      const x = e.touches[0].clientX
      const horizontal = Math.abs(x - tx) > Math.abs(y - ty)
      tx = x
      if (horizontal) {
        ty = y
        return
      }
      set(target.current + (ty - y) * 0.003)
      ty = y
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [progress])

  // Una sola imagen: la cámara avanza hacia el cielo del mismo fondo (zoom continuo, sin cambiar de imagen).
  // De 1 a 2 (final): un pequeño zoom out y la cámara baja de nuevo hacia el prado.
  const bgScale = useTransform(progress, [0, 1, 2], [1, 1.3, 1.1])
  const bgY = useTransform(progress, [0, 1, 2], ['0%', '14%', '-4%'])
  const bgBlur = useTransform(progress, [0.3, 1, 1.8], ['blur(0px)', 'blur(2px)', 'blur(0px)'])
  const tint = useTransform(progress, [0.3, 0.9, 1.8], [0, 0.1, 0.03])
  const versionsOpacity = useTransform(progress, [1.05, 1.4], [1, 0])
  const versionsY = useTransform(progress, [1, 1.6], ['0vh', '-24vh'])
  // El prado sube desde abajo empujando al cielo; su borde superior va difuminado (la capa es más alta que la pantalla).
  const meadowRise = useTransform(progress, [1.05, 1.8], ['132vh', '0vh'])
  const meadowImgY = useTransform(progress, [1.05, 2], ['-7%', '0%'])
  const ctaOpacity = useTransform(progress, [1.45, 1.85], [0, 1])
  const ctaY = useTransform(progress, [1.45, 1.85], ['5vh', '0vh'])
  // Título y subtítulo: crecen y se desvanecen al "atravesarlos".
  const titleScale = useTransform(progress, [0, 0.5], [1, 1.9])
  const titleY = useTransform(progress, [0, 0.5], ['0vh', '-10vh'])
  const titleOpacity = useTransform(progress, [0, 0.4], [1, 0])
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0])

  const name = 'Maria Paula Vásquez Arango'
  const words = lang === 'en' ? [name, 'Digital Creator', 'Designer', 'AI Explorer', 'Educator'] : [name, 'Creadora Digital', 'Diseñadora', 'Exploradora de IA', 'Docente']
  return (
    <>
      {/* Fondo único: se acerca hacia el cielo al hacer scroll */}
      <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ scale: bgScale, y: bgY, filter: bgBlur, transformOrigin: '50% 30%' }}>
        <SkyBackground />
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 bg-[#2b7be0]" style={{ opacity: tint }} aria-hidden />
      {/* Final: al bajar, el cielo da paso a un primer plano del prado con flores */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[-26%] overflow-hidden"
        style={{ y: meadowRise, visibility: meadowOn ? 'visible' : 'hidden', maskImage: 'linear-gradient(to bottom, transparent 0, #000 21%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 21%)' }}
        aria-hidden
      >
        <motion.div className="absolute inset-0" style={{ y: meadowImgY, scale: 1.08 }}>
          <img src={homeAsset('prado-cierre.jpg')} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          {meadowOn && <WindCanvas src={homeAsset('prado-cierre.jpg') as string} grassFrom={0.05} amp={0.4} />}
        </motion.div>
        <div className="absolute inset-0 bg-[#0b3d1e]/30" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 pb-44 pt-10 text-center"
        style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
      >
        <div className="relative inline-block" style={{ marginBottom: '6vh' }}>
          {/* Corrido a la izquierda para centrar por peso visual (la P cursiva es fina y larga) */}
          <div style={{ transform: 'translateX(-2.4vw)' }}>
            <HoverTitle start={title.start} end={title.end} label={portfolioLabel} />
          </div>
          <p
            className="mt-3 text-white"
            style={{
              fontFamily: "'Neue Montreal', Inter, sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(16px, 1.6vw, 26px)',
              letterSpacing: '0em',
              textShadow: '0 2px 18px rgba(14,70,170,0.4)',
              animation: 'home-rise 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s both',
            }}
          >
            <RotatingText words={words} />
          </p>
        </div>
      </motion.div>

      <motion.div className="absolute inset-0" animate={{ opacity: hideCards ? 0 : 1 }} transition={{ duration: 0.3 }} style={{ pointerEvents: hideCards ? 'none' : undefined }}>
        <motion.div className="absolute inset-0" style={{ opacity: versionsOpacity, y: versionsY }}>
          <FloatingVersions areas={areas} images={images} progress={progress} active={active && !hideCards} onOpen={onOpen} />
        </motion.div>
      </motion.div>

      {/* Final: llamado a la acción sobre el prado */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-24 text-center text-white"
        style={{ opacity: ctaOpacity, y: ctaY }}
      >
        <h2
          className="text-[clamp(36px,5.4vw,88px)] leading-[1.18] [text-shadow:0_2px_30px_rgba(8,50,20,0.45)]"
          style={{ fontFamily: "'Neue Montreal', Inter, sans-serif", fontWeight: 400 }}
        >
          <LivelyText lines={lang === 'en' ? ["Let's", 'Team Up'] : ['Hagamos', 'Equipo']} />
        </h2>
        <p
          className="mt-5 max-w-[34ch] text-[clamp(14px,1.2vw,20px)] leading-snug text-white/95 [text-shadow:0_2px_18px_rgba(8,50,20,0.5)]"
          style={{ fontFamily: "'Neue Montreal', Inter, sans-serif", fontWeight: 400 }}
        >
          {lang === 'en' ? 'Tell me your idea and let’s bring it to life.' : 'Cuéntame tu idea y hagámosla realidad.'}
        </p>
        {onContact && (
          <button
            type="button"
            onClick={onContact}
            tabIndex={outro ? 0 : -1}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/35 px-6 py-2.5 text-[clamp(12px,0.95vw,15px)] font-normal text-white backdrop-blur-2xl transition-colors hover:bg-white/50"
            style={{ pointerEvents: outro ? 'auto' : 'none' }}
          >
            {lang === 'en' ? 'Get in touch' : 'Escríbeme'}
          </button>
        )}
      </motion.div>

      {/* Pista de scroll */}
      <motion.div className="pointer-events-none absolute inset-x-0 bottom-[235px] max-md:bottom-[200px] z-10 flex justify-center" style={{ opacity: hintOpacity }}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-[clamp(12px,0.95vw,15px)] font-normal text-white [text-shadow:0_1px_8px_rgba(14,70,170,0.45)]" style={{ animation: 'home-rise 0.9s cubic-bezier(0.22,1,0.36,1) 1.4s both' }}>
          {mobile ? (lang === 'en' ? 'Swipe up' : 'Desliza') : lang === 'en' ? 'Scroll' : 'Haz scroll'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'home-float 1.6s ease-in-out infinite', ['--fy' as string]: '5px' }} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </motion.div>
    </>
  )
}
