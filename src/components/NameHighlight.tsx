import { motion } from 'framer-motion'

// Resaltador tipo marcador que subraya el nombre: barra rosa pálida con
// topes verticales y puntos (arriba-izquierda / abajo-derecha). Se dibuja de
// izquierda a derecha revelando con clip-path (sin deformar puntos ni topes).
export default function NameHighlight({ show, onDone, instant = false }: { show: boolean; onDone?: () => void; instant?: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -left-[12px] -right-[12px] -top-[2px] -bottom-[2px] z-10 block"
      initial={{ clipPath: instant ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
      animate={{ clipPath: show ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
      transition={{ duration: instant ? 0 : 0.8, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => {
        if (show) onDone?.()
      }}
    >
      {/* Trazo semitransparente que cubre todo el alto del nombre */}
      <span className="absolute left-[4px] right-[4px] top-[2px] bottom-[2px] rounded-[1px] bg-blush-300/40" />

      {/* Tope izquierdo (alto completo) + punto arriba */}
      <span className="absolute left-[4px] top-0 bottom-0 w-[3px] rounded-full bg-blush-600" />
      <span className="absolute left-[2px] top-0 h-[7px] w-[7px] rounded-full bg-blush-600" />

      {/* Tope derecho (alto completo) + punto abajo */}
      <span className="absolute right-[4px] top-0 bottom-0 w-[3px] rounded-full bg-blush-600" />
      <span className="absolute right-[2px] bottom-0 h-[7px] w-[7px] rounded-full bg-blush-600" />
    </motion.span>
  )
}
