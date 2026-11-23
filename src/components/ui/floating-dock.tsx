import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

// Dock con efecto "lupa" de macOS (adaptado de Aceternity Floating Dock).
// Los íconos crecen según qué tan cerca esté el mouse. Solo computador:
// el celular tiene su propio dock (MobileDock).

export interface DockItem {
  id: string
  title: string
  icon: ReactNode // ícono blanco de 26px
  bg: string // fondo del cuadrito (CSS)
  onClick: () => void
}

const BASE = 56 // tamaño normal (px)
const MAX = 70 // tamaño con el mouse encima
const ICON = 26

export function FloatingDock({ items, className = '' }: { items: DockItem[]; className?: string }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-2.5 rounded-[22px] border border-white/50 bg-white/35 px-2.5 pb-2 shadow-[0_20px_50px_-15px_rgba(30,20,50,0.4)] backdrop-blur-2xl ${className}`}
      style={{ height: BASE + 16 }}
    >
      {items.map((it) => (
        <IconContainer key={it.id} mouseX={mouseX} item={it} />
      ))}
    </motion.div>
  )
}

function IconContainer({ mouseX, item }: { mouseX: MotionValue<number>; item: DockItem }) {
  const ref = useRef<HTMLButtonElement>(null)
  const distance = useTransform(mouseX, (val) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - b.x - b.width / 2
  })
  const spring = { mass: 0.1, stiffness: 150, damping: 12 }
  const size = useSpring(useTransform(distance, [-120, 0, 120], [BASE, MAX, BASE]), spring)
  const iconScale = useTransform(size, (v) => (v / BASE) * (ICON / 26)) // los íconos miden 26px
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={item.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={item.title}
      style={{ width: size, height: size, backgroundImage: item.bg }}
      className="relative grid shrink-0 cursor-pointer place-items-center rounded-2xl shadow-md"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 2, x: '-50%' }}
            className="pointer-events-none absolute -top-10 left-1/2 whitespace-nowrap rounded-lg bg-black/70 px-2.5 py-1 text-[12px] font-medium text-white"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span className="grid place-items-center" style={{ width: ICON, height: ICON, scale: iconScale }}>
        {item.icon}
      </motion.span>
    </motion.button>
  )
}

export default FloatingDock
