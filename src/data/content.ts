// Contenido centralizado del portafolio.
// TODO(contenido): reemplazar placeholders por el contenido real de Maria Paula.
// Está aislado aquí para facilitar el paso a inglés más adelante (i18n).

export type WindowId = 'about' | 'projects' | 'documents' | 'contact'

export interface AboutContent {
  name: string
  role: string
  tagline: string
  intro: string
  location: string
  skills: string[]
  tools: string[]
  studies: { title: string; place: string; period: string }[]
}

export type ProjectAreaId = 'uxui' | 'grafico' | 'industrial' | 'otros'

// Las 4 "versiones" de Maria Paula: una por habilidad, cada una sostiene un objeto.
export interface ProjectArea {
  id: ProjectAreaId
  name: string
  object: string // el objeto que sostiene esa versión
  accent: string
  title: string // nombre del perfil (panel izquierdo del home)
  description: string
}

export const projectAreas: ProjectArea[] = [
  {
    id: 'uxui',
    name: 'UX/UI',
    object: 'Computador',
    accent: '#f83f92',
    title: 'Diseñadora UX/UI',
    description:
      'Diseño experiencias digitales claras y bonitas: apps, webs y sistemas de diseño pensados en las personas.',
  },
  {
    id: 'grafico',
    name: 'Gráfico',
    object: 'iPad',
    accent: '#e01f76',
    title: 'Diseñadora Gráfica',
    description:
      'Identidad visual, ilustración y piezas editoriales con una dirección de arte con intención.',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    object: 'Libreta',
    accent: '#ff69ac',
    title: 'Diseñadora Industrial',
    description:
      'Diseño de producto y mobiliario: objetos funcionales que resuelven necesidades reales con estética cuidada.',
  },
  {
    id: 'otros',
    name: 'Otros',
    object: 'Celular',
    accent: '#ff9ac6',
    title: 'Exploración & IA',
    description:
      'Experimentos creativos, contenido y proyectos donde mezclo el diseño con inteligencia artificial.',
  },
]

export interface Project {
  id: string
  title: string
  area: ProjectAreaId
  description: string
  year: string
  cover: string // color/gradiente placeholder por ahora
  tags: string[]
}

export interface DocFile {
  id: string
  label: string
  filename: string
  href: string // TODO(contenido): apuntar al PDF real en /public/docs
  sizeHint: string
}

export const about: AboutContent = {
  name: 'Maria Paula Vásquez Arango',
  role: 'Diseñadora UX/UI · Industrial · Gráfica',
  tagline: 'Diseño que combina estética con inteligencia artificial.',
  intro:
    'Soy diseñadora multidisciplinar. Me muevo entre lo digital, lo industrial y lo gráfico, ' +
    'y últimamente exploro cómo la IA transforma el proceso creativo. Este es un texto de ejemplo ' +
    'que reemplazaremos por tu bio real.',
  location: 'Colombia',
  skills: [
    'Diseño UX/UI',
    'Diseño de producto',
    'Identidad visual',
    'Prototipado',
    'Dirección de arte',
    'Diseño con IA',
  ],
  tools: ['Figma', 'Illustrator', 'Photoshop', 'After Effects', 'Midjourney', 'Blender'],
  studies: [
    { title: 'Diseño Industrial', place: 'Universidad (placeholder)', period: '20XX – 20XX' },
    { title: 'Especialización en UX/UI', place: 'Institución (placeholder)', period: '20XX' },
  ],
}

export const projects: Project[] = [
  // UX/UI — versión con computador
  {
    id: 'u1',
    title: 'App de banca digital',
    area: 'uxui',
    description: 'Rediseño de flujo y sistema de componentes. Placeholder.',
    year: '2025',
    cover: 'linear-gradient(135deg,#bae6fd,#0ea5e9)',
    tags: ['App', 'Research', 'Prototipo'],
  },
  {
    id: 'u2',
    title: 'Design system web',
    area: 'uxui',
    description: 'Librería de UI y tokens para producto. Placeholder.',
    year: '2024',
    cover: 'linear-gradient(135deg,#93c5fd,#2563eb)',
    tags: ['Web', 'Design system'],
  },
  // Gráfico — versión con iPad
  {
    id: 'g1',
    title: 'Identidad de marca',
    area: 'grafico',
    description: 'Logo, paleta y aplicaciones. Placeholder.',
    year: '2025',
    cover: 'linear-gradient(135deg,#fbcfe8,#ec4899)',
    tags: ['Branding', 'Logo'],
  },
  {
    id: 'g2',
    title: 'Pieza editorial / póster',
    area: 'grafico',
    description: 'Composición tipográfica e ilustración. Placeholder.',
    year: '2024',
    cover: 'linear-gradient(135deg,#fde68a,#fb923c)',
    tags: ['Editorial', 'Ilustración'],
  },
  // Industrial — versión con libreta
  {
    id: 'i1',
    title: 'Brisa',
    area: 'industrial',
    description:
      'Mobiliario multifuncional y modular para espacios pequeños o monoambientes que aprovecha ambas caras del mueble para ofrecer una funcionalidad distinta para cada espacio. Ideal para usar en dormitorios y salas.',
    year: '2024',
    cover: 'linear-gradient(135deg,#fde68a,#f59e0b)',
    tags: ['Producto', '3D'],
  },
  {
    id: 'i2',
    title: 'Lumínica',
    area: 'industrial',
    description:
      'Mobiliario multifuncional y modular para espacios pequeños o monoambientes que aprovecha ambas caras del mueble para ofrecer una funcionalidad distinta para cada espacio. Ideal para usar en dormitorios y salas.',
    year: '2024',
    cover: 'linear-gradient(135deg,#fed7aa,#ea580c)',
    tags: ['Packaging', 'Prototipo'],
  },
  {
    id: 'i3',
    title: '3D',
    area: 'industrial',
    description:
      'Mobiliario multifuncional y modular para espacios pequeños o monoambientes que aprovecha ambas caras del mueble para ofrecer una funcionalidad distinta para cada espacio. Ideal para usar en dormitorios y salas.',
    year: '2024',
    cover: 'linear-gradient(135deg,#fcd34d,#d97706)',
    tags: ['Producto', 'Concepto'],
  },
  // Otros — versión con celular
  {
    id: 'o1',
    title: 'Experimentos con IA',
    area: 'otros',
    description: 'Exploraciones de imagen y contenido con IA. Placeholder.',
    year: '2025',
    cover: 'linear-gradient(135deg,#ddd6fe,#8b5cf6)',
    tags: ['IA', 'Concept'],
  },
  {
    id: 'o2',
    title: 'Contenido para redes',
    area: 'otros',
    description: 'Formatos y plantillas para social media. Placeholder.',
    year: '2024',
    cover: 'linear-gradient(135deg,#e9d5ff,#7c3aed)',
    tags: ['Social', 'Motion'],
  },
]

export const documents: DocFile[] = [
  {
    id: 'cv',
    label: 'Hoja de vida',
    filename: 'hoja-de-vida-es.pdf',
    href: '/assets/docs/hoja-de-vida-es.pdf',
    sizeHint: '70 KB',
  },
  {
    id: 'portafolio',
    label: 'Portafolio (PDF)',
    filename: 'portafolio-es.pdf',
    href: '/assets/docs/portafolio-es.pdf',
    sizeHint: '8.4 MB',
  },
]

// ---------------------------------------------------------------------------
// Chat "Sobre mí" — la ventana Sobre mí es una app de mensajes.
// El visitante NO escribe: toca preguntas predeterminadas y "Paula" responde.
// Edita libremente los textos de abajo (saludos, preguntas y respuestas).
// ---------------------------------------------------------------------------

// Una respuesta puede ser texto, una foto, un video (de public/assets), un botón de acción,
// una tarjeta de enlace (preview estilo WhatsApp) o un "mensaje simulado del visitante" (meAsk)
// para encadenar una segunda parte de la respuesta como si el visitante hubiera preguntado
// algo más (p. ej. "¡Interesante! ¿Qué más?").
export type ChatAnswer =
  | string
  | { image: string; caption?: string }
  | { video: string; poster?: string; caption?: string }
  | { action: 'open-contact'; label: string }
  | { meAsk: string }
  | { link: string; title: string; description?: string; site: string; accent: string; icon: string }

export interface ChatQA {
  q: string // pregunta que toca el visitante
  a: ChatAnswer[] // burbujas de respuesta de Paula (texto o { image })
  // Pregunta de seguimiento: mientras esté pendiente, reemplaza temporalmente a las
  // demás opciones del chat (para armar una mini-conversación encadenada). Al responderla,
  // si tiene su propio `next` se sigue encadenando; si no, se vuelve a las preguntas normales.
  next?: ChatQA
}

export interface AboutChat {
  id: string
  name: string // nombre en la lista y en el encabezado
  role: string // línea de estado / subtítulo
  emoji?: string // avatar para los chats temáticos (si no usa foto)
  icon?: string // imagen de assets (sin extensión) para el avatar
  photo?: boolean // usa la foto de Paula como avatar (chat general)
  accent: string // color del avatar (degradado)
  greeting: string[] // primer(os) mensaje(s) de Paula al abrir el chat
  questions: ChatQA[]
}

export const aboutChats: AboutChat[] = [
  {
    id: 'paula',
    name: 'Maria Paula',
    role: 'en línea',
    photo: true,
    accent: 'linear-gradient(150deg,#ff9ac6,#f83f92 60%,#b8145d)',
    greeting: ['¡Hola! Soy Maria Paula', 'Toca una pregunta y con gusto te cuento sobre mí.'],
    questions: [
      {
        q: '¿Quién eres?',
        a: [
          'Soy diseñadora multidisciplinar: me muevo entre el diseño industrial, el gráfico y, sobre todo, el UX/UI.',
          'Soy muy versátil y me adapto a cualquier entorno. No le pongo límites a la forma en la que expreso mi creatividad.',
          'Me emocionan los retos y aprender cosas nuevas',
        ],
      },
      {
        q: '¿Cómo integras la IA?',
        a: [
          'La IA se ha vuelto una herramienta fundamental para mí: me ayuda a explorar ideas, conceptos y estrategias, y a trabajar de forma más rápida y eficaz.',
          'Trabajo de la mano con ella: potencia las habilidades que he construido a lo largo de mis años como diseñadora, pero el trabajo final siempre lo hago yo.',
        ],
      },
      {
        q: 'Dime algo curioso de ti',
        a: [
          'Me apasiona aprender cosas que antes pensaba que nunca podría hacer, y así romper mis propios límites mentales.',
          'Este año, por ejemplo, hice un videojuego desde cero sin saber nada de programación, apoyándome en la inteligencia artificial para programarlo.',
          'Estoy muy orgullosa: nunca pensé que podría lograrlo y me demostré a mí misma que sí podía',
          { image: 'videojuego/1.jpg', caption: 'Se llama "La Travesía de Briel", un videojuego de aventuras en pixelart 2D' },
          {
            image: 'videojuego/2.jpg',
            caption: 'Tiene 5 niveles (3 de acción y 2 de trivia) y varios personajes que le dan vida a la historia.',
          },
          {
            video: 'videojuego/demo.mp4',
            poster: 'videojuego/demo-poster.jpg',
            caption: 'Aquí te dejo un poco de cómo se juega. Activa el sonido',
          },
        ],
      },
      {
        q: '¿Qué idiomas hablas?',
        a: [
          'Hablo español e inglés: en 2023 hice el iTEP y me certifiqué como C1. Puedo comunicarme y trabajar en ambos idiomas sin problema.',
          'También le tengo cariño al italiano, lo estudié durante un tiempo, pero más como pasatiempo',
        ],
      },
      {
        q: '¿Cómo te contacto?',
        a: [
          '¿Te interesa trabajar juntos? Escríbeme, ¡me encantaría saber de ti!',
          { action: 'open-contact', label: 'Ver mis datos de contacto' },
        ],
      },
    ],
  },
  {
    id: 'experiencia',
    name: 'Experiencia profesional',
    role: 'trayectoria',
    emoji: '',
    icon: 'maletin',
    accent: 'linear-gradient(150deg,#ffbcdb,#ff7fb8)',
    greeting: ['Mi experiencia profesional'],
    questions: [
      {
        q: '¿Cuál es tu recorrido profesional?',
        a: [
          'Desde 2024 soy líder del área de diseño y me desempeño como diseñadora UX/UI en el equipo de desarrollo de SGI S.A.S.',
          'Nuestro proyecto principal ha sido la aplicación de gestión interna de la empresa, que integra más de 5 módulos (compras e inventarios, anticipos, contabilidad, recursos humanos, entre otros) que operan y se complementan entre sí para mejorar los procesos internos.',
          'Estuve presente en todo el proceso: desde la conceptualización, pasando por el diseño, hasta la implementación final en producción.',
          'Además, doy soporte a los usuarios y desarrollo el material de capacitación.',
        ],
        next: {
          q: '¿Qué más hiciste en SGI?',
          a: [
            'También lideré nuestra presencia digital: en 2024 hice el primer rediseño de la página de SGI, como parte de la iniciativa de fortalecer nuestra presencia en redes. Hoy ya está lista una nueva versión rediseñada.',
            {
              link: 'https://sgisas.co/paginaWebSGI/paginas/',
              title: 'SGI S.A.S.',
              description: 'Consultoría, ingeniería y servicios ambientales con más de 30 años de experiencia.',
              site: 'sgisas.co',
              accent: 'linear-gradient(150deg,#3b82f6,#1d4ed8)',
              icon: '',
            },
            'Este mes lanzamos la página web de la Fundación SGI, que diseñé con Claude y Figma. Busca contarle al mundo el trabajo de la fundación por toda Colombia, llevando educación en salud alimentaria y sostenibilidad a las instituciones.',
            {
              link: 'https://fundacion.sgisas.co/',
              title: 'Fundación S.G.I.',
              description: 'Desarrollo social y ambiental en Colombia: huertas escolares, proyectos ambientales y programas educativos.',
              site: 'fundacion.sgisas.co',
              accent: 'linear-gradient(150deg,#4ade80,#16a34a)',
              icon: '',
            },
          ],
          next: {
            q: '¡Genial! ¿Dónde más has trabajado?',
            a: [
              'También soy líder de Comunicaciones del pregrado de Creación Digital en la Universidad El Bosque, encargándome de las redes y de toda la estrategia de comunicación del programa.',
              'Puedes ver más del programa en nuestro nuevo micrositio, donde también trabajé en el diseño y la implementación final.',
              {
                link: 'https://creaciondigital-ueb.netlify.app/',
                title: 'Creación Digital · Universidad El Bosque',
                description: 'Pregrado en Creación Digital. No vinimos a dictar clase: vinimos a crear.',
                site: 'creaciondigital-ueb.netlify.app',
                accent: 'linear-gradient(150deg,#818cf8,#4338ca)',
                icon: '',
              },
            ],
            next: {
              q: '¿Qué más hiciste en la universidad?',
              a: [
                'Actualmente soy docente de planta.',
                'En 2025-2 y 2026-1 dicté Humanismo Digital I, donde exploramos la relación entre la tecnología, la IA y el desarrollo humano: desde el lenguaje y la relación con los demás, hasta la política, la seguridad, los datos personales, la cultura y la educación.',
                'En 2026-2 dictaré Composición Plástica IV, donde aprenderemos a integrar la IA y la tecnología en la composición audiovisual.',
                'Además, soy la docente líder del semillero Álgora, donde exploramos la inteligencia artificial aplicada a procesos creativos.',
              ],
            },
          },
        },
      },
      {
        q: '¿Has trabajado como freelance?',
        a: [
          'Sí, he trabajado de forma independiente para varias empresas.',
          'Para Mainatek hice el rebranding completo y el diseño de su sitio web.',
          'Para Behomelight, una tienda online de productos para el hogar, diseñé toda su identidad visual.',
          'Y para Sinalu, una clínica veterinaria, también diseñé su identidad de marca.',
        ],
      },
      {
        q: '¿Algo curioso de tu experiencia?',
        a: [
          'Hice mis prácticas en Zientte, donde estuve un año completo en el área de desarrollo y diseño.',
          'Ahí conocí de cerca el mundo del mobiliario de alta gama, documentando y preparando la información para la correcta fabricación de cada pieza: planos técnicos, renders, datos de producción, entre otros.',
          'Fue un año donde aprendí todo el proceso creativo detrás de hacer muebles de la más alta calidad.',
        ],
      },
    ],
  },
  {
    id: 'educacion',
    name: 'Educación',
    role: 'formación',
    emoji: '',
    icon: 'birrete',
    accent: 'linear-gradient(150deg,#ffb6d5,#ff73ae)',
    greeting: ['Esto es lo que he estudiado'],
    questions: [
      {
        q: '¿Dónde estudiaste?',
        a: [
          'Soy graduada de Diseño Industrial de la Universidad El Bosque.',
          'Durante mi carrera me apasionó el diseño de mobiliario y el diseño de interiores, pero también me destaqué por mi versatilidad.',
        ],
        next: {
          q: '¿Qué más hiciste en la universidad?',
          a: [
            'También fui tutora de Fundamentos de Geometría y Representación 1, apoyando a los estudiantes en representación tridimensional de objetos y planos técnicos.',
            'Fui miembro y líder del semillero de investigación de dibujo a mano alzada "Los Mano Alzada", de la Facultad de Creación y Comunicación. Investigamos técnicas de ilustración, creamos contenido para las redes del semillero y participamos en ponencias y encuentros de investigación-creación.',
            'Entre 2021 y 2022 fui representante estudiantil de Diseño Industrial, participando en procesos para buscar oportunidades de mejora en la experiencia de los estudiantes.',
          ],
          next: {
            q: '¿Tuviste algún reconocimiento?',
            a: [
              'Sí, obtuve la beca de Excelencia Académica en 3 oportunidades distintas, que premiaba el mejor promedio del programa.',
              'También hice servicio social, trabajando con comunidades como niños y adultos mayores.',
            ],
          },
        },
      },
      {
        q: '¿Tienes otros cursos o certificaciones?',
        a: [
          'Sí, en agosto de 2025 hice el curso de UX/UI: Diseño de productos digitales innovadores, de la Universidad de los Andes.',
          { image: 'certificado-uxui-uniandes-2025.jpg', caption: 'Mi certificado del curso' },
        ],
      },
    ],
  },
  {
    id: 'habilidades',
    name: 'Habilidades',
    role: 'qué sé hacer',
    emoji: '',
    icon: 'paleta',
    accent: 'linear-gradient(150deg,#ffb9d8,#ff78b3)',
    greeting: ['Estas son mis habilidades y herramientas'],
    questions: [
      {
        q: '¿Cuáles son tus habilidades?',
        a: [
          'Por un lado, hago diseño UX/UI y diseño web.',
          'También sé hacer modelado y renderizado 3D, y escultura digital.',
          { image: 'habilidades/3d-3.jpg' },
          'Últimamente me ha interesado hacer animaciones de producto y transiciones con IA.',
          { video: 'habilidades/animacion-demo.mp4', poster: 'habilidades/animacion-demo-poster.jpg' },
          'Por último, también me apasiona la identidad visual y la ilustración digital.',
        ],
      },
      {
        q: '¿Qué herramientas usas?',
        a: [
          'Para diseño UX/UI uso Figma y Adobe XD.',
          'Para el mundo 3D uso Rhinoceros, KeyShot y ZBrush.',
          'Y para diseño visual, identidad e ilustración uso la suite de Adobe, con especial enfoque en Illustrator y Photoshop, además de Canva, Affinity y Procreate.',
          'También uso varias herramientas de IA como Claude, Higgsfield, ChatGPT, Midjourney y Runway, entre otras. Son una parte importante de mis procesos creativos.',
        ],
      },
      {
        q: '¿En qué eres más fuerte?',
        a: [
          'Actualmente siento una gran afinidad con el mundo del UX/UI.',
          'Sin embargo, no me limito en mi creatividad: me gusta crear desde diferentes mundos.',
          'Lo que más me apasiona por el momento es el uso de la IA en distintos medios, porque me deja crear más allá de las habilidades y los límites que creía tener.',
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Contacto — tarjeta de perfil (ventana estilo iOS).
// Edita los enlaces reales de LinkedIn y Behance abajo.
// ---------------------------------------------------------------------------

export interface SocialLink {
  id: 'linkedin' | 'behance' | 'email'
  label: string
  value: string
  href: string
}

export interface ContactContent {
  name: string
  role: string
  handle: string
  description: string
  links: SocialLink[]
}

export const contact: ContactContent = {
  name: 'Maria Paula Vásquez Arango',
  role: 'Diseñadora UX/UI · Industrial · Gráfica',
  handle: '@mariapvasquez',
  description: 'Diseño que combina estética con inteligencia artificial. ¿Trabajamos juntos?',
  links: [
    { id: 'linkedin', label: 'LinkedIn', value: 'mariapvasquez', href: 'https://www.linkedin.com/in/mariapvasquez/' },
    { id: 'behance', label: 'Behance', value: 'mariapvasquez', href: 'https://www.behance.net/mariapvasquez' },
    { id: 'email', label: 'Correo', value: 'm.paulavasqueza@gmail.com', href: 'mailto:m.paulavasqueza@gmail.com' },
  ],
}
