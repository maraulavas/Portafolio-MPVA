import { useEffect, useRef } from 'react'
import { homeAsset } from '../../data/assets'

// Fondo del inicio: la imagen del prado animada con viento (nubes que se mecen, pasto y flores que ondean).
// Son ondas periódicas, así que el movimiento se repite sin cortes. El mouse mueve el fondo con un leve parallax.
// `grassFrom`: desde qué altura (0–1) empieza a ondear el pasto; `amp`: intensidad de las ondas.
export function WindCanvas({ src, grassFrom = 0.66, amp = 1 }: { src: string; grassFrom?: number; amp?: number }) {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = cv.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const img = new Image()
    let raf = 0
    let stop = false
    img.onload = () => {
      const small = window.innerWidth < 768
      const W = small ? 760 : 1200
      const H = Math.round((W * img.naturalHeight) / img.naturalWidth)
      c.width = W
      c.height = H
      const strip = small ? 5 : 3
      const t0 = performance.now()
      const draw = () => {
        if (stop) return
        const t = (performance.now() - t0) / 1000
        const sy = img.naturalHeight / H
        for (let y = 0; y < H; y += strip) {
          const f = y / H
          const grass = Math.max(0, (f - grassFrom) / (1 - grassFrom)) * amp
          const dx =
            Math.sin(t * 0.35 + f * 2) * 6 + Math.sin(t * 0.8 + f * 5) * 1.5 + // nubes: deriva lenta
            grass * (Math.sin(t * 1.9 + f * 26) * 5 + Math.sin(t * 1.1 + f * 11) * 3.5) // pasto: ondas
          ctx.drawImage(img, 0, y * sy, img.naturalWidth, strip * sy + 1, dx - 16, y, W + 32, strip)
        }
        raf = requestAnimationFrame(draw)
      }
      draw()
    }
    img.src = src
    return () => {
      stop = true
      cancelAnimationFrame(raf)
    }
  }, [src, grassFrom, amp])
  return <canvas ref={cv} className="absolute inset-0 h-full w-full object-cover" />
}

export default function SkyBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    function onMove(e: PointerEvent) {
      tx = (e.clientX / window.innerWidth - 0.5) * -2
      ty = (e.clientY / window.innerHeight - 0.5) * -2
    }
    function tick() {
      x += (tx - x) * 0.05
      y += (ty - y) * 0.05
      if (ref.current) ref.current.style.transform = `translate3d(${x * 14}px, ${y * 9}px, 0) scale(1.05)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#2b8ceb]" aria-hidden>
      <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.05)' }}>
        <img src={homeAsset('fondo-prado.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <WindCanvas src={homeAsset('fondo-prado.jpg') as string} />
      </div>
    </div>
  )
}
