import PortadasGallery from './PortadasGallery'
import { useUI } from '../../i18n/LanguageContext'
import type { PortadaProject } from './PortadasGallery'

// Otros proyectos (exploración & IA). Placeholders por ahora (degradado + monograma);
// se reemplazan por piezas reales y procesos a medida que Paula los va pasando.

export const OTROS_PROJECTS: PortadaProject[] = [
  {
    id: 'experimentos-ia',
    title: 'Experimentos con IA',
    tagTop: 'Exploración',
    subtitle: 'Exploración con IA',
    year: '',
    base: 'linear-gradient(135deg,#1c1030,#32195c 55%,#7c4bc9)',
    glow: '#c9a8ff',
    monogram: 'IA',
    image: 'proyectos/ia-poster-2.jpg',
    photosLayout: 'feature-left-wide',
    photos: [
      { src: 'proyectos/ia-poster-2.jpg', video: 'proyectos/ia-video-2.mp4', caption: 'MIRA' },
      { src: 'proyectos/ia-poster-1.jpg', video: 'proyectos/ia-video-1.mp4', caption: 'Entre etiquetas' },
      { src: 'proyectos/ia-poster-3.jpg', video: 'proyectos/ia-video-3.mp4', caption: 'The Proposal' },
    ],
    hideType: true,
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['Higgsfield', 'Claude'],
      result: '',
    },
    process: [
      'Me interesa explorar cómo la inteligencia artificial está transformando los procesos creativos y las posibilidades que abre para el diseño y la producción audiovisual. Más que utilizar una herramienta por sus resultados, me gusta entender su lenguaje, experimentar con sus capacidades y descubrir cómo integrarla en un proceso creativo con una intención clara.',
      'Cada proyecto parte de una idea y se desarrolla a través de la exploración de diferentes herramientas, modelos y recursos. El objetivo no es solamente generar imágenes o videos, sino construir piezas con dirección visual, intención narrativa y coherencia estética.',
      'MIRA es una exploración de contenido publicitario para un espejo portátil. Desarrollé diferentes escenarios de comunicación para el producto y una transición entre escenas mediante la técnica de morphing. Realizado con Higgsfield.',
      'Entre etiquetas es un cortometraje desarrollado para el programa de Creación Digital. A través de una narrativa conceptual, aborda la necesidad de cuestionar las etiquetas que nos definen y encontrar una identidad propia. Realizado con Claude y Higgsfield mediante la integración de su conector.',
      'The Proposal es un cortometraje cinematográfico de terror que construye una historia alrededor del desenlace inesperado de una cita. Una exploración de la narrativa audiovisual, la atmósfera y el lenguaje cinematográfico mediante Higgsfield Cinema.',
      'La inteligencia artificial amplía las posibilidades de lo que podemos imaginar y crear. Para mí, lo interesante está en aprender a dirigir esas posibilidades, experimentar sin perder la intención y descubrir nuevas formas de contar historias.',
    ],
  },
  {
    id: 'contenido-redes',
    title: 'Contenido para redes',
    tagTop: 'Social media',
    subtitle: 'Social media',
    year: '',
    base: 'linear-gradient(135deg,#2c0f1f,#5c1b3d 55%,#a52c6e)',
    glow: '#ff8fc4',
    monogram: 'CR',
    photosLayout: 'grid',
    // Cuadrícula 3x3: fotos en las esquinas, videos en cruz.
    photos: [
      { src: 'proyectos/redes-3derizo-3.jpg' },
      { src: 'proyectos/redes-poster-1.jpg', video: 'proyectos/redes-video-1.mp4' },
      { src: 'proyectos/redes-3derizo-2.jpg' },
      { src: 'proyectos/redes-poster-2.jpg', video: 'proyectos/redes-video-2.mp4' },
      { src: 'proyectos/redes-poster-3.jpg', video: 'proyectos/redes-video-3.mp4' },
      { src: 'proyectos/redes-poster-4.jpg', video: 'proyectos/redes-video-4.mp4' },
      { src: 'proyectos/redes-3derizo-1.jpg' },
      { src: 'proyectos/redes-poster-5.jpg', video: 'proyectos/redes-video-5.mp4' },
      { src: 'proyectos/redes-3derizo-5.jpg' },
    ],
    hideType: true,
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['Canva', 'CapCut', 'Photoshop'],
      result: '',
    },
    process: [
      'Crear contenido para redes es encontrar la mejor manera de contar algo y lograr que conecte con quien lo ve. Me interesa explorar cómo una idea puede convertirse en una pieza audiovisual capaz de informar, despertar curiosidad y transmitir la personalidad de una marca o comunidad.',
      'Desde que soy líder de comunicaciones de Creación Digital, me he encargado de contar lo que pasa en el programa a través de las redes sociales. He realizado videos sobre la carrera, sus estudiantes y todo lo que hacemos, con la intención de que quien los vea entienda cómo se vive la experiencia de estudiar Creación Digital y se sienta parte de ella.',
      'Cada pieza parte de una historia: un proyecto, una persona o un momento del programa. A partir de ahí, defino el formato, el ritmo y el lenguaje visual para construir contenido claro, cercano y coherente con la identidad de Creación Digital.',
      'También he creado contenido para 3derizo, donde comunico y promociono productos fabricados mediante impresión 3D. En este caso, el reto está en encontrar la manera de presentar cada objeto de forma atractiva, destacando sus detalles, acabados y particularidades.',
      'Aunque los proyectos y sus públicos son distintos, en ambos busco lo mismo: entender qué hace especial a cada historia o producto y encontrar una forma visual de comunicarlo que capte la atención y genere conexión.',
    ],
  },
  {
    id: 'ilustracion-digital',
    title: 'Ilustración digital',
    tagTop: 'Ilustración',
    subtitle: 'Ilustración digital',
    year: '',
    base: 'linear-gradient(135deg,#0f2a2c,#1b5a5c 55%,#2ca5a0)',
    glow: '#8ff0e8',
    monogram: 'ID',
    photosLayout: 'grid',
    photos: [
      { src: 'proyectos/ilustracion-1.jpg' },
      { src: 'proyectos/ilustracion-2.jpg' },
      { src: 'proyectos/ilustracion-3.jpg' },
      { src: 'proyectos/ilustracion-4.jpg' },
      { src: 'proyectos/ilustracion-5.jpg' },
      { src: 'proyectos/ilustracion-6.jpg' },
    ],
    hideType: true,
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['Procreate', 'Photoshop', 'Illustrator'],
      result: '',
    },
    process: [
      'La ilustración digital es una forma de transformar ideas en imágenes y explorar distintas maneras de comunicar a través de ellas. Es un espacio en el que puedo experimentar libremente con el color, las formas y la composición, sin partir necesariamente de un encargo, sino de mi propia curiosidad.',
      'Parto de ideas sencillas, cosas que observo o imagino, y las desarrollo a través de formas limpias, paletas de color definidas y atención al detalle. Cada ilustración es una oportunidad para explorar cómo pocos elementos pueden construir una imagen, transmitir una idea o generar una sensación.',
      'Esta serie reúne piezas que he creado en distintos momentos y que reflejan parte de esa exploración. Más que responder a un estilo único, son una muestra de mi búsqueda constante por experimentar, encontrar nuevas formas de expresión y construir un lenguaje visual propio.',
    ],
  },
]

// Lista liviana para el dropdown de acceso rápido en la barra lateral.
export const OTROS_PROJECT_LIST = OTROS_PROJECTS.map((p) => ({ id: p.id, title: p.title }))

export default function OtrosGallery({
  openId = null,
  openToken = 0,
  onOpenChange,
}: {
  openId?: string | null
  openToken?: number
  onOpenChange?: (id: string | null) => void
}) {
  const t = useUI()
  return (
    <PortadasGallery
      projects={OTROS_PROJECTS}
      heading={t.gallery.headings.otros.title}
      subheading={t.gallery.headings.otros.sub}
      openId={openId}
      openToken={openToken}
      onOpenChange={onOpenChange}
    />
  )
}
