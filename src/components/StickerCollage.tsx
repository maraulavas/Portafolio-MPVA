import { motion } from 'framer-motion'
import type { Project } from '../data/content'

// Collage de stickers estilo scrapbook (ref: tablero de "SKILLS").
// Cada proyecto se vuelve un sticker grande; sus tags, stickers pequeños.
// Formas troqueladas (borde blanco), colores vivos, rotaciones y pop-in.

type Variant = 'tag' | 'pill' | 'seal' | 'note'

interface StickerSpec {
  key: string
  text: string
  size: 'lg' | 'sm'
  variant: Variant
  bg: string
  fg: string
  rot: number
  dy: number
  projectId?: string
}

const palette: { bg: string; fg: string }[] = [
  { bg: '#e01f76', fg: '#ffffff' },
  { bg: '#3f8ce8', fg: '#ffffff' },
  { bg: '#8b5cf6', fg: '#ffffff' },
  { bg: '#f59e0b', fg: '#1b1420' },
  { bg: '#10b981', fg: '#ffffff' },
  { bg: '#fbbf24', fg: '#1b1420' },
  { bg: '#ec4899', fg: '#ffffff' },
  { bg: '#f97316', fg: '#ffffff' },
]

const variants: Variant[] = ['tag', 'seal', 'pill', 'note']
const rots = [-9, 7, -5, 10, -12, 4, 8, -3, 11, -7, 6, -10]
const dys = [0, 14, -10, 8, 18, -6, 12, -14, 6, 16, -8, 10]

function buildStickers(projects: Project[], accent: string): StickerSpec[] {
  const out: StickerSpec[] = []
  let i = 0
  projects.forEach((p, pi) => {
    // Sticker grande = proyecto
    out.push({
      key: p.id,
      text: p.title,
      size: 'lg',
      variant: variants[pi % variants.length],
      bg: pi === 0 ? accent : palette[i % palette.length].bg,
      fg: pi === 0 ? '#ffffff' : palette[i % palette.length].fg,
      rot: rots[i % rots.length],
      dy: dys[i % dys.length],
      projectId: p.id,
    })
    i++
    // Stickers pequeños = tags
    p.tags.forEach((t) => {
      const c = palette[i % palette.length]
      out.push({
        key: `${p.id}-${t}`,
        text: t,
        size: 'sm',
        variant: variants[i % variants.length],
        bg: c.bg,
        fg: c.fg,
        rot: rots[i % rots.length],
        dy: dys[i % dys.length],
      })
      i++
    })
  })
  return out
}

function shapeStyle(variant: Variant, size: 'lg' | 'sm') {
  const lg = size === 'lg'
  switch (variant) {
    case 'pill':
      return { borderRadius: 999, padding: lg ? '10px 22px' : '6px 14px' }
    case 'seal':
      return { borderRadius: 999, padding: lg ? '20px 22px' : '12px 14px' }
    case 'note':
      return { borderRadius: 6, padding: lg ? '12px 20px' : '7px 13px' }
    case 'tag':
    default:
      return { borderRadius: 14, padding: lg ? '11px 20px' : '6px 14px' }
  }
}

export default function StickerCollage({
  projects,
  accent,
  onPick,
}: {
  projects: Project[]
  accent: string
  onPick?: (projectId: string) => void
}) {
  const stickers = buildStickers(projects, accent)

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 py-6">
      {stickers.map((s, i) => (
        <motion.button
          type="button"
          key={s.key}
          onClick={() => s.projectId && onPick?.(s.projectId)}
          initial={{ scale: 0, rotate: s.rot * 1.6, opacity: 0 }}
          animate={{ scale: 1, rotate: s.rot, opacity: 1, y: s.dy }}
          transition={{ delay: 0.05 * i, type: 'spring', stiffness: 320, damping: 18 }}
          whileHover={{ scale: 1.12, rotate: 0, y: s.dy, zIndex: 30 }}
          whileTap={{ scale: 0.96 }}
          className={`relative m-[-2px] inline-flex select-none items-center justify-center border-[3px] border-white font-extrabold uppercase leading-none tracking-wide shadow-[0_5px_12px_rgba(0,0,0,0.14)] ${
            s.projectId ? 'cursor-pointer' : 'cursor-default'
          } ${s.size === 'lg' ? 'text-[15px]' : 'text-[11px]'}`}
          style={{ background: s.bg, color: s.fg, ...shapeStyle(s.variant, s.size) }}
        >
          {/* Aro punteado para el sello */}
          {s.variant === 'seal' && (
            <span
              className="pointer-events-none absolute inset-[3px] rounded-full border-2 border-dashed"
              style={{ borderColor: s.fg, opacity: 0.5 }}
            />
          )}
          {/* Perforación tipo etiqueta */}
          {s.variant === 'tag' && (
            <span className="pointer-events-none absolute left-[6px] top-[6px] h-[6px] w-[6px] rounded-full border border-black/15 bg-white/80" />
          )}
          <span className="max-w-[180px] text-center">{s.text}</span>
        </motion.button>
      ))}
    </div>
  )
}
