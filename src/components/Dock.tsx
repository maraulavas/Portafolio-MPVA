import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { assetUrl } from '../data/assets'
import type { ProjectAreaId } from '../data/content'

// Íconos de las herramientas (skills) que se muestran en el dock.

function Tile({ children, bg, ring }: { children: ReactNode; bg: string; ring?: string }) {
  return (
    <span
      className="grid h-14 w-14 place-items-center rounded-2xl shadow-md"
      style={{ backgroundImage: bg, boxShadow: ring ? `inset 0 0 0 1.5px ${ring}` : undefined }}
    >
      {children}
    </span>
  )
}

// Ícono a partir de un logo en imagen (public/assets/dock). `full`: el logo ya
// trae su propio fondo de app y llena todo el tile; si no, va sobre fondo blanco.
function ImgTile({ file, alt, full = false }: { file: string; alt: string; full?: boolean }) {
  return (
    <span
      className={`grid h-14 w-14 place-items-center overflow-hidden rounded-2xl shadow-md ${full ? '' : 'bg-white'}`}
    >
      <img
        src={assetUrl(`dock/${file}`)}
        alt={alt}
        draggable={false}
        className={full ? 'h-full w-full object-cover' : 'h-[76%] w-[76%] object-contain'}
      />
    </span>
  )
}

function Mono({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[22px] font-bold tracking-tight" style={{ color }}>
      {label}
    </span>
  )
}

function ClaudeMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round">
      <path d="M12 2.5v19M4.2 6.2l15.6 11.6M19.8 6.2 4.2 17.8M2.5 12h19" />
    </svg>
  )
}

function FigmaMark() {
  return (
    <svg width="20" height="30" viewBox="0 0 38 57" aria-hidden>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  )
}

interface Skill {
  name: string
  icon: ReactNode
}

// Programas por versión (se muestran al elegir esa versión en el inicio).
const claude: Skill = { name: 'Claude', icon: <Tile bg="linear-gradient(160deg,#e08a67,#cc6b45)"><ClaudeMark /></Tile> }

const uxuiSkills: Skill[] = [
  claude,
  { name: 'Figma', icon: <Tile bg="linear-gradient(160deg,#2b2b2b,#171717)"><FigmaMark /></Tile> },
  { name: 'Adobe XD', icon: <ImgTile file="xd.png" alt="Adobe XD" full /> },
]

const industrialSkills: Skill[] = [
  { name: 'Rhinoceros', icon: <ImgTile file="rhino.png" alt="Rhinoceros" full /> },
  { name: 'KeyShot', icon: <ImgTile file="keyshot.png" alt="KeyShot" /> },
  { name: 'Fusion 360', icon: <ImgTile file="fusion.png" alt="Fusion 360" /> },
  { name: 'ZBrush', icon: <ImgTile file="zbrush.png" alt="ZBrush" /> },
]

const graficoSkills: Skill[] = [
  { name: 'Adobe Illustrator', icon: <Tile bg="linear-gradient(160deg,#2a1000,#120600)" ring="#ff9a0055"><Mono label="Ai" color="#ff9a00" /></Tile> },
  { name: 'Adobe Photoshop', icon: <Tile bg="linear-gradient(160deg,#00263f,#001019)" ring="#31a8ff55"><Mono label="Ps" color="#31a8ff" /></Tile> },
  { name: 'Canva', icon: <ImgTile file="canva.png" alt="Canva" full /> },
  { name: 'Affinity', icon: <ImgTile file="affinity.png" alt="Affinity" full /> },
]

const otrosSkills: Skill[] = [
  { name: 'Higgsfield', icon: <ImgTile file="higgsfield.png" alt="Higgsfield" full /> },
  { name: 'ChatGPT', icon: <ImgTile file="chatgpt.png" alt="ChatGPT" /> },
  { name: 'CapCut', icon: <ImgTile file="capcut.png" alt="CapCut" /> },
]

const SKILLS_BY_AREA: Record<ProjectAreaId, Skill[]> = {
  uxui: uxuiSkills,
  industrial: industrialSkills,
  grafico: graficoSkills,
  otros: otrosSkills,
}

// Ícono de un programa por nombre (para las fichas de los proyectos).
// Acepta variantes: "Photoshop" = "Adobe Photoshop", "Rhino" = "Rhinoceros".
// Programas que solo aparecen en las fichas (no en el dock del inicio).
const extraSkills: Skill[] = [{ name: 'Procreate', icon: <ImgTile file="procreate.png" alt="Procreate" full /> }]
const ALL_SKILLS: Skill[] = [...uxuiSkills, ...industrialSkills, ...graficoSkills, ...otrosSkills, ...extraSkills]
const norm = (x: string) => x.toLowerCase().replace(/^adobe\s+/, '').replace(/\s+/g, '')
export function skillIcon(name: string): ReactNode | null {
  const n = norm(name)
  const hit = ALL_SKILLS.find((s) => norm(s.name) === n || norm(s.name).startsWith(n) || n.startsWith(norm(s.name)))
  return hit ? hit.icon : null
}

export function skillsFor(area: ProjectAreaId | null) {
  return SKILLS_BY_AREA[area ?? 'uxui']
}

export default function Dock({ show = true, area = null }: { show?: boolean; area?: ProjectAreaId | null }) {
  const skills = skillsFor(area)
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[62px] z-[45] flex px-[6vw]">
      <div className="flex w-[46%] shrink-0 justify-center">
        <motion.div
        initial={{ y: 22, opacity: 0 }}
        animate={show ? { y: 0, opacity: 1 } : { y: 22, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-end gap-3 rounded-[26px] border border-white/50 bg-white/35 px-3 py-2.5 shadow-[0_20px_50px_-15px_rgba(30,20,50,0.4)] backdrop-blur-2xl"
      >
          {skills.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.04 * i, type: 'spring', stiffness: 380, damping: 22 }}
            className="group relative flex flex-col items-center hover:z-50"
          >
            <span className="pointer-events-none absolute -top-12 z-20 whitespace-nowrap rounded-lg bg-black/70 px-2.5 py-1 text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {s.name}
            </span>
            <motion.span
              whileHover={{ y: -8, scale: 1.18 }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              className="block cursor-default"
            >
              {s.icon}
            </motion.span>
          </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
