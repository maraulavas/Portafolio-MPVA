// Pila de "volver" para pantallas anidadas dentro de una app en el celular (p. ej. el detalle
// de un proyecto). Cada pantalla que se abre agrega un paso al historial del navegador y
// registra aquí cómo cerrarse; el "atrás" (gesto del borde, botón o flecha) cierra primero
// la pantalla más reciente.
type Handler = () => void
const stack: Handler[] = []
let lastPop = 0

export function pushBack(h: Handler) {
  stack.push(h)
  return () => {
    const i = stack.lastIndexOf(h)
    if (i >= 0) stack.splice(i, 1)
  }
}

/** Lo llama el listener de popstate. Devuelve true si cerró una pantalla anidada. */
export function popBack() {
  lastPop = Date.now()
  const h = stack.pop()
  if (h) {
    h()
    return true
  }
  return false
}

/** Volver desde el gesto del borde, sin duplicar si el navegador ya hizo su propio "atrás". */
export function gestureBack() {
  if (Date.now() - lastPop > 700) window.history.back()
}

/** Vacía la pila (se usa al saltar varias pantallas atrás de una vez). */
export function clearBack() {
  stack.length = 0
}
