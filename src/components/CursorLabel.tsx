// Cursor personalizado: flecha + burbuja rosada con el nombre de la disciplina.
// Se muestra (siguiendo el mouse) cuando se pasa por encima de una versión.
interface CursorLabelProps {
  label: string
  x: number
  y: number
  pointer?: 'arrow' | 'hand'
  side?: 'right' | 'left'
}

export default function CursorLabel({ label, x, y, pointer = 'arrow', side = 'right' }: CursorLabelProps) {
  const hand = pointer === 'hand'
  return (
    <div
      className="pointer-events-none fixed z-[10000]"
      style={{ left: x, top: y, transform: hand ? 'translate(-8px, -3px)' : 'translate(-2px, -2px)' }}
    >
      {hand ? (
        // Manito que hace clic (misma paleta: rosa relleno, borde blanco).
        <svg width="26" height="28" viewBox="0 0 28 30" fill="none" aria-hidden>
          <path
            d="M11 3c-.9 0-1.6.7-1.6 1.6v8.6L7.5 11c-.7-.8-1.9-.8-2.5-.1-.5.6-.6 1.5-.2 2.2l3.5 5.6c.7 1.1 1.9 1.8 3.2 1.8h4.3c2.1 0 3.8-1.7 3.8-3.8v-6.4c0-.9-.7-1.6-1.6-1.6-.3 0-.5 0-.8.1 0-.9-.8-1.5-1.6-1.5-.3 0-.6.1-.9.2-.2-.7-.8-1.2-1.6-1.2-.3 0-.6.1-.9.2V4.6C12.6 3.7 11.9 3 11 3z"
            fill="#f83f92"
            stroke="#ffffff"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Flecha del cursor (punta en la esquina superior izquierda)
        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden>
          <path
            d="M2 2 L2 18 L6.4 13.8 L9.3 20 L11.9 18.8 L9 12.7 L14.6 12.5 Z"
            fill="#f83f92"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {/* Burbuja con el nombre */}
      <span
        className="absolute whitespace-nowrap rounded-[16px] bg-blush-500 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-lg"
        style={
          side === 'left'
            ? { top: hand ? 18 : 14, right: hand ? 20 : 16 }
            : { top: hand ? 18 : 14, left: hand ? 20 : 16 }
        }
      >
        {label}
      </span>
    </div>
  )
}
