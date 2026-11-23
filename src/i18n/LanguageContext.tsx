import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { ui } from './ui'

// Idioma del sitio: español o inglés.
// - Primera visita: según el idioma del navegador (español si empieza por "es", si no inglés).
// - Luego se recuerda la elección en este navegador (localStorage).

export type Lang = 'es' | 'en'

const STORAGE_KEY = 'mpva-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    /* storage bloqueado: seguimos con el navegador */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language || '' : ''
  return nav.toLowerCase().startsWith('es') ? 'es' : 'en'
}

interface LangState {
  lang: Lang
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangState>({ lang: 'es', setLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const controls = useAnimationControls()

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = ui[lang].pageTitle
  }, [lang])

  function setLang(l: Lang) {
    if (l === lang) return
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* sin storage: el cambio vale solo para esta visita */
    }
    // Fundido corto al cambiar de idioma.
    controls.set({ opacity: 0.35 })
    controls.start({ opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } })
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <motion.div animate={controls} className="h-full">
        {children}
      </motion.div>
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

/** Textos de la interfaz en el idioma activo. */
export function useUI() {
  return ui[useLang().lang]
}
