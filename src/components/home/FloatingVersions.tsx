import { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { ProjectArea, ProjectAreaId } from '../../data/content'
import { useLang } from '../../i18n/LanguageContext'
import { UX_PROJECTS } from '../windows/UxuiGallery'
import { INDUSTRIAL_PROJECTS } from '../windows/IndustrialGallery'
import { GRAFICO_PROJECTS } from '../windows/GraficoGallery'
import { OTROS_PROJECTS } from '../windows/OtrosGallery'
import { M_PATH } from './mPath'
import { V_PATH } from './vPath'

const COUNT: Record<ProjectAreaId, number> = {
  uxui: UX_PROJECTS.length,
  industrial: INDUSTRIAL_PROJECTS.length,
  grafico: GRAFICO_PROJECTS.length,
  otros: OTROS_PROJECTS.length,
}

const WHAT: Record<ProjectAreaId, { es: string; en: string }> = {
  uxui: { es: 'Páginas web, apps', en: 'Websites, apps' },
  industrial: { es: 'Mobiliario, producto', en: 'Furniture, product' },
  grafico: { es: 'Branding', en: 'Branding' },
  otros: { es: 'IA, ilustración', en: 'AI, illustration' },
}

// Segunda escena (se ve al hacer scroll hacia el cielo): título a la izquierda y, a la derecha,
// 4 cards verticales en fila como un carrusel (la última asoma por el borde de la pantalla).
const layout: Record<ProjectAreaId, { bg: string; float: number; shift: number; top: number; zoom: number }> = {
  uxui: { bg: '#d6ff7a', float: 7.5, shift: -50, top: -8, zoom: 125 },
  industrial: { bg: '#a9d2ff', float: 8.5, shift: -51, top: -1.5, zoom: 120 },
  grafico: { bg: '#cfc0ff', float: 9, shift: -49, top: 3, zoom: 126 },
  otros: { bg: '#ffb3e6', float: 7, shift: -49, top: -8, zoom: 126 },
}

function Card({
  area,
  img,
  index,
  progress,
  active,
  dim,
  compact = false,
  onHover,
  onOpen,
}: {
  area: ProjectArea
  img: string | undefined
  index: number
  progress: MotionValue<number>
  active: boolean
  dim: boolean
  compact?: boolean
  onHover: (on: boolean) => void
  onOpen: () => void
}) {
  const c = layout[area.id]
  const { lang } = useLang()
  const at = 0.62 + index * 0.08
  const opacity = useTransform(progress, [at - 0.12, at + 0.08], [0, 1])
  const scale = useTransform(progress, [at - 0.12, at + 0.12], [0.7, 1])
  const lift = useTransform(progress, [at - 0.12, at + 0.12], [60, 0])
  return (
    <motion.div className={`shrink-0 ${compact ? 'snap-center' : ''}`} style={{ opacity, scale, y: lift }}>
      <div
        style={{
          ['--r0' as string]: '0deg',
          ['--r1' as string]: '0deg',
          ['--fy' as string]: `${-6 - c.float * 0.6}px`,
          animation: `home-float ${c.float}s ease-in-out infinite`,
        }}
      >
        <button
          type="button"
          tabIndex={active ? 0 : -1}
          onClick={onOpen}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
          aria-label={area.title}
          data-vcard={area.id}
          className="group relative block cursor-pointer overflow-hidden rounded-[26px] outline-none transition-[transform,opacity,filter] duration-300 ease-out hover:scale-[1.04] focus-visible:scale-[1.04]"
          style={{
            pointerEvents: active ? 'auto' : 'none',
            opacity: dim ? 0.62 : 1,
            filter: dim ? 'saturate(0.8)' : 'none',
            height: compact ? 'min(41vh, 100vw)' : 'min(54vh, 30vw)',
            aspectRatio: '0.64 / 1',
            background: c.bg,
            boxShadow: '0 18px 36px -20px rgba(12,60,140,0.5), 0 0 0 1px rgba(255,255,255,0.35)',
          }}
        >
          <img
            src={img}
            alt=""
            draggable={false}
            className="absolute max-w-none select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ width: `${c.zoom}%`, left: '50%', bottom: 0, transform: `translateX(${c.shift}%)`, transformOrigin: '50% 100%' }}
          />
          <span data-vlabel className="absolute inset-x-3 bottom-3 rounded-[16px] border border-white/60 bg-white/80 px-3.5 py-2.5 text-left shadow-md backdrop-blur-md">
            <span className="flex items-center justify-between gap-2">
              <span className="block text-[clamp(13px,1.05vw,17px)] font-semibold leading-tight text-ink">{area.name}</span>
              <span className="shrink-0 rounded-full bg-ink/[0.07] px-2 py-0.5 text-[clamp(9px,0.7vw,11px)] font-semibold text-ink/70">
                {COUNT[area.id]} {lang === 'en' ? (COUNT[area.id] === 1 ? 'project' : 'projects') : COUNT[area.id] === 1 ? 'proyecto' : 'proyectos'}
              </span>
            </span>
            <span className="mt-0.5 block text-[clamp(9px,0.7vw,11.5px)] font-medium leading-tight text-ink/55">{WHAT[area.id][lang === 'en' ? 'en' : 'es']}</span>
          </span>
        </button>
      </div>
    </motion.div>
  )
}

export default function FloatingVersions({
  areas,
  images,
  progress,
  active,
  onOpen,
}: {
  areas: ProjectArea[]
  images: Record<ProjectAreaId, string | undefined>
  progress: MotionValue<number>
  active: boolean
  onOpen: (id: ProjectAreaId) => void
}) {
  const rail = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<ProjectAreaId | null>(null)
  const { lang } = useLang()
  const titleOpacity = useTransform(progress, [0.55, 0.75], [0, 1])
  const titleY = useTransform(progress, [0.55, 0.75], [30, 0])
  const railOpacity = useTransform(progress, [0.5, 0.7], [0, 1])

  // Arrastrar con el mouse para recorrer el carrusel (un clic sin arrastre sigue abriendo la card).
  const drag = useRef({ down: false, moved: false, x: 0, left: 0, id: -1 })
  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !rail.current) return
    drag.current = { down: true, moved: false, x: e.clientX, left: rail.current.scrollLeft, id: e.pointerId }
  }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current
    const el = rail.current
    if (!d.down || !el) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      el.setPointerCapture(d.id)
      el.style.cursor = 'grabbing'
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }
  function onUp() {
    const el = rail.current
    drag.current.down = false
    if (el) el.style.cursor = ''
    // El clic que sigue al arrastre se ignora (ver onClickCapture).
    window.setTimeout(() => {
      drag.current.moved = false
    }, 0)
  }

  // Al llevar el mouse a los bordes de la pantalla, el carrusel se desplaza solo (más rápido mientras más cerca del borde).
  useEffect(() => {
    if (!active) return
    let mx: number | null = null
    let raf = 0
    function onMove(e: PointerEvent) {
      mx = e.pointerType === 'mouse' ? e.clientX : null
    }
    function onLeave() {
      mx = null
    }
    function tick() {
      const el = rail.current
      if (el && mx !== null && window.innerWidth >= 768 && !drag.current.moved) {
        const w = window.innerWidth
        const zone = w * 0.12
        if (mx > w - zone) el.scrollLeft += 1.2 + ((mx - (w - zone)) / zone) * 5
        else {
          // Izquierda: el borde donde las cards se cortan (el inicio del carrusel), no el borde de la pantalla.
          const edge = el.getBoundingClientRect().left
          const lz = w * 0.06
          const d = Math.abs(mx - edge)
          if (d < lz) el.scrollLeft -= 1.2 + (1 - d / lz) * 5
        }
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [active])

  const titleBlock = (compact: boolean) => (
    <motion.div
      className={compact ? 'absolute left-7 top-[12%] text-white' : 'absolute left-[5%] top-1/2 -mt-[56px] ml-[80px] -translate-y-1/2 text-white'}
      style={{ opacity: titleOpacity, y: titleY, textShadow: '0 4px 30px rgba(18,84,190,0.3)', fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: compact ? 'clamp(38px, 12.5vw, 58px)' : 'clamp(34px, 4.2vw, 80px)', lineHeight: 1, letterSpacing: '-0.03em' }}
    >
      <h2 aria-label={lang === 'en' ? 'My versions' : 'Mis versiones'} className="font-normal">
        <span aria-hidden className={`relative flex items-baseline whitespace-nowrap ${compact ? 'top-[1.17em] ml-[1.83em]' : 'top-[70px] ml-[110px]'}`}>
          <svg viewBox="0 -604 1155 604" style={{ display: 'block', overflow: 'visible', fill: 'currentColor', width: '3.0em', height: '1.57em', marginRight: '-0.89em' }}>
            <path d={M_PATH} stroke="currentColor" strokeWidth={5} strokeLinejoin="round" />
          </svg>
          {lang === 'en' ? 'y' : 'is'}
        </span>
        <span aria-hidden className="mt-[0.15em] flex items-baseline whitespace-nowrap">
          <svg viewBox="-7 -629 690 629" style={{ display: 'block', overflow: 'visible', fill: 'currentColor', width: '1.794em', height: '1.635em', marginRight: '-0.82em' }}>
            <path d={V_PATH} stroke="currentColor" strokeWidth={5} strokeLinejoin="round" />
          </svg>
          {lang === 'en' ? 'ersions' : 'ersiones'}
        </span>
      </h2>
      <p style={{ fontWeight: 300, fontSize: '0.3em', letterSpacing: '0.04em', marginTop: '0.5em' }}>
        {lang === 'en' ? 'Four disciplines, one point of view.' : 'Cuatro disciplinas, una misma mirada.'}
      </p>
    </motion.div>
  )

  return (
    <>
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {titleBlock(false)}

      {/* Carrusel de cards, a la derecha */}
      <motion.div
        ref={rail}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
        className="absolute inset-y-0 left-[40%] right-0 flex cursor-grab items-center gap-5 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          opacity: railOpacity,
          pointerEvents: active ? 'auto' : 'none',
          paddingRight: '6vw',
          paddingTop: '4vh',
          paddingBottom: '8vh',
        }}
      >
        {areas.map((a, i) => (
          <Card key={a.id} area={a} img={images[a.id]} index={i} progress={progress} active={active} dim={!!hovered && hovered !== a.id} onHover={(on) => setHovered(on ? a.id : null)} onOpen={() => onOpen(a.id)} />
        ))}
      </motion.div>

    </div>

    {/* Celular: título arriba y carrusel horizontal de cards abajo */}
    <div className="pointer-events-none absolute inset-0 md:hidden">
      {titleBlock(true)}
      <motion.div
        className="absolute inset-x-0 bottom-[14%] flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-[18vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ opacity: railOpacity, pointerEvents: active ? 'auto' : 'none', scrollPaddingInline: '18vw' }}
      >
        {areas.map((a, i) => (
          <Card key={a.id} compact area={a} img={images[a.id]} index={i} progress={progress} active={active} dim={false} onHover={() => {}} onOpen={() => onOpen(a.id)} />
        ))}
      </motion.div>
    </div>
    </>
  )
}
