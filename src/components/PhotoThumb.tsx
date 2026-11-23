import { motion } from 'framer-motion'
import type { RefObject } from 'react'
import { useDragClick } from '../desktop/useDragClick'

interface PhotoThumbProps {
  caption: string
  cover: string // background CSS: gradiente o url(...)
  initials?: string
  x: number | string
  y: number
  rotate?: number
  delay?: number
  width?: number
  height?: number
  constraintsRef: RefObject<HTMLDivElement>
  active?: boolean
  onOpen: () => void
}

// Foto tipo "archivo de imagen" del escritorio: marco blanco, caption debajo,
// arrastrable y clicable (abre su ventana). Reemplaza a la carpeta para "Sobre mí"
// y se usa como foto decorativa de proyectos.
export default function PhotoThumb({
  caption,
  cover,
  initials,
  x,
  y,
  rotate = 0,
  delay = 0,
  width = 120,
  height = 132,
  constraintsRef,
  active,
  onOpen,
}: PhotoThumbProps) {
  const handlers = useDragClick(onOpen)

  return (
    <motion.button
      type="button"
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      dragElastic={0.12}
      whileDrag={{ scale: 1.05, rotate: 0, cursor: 'grabbing', zIndex: 50 }}
      {...handlers}
      initial={{ opacity: 0, scale: 0.7, y: y - 20, rotate: rotate - 5 }}
      animate={{ opacity: 1, scale: 1, y, rotate }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      style={{ left: x, top: 0, width, position: 'absolute' }}
      className="no-select group flex cursor-pointer flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-blush-400/70"
      aria-label={`Abrir ${caption}`}
    >
      <span
        className="grid place-items-center overflow-hidden rounded-[10px] shadow-[0_10px_22px_-12px_rgba(30,20,50,0.5)] transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_16px_30px_-12px_rgba(30,20,50,0.5)]"
        style={{ width, height, backgroundImage: cover, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {initials && (
          <span className="font-serif text-[44px] italic text-white/95 drop-shadow">{initials}</span>
        )}
      </span>
      <span
        className={`max-w-full truncate px-1 text-[13px] font-medium ${
          active ? 'text-blush-600' : 'text-ink/75'
        }`}
      >
        {caption}
      </span>
    </motion.button>
  )
}
