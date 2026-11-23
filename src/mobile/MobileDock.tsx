import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { WindowId } from '../data/content'
import { PersonIcon, DocIcon, MailIcon } from '../components/SectionDock'
import { useUI } from '../i18n/LanguageContext'

function HomeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9v10.5h13V9" />
      <path d="M10 19.5v-5h4v5" />
    </svg>
  )
}

type DockId = 'home' | WindowId

// Mismo rosado para todos los íconos.
const BG = 'linear-gradient(150deg,#ff9ac6,#f83f92 70%,#e01f76)'

const APPS: { id: DockId; icon: ReactNode }[] = [
  { id: 'home', icon: <HomeIcon /> },
  { id: 'about', icon: <PersonIcon /> },
  { id: 'documents', icon: <DocIcon /> },
  { id: 'contact', icon: <MailIcon /> },
]

// Menú inferior: Sobre mí, Documentos y Contacto; "Inicio" solo cuando no estás en el inicio.
export default function MobileDock({
  onOpen,
  onHome,
  showHome = false,
  hideContact = false,
  active,
}: {
  onOpen: (id: WindowId) => void
  onHome?: () => void
  showHome?: boolean
  hideContact?: boolean
  active?: DockId
}) {
  const t = useUI()
  const items = APPS.filter((a) => (a.id === 'home' ? showHome : a.id === 'contact' ? !hideContact : true))
  return (
    <nav className="mx-3 flex justify-around rounded-[32px] border border-white/60 bg-white/90 px-1.5 py-3 shadow-[0_18px_40px_-18px_rgba(30,20,50,0.35)] backdrop-blur-2xl">
      {items.map((app) => (
        <motion.button
          key={app.id}
          type="button"
          onClick={() => (app.id === 'home' ? onHome?.() : onOpen(app.id))}
          whileTap={{ scale: 0.9 }}
          className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1"
        >
          <span
            className={`grid place-items-center rounded-[16px] shadow-md ${items.length > 4 ? 'h-[52px] w-[52px]' : 'h-[58px] w-[58px]'}`}
            style={{ backgroundImage: BG }}
          >
            {app.icon}
          </span>
          <span className={`max-w-full truncate text-[11px] ${app.id === active ? 'font-semibold text-blush-600' : 'font-medium text-ink/70'}`}>
            {app.id === 'home' ? t.mobile.home : t.windows[app.id].label}
          </span>
        </motion.button>
      ))}
    </nav>
  )
}
