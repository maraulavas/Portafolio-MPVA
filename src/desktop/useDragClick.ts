import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

// Distingue un clic real de un arrastre: si hubo drag (por gesto de Framer o por
// desplazamiento del puntero > umbral), no dispara onOpen.
export function useDragClick(onOpen: () => void) {
  const dragged = useRef(false)
  const down = useRef({ x: 0, y: 0 })

  return {
    onPointerDown: (e: ReactPointerEvent) => {
      dragged.current = false
      down.current = { x: e.clientX, y: e.clientY }
    },
    onDragStart: () => {
      dragged.current = true
    },
    onPointerUp: (e: ReactPointerEvent) => {
      if (Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) > 6) {
        dragged.current = true
      }
    },
    onClick: () => {
      if (!dragged.current) onOpen()
    },
  }
}
