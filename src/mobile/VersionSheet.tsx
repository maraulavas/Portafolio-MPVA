import { AnimatePresence, motion } from 'framer-motion'
import type { ProjectArea } from '../data/content'
import { skillsFor } from '../components/Dock'
import { useUI } from '../i18n/LanguageContext'

// Hoja inferior de iOS con el detalle de una versión: título, descripción,
// herramientas y botón "Ver proyectos". Se cierra deslizando hacia abajo o tocando fuera.
export default function VersionSheet({
  area,
  onClose,
  onSeeProjects,
}: {
  area: ProjectArea | null
  onClose: () => void
  onSeeProjects: () => void
}) {
  const t = useUI()
  return (
    <AnimatePresence>
      {area && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[80] cursor-pointer bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={area.title}
            className="fixed inset-x-0 bottom-0 z-[90] rounded-t-[28px] bg-white px-6 pt-2.5 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.35)]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose()
            }}
          >
            <div className="mx-auto mb-4 h-[5px] w-10 rounded-full bg-ink/15" aria-hidden />
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blush-500">{t.desktop.eyebrow}</p>
            <h2 className="mt-1 font-serif text-[30px] italic leading-tight text-ink">{area.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{area.description}</p>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/35">{t.mobile.tools}</p>
            <div className="mt-2.5 flex flex-wrap gap-3">
              {skillsFor(area.id).map((s) => (
                <div key={s.name} className="flex w-[60px] flex-col items-center gap-1">
                  {s.icon}
                  <span className="w-full truncate text-center text-[10.5px] text-ink/55">{s.name}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onSeeProjects}
              className="mt-6 flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blush-500 text-[16px] font-semibold text-white shadow-md transition active:scale-[0.98] active:bg-blush-600"
            >
              {t.desktop.seeProjects}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
