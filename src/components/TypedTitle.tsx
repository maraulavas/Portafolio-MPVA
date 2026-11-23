import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

type Step = { text: string; pause: number; error?: boolean }

// Secuencia de "tecleo" con una equivocación a propósito:
// escribe P-o-r-t, luego una "f" por error (quería la "a"), la borra y
// continúa con a-f-o-l-i-o. `pause` = milisegundos que se muestra el
// fotograma antes de pasar al siguiente.
const stepsEs: Step[] = [
  { text: 'P', pause: 150 },
  { text: 'Po', pause: 120 },
  { text: 'Por', pause: 150 },
  { text: 'Port', pause: 180 },
  { text: 'Portf', pause: 520, error: true }, // ¡ups! escribe "f" en vez de "a"
  { text: 'Port', pause: 260 }, // borra la "f"
  { text: 'Porta', pause: 150 },
  { text: 'Portaf', pause: 150 },
  { text: 'Portafo', pause: 140 },
  { text: 'Portafol', pause: 150 },
  { text: 'Portafoli', pause: 140 },
  { text: 'Portafolio', pause: 0 },
]

// En inglés: "Portfolio". Se equivoca con una "f" antes de la "t" (quería
// "Port" y escribe "Porf"), la borra y sigue.
const stepsEn: Step[] = [
  { text: 'P', pause: 150 },
  { text: 'Po', pause: 120 },
  { text: 'Por', pause: 150 },
  { text: 'Porf', pause: 520, error: true }, // ¡oops! "f" en vez de "t"
  { text: 'Por', pause: 260 }, // borra la "f"
  { text: 'Port', pause: 160 },
  { text: 'Portf', pause: 150 },
  { text: 'Portfo', pause: 140 },
  { text: 'Portfol', pause: 150 },
  { text: 'Portfoli', pause: 140 },
  { text: 'Portfolio', pause: 0 },
]

// A partir de este índice, las letras usan el estilo cursiva serif "folio".
const FOLIO_START = { es: 5, en: 4 }

export default function TypedTitle({
  startDelay = 550,
  onDone,
}: {
  startDelay?: number
  onDone?: () => void
}) {
  const { lang } = useLang()
  const steps = lang === 'en' ? stepsEn : stepsEs
  const [cur, setCur] = useState(-1)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (cur < 0) {
      t = setTimeout(() => setCur(0), startDelay)
    } else if (cur < steps.length - 1) {
      t = setTimeout(() => setCur((c) => c + 1), steps[cur]?.pause ?? 0)
    }
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, startDelay])

  // Avisa cuando el título va tecleando "Por" (justo al aparecer la R), para
  // anticipar el arranque de la cascada de entrada del resto del home.
  useEffect(() => {
    if (cur >= 0 && steps[cur]?.text === 'Por') onDone?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, onDone])

  // Si cambia el idioma a mitad del tecleo, se muestra la palabra completa.
  const step: Step = cur < 0 ? { text: '', pause: 0 } : steps[Math.min(cur, steps.length - 1)]
  const chars = step.text.split('')

  return (
    <span aria-label={steps[steps.length - 1].text}>
      {chars.map((ch, idx) => {
        // La "f" del error mantiene el estilo por defecto (negra, sans serif).
        const isFolio = idx >= FOLIO_START[lang]
        return (
          <span key={idx} className={isFolio ? 'font-serif italic text-blush-600' : undefined}>
            {ch}
          </span>
        )
      })}
      {/* Cursor parpadeante estilo terminal, sutil */}
      <motion.span
        aria-hidden
        className="ml-[0.03em] inline-block h-[0.72em] w-[0.025em] translate-y-[0.06em] rounded-sm bg-ink/30 align-baseline"
        animate={{ opacity: [0.5, 0.5, 0.12, 0.12] }}
        transition={{ duration: 1.15, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </span>
  )
}
