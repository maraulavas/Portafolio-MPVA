import type { ProjectArea, ProjectAreaId } from '../data/content'
import { asset } from '../data/assets'
import { useUI } from '../i18n/LanguageContext'

// Cada "versión" de Maria Paula = un archivo en ../assets (foto de cuerpo entero
// sosteniendo su objeto). Nombres: uxui.png, di.png, dg.png, otros.png
const images: Record<ProjectAreaId, string | undefined> = {
  uxui: asset('uxui'),
  grafico: asset('dg'),
  industrial: asset('di'),
  otros: asset('otros'),
}

interface VersionCardProps {
  area: ProjectArea
  onOpen: () => void
  onHoverChange: (label: string | null) => void
}

// Una figura dentro del espacio compartido. El fondo claro de la foto se funde
// con el panel (#f1edef) usando mix-blend-multiply. Al pasar el mouse, el cursor
// se convierte en una burbuja con el nombre (ver CursorLabel).
export default function VersionCard({ area, onOpen, onHoverChange }: VersionCardProps) {
  const t = useUI()
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => onHoverChange(area.name)}
      onMouseLeave={() => onHoverChange(null)}
      className="group relative -mx-[1vw] shrink-0 cursor-none outline-none"
      aria-label={t.desktop.seeProjectsOf(area.name)}
    >
      <img
        src={images[area.id]}
        alt={`Maria Paula — ${area.name}`}
        loading="lazy"
        className="block w-[23vw] max-w-[440px] max-h-[80vh] object-contain object-bottom mix-blend-multiply transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
      />
    </button>
  )
}
