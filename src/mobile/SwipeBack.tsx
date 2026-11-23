import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { CSSProperties, ReactNode, TouchEvent } from 'react'

// Gesto "volver" de iOS: al deslizar desde el borde izquierdo, la pantalla sigue al dedo
// y deja ver la pantalla de atrás (oscurecida). Al soltar, si pasó un tercio del ancho
// (o fue un movimiento rápido) termina de salir y vuelve; si no, regresa a su lugar.
const EDGE = 28 // px desde el borde izquierdo donde empieza el gesto

export default function SwipeBack({
  onBack,
  className,
  style,
  children,
}: {
  onBack: () => void
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const x = useMotionValue(0)
  const width = typeof window !== 'undefined' ? window.innerWidth : 400
  const dim = useTransform(x, [0, width], [0.22, 0])
  const shadow = useTransform(x, (v) => (v > 0 ? '-10px 0 30px rgba(0,0,0,0.14)' : 'none'))
  const start = useRef<{ x: number; y: number; t: number; locked: boolean } | null>(null)

  function onTouchStart(e: TouchEvent) {
    const p = e.touches[0]
    start.current = p.clientX < EDGE ? { x: p.clientX, y: p.clientY, t: Date.now(), locked: false } : null
    // Si hay pantallas anidadas, solo la de más arriba responde al gesto.
    if (start.current) e.stopPropagation()
  }

  function onTouchMove(e: TouchEvent) {
    const s = start.current
    if (!s) return
    const p = e.touches[0]
    const dx = p.clientX - s.x
    const dy = p.clientY - s.y
    if (!s.locked) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        start.current = null // era un scroll vertical
        return
      }
      if (dx > 8) s.locked = true
    }
    if (s.locked) x.set(Math.max(0, dx))
  }

  function onTouchEnd(e: TouchEvent) {
    const s = start.current
    start.current = null
    if (!s || !s.locked) return
    const dx = e.changedTouches[0].clientX - s.x
    const speed = dx / Math.max(1, Date.now() - s.t) // px/ms
    if (dx > width / 3 || speed > 0.6) {
      animate(x, width, { duration: 0.2, ease: 'easeOut' }).then(onBack)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 36 })
    }
  }

  return (
    <>
      {/* Sombra sobre la pantalla de atrás: se aclara a medida que se desliza */}
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} aria-hidden />
      <motion.div
        className={className}
        style={{ ...style, x, boxShadow: shadow }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          start.current = null
          animate(x, 0)
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
