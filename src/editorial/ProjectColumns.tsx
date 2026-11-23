import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { useContent } from '../i18n/useContent'
import { assetUrl } from '../data/assets'
import { BY_AREA } from '../components/home/ProjectCards'
import type { ProjectAreaId } from '../data/content'
import { useIsMobile } from '../mobile/useIsMobile'

// Escala de cada foto (la de UX/UI está tomada más cerca, por eso va más pequeña).
const PHOTO_SCALE: Record<ProjectAreaId, number> = { uxui: 0.9, grafico: 0.95, industrial: 1, otros: 0.89 }
// Cuántos px se sube cada foto (sin dejar hueco abajo).
const PHOTO_LIFT: Record<ProjectAreaId, number> = { uxui: 160, grafico: 20, industrial: 20, otros: 140 }
const PHOTO: Record<ProjectAreaId, string> = { uxui: 'uxui', grafico: 'dg', industrial: 'di', otros: 'otros' }

// Las 4 Paulas: una columna alta por área, numeradas, con la foto en blanco y negro.
export default function ProjectColumns({ onOpen }: { onOpen: (area: ProjectAreaId) => void }) {
  const { lang } = useLang()
  const { projectAreas } = useContent()
  const mobile = useIsMobile()
  const [hov, setHov] = useState<number | null>(null)
  const [auto, setAuto] = useState(0)
  const total = projectAreas.length
  // Autoavance cada 3 s; se detiene mientras el mouse está encima y retoma desde la columna donde quedó.
  useEffect(() => {
    if (hov !== null) {
      setAuto(hov)
      return
    }
    const id = window.setInterval(() => setAuto((n) => (n + 1) % total), 3000)
    return () => window.clearInterval(id)
  }, [hov])
  const shown = hov ?? auto
  return (
    <section className="relative bg-white">
     <div className="flex h-[100svh] min-h-[560px] flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-px bg-black/10 md:flex">
        {projectAreas.map((a, i) => (
          <motion.button
            key={a.id}
            type="button"
            onClick={() => onOpen(a.id)}
            style={{ flex: `${shown === i ? 2.2 : 1} 1 0%`, transition: 'flex-grow 1100ms cubic-bezier(0.65,0,0.35,1)', ...(mobile ? {} : { clipPath: shown === i ? 'inset(0 -160px)' : 'inset(0)', zIndex: shown === i ? 10 : 0 }) }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex min-w-0 cursor-pointer flex-col items-center justify-center bg-[#f4f4f4] max-md:overflow-hidden p-4 text-left"
          >
            <img
              src={assetUrl(`${PHOTO[a.id]}.webp`)}
              decoding="async"
              alt=""
              draggable={false}
              className={`absolute left-1/2 top-0 max-w-none ${mobile ? 'object-cover object-bottom' : 'object-cover object-top'}`}
              style={{ width: mobile ? '100%' : 'auto', minWidth: mobile ? undefined : '42vw', height: mobile ? '100%' : `calc(100% + ${PHOTO_LIFT[a.id]}px)`, transform: mobile ? 'translateX(-50%)' : `translateX(-50%) translateY(-${PHOTO_LIFT[a.id]}px) scale(${PHOTO_SCALE[a.id]})`, transformOrigin: '50% 100%', opacity: shown === i ? 1 : 0, transition: 'opacity 1000ms cubic-bezier(0.65,0,0.35,1)', filter: 'grayscale(1) contrast(1.1) brightness(0.8)' }}
            />
            {mobile && <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[34%]" style={{ background: 'linear-gradient(to top, #f4f4f4 45%, rgba(244,244,244,0))', opacity: shown === i ? 1 : 0, transition: 'opacity 1000ms cubic-bezier(0.65,0,0.35,1)' }} />}
            <span className="relative z-10 text-[clamp(110px,17vw,300px)] leading-none transition-colors duration-500" style={{ color: shown === i ? '#fff' : undefined, fontFamily: "'Antonio', sans-serif", fontWeight: 200 }}>
              {i + 1}
            </span>
            <span className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-2 transition-colors duration-500 md:inset-x-5" style={shown === i && !mobile ? { color: '#fff', mixBlendMode: 'difference' } : undefined}>
              <span className="block">
                <span className="inline-block rounded-full border border-current px-3 py-[2px] text-[10px] uppercase tracking-[0.08em]">{a.name}</span>
                <span className="mt-2 block text-[13px] leading-tight">{a.title}</span>
                <span className="block text-[11px] opacity-60">{BY_AREA[a.id].length} {lang === 'es' ? 'proyectos' : 'projects'}</span>
              </span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[12px] text-white transition-colors" style={shown === i && !mobile ? { background: '#fff', color: '#000' } : undefined}>→</span>
            </span>
          </motion.button>
        ))}
      </div>
     </div>
    </section>
  )
}
