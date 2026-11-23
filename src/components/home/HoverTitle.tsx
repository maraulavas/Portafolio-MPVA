import { useEffect, useRef } from 'react'
import { P_PATH } from './pPath'

// Título "Portafolio" grande. Las letras flotan apenas, como con una brisa, y al acercar el mouse
// se estiran y se inclinan como gelatina hacia el puntero.
export default function HoverTitle({ start, end, label }: { start: string; end: string; label: string }) {
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let mx = -9999
    let my = -9999
    const t0 = performance.now()
    const prox: number[] = []
    function onMove(e: PointerEvent) {
      mx = e.clientX
      my = e.clientY
    }
    function onLeave() {
      mx = my = -9999
    }
    function tick() {
      const t = (performance.now() - t0) / 1000
      const el = wrap.current
      if (el) {
        const fs = parseFloat(getComputedStyle(el).fontSize)
        const letters = el.querySelectorAll<HTMLElement>('[data-l]')
        letters.forEach((l, i) => {
          const r = l.getBoundingClientRect()
          const cx = r.left + r.width / 2
          const cy = r.top + r.height / 2
          const dx = mx - cx
          const dy = my - cy
          const d = Math.hypot(dx, dy)
          const target = Math.max(0, 1 - d / 300)
          prox[i] = (prox[i] ?? 0) + (target - (prox[i] ?? 0)) * 0.1
          const p = prox[i]
          // Brisa permanente: cada letra flota y se inclina apenas, desfasada de la vecina.
          const idleY = Math.sin(t * 1.2 + i * 0.7) * fs * 0.006
          const idleSkew = Math.sin(t * 0.9 + i * 0.55) * 1.6
          // Con el mouse cerca: la letra se estira como gelatina y se inclina hacia el cursor.
          const wob = Math.sin(t * 3.2 + i * 0.9)
          const sy = 1 + p * (0.07 + 0.05 * wob)
          const sx = 1 - p * (0.03 + 0.03 * wob)
          const pull = Math.max(-1, Math.min(1, dx / 260))
          const skew = idleSkew + p * (-pull * 10 + wob * 3)
          const tx = pull * p * fs * 0.035
          l.style.transform = `translate3d(${tx.toFixed(2)}px, ${(idleY - p * fs * 0.025).toFixed(2)}px, 0) skewX(${skew.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`
        })
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const chars = [
    ...start.split('').map((c, i) => ({ c, serif: i === 0 })),
    ...end.split('').map((c) => ({ c, serif: false })),
  ]

  return (
    <>
      <span
        ref={wrap}
        aria-label={label}
        className="inline-flex select-none items-baseline whitespace-nowrap text-white"
        style={{
          fontSize: 'clamp(50px, 10.5vw, 180px)',
          lineHeight: 0.95,
          letterSpacing: '-0.035em',
          textShadow: '0 6px 40px rgba(18,84,190,0.28)',
        }}
      >
        {chars.map((ch, i) => (
          <span key={i} aria-hidden data-l className="inline-block will-change-transform" style={{ transformOrigin: '50% 85%' }}>
          <span
            className="inline-block"
            style={{
              fontWeight: 400,
              fontFamily: "'Neue Montreal', Inter, sans-serif",
              lineHeight: ch.serif ? 0 : undefined,
              animation: `home-rise 0.9s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.07}s both`,
            }}
          >
            {ch.serif ? (
              <svg
                viewBox="0 -612 820 625"
                aria-hidden
                style={{ display: 'block', overflow: 'visible', fill: 'currentColor', width: '1.804em', height: '1.375em', marginRight: '-0.645em' }}
              >
                <path d={P_PATH} stroke="currentColor" strokeWidth={5} strokeLinejoin="round" />
              </svg>
            ) : (
              ch.c
            )}
          </span>
          </span>
        ))}
      </span>
    </>
  )
}
