import PortadasGallery from './PortadasGallery'
import { useUI } from '../../i18n/LanguageContext'
import type { PortadaProject } from './PortadasGallery'

// Proyectos de Diseño Industrial. Placeholders por ahora (degradado + monograma);
// se reemplazan por fotos y procesos reales a medida que Paula los va pasando.

const ALL_INDUSTRIAL: PortadaProject[] = [
  {
    id: 'dupla',
    title: 'Dupla',
    tagTop: 'Mobiliario',
    subtitle: 'Mobiliario',
    year: '2024',
    base: 'linear-gradient(135deg,#1f2a5a,#3b4c8f 55%,#d98b4a)',
    glow: '#f2b36e',
    monogram: 'D',
    image: 'proyectos/dupla/render-config.webp',
    caseStudy: {
      challenge: 'Diseñar un mueble multifuncional para jóvenes adultos de 25 a 35 años que viven solos en apartaestudios en Colombia, donde el poco espacio obliga a sacrificar el almacenamiento, el orden y un lugar cómodo para trabajar. El mueble debía integrar el diseño universal para que cualquier persona pudiera usarlo.',
      role: 'Desarrollé el proyecto de principio a fin como mi trabajo de grado en Diseño Industrial: la investigación con usuarios, el concepto, el modelado 3D y los renders, los planos técnicos, la identidad de marca, la fabricación de un prototipo funcional a escala real y su validación con usuarios.',
      tools: ['Rhinoceros', 'KeyShot', 'Krea AI'],
      result: 'Dupla, un mueble divisor modular que combina almacenamiento y un escritorio autoalmacenable y expandible. Reúne multifuncionalidad, diseño universal, ahorro de espacio, modularidad y personalización, y fue construido como prototipo funcional y validado con usuarios.',
    },
    showroom: {
      hero: 'proyectos/dupla/hero.webp',
      hotspots: [
        { x: 22, y: 30, label: 'Módulo armario', text: 'Cajón extraíble para colgar la ropa y barra LED con sensor.' },
        { x: 42, y: 14, label: 'Repisa en L', text: 'Accesorio opcional para libros, plantas y objetos decorativos.' },
        { x: 45, y: 62, label: 'Módulo cajones', text: 'Correderas de cierre lento y entrepaños para decorar.' },
        { x: 73, y: 68, label: 'Escritorio autoalmacenable', text: 'Se guarda dentro del módulo y se expande para trabajar cómodo.' },
      ],
      back: {
        hero: 'proyectos/dupla/hero-posterior.webp',
        hotspots: [
          { x: 70, y: 17, label: 'Repisa en L', text: 'Accesorio opcional que encaja en la esquina de cualquier módulo.' },
          { x: 47, y: 62, label: 'Entrepaños para decorar', text: 'Esta cara suma exhibición y decoración hacia la sala.' },
          { x: 72, y: 70, label: 'Escritorio autoalmacenable', text: 'Sale del módulo sobre ruedas con freno y se expande.' },
        ],
      },
      gallery: [
        'proyectos/dupla/prototipo-dia.webp',
        'proyectos/dupla/render-universal.webp',
        'proyectos/dupla/prototipo-noche-armario.webp',
        'proyectos/dupla/render-armario.webp',
        'proyectos/dupla/prototipo-escritorio.webp',
      ],
    },
    process: [
      'Dupla nació como mi trabajo de grado de Diseño Industrial en la Universidad El Bosque, dentro de la línea de Ergonomía y Diseño Universal. En Bogotá, las viviendas de menos de 40 m² pasaron de representar el 7 % en 2004 al 37 % en 2023, y los hogares unipersonales siguen creciendo. Quienes viven en apartaestudios suelen renunciar a espacios como el comedor o la sala y tienen poco lugar para guardar sus cosas.',
      'Trabajé con una metodología de cinco fases basada en el diseño centrado en el ser humano. Encuesté a 18 personas, analicé la oferta del mercado y definí los requerimientos del producto en una matriz de determinantes y parámetros. La principal problemática fue el almacenamiento, seguida de la necesidad de un espacio para trabajar o estudiar en casa. De ahí surgió la oportunidad: un solo mueble que almacene y a la vez ofrezca un espacio de trabajo.',
      'En la fase de creación pasé de los bocetos y la exploración con inteligencia artificial al modelado 3D, y validé las ideas con entrevistas a usuarios. Un prototipo en papel kraft a escala 1:1 mostró que el fondo del mueble era excesivo, así que lo reduje 10 cm hasta dejarlo en 50 cm, una medida adecuada tanto para un mueble divisor como para el escritorio autoalmacenable.',
      'El resultado es un mueble divisor con dos caras activas: hacia la alcoba prioriza el almacenamiento, y hacia la sala suma decoración y un espacio de trabajo. Está compuesto por cuatro módulos (armario, escritorio, cajones y sillas) que el usuario organiza según su espacio, y por accesorios como las repisas y el reposapiés. Incorpora puertas push open, correderas de cierre lento y barras LED con sensor, y lo evalué con figuras humanas entre los percentiles 5 y 95 para asegurar que fuera usable por la mayor cantidad de personas.',
      'También desarrollé la identidad de marca, con una paleta de azules y amarillos, la tipografía Poppins y una submarca «dp» que se lee igual al girarla 180°, en referencia a las dos caras del producto. Elaboré los planos técnicos y construí un prototipo de alta fidelidad a escala real, en láminas de flormorado, junto con un taller de carpintería. Además, planteé una estrategia de ecodiseño que aprovecha retales de madera para producir tableros reciclados.',
      'Finalmente, validé el prototipo con usuarios mediante la técnica de pensamiento en voz alta. Destacaron los acabados y lo práctico del mueble, y sus comentarios me llevaron a ajustar detalles: reubicar la luz LED en la parte inferior del armario porque encandilaba, y reducir la profundidad del cajón extraíble para no tapar la ropa colgada.',
    ],
  },
  {
    id: 'brisa',
    title: 'Brisa',
    tagTop: 'Producto',
    subtitle: 'Producto',
    year: '2022',
    base: 'linear-gradient(135deg,#0b2a33,#0f4a57 55%,#187e91)',
    glow: '#6fe0d4',
    monogram: 'B',
    // DATOS DE PRUEBA (inventados). Reemplazar por los reales.
    caseStudy: {
      challenge: 'Diseñar un ventilador portátil que se pudiera llevar a cualquier lado sin ocupar espacio.',
      role: 'Diseño del concepto, modelado 3D, planos técnicos y renders.',
      tools: ['Rhinoceros', 'KeyShot'],
      result: 'Un ventilador plegable y compacto que cabe en la palma de la mano.',
    },
    // DATOS DE PRUEBA (imágenes de la libreta y de Habilidades). Reemplazar por las reales.
    showroom: {
      hero: 'Di/brisa.png',
      hotspots: [
        { x: 38, y: 40, label: 'Rejilla abatible', text: 'Se pliega para guardarse en poco espacio.' },
        { x: 62, y: 68, label: 'Luz integrada', text: 'Anillo de luz de tres intensidades.' },
      ],
      gallery: ['habilidades/3d-1.jpg', 'habilidades/3d-2.jpg', 'habilidades/3d-3.jpg', 'Di/plano dupla.png', 'habilidades/animacion-1.jpg'],
    },
    process: [],
  },
  {
    id: 'diseno-producto',
    title: 'Diseño de producto',
    tagTop: 'Producto',
    subtitle: 'Diseño de producto',
    year: '',
    base: 'linear-gradient(135deg,#3a2a08,#6b4c10 55%,#c98a1d)',
    glow: '#ffd36e',
    monogram: 'P',
    image: 'proyectos/producto-brisa.jpg',
    hideType: true,
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['Rhinoceros', 'ZBrush', 'KeyShot'],
      result: '',
    },
    photosLayout: 'feature-left-wide',
    photos: [
      { src: 'proyectos/producto-brisa.jpg', caption: 'Brisa' },
      { src: 'proyectos/producto-lumina.jpg', caption: 'Lumina' },
      { src: 'proyectos/producto-escultura.jpg', caption: 'Escultura 3D' },
      { src: 'proyectos/producto-render.jpg', caption: 'Renderizado' },
    ],
    process: [
      'Me interesa entender cómo las personas interactúan con los objetos: cómo los toman, los usan y los incorporan a su cotidianidad. Antes de definir una forma, busco comprender qué necesidad debe resolver y qué experiencia quiero generar. A partir de ahí, exploro la relación entre función, ergonomía y lenguaje visual.',
      'Llevo las ideas del boceto al modelo digital. Utilizo Rhinoceros para desarrollar geometrías, proporciones y detalles; ZBrush para explorar volúmenes y formas orgánicas, y KeyShot para experimentar con materiales, acabados e iluminación hasta conseguir una representación fiel a la intención del diseño.',
      'Brisa es un ventilador portátil concebido para integrarse naturalmente en el espacio. Su lenguaje de líneas limpias y formas sencillas busca equilibrar funcionalidad y estética en un objeto de uso cotidiano.',
      'Lumina es una lámpara que explora la relación entre luz y forma. Su diseño busca darle presencia al objeto incluso cuando está apagado, mientras que al encenderse crea una atmósfera cálida en el espacio.',
      'Escultura 3D es un ejercicio de exploración del modelado orgánico y el detalle digital. A través de ZBrush trabajé volúmenes, texturas y transiciones para conseguir una pieza con riqueza formal y profundidad.',
      'Renderizado reúne una exploración de visualización fotorrealista aplicada a un par de tenis. El trabajo se centra en recrear materiales, texturas e iluminación para construir una imagen que transmita las características del producto con el mayor realismo posible.',
      'Cada proyecto representa una oportunidad para explorar distintas maneras de materializar una idea. Desde el objeto físico hasta su representación digital, busco que las decisiones de diseño tengan intención y que el resultado comunique tanto su función como su personalidad.',
    ],
  },
  {
    id: 'diseno-mobiliario',
    title: 'Diseño de mobiliario',
    tagTop: 'Mobiliario',
    subtitle: 'Diseño de mobiliario',
    year: '',
    base: 'linear-gradient(135deg,#2c1a10,#54301b 55%,#8f5a30)',
    glow: '#e8b17e',
    monogram: 'M',
    image: 'proyectos/mobiliario-poltrona.jpg',
    hideType: true,
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['KeyShot', 'Rhinoceros', 'Fusion 360'],
      result: '',
    },
    photosLayout: 'feature-left',
    photos: [
      { src: 'proyectos/mobiliario-estante.jpg', caption: 'Brote' },
      { src: 'proyectos/mobiliario-sakuru-1.jpg', caption: 'Sakuru' },
      { src: 'proyectos/mobiliario-poltrona.jpg', caption: 'Nido' },
      { src: 'proyectos/mobiliario-sakuru-2.jpg', caption: 'Sakuru' },
    ],
    process: [
      'Mi proceso parte de entender cómo las personas usan y habitan los espacios. Busco que cada pieza vaya más allá de su función principal: que se transforme, aproveche el espacio y encuentre un equilibrio entre comodidad, utilidad y estética.',
      'Desde los primeros bocetos considero cómo llevar cada idea a la realidad. Exploro materiales, uniones y posibilidades constructivas; modelo en Rhinoceros y Fusion 360 para desarrollar y validar las formas y mecanismos, y utilizo KeyShot para visualizar el resultado. En algunos proyectos también llevo el proceso hasta la fabricación, lo que me permite entender cada pieza desde el concepto hasta su materialización.',
      'Sakuru es una mesa de centro multifuncional con tapa giratoria, bandeja integrada y bancos curvos que se guardan bajo su estructura.',
      'Nido es una poltrona que desarrollé desde la conceptualización hasta su fabricación final, cuidando tanto su forma como la experiencia de uso.',
      'Brote es un estante metálico que diseñé y fabriqué personalmente, explorando la relación entre estructura, material y funcionalidad.',
      'Más que diseñar objetos, busco crear soluciones que tengan sentido en la vida cotidiana. Cada pieza es una oportunidad para explorar nuevas posibilidades, experimentar con materiales y llevar una idea más allá del papel.',
    ],
  },
]

// Solo se muestran estos tres, en este orden (Brisa queda guardado arriba por si se vuelve a usar).
export const INDUSTRIAL_PROJECTS: PortadaProject[] = ['dupla', 'diseno-producto', 'diseno-mobiliario']
  .map((id) => ALL_INDUSTRIAL.find((p) => p.id === id))
  .filter((p): p is PortadaProject => !!p)

// Lista liviana para el dropdown de acceso rápido en la barra lateral.
export const INDUSTRIAL_PROJECT_LIST = INDUSTRIAL_PROJECTS.map((p) => ({ id: p.id, title: p.title }))

export default function IndustrialGallery({
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
      projects={INDUSTRIAL_PROJECTS}
      heading={t.gallery.headings.industrial.title}
      subheading={t.gallery.headings.industrial.sub}
      openId={openId}
      openToken={openToken}
      onOpenChange={onOpenChange}
    />
  )
}
