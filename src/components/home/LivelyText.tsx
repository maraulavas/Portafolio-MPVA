import { useEffect, useRef } from 'react'

// Texto en varias líneas con la misma vida que el título del inicio: cada letra flota como con una brisa
// y, al acercar el mouse, se estira y se inclina como gelatina hacia el puntero.
// La inicial de cada palabra va en la cursiva Parfumerie Script.
export default function LivelyText({ lines }: { lines: string[] }) {
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let mx = -9999
    let my = -9999
    const t0 = performance.now()
    const prox: number[] = []
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onLeave = () => {
      mx = my = -9999
    }
    function tick() {
      const t = (performance.now() - t0) / 1000
      const el = wrap.current
      if (el) {
        const fs = parseFloat(getComputedStyle(el).fontSize)
        el.querySelectorAll<HTMLElement>('[data-l]').forEach((l, i) => {
          const r = l.getBoundingClientRect()
          const dx = mx - (r.left + r.width / 2)
          const dy = my - (r.top + r.height / 2)
          const target = Math.max(0, 1 - Math.hypot(dx, dy) / 300)
          prox[i] = (prox[i] ?? 0) + (target - (prox[i] ?? 0)) * 0.1
          const p = prox[i]
          const idleY = Math.sin(t * 1.2 + i * 0.7) * fs * 0.005
          const idleSkew = Math.sin(t * 0.9 + i * 0.55) * 0.9
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

  return (
    <span ref={wrap} aria-label={lines.join(' ')} className="inline-block select-none">
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block whitespace-nowrap">
          {line.split(' ').map((w, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {wi > 0 && '\u00a0'}
              {w.split('').map((c, ci) => (
                <span key={ci} data-l className="inline-block will-change-transform" style={{ transformOrigin: '50% 85%' }}>
                  {ci === 0 ? <span style={{ fontFamily: "'Parfumerie Script', serif", fontSize: '1.6em', lineHeight: 0 }}>{c}</span> : c}
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
