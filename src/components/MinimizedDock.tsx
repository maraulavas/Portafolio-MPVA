import { motion } from 'framer-motion'
import { useState } from 'react'
import { useUI } from '../i18n/LanguageContext'

export interface MinimizedItem {
  id: string
  title: string
  subtitle?: string
}

// Dock inferior-izquierdo: los chips minimizados se apilan con un pequeño "peek"
// y, al pasar el mouse, se despliegan hacia arriba para poder seleccionarlos.
export default function MinimizedDock({
  items,
  onRestore,
  onClose,
}: {
  items: MinimizedItem[]
  onRestore: (id: string) => void
  onClose: (id: string) => void
}) {
  const [hover, setHover] = useState(false)
  const t = useUI()
  if (!items.length) return null

  const CHIP_H = 52
  const PEEK = 8 // separación apilada (colapsado)
  const SPREAD = 62 // separación desplegada (hover)
  const gap = hover ? SPREAD : PEEK
  const height = CHIP_H + (items.length - 1) * gap

  return (
    <div
      className="fixed bottom-4 left-3.5 z-[9000]"
      style={{ width: 208, height }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {items.map((it, i) => (
        <motion.div
          key={it.id}
          role="button"
          tabIndex={0}
          onClick={() => onRestore(it.id)}
          initial={false}
          animate={{ y: -(i * gap) }}
          transition={{ type: 'spring', stiffness: 300, damping: 34 }}
          style={{ position: 'absolute', left: 0, bottom: 0, width: 208, zIndex: i }}
          className="group/chip flex cursor-pointer items-center gap-3 rounded-[18px] border border-black/10 bg-white px-3.5 py-2.5 text-left shadow-[0_12px_30px_-10px_rgba(20,20,26,0.4)] transition-colors hover:bg-blush-50"
        >
          <span className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label={t.window.close}
              onClick={(e) => {
                e.stopPropagation()
                onClose(it.id)
              }}
              className="cursor-pointer grid h-3 w-3 place-items-center rounded-full bg-[#ff5f57] text-[9px] leading-none text-black/55 transition hover:brightness-95"
            >
              <span className="opacity-0 group-hover/chip:opacity-100">×</span>
            </button>
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-semibold text-ink/85">{it.title}</span>
            {it.subtitle && <span className="truncate text-[11px] text-ink/45">{it.subtitle}</span>}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
