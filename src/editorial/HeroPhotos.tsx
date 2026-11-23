import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { homeAsset } from '../data/assets'

const FILES = ['hero-n1.jpg', 'hero-n2.jpg', 'hero-n3.jpg']
const EVERY = 5200

// Fondo del hero: las fotos se cruzan despacio, con un zoom casi imperceptible.
export default function HeroPhotos() {
  const [i, setI] = useState(0)
  useEffect(() => {
    FILES.forEach((f) => {
      const im = new Image()
      im.src = homeAsset(f) ?? ''
    })
    const id = window.setInterval(() => setI((n) => (n + 1) % FILES.length), EVERY)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black" aria-hidden>
      <AnimatePresence initial={false}>
        <motion.img
          key={i}
          src={homeAsset(FILES[i])}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'grayscale(1) brightness(0.62) contrast(1.08)' }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.6, ease: 'easeInOut' }, scale: { duration: EVERY / 1000 + 2, ease: 'linear' } }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
    </div>
  )
}
