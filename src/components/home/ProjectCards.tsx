import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { ProjectArea, ProjectAreaId } from '../../data/content'
import { assetUrl } from '../../data/assets'
import { useLang } from '../../i18n/LanguageContext'
import { localizeProject } from '../../i18n/useContent'
import type { PortadaProject } from '../windows/PortadasGallery'
import { UX_PROJECTS } from '../windows/UxuiGallery'
import { INDUSTRIAL_PROJECTS } from '../windows/IndustrialGallery'
import { GRAFICO_PROJECTS } from '../windows/GraficoGallery'
import { OTROS_PROJECTS } from '../windows/OtrosGallery'

const AVATAR_BG: Record<ProjectAreaId, string> = { uxui: '#d6ff7a', grafico: '#cfc0ff', industrial: '#a9d2ff', otros: '#ffb3e6' }

// Encuadre de la cara en el círculo del selector: [centro x de la cara, y de la cara] como % de la foto.
const FACE: Record<ProjectAreaId, [number, number]> = { uxui: [44, 25], industrial: [51, 20], grafico: [58, 22], otros: [49, 26] }

export const BY_AREA: Record<ProjectAreaId, PortadaProject[]> = {
  uxui: UX_PROJECTS,
  industrial: INDUSTRIAL_PROJECTS,
  grafico: GRAFICO_PROJECTS,
  otros: OTROS_PROJECTS,
}

// Subtítulos de las cards del carrusel (distintos del subtítulo interno del proyecto).
const CARD_SUB: Record<string, string> = {
  sgi: 'Rediseño web con IA',
  mainatek: 'Diseño web con IA',
  'creacion-digital': 'Diseño web con IA',
  'fundacion-sgi': 'Diseño web con IA',
  'app-sgi': 'Diseño UX/UI y frontend',
}

// Portada en miniatura: foto real, o color de marca + logo, o degradado + monograma.
export function Thumb({ p }: { p: PortadaProject }) {
  if (p.image) {
    return <img src={assetUrl(p.image)} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: p.id === 'app-sgi' ? '0% 50%' : p.id === 'sgi' ? '80% 50%' : p.id === 'mainatek' ? '70% 50%' : undefined }} />
  }
  const logo = p.brand?.logoOnColor ?? p.brand?.logo
  if (p.brand && logo) {
    return (
      <div className="absolute inset-0 grid place-items-center" style={{ background: p.brand.coverBg ?? p.brand.colors[0]?.hex ?? p.base }}>
        <img src={assetUrl(logo)} alt="" draggable={false} className={`object-contain ${p.id === 'mainatek-grafico' ? 'h-[76%] w-[76%]' : p.id === 'behome-light' ? 'h-[46%] w-[46%]' : 'h-[58%] w-[58%]'}`} />
      </div>
    )
  }
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: p.base }}>
      <span className="font-serif text-[34px] italic text-white/90">{p.monogram}</span>
    </div>
  )
}

// Envoltorio con magnificación tipo dock: la card se agranda según la cercanía del mouse.
function MagCard({ mouseX, index = 0, children }: { mouseX: MotionValue<number>; index?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const dist = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect()
    return b ? x - (b.left + b.width / 2) : Infinity
  })
  const raw = useTransform(dist, [-420, -210, 0, 210, 420], [1, 1.02, 1.07, 1.02, 1])
  const scale = useSpring(raw, { mass: 0.1, stiffness: 160, damping: 13 })
  const z = useTransform(scale, (v) => (v > 1.04 ? Math.round(v * 100) : 1))
  return (
    <motion.div ref={ref} className="w-[64vw] max-w-[280px] shrink-0 snap-center md:w-[clamp(200px,min(17.5vw,calc((90vw-80px)/5)),280px)] md:snap-start" style={{ scale, zIndex: z, transformOrigin: '50% 60%' }}>
      <div
        style={{
          ['--fy' as string]: `${-7 - (index % 3)}px`,
          animation: `home-float ${7 + (index % 4) * 0.8}s ease-in-out ${-index * 1.3}s infinite`,
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// Vista de proyectos de una versión: tarjetas redondeadas sobre el mismo cielo.
export default function ProjectCards({
  areas,
  areaId,
  onArea,
  onClose,
  onOpenProject,
  backLabel,
  images,
}: {
  areas: ProjectArea[]
  areaId: ProjectAreaId
  onArea: (id: ProjectAreaId) => void
  onClose: () => void
  onOpenProject: (area: ProjectAreaId, id: string) => void
  backLabel: string
  images: Record<ProjectAreaId, string | undefined>
}) {
  const { lang } = useLang()
  const rail = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(Infinity)
  const [pos, setPos] = useState({ canPrev: false, canNext: true })
  function measure() {
    const el = rail.current
    if (!el) return
    setPos({ canPrev: el.scrollLeft > 4, canNext: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 })
  }
  function go(dir: 1 | -1) {
    const el = rail.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
  }
  const area = areas.find((a) => a.id === areaId)!
  const projects = useMemo(() => BY_AREA[areaId].map((p) => localizeProject(p, lang)), [areaId, lang])

  useEffect(() => {
    measure()
    const id = window.setTimeout(measure, 700)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, lang])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      data-cards
      className="absolute inset-0 z-[5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Barra superior: volver + cambiar de versión */}
      <div className="absolute inset-x-0 top-[64px] z-10 flex flex-col items-start gap-3 px-[5vw] md:top-[85px] md:flex-row md:items-center md:justify-between md:gap-0 md:px-[4vw]">
        <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          aria-label={backLabel}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur transition hover:bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <motion.h2
          key={areaId + 'h'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[clamp(20px,1.8vw,28px)] leading-none text-white"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400, textShadow: '0 2px 14px rgba(14,70,170,0.45)' }}
        >
          {area.title.split(' ').map((w, i) => (
            <span key={i}>
              {i > 0 && ' '}
              {/^\p{L}/u.test(w) ? (
                <>
                  <span style={{ fontFamily: "'Parfumerie Script', serif", fontSize: '1.5em', lineHeight: 0 }}>{w[0]}</span>
                  {w.includes("/") || w === w.toUpperCase() ? w.slice(1).toLowerCase() : w.slice(1)}
                </>
              ) : (
                w
              )}
            </span>
          ))}
        </motion.h2>
        </div>
        <div className="flex gap-0.5 rounded-full border border-white/45 bg-white/20 p-[3px] shadow-[0_8px_28px_-10px_rgba(12,60,140,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl backdrop-saturate-150">
          {areas.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onArea(a.id)}
              className={`flex items-center gap-1.5 rounded-full py-[3px] pl-[3px] text-[12px] font-semibold transition ${a.id === areaId ? 'bg-white/90 pr-3 text-ink shadow-sm' : 'pr-1 text-white/90 hover:bg-white/15 md:pr-3'}`}
            >
              <span data-avatar={a.id} className="relative block h-6 w-6 shrink-0 overflow-hidden rounded-full" style={{ background: AVATAR_BG[a.id] }}>
                <img src={images[a.id]} alt="" draggable={false} className="absolute max-w-none select-none" style={{ width: '160%', left: '50%', top: `${50 - FACE[a.id][1] * 2.06}%`, transform: `translateX(-${FACE[a.id][0]}%)` }} />
              </span>
              <span className={a.id === areaId ? '' : 'max-md:hidden'}>{a.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center pb-[110px] pt-[190px] md:pb-[70px] md:pt-[140px]">
        <div
          ref={rail}
          key={areaId}
          onScroll={measure}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          onWheel={(e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && rail.current) rail.current.scrollLeft += e.deltaY
          }}
          className="flex w-full [justify-content:safe_center] snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[18vw] py-16 md:px-[4vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: '4vw' }}
        >
          {projects.map((p, i) => (
            <MagCard key={p.id} mouseX={mouseX} index={i}>
            <motion.button
              type="button"
              onClick={() => onOpenProject(areaId, p.id)}
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[28px] bg-white text-left shadow-[0_14px_30px_-18px_rgba(12,60,140,0.45)] outline-none"
            >
              <span className="absolute inset-0 block transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                <Thumb p={p} />
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              {p.year && (
                <span className="absolute right-3 top-3 grid h-8 place-items-center rounded-full border border-white/40 bg-white/25 px-3 text-[12px] font-semibold text-white backdrop-blur-md">
                  {p.year}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 block p-4 text-white">
                <span className="block text-[clamp(13px,1.05vw,17px)] font-semibold leading-tight">{p.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-white/80">{CARD_SUB[p.id] ?? p.subtitle}</span>
              </span>
            </motion.button>
            </MagCard>
          ))}
        </div>

        {(['prev', 'next'] as const).map((d) => {
          const enabled = d === 'prev' ? pos.canPrev : pos.canNext
          return (
            <button
              key={d}
              type="button"
              aria-label={d === 'prev' ? 'Anterior' : 'Siguiente'}
              onClick={() => go(d === 'prev' ? -1 : 1)}
              className={`absolute top-1/2 grid max-md:hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/25 text-white shadow-lg backdrop-blur-xl transition hover:bg-white/40 ${d === 'prev' ? 'left-[1.5vw]' : 'right-[1.5vw]'} ${enabled ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={d === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
              </svg>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
