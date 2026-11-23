import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode, RefObject } from 'react'
import { useUI } from '../i18n/LanguageContext'

interface WindowProps {
  title: string
  subtitle?: string
  z: number
  x: number
  y: number
  width?: number
  defaultMaximized?: boolean
  centered?: boolean
  opaque?: boolean
  fill?: boolean
  minimized?: boolean
  focused: boolean
  constraintsRef: RefObject<HTMLDivElement>
  onClose: () => void
  onFocus: () => void
  onMinimize: () => void
  onMaximizeChange?: (maximized: boolean) => void
  children: ReactNode
}

interface LightsProps {
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
}

function TrafficLights({ onClose, onMinimize, onMaximize }: LightsProps) {
  const dot =
    'grid h-3.5 w-3.5 place-items-center rounded-full text-[10px] font-semibold leading-none text-black/55 shadow-inner transition hover:brightness-95'
  const glyph = 'opacity-0 transition-opacity group-hover/lights:opacity-100'
  const t = useUI()
  return (
    // Evita que pulsar los botones inicie el arrastre o el maximizar por doble clic.
    <div
      className="group/lights flex items-center gap-2"
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button type="button" onClick={onClose} aria-label={t.window.close} className={`cursor-pointer ${dot} bg-[#ff5f57]`}>
        <span className={glyph}>×</span>
      </button>
      <button type="button" onClick={onMinimize} aria-label={t.window.minimize} className={`cursor-pointer ${dot} bg-[#febc2e]`}>
        <span className={glyph}>–</span>
      </button>
      <button type="button" onClick={onMaximize} aria-label={t.window.maximize} className={`cursor-pointer ${dot} bg-[#28c840]`}>
        <span className={glyph}>⤢</span>
      </button>
    </div>
  )
}

export default function Window({
  title,
  subtitle,
  z,
  x,
  y,
  width = 620,
  defaultMaximized = false,
  centered = false,
  opaque = false,
  fill = false,
  minimized = false,
  focused,
  constraintsRef,
  onClose,
  onFocus,
  onMinimize,
  onMaximizeChange,
  children,
}: WindowProps) {
  const controls = useDragControls()
  const [maximized, setMaximized] = useState(defaultMaximized)

  useEffect(() => {
    onMaximizeChange?.(maximized)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maximized])

  // Minimizar/restaurar: la ventana se encoge suavemente hacia el dock (abajo a la izquierda) y vuelve a crecer.
  const rootRef = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false) // se oculta del todo cuando terminó de encogerse
  const [origin, setOrigin] = useState('50% 100%')
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (minimized) {
      const r = rootRef.current?.getBoundingClientRect()
      if (r) setOrigin(`${118 - r.left}px ${window.innerHeight - 42 - r.top}px`)
    } else {
      setGone(false)
    }
  }, [minimized])

  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  function resetDrag() {
    dragX.set(0)
    dragY.set(0)
  }

  function startDrag(e: PointerEvent) {
    if (maximized) return
    onFocus()
    controls.start(e)
  }

  function toggleMaximize() {
    resetDrag()
    setMaximized((m) => !m)
  }

  const posStyle: CSSProperties = maximized
    ? { left: 0, top: 28, right: 0, bottom: 0, width: 'auto' }
    : centered
      ? { left: '50%', top: '50%', translate: '-50% -50%', width }
      : { left: x, top: y, width }

  return (
    <motion.div
      ref={rootRef}
      layout
      drag={!maximized}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragConstraints={constraintsRef}
      data-window
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={minimized ? { opacity: 0, scale: 0.12 } : { opacity: 1, scale: 1 }}
      onAnimationComplete={() => {
        if (minimized) setGone(true)
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.16, ease: 'easeIn' } }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      style={{ position: 'absolute', x: dragX, y: dragY, zIndex: z, display: gone ? 'none' : undefined, pointerEvents: minimized ? 'none' : undefined, transformOrigin: origin, ...posStyle }}
      className={`flex ${
        maximized ? '' : fill ? 'h-[88vh] max-h-[88vh]' : 'max-h-[88vh]'
      } flex-col overflow-hidden ${maximized ? 'rounded-none' : 'rounded-2xl'} ${
        opaque
          ? 'border border-black/10 bg-white'
          : 'border border-white/60 bg-white/70 backdrop-blur-2xl'
      } shadow-[0_26px_70px_-30px_rgba(20,20,26,0.3)] no-select`}
    >
      {/* Barra de titulo */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={toggleMaximize}
        className={`flex items-center gap-3 border-b border-black/5 px-3.5 py-2.5 ${
          maximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        } ${opaque ? 'bg-white' : focused ? 'bg-white/55' : 'bg-white/35'}`}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onMaximize={toggleMaximize} />
        <div className="pointer-events-none flex min-w-0 flex-1 flex-col items-center">
          <span className="max-w-full truncate whitespace-nowrap text-[13px] font-semibold text-ink/85">{title}</span>
          {subtitle && <span className="text-[11px] text-ink/45">{subtitle}</span>}
        </div>
        <div className="w-[58px] shrink-0" aria-hidden />
      </div>

      <div className={fill ? 'flex min-h-0 flex-1 overflow-hidden' : 'win-scroll flex-1 select-text overflow-y-auto'}>
        {children}
      </div>
    </motion.div>
  )
}
