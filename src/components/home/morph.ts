// Transición "la card se minimiza en su perfil del selector" (y al revés al volver).
// Crea un clon temporal de la card (fondo + foto) y lo anima entre los dos rectángulos reales:
// de la card grande de "Mis versiones" al circulito del selector de proyectos.
const EASE = 'cubic-bezier(0.45, 0, 0.15, 1)'
const DUR = 600

function visible(sel: string): HTMLElement | null {
  return (
    Array.from(document.querySelectorAll<HTMLElement>(sel)).find((e) => {
      const r = e.getBoundingClientRect()
      return r.width > 0 && r.height > 0
    }) ?? null
  )
}

function waitFor(sel: string, ms = 800): Promise<HTMLElement | null> {
  const t0 = performance.now()
  return new Promise((res) => {
    const tick = () => {
      const e = visible(sel)
      if (e || performance.now() - t0 > ms) res(e)
      else requestAnimationFrame(tick)
    }
    tick()
  })
}

const px = (n: number) => `${n}px`

interface Frame {
  box: DOMRect
  img: DOMRect
  bg: string
  radius: number
}

function frameOf(box: HTMLElement, img: HTMLImageElement, radius: number): Frame {
  return { box: box.getBoundingClientRect(), img: img.getBoundingClientRect(), bg: getComputedStyle(box).backgroundColor, radius }
}

function imgStyle(f: Frame) {
  return { left: px(f.img.left - f.box.left), top: px(f.img.top - f.box.top), width: px(f.img.width) }
}

function boxStyle(f: Frame) {
  return { left: px(f.box.left), top: px(f.box.top), width: px(f.box.width), height: px(f.box.height), borderRadius: px(f.radius), backgroundColor: f.bg }
}

async function run(from: Frame, to: Frame, src: string, label: { node: HTMLElement; rect: DOMRect; fadeIn: boolean } | null, delay = 0) {
  const box = document.createElement('div')
  Object.assign(box.style, { position: 'fixed', overflow: 'hidden', zIndex: '8000', pointerEvents: 'none', willChange: 'left, top, width, height', ...boxStyle(from) })
  const img = new Image()
  img.src = src
  img.draggable = false
  Object.assign(img.style, { position: 'absolute', maxWidth: 'none', userSelect: 'none', ...imgStyle(from) })
  box.appendChild(img)
  let lab: HTMLElement | null = null
  if (label) {
    lab = label.node.cloneNode(true) as HTMLElement
    Object.assign(lab.style, {
      position: 'absolute',
      left: px(label.rect.left - from.box.left),
      top: px(label.rect.top - from.box.top),
      width: px(label.rect.width),
      height: px(label.rect.height),
      right: 'auto',
      bottom: 'auto',
      margin: '0',
      opacity: label.fadeIn ? '0' : '1',
    })
    box.appendChild(lab)
  }
  document.body.appendChild(box)
  const opt = { duration: DUR, easing: EASE, fill: 'both' as const, delay }
  const anims = [
    box.animate([boxStyle(from), boxStyle(to)], opt),
    img.animate([imgStyle(from), imgStyle({ ...to, box: to.box })], opt),
  ]
  if (lab && label) {
    // La etiqueta se desvanece rápido al achicar (o aparece al final al agrandar).
    anims.push(
      lab.animate(label.fadeIn ? [{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0, offset: 0.3 }, { opacity: 0 }], { duration: DUR, easing: 'linear', fill: 'both', delay }),
    )
  }
  await Promise.all(anims.map((a) => a.finished.catch(() => undefined)))
  box.remove()
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Abrir: la card grande se achica hasta el circulito de su versión en el selector. */
export async function morphCardToAvatar(id: string, delay = 0) {
  if (reduced()) return
  const card = visible(`[data-vcard="${id}"]`)
  const cardImg = card?.querySelector('img') as HTMLImageElement | null
  if (!card || !cardImg) return
  const from = frameOf(card, cardImg, 26)
  const labelEl = card.querySelector<HTMLElement>('[data-vlabel]')
  const label = labelEl ? { node: labelEl, rect: labelEl.getBoundingClientRect(), fadeIn: false } : null
  const src = cardImg.currentSrc || cardImg.src
  const hidden = card.style.visibility
  card.style.visibility = 'hidden'
  const av = await waitFor(`[data-avatar="${id}"]`)
  const avImg = av?.querySelector('img') as HTMLImageElement | null
  if (!av || !avImg) {
    card.style.visibility = hidden
    return
  }
  const to = frameOf(av, avImg, av.getBoundingClientRect().height / 2)
  av.style.visibility = 'hidden'
  await run(from, to, src, label, delay)
  av.style.visibility = ''
  card.style.visibility = hidden
}

/** Volver: el circulito del selector se agranda hasta la card de "Mis versiones". */
export async function morphAvatarToCard(id: string, delay = 0) {
  if (reduced()) return
  const av = visible(`[data-avatar="${id}"]`)
  const avImg = av?.querySelector('img') as HTMLImageElement | null
  const card = visible(`[data-vcard="${id}"]`)
  const cardImg = card?.querySelector('img') as HTMLImageElement | null
  if (!av || !avImg || !card || !cardImg) return
  const from = frameOf(av, avImg, av.getBoundingClientRect().height / 2)
  const to = frameOf(card, cardImg, 26)
  const labelEl = card.querySelector<HTMLElement>('[data-vlabel]')
  // La etiqueta se mide en su posición final dentro de la card (rect del destino).
  const label = labelEl ? { node: labelEl, rect: labelEl.getBoundingClientRect(), fadeIn: true } : null
  const hidden = card.style.visibility
  card.style.visibility = 'hidden'
  // Para la etiqueta, el clon se arma con la geometría de origen; aquí la posicionamos según el destino.
  await runReverse(from, to, cardImg.currentSrc || cardImg.src, label, delay)
  card.style.visibility = hidden
}

// Variante de run() para el regreso: la etiqueta se coloca con las medidas del destino y se anima su posición con la caja.
async function runReverse(from: Frame, to: Frame, src: string, label: { node: HTMLElement; rect: DOMRect; fadeIn: boolean } | null, delay = 0) {
  const box = document.createElement('div')
  Object.assign(box.style, { position: 'fixed', overflow: 'hidden', zIndex: '8000', pointerEvents: 'none', willChange: 'left, top, width, height', ...boxStyle(from) })
  const img = new Image()
  img.src = src
  img.draggable = false
  Object.assign(img.style, { position: 'absolute', maxWidth: 'none', userSelect: 'none', ...imgStyle(from) })
  box.appendChild(img)
  let lab: HTMLElement | null = null
  if (label) {
    lab = label.node.cloneNode(true) as HTMLElement
    Object.assign(lab.style, {
      position: 'absolute',
      left: px(label.rect.left - to.box.left),
      top: px(label.rect.top - to.box.top),
      width: px(label.rect.width),
      height: px(label.rect.height),
      right: 'auto',
      bottom: 'auto',
      margin: '0',
      opacity: '0',
    })
    box.appendChild(lab)
  }
  document.body.appendChild(box)
  const opt = { duration: DUR, easing: EASE, fill: 'both' as const, delay }
  const anims = [box.animate([boxStyle(from), boxStyle(to)], opt), img.animate([imgStyle(from), imgStyle(to)], opt)]
  if (lab) anims.push(lab.animate([{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }], { duration: DUR, easing: 'linear', fill: 'both', delay }))
  await Promise.all(anims.map((a) => a.finished.catch(() => undefined)))
  box.remove()
}

// Las 4 cards a la vez: primero la tocada y las demás en cascada corta.
function allIds(first: string) {
  const ids = Array.from(new Set(Array.from(document.querySelectorAll<HTMLElement>('[data-vcard]')).map((e) => e.dataset.vcard as string)))
  return [first, ...ids.filter((i) => i !== first)]
}
const STAGGER = 45

export function morphAllToAvatars(first: string) {
  allIds(first).forEach((id, i) => void morphCardToAvatar(id, i * STAGGER))
}

export function morphAllToCards(first: string) {
  allIds(first).forEach((id, i) => void morphAvatarToCard(id, i * STAGGER))
}
