import * as es from '../data/content'
import * as en from './content.en'
import { useLang } from './LanguageContext'
import type { Lang } from './LanguageContext'

/** Contenido (versiones, chats, documentos y contacto) en el idioma activo. */
export function useContent() {
  const { lang } = useLang()
  const src = lang === 'en' ? en : es
  return {
    projectAreas: src.projectAreas,
    aboutChats: src.aboutChats,
    documents: src.documents,
    contact: src.contact,
  }
}

/** Aplica los textos en inglés a un proyecto de galería (título, categoría, proceso). */
export function localizeProject<T extends { id: string; title: string; tagTop: string; subtitle: string; process?: string[] }>(
  p: T,
  lang: Lang,
): T {
  if (lang === 'es') return p
  const t = en.projectText[p.id]
  return t ? { ...p, ...t } : p
}

/** Título de un proyecto en el idioma activo (para listas rápidas). */
export function projectTitle(id: string, title: string, lang: Lang) {
  return lang === 'en' ? en.projectText[id]?.title ?? title : title
}
