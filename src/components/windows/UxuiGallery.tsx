import PortadasGallery from './PortadasGallery'
import { useUI } from '../../i18n/LanguageContext'
import type { PortadaProject } from './PortadasGallery'

// Proyectos reales de UX/UI, ordenados de más reciente a más antiguo.
// Ver PortadasGallery para el diseño de las cards (estilo "Top Picks" de macOS
// Music). Si un proyecto tiene `image`, se usa una captura real del sitio como
// portada; si no, degradado + monograma.

export const UX_PROJECTS: PortadaProject[] = [
  {
    id: 'sgi',
    title: 'SGI S.A.S.',
    tagTop: 'sgisas.co',
    subtitle: 'Diseño UX/UI · Rediseño web',
    year: '2026',
    url: 'https://sgisas.co/paginaWebSGI/paginas/',
    base: 'linear-gradient(135deg,#0b1f3d,#173e75 55%,#2f66c4)',
    glow: '#6fa8ff',
    monogram: 'S',
    image: 'proyectos/sgi-cover.jpg',
    preview: 'proyectos/sgi-home-v2.webp',
    previewMobile: 'proyectos/sgi-mobile.webp',
    caseStudy: {
      challenge: 'Rediseñar un sitio web con una identidad consolidada, pero con problemas de navegación, una estructura poco intuitiva y oportunidades de mejora en accesibilidad, adaptación móvil y dinamismo visual.',
      role: 'Lideré el rediseño del sitio y coordiné la investigación con actores clave de la empresa. Recopilé y analicé sus necesidades para traducirlas en una experiencia digital alineada con sus objetivos y su identidad.',
      tools: ['Figma', 'Claude', 'Photoshop'],
      result: 'Un sitio web con más de 11 secciones, una arquitectura de información más clara y una navegación intuitiva, accesible y adaptable a dispositivos móviles, que comunica la trayectoria y el profesionalismo de una empresa con más de 32 años de experiencia.',
    },
    process: [
      'SGI es una empresa con más de 32 años de trayectoria en geociencias e ingeniería ambiental. En 2024 desarrollé el primer rediseño de su sitio web, como parte de una iniciativa para fortalecer su presencia digital y construir una identidad visual propia.',
      'Hasta entonces, el sitio reunía la información de la empresa, pero carecía de una identidad definida y de un diseño que la representara. La primera renovación, diseñada en Adobe XD, buscó resolver estas necesidades. El proyecto se desarrolló durante seis meses junto a una desarrolladora front-end.',
      'En 2026 retomé el proyecto con un nuevo objetivo: llevar la experiencia digital a un nivel superior. Aunque la versión anterior ya contaba con una identidad más cercana a SGI, presentaba oportunidades de mejora en navegación, jerarquía visual, accesibilidad y experiencia de usuario. Además, no estaba adaptada a dispositivos móviles.',
      'Esta vez asumí el proceso de manera autónoma, apoyándome en Claude como herramienta de trabajo. En solo un mes, rediseñé y publiqué una nueva versión, con una estructura más clara, una experiencia adaptable a diferentes dispositivos y una interfaz más cuidada y accesible.',
      'El resultado es un sitio web que comunica mejor la experiencia, la solidez y el profesionalismo de SGI, conectando su trayectoria con una presencia digital más actual.',
    ],
  },
  {
    id: 'creacion-digital',
    title: 'Creación Digital',
    tagTop: 'creaciondigital-ueb.netlify.app',
    subtitle: 'Diseño UX/UI · Implementación',
    year: '2026',
    url: 'https://creaciondigital-ueb.netlify.app/',
    base: 'linear-gradient(135deg,#1e1738,#33246b 55%,#5237a8)',
    glow: '#c9a8ff',
    monogram: 'CD',
    image: 'proyectos/creacion-digital-cover-2.jpg',
    preview: 'proyectos/creacion-digital-home.webp',
    previewMobile: 'proyectos/creacion-digital-mobile.webp',
    caseStudy: {
      challenge: 'Crear una experiencia web que comunicara la propuesta de valor de Creación Digital de forma dinámica e interactiva, conectando con aspirantes, estudiantes, familias y empresas interesadas en el programa.',
      role: 'Partí de la propuesta inicial del docente Carlos Almeyda y continué liderando el desarrollo del proyecto, estructurando la experiencia web y articulando contenidos, diseño visual e interactividad con la identidad del programa.',
      tools: ['Figma', 'Claude', 'ChatGPT', 'Higgsfield'],
      result: 'Una plataforma web que presenta el programa de forma visual, dinámica e interactiva, facilita el acceso a información relevante para distintos públicos y mantiene una identidad gráfica coherente a través de imágenes creadas con inteligencia artificial.',
    },
    process: [
      'Creación Digital es un pregrado de la Universidad El Bosque, el primero de su tipo en Colombia, que forma a profesionales en distintos campos de la creación, como producto digital y código, videojuegos y experiencias 3D, creación de contenido, generación de negocios y uso de IA. El proyecto nació a partir de una propuesta inicial del docente Carlos Almeyda, con la intención de crear un espacio digital que permitiera presentar el pregrado en Creación Digital de una manera más atractiva, dinámica e interactiva. A partir de esta idea, continué desarrollando la propuesta hasta convertirla en una experiencia web orientada a comunicar la esencia y las posibilidades del programa.',
      'El principal desafío consistía en reunir información académica y transmitirla de forma accesible a públicos con diferentes intereses: aspirantes que buscan conocer su futura carrera, estudiantes, padres de familia y empresas interesadas en el talento y las capacidades de nuestros futuros profesionales.',
      'Para ello, trabajé en el diseño de la experiencia y la estructura visual en Figma, y utilicé Claude como apoyo en el desarrollo del sitio. La propuesta busca ir más allá de una página informativa tradicional, mediante una presentación visual que invite a explorar el programa y descubrir sus diferentes dimensiones.',
      'Un componente fundamental fue la creación de imágenes con herramientas de inteligencia artificial, como ChatGPT y Higgsfield. Estas piezas se desarrollaron siguiendo una línea visual consistente con la identidad del programa, con el propósito de construir un lenguaje gráfico reconocible y reforzar la personalidad de la experiencia digital.',
      'El resultado es una plataforma que acerca Creación Digital a sus diferentes públicos mediante una comunicación visual contemporánea, una experiencia interactiva y una identidad gráfica alineada con el espíritu creativo del programa.',
    ],
  },
  {
    id: 'mainatek',
    title: 'Mainatek',
    tagTop: 'mainatek.com',
    subtitle: 'Rebranding · Diseño web',
    year: '2026',
    url: 'https://www.mainatek.com/',
    base: 'linear-gradient(135deg,#131417,#242730 55%,#3a3f4a)',
    glow: '#5eead4',
    monogram: 'M',
    image: 'proyectos/mainatek-cover.jpg',
    preview: 'proyectos/mainatek-home.webp',
    previewMobile: 'proyectos/mainatek-mobile.webp',
    caseStudy: {
      challenge: 'Renovar la presencia digital de una marca de tecnología e inteligencia artificial cuya primera página web no transmitía con suficiente fuerza su identidad visual, innovación ni propuesta de valor.',
      role: 'Lideré el diseño de la identidad visual y del sitio web, desde la conceptualización de la marca hasta el diseño de sus interfaces. Integré las perspectivas de los gerentes para alinear la propuesta visual con los objetivos del negocio.',
      tools: ['Adobe XD', 'Claude', 'Photoshop'],
      result: 'Un sitio web de ocho secciones, con una identidad visual renovada, navegación intuitiva y diseño responsive. Una experiencia coherente y adaptable a distintos dispositivos que proyecta una imagen más innovadora y profesional de Mainatek.',
    },
    process: [
      'Mainatek es una empresa de tecnología que ofrece soluciones de software y hardware, automatización de procesos, integración de aplicaciones e inteligencia artificial generativa. Buscaba fortalecer su presencia digital y comunicar con mayor claridad su propuesta de valor en el sector tecnológico. Aunque ya contaba con una página web, su identidad visual tenía poca presencia y no lograba transmitir plenamente la innovación de la marca.',
      'La primera etapa del proyecto consistió en renovar la identidad visual y diseñar una nueva propuesta para el sitio web en Adobe XD. El objetivo era construir un lenguaje visual más sólido y trasladarlo a una experiencia digital coherente, cuidando la estructura, la presentación de los servicios y la consistencia entre las distintas secciones.',
      'Durante el proceso, incorporé las perspectivas de los gerentes para comprender las prioridades del negocio y alinear las decisiones de diseño con los objetivos de la empresa.',
      'Posteriormente, retomé el proyecto para llevar el diseño a su implementación con apoyo de Claude. También trabajé en la adaptación responsive, contemplando las necesidades de navegación y visualización en distintos dispositivos, desde computadores hasta teléfonos móviles.',
      'El resultado fue un sitio web de ocho secciones que integra la identidad renovada de Mainatek con una experiencia digital clara, consistente y adaptable, fortaleciendo la presentación de sus servicios y su imagen profesional.',
    ],
  },
  {
    id: 'fundacion-sgi',
    title: 'Fundación S.G.I.',
    tagTop: 'fundacion.sgisas.co',
    subtitle: 'Diseño UX/UI · Diseño con IA',
    year: '2026',
    url: 'https://fundacion.sgisas.co/',
    base: 'linear-gradient(135deg,#0d2818,#164a2a 55%,#1f6b3d)',
    glow: '#e6b45c',
    monogram: 'F',
    image: 'proyectos/fundacion-sgi-cover.jpg',
    preview: 'proyectos/fundacion-sgi-home.webp',
    previewMobile: 'proyectos/fundacion-sgi-mobile.webp',
    caseStudy: {
      challenge: 'Dar visibilidad al trabajo social y ambiental de la Fundación SGI mediante un sitio web propio que reuniera sus iniciativas, comunicara su impacto y reflejara la importancia de su labor con las comunidades.',
      role: 'Diseñé y desarrollé el sitio web, estructurando los contenidos y definiendo una experiencia visual alineada con el enfoque social y ambiental de la fundación, desde la identidad gráfica hasta su adaptación responsive.',
      tools: ['Claude', 'Figma'],
      result: 'Un sitio web independiente de siete secciones que presenta a la Fundación SGI, su trabajo con las comunidades desde 2014 y sus iniciativas de educación ambiental, aviturismo y sostenibilidad, mediante una experiencia visual dinámica y adaptable a dispositivos móviles.',
    },
    process: [
      'La Fundación SGI desarrolla desde 2014 iniciativas orientadas al bienestar de las comunidades, la educación ambiental y el desarrollo sostenible. Su trabajo abarca diferentes líneas de acción, entre ellas la educación ambiental, el aviturismo y la promoción de prácticas sostenibles.',
      'Inicialmente, la fundación contaba con un apartado dentro del sitio web corporativo de SGI. Sin embargo, la amplitud de sus iniciativas y el impacto de su labor hicieron evidente la necesidad de contar con un espacio digital propio, capaz de comunicar su propósito y dar mayor visibilidad a los proyectos que desarrolla.',
      'En 2026 diseñé y desarrollé un sitio web independiente de siete secciones, con una propuesta visual inspirada en la naturaleza y el medio ambiente. El objetivo fue alejarse de una estética excesivamente institucional y construir una experiencia más dinámica, cercana y visual, que permitiera explorar las diferentes líneas de trabajo de la fundación y comprender su aporte a las comunidades.',
      'La organización de los contenidos y los recursos visuales se plantearon para destacar las iniciativas, las personas y los entornos que hacen parte de su labor. Asimismo, incorporé un diseño responsive para garantizar una navegación adaptada a distintos dispositivos y facilitar el acceso a la información desde computadores, tabletas y teléfonos móviles.',
      'El resultado es una plataforma digital que otorga mayor protagonismo a la Fundación SGI, comunica su compromiso social y ambiental y permite presentar de manera más clara el trabajo que ha construido junto a las comunidades durante más de una década.',
    ],
  },
  {
    id: 'app-sgi',
    title: 'App SGI',
    tagTop: 'App',
    subtitle: 'Diseño UX/UI · Diseño de app',
    year: '2024',
    base: 'linear-gradient(135deg,#0f2417,#1d4028 55%,#3a6b2a)',
    glow: '#a3d65c',
    monogram: 'A',
    image: 'proyectos/app-sgi/app-sgi-2-inicio.webp',
    gallery: [
      'proyectos/app-sgi/app-sgi-1-login.webp',
      'proyectos/app-sgi/app-sgi-2-inicio.webp',
      'proyectos/app-sgi/app-sgi-3-solicitar.webp',
      'proyectos/app-sgi/app-sgi-4-orden-compra.webp',
      'proyectos/app-sgi/app-sgi-5-activos-especializados.webp',
    ],
    caseStudy: {
      challenge: 'Centralizar los procesos internos de una empresa de entre 700 y 1.000 empleados, anteriormente distribuidos en distintas plataformas, en un sistema flexible, escalable y adaptado a las necesidades operativas de SGI.',
      role: 'Lidero el diseño UX/UI desde la investigación con usuarios y la definición de flujos hasta el diseño de interfaces y prototipos. Actualmente, también desarrollo el frontend con apoyo de Claude, integrando diseño y código en un mismo proceso.',
      tools: ['Figma', 'Claude', 'Adobe XD'],
      result: 'Una plataforma centralizada que integra múltiples procesos empresariales, mejora la trazabilidad y la seguridad de la información, y ha permitido reducir los tiempos de algunos procesos hasta en un 30 %, con una arquitectura preparada para incorporar nuevos módulos.',
    },
    process: [
      'Desde 2024, SGI desarrolla una plataforma interna orientada a centralizar y optimizar los procesos de una organización de entre 700 y 1.000 empleados. Anteriormente, distintas áreas dependían de plataformas externas y soluciones de terceros, lo que dificultaba la integración de la información, limitaba la personalización y aumentaba la complejidad de implementar nuevas funcionalidades.',
      'La iniciativa comenzó en las áreas de desarrollo de software y diseño, con el objetivo de construir una solución propia, adaptable a las necesidades operativas de la empresa y capaz de evolucionar junto con ella.',
      'El desarrollo inició con el módulo de Compras e Inventarios, que reúne funcionalidades para gestionar requisiciones, órdenes de compra, entregas de activos, inventarios y proveedores. Posteriormente, la plataforma amplió su alcance con módulos de anticipos, legalizaciones, contabilidad y recursos humanos, incluyendo procesos como paz y salvos y evaluaciones de desempeño.',
      'Como diseñadora principal, he acompañado la evolución de la plataforma desde la investigación y el diseño centrado en las personas. En la etapa inicial, trabajaba junto con la líder del área para identificar necesidades, acercarme a los usuarios y comprender sus flujos de trabajo. A partir de estos hallazgos, diseñaba los recorridos y las interfaces en Figma, que posteriormente eran prototipados e implementados por los equipos de desarrollo frontend y backend.',
      'Actualmente, mi rol integra el diseño UX/UI y el desarrollo frontend. Aprovechando las bibliotecas de componentes, estructuras y frameworks construidos durante el proyecto, utilizo Claude como herramienta de apoyo para convertir las decisiones de diseño en interfaces funcionales de manera más directa. Esta evolución ha agilizado el proceso de desarrollo y reducido la distancia entre la conceptualización y la implementación, manteniendo el foco en la usabilidad y las necesidades reales de los usuarios.',
      'El resultado es una plataforma empresarial en constante crecimiento que centraliza procesos, facilita la trazabilidad, fortalece el control de la información y permite adaptar las herramientas digitales a la operación de SGI. Según los resultados reportados por la empresa, algunos procesos han reducido sus tiempos hasta en un 30 %, demostrando el valor de combinar diseño centrado en las personas, tecnología y mejora continua.',
    ],
  },
]

// Lista liviana para el dropdown de acceso rápido en la barra lateral.
export const UX_PROJECT_LIST = UX_PROJECTS.map((p) => ({ id: p.id, title: p.title }))

export default function UxuiGallery({
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
      projects={UX_PROJECTS}
      heading={t.gallery.headings.uxui.title}
      subheading={t.gallery.headings.uxui.sub}
      openId={openId}
      openToken={openToken}
      onOpenChange={onOpenChange}
    />
  )
}
