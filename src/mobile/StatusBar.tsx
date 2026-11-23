import { useEffect, useState } from 'react'

// Barra de estado estilo iOS: hora a la izquierda; señal, wifi y batería a la derecha.
export default function StatusBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])
  const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`
  const color = tone === 'dark' ? 'text-ink' : 'text-white'
  return (
    <div
      className={`flex h-11 shrink-0 items-center justify-between px-7 text-[15px] font-semibold ${color}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      aria-hidden
    >
      <span className="tabular-nums">{time}</span>
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.8" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.8" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.8" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 2.3c2 0 3.9.8 5.3 2.1l1.1-1.1A9 9 0 0 0 7.5.7 9 9 0 0 0 1.1 3.3l1.1 1.1a7.5 7.5 0 0 1 5.3-2.1zm0 3.2c1.1 0 2.2.4 3 1.2l1.1-1.1a5.9 5.9 0 0 0-8.2 0l1.1 1.1c.8-.8 1.9-1.2 3-1.2zm0 3.1c-.5 0-.9.2-1.2.5l1.2 1.2 1.2-1.2c-.3-.3-.7-.5-1.2-.5z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
          <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  )
}
