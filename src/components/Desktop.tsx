import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactElement } from 'react'
import type { ProjectAreaId, WindowId } from '../data/content'
import { useContent } from '../i18n/useContent'
import { useLang, useUI } from '../i18n/LanguageContext'
import { asset } from '../data/assets'
import { useWindows } from '../desktop/useWindows'
import MenuBar from './MenuBar'
import SectionDock from './SectionDock'
import HomeScroll from './home/HomeScroll'
import ProjectCards from './home/ProjectCards'
import Window from './Window'
import MinimizedDock from './MinimizedDock'
import ChatAbout from './windows/ChatAbout'
import ProjectsWindow from './windows/ProjectsWindow'
import { morphAllToAvatars, morphAllToCards } from './home/morph'
import DocumentsWindow from './windows/DocumentsWindow'
import ContactWindow from './windows/ContactWindow'

interface WinConfig {
  id: WindowId
  x: number
  y: number
  width: number
  defaultMaximized?: boolean
  centered?: boolean
  opaque?: boolean
  fill?: boolean
  render: () => ReactElement
}

const windowsConfig: WinConfig[] = [
  { id: 'about', x: 120, y: 88, width: 1120, centered: true, opaque: true, fill: true, render: () => <ChatAbout /> },
  { id: 'projects', x: 200, y: 120, width: 680, defaultMaximized: true, opaque: true, render: () => <ProjectsWindow /> },
  { id: 'documents', x: 280, y: 150, width: 560, centered: true, opaque: true, render: () => <DocumentsWindow /> },
  { id: 'contact', x: 300, y: 120, width: 760, centered: true, opaque: true, render: () => <ContactWindow /> },
]

// Fotos de las 4 versiones de Paula (mismas del apartado de proyectos).
const versionImg: Record<ProjectAreaId, string | undefined> = {
  uxui: asset('uxui'),
  industrial: asset('di'),
  grafico: asset('dg'),
  otros: asset('otros'),
}

export default function Desktop() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const wm = useWindows()
  const { projectAreas } = useContent()
  const { lang } = useLang()
  const t = useUI()
  const [homeScrolled, setHomeScrolled] = useState(false)
  const [homeOutro, setHomeOutro] = useState(false)
  const [homeToken, setHomeToken] = useState(0)
  function goHome() {
    wm.closeAll()
    setCardsArea(null)
    setHomeToken((n) => n + 1)
  }
  const [cardsArea, setCardsArea] = useState<ProjectAreaId | null>(null)
  const [openProject, setOpenProject] = useState<{ area: ProjectAreaId; id: string; token: number } | null>(null)
  const [projectsArea, setProjectsArea] = useState<ProjectAreaId | null>(null)
  const [projectsAreaToken, setProjectsAreaToken] = useState(0)
  const [projectsSubtitle, setProjectsSubtitle] = useState('4 versiones')
  const [maximizedIds, setMaximizedIds] = useState<Record<string, boolean>>({})

  // Clic fuera de la ventana activa (en el fondo del escritorio): se minimiza.
  const outsideRef = useRef({ topId: wm.topId, maximized: maximizedIds, minimize: wm.minimizeWindow, isMin: wm.isMinimized })
  outsideRef.current = { topId: wm.topId, maximized: maximizedIds, minimize: wm.minimizeWindow, isMin: wm.isMinimized }
  useEffect(() => {
    function onDown(e: PointerEvent) {
      const t = e.target as HTMLElement | null
      if (!t || t.closest('[data-window], button, a, input, textarea, select, [role="button"]')) return
      const { topId, maximized, minimize, isMin } = outsideRef.current
      if (!topId || maximized[topId] || isMin(topId)) return
      minimize(topId)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  // Entrada: el resto de la interfaz (menú, dock) aparece cuando el título ya empezó a subir.
  const [revealRest, setRevealRest] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setRevealRest(true), 900)
    return () => clearTimeout(id)
  }, [])

  function openOrRestore(id: WindowId) {
    wm.openWindow(id)
    wm.restoreWindow(id)
  }
  function handleOpen(id: WindowId) {
    if (id === 'projects') {
      // Abre directo en una sección (la versión elegida o UX/UI), no en la vista general.
      setProjectsArea('uxui')
      setProjectsAreaToken((t) => t + 1)
    }
    openOrRestore(id)
  }

  const dockCompact = (homeScrolled && !homeOutro) || !!cardsArea || windowsConfig.some((w) => wm.isOpen(w.id))
  const anyMaximized = windowsConfig.some(
    (w) => wm.isOpen(w.id) && !wm.isMinimized(w.id) && maximizedIds[w.id],
  )

  return (
    <div
      ref={constraintsRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: '#2b8ceb' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealRest ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: revealRest ? 'auto' : 'none' }}
      >
        <MenuBar solid={anyMaximized} onHome={goHome} onOpen={(id) => handleOpen(id as WindowId)} />
      </motion.div>

      {/* Inicio: prado + título; al hacer scroll, la cámara sube al cielo y aparecen las 4 versiones */}
      <HomeScroll
        title={{ start: t.brand.titleStart, end: t.brand.titleEnd }}
        portfolioLabel={t.menu.portfolio}
        areas={projectAreas}
        images={versionImg}
        onOpen={(id) => {
          morphAllToAvatars(id)
          setCardsArea(id)
        }}
        hideCards={!!cardsArea}
        resetToken={homeToken}
        onScrolled={setHomeScrolled}
        onContact={() => openOrRestore('contact')}
        onOutro={setHomeOutro}
      />

      <AnimatePresence>
        {cardsArea && (
          <ProjectCards
            key="cards"
            areas={projectAreas}
            areaId={cardsArea}
            onArea={setCardsArea}
            onClose={() => {
              morphAllToCards(cardsArea)
              setCardsArea(null)
            }}
            backLabel={lang === 'en' ? 'Back' : 'Volver'}
            images={versionImg}
            onOpenProject={(area, id) => {
              setProjectsArea(area)
              setOpenProject({ area, id, token: Date.now() })
              openOrRestore('projects')
            }}
          />
        )}
      </AnimatePresence>

      {/* Ventanas */}
      <AnimatePresence>
        {windowsConfig
          .filter((w) => wm.isOpen(w.id))
          .map((w) => (
            <Window
              key={w.id}
              title={t.windows[w.id].label}
              subtitle={w.id === 'projects' ? projectsSubtitle : t.windows[w.id].subtitle}
              z={wm.zOf(w.id)}
              x={w.x}
              y={w.y}
              width={w.width}
              defaultMaximized={w.defaultMaximized}
              centered={w.centered}
              opaque={w.opaque}
              fill={w.fill}
              minimized={wm.isMinimized(w.id)}
              onMinimize={() => wm.minimizeWindow(w.id)}
              onMaximizeChange={(v) => setMaximizedIds((m) => ({ ...m, [w.id]: v }))}
              focused={wm.topId === w.id}
              constraintsRef={constraintsRef}
              onClose={() => wm.closeWindow(w.id)}
              onFocus={() => wm.focusWindow(w.id)}
            >
              {w.id === 'projects' ? (
                <ProjectsWindow onSubtitle={setProjectsSubtitle} openArea={projectsArea} openAreaToken={projectsAreaToken} openProject={openProject} onBackToCards={(a) => { wm.closeWindow('projects'); setCardsArea(a) }} />
              ) : w.id === 'about' ? (
                <ChatAbout key={lang} onOpenContact={() => openOrRestore('contact')} />
              ) : (
                w.render()
              )}
            </Window>
          ))}
      </AnimatePresence>

      <SectionDock onOpen={handleOpen} onHome={goHome} compact={dockCompact} show={revealRest && !anyMaximized} hideContact={homeOutro && !dockCompact} />

      {!anyMaximized && (
        <MinimizedDock
          items={wm.minimized.map((id) => {
            return { id, title: t.windows[id].label, subtitle: id === 'projects' ? projectsSubtitle : t.windows[id].subtitle }
          })}
          onRestore={(id) => wm.restoreWindow(id as WindowId)}
          onClose={(id) => wm.closeWindow(id as WindowId)}
        />
      )}

    </div>
  )
}
