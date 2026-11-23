// Los assets viven en `public/assets` y Vite los sirve de forma estática en
// `/assets/...`. Ventaja: al soltar una imagen nueva en la carpeta, aparece con
// solo refrescar el navegador (no hay que reiniciar el servidor ni recompilar).

const BASE = '/assets'

// Construye la URL codificando cada segmento (respeta las barras) para soportar
// espacios, paréntesis, etc. en los nombres de archivo.
function url(path: string): string {
  return `${BASE}/${path.split('/').map((s) => encodeURIComponent(s)).join('/')}`
}

/** URL de un archivo dentro de `public/assets` por ruta/nombre CON extensión
 *  (admite subcarpetas, p.ej. 'grado.jpg' o 'home/grado.jpg'). */
export function assetUrl(file: string): string {
  return url(file)
}

/** URL de una imagen de `public/assets` por nombre SIN extensión (asume .png). */
export function asset(name: string): string | undefined {
  return url(`${name}.png`)
}

/** URL de una imagen de `public/assets/home` por nombre de archivo (con extensión). */
export function homeAsset(file: string): string | undefined {
  return url(`home/${file}`)
}

/** URL de una imagen de `public/assets/Di` por nombre de archivo (con extensión). */
export function diAsset(file: string): string | undefined {
  return url(`Di/${file}`)
}

/** URL de una imagen de `public/assets/Dg` por nombre de archivo (con extensión). */
export function dgAsset(file: string): string | undefined {
  return url(`Dg/${file}`)
}
