import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import StatusBar from './StatusBar'
import HomeIndicator from './HomeIndicator'
import { useUI } from '../i18n/LanguageContext'
import SwipeBack from './SwipeBack'

// Contenedor de app a pantalla completa (estilo iOS): sin botones de ventana.
// Para volver: "‹ Inicio" arriba a la izquierda o deslizar desde el borde izquierdo
// (la app sigue al dedo y deja ver la pantalla de atrás). La barra gris abre el menú (dock).
export default function AppShell({
  title,
  onHome,
  onBackGesture,
  onMenu,
  menuOpen = false,
  children,
}: {
  title: string
  onHome: () => void
  onBackGesture?: () => void
  onMenu: () => void
  menuOpen?: boolean
  children: ReactNode
}) {
  const t = useUI()
  return (
    <motion.div
      data-window
      className="fixed inset-0 z-[60]"
      style={{ transformOrigin: '50% 92%' }}
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.86 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      <SwipeBack onBack={onBackGesture ?? onHome} className="absolute inset-0 flex flex-col bg-white">
      <StatusBar />
      <div className="relative flex h-11 shrink-0 items-center justify-center border-b border-black/5 px-2">
        <button
          type="button"
          onClick={onHome}
          className="absolute left-1 flex h-11 cursor-pointer items-center gap-0.5 px-2 text-[17px] text-blush-600 active:opacity-50"
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10 2 2 10l8 8" />
          </svg>
          {t.mobile.home}
        </button>
        <span className="text-[17px] font-semibold text-ink">{title}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      <div className={menuOpen ? 'invisible' : ''}>
        <HomeIndicator onHome={onMenu} label={t.mobile.openMenu} />
      </div>
      </SwipeBack>
    </motion.div>
  )
}
