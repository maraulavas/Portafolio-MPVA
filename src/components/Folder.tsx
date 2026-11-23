import { motion } from 'framer-motion'
import type { RefObject } from 'react'
import FolderIcon from './FolderIcon'
import { useDragClick } from '../desktop/useDragClick'

interface FolderProps {
  label: string
  x: number | string
  y: number
  rotate?: number
  delay?: number
  constraintsRef: RefObject<HTMLDivElement>
  active?: boolean
  onOpen: () => void
}

export default function Folder({
  label,
  x,
  y,
  rotate = 0,
  delay = 0,
  constraintsRef,
  active,
  onOpen,
}: FolderProps) {
  const handlers = useDragClick(onOpen)

  return (
    <motion.button
      type="button"
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      dragElastic={0.12}
      whileDrag={{ scale: 1.06, rotate: 0, cursor: 'grabbing', zIndex: 50 }}
      {...handlers}
      initial={{ opacity: 0, scale: 0.6, y: y - 24, rotate: rotate - 6 }}
      animate={{ opacity: 1, scale: 1, y, rotate }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      style={{ left: x, top: 0, position: 'absolute' }}
      className="no-select group flex w-[112px] cursor-pointer flex-col items-center gap-2 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-blush-400/70"
      aria-label={`Abrir ${label}`}
    >
      <FolderIcon />
      <span
        className={`pointer-events-none max-w-full truncate px-1 text-[13px] font-medium ${
          active ? 'text-blush-600' : 'text-ink/75'
        }`}
      >
        {label}
      </span>
    </motion.button>
  )
}
