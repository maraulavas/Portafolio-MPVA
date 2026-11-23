import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ProjectArea, ProjectAreaId } from '../data/content'
import { asset } from '../data/assets'
import { useUI } from '../i18n/LanguageContext'
import { skillsFor } from '../components/Dock'

// Fotos de las 4 versiones (recortes de cuerpo completo con fondo transparente).
export const versionPhoto: Record<ProjectAreaId, string | undefined> = {
  uxui: asset('uxui'),
  industrial: asset('di'),
  grafico: asset('dg'),
  otros: asset('otros'),
}

// Pantalla "Versiones de mí": una versión por página, a todo el ancho.
// Arriba el título y el subtítulo; abajo la foto sin fondo, grande (se recorta a la
// altura de las piernas). Se desliza de lado.
// Debajo de la descripción van las herramientas; sobre la parte baja de la foto, solo "Ver proyectos".
export default function VersionCarousel({
  areas,
  onSeeProjects,
}: {
  areas: ProjectArea[]
  onSeeProjects: (id: ProjectAreaId) => void
}) {
  const t = useUI()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function onScroll() {
    const el = trackRef.current
    if (!el) return
    setActive(Math.max(0, Math.min(areas.length - 1, Math.round(el.scrollLeft / el.clientWidth))))
  }

  return (
    <section aria-label={t.mobile.versions} className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {areas.map((a, i) => (
          <div key={a.id} className="flex h-full w-full shrink-0 snap-center flex-col">
            <motion.div
              className="shrink-0 px-6 text-center"
              animate={{ opacity: i === active ? 1 : 0.3, y: i === active ? 0 : 8 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-serif text-[32px] italic leading-tight text-ink">{a.title}</h2>
              <p className="mx-auto mt-2 max-w-[330px] text-[14.5px] leading-snug text-ink/60">{a.description}</p>
              <div className="mt-3 flex items-center justify-center gap-2" aria-label={t.mobile.tools}>
                {skillsFor(a.id).map((s) => (
                  <div key={s.name} style={{ zoom: 0.6 }} title={s.name}>
                    {s.icon}
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="relative mt-1 min-h-0 flex-1 overflow-hidden">
              {versionPhoto[a.id] && (
                <motion.img
                  src={versionPhoto[a.id]}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute left-1/2 top-0 h-[165%] w-auto max-w-none -translate-x-1/2 object-contain object-top"
                  style={{ transformOrigin: '50% 0%' }}
                  animate={{ scale: i === active ? 1 : 0.94, opacity: i === active ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
              )}
              {/* Degradado para que las herramientas y el botón se lean sobre la foto */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
                style={{ background: 'linear-gradient(to top, #ededf1 30%, rgba(237,237,241,0.85) 55%, rgba(237,237,241,0))' }}
                aria-hidden
              />
              <motion.div
                className="absolute inset-x-0 flex flex-col items-center gap-3 px-6"
                style={{ bottom: 'calc(env(safe-area-inset-bottom) + 58px)' }}
                animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => onSeeProjects(a.id)}
                  tabIndex={i === active ? 0 : -1}
                  className="flex h-[50px] w-full max-w-[300px] cursor-pointer items-center justify-center gap-2 rounded-full bg-blush-500 text-[16px] font-semibold text-white shadow-md transition active:scale-[0.98] active:bg-blush-600"
                >
                  {t.desktop.seeProjects}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      {/* Indicador de página: debajo del botón, justo encima de la barra de inicio */}
      <div className="pointer-events-none absolute inset-x-0 flex justify-center gap-1.5" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 36px)' }} aria-hidden>
        {areas.map((a, i) => (
          <span
            key={a.id}
            className={`h-[7px] rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-blush-500' : 'w-[7px] bg-ink/20'}`}
          />
        ))}
      </div>
    </section>
  )
}
