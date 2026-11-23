import { MotionConfig } from 'framer-motion'
import Editorial from './editorial/Editorial'
import { LanguageProvider } from './i18n/LanguageContext'

// Portafolio editorial (reemplaza al escritorio tipo Mac y a la versión iPhone; esos archivos siguen en el proyecto).
export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <Editorial />
      </MotionConfig>
    </LanguageProvider>
  )
}
