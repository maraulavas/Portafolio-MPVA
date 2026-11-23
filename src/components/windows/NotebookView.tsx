import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { TargetAndTransition, Transition } from 'framer-motion'
import { diAsset } from '../../data/assets'
import CursorLabel from '../CursorLabel'

// Libreta industrial: dos hojas (Producto / Mobiliario) que se cambian con los
// tags laterales. Cada hoja tiene su propia composición de imágenes y su
// contenido de texto; el resto (tamaños, estilos, animaciones) es compartido.

type Base = { z: number; x: number; y: number; w: number; rot: number; opacity: number; flipX: boolean }
type ImgLayer = Base & { type: 'img'; file: string; aspect: number }

interface Product {
  title: string
  year: string
  description: string
}
interface NotebookPage {
  id: 'producto' | 'mobiliario'
  accent: string // palabra en cursiva del título
  textLeft: string // posición X del bloque de texto
  products: Product[]
  layers: ImgLayer[]
  hoverNames: Record<string, string>
  groupOfFile: Record<string, string>
  groupOfTitle: Record<string, string>
  frontOnGroup: Record<string, string>
  dimOnGroup: Record<string, string[]>
}

const STAGE_ASPECT = 3620 / 1836
const FIG_W = 1450
const s = (px: number) => `${((px * 100) / FIG_W).toFixed(3)}cqw`
const DIM = 0.28
const PAPER = '#e9e3d5'
const DESC =
  'Mobiliario multifuncional y modular para espacios pequeños o monoambientes que aprovecha ambas caras del mueble para ofrecer una funcionalidad distinta para cada espacio. Ideal para usar en dormitorios y salas.'

// ------------------------- Hoja 1: Producto -------------------------
const PRODUCTO: NotebookPage = {
  id: 'producto',
  accent: 'producto',
  textLeft: '11.95%',
  products: [
    { title: 'Brisa', year: '2024', description: DESC },
    { title: 'Lumínica', year: '2024', description: DESC },
    { title: '3D', year: '2024', description: DESC },
  ],
  layers: [
    { z: 1, x: 73.84, y: 51.1, w: 40, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'fondo producto.png', aspect: 0.9002 },
    { z: 4, x: 4.24, y: 76.98, w: 8.06, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Clip.png', aspect: 1 },
    { z: 5, x: 33.36, y: 6.45, w: 8.39, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Flor.png', aspect: 1.0289 },
    { z: 6, x: 79.04, y: 30.12, w: 24.3, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'luminica.png', aspect: 1.7119 },
    { z: 7, x: 83.52, y: 59.31, w: 15.69, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'escultura.png', aspect: 0.9053 },
    { z: 8, x: 68.24, y: 43.06, w: 20.6, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'teclado.png', aspect: 1 },
    { z: 9, x: 67.68, y: 69.57, w: 29.5, rot: 5, opacity: 1, flipX: false, type: 'img', file: 'brisa.png', aspect: 0.9254 },
    { z: 10, x: 65.28, y: 19.86, w: 4, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Estrella.png', aspect: 0.9699 },
    { z: 11, x: 60, y: 36.27, w: 2.68, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Cinta.png', aspect: 0.4464 },
    { z: 12, x: 90, y: 25.07, w: 6.18, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'clip gancho.png', aspect: 0.8248 },
    { z: 13, x: 86.96, y: 76.51, w: 4.85, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'flor bordada.png', aspect: 0.9803 },
    { z: 14, x: 74.88, y: 64.04, w: 9.05, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Comentario.png', aspect: 3.0385 },
    { z: 17, x: 33.63, y: 25.77, w: 4.47, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'corazon.png', aspect: 1.0069 },
    { z: 20, x: 45.86, y: 68.15, w: 18.38, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Lapicero.png', aspect: 0.5055 },
  ],
  hoverNames: { 'luminica.png': 'Lumínica', 'teclado.png': 'Teclado', 'escultura.png': 'Escultura', 'brisa.png': 'Brisa' },
  groupOfFile: { 'brisa.png': 'brisa', 'luminica.png': 'luminica', 'escultura.png': '3d', 'teclado.png': '3d' },
  groupOfTitle: { Brisa: 'brisa', Lumínica: 'luminica', '3D': '3d' },
  frontOnGroup: { 'clip gancho.png': 'luminica', 'flor bordada.png': '3d', 'Cinta.png': '3d', 'Comentario.png': '3d' },
  dimOnGroup: {
    'clip gancho.png': ['3d', 'brisa'],
    'flor bordada.png': ['luminica', 'brisa'],
    'Cinta.png': ['luminica', 'brisa'],
    'Comentario.png': ['luminica'],
    'Estrella.png': ['brisa'],
  },
}

// ------------------------- Hoja 2: Mobiliario -------------------------
const MOBILIARIO: NotebookPage = {
  id: 'mobiliario',
  accent: 'mobiliario',
  textLeft: '12.78%',
  products: [
    { title: 'Dupla', year: '2024', description: DESC },
    { title: 'Sakuru', year: '2024', description: DESC },
    { title: 'Poltrona', year: '2024', description: DESC },
  ],
  layers: [
    { z: 2, x: 4.16, y: 19.23, w: 8.06, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Clip.png', aspect: 1 },
    { z: 3, x: 40.56, y: 94.18, w: 8.39, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Flor.png', aspect: 1.0289 },
    { z: 6, x: 37.4, y: 25.38, w: 4.47, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'corazon.png', aspect: 1.0069 },
    { z: 9, x: 8.88, y: 69.41, w: 18.38, rot: -30, opacity: 1, flipX: false, type: 'img', file: 'Lapicero.png', aspect: 0.5055 },
    { z: 11, x: 72.56, y: 49.84, w: 40, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'fondo mobiliario.png', aspect: 0.9172 },
    { z: 12, x: 69.84, y: 61.68, w: 19.87, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'plano dupla.png', aspect: 1.114 },
    { z: 13, x: 72, y: 28.7, w: 25.56, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'sakuru.png', aspect: 1.4918 },
    { z: 14, x: 81.2, y: 42.74, w: 20.47, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'dupla.png', aspect: 1.3024 },
    { z: 15, x: 82.56, y: 68.62, w: 21.32, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'poltrona.png', aspect: 0.8874 },
    { z: 16, x: 81.76, y: 29.33, w: 4, rot: 82, opacity: 1, flipX: false, type: 'img', file: 'Cinta.png', aspect: 0.4464 },
    { z: 17, x: 60.24, y: 59.78, w: 4.87, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'Estrella.png', aspect: 0.9699 },
    { z: 18, x: 84, y: 17.34, w: 6.04, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'clip gancho.png', aspect: 0.8248 },
    { z: 19, x: 90.48, y: 39.59, w: 4, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'flor bordada.png', aspect: 0.9803 },
    { z: 20, x: 60.56, y: 24.6, w: 7.09, rot: 0, opacity: 1, flipX: false, type: 'img', file: 'comentario mobiliario.png', aspect: 2.2621 },
  ],
  hoverNames: { 'dupla.png': 'Dupla', 'plano dupla.png': 'Dupla', 'sakuru.png': 'Sakuru', 'poltrona.png': 'Poltrona' },
  groupOfFile: { 'dupla.png': 'dupla', 'plano dupla.png': 'dupla', 'sakuru.png': 'sakuru', 'poltrona.png': 'poltrona' },
  groupOfTitle: { Dupla: 'dupla', Sakuru: 'sakuru', Poltrona: 'poltrona' },
  frontOnGroup: {
    // Sakuru: clip de gancho y comentario al frente.
    'clip gancho.png': 'sakuru',
    'comentario mobiliario.png': 'sakuru',
    // Dupla: estrella, flor bordada y cinta al frente.
    'Estrella.png': 'dupla',
    'flor bordada.png': 'dupla',
    'Cinta.png': 'dupla',
  },
  dimOnGroup: {
    'Estrella.png': ['sakuru', 'poltrona'],
    'flor bordada.png': ['sakuru', 'poltrona'],
    'clip gancho.png': ['dupla', 'poltrona'],
    'comentario mobiliario.png': ['dupla', 'poltrona'],
    'Cinta.png': ['poltrona'],
  },
}

const PAGES: NotebookPage[] = [PRODUCTO, MOBILIARIO]

// Lista liviana para el dropdown de acceso rápido en la barra lateral.
export const NOTEBOOK_ITEM_LIST = PAGES.flatMap((pg) =>
  pg.products.map((p) => ({
    id: `${pg.id}-${pg.groupOfTitle[p.title] ?? p.title}`,
    title: p.title,
    page: pg.id,
    group: pg.groupOfTitle[p.title] ?? null,
  })),
)

// Tags laterales que funcionan como pestañas de navegación.
// Cada tab tiene su imagen "on" (activa) y "off" (inactiva) ya diseñadas.
const TABS = [
  {
    page: 'producto' as const,
    x: 96.31,
    y: 22.07,
    on: { file: 'Yag producto.png', aspect: 0.3525, w: 3.3, dx: 0 },
    off: { file: 'tag producto off.png', aspect: 0.3229, w: 2.78, dx: -1 },
  },
  {
    page: 'mobiliario' as const,
    x: 96.23,
    y: 32,
    on: { file: 'tag mobiliario on.png', aspect: 0.3452, w: 3.02, dx: -1 },
    off: { file: 'Tag mobiliario.png', aspect: 0.3229, w: 2.7, dx: 0 },
  },
]

// Animación en bucle por asset (compartida entre hojas).
type Loop = { animate: TargetAndTransition; transition: Transition }
function loopFor(file: string): Loop | null {
  switch (file) {
    case 'Flor.png':
      return { animate: { rotate: [0, 360] }, transition: { duration: 11, repeat: Infinity, ease: 'linear' } }
    case 'flor bordada.png':
      return { animate: { rotate: [0, -360] }, transition: { duration: 13, repeat: Infinity, ease: 'linear' } }
    case 'Estrella.png':
      return { animate: { rotate: [-18, 18, -18] }, transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }
    case 'Lapicero.png':
      return { animate: { rotate: [-2, 2, -2] }, transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }
    // Clip de gancho: vaivén (un poco más notorio).
    case 'clip gancho.png':
      return { animate: { rotate: [-6, 6, -6] }, transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
    case 'brisa.png':
      return { animate: { y: [0, -8, 0] }, transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } }
    // Poltrona: flota igual que brisa.
    case 'poltrona.png':
      return { animate: { y: [0, -8, 0] }, transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } }
    default:
      return null
  }
}

const fontFamilyMap = { sans: "'Neue Montreal', sans-serif", serif: "'Neue Montreal', sans-serif" }

export default function NotebookView({
  focusPage,
  focusGroup = null,
  focusToken = 0,
}: {
  focusPage?: 'producto' | 'mobiliario'
  focusGroup?: string | null
  focusToken?: number
}) {
  const bg = diAsset('Libreta.png')
  const [pageId, setPageId] = useState<'producto' | 'mobiliario'>(focusPage ?? 'producto')
  const page = PAGES.find((p) => p.id === pageId) as NotebookPage
  const [cursor, setCursor] = useState<{ label: string | null; x: number; y: number }>({ label: null, x: 0, y: 0 })
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  // Acceso directo desde el dropdown de la barra lateral: cambia de hoja y resalta el grupo.
  useEffect(() => {
    if (!focusPage) return
    setPageId(focusPage)
    setActiveGroup(focusGroup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusToken])

  const stageRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef<string | null>(null)
  const alphaRef = useRef<Record<string, { w: number; h: number; data: Uint8ClampedArray }>>({})

  const interactiveLayers = page.layers.filter((L) => page.hoverNames[L.file])

  // Reconstruye los mapas de alpha al cambiar de hoja.
  useEffect(() => {
    alphaRef.current = {}
    interactiveLayers.forEach((L) => {
      const url = diAsset(L.file)
      if (!url) return
      const img = new Image()
      img.onload = () => {
        const w = 120
        const h = Math.max(1, Math.round(120 / L.aspect))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, w, h)
        try {
          alphaRef.current[L.file] = { w, h, data: ctx.getImageData(0, 0, w, h).data }
        } catch {
          /* no muestreable */
        }
      }
      img.src = url
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  // Clic fuera de la libreta (en cualquier parte alrededor) también resetea.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const stage = stageRef.current
      if (stage && !stage.contains(e.target as Node)) setActiveGroup(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const effZ = (L: ImgLayer) =>
    activeGroup && (page.groupOfFile[L.file] === activeGroup || page.frontOnGroup[L.file] === activeGroup)
      ? 1000 + L.z
      : L.z

  const hitTest = (clientX: number, clientY: number): string | null => {
    const el = stageRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    const sw = r.width
    const sh = r.height
    const px = clientX - r.left
    const py = clientY - r.top
    const cands = interactiveLayers.slice().sort((a, b) => effZ(b) - effZ(a))
    for (const L of cands) {
      const map = alphaRef.current[L.file]
      if (!map) continue
      const cx = (L.x / 100) * sw
      const cy = (L.y / 100) * sh
      const bw = (L.w / 100) * sw
      const bh = bw / L.aspect
      let dx = px - cx
      let dy = py - cy
      if (L.rot) {
        const a = (-L.rot * Math.PI) / 180
        const co = Math.cos(a)
        const si = Math.sin(a)
        const nx = dx * co - dy * si
        const ny = dx * si + dy * co
        dx = nx
        dy = ny
      }
      let u = dx / bw + 0.5
      const v = dy / bh + 0.5
      if (L.flipX) u = 1 - u
      if (u < 0 || u > 1 || v < 0 || v > 1) continue
      const ix = Math.min(map.w - 1, Math.max(0, Math.floor(u * map.w)))
      const iy = Math.min(map.h - 1, Math.max(0, Math.floor(v * map.h)))
      const alpha = map.data[(iy * map.w + ix) * 4 + 3]
      if (alpha > 24) return L.file
    }
    return null
  }

  function goPage(id: 'producto' | 'mobiliario') {
    if (id === pageId) return
    setActiveGroup(null)
    hoveredRef.current = null
    setCursor((c) => ({ ...c, label: null }))
    setPageId(id)
  }

  return (
    <div className="flex justify-center px-2 pb-3 pt-0">
      <motion.div
        ref={stageRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="relative"
        onMouseMove={(e) => {
          const hit = hitTest(e.clientX, e.clientY)
          hoveredRef.current = hit
          setCursor({ label: hit ? page.hoverNames[hit] : null, x: e.clientX, y: e.clientY })
        }}
        onMouseLeave={() => {
          hoveredRef.current = null
          setCursor((c) => ({ ...c, label: null }))
        }}
        onClick={() => {
          const hit = hoveredRef.current
          setActiveGroup(hit && page.groupOfFile[hit] ? page.groupOfFile[hit] : null)
        }}
        style={{
          width: `min(1200px, 94vw, calc(85vh * ${STAGE_ASPECT}))`,
          aspectRatio: String(STAGE_ASPECT),
          containerType: 'inline-size',
          cursor: cursor.label ? 'none' : 'default',
        } as CSSProperties}
      >
        {/* Libreta de fondo */}
        {bg && (
          <img src={bg} alt="Libreta industrial" className="absolute inset-0 h-full w-full object-fill" draggable={false} />
        )}

        {/* Pestañas laterales (Producto / Mobiliario) */}
        {TABS.map((t) => {
          const active = t.page === pageId
          const variant = active ? t.on : t.off
          const src = diAsset(variant.file)
          const mask = src
            ? {
                WebkitMaskImage: `url("${src}")`,
                maskImage: `url("${src}")`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }
            : {}
          return (
            <button
              key={t.page}
              type="button"
              aria-label={`Ir a diseño de ${t.page}`}
              onClick={(e) => {
                e.stopPropagation()
                goPage(t.page)
              }}
              style={{
                position: 'absolute',
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: `${variant.w}%`,
                aspectRatio: String(variant.aspect),
                transform: `translate(-50%, -50%) translateX(${variant.dx}px)`,
                zIndex: active ? 61 : 60,
                pointerEvents: 'auto',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0,
                transition: 'transform 0.25s ease',
              }}
            >
              {/* Fondo opaco (silueta del tag): evita ver la hoja a través del tag atenuado */}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: PAPER, ...mask }} />
              {/* Imagen del tag tal cual (atenuada solo si no está activo) */}
              {src && (
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ opacity: active ? 1 : 0.72, transition: 'opacity 0.25s ease' }}
                />
              )}
            </button>
          )
        })}

        {/* Contenido de la hoja actual (composición + textos) */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pageId}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {/* Capas de imagen */}
            {page.layers.map((L, i) => {
              const loop = loopFor(L.file)
              const group = page.groupOfFile[L.file]
              const isFront = activeGroup != null && page.frontOnGroup[L.file] === activeGroup
              const dimmed =
                activeGroup != null &&
                !isFront &&
                ((group != null && group !== activeGroup) ||
                  (page.dimOnGroup[L.file]?.includes(activeGroup) ?? false))
              const canDim = group != null || page.dimOnGroup[L.file] != null
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${L.x}%`,
                    top: `${L.y}%`,
                    width: `${L.w}%`,
                    aspectRatio: String(L.aspect),
                    transform: `translate(-50%, -50%) rotate(${L.rot}deg)`,
                    zIndex: effZ(L),
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: L.opacity, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.045, type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ width: '100%', height: '100%', transform: `scaleX(${L.flipX ? -1 : 1})` }}
                  >
                    <motion.div
                      animate={loop?.animate}
                      transition={loop?.transition}
                      style={{ position: 'relative', width: '100%', height: '100%' }}
                    >
                      {canDim && diAsset(L.file) && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: PAPER,
                            WebkitMaskImage: `url("${diAsset(L.file)}")`,
                            maskImage: `url("${diAsset(L.file)}")`,
                            WebkitMaskSize: '100% 100%',
                            maskSize: '100% 100%',
                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                          }}
                        />
                      )}
                      {diAsset(L.file) && (
                        <motion.img
                          src={diAsset(L.file)}
                          alt=""
                          draggable={false}
                          className="absolute inset-0 h-full w-full object-contain"
                          animate={{ opacity: dimmed ? DIM : 1 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              )
            })}

            {/* Bloque de texto de la página izquierda */}
            <div style={{ position: 'absolute', left: page.textLeft, top: '16.03%', width: '30.5%', zIndex: 30 }}>
              {/* Título: revelado izq → der (efecto "tecleo") */}
              <motion.div
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ delay: 0.2, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                style={{ fontFamily: fontFamilyMap.sans, fontWeight: 700, fontSize: s(51), color: '#5B5B5B', lineHeight: 1 }}
              >
                diseño de
              </motion.div>
              <motion.div
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ delay: 0.5, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontFamily: fontFamilyMap.serif,
                  fontStyle: 'italic',
                  fontWeight: 700,
                  fontSize: s(69),
                  color: '#F83F92',
                  lineHeight: 1,
                  marginTop: s(4),
                  transform: 'translateY(-1.84cqw)',
                }}
              >
                {page.accent}
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: s(46), marginTop: s(70), transform: 'translateY(-1.22cqw)' }}>
                {page.products.map((p, idx) => {
                  const pGroup = page.groupOfTitle[p.title]
                  const pDimmed = activeGroup != null && pGroup != null && pGroup !== activeGroup
                  const base = 0.75 + idx * 0.22
                  return (
                    // Envoltura de entrada (opacity + y), se reproduce al abrir/cambiar de hoja
                    <motion.div key={p.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: base, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                      {/* Atenuado por grupo (opacity, ágil) */}
                      <motion.div
                        animate={{ opacity: pDimmed ? DIM : 1 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: s(22) }}
                      >
                        <div style={{ width: '32%', flexShrink: 0 }}>
                          <div style={{ fontFamily: fontFamilyMap.sans, fontWeight: 700, fontSize: s(20), color: '#5B5B5B', textAlign: 'left', lineHeight: 1.1 }}>
                            {p.title}
                          </div>
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: base + 0.18, type: 'spring', stiffness: 500, damping: 18 }}
                            style={{
                              display: 'inline-block',
                              marginTop: s(9),
                              background: '#DC7D9A',
                              color: '#ffffff',
                              fontFamily: fontFamilyMap.serif,
                              fontSize: s(13),
                              lineHeight: 1,
                              padding: `${s(5)} ${s(12)}`,
                              borderRadius: '999px',
                              transformOrigin: 'left center',
                            }}
                          >
                            {p.year}
                          </motion.span>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            marginLeft: '-3.57cqw',
                            fontFamily: fontFamilyMap.sans,
                            fontWeight: 400,
                            fontSize: s(11),
                            color: '#5B5B5B',
                            textAlign: 'left',
                            lineHeight: 1.4,
                          }}
                        >
                          {p.description}
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {cursor.label && <CursorLabel label={cursor.label} x={cursor.x} y={cursor.y} pointer="hand" />}
    </div>
  )
}
