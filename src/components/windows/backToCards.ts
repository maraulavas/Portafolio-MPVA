import { createContext } from 'react'
import type { ReactNode } from 'react'

// Si existe, "Todos los proyectos" vuelve al carrusel del inicio en vez de a la grilla interna.
export const BackToCardsContext = createContext<(() => void) | null>(null)

// Selector de perfiles para pantallas muy angostas: se dibuja debajo del subtítulo de la grilla.
export const ProfileToggleContext = createContext<(() => ReactNode) | null>(null)
