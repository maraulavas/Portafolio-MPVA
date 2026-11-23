import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { WindowId } from '../data/content'
import { useUI } from '../i18n/LanguageContext'
import { FloatingDock } from './ui/floating-dock'

type Item = { id: WindowId; bg: string; icon: ReactNode }

export function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  )
}
export function PersonIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}
export function DocIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  )
}
export function ProjectsIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2.2h7.4A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
      <path d="M3 10.5h18" />
    </svg>
  )
}
export function HomeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  )
}
export function MailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  )
}

const items: Item[] = [
  { id: 'about', bg: 'linear-gradient(150deg,#ff9ac6,#f83f92 70%,#e01f76)', icon: <PersonIcon /> },
  { id: 'documents', bg: 'linear-gradient(150deg,#ff9ac6,#f83f92 70%,#e01f76)', icon: <DocIcon /> },
  { id: 'contact', bg: 'linear-gradient(150deg,#ff9ac6,#f83f92 70%,#e01f76)', icon: <MailIcon /> },
]

export default function SectionDock({
  onOpen,
  onHome,
  show = true,
  compact = false,
  hideContact = false,
}: {
  onOpen: (id: WindowId) => void
  onHome?: () => void
  show?: boolean
  // Fuera del inicio el dock se reduce a tres puntos y se expande al pasar el mouse.
  compact?: boolean
  hideContact?: boolean
}) {
  const t = useUI()
  const [hover, setHover] = useState(false)
  const open = !compact || hover
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[62px] z-[45] flex justify-center px-[6vw]">
      <div
        className="pointer-events-auto relative flex shrink-0 items-end justify-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="dock"
              initial={{ y: 14, opacity: 0, scale: 0.85 }}
              animate={show ? { y: 0, opacity: 1, scale: 1 } : { y: 22, opacity: 0, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '50% 100%' }}
            >
              <FloatingDock
                items={[
                  ...(compact || hideContact ? [{ id: 'home', title: t.menu.home, icon: <HomeIcon />, bg: 'linear-gradient(150deg,#ff9ac6,#f83f92 70%,#e01f76)', onClick: () => onHome?.() }] : []),
                  ...items.filter((it) => !(hideContact && it.id === 'contact')).map((it) => ({ id: it.id, title: t.windows[it.id].label, icon: it.icon, bg: it.bg, onClick: () => onOpen(it.id) })),
                ]}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dots"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-1 flex cursor-pointer items-center gap-1.5 rounded-full border border-white/55 bg-white/25 px-3.5 py-2.5 shadow-[0_8px_24px_-10px_rgba(12,60,140,0.55)] backdrop-blur-xl"
              aria-label="Menú"
            >
              {[0, 1, 2].map((d) => (
                <span key={d} className="block h-1.5 w-1.5 rounded-full bg-white" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
