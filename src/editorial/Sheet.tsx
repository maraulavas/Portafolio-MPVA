import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

// Pantalla completa que sube desde abajo (proyectos, sobre mí, documentos, contacto).
export default function Sheet({ title, onClose, children }: { title: string; closeLabel?: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  // Al abrir, el foco pasa al diálogo; al cerrar, vuelve al elemento que lo abrió.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus({ preventScroll: true })
    return () => prev?.focus?.({ preventScroll: true })
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-white text-black"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      ref={ref}
      style={{ outline: 'none' }}
    >
      <div data-sheet-scroll className="absolute inset-x-0 bottom-0 top-14 overflow-y-auto overflow-x-hidden overscroll-contain">{children}</div>
    </motion.div>
  )
}
