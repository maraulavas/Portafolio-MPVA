import { motion } from 'framer-motion'
import { useContent } from '../../i18n/useContent'
import type { SocialLink } from '../../data/content'
import { homeAsset } from '../../data/assets'

const photo = homeAsset('foto paula.jpeg')

function Icon({ id }: { id: SocialLink['id'] }) {
  if (id === 'linkedin')
    return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45z" />
      </svg>
    )
  if (id === 'behance')
    return (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.082 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
      </svg>
    )
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  )
}

const iconBg: Record<SocialLink['id'], string> = {
  linkedin: '#0a66c2',
  behance: '#1769ff',
  email: 'linear-gradient(150deg,#ff9ac6,#f83f92 70%,#e01f76)',
}

function Verified() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="#f83f92"
        d="M12 1.5l2.35 1.7 2.9-.2 1.2 2.64 2.64 1.2-.2 2.9L22.5 12l-1.7 2.35.2 2.9-2.64 1.2-1.2 2.64-2.9-.2L12 22.5l-2.35-1.7-2.9.2-1.2-2.64-2.64-1.2.2-2.9L1.5 12l1.7-2.35-.2-2.9 2.64-1.2 1.2-2.64 2.9.2z"
      />
      <path fill="#fff" d="m10.6 14.55-2.2-2.2-1.25 1.25 3.45 3.45 6.05-6.05-1.25-1.25z" />
    </svg>
  )
}

// `compact` (celular): todo en una columna — foto y datos arriba, enlaces abajo.
export default function ContactWindow({ compact = false }: { compact?: boolean } = {}) {
  const { contact } = useContent()
  if (compact) {
    return (
      <div className="flex flex-col px-5 pb-8 pt-5">
        <div
          className="w-full overflow-hidden rounded-[24px] shadow-sm"
          style={{
            height: 'min(36vh, 340px)',
            ...(photo
              ? { backgroundImage: `url("${photo}")`, backgroundSize: 'cover', backgroundPosition: 'center 22%' }
              : { background: 'linear-gradient(160deg,#ff9ac6,#f83f92 60%,#b8145d)' }),
          }}
        />
        <h2 className="mt-5 flex items-center justify-center gap-2 font-serif text-[26px] leading-tight text-ink">
          {contact.name.split(' ').slice(0, 2).join(' ')}
          <Verified />
        </h2>
        <p className="mt-1 text-center text-[13.5px] text-ink/55">{contact.role}</p>
        <p className="mx-auto mt-4 max-w-[340px] text-center text-[15px] leading-relaxed text-ink/75">{contact.description}</p>
        <div className="mt-6 space-y-2.5">
          {contact.links.map((l) => (
            <motion.a
              key={l.id}
              href={l.href}
              target={l.id === 'email' ? undefined : '_blank'}
              rel="noreferrer"
              whileTap={{ scale: 0.98 }}
              className="flex min-h-[64px] items-center gap-3.5 rounded-2xl border border-black/5 bg-[#faf7f9] px-4 py-3 active:bg-blush-50"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm" style={{ background: iconBg[l.id] }}>
                <Icon id={l.id} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className="text-[15px] font-semibold text-ink/85">{l.label}</span>
                <span className="truncate text-[13px] text-ink/50">{l.value}</span>
              </span>
              <svg className="shrink-0 text-ink/25" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 6 6 6-6 6" />
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="flex">
      {/* Panel izquierdo: card de perfil (foto + nombre + verificado) */}
      <div className="flex w-[300px] shrink-0 flex-col bg-blush-50/60 p-6">
        <div
          className="min-h-[280px] flex-1 overflow-hidden rounded-[20px] shadow-sm"
          style={
            photo
              ? { backgroundImage: `url("${photo}")`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }
              : { background: 'linear-gradient(160deg,#ff9ac6,#f83f92 60%,#b8145d)' }
          }
        />
        <h2 className="mt-4 flex items-center gap-2 font-serif text-[22px] leading-tight text-ink">
          {contact.name.split(' ').slice(0, 2).join(' ')}
          <Verified />
        </h2>
        <p className="mt-1 text-[13px] leading-snug text-ink/55">{contact.role}</p>
      </div>

      {/* Panel derecho: descripción + enlaces */}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-7 py-9">
        <p className="text-[14px] leading-relaxed text-ink/75">{contact.description}</p>
        <div className="mt-5 space-y-2.5">
          {contact.links.map((l) => (
            <motion.a
              key={l.id}
              href={l.href}
              target={l.id === 'email' ? undefined : '_blank'}
              rel="noreferrer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3.5 rounded-2xl border border-black/5 bg-[#faf7f9] px-4 py-3 transition-colors hover:bg-blush-50"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-sm"
                style={{ background: iconBg[l.id] }}
              >
                <Icon id={l.id} />
              </span>
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-[14px] font-semibold text-ink/85">{l.label}</span>
                <span className="truncate text-[12.5px] text-ink/50">{l.value}</span>
              </span>
              <svg className="ml-auto text-ink/25" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 6 6 6-6 6" />
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
