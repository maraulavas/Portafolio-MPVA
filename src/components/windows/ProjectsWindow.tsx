import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../../i18n/useContent'
import { useUI } from '../../i18n/LanguageContext'
import type { ProjectAreaId } from '../../data/content'
import VersionCard from '../VersionCard'
import CursorLabel from '../CursorLabel'
import IndustrialGallery from './IndustrialGallery'
import GraficoGallery from './GraficoGallery'
import OtrosGallery from './OtrosGallery'
import { BackToCardsContext } from './backToCards'
import UxuiGallery from './UxuiGallery'


export default function ProjectsWindow({
  onSubtitle,
  openArea = null,
  openAreaToken = 0,
  openProject = null,
  compact = false,
  onBackToCards,
}: {
  onSubtitle?: (s: string) => void
  openArea?: ProjectAreaId | null
  openAreaToken?: number
  // Abre directo un proyecto puntual (viene de las cards del inicio).
  openProject?: { area: ProjectAreaId; id: string; token: number } | null
  // Celular: las versiones van en una fila de perfiles arriba (como el chat) en vez de la barra lateral.
  compact?: boolean
  // Vuelve al carrusel de cards del inicio para el área dada.
  onBackToCards?: (area: ProjectAreaId) => void
}) {
  const { projectAreas } = useContent()
  const t = useUI()
  const [activeId, setActiveId] = useState<ProjectAreaId | null>(openArea)
  // Al pedir "Ver proyectos" de una versión, abrir directo en esa disciplina.
  useEffect(() => {
    if (openArea) setActiveId(openArea)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAreaToken])
  const [cursor, setCursor] = useState<{ label: string | null; x: number; y: number }>({
    label: null,
    x: 0,
    y: 0,
  })
  const area = projectAreas.find((a) => a.id === (activeId ?? (compact ? 'uxui' : null))) ?? null


  // Estado de "salto directo" a un proyecto dentro de cada vista (galería de portadas).
  // Proyecto abierto en la galería activa (para resaltarlo en la barra lateral).
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [uxOpenId, setUxOpenId] = useState<string | null>(null)
  const [uxToken, setUxToken] = useState(0)
  const [nbOpenId, setNbOpenId] = useState<string | null>(null)
  const [nbToken, setNbToken] = useState(0)
  const [grOpenId, setGrOpenId] = useState<string | null>(null)
  const [grToken, setGrToken] = useState(0)
  const [otrosOpenId, setOtrosOpenId] = useState<string | null>(null)
  const [otrosToken, setOtrosToken] = useState(0)

  // Abre un proyecto puntual desde el dropdown de la barra lateral.
  function jumpToProject(areaId: ProjectAreaId, itemId: string) {
    setActiveId(areaId)
    if (areaId === 'uxui') {
      setUxOpenId(itemId)
      setUxToken((t) => t + 1)
    } else if (areaId === 'industrial') {
      setNbOpenId(itemId)
      setNbToken((t) => t + 1)
    } else if (areaId === 'grafico') {
      setGrOpenId(itemId)
      setGrToken((t) => t + 1)
    } else {
      setOtrosOpenId(itemId)
      setOtrosToken((t) => t + 1)
    }
  }

  // Al elegir la profesión en sí (no un proyecto puntual), siempre volvemos a su
  // grilla de portadas, aunque hubiera un proyecto abierto.
  function goToAreaHome(areaId: ProjectAreaId) {
    setActiveId(areaId)
    setCurrentProjectId(null)
    if (areaId === 'uxui') {
      setUxOpenId(null)
      setUxToken((t) => t + 1)
    } else if (areaId === 'industrial') {
      setNbOpenId(null)
      setNbToken((t) => t + 1)
    } else if (areaId === 'grafico') {
      setGrOpenId(null)
      setGrToken((t) => t + 1)
    } else {
      setOtrosOpenId(null)
      setOtrosToken((t) => t + 1)
    }
  }

  const showToggle = !currentProjectId
  const dark = false

  // Reporta el subtítulo de la barra de título de la ventana según el área.
  useEffect(() => {
    onSubtitle?.(area ? t.projects.areaSubtitle(area.id, area.name) : t.windows.projects.subtitle)
  }, [activeId, area, onSubtitle, t])

  // Salto directo a un proyecto (desde las cards del inicio).
  useEffect(() => {
    if (openProject) jumpToProject(openProject.area, openProject.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openProject?.token])

  if (!area) {
    /* ---------- Selector: todo en una sola sección (título + 4 versiones) ---------- */
    return (
      <motion.div
        key="selector"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="flex min-h-full flex-col"
        style={{ background: '#f1edef' }}
      >
        <div className="shrink-0 px-6 pt-8 text-center">
          <h2 className="font-serif text-[30px] italic leading-tight text-ink">{t.projects.chooseTitle}</h2>
          <p className="mt-1 text-[14px] text-ink/55">
            {t.projects.chooseSub}
          </p>
        </div>
        <div
          className="flex flex-1 items-end justify-center px-4 pb-2"
          onMouseMove={(e) => setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY }))}
          onMouseLeave={() => setCursor((c) => ({ ...c, label: null }))}
        >
          {projectAreas.map((a) => (
            <VersionCard
              key={a.id}
              area={a}
              onOpen={() => setActiveId(a.id)}
              onHoverChange={(label) => setCursor((c) => ({ ...c, label }))}
            />
          ))}
        </div>
        {cursor.label && <CursorLabel label={cursor.label} x={cursor.x} y={cursor.y} />}
      </motion.div>
    )
  }

  /* ---------- Proyectos del área elegida ---------- */
  const renderToggle = (pillId: string) => (
<div className={`no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto max-md:flex max-md:w-full rounded-full p-1 transition-colors ${dark ? 'bg-white/[0.14]' : 'bg-black/[0.07]'}`} role="group">
          {projectAreas.map((a) => {
            const isActive = a.id === area.id
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => goToAreaHome(a.id)}
                aria-pressed={isActive}
                aria-label={a.name}
                title={a.name}
                className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-full px-5 py-2.5 max-md:min-w-0 max-md:shrink max-md:flex-1 max-md:justify-center max-md:px-2 max-md:py-2.5"
              >
                {isActive && <motion.span layoutId={pillId} className={`absolute inset-0 rounded-full ${dark ? 'bg-white' : 'bg-black'}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className={`relative whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.06em] max-md:text-[clamp(9px,2.7vw,11px)] max-md:tracking-[0.02em] transition-colors duration-300 ${isActive ? (dark ? 'text-black' : 'text-white') : dark ? 'text-white/55' : 'text-black/55'}`}>{a.name}</span>
              </button>
            )
          })}
        </div>
  )
  const toggle = renderToggle('proj-pill')
  return (
    <BackToCardsContext.Provider value={onBackToCards && activeId ? () => onBackToCards(activeId) : null}>
    <motion.div
      key="area-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className={`relative flex min-h-full flex-col transition-colors duration-500 ${dark ? 'bg-black text-white' : 'bg-white'}`}
    >
      {showToggle && (
        <div className="absolute right-5 z-10 max-w-[calc(100%-130px)] top-[calc(34px*0.44+2px)] max-[539px]:static max-[539px]:max-w-full max-[539px]:px-5 max-[539px]:pt-5 md:right-8 md:max-w-full md:top-[calc(clamp(34px,6vw,96px)*0.88-16px)]">
          {toggle}
        </div>
      )}

      {/* Contenido del área activa: las 4 secciones usan la misma galería de portadas. */}
      <div className="min-w-0 flex-1">
        {area.id === 'industrial' ? (
          <IndustrialGallery openId={nbOpenId} openToken={nbToken} onOpenChange={setCurrentProjectId} />
        ) : area.id === 'grafico' ? (
          <GraficoGallery openId={grOpenId} openToken={grToken} onOpenChange={setCurrentProjectId} />
        ) : area.id === 'uxui' ? (
          <UxuiGallery openId={uxOpenId} openToken={uxToken} onOpenChange={setCurrentProjectId} />
        ) : (
          <OtrosGallery openId={otrosOpenId} openToken={otrosToken} onOpenChange={setCurrentProjectId} />
        )}
      </div>
    </motion.div>
    </BackToCardsContext.Provider>
  )
}
