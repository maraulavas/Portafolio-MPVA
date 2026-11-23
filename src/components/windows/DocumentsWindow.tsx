import { useContent } from '../../i18n/useContent'
import { useUI } from '../../i18n/LanguageContext'

function PdfGlyph({ size = 1 }: { size?: number }) {
  return (
    <svg width={36 * size} height={44 * size} viewBox="0 0 36 44" fill="none" aria-hidden className="shrink-0">
      <path
        d="M4 4a3 3 0 0 1 3-3h16l9 9v27a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4z"
        fill="#fff"
        stroke="#e4d7ea"
        strokeWidth="1.4"
      />
      <path d="M23 1v6a3 3 0 0 0 3 3h6" fill="#f2ecf5" />
      <rect x="8" y="24" width="20" height="12" rx="2.5" fill="#f83f92" />
      <text x="18" y="33" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">
        PDF
      </text>
    </svg>
  )
}

// `compact` (celular): dos tarjetas lado a lado.
export default function DocumentsWindow({ compact = false }: { compact?: boolean } = {}) {
  const { documents } = useContent()
  const t = useUI()
  if (compact) {
    return (
      <div className="px-4 pb-8 pt-5">
        <p className="mb-4 px-1 text-[15px] text-ink/60">{t.documents.intro}</p>
        <div className="grid grid-cols-2 gap-3">
          {documents.map((d) => (
            <a
              key={d.id}
              href={d.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => d.href === '#' && e.preventDefault()}
              className="flex cursor-pointer flex-col items-center rounded-2xl border border-black/5 bg-[#faf7f9] px-3 pb-4 pt-6 text-center active:bg-blush-50"
            >
              <PdfGlyph size={1.6} />
              <p className="mt-3 text-[15px] font-semibold leading-tight text-ink">{d.label}</p>
              <p className="mt-1 text-[11.5px] text-ink/45">{d.sizeHint}</p>
              <span className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-blush-500 text-[13.5px] font-semibold text-white shadow-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.documents.download}
              </span>
            </a>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="p-5">
      <p className="mb-4 px-1 text-[14px] text-ink/60">{t.documents.intro}</p>
      <ul className="space-y-2.5">
        {documents.map((d) => (
          <li key={d.id}>
            <a
              href={d.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => d.href === '#' && e.preventDefault()}
              className="cursor-pointer group flex items-center gap-3.5 rounded-xl border border-black/5 bg-[#faf7f9] p-3 transition-colors hover:border-blush-200 hover:bg-blush-50"
            >
              <PdfGlyph />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-ink">{d.label}</p>
                <p className="truncate text-[12px] text-ink/50">
                  {d.filename} · {d.sizeHint}
                </p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blush-500 text-white shadow-sm transition group-hover:scale-105">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
