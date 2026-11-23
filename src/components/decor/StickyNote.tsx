import { motion } from 'framer-motion'
import type { RefObject } from 'react'

interface StickyNoteProps {
  children: string
  x: number
  y: number
  rotate?: number
  color?: string
  delay?: number
  constraintsRef: RefObject<HTMLDivElement>
}

// Nota adhesiva arrastrable (acento editorial tipo Miro / escritorio real).
export default function StickyNote({
  children,
  x,
  y,
  rotate = -4,
  color = '#fff7ae',
  delay = 0,
  constraintsRef,
}: StickyNoteProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      whileDrag={{ scale: 1.05, rotate: 0, zIndex: 60, cursor: 'grabbing' }}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 0.7, rotate: rotate - 8 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 18 }}
      style={{ left: x, top: y, backgroundColor: color, position: 'absolute' }}
      className="no-select flex w-40 cursor-grab items-center justify-center rounded-sm p-4 text-center shadow-[4px_8px_18px_-6px_rgba(0,0,0,0.35)]"
    >
      <span className="font-serif text-[20px] italic leading-tight text-ink/80">{children}</span>
    </motion.div>
  )
}
