import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

interface FolderIconProps {
  size?: number
}

// Carpeta estilo app "Archivos" de iOS: pestaña escalonada, esquinas moderadas
// (menos redondas), en rosa pálido.
// Reposo: cerrada con un sliver de papeles asomando. Hover: se abre y los
// documentos suben.
// En reposo los documentos asoman un poco por arriba (peek).
// En hover suben más y se abre el frente. Por abajo nunca se ven.
const sheetBack: Variants = {
  rest: { y: '0%', rotate: -2 },
  open: { y: '-34%', rotate: -6 },
}
const sheetFront: Variants = {
  rest: { y: '0%', rotate: 1.5 },
  open: { y: '-26%', rotate: 4 },
}
const front: Variants = {
  rest: { y: '0%', scaleY: 1 },
  open: { y: '9%', scaleY: 0.9 },
}

const spring = { type: 'spring', stiffness: 300, damping: 20 } as const

// Trazado de la carpeta trasera con la pestaña escalonada tipo iOS Files.
const BACK_PATH =
  'M 9 20 Q 9 14 15 14 L 30 14 Q 35 14 37 18 L 41 23 Q 43 25 47 25 L 84 25 ' +
  'Q 90 25 90 31 L 90 79 Q 90 85 84 85 L 15 85 Q 9 85 9 79 Z'

export default function FolderIcon({ size = 96 }: FolderIconProps) {
  const radius = Math.round(size * 0.09)

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="open"
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Panel trasero + pestaña (forma iOS) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <defs>
          <linearGradient id="folderBackPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb4d3" />
            <stop offset="1" stopColor="#ff9ac6" />
          </linearGradient>
        </defs>
        <path d={BACK_PATH} fill="url(#folderBackPink)" />
      </svg>

      {/* Documentos (asoman por arriba) */}
      <motion.div
        variants={sheetBack}
        transition={spring}
        className="absolute overflow-hidden bg-[#fbf1f6]"
        style={{
          left: '16%',
          width: '68%',
          top: '25%',
          height: '40%',
          borderRadius: radius * 0.55,
          transformOrigin: 'bottom center',
        }}
      >
        <div className="mt-2 ml-2 h-[3px] w-8 rounded-full bg-blush-100" />
      </motion.div>
      <motion.div
        variants={sheetFront}
        transition={spring}
        className="absolute overflow-hidden bg-white"
        style={{
          left: '13%',
          width: '74%',
          top: '26%',
          height: '42%',
          borderRadius: radius * 0.55,
          transformOrigin: 'bottom center',
          boxShadow: '0 -3px 10px rgba(200,60,120,0.12)',
        }}
      >
        <div className="flex items-center gap-1.5 px-2.5 pt-2.5">
          <span className="h-2 w-2 rounded-full bg-blush-500" />
          <span className="h-[3px] w-10 rounded-full bg-slate-200" />
        </div>
        <div className="mt-2 ml-2.5 h-[3px] w-12 rounded-full bg-slate-100" />
      </motion.div>

      {/* Frente de la carpeta */}
      <motion.div
        variants={front}
        transition={spring}
        className="absolute"
        style={{
          left: '9%',
          width: '81%',
          top: '31%',
          height: '54%',
          borderRadius: radius,
          transformOrigin: 'bottom center',
          background: 'linear-gradient(160deg,#ffd3e6 0%,#ffb2d6 55%,#ff9dca 100%)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 7px 12px rgba(214,74,140,0.18)',
        }}
      >
        {/* Brillo superior */}
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            background: 'linear-gradient(180deg,rgba(255,255,255,0.4),transparent)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
