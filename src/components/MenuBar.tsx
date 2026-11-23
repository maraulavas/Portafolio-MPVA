import { useLang, useUI } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/LanguageContext'
import type { WindowId } from '../data/content'

function HouseMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.3 3.4 3 10.5c-.3.26-.5.64-.5 1.05V20a1 1 0 0 0 1 1h5.2v-5.6h4.6V21H18.5a1 1 0 0 0 1-1v-8.45c0-.41-.2-.79-.5-1.05L12.7 3.4a1.1 1.1 0 0 0-1.4 0Z" />
    </svg>
  )
}

const links: WindowId[] = ['about', 'documents', 'contact']

// Selector de idioma estilo macOS: píldora segmentada ES | EN.
export function LangSwitch({ size = 'sm', light = false }: { size?: 'sm' | 'lg'; light?: boolean }) {
  const { lang, setLang } = useLang()
  const t = useUI()
  const options: Lang[] = ['es', 'en']
  return (
    <div role="group" aria-label={t.menu.language} className="flex items-center rounded-full p-[2px]">
      {options.map((l) => {
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            lang={l}
            title={l === 'es' ? 'Español' : 'English'}
            className={`cursor-pointer rounded-full font-semibold uppercase tracking-wide transition ${
              size === 'lg' ? 'min-h-[36px] min-w-[44px] px-3 text-[13px]' : 'px-2 py-[1px] text-[11px] leading-[18px]'
            } ${
              active ? 'bg-white text-ink shadow-sm' : light ? 'text-white/70 hover:text-white' : 'text-ink/45 hover:text-ink/75'
            }`}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}

export default function MenuBar({ onHome, onOpen, solid = false }: { onHome?: () => void; onOpen?: (id: string) => void; solid?: boolean }) {
  const t = useUI()

  return (
    <div className={`pointer-events-auto absolute inset-x-0 top-0 z-[9000] flex h-7 items-center justify-between px-3 text-[13px] font-medium ${solid ? 'text-ink/85' : 'text-white [text-shadow:0_1px_8px_rgba(14,70,170,0.35)]'} backdrop-blur-xl ${solid ? 'bg-white border-black/5' : 'bg-white/35 border-white/40'} border-b no-select`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onHome}
          aria-label={t.menu.home}
          title={t.menu.home}
          className="flex cursor-pointer items-center text-current transition-transform hover:scale-110 active:scale-95"
        >
          <HouseMark />
        </button>
        <span className="font-semibold">{t.menu.portfolio}</span>
        <div className="hidden items-center gap-4 sm:flex">
          {links.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onOpen?.(id)}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            >
              {t.windows[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LangSwitch light={!solid} />
      </div>
    </div>
  )
}
