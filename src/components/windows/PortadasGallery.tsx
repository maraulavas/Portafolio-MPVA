import { useContext, useEffect, useRef, useState } from 'react'
import { BackToCardsContext } from './backToCards'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assetUrl } from '../../data/assets'
import { skillIcon } from '../Dock'
import { useLang, useUI } from '../../i18n/LanguageContext'
import { localizeProject } from '../../i18n/useContent'
import { useIsMobile } from '../../mobile/useIsMobile'
import { gestureBack, pushBack } from '../../mobile/backStack'
import SwipeBack from '../../mobile/SwipeBack'

// Galería compartida "portadas" (estilo Top Picks de macOS Music) que usan las
// 4 secciones de proyectos: grilla de cards grandes que al tocarlas abren un
// case-study. Cada sección (UxuiGallery, IndustrialGallery, etc.) trae sus
// propios datos y solo renderiza este componente.

export interface PortadaProject {
  id: string
  title: string
  tagTop: string // píldora superior de la portada (dominio o categoría)
  subtitle: string // subtítulo bajo el título en la portada y caption en el detalle
  year: string
  url?: string // si existe, se muestra el botón "Visitar sitio"
  base: string // degradado de fondo (si no hay imagen)
  glow: string // color del resplandor difuminado
  monogram: string
  image?: string // foto real, en public/assets (reemplaza el degradado)
  // Captura de página completa (p. ej. todo el inicio del sitio). Si existe, el
  // detalle la muestra dentro del marco Safari con scroll, como navegando.
  preview?: string
  // Captura del inicio en versión celular. En el portafolio móvil se muestra dentro de un iPhone.
  previewMobile?: string
  // Varias imágenes fijas (p. ej. pantallas de un prototipo): el detalle las muestra en un visor
  // del alto de la pantalla, sin scroll, con flechas y puntos para pasar de una a otra.
  gallery?: string[]
  process: string[] // vacío = aún no hay copy, se muestra un placeholder
  // Proyectos de identidad (Diseño gráfico): el detalle muestra logo, colores y tipografías.
  brand?: Brand
  // Ficha del caso (UX/UI): reto, rol, herramientas y resultado. Se muestra debajo del detalle.
  caseStudy?: CaseStudy
  // Oculta el campo «Tipo» en la ficha.
  hideType?: boolean
  // Diseño Industrial: detalle tipo "showroom".
  showroom?: Showroom
  // Exploración & IA: solo fotos → galería Cover Flow.
  photos?: { src: string; caption?: string; video?: string }[]
  // 'feature-left': la 1.ª foto (vertical) ocupa toda la columna izquierda y las demás se apilan a la derecha.
  photosLayout?: 'feature-left' | 'feature-left-wide' | 'grid'
}

export interface Showroom {
  hero: string // foto del producto sin fondo (PNG)
  backdrop?: string // fondo del escenario (CSS)
  hotspots?: { x: number; y: number; label: string; text?: string }[] // posición en % sobre el producto
  // Cara posterior (productos de dos caras): un botón gira el producto entre las dos vistas.
  back?: { hero: string; hotspots?: { x: number; y: number; label: string; text?: string }[] }
  compare?: { before: string; after: string } // boceto/plano → render (mismo encuadre)
  gallery?: string[]
}

export interface CaseStudy {
  challenge: string
  role: string
  tools: string[]
  result: string
}

// Computador: la ficha del caso como widgets de macOS (2×2) en la columna de información,
// justo debajo de la ficha del proyecto, para que se vean sin bajar.

function CaseWidgets({ cs, wide = false }: { cs: CaseStudy; wide?: boolean }) {
  const t = useUI()
  const items: { key: string; title: string; body: ReactNode }[] = [
    { key: 'challenge', title: t.gallery.caseChallenge, body: cs.challenge },
    { key: 'role', title: t.gallery.caseRole, body: cs.role },
    {
      key: 'tools',
      title: t.gallery.caseTools,
      body: (
        <span className="block">
          <span className="flex">
            {cs.tools.map((tool, i) => {
              const icon = skillIcon(tool)
              return (
                <span
                  key={tool}
                  title={tool}
                  className="relative -ml-2.5 block h-10 w-10 overflow-hidden rounded-full border-[2.5px] border-white bg-white first:ml-0"
                  style={{ zIndex: cs.tools.length - i }}
                >
                  {icon ? (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7]">{icon}</span>
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-ink text-[13px] font-semibold text-white">{tool.charAt(0)}</span>
                  )}
                </span>
              )
            })}
          </span>
          <span className="mt-2 block text-[12px] text-ink/50">{t.desktop.toolsList(cs.tools)}</span>
        </span>
      ),
    },
    { key: 'result', title: t.gallery.caseResult, body: cs.result },
  ].filter((it) => it.body)
  return (
    <div className={wide ? 'grid grid-cols-2 gap-x-10 gap-y-10 lg:grid-cols-4' : 'mt-8 flex flex-col'}>
      {items.map((it, i) => {
        return (
          <motion.div
            key={it.key}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 300, damping: 26 }}
            className={`group relative overflow-hidden bg-white ${wide ? '' : 'border-t border-black/15 py-5 first:border-t-0 first:pt-0'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] opacity-50">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em]">{it.title}</span>
            </div>
            <div className="mt-3 text-[14px] leading-[1.35] text-black">
              {it.body}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Ficha del caso (celular): lista editorial en blanco y negro, filas separadas por líneas (reto, mi rol, herramientas, resultado).
function CaseFacts({ cs }: { cs: CaseStudy }) {
  const t = useUI()
  const items: { key: string; title: string; body: ReactNode }[] = [
    { key: 'challenge', title: t.gallery.caseChallenge, body: cs.challenge },
    { key: 'role', title: t.gallery.caseRole, body: cs.role },
    {
      key: 'tools',
      title: t.gallery.caseTools,
      body: (
        <span className="block">
          <span className="flex">
            {cs.tools.map((tool, i) => {
              const icon = skillIcon(tool)
              return (
                <span
                  key={tool}
                  title={tool}
                  className="relative -ml-2.5 block h-10 w-10 overflow-hidden rounded-full border-[2.5px] border-white bg-white first:ml-0"
                  style={{ zIndex: cs.tools.length - i }}
                >
                  {icon ? (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7]">{icon}</span>
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-ink text-[13px] font-semibold text-white">{tool.charAt(0)}</span>
                  )}
                </span>
              )
            })}
          </span>
          <span className="mt-2 block text-[12px] text-ink/50">{t.desktop.toolsList(cs.tools)}</span>
        </span>
      ),
    },
    { key: 'result', title: t.gallery.caseResult, body: cs.result },
  ].filter((it) => it.body)
  return (
    <div className="mt-10 border-t-[3px] border-black">
      {items.map((c, i) => (
        <motion.section
          key={c.key}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-black/20 py-5"
        >
          <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.08em]">
            <span className="tabular-nums opacity-50">{String(i + 1).padStart(2, '0')}</span>
            <span>{c.title}</span>
          </p>
          <div className="mt-3 text-[15px] leading-[1.4] text-black">{c.body}</div>
        </motion.section>
      ))}
    </div>
  )
}

export interface Brand {
  logo?: string // imagen del logo (fondo claro), en public/assets
  logoOnColor?: string // versión del logo para fondo de color
  wordmark?: string // mientras no haya imagen: nombre escrito con la tipografía de títulos
  colors: { name: string; hex: string }[] // el 1.º es el color del logo en negativo, el 2.º el acento
  fonts: { name: string; role: string; family: string; weight?: number; italic?: boolean; style?: string }[]
  mockups?: string[] // fotos de aplicaciones de la marca (el 1.º va grande)
  whiteLogoOn?: string[] // colores de fondo (claros) sobre los que se usa igualmente el logo blanco
  coverBg?: string // color de fondo de la portada en la grilla (por defecto, el más oscuro de la paleta)
}

// Texto claro u oscuro según qué tan claro sea el color de fondo.
function inkOn(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#1b1420' : '#ffffff'
}

// Color más oscuro de la paleta (para el logo en positivo y el fondo del negativo).
function darkest(brand: Brand) {
  const lum = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16)
    return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  }
  return [...brand.colors].sort((a, b) => lum(a.hex) - lum(b.hex))[0]?.hex ?? '#1b1420'
}

function Wordmark({ brand, color, size }: { brand: Brand; color: string; size: string }) {
  return (
    <span style={{ fontFamily: brand.fonts[0]?.family, color, fontSize: size, lineHeight: 1 }} className="whitespace-nowrap">
      {brand.wordmark}
      <span style={{ color: brand.colors[1]?.hex }}>.</span>
    </span>
  )
}


// Columna izquierda de los detalles: baja con la página hasta que se ve su final y ahí se queda
// quieta mientras la columna de textos (a la derecha) termina de bajar.
function useStickyEnd() {
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState<number | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const calc = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return setTop(null)
      setTop(Math.min(72, window.innerHeight - el.offsetHeight - 16))
    }
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    window.addEventListener('resize', calc)
    calc()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [])
  return { ref, style: top === null ? undefined : ({ position: 'sticky', top } as const) }
}

function fontCss(f: Brand['fonts'][number]) {
  return { fontFamily: f.family, fontWeight: f.weight, fontStyle: f.italic ? 'italic' : undefined }
}

// Detalle de Diseño Industrial: "Showroom". El producto sin fondo sobre un escenario de
// estudio que se inclina en 3D con el mouse y tiene una luz que sigue el cursor; puntos de
// detalle sobre el producto; comparador boceto → render; galería con visor; ficha del caso.
// Exploración & IA: proyectos que son solo fotos → mosaico con separadores negros a la izquierda
// y la ficha a la derecha.
function PhotosDetail({ project, category, kind }: { project: PortadaProject; category: string; kind: string }) {
  const t = useUI()
  const photos = project.photos!
  const n = photos.length
  const label = 'text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/35'
  const sticky = useStickyEnd()
  const [viewer, setViewer] = useState<number | null>(null)

  useEffect(() => {
    if (viewer === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setViewer(null)
      else if (e.key === 'ArrowRight') setViewer((v) => (v === null ? v : (v + 1) % n))
      else if (e.key === 'ArrowLeft') setViewer((v) => (v === null ? v : (v - 1 + n) % n))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewer, n])

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          ref={sticky.ref}
          style={project.photosLayout === 'grid' ? undefined : sticky.style}
          className={`min-w-0 bg-white p-0 ${project.photosLayout === 'grid' ? 'lg:self-stretch' : 'self-start'}`}
        >
          {project.photosLayout === 'grid' ? (
            <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 lg:h-full ${photos.length <= 6 ? 'lg:grid-rows-2' : 'lg:grid-rows-3'}`}>
              {photos.map((p, i) => (
                <button
                  key={p.src + i}
                  type="button"
                  onClick={() => setViewer(i)}
                  aria-label={p.caption ?? `${i + 1} / ${n}`}
                  className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-neutral-100 lg:aspect-auto lg:h-full lg:min-h-[180px]"
                >
                  {p.video ? (
                    <video src={assetUrl(p.video)} poster={assetUrl(p.src)} muted loop autoPlay playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                  ) : (
                    <img src={assetUrl(p.src)} alt={p.caption ?? ''} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                  )}
                </button>
              ))}
            </div>
          ) : project.photosLayout === 'feature-left' || project.photosLayout === 'feature-left-wide' ? (
            <div className={`grid items-stretch gap-3 ${photos[0].video ? 'grid-cols-2' : project.photosLayout === 'feature-left-wide' ? 'grid-cols-2 md:grid-cols-[1.6fr_1fr]' : 'grid-cols-2'}`}>
              <button
                type="button"
                onClick={() => setViewer(0)}
                aria-label={photos[0].caption ?? `1 / ${n}`}
                className={`group relative block w-full cursor-zoom-in overflow-hidden bg-neutral-100 max-md:aspect-square ${photos[0].video ? 'aspect-[1080/1446]' : 'min-h-[320px] max-md:min-h-0'}`}
              >
                {photos[0].video ? <video src={assetUrl(photos[0].video)} poster={assetUrl(photos[0].src)} muted loop autoPlay playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" /> : <img src={assetUrl(photos[0].src)} alt={photos[0].caption ?? ''} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />}
                <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-black">{photos[0].caption}</span>
              </button>
              <div className="contents md:flex md:flex-col md:gap-3">
                {photos.slice(1).map((p, k) => (
                  <button
                    key={p.src + k}
                    type="button"
                    onClick={() => setViewer(k + 1)}
                    aria-label={p.caption ?? `${k + 2} / ${n}`}
                    className={`group relative block w-full cursor-zoom-in overflow-hidden bg-neutral-100 max-md:aspect-square ${photos[0].video ? 'min-h-0 flex-1' : ''}`}
                  >
                    {p.video ? <video src={assetUrl(p.video)} poster={assetUrl(p.src)} muted loop autoPlay playsInline preload="metadata" className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${photos[0].video ? 'absolute inset-0 h-full w-full object-cover' : 'block h-auto w-full max-md:absolute max-md:inset-0 max-md:h-full max-md:object-cover'}`} /> : <img src={assetUrl(p.src)} alt={p.caption ?? ''} loading="lazy" draggable={false} className="block h-auto w-full max-md:absolute max-md:inset-0 max-md:h-full max-md:object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />}
                    <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-black">{p.caption}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <div className={`columns-2 gap-3 ${photos.length > 2 ? 'md:columns-3' : ''}`}>
            {photos.map((p, i) => (
              <button
                key={p.src + i}
                type="button"
                onClick={() => setViewer(i)}
                aria-label={p.caption ?? `${i + 1} / ${n}`}
                className="group mb-3 block w-full cursor-zoom-in overflow-hidden bg-neutral-100 [break-inside:avoid]"
              >
                {p.video ? (
                  <video
                    src={assetUrl(p.video)}
                    poster={assetUrl(p.src)}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <img
                    src={assetUrl(p.src)}
                    alt={p.caption ?? ''}
                    loading="lazy"
                    draggable={false}
                    className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </button>
            ))}
          </div>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="self-start"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">{category}</p>
          <h2 className="mt-2 text-[clamp(36px,4.4vw,72px)] font-medium uppercase leading-[0.9] tracking-[-0.04em] text-black">{project.title}</h2>
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 max-[399px]:flex-col text-[12px] uppercase tracking-[0.06em]">
            {project.year && (
              <div className="flex flex-col gap-1">
                <dt className="opacity-50">{t.gallery.year}</dt>
                <dd className="text-black">{project.year}</dd>
              </div>
            )}
            {!project.hideType && (
              <div className="flex flex-col gap-1">
                <dt className="opacity-50">{t.gallery.type}</dt>
                <dd className="text-black">{kind}</dd>
              </div>
            )}
          </dl>
          {project.caseStudy && <CaseWidgets cs={project.caseStudy} />}
          <p className={`mt-8 ${label}`}>{t.gallery.process}</p>
          <div className="mt-2 space-y-3">
            {project.process.length > 0 ? (
              project.process.map((p, i) => (
                <p key={i} className="text-[15.5px] leading-[1.4] text-black">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-[14.5px] italic leading-relaxed text-ink/40">{t.gallery.comingSoon}</p>
            )}
          </div>
        </motion.aside>
      </div>

      {/* Visor */}
      <AnimatePresence>
        {viewer !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex cursor-pointer items-center justify-center bg-black/90 p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewer(null)}
          >
            {photos[viewer].video ? (
              <motion.video
                key={viewer}
                src={assetUrl(photos[viewer].video as string)}
                poster={assetUrl(photos[viewer].src)}
                controls
                autoPlay
                loop
                playsInline
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-h-full max-w-full cursor-default object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                key={viewer}
                src={assetUrl(photos[viewer].src)}
                alt=""
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-h-full max-w-full cursor-default object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {n > 1 &&
              [-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewer((v) => (v === null ? v : (v + d + n) % n))
                  }}
                  aria-label={d < 0 ? t.chat.prev : t.chat.next}
                  className={`absolute ${d < 0 ? 'left-4' : 'right-4'} grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={d < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
                  </svg>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShowroomDetail({ project, category, kind }: { project: PortadaProject; category: string; kind: string }) {
  const t = useUI()
  const sr = project.showroom!
  const sticky = useStickyEnd()
  const label = 'text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/35'
  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }

  const [spot, setSpot] = useState<number | null>(null)
  const [face, setFace] = useState<'front' | 'back'>('front')

  const view = face === 'back' && sr.back ? sr.back : sr
  function turn(f: 'front' | 'back') {
    setSpot(null)
    setFace(f)
  }

  // --- Comparador ---
  const cmpRef = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(50)
  const dragging = useRef(false)
  function setFromX(clientX: number) {
    const r = cmpRef.current?.getBoundingClientRect()
    if (!r) return
    setSplit(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  // --- Galería ---
  const gallery = sr.gallery ?? []
  const [viewer, setViewer] = useState<number | null>(null)
  useEffect(() => {
    if (viewer === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setViewer(null)
      else if (e.key === 'ArrowRight') setViewer((v) => (v === null ? v : (v + 1) % gallery.length))
      else if (e.key === 'ArrowLeft') setViewer((v) => (v === null ? v : (v - 1 + gallery.length) % gallery.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewer, gallery.length])

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] lg:gap-12">
      <div ref={sticky.ref} style={sticky.style} className="min-w-0 space-y-10 self-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/3] overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          {/* Piso */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/[0.06] to-transparent" aria-hidden />
          <div className="absolute inset-[10%]" style={{ perspective: 1400 }}>
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={face}
            initial={{ rotateY: sr.back ? 90 : 0, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: sr.back ? -90 : 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex h-full w-full items-center justify-center"
          >
            {/* Sombra de contacto */}
            <div className="pointer-events-none absolute bottom-[2%] left-1/2 h-[7%] w-[62%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" aria-hidden />
            <img
              src={assetUrl(view.hero)}
              alt={project.title}
              draggable={false}
              className="relative max-h-full max-w-full object-contain drop-shadow-[0_30px_30px_rgba(27,20,32,0.25)]"
            />
            {/* Puntos de detalle */}
            {(view.hotspots ?? []).map((h, i) => (
              <div
                key={h.label}
                className="absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%,-50%)' }}
                onMouseEnter={() => setSpot(i)}
                onMouseLeave={() => setSpot(null)}
              >
                <button
                  type="button"
                  onClick={() => setSpot(spot === i ? null : i)}
                  aria-label={h.label}
                  className="relative grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-white shadow-md ring-2 ring-black md:h-7 md:w-7"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-black/25" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-black md:h-2.5 md:w-2.5" />
                </button>
                <AnimatePresence>
                  {spot === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-1/2 top-9 z-20 hidden w-[200px] -translate-x-1/2 bg-white p-3 text-left shadow-xl ring-1 ring-black/10 md:block"
                    >
                      <p className="text-[13px] font-semibold text-ink">{h.label}</p>
                      {h.text && <p className="mt-0.5 text-[12px] leading-snug text-ink/60">{h.text}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
          </AnimatePresence>
          </div>
          {sr.back && (
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-0.5 rounded-full border border-black bg-white p-0.5 md:bottom-4 md:gap-1 md:p-1">
              {(['front', 'back'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => turn(f)}
                  className={`cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors md:px-3.5 md:py-1.5 md:text-[12.5px] ${
                    face === f ? 'bg-black text-white' : 'text-black/55 hover:text-black'
                  }`}
                >
                  {f === 'front' ? t.gallery.faceFront : t.gallery.faceBack}
                </button>
              ))}
            </div>
          )}
        </motion.div>

      {/* Celular: el texto del punto seleccionado va debajo de la imagen (no tapa el producto) */}
      {spot !== null && view.hotspots?.[spot] && (
        <div className="-mt-6 border-t-[3px] border-black bg-black/[0.04] p-3.5 md:hidden">
          <p className="text-[13px] font-semibold text-ink">{view.hotspots[spot].label}</p>
          {view.hotspots[spot].text && <p className="mt-0.5 text-[12.5px] leading-snug text-ink/65">{view.hotspots[spot].text}</p>}
        </div>
      )}

      {/* Del boceto al render */}
      {sr.compare && (
        <motion.section {...reveal}>
          <p className={`mb-2.5 ${label}`}>{t.gallery.sketchToRender}</p>
          <div
            ref={cmpRef}
            className="relative aspect-[16/9] cursor-ew-resize select-none overflow-hidden bg-black/5"
            onPointerDown={(e) => {
              dragging.current = true
              ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
              setFromX(e.clientX)
            }}
            onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <img src={assetUrl(sr.compare.after)} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
              <img src={assetUrl(sr.compare.before)} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <span className="pointer-events-none absolute left-4 top-4 bg-white px-3 py-1 text-[12px] font-medium uppercase tracking-[0.06em] text-black">
              {t.gallery.sketch}
            </span>
            <span className="pointer-events-none absolute right-4 top-4 bg-black px-3 py-1 text-[12px] font-medium uppercase tracking-[0.06em] text-white">
              {t.gallery.render}
            </span>
            <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]" style={{ left: `${split}%` }}>
              <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </motion.section>
      )}

      {/* Galería */}
      {gallery.length > 0 && (
        <motion.section {...reveal}>
          <p className={`mb-2.5 ${label}`}>{t.gallery.photos}</p>
          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((g, i) => (
              <button
                key={g + i}
                type="button"
                onClick={() => setViewer(i)}
                className={`group cursor-zoom-in overflow-hidden bg-black/5 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img
                  src={assetUrl(g)}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </button>
            ))}
          </div>
        </motion.section>
      )}


      </div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="self-start"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">{category}</p>
          <h2 className="mt-2 text-[clamp(36px,4.4vw,72px)] font-medium uppercase leading-[0.9] tracking-[-0.04em] text-black">{project.title}</h2>
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 max-[399px]:flex-col text-[12px] uppercase tracking-[0.06em]">
            {project.year && (
              <div className="flex flex-col gap-1">
                <dt className="opacity-50">{t.gallery.year}</dt>
                <dd className="text-black">{project.year}</dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="opacity-50">{t.gallery.type}</dt>
              <dd className="text-black">{kind}</dd>
            </div>
          </dl>
          {project.caseStudy && <CaseWidgets cs={project.caseStudy} />}
          <p className={`mt-8 ${label}`}>{t.gallery.process}</p>
          <div className="mt-2 space-y-3">
            {project.process.length > 0 ? (
              project.process.map((p, i) => (
                <p key={i} className="text-[15.5px] leading-[1.4] text-black">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-[14.5px] italic leading-relaxed text-ink/40">{t.gallery.comingSoon}</p>
            )}
          </div>
        </motion.aside>
      </div>

      {/* Visor */}
      <AnimatePresence>
        {viewer !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex cursor-pointer items-center justify-center bg-black/85 p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewer(null)}
          >
            <motion.img
              key={viewer}
              src={assetUrl(gallery[viewer])}
              alt=""
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-h-full max-w-full cursor-default object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {gallery.length > 1 &&
              [-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewer((v) => (v === null ? v : (v + d + gallery.length) % gallery.length))
                  }}
                  aria-label={d < 0 ? t.chat.prev : t.chat.next}
                  className={`absolute ${d < 0 ? 'left-4' : 'right-4'} grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={d < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
                  </svg>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Detalle de un proyecto de identidad, interactivo: logo con interruptor positivo/negativo,
// paleta que se abre al pasar el mouse (clic copia el HEX y pinta el fondo del logo),
// probador de tipografía editable y carrusel de aplicaciones con visor en grande.
function BrandDetail({ project, category, kind }: { project: PortadaProject; category: string; kind: string }) {
  const t = useUI()
  const sticky = useStickyEnd()
  const brand = project.brand!
  const dark = darkest(brand)
  const label = 'text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/35'
  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }

  // --- Logo: fondo actual (blanco = positivo; cualquier otro color = negativo) ---
  const [logoBg, setLogoBg] = useState('#ffffff')
  const onDark = inkOn(logoBg) === '#ffffff'
  const whiteLogo = onDark || !!brand.whiteLogoOn?.some((h) => h.toLowerCase() === logoBg.toLowerCase())
  const logoSrc = whiteLogo ? brand.logoOnColor ?? brand.logo : brand.logo
  // Color del código HEX de la esquina: "Bluewash" sobre fondo oscuro, "Black Beauty" sobre fondo claro
  // (si la marca no tiene esos colores, blanco o el más oscuro de la paleta).
  const paletteHex = (name: string) => brand.colors.find((c) => c.name.toLowerCase() === name)?.hex
  const codeColor = onDark ? paletteHex('bluewash') ?? '#ffffff' : paletteHex('black beauty') ?? dark

  // --- Paleta ---
  const [hovered, setHovered] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  function pickColor(hex: string) {
    navigator.clipboard?.writeText(hex).catch(() => {})
    setCopied(hex)
    setLogoBg(hex)
    window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1600)
  }

  // --- Tipografía ---
  const [fontIdx, setFontIdx] = useState(0)
  const [sample, setSample] = useState(project.title)
  const font = brand.fonts[fontIdx] ?? brand.fonts[0]

  // --- Aplicaciones ---
  const trackRef = useRef<HTMLDivElement>(null)
  const [viewer, setViewer] = useState<number | null>(null)
  const mockups = brand.mockups ?? []
  // Con 3 aplicaciones o menos ocupan todo el ancho (cada una proporcional a su forma, todas al mismo alto) y sin flechas.
  const fillRow = mockups.length > 0 && mockups.length <= 3
  const [ratios, setRatios] = useState<Record<string, number>>({})
  function scrollTrack(dir: 1 | -1) {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
  }
  useEffect(() => {
    if (viewer === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setViewer(null)
      else if (e.key === 'ArrowRight') setViewer((v) => (v === null ? v : (v + 1) % mockups.length))
      else if (e.key === 'ArrowLeft') setViewer((v) => (v === null ? v : (v - 1 + mockups.length) % mockups.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewer, mockups.length])

  return (
    <div>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] lg:gap-12">
      <div ref={sticky.ref} style={sticky.style} className="min-w-0 space-y-8 self-start">
      <div className="space-y-8">
      {/* Logo con interruptor positivo / negativo */}
      <motion.section {...reveal}>
        <div className="mb-2.5 flex items-center justify-between">
          <p className={label}>{t.gallery.brandLogo}</p>
          <div className="flex rounded-full bg-ink/[0.06] p-[3px]" role="group">
            {[
              { key: 'pos', text: t.gallery.logoPositive, bg: '#ffffff' },
              { key: 'neg', text: t.gallery.logoNegative, bg: dark },
            ].map((o) => {
              const active = o.key === 'pos' ? !onDark : onDark
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setLogoBg(o.bg)}
                  aria-pressed={active}
                  className={`relative cursor-pointer rounded-full px-3.5 py-1 text-[12.5px] font-medium transition-colors ${
                    active ? 'text-ink' : 'text-ink/45 hover:text-ink/75'
                  }`}
                >
                  {active && (
                    <motion.span layoutId={`logo-toggle-${project.id}`} className="absolute inset-0 rounded-full bg-white shadow-sm" />
                  )}
                  <span className="relative">{o.text}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="relative h-[300px] overflow-hidden rounded-3xl border border-ink/10 bg-white sm:h-[360px]">
          {/* El color nuevo entra como un círculo que se expande desde la esquina */}
          <AnimatePresence initial={false}>
            <motion.div
              key={logoBg}
              className="absolute inset-0"
              style={{ background: logoBg }}
              initial={{ clipPath: 'circle(0% at 92% 8%)' }}
              animate={{ clipPath: 'circle(150% at 92% 8%)' }}
              // El color anterior se queda debajo hasta que el nuevo lo cubre (así también se ve al volver a Positivo).
              exit={{ opacity: 0.99 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 flex items-center justify-center">
            {logoSrc ? (
              <img
                src={assetUrl(logoSrc)}
                alt={project.title}
                className="max-h-[56%] max-w-[55%] object-contain"
                draggable={false}
              />
            ) : (
              <Wordmark brand={brand} color={onDark ? '#ffffff' : dark} size="clamp(34px, 5vw, 68px)" />
            )}
          </div>
          <span
            className="absolute bottom-4 left-5 text-[11.5px] font-semibold uppercase tracking-wide transition-colors duration-300"
            style={{ color: codeColor }}
          >
            {logoBg}
          </span>
        </div>
      </motion.section>

      {/* Paleta interactiva */}
      <motion.section {...reveal}>
        <div className="mb-2.5 flex items-center justify-between">
          <p className={label}>{t.gallery.brandColors}</p>
          <p className="text-[12px] text-ink/40">{t.gallery.copyHint}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" onMouseLeave={() => setHovered(null)}>
          {brand.colors.map((c) => {
            const open = hovered === c.hex
            const n = parseInt(c.hex.slice(1), 16)
            return (
              <motion.button
                key={c.hex}
                type="button"
                onMouseEnter={() => setHovered(c.hex)}
                onFocus={() => setHovered(c.hex)}
                onClick={() => pickColor(c.hex)}
                className="relative h-[140px] min-w-0 cursor-pointer overflow-hidden rounded-2xl text-left ring-1 ring-inset ring-black/5"
                style={{ background: c.hex, color: inkOn(c.hex) }}
                aria-label={`${c.name} ${c.hex}`}
              >
                <span className="absolute inset-x-4 bottom-3 block">
                  <span className="block truncate text-[14px] font-semibold">{c.name}</span>
                  <span className="block text-[12px] uppercase tracking-wide opacity-75">{c.hex}</span>
                  <AnimatePresence>
                    {open && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 0.75, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="block whitespace-nowrap text-[12px]"
                      >
                        RGB {(n >> 16) & 255} · {(n >> 8) & 255} · {n & 255}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <AnimatePresence>
                  {copied === c.hex && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-semibold text-ink shadow-sm"
                    >
                      {t.gallery.copied}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </motion.section>
      </div>

      {/* Probador de tipografía */}
      <motion.section {...reveal} className="rounded-3xl border border-ink/10 bg-[#faf7f9] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={label}>
            {t.gallery.brandType} · {font.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {brand.fonts.map((f, i) => (
              <button
                key={f.role}
                type="button"
                onClick={() => setFontIdx(i)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-[12.5px] transition ${
                  i === fontIdx ? 'border-transparent bg-ink text-white' : 'border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink'
                }`}
                style={fontCss(f)}
              >
                {f.style ?? f.name} <span className="opacity-60">· {f.role}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.input
          key={fontIdx}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          placeholder={t.gallery.typePlaceholder}
          spellCheck={false}
          aria-label={t.gallery.typePlaceholder}
          className="mt-4 w-full bg-transparent text-[clamp(32px,4.2vw,60px)] leading-tight outline-none placeholder:text-ink/20"
          style={{ ...fontCss(font), color: brand.colors[1]?.hex ?? dark }}
        />
        <p className="mt-3 break-words text-[15px] leading-relaxed text-ink/60" style={fontCss(font)}>
          ABCDEFGHIJKLMNÑOPQRSTUVWXYZ · abcdefghijklmnñopqrstuvwxyz · 0123456789 ¡!¿?&@
        </p>
      </motion.section>

      {/* Aplicaciones: carrusel horizontal */}
      {mockups.length > 0 && (
        <motion.section {...reveal}>
          <div className="mb-2.5 flex items-center justify-between">
            <p className={label}>{t.gallery.brandMockups}</p>
            <div className={`gap-1.5 ${fillRow ? 'hidden' : 'flex'}`}>
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => scrollTrack(d as 1 | -1)}
                  aria-label={d < 0 ? t.chat.prev : t.chat.next}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={d < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          {fillRow ? (
            <div className="flex gap-3">
              {mockups.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setViewer(i)}
                  style={{ flex: `${ratios[m] ?? 1} 1 0%` }}
                  className="group min-w-0 cursor-zoom-in overflow-hidden rounded-2xl bg-ink/5"
                >
                  <img
                    src={assetUrl(m)}
                    alt=""
                    draggable={false}
                    onLoad={(e) => {
                      const { naturalWidth: w, naturalHeight: h } = e.currentTarget
                      if (w && h) setRatios((r) => (r[m] === w / h ? r : { ...r, [m]: w / h }))
                    }}
                    className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </button>
              ))}
            </div>
          ) : (
          <div ref={trackRef} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
            {mockups.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewer(i)}
                className="group h-[clamp(240px,34vw,440px)] shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-2xl bg-ink/5"
              >
                <img
                  src={assetUrl(m)}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="h-full w-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
          )}
        </motion.section>
      )}

      </div>

      <aside className="self-start">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">{category}</p>
        <h2 className="mt-2 text-[clamp(36px,4.4vw,72px)] font-medium uppercase leading-[0.9] tracking-[-0.04em] text-black">{project.title}</h2>
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 max-[399px]:flex-col text-[12px] uppercase tracking-[0.06em]">
          {project.year && (
            <div className="flex flex-col gap-1">
              <dt className="opacity-50">{t.gallery.year}</dt>
              <dd className="text-black">{project.year}</dd>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <dt className="opacity-50">{t.gallery.type}</dt>
            <dd className="text-black">{kind}</dd>
          </div>
        </dl>
        {project.caseStudy && <CaseWidgets cs={project.caseStudy} />}
        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.08em] opacity-50">{t.gallery.process}</p>
        <div className="mt-2 space-y-3">
          {project.process.length > 0 ? (
            project.process.map((p, i) => (
              <p key={i} className="text-[15.5px] leading-[1.4] text-black">
                {p}
              </p>
            ))
          ) : (
            <p className="text-[14.5px] italic leading-relaxed text-ink/40">{t.gallery.comingSoon}</p>
          )}
        </div>
      </aside>
    </div>

      {/* Visor de aplicaciones */}
      <AnimatePresence>
        {viewer !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex cursor-pointer items-center justify-center bg-black/85 p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewer(null)}
          >
            <motion.img
              key={viewer}
              src={assetUrl(mockups[viewer])}
              alt=""
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-h-full max-w-full cursor-default rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {mockups.length > 1 &&
              [-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewer((v) => (v === null ? v : (v + d + mockups.length) % mockups.length))
                  }}
                  aria-label={d < 0 ? t.chat.prev : t.chat.next}
                  className={`absolute ${d < 0 ? 'left-4' : 'right-4'} grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={d < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
                  </svg>
                </button>
              ))}
            <button
              type="button"
              onClick={() => setViewer(null)}
              aria-label={t.chat.close}
              className="absolute right-5 top-5 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Cuadrícula editorial de portadas: la imagen es lo principal; nombre, tipo y año debajo.
function ProjectIndex({ visible, onOpen, hint }: { visible: PortadaProject[]; onOpen: (id: string) => void; hint: string }) {
  const mobile = useIsMobile()
  return mobile ? <ProjectIndexScroll visible={visible} onOpen={onOpen} hint={hint} /> : <ProjectIndexColumns visible={visible} onOpen={onOpen} hint={hint} />
}

// Escritorio: columnas numeradas; la activa se ensancha y muestra la portada (mismo movimiento que el inicio).
function ProjectIndexColumns({ visible, onOpen, hint }: { visible: PortadaProject[]; onOpen: (id: string) => void; hint: string }) {
  const [hov, setHov] = useState<number | null>(null)
  const shown = hov
  return (
    <div className="flex flex-col justify-between pt-1" style={{ minHeight: 'calc(100svh - 56px - 24px - clamp(34px, 6vw, 96px) * 0.88 - 24px)' }}>
      <p className="mb-4 px-5 md:px-8 text-[11px] uppercase tracking-[0.08em] opacity-60">{hint}</p>
      <div className="flex h-[min(64svh,620px)] min-h-[420px] gap-px overflow-hidden bg-black/10">
        {visible.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.id)}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * Math.min(i, 6), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: `${shown === i ? 2.4 : 1} 1 0%`, transition: 'flex-grow 1100ms cubic-bezier(0.65,0,0.35,1)' }}
            className="group relative flex min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#f4f4f4] p-4 text-left"
          >
            <span className="absolute inset-0 bg-black" style={{ opacity: shown === i ? 1 : 0, transition: 'opacity 900ms cubic-bezier(0.65,0,0.35,1)' }} />
            <span className="relative z-10 text-[clamp(90px,12vw,220px)] leading-none transition-colors duration-500" style={{ color: shown === i ? '#fff' : undefined, fontFamily: "'Antonio', sans-serif", fontWeight: 200 }}>
              {i + 1}
            </span>
            <span className="absolute right-4 top-4 z-10 grid h-6 w-6 place-items-center rounded-full bg-black text-[12px] text-white" style={shown === i ? { background: '#fff', color: '#000' } : undefined}>→</span>
            <span className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 transition-colors duration-500" style={{ color: shown === i ? '#fff' : undefined }}>
              <span className="block min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.08em] opacity-70">{p.year}</span>
                <span className="mt-1 block truncate text-[clamp(16px,1.5vw,24px)] font-medium leading-[1] tracking-[-0.03em]">{p.title}</span>
                <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.08em] opacity-70">{p.subtitle}</span>
              </span>
              <span className="block w-[clamp(64px,34%,150px)] shrink-0 aspect-[16/10] overflow-hidden bg-white/10 [filter:grayscale(1)] transition-opacity duration-500" style={{ opacity: shown === i ? 1 : 0 }}>
                <Cover project={p} plain thumb />
              </span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Celular: cuadrícula de 2 columnas numeradas (como los perfiles del inicio); al tocar, abre el proyecto.
function ProjectIndexScroll({ visible, onOpen, hint }: { visible: PortadaProject[]; onOpen: (id: string) => void; hint: string }) {
  return (
    <div className="pb-2 pt-1">
      <p className="mb-4 px-5 md:px-8 text-[11px] uppercase tracking-[0.08em] opacity-60">{hint}</p>
      <div className="grid grid-cols-2 gap-px bg-white">
        {visible.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.id)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * Math.min(i, 6), duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative flex aspect-[3/4.2] min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#f4f4f4] p-3 text-left transition-colors duration-300 active:bg-black active:text-white`}
          >
            <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-black text-[12px] text-white group-active:bg-white group-active:text-black">→</span>
            <span className="text-[clamp(70px,22vw,120px)] -mt-8 leading-none" style={{ fontFamily: "'Antonio', sans-serif", fontWeight: 200 }}>
              {i + 1}
            </span>
            <span className="absolute inset-x-3 bottom-3 block min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.08em] opacity-70">{p.year}</span>
              <span className="mt-1 block truncate text-[17px] font-medium leading-[1] tracking-[-0.03em]">{p.title}</span>
              <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.08em] opacity-70">{p.subtitle}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Cover({ project, big = false, plain = false, thumb = false }: { project: PortadaProject; big?: boolean; plain?: boolean; thumb?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: project.brand ? project.brand.coverBg ?? darkest(project.brand) : project.base }}>
      {project.brand && !project.image ? (
        // Portada de un proyecto de identidad: el logo sobre su color de marca.
        <div className="absolute inset-0 flex items-center justify-center">
          {project.brand.logoOnColor ? (
            <img src={assetUrl(project.brand.logoOnColor)} alt="" className="max-h-[36%] max-w-[60%] object-contain" />
          ) : (
            <Wordmark
              brand={project.brand}
              color={project.brand.colors[0]?.hex ?? '#fff'}
              size={big ? '52px' : '34px'}
            />
          )}
        </div>
      ) : project.image ? (
        <img
          src={assetUrl(project.image)}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={thumb ? { objectPosition: project.id === 'sgi' ? '72% 40%' : project.id === 'creacion-digital' ? '25% 40%' : project.id === 'experimentos-ia' ? '50% 48%' : '50% 30%' } : { ...(project.id === 'mainatek' ? { transform: 'translateY(15px) scale(1.5)', transformOrigin: '70% 30%' } : project.id === 'sgi' ? { transform: 'translateY(-15px) scale(1.06)' } : null), objectPosition: project.id === 'sgi' ? '100% 0%' : project.id === 'mainatek' ? '70% 0%' : project.id === 'creacion-digital' ? 'calc(0% - 155px) 0%' : '50% 0%' } }
          draggable={false}
        />
      ) : (
        <>
          <div
            className="absolute -right-10 -top-16 h-[60%] w-[60%] rounded-full opacity-40 blur-3xl"
            style={{ background: project.glow }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -bottom-[0.28em] -right-[0.05em] select-none font-serif italic text-white"
            style={{ fontSize: big ? '9em' : '5.4em', lineHeight: 1, opacity: 0.14 }}
            aria-hidden
          >
            {project.monogram}
          </span>
        </>
      )}
      {!plain && (<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent px-3.5 pb-3 pt-10">
        <p className={`truncate font-semibold text-white ${big ? 'text-[19px]' : 'text-[14px]'}`}>{project.title}</p>
        <p className={`truncate text-white/70 ${big ? 'text-[12.5px]' : 'text-[10.5px]'}`}>{project.subtitle}</p>
      </div>)}
      {!plain && project.year && (
        <span className="absolute bottom-3 right-3.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/80 backdrop-blur-sm">
          {project.year}
        </span>
      )}
    </div>
  )
}

// Imagen del detalle: captura completa dentro de un marco tipo Safari (si hay
// imagen) o tarjeta con degradado + monograma (placeholders). Sin texto encima.
function DetailMedia({ project }: { project: PortadaProject }) {
  const t = useUI()
  const isMobile = useIsMobile()
  if (isMobile && project.previewMobile) {
    return <MobilePreviewFrame src={assetUrl(project.previewMobile)} alt={t.gallery.previewAlt(project.title)} domain={project.tagTop} />
  }
  if (project.gallery?.length) {
    return <ImageViewer images={project.gallery} title={project.title} />
  }
  if (!project.image) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl shadow-lg lg:aspect-auto lg:h-full" style={{ background: project.base }}>
        <div
          className="absolute -right-10 -top-16 h-[60%] w-[60%] rounded-full opacity-40 blur-3xl"
          style={{ background: project.glow }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -bottom-[0.28em] -right-[0.05em] select-none font-serif italic text-white"
          style={{ fontSize: '11em', lineHeight: 1, opacity: 0.14 }}
          aria-hidden
        >
          {project.monogram}
        </span>
      </div>
    )
  }
  return (
    <div className={`overflow-hidden border border-black/10 bg-white ${project.preview ? 'flex flex-col lg:h-full' : ''}`}>
      {project.preview ? (
        <ScrollPreview src={assetUrl(project.preview)} alt={t.gallery.previewAlt(project.title)} />
      ) : (
        <img src={assetUrl(project.image)} alt={project.title} className="block h-auto w-full" draggable={false} />
      )}
    </div>
  )
}

// Visor de imágenes fijas: ocupa el alto disponible (en pantallas anchas) y no tiene scroll;
// se pasa de una imagen a otra con las flechas, los puntos o el teclado.
function ImageViewer({ images, title }: { images: string[]; title: string }) {
  const { lang } = useLang()
  const [i, setI] = useState(0)
  const n = images.length
  const go = (d: number) => setI((cur) => (cur + d + n) % n)
  const prevLabel = lang === 'en' ? 'Previous image' : 'Imagen anterior'
  const nextLabel = lang === 'en' ? 'Next image' : 'Imagen siguiente'
  const arrow = 'absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/85 text-ink/70 shadow-md backdrop-blur transition hover:bg-white'
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-ink/10 bg-[#f4f1f3] shadow-lg outline-none lg:aspect-auto lg:h-full"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        if (e.key === 'ArrowRight') go(1)
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={i}
          src={assetUrl(images[i])}
          alt={`${title} ${i + 1}/${n}`}
          className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          draggable={false}
        />
      </AnimatePresence>
      {n > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label={prevLabel} className={`${arrow} left-3`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" onClick={() => go(1)} aria-label={nextLabel} className={`${arrow} right-3`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 shadow-sm backdrop-blur">
            {images.map((_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => setI(k)}
                aria-label={`${k + 1}/${n}`}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${k === i ? 'w-4 bg-black' : 'w-1.5 bg-ink/25 hover:bg-ink/45'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Celular: la versión mobile del sitio en el mismo marco tipo Safari, pero más vertical.
function MobilePreviewFrame({ src, alt }: { src: string; alt: string; domain?: string }) {
  const t = useUI()
  const [scrolled, setScrolled] = useState(false)
  return (
    <div className="overflow-hidden border border-black/10 bg-white">
      <div className="relative" style={{ aspectRatio: '4 / 5' }}>
        <div
          className="preview-scroll absolute inset-0 overflow-y-auto overscroll-contain"
          onScroll={(e) => {
            if (!scrolled && e.currentTarget.scrollTop > 24) setScrolled(true)
          }}
        >
          <img src={src} alt={alt} className="block h-auto w-full" draggable={false} loading="lazy" />
        </div>
        <AnimatePresence>
          {!scrolled && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/55 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-md"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
              {t.gallery.swipe}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Vista navegable: la captura completa del inicio dentro de un "viewport" con
// scroll propio. Una píldora invita a deslizar y desaparece al empezar a hacerlo.
function ScrollPreview({ src, alt }: { src: string; alt: string }) {
  const t = useUI()
  const [scrolled, setScrolled] = useState(false)
  return (
    // En pantallas anchas el viewport se estira hasta el final de la columna de
    // información (queda alineado abajo con el botón "Visitar sitio").
    <div className="relative lg:min-h-[360px] lg:flex-1">
      <div
        className="preview-scroll aspect-[16/10] w-full overflow-y-auto overscroll-contain lg:absolute lg:inset-0 lg:aspect-auto"
        onScroll={(e) => {
          if (!scrolled && e.currentTarget.scrollTop > 24) setScrolled(true)
        }}
      >
        <img src={src} alt={alt} className="block h-auto w-full" draggable={false} loading="lazy" />
      </div>
      <AnimatePresence>
        {!scrolled && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-md"
          >
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
            {t.gallery.swipe}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

// Minúsculas y sin tildes, para que "creacion" encuentre "Creación".
function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function PortadasGallery({
  projects: rawProjects,
  heading,
  subheading,
  openId: openIdProp = null,
  openToken = 0,
  onOpenChange,
}: {
  projects: PortadaProject[]
  heading: string
  subheading: string
  openId?: string | null
  openToken?: number
  onOpenChange?: (id: string | null) => void
}) {
  const { lang } = useLang()
  const t = useUI()
  const backToCards = useContext(BackToCardsContext)
  const projects = rawProjects.map((p) => localizeProject(p, lang))
  const [openId, setOpenId] = useState<string | null>(openIdProp)
  // Celular: el detalle entra como una pantalla encima de la lista (estilo iOS) y el
  // "atrás" (gesto del borde o flecha) vuelve a la lista de proyectos.
  const isMobile = useIsMobile()
  function openProject(id: string) {
    if (isMobile) window.history.pushState({ mobile: 'detail' }, '')
    setOpenId(id)
  }
  function closeProject() {
    if (isMobile) window.history.back() // popstate → pushBack handler → setOpenId(null)
    else setOpenId(null)
  }
  useEffect(() => {
    if (!isMobile || !openId) return
    return pushBack(() => setOpenId(null))
  }, [isMobile, openId])
  // Buscador de la grilla: filtra por título, categoría, tipo, año o dominio
  // (sin importar mayúsculas ni tildes).
  const [query] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const q = normalize(query.trim())
  const visible = q
    ? projects.filter((p) => normalize([p.title, p.subtitle, p.year, p.tagTop].join(' ')).includes(q))
    : projects
  const open = projects.find((p) => p.id === openId) ?? null
  // "Diseño UX/UI · Rediseño web" → categoría: "Diseño UX/UI", tipo: "Rediseño web".
  const parts = open ? open.subtitle.split('·').map((t) => t.trim()) : []
  const category = parts[0] ?? ''
  const kind = parts.length > 1 ? parts.slice(1).join(' · ') : category

  // Avisa a la barra lateral qué proyecto está abierto (null = grilla de portadas).
  useEffect(() => {
    onOpenChange?.(openId)
    // Al abrir (o cerrar) un proyecto, la ventana vuelve arriba del todo.
    let el: HTMLElement | null = rootRef.current
    while (el) {
      const oy = getComputedStyle(el).overflowY
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
        el.scrollTo({ top: 0 })
        break
      }
      el = el.parentElement
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId])

  // Acceso directo desde el dropdown de la barra lateral (o volver a la grilla si openIdProp es null).
  useEffect(() => {
    // Celular: el detalle abierto por salto directo también agrega su paso al historial (para que "atrás" lo cierre).
    if (isMobile && openIdProp && openIdProp !== openId) window.history.pushState({ mobile: 'detail' }, '')
    setOpenId(openIdProp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openToken])

  const detailBody = open?.brand ? (
    <BrandDetail project={open} category={category} kind={kind} />
  ) : open?.showroom ? (
    <ShowroomDetail project={open} category={category} kind={kind} />
  ) : open?.photos?.length ? (
    <PhotosDetail project={open} category={category} kind={kind} />
  ) : open ? (
            <div className={`grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] lg:gap-10`}>
              {/* Columna izquierda: imagen */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`min-w-0 ${open.preview ? 'lg:self-stretch' : 'self-start'} ${open.gallery?.length ? 'lg:h-[calc(100vh-10rem)]' : !open.image && !open.preview ? 'lg:h-[calc(100vh-15rem)]' : ''}`}
              >
                <div className={`relative ${open.preview || !open.image || open.gallery?.length ? 'lg:h-full' : ''}`}>
                  <DetailMedia project={open} />
                </div>
              </motion.div>

              {/* Columna derecha: información (fija al hacer scroll) */}
              <motion.aside
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`self-start ${open.gallery?.length ? 'lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-4' : ''}`}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">{category}</p>
                <h2 className="mt-2 text-[clamp(36px,4.4vw,72px)] font-medium uppercase leading-[0.9] tracking-[-0.04em] text-black">{open.title}</h2>

                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 max-[399px]:flex-col text-[12px] uppercase tracking-[0.06em]">
                  {open.year && (
                    <div className="flex flex-col gap-1">
                      <dt className="opacity-50">{t.gallery.year}</dt>
                      <dd className="text-black">{open.year}</dd>
                    </div>
                  )}
                  {!open.hideType && (
                    <div className="flex flex-col gap-1">
                      <dt className="opacity-50">{t.gallery.type}</dt>
                      <dd className="text-black">{kind}</dd>
                    </div>
                  )}
                  {open.url && (
                    <div className="flex flex-col gap-1">
                      <dt className="opacity-50">{t.gallery.site}</dt>
                      <dd className="min-w-0">
                        <a
                          href={open.url}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer inline-flex max-w-full items-center gap-1 truncate text-black underline underline-offset-4"
                        >
                          <span className="truncate">{open.tagTop}</span>
                          <span aria-hidden>↗</span>
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
                {open.caseStudy && (isMobile ? <CaseFacts cs={open.caseStudy} /> : <CaseWidgets cs={open.caseStudy} />)}

                <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.08em] opacity-50">{t.gallery.process}</p>
                <div className="mt-2 space-y-3">
                  {open.process.length > 0 ? (
                    open.process.map((p, i) => (
                      <p key={i} className="text-[15.5px] leading-[1.4] text-black">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-[14.5px] italic leading-relaxed text-ink/40">{t.gallery.comingSoon}</p>
                  )}
                </div>

                {open.url && (
                  <a
                    href={open.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 border-[3px] border-black bg-black px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-500 hover:bg-white hover:text-black"
                  >
                    {t.gallery.visit}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </a>
                )}
              </motion.aside>
            </div>
  ) : null
  const detailWithCase = detailBody

  return (
    <div ref={rootRef} className="w-full">
      <AnimatePresence mode="wait">
        {open && !isMobile ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 pb-4 pt-5 md:px-8"
          >
            <div className="sticky top-0 z-30 -mx-5 mb-3 bg-white px-5 pb-3 pt-5 md:-mx-8 md:px-8 -mt-5">
              <button
                type="button"
                onClick={backToCards ?? closeProject}
                className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-black transition hover:underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.gallery.allProjects}
              </button>
            </div>

            {detailWithCase}
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col gap-4 px-5 pb-6 pt-6 md:flex-row md:items-end md:justify-between md:px-8">
              <div>
                <h2 className="text-[clamp(34px,6vw,96px)] font-medium uppercase leading-[0.88] tracking-[-0.04em]">{heading}</h2>
                              </div>
            </div>
            {visible.length === 0 && <p className="px-5 py-16 text-[12px] uppercase tracking-[0.08em] opacity-60 md:px-8">{t.gallery.noResults(query.trim())}</p>}
            <ProjectIndex visible={visible} onOpen={openProject} hint={subheading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celular: detalle del proyecto como pantalla encima de la lista */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            key={`m-detail-${open.id}`}
            className="fixed inset-x-0 bottom-0 top-14 z-[5]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <SwipeBack onBack={gestureBack} className="absolute inset-0 flex flex-col bg-white">
              <div className="flex h-11 shrink-0 items-center border-b border-black/5 px-1">
                <button
                  type="button"
                  onClick={backToCards ?? closeProject}
                  className="flex h-11 cursor-pointer items-center gap-0.5 px-2 text-[17px] text-black active:opacity-50"
                >
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M10 2 2 10l8 8" />
                  </svg>
                  {t.gallery.allProjects}
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-10 pt-4">{detailWithCase}</div>
            </SwipeBack>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
