import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProjectAreaId, WindowId } from '../data/content'
import { useLang, useUI } from '../i18n/LanguageContext'
import { useContent } from '../i18n/useContent'
import { LangSwitch } from '../components/MenuBar'
import HomeScroll from '../components/home/HomeScroll'
import ProjectCards from '../components/home/ProjectCards'
import ChatAbout from '../components/windows/ChatAbout'
import ProjectsWindow from '../components/windows/ProjectsWindow'
import DocumentsWindow from '../components/windows/DocumentsWindow'
import ContactWindow from '../components/windows/ContactWindow'
import HomeIndicator from './HomeIndicator'
import MobileDock from './MobileDock'
import AppShell from './AppShell'
import { versionPhoto } from './VersionCarousel'
import { clearBack, popBack } from './backStack'
import { morphAllToAvatars, morphAllToCards } from '../components/home/morph'

// Versión celular: el mismo portafolio del escritorio, pensado para el dedo.
// Inicio (prado + título) → deslizar hacia arriba lleva al cielo con "Mis versiones" (carrusel de 4 cards)
// → tocar una versión abre sus proyectos (carrusel) → tocar un proyecto abre la ventana de proyectos.
// Las apps (Sobre mí, Documentos, Contacto, Proyectos) se abren a pantalla completa.
// El dock está en el inicio; en las demás pantallas, la barra de abajo abre el mismo menú.
export default function MobileApp() {
  const { lang } = useLang()
  const t = useUI()
  const { projectAreas } = useContent()
  const [app, setApp] = useState<WindowId | null>(null)
  const [cardsArea, setCardsArea] = useState<ProjectAreaId | null>(null)
  const [openProject, setOpenProject] = useState<{ area: ProjectAreaId; id: string; token: number } | null>(null)
  const [projectsArea, setProjectsArea] = useState<ProjectAreaId | null>(null)
  const [homeScrolled, setHomeScrolled] = useState(false)
  const [homeOutro, setHomeOutro] = useState(false)
  const [homeToken, setHomeToken] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [touchY, setTouchY] = useState<number | null>(null)

  const atHome = (!homeScrolled || homeOutro) && !cardsArea && !app

  // --- Navegación "hacia atrás" (como iOS/Android) ---
  // Cada pantalla que se abre encima (cards de proyectos o una app) agrega un paso al historial,
  // así el gesto nativo de volver cierra esa pantalla sin salir del portafolio.
  const appRef = useRef(app)
  const cardsRef = useRef(cardsArea)
  appRef.current = app
  cardsRef.current = cardsArea
  const lastPopRef = useRef(0)

  useEffect(() => {
    function onPop() {
      lastPopRef.current = Date.now()
      setMenuOpen(false)
      if (popBack()) return // cerró una pantalla dentro de la app (p. ej. detalle de proyecto)
      if (appRef.current) setApp(null)
      else if (cardsRef.current) {
        morphAllToCards(cardsRef.current)
        setCardsArea(null)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function goBack() {
    window.history.back()
  }
  function backFromGesture() {
    if (Date.now() - lastPopRef.current > 700) goBack()
  }

  function showApp(id: WindowId) {
    if (appRef.current) window.history.replaceState({ mobile: id }, '')
    else window.history.pushState({ mobile: id }, '')
    setApp(id)
  }

  function openCards(id: ProjectAreaId) {
    if (!cardsRef.current) {
      window.history.pushState({ mobile: 'cards' }, '')
      morphAllToAvatars(id)
    }
    setCardsArea(id)
  }

  function openProjectFromCards(area: ProjectAreaId, id: string) {
    setProjectsArea(area)
    setOpenProject({ area, id, token: Date.now() })
    showApp('projects')
  }

  function openApp(id: WindowId) {
    setMenuOpen(false)
    showApp(id)
  }

  // "Todos los proyectos" dentro de un proyecto: vuelve directo al carrusel de cards (cierra detalle + app).
  function backToCards() {
    clearBack()
    window.history.go(-2)
  }

  // Ir directo al inicio desde el menú.
  function goHome() {
    setMenuOpen(false)
    setApp(null)
    setCardsArea(null)
    setHomeToken((n) => n + 1)
    window.history.replaceState(null, '')
  }

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-[#2b8ceb]"
      // Deslizar hacia arriba desde la franja de abajo abre el menú (fuera del inicio, donde el dock ya se ve).
      onTouchStart={(e) => setTouchY(e.touches[0].clientY)}
      onTouchEnd={(e) => {
        const start = touchY
        setTouchY(null)
        if (start === null || atHome) return
        if (start > window.innerHeight - 90 && start - e.changedTouches[0].clientY > 50) setMenuOpen(true)
      }}
    >
      <HomeScroll
        title={{ start: t.brand.titleStart, end: t.brand.titleEnd }}
        portfolioLabel={t.menu.portfolio}
        areas={projectAreas}
        images={versionPhoto}
        onOpen={openCards}
        hideCards={!!cardsArea}
        resetToken={homeToken}
        onScrolled={setHomeScrolled}
        onContact={() => showApp('contact')}
        onOutro={setHomeOutro}
      />

      <AnimatePresence>
        {cardsArea && (
          <ProjectCards
            key="cards"
            areas={projectAreas}
            areaId={cardsArea}
            onArea={setCardsArea}
            onClose={goBack}
            backLabel={lang === 'en' ? 'Back' : 'Volver'}
            images={versionPhoto}
            onOpenProject={openProjectFromCards}
          />
        )}
      </AnimatePresence>

      {/* Idioma, arriba a la derecha */}
      <div className="pointer-events-auto absolute right-4 z-[40]" style={{ top: 'calc(env(safe-area-inset-top) + 12px)' }}>
        <LangSwitch size="lg" light />
      </div>

      {/* Inicio: dock visible. Resto de pantallas: barra de abajo que abre el menú. */}
      <AnimatePresence initial={false}>
        {atHome ? (
          <motion.div
            key="dock"
            className="absolute inset-x-0 bottom-0 z-[40]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 18px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <MobileDock onOpen={openApp} onHome={goHome} showHome={homeOutro} hideContact={homeOutro} />
          </motion.div>
        ) : (
          !app && (
            <motion.div
              key="bar"
              className={`absolute inset-x-0 bottom-0 z-[40] ${menuOpen ? 'invisible' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeIndicator light onHome={() => setMenuOpen(true)} label={t.mobile.openMenu} />
            </motion.div>
          )
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu-backdrop"
              className="fixed inset-0 z-[70] cursor-pointer bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="menu"
              data-window
              className="fixed inset-x-0 bottom-0 z-[80]"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              exit={{ y: '110%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 60 || info.velocity.y > 400) setMenuOpen(false)
              }}
            >
              <div className="mx-auto mb-2.5 h-[5px] w-10 rounded-full bg-white/80" aria-hidden />
              <MobileDock onOpen={openApp} onHome={goHome} showHome active={app ?? undefined} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {app && (
          <AppShell key={app} title={t.windows[app].label} onHome={goBack} onBackGesture={backFromGesture} onMenu={() => setMenuOpen(true)} menuOpen={menuOpen}>
            {app === 'about' ? (
              <div className="h-full">
                <ChatAbout key={lang} compact onOpenContact={() => showApp('contact')} />
              </div>
            ) : app === 'projects' ? (
              <ProjectsWindow compact openArea={projectsArea} openAreaToken={openProject?.token ?? 0} openProject={openProject} onBackToCards={backToCards} />
            ) : app === 'documents' ? (
              <DocumentsWindow compact />
            ) : (
              <ContactWindow compact />
            )}
          </AppShell>
        )}
      </AnimatePresence>
    </div>
  )
}
