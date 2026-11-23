// Barra de inicio de iOS. Si recibe onHome, tocarla o deslizarla hacia arriba ejecuta esa acción
// (en las apps: volver al inicio; en el inicio: abrir el menú inferior).
import { useUI } from '../i18n/LanguageContext'

export default function HomeIndicator({ onHome, label, light = false }: { onHome?: () => void; label?: string; light?: boolean }) {
  const t = useUI()
  const bar = <span className={`block h-[5px] w-[134px] rounded-full ${light ? 'bg-white/90 shadow-[0_1px_6px_rgba(14,70,170,0.35)]' : 'bg-ink/80'}`} />
  if (!onHome) {
    return (
      <div className="flex h-[34px] shrink-0 items-center justify-center" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-hidden>
        {bar}
      </div>
    )
  }
  let startY = 0
  return (
    <button
      type="button"
      onClick={onHome}
      onTouchStart={(e) => (startY = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        if (startY - e.changedTouches[0].clientY > 30) onHome()
      }}
      aria-label={label ?? t.mobile.goHome}
      className="flex h-[34px] w-full shrink-0 cursor-pointer items-center justify-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {bar}
    </button>
  )
}
