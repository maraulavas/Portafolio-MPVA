import { useCallback, useState } from 'react'
import type { WindowId } from '../data/content'

export interface OpenWindow {
  id: WindowId
  z: number
}

export interface WindowManager {
  open: OpenWindow[]
  minimized: WindowId[]
  topId: WindowId | null
  isOpen: (id: WindowId) => boolean
  isMinimized: (id: WindowId) => boolean
  zOf: (id: WindowId) => number
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  closeAll: () => void
  focusWindow: (id: WindowId) => void
  toggleWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  minimizeAll: () => void
}

// Base alta: las ventanas siempre quedan por encima de las carpetas
// (que al arrastrarse toman zIndex 50 vía whileDrag) y por debajo del dock (8000).
let zCounter = 100

export function useWindows(): WindowManager {
  const [open, setOpen] = useState<OpenWindow[]>([])
  // Orden de minimización (también define el apilado del dock inferior).
  const [minimized, setMinimizedList] = useState<WindowId[]>([])

  const isOpen = useCallback((id: WindowId) => open.some((w) => w.id === id), [open])
  const isMinimized = useCallback((id: WindowId) => minimized.includes(id), [minimized])
  const zOf = useCallback((id: WindowId) => open.find((w) => w.id === id)?.z ?? 0, [open])

  const focusWindow = useCallback((id: WindowId) => {
    setOpen((prev) => prev.map((w) => (w.id === id ? { ...w, z: ++zCounter } : w)))
  }, [])

  const openWindow = useCallback((id: WindowId) => {
    setMinimizedList((prev) => prev.filter((x) => x !== id))
    setOpen((prev) => {
      if (prev.some((w) => w.id === id)) {
        return prev.map((w) => (w.id === id ? { ...w, z: ++zCounter } : w))
      }
      return [...prev, { id, z: ++zCounter }]
    })
  }, [])

  const closeWindow = useCallback((id: WindowId) => {
    setMinimizedList((prev) => prev.filter((x) => x !== id))
    setOpen((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const closeAll = useCallback(() => {
    setMinimizedList([])
    setOpen([])
  }, [])

  const minimizeWindow = useCallback((id: WindowId) => {
    setMinimizedList((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const restoreWindow = useCallback(
    (id: WindowId) => {
      setMinimizedList((prev) => prev.filter((x) => x !== id))
      focusWindow(id)
    },
    [focusWindow],
  )

  const minimizeAll = useCallback(() => {
    setMinimizedList(open.map((w) => w.id))
  }, [open])

  const toggleWindow = useCallback(
    (id: WindowId) => {
      if (isOpen(id)) closeWindow(id)
      else openWindow(id)
    },
    [isOpen, closeWindow, openWindow],
  )

  const topId =
    open.length === 0 ? null : open.reduce((a, b) => (a.z >= b.z ? a : b)).id

  return {
    open,
    minimized,
    topId,
    isOpen,
    isMinimized,
    zOf,
    openWindow,
    closeWindow,
    closeAll,
    focusWindow,
    toggleWindow,
    minimizeWindow,
    restoreWindow,
    minimizeAll,
  }
}
