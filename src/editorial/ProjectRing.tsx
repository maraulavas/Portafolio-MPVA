import { useEffect, useMemo, useRef } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { localizeProject, useContent } from '../i18n/useContent'
import { useIsMobile } from '../mobile/useIsMobile'
import { BY_AREA, Thumb } from '../components/home/ProjectCards'
import type { ProjectAreaId } from '../data/content'
import { copy } from './copy'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Los proyectos giran en círculo (tarjetas chicas e inclinadas, con la lista de áreas al centro).
// Al hacer scroll se abren, se enderezan y se ordenan en un carrusel que avanza con el mismo scroll.
export default function ProjectRing({ onOpen }: { onOpen: (area: ProjectAreaId, id: string) => void }) {
  const { lang } = useLang()
  const { projectAreas } = useContent()
  const mobile = useIsMobile()
  const c = copy[lang]
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const center = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const cards = useRef<(HTMLButtonElement | null)[]>([])

  const items = useMemo(
    () =>
      projectAreas.flatMap((a) =>
        (BY_AREA[a.id] ?? []).map((p) => ({ p, lp: localizeProject(p, lang), area: a.id, areaName: a.name })),
      ),
    [lang, projectAreas],
  )
  const N = items.length

  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const loop = () => {
      const st = stage.current
      if (st && N) {
        const W = st.clientWidth
        const H = st.clientHeight
        const mob = W < 768
        const sec = section.current
        const rect = sec?.getBoundingClientRect()
        // Avance 0→1 mientras la sección está fija (se mide directo: el scroll vive dentro de <main>).
        const s = rect ? clamp(-rect.top / Math.max(1, rect.height - H)) : 0
        const time = (performance.now() - t0) / 1000
        const cw = mob ? W * 0.58 : Math.min(W * 0.2, 300)
        const ch = Math.min(cw * 1.75, H * (mob ? 0.62 : 0.66))
        const cwRing = mob ? 54 : clamp(0.11 * Math.min(W, H), 70, 120)
        const sRing = cwRing / cw
        const R = Math.min(W * (mob ? 0.4 : 0.4), H * (mob ? 0.3 : 0.29))
        const rx = mob ? R : Math.min(R * 1.45, W * 0.4)
        const spin = time * 0.1 + s * 2.4
        const t2 = clamp((s - 0.36) / 0.28)
        const pan = clamp((s - 0.66) / 0.34)
        const gap = mob ? W * 0.04 : 28
        const margin = mob ? W * 0.19 : W * 0.08
        const total = N * (cw + gap) - gap
        const travel = Math.max(0, total - (W - margin * 2))
        for (let i = 0; i < N; i++) {
          const el = cards.current[i]
          if (!el) continue
          const th = (i / N) * Math.PI * 2 - Math.PI / 2 + spin
          const tilt = ((i * 47) % 50) - 25 + Math.sin(time * 0.8 + i) * 4
          const e = ease(clamp((t2 - i * 0.03) / (1 - 0.03 * (N - 1))))
          const carX = -W / 2 + margin + cw / 2 + i * (cw + gap) - pan * travel
          const x = lerp(rx * Math.cos(th), carX, e)
          const y = lerp(R * Math.sin(th), 0, e)
          const rot = lerp(tilt, 0, e)
          const sc = lerp(sRing, 1, e)
          el.style.width = `${cw}px`
          el.style.height = `${ch}px`
          el.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`
          el.style.zIndex = String(e < 0.5 ? Math.round(100 + Math.sin(th) * 50) : i + 1)
          el.style.setProperty('--th', String((1 - e).toFixed(3)))
          el.style.setProperty('--fc', String(clamp((e - 0.6) / 0.4).toFixed(3)))
          el.style.setProperty('--ch', `${ch}px`)
        }
        if (center.current) {
          center.current.style.opacity = String(1 - clamp(t2 * 3))
          center.current.style.transform = `scale(${(1 - t2 * 0.25).toFixed(3)})`
        }
        if (head.current) head.current.style.opacity = String(clamp((t2 - 0.6) / 0.4))
        if (bar.current) bar.current.style.transform = `scaleX(${pan.toFixed(3)})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [N])

  return (
    <section ref={section} className="relative border-t-[3px] border-black bg-[#efefef]" style={{ height: mobile ? '460svh' : '440svh' }}>
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Centro del círculo: las áreas */}
        <div ref={center} className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center text-center">
          <div className="text-[clamp(34px,5.4vw,88px)] font-medium uppercase leading-[0.88] tracking-[-0.045em]">{c.index.title}</div>
          <div className="mt-4 text-[12px] font-medium uppercase leading-[1.5] tracking-[0.08em] opacity-70">
            {projectAreas.map((a) => (
              <div key={a.id}>{a.name}</div>
            ))}
          </div>
        </div>

        {/* Carrusel: encabezado y barra de avance */}
        <div ref={head} className="pointer-events-none absolute inset-x-0 bottom-0 z-[200] flex items-center gap-4 px-5 pb-6 text-[12px] uppercase tracking-[0.08em] opacity-0 md:px-8">
          <span>{c.index.hint}</span>
          <span className="relative h-[2px] flex-1 bg-black/15">
            <span ref={bar} className="absolute inset-0 origin-left bg-black" style={{ transform: 'scaleX(0)' }} />
          </span>
        </div>

        <div className="absolute left-1/2 top-1/2">
          {items.map((it, i) => (
            <button
              key={it.p.id}
              ref={(el) => {
                cards.current[i] = el
              }}
              type="button"
              onClick={() => onOpen(it.area, it.p.id)}
              className="group absolute left-0 top-0 block cursor-pointer text-left"
              style={{ willChange: 'transform' }}
            >
              <span className="absolute inset-0 block overflow-hidden rounded-[14px] bg-white shadow-[0_18px_40px_-22px_rgba(0,0,0,0.5)]">
                {/* Portada: se ve en el círculo y reaparece al pasar el mouse sobre la tarjeta */}
                <span className="absolute inset-0 block group-hover:!opacity-100" style={{ opacity: 'var(--th, 1)', transition: 'opacity 0.45s' }}>
                  <Thumb p={it.p} />
                  <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/40" />
                </span>
                {/* Cara editorial: número alto y delgado, etiqueta, título y flecha */}
                <span className="absolute inset-0 flex flex-col justify-between p-4 transition-colors duration-500 group-hover:text-white" style={{ opacity: 'var(--fc, 0)' }}>
                  <span className="flex flex-1 items-center justify-center leading-[0.8]" style={{ fontFamily: "'Antonio', 'Neue Montreal', sans-serif", fontWeight: 200, fontSize: 'calc(var(--ch, 400px) * 0.46)' }}>
                    {i + 1}
                  </span>
                  <span className="mb-3 inline-flex w-fit rounded-full border border-current px-2.5 py-[3px] text-[10px] font-medium uppercase tracking-[0.06em]">{it.areaName}</span>
                  <span className="flex items-end justify-between gap-2">
                    <span className="block text-[13px] font-medium leading-[1.15]">
                      {it.lp.title}
                      <span className="block opacity-60">{it.p.year}</span>
                    </span>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black text-[12px] text-white transition-colors group-hover:bg-white group-hover:text-black">→</span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
