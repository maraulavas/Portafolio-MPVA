import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { dgAsset } from '../../data/assets'

// Diseño Gráfico: navegación estilo iPadOS dentro del marco del iPad (ipad.png).
// El interior del PNG es transparente: se renderiza la UI detrás y el marco encima.

// Área de pantalla dentro del marco (medida sobre el PNG 1000×1000).
const SCREEN = { left: 10.4, top: 23.3, w: 77.7, h: 58.1 }

interface Project {
  id: string
  name: string
  cover: string
  desc: string
  tags: string[]
  gallery: string[]
}

// Placeholders (se reemplazan por imágenes reales luego).
const PROJECTS: Project[] = [
  { id: 'g1', name: 'Identidad de marca', cover: 'linear-gradient(140deg,#fbcfe8,#ec4899)', desc: 'Logo, paleta y sistema de aplicaciones de marca.', tags: ['Branding', 'Logo'], gallery: ['#fbcfe8', '#f9a8d4', '#ec4899', '#be185d'] },
  { id: 'g2', name: 'Pieza editorial', cover: 'linear-gradient(140deg,#fde68a,#fb923c)', desc: 'Composición tipográfica y maquetación editorial.', tags: ['Editorial', 'Tipografía'], gallery: ['#fde68a', '#fbbf24', '#fb923c', '#ea580c'] },
  { id: 'g3', name: 'Póster tipográfico', cover: 'linear-gradient(140deg,#bae6fd,#2563eb)', desc: 'Cartel con jerarquía tipográfica y color.', tags: ['Póster', 'Tipografía'], gallery: ['#bae6fd', '#60a5fa', '#2563eb', '#1e3a8a'] },
  { id: 'g4', name: 'Ilustración digital', cover: 'linear-gradient(140deg,#ddd6fe,#7c3aed)', desc: 'Ilustración vectorial y digital para campañas.', tags: ['Ilustración', 'Vector'], gallery: ['#ddd6fe', '#a78bfa', '#7c3aed', '#5b21b6'] },
  { id: 'g5', name: 'Feed de redes', cover: 'linear-gradient(140deg,#bbf7d0,#059669)', desc: 'Plantillas y piezas para redes sociales.', tags: ['Social', 'Plantillas'], gallery: ['#bbf7d0', '#4ade80', '#059669', '#065f46'] },
  { id: 'g6', name: 'Packaging gráfico', cover: 'linear-gradient(140deg,#fecdd3,#e11d48)', desc: 'Gráfica y estructura para empaque.', tags: ['Packaging', 'Print'], gallery: ['#fecdd3', '#fb7185', '#e11d48', '#9f1239'] },
]

// Lista liviana para el dropdown de acceso rápido en la barra lateral.
export const IPAD_PROJECT_LIST = PROJECTS.map((p) => ({ id: p.id, title: p.name }))

function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? '#ffffff' : '#1b1420'
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2.6cqw 6cqw 0',
        color: c,
        fontSize: '3.4cqw',
        fontWeight: 600,
      }}
    >
      <span>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '2.2cqw' }}>
        {/* señal */}
        <svg viewBox="0 0 24 24" style={{ width: '4cqw', height: '4cqw' }} fill={c} aria-hidden>
          <rect x="1" y="14" width="4" height="7" rx="1" />
          <rect x="7" y="10" width="4" height="11" rx="1" />
          <rect x="13" y="6" width="4" height="15" rx="1" />
          <rect x="19" y="2" width="4" height="19" rx="1" opacity="0.35" />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 24 20" style={{ width: '4.4cqw', height: '3.6cqw' }} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M2 6c6-5 14-5 20 0M5 10c4-3.2 10-3.2 14 0M8.5 14c2-1.6 5-1.6 7 0" />
          <circle cx="12" cy="17.5" r="1.2" fill={c} stroke="none" />
        </svg>
        {/* batería */}
        <svg viewBox="0 0 28 14" style={{ width: '6cqw', height: '3cqw' }} fill="none" aria-hidden>
          <rect x="1" y="1" width="22" height="12" rx="3.2" stroke={c} strokeWidth="1.4" />
          <rect x="2.6" y="2.6" width="16" height="8.8" rx="2" fill={c} />
          <rect x="24.4" y="4.6" width="1.8" height="4.8" rx="1" fill={c} />
        </svg>
      </span>
    </div>
  )
}

export default function IpadView({
  openId: openIdProp = null,
  openToken = 0,
}: {
  openId?: string | null
  openToken?: number
}) {
  const frame = dgAsset('ipad.png')
  const screenRef = useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = useState<string | null>(openIdProp)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const open = PROJECTS.find((p) => p.id === openId) ?? null

  function handleOpen(id: string, e: ReactMouseEvent) {
    const screen = screenRef.current
    if (screen) {
      const sr = screen.getBoundingClientRect()
      const ir = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setOrigin({
        x: ((ir.left + ir.width / 2 - sr.left) / sr.width) * 100,
        y: ((ir.top + ir.height / 2 - sr.top) / sr.height) * 100,
      })
    }
    setOpenId(id)
  }

  // Acceso directo desde el dropdown de la barra lateral (o volver a la grilla si openIdProp es null).
  useEffect(() => {
    setOrigin({ x: 50, y: 50 })
    setOpenId(openIdProp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openToken])

  return (
    <div className="flex justify-center px-2 pb-3 pt-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="relative"
        style={{ width: 'min(1180px, 95vw, calc(88vh * 1.278))', aspectRatio: '1.278 / 1', overflow: 'hidden' }}
      >
        {/* El PNG es cuadrado con márgenes transparentes; lo escalamos y recortamos
            para que el iPad (y el Pencil) llenen el marco y se vea más grande. */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '108.7%', aspectRatio: '1 / 1', transform: 'translate(-4%, -14%)' }}>
          {/* Pantalla (UI) detrás del marco */}
          <div
            ref={screenRef}
          style={
            {
              position: 'absolute',
              left: `${SCREEN.left}%`,
              top: `${SCREEN.top}%`,
              width: `${SCREEN.w}%`,
              height: `${SCREEN.h}%`,
              overflow: 'hidden',
              borderRadius: '2cqw',
              containerType: 'inline-size',
              background: 'linear-gradient(160deg,#ffe9f2 0%,#f3ecfb 55%,#e9f0fb 100%)',
            } as CSSProperties
          }
        >
          {/* ---------- HOME ---------- */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            <StatusBar />
            <div style={{ flex: 1, padding: '6cqw 6cqw 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5cqw 5cqw' }}>
                {PROJECTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={(e) => handleOpen(p.id, e)}
                    style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '3.8cqw',
                        background: p.cover,
                        boxShadow: '0 1.2cqw 2.4cqw rgba(30,20,50,0.16)',
                      }}
                    />
                    <div style={{ marginTop: '1.8cqw', fontSize: '2.9cqw', textAlign: 'center', color: '#2a2330', lineHeight: 1.1 }}>
                      {p.name}
                    </div>
                  </button>
                ))}
              </div>

              {/* Dock */}
              <div
                style={{
                  marginTop: 'auto',
                  marginBottom: '3.5cqw',
                  alignSelf: 'center',
                  display: 'flex',
                  gap: '4cqw',
                  padding: '2.6cqw 4cqw',
                  borderRadius: '6cqw',
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 1cqw 2.4cqw rgba(30,20,50,0.12)',
                }}
              >
                {PROJECTS.slice(0, 4).map((p) => (
                  <div key={p.id} style={{ width: '9cqw', aspectRatio: '1 / 1', borderRadius: '2.6cqw', background: p.cover }} />
                ))}
              </div>
            </div>
          </div>

          {/* ---------- PROYECTO (full-screen) ---------- */}
          <AnimatePresence>
            {open && (
              <motion.div
                key={open.id}
                initial={{ opacity: 0, scale: 0.16 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.16 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <StatusBar />
                {/* barra superior */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5cqw 5cqw' }}>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    aria-label="Volver"
                    style={{ display: 'grid', placeItems: 'center', width: '8cqw', aspectRatio: '1', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', color: '#1b1420' }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: '4.4cqw' }} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>
                  <div style={{ display: 'flex', gap: '3cqw', color: '#6b6572' }}>
                    <svg viewBox="0 0 24 24" style={{ width: '5cqw' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M8 7l4-4 4 4" />
                    </svg>
                    <svg viewBox="0 0 24 24" style={{ width: '5cqw' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 20.3 4.6 12.9a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5L12 20.3Z" />
                    </svg>
                  </div>
                </div>

                <div style={{ flex: 1, overflow: 'hidden', padding: '0 5cqw', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', height: '38cqw', borderRadius: '5cqw', background: open.cover, boxShadow: '0 1.6cqw 3cqw rgba(30,20,50,0.18)' }} />
                  <div style={{ marginTop: '3.5cqw', fontSize: '6cqw', fontWeight: 700, color: '#1b1420', lineHeight: 1 }}>{open.name}</div>
                  <div style={{ marginTop: '2cqw', display: 'flex', gap: '2cqw' }}>
                    {open.tags.map((t) => (
                      <span key={t} style={{ fontSize: '2.6cqw', padding: '1cqw 2.8cqw', borderRadius: '99px', background: 'rgba(0,0,0,0.05)', color: '#5f5a66' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: '2.6cqw', fontSize: '3.2cqw', lineHeight: 1.4, color: '#5f5a66', maxWidth: '70%' }}>{open.desc}</div>
                  {/* galería */}
                  <div style={{ marginTop: '3.2cqw', display: 'flex', gap: '3cqw', overflowX: 'auto', paddingBottom: '2cqw' }}>
                    {open.gallery.map((g, i) => (
                      <div key={i} style={{ flex: '0 0 auto', width: '24cqw', aspectRatio: '4 / 3', borderRadius: '3cqw', background: g }} />
                    ))}
                  </div>
                </div>

                {/* home indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2.4cqw' }}>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    aria-label="Ir al inicio"
                    style={{ width: '34%', height: '1.1cqw', borderRadius: '99px', background: 'rgba(0,0,0,0.35)', border: 'none', cursor: 'pointer' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          {/* Marco del iPad encima (no captura clics) */}
          {frame && (
            <img src={frame} alt="iPad Pro" className="absolute inset-0 h-full w-full" style={{ pointerEvents: 'none' }} draggable={false} />
          )}
        </div>
      </motion.div>
    </div>
  )
}
