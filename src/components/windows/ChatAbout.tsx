import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../../i18n/useContent'
import { useUI } from '../../i18n/LanguageContext'
import type { AboutChat, ChatQA } from '../../data/content'
import { assetUrl, homeAsset } from '../../data/assets'

// Detecta URLs sueltas dentro de un texto para volverlas clickeables dentro de las burbujas.
const URL_RE = /(https?:\/\/[^\s)]+)/g
function renderTextWithLinks(text: string) {
  const parts = text.split(URL_RE)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer break-all text-current underline decoration-current/40 underline-offset-2 hover:decoration-current"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

type Bubble = {
  id: number
  from: 'me' | 'paula'
  text?: string
  image?: string
  video?: string
  poster?: string
  caption?: string
  action?: 'open-contact'
  label?: string
  link?: string
  linkTitle?: string
  linkDescription?: string
  linkSite?: string
  linkAccent?: string
  linkIcon?: string
}

const paulaPhoto = homeAsset('foto paula.jpeg')

const LINE_ICONS: Record<string, JSX.Element> = {
  maletin: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 13h18" />
    </>
  ),
  birrete: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11.5V16c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4.5" />
      <path d="M22 9v6" />
    </>
  ),
  paleta: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.3-1-1.6-1-2.7 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.8 17 3 12 3z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10.5" cy="7.5" r="1" />
      <circle cx="15" cy="8" r="1" />
    </>
  ),
}

function Avatar({ chat, size }: { chat: AboutChat; size: number }) {
  if (chat.photo && paulaPhoto) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-full bg-no-repeat"
        style={{
          width: size,
          height: size,
          backgroundImage: `url("${paulaPhoto}")`,
          backgroundPosition: 'center 30%',
          backgroundSize: '160%',
        }}
      />
    )
  }
  const glyph = chat.icon ? LINE_ICONS[chat.icon] : undefined
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full text-white"
      style={{ width: size, height: size, background: chat.accent, fontSize: size * 0.46 }}
    >
      {glyph ? (
        <svg
          viewBox="0 0 24 24"
          width={size * 0.5}
          height={size * 0.5}
          fill="none"
          stroke="#fff"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {glyph}
        </svg>
      ) : (
        <span>{chat.emoji ?? ''}</span>
      )}
    </div>
  )
}

// Al cambiar de idioma, Desktop vuelve a montar este componente (key={lang}),
// así la conversación arranca de nuevo en el idioma elegido.
// `compact` (celular): los chats pasan a una fila de avatares arriba y la
// conversación ocupa todo el espacio; las preguntas se deslizan en una sola fila.
export default function ChatAbout({
  onOpenContact,
  compact = false,
}: { onOpenContact?: () => void; compact?: boolean } = {}) {
  const { aboutChats } = useContent()
  const t = useUI()
  const [activeId, setActiveId] = useState(aboutChats[0].id)
  const idRef = useRef(1000)
  // Orden por actividad reciente (para reordenar la lista como un chat real).
  const orderRef = useRef(0)
  const [activity, setActivity] = useState<Record<string, number>>({})
  const [threads, setThreads] = useState<Record<string, Bubble[]>>(() => {
    const t: Record<string, Bubble[]> = {}
    let id = 1
    for (const c of aboutChats) t[c.id] = c.greeting.map((text) => ({ id: id++, from: 'paula', text }))
    return t
  })
  const [asked, setAsked] = useState<Record<string, number[]>>({})
  const [typing, setTyping] = useState<Record<string, boolean>>({})
  // true mientras se están "enviando" las burbujas de una respuesta (bloquea las preguntas para no cortar el envío).
  const [sending, setSending] = useState<Record<string, boolean>>({})
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null)
  // Pregunta de seguimiento pendiente por chat (mientras esté activa, reemplaza a las demás opciones).
  const [chainNext, setChainNext] = useState<Record<string, ChatQA | null>>({})

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [threads, typing, activeId])

  const chat = aboutChats.find((c) => c.id === activeId)!
  const askedList = asked[activeId] ?? []
  // Si hay una pregunta de seguimiento pendiente, solo se muestra ella (oculta al resto
  // hasta que termine la mini-conversación encadenada, p. ej. SGI → universidad).
  const pendingChain = chainNext[activeId]
  const remaining: { qa: ChatQA; topLevelIndex?: number }[] = pendingChain
    ? [{ qa: pendingChain }]
    : chat.questions
        .map((qa, i) => ({ qa, topLevelIndex: i }))
        .filter(({ topLevelIndex }) => !askedList.includes(topLevelIndex))

  // Galería de fotos y video del chat activo (para el pop up con navegación).
  const galleryMedia = threads[activeId]
    .filter((b) => !!b.image || !!b.video)
    .map((b) => ({
      id: b.id,
      kind: b.image ? ('image' as const) : ('video' as const),
      src: (b.image ?? b.video)!,
      poster: b.poster,
      caption: b.caption,
    }))

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
      else if (e.key === 'ArrowRight')
        setLightbox((lb) => (lb && galleryMedia.length ? { index: (lb.index + 1) % galleryMedia.length } : lb))
      else if (e.key === 'ArrowLeft')
        setLightbox((lb) =>
          lb && galleryMedia.length ? { index: (lb.index - 1 + galleryMedia.length) % galleryMedia.length } : lb,
        )
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, galleryMedia.length])

  // Maria Paula siempre primero (pineado); el resto se ordena por actividad reciente.
  const pinnedId = aboutChats[0].id
  const sortedChats = [...aboutChats].sort((a, b) => {
    if (a.id === pinnedId) return -1
    if (b.id === pinnedId) return 1
    return (activity[b.id] ?? 0) - (activity[a.id] ?? 0)
  })

  function ask(qa: ChatQA, topLevelIndex?: number) {
    const chatId = activeId
    setActivity((a) => ({ ...a, [chatId]: (orderRef.current += 1) }))
    setThreads((prev) => ({ ...prev, [chatId]: [...prev[chatId], { id: ++idRef.current, from: 'me', text: qa.q }] }))
    if (topLevelIndex !== undefined) {
      setAsked((prev) => ({ ...prev, [chatId]: [...(prev[chatId] ?? []), topLevelIndex] }))
    }
    // Si esta pregunta tiene una de seguimiento, queda pendiente (oculta al resto de opciones);
    // si no, se libera la cadena y vuelven a aparecer las preguntas normales.
    setChainNext((prev) => ({ ...prev, [chatId]: qa.next ?? null }))
    setTyping((prev) => ({ ...prev, [chatId]: true }))
    setSending((prev) => ({ ...prev, [chatId]: true }))
    const lastIndex = qa.a.length - 1
    qa.a.forEach((ans, i) => {
      setTimeout(() => {
        const prevAns = i > 0 ? qa.a[i - 1] : undefined
        const prevWasMeAsk = !!prevAns && typeof prevAns !== 'string' && 'meAsk' in prevAns
        if (i === 0 || prevWasMeAsk) setTyping((t) => ({ ...t, [chatId]: false }))

        // "meAsk": mensaje simulado del visitante que encadena una segunda parte de la respuesta.
        if (typeof ans !== 'string' && 'meAsk' in ans) {
          const bubble: Bubble = { id: ++idRef.current, from: 'me', text: ans.meAsk }
          setThreads((prevThreads) => ({ ...prevThreads, [chatId]: [...prevThreads[chatId], bubble] }))
          setTyping((t) => ({ ...t, [chatId]: true }))
          if (i === lastIndex) setSending((s) => ({ ...s, [chatId]: false }))
          return
        }

        let bubble: Bubble
        if (typeof ans === 'string') {
          bubble = { id: ++idRef.current, from: 'paula', text: ans }
        } else if ('image' in ans) {
          bubble = { id: ++idRef.current, from: 'paula', image: assetUrl(ans.image), caption: ans.caption }
        } else if ('video' in ans) {
          bubble = {
            id: ++idRef.current,
            from: 'paula',
            video: assetUrl(ans.video),
            poster: ans.poster ? assetUrl(ans.poster) : undefined,
            caption: ans.caption,
          }
        } else if ('link' in ans) {
          bubble = {
            id: ++idRef.current,
            from: 'paula',
            link: ans.link,
            linkTitle: ans.title,
            linkDescription: ans.description,
            linkSite: ans.site,
            linkAccent: ans.accent,
            linkIcon: ans.icon,
          }
        } else {
          bubble = { id: ++idRef.current, from: 'paula', action: ans.action, label: ans.label }
        }
        setThreads((prev) => ({ ...prev, [chatId]: [...prev[chatId], bubble] }))
        if (i === lastIndex) setSending((s) => ({ ...s, [chatId]: false }))
      }, 650 + i * 700)
    })
  }

  return (
    <div className={`relative flex h-full w-full bg-white text-ink ${compact ? 'flex-col' : ''}`}>
      {compact ? (
        /* Celular: fila de chats arriba */
        <nav className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b border-black/10 bg-[#fafafa] px-2 py-2.5">
          {aboutChats.map((c) => {
            const isActive = c.id === activeId
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                aria-pressed={isActive}
                className="flex w-[82px] shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-1 py-1 active:bg-black/5"
              >
                <span className={`rounded-full p-[2.5px] transition ${isActive ? 'bg-blush-500' : 'bg-transparent'}`}>
                  <span className="block rounded-full bg-white p-[2px]">
                    <Avatar chat={c} size={50} />
                  </span>
                </span>
                <span
                  className={`line-clamp-2 text-center text-[11.5px] leading-tight ${
                    isActive ? 'font-semibold text-blush-600' : 'text-ink/60'
                  }`}
                >
                  {c.name}
                </span>
              </button>
            )
          })}
        </nav>
      ) : (
      /* Lista de chats */
      <aside className="flex w-[38%] max-w-[300px] shrink-0 flex-col border-r border-black/10 bg-[#fafafa]">
        <div className="px-4 pb-2 pt-4">
          <h2 className="text-[22px] font-bold tracking-tight">{t.chat.title}</h2>
        </div>
        <div className="win-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {sortedChats.map((c) => {
            const thread = threads[c.id]
            const last = thread[thread.length - 1]
            const preview = last?.text ?? (last?.image ? t.chat.photo : last?.video ? t.chat.video : '')
            const isActive = c.id === activeId
            return (
              <motion.button
                key={c.id}
                layout
                transition={{ layout: { type: 'spring', stiffness: 170, damping: 30, mass: 1.1 } }}
                onClick={() => setActiveId(c.id)}
                className={`cursor-pointer mb-1 flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                  isActive ? 'bg-blush-100/70' : 'hover:bg-black/5'
                }`}
              >
                <Avatar chat={c} size={44} />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{c.name}</span>
                  <p className="truncate text-[12.5px] text-ink/50">{preview}</p>
                </div>
                {c.id === pinnedId && (
                  <svg
                    className="ml-1 mb-1.5 shrink-0 self-end text-ink/35"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ transform: 'rotate(40deg)' }}
                    aria-label={t.chat.pinned}
                  >
                    <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                  </svg>
                )}
              </motion.button>
            )
          })}
        </div>
      </aside>
      )}

      {/* Conversación */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className={`flex items-center gap-3 border-b border-black/10 px-4 py-2.5 ${compact ? 'hidden' : ''}`}>
          <Avatar chat={chat} size={36} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight">{chat.name}</p>
            <p className="text-[12px] font-medium text-blush-500">{chat.role}</p>
          </div>
        </div>

        <div ref={scrollRef} className="win-scroll min-h-0 flex-1 space-y-2 overflow-y-auto bg-[#f5f5f7] px-4 py-4">
          {threads[activeId].map((b) => {
            const me = b.from === 'me'
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${me ? 'justify-end' : 'justify-start'}`}
              >
                {b.action === 'open-contact' ? (
                  <button
                    type="button"
                    onClick={() => onOpenContact?.()}
                    className="cursor-pointer flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-blush-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-blush-600 shadow-sm transition hover:bg-blush-50 active:scale-[0.98]"
                  >
                    {b.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                ) : b.link ? (
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer block w-[270px] max-w-[85%] overflow-hidden rounded-2xl rounded-bl-md border border-black/5 bg-white shadow-sm transition hover:brightness-95"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[22px] shadow-sm"
                        style={{ background: b.linkAccent }}
                      >
                        {b.linkIcon}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold text-ink/85">{b.linkTitle}</p>
                        {b.linkDescription && (
                          <p className="line-clamp-2 text-[12px] leading-snug text-ink/55">{b.linkDescription}</p>
                        )}
                      </div>
                    </div>
                    {b.linkSite && (
                      <div className="border-t border-black/5 bg-[#fafafa] px-3 py-1.5 text-[11px] text-ink/40">
                        {b.linkSite}
                      </div>
                    )}
                  </a>
                ) : b.image ? (
                  <div
                    data-imgbubble
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const idx = galleryMedia.findIndex((g) => g.id === b.id)
                      if (idx >= 0) setLightbox({ index: idx })
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return
                      const idx = galleryMedia.findIndex((g) => g.id === b.id)
                      if (idx >= 0) setLightbox({ index: idx })
                    }}
                    className="w-[250px] max-w-[85%] cursor-pointer overflow-hidden rounded-2xl rounded-bl-md border border-black/5 bg-white shadow-sm transition hover:brightness-95"
                  >
                    <img
                      src={b.image}
                      alt={b.caption ?? ''}
                      onError={(e) => {
                        const box = e.currentTarget.closest('[data-imgbubble]') as HTMLElement | null
                        if (box) box.style.display = 'none'
                      }}
                      className="block h-auto w-full"
                    />
                    {b.caption && <div className="px-3 py-2 text-[13px] leading-snug text-ink/70">{b.caption}</div>}
                  </div>
                ) : b.video ? (
                  <div
                    data-imgbubble
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const idx = galleryMedia.findIndex((g) => g.id === b.id)
                      if (idx >= 0) setLightbox({ index: idx })
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return
                      const idx = galleryMedia.findIndex((g) => g.id === b.id)
                      if (idx >= 0) setLightbox({ index: idx })
                    }}
                    className="group relative w-[250px] max-w-[85%] cursor-pointer overflow-hidden rounded-2xl rounded-bl-md border border-black/5 bg-white shadow-sm transition hover:brightness-95"
                  >
                    <video
                      src={b.video}
                      poster={b.poster}
                      muted
                      playsInline
                      preload="metadata"
                      onError={(e) => {
                        const box = e.currentTarget.closest('[data-imgbubble]') as HTMLElement | null
                        if (box) box.style.display = 'none'
                      }}
                      className="block h-auto w-full"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/20">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-md">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-blush-600">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {b.caption && <div className="px-3 py-2 text-[13px] leading-snug text-ink/70">{b.caption}</div>}
                  </div>
                ) : (
                  <div
                    className={`max-w-[76%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug shadow-sm ${
                      me ? 'rounded-br-md bg-blush-500 text-white' : 'rounded-bl-md bg-white text-ink'
                    }`}
                  >
                    {b.text && renderTextWithLinks(b.text)}
                  </div>
                )}
              </motion.div>
            )
          })}

          {typing[activeId] && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block h-1.5 w-1.5 rounded-full bg-ink/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer: preguntas predeterminadas (sin escritura libre) */}
        <div className="border-t border-black/10 bg-white px-3 py-3">
          {remaining.length ? (
            <>
              <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-ink/35">{t.chat.tapQuestion}</p>
              <div className={compact ? 'no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-0.5' : 'flex flex-wrap gap-2'}>
                {remaining.map(({ qa, topLevelIndex }) => (
                  <button
                    key={topLevelIndex ?? qa.q}
                    disabled={!!sending[activeId]}
                    onClick={() => ask(qa, topLevelIndex)}
                    className={`${compact ? 'min-h-[40px] shrink-0 whitespace-nowrap px-4 text-[14px]' : 'px-3.5 py-2 text-[13px]'} cursor-pointer rounded-full border border-blush-200 bg-blush-50 font-medium text-blush-700 transition hover:bg-blush-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-blush-50 disabled:active:scale-100`}
                  >
                    {qa.q}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="py-1.5 text-center text-[13px] text-ink/40">
              {t.chat.done}
            </p>
          )}
        </div>
      </section>

      {/* Pop up de galería: se abre al tocar una foto */}
      <AnimatePresence>
        {lightbox && galleryMedia[lightbox.index] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-[200] flex cursor-pointer items-center justify-center bg-black/80 p-10"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(null)
              }}
              aria-label={t.chat.close}
              className="cursor-pointer absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {galleryMedia.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox((lb) => lb && { index: (lb.index - 1 + galleryMedia.length) % galleryMedia.length })
                }}
                aria-label={t.chat.prev}
                className="cursor-pointer absolute left-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
            )}

            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
              className="flex max-h-full max-w-full cursor-default flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Marco de tamaño fijo (misma proporción) para que foto y video se vean del mismo tamaño */}
              <div
                className="relative w-[min(78vw,780px)] max-h-[65vh] overflow-hidden rounded-lg bg-black shadow-2xl"
                style={{ aspectRatio: '16 / 9' }}
              >
                {galleryMedia[lightbox.index].kind === 'video' ? (
                  <video
                    src={galleryMedia[lightbox.index].src}
                    poster={galleryMedia[lightbox.index].poster}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={galleryMedia[lightbox.index].src}
                    alt={galleryMedia[lightbox.index].caption ?? ''}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                )}
              </div>
              {galleryMedia[lightbox.index].caption && (
                <p className="mt-4 max-w-[560px] text-center text-[14px] text-white/85">
                  {galleryMedia[lightbox.index].caption}
                </p>
              )}
              {galleryMedia.length > 1 && (
                <p className="mt-2 text-[12px] text-white/50">
                  {lightbox.index + 1} / {galleryMedia.length}
                </p>
              )}
            </motion.div>

            {galleryMedia.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox((lb) => lb && { index: (lb.index + 1) % galleryMedia.length })
                }}
                aria-label={t.chat.next}
                className="cursor-pointer absolute right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
