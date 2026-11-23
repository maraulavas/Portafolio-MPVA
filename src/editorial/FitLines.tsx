import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type HeroLine = string | { words: [string, string]; mid?: string }

const text = (l: HeroLine) => (typeof l === 'string' ? l : l.words.join(' '))

// Líneas de texto gigante que ocupan todo el ancho. Una línea puede ir "justificada": una palabra pegada a cada borde,
// con un texto pequeño en el hueco, como en un poster editorial.
export default function FitLines({ lines, maxHeight }: { lines: HeroLine[]; maxHeight: number }) {
  const box = useRef<HTMLHeadingElement>(null)
  const [fs, setFs] = useState(120)

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      let widest = 0
      el.querySelectorAll<HTMLElement>('[data-probe]').forEach((s) => {
        widest = Math.max(widest, s.offsetWidth)
      })
      if (!w || !widest) return
      setFs((cur) => {
        const next = Math.min((cur * w * 0.975) / widest, maxHeight / (lines.length * 0.86))
        return Math.abs(next - cur) < 1.5 ? cur : next
      })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.map(text).join('|'), maxHeight])

  // Entrada: el título se escribe letra por letra.
  const total = lines.reduce((a, l) => a + (typeof l === 'string' ? l.replace(/ /g, '').length : 0), 0)
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    let n = 0
    let iv = 0
    const start = window.setTimeout(() => {
      iv = window.setInterval(() => {
        n += 1
        setTyped(n)
        if (n >= total) window.clearInterval(iv)
      }, 110)
    }, 500)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(iv)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  // Estirar: la letra bajo el puntero se ensancha y empuja a las demás hacia los lados; vuelve despacio.
  const [free, setFree] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setFree(true), 500 + total * 110 + 400)
    return () => window.clearTimeout(t)
  }, [])
  useEffect(() => {
    let raf = 0
    let mx = -9999
    let my = -9999
    const cur: number[] = []
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onLeave = () => {
      mx = my = -9999
    }
    const tick = () => {
      const el = box.current
      if (el) {
        const all = Array.from(el.querySelectorAll<HTMLElement>('[data-l]'))
        const byLine = new Map<number, { l: HTMLElement; i: number }[]>()
        all.forEach((l, i) => {
          const k = Number(l.dataset.line ?? 0)
          if (!byLine.has(k)) byLine.set(k, [])
          byLine.get(k)!.push({ l, i })
        })
        byLine.forEach((items) => {
          // medidas naturales (el contenedor externo no se transforma)
          const rects = items.map(({ l }) => l.getBoundingClientRect())
          const first = rects[0].left
          const sumW = rects.reduce((a, r) => a + r.width, 0)
          // el estiramiento de cada letra se acerca a su objetivo: sube con decisión, vuelve con calma
          const raw = items.map(({ i }, n) => {
            const r = rects[n]
            const inRow = my > r.top - r.height * 0.1 && my < r.bottom + r.height * 0.1
            const dx = Math.abs(mx - (r.left + r.width / 2))
            const k = inRow ? Math.max(0, 1 - dx / (r.width * 1.25)) : 0
            const target = 1 + 0.2 * Math.pow(k, 1.5)
            const prev = cur[i] ?? 1
            const next = prev + (target - prev) * (target > prev ? 0.09 : 0.035)
            cur[i] = next
            return next
          })
          const active = raw.some((v) => v > 1.003)
          if (!active) {
            items.forEach(({ l }) => {
              const inner = l.firstElementChild as HTMLElement
              if (inner.style.transform) inner.style.transform = ''
            })
            return
          }
          // el ancho total de la línea se conserva: lo que una letra crece, las demás lo ceden
          const grown = raw.reduce((a, v, n) => a + v * rects[n].width, 0)
          const norm = sumW / grown
          let cum = 0
          items.forEach(({ l }, n) => {
            const r = rects[n]
            const sx = raw[n] * norm
            const gap = r.left - first - items.slice(0, n).reduce((a, _, m) => a + rects[m].width, 0)
            const left = first + cum + gap
            const inner = l.firstElementChild as HTMLElement
            inner.style.transform = `translate3d(${(left - r.left).toFixed(2)}px,0,0) scaleX(${sx.toFixed(4)})`
            cum += r.width * sx
          })
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
  }, [fs, lines.length])

  let flat = 0
  return (
    <h1 ref={box} className="relative w-full select-none" style={{ fontSize: fs, lineHeight: 0.86, letterSpacing: '-0.045em' }} aria-label={lines.map(text).join(' ')}>
      {lines.map((l, i) => (
        <span key={text(l) + i} aria-hidden data-line={i} className={`relative -mx-[0.05em] -mt-[0.14em] block px-[0.05em] pt-[0.14em] ${free ? 'overflow-visible' : 'overflow-hidden'}`}>
          <span data-probe className="invisible absolute whitespace-nowrap">
            {text(l)}
          </span>
          <span className="flex items-end justify-between whitespace-nowrap">
            {typeof l === 'string' ? (
              <span>{l.split(' ').map((w, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {wi > 0 && '\u00a0'}
                  {w.split('').map((ch, ci) => {
                    const fi = flat++
                    return (
                    <span key={ci} data-l data-line={i} className="relative inline-block" style={{ opacity: typed > fi ? 1 : 0 }}>
                      <span className="inline-block will-change-transform" style={{ transformOrigin: '0% 50%' }}>
                        {ch}
                      </span>
                    </span>
                    )
                  })}
                </span>
              ))}</span>
            ) : (
              <>
                <span>{l.words[0]}</span>
                {l.mid && (
                  <span className="mb-[0.2em] flex-1 px-4 text-center text-[11px] font-medium uppercase leading-tight tracking-[0.06em] opacity-70" style={{ letterSpacing: '0.06em' }}>
                    {l.mid}
                  </span>
                )}
                <span>{l.words[1]}</span>
              </>
            )}
          </span>
        </span>
      ))}
    </h1>
  )
}
