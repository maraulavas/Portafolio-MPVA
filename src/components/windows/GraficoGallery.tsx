import PortadasGallery from './PortadasGallery'
import { useUI } from '../../i18n/LanguageContext'
import type { PortadaProject } from './PortadasGallery'

// Proyectos de Diseño Gráfico. Placeholders por ahora (degradado + monograma);
// ordenados de más reciente a más antiguo.
// `year` vacío = aún no definido (no se muestra).

export const GRAFICO_PROJECTS: PortadaProject[] = [
  {
    id: 'sinalu',
    title: 'Sinalu',
    tagTop: 'Identidad visual',
    subtitle: 'Diseño gráfico · Identidad visual',
    year: '2025',
    base: 'linear-gradient(135deg,#6B3D88,#D7A3EF)',
    glow: '#D7A3EF',
    monogram: 'S',
    image: 'proyectos/sinalu/portada-bandana.jpg',
    // DATOS DE PRUEBA (inventados): la paleta (salvo los colores tomados del flyer) y las tipografías.
    caseStudy: {
      challenge: 'Crear una identidad visual para una clínica veterinaria que transmitiera cariño y confianza, con una imagen cercana y amigable tanto para las personas como para sus mascotas.',
      role: 'Diseñé la identidad visual de Sinalu, desarrollando el concepto del logotipo, la paleta cromática y el sistema tipográfico para construir una marca coherente, expresiva y reconocible.',
      tools: ['Illustrator', 'Photoshop'],
      result: 'Una identidad visual distintiva y versátil, con un logotipo que integra siluetas de animales en las letras y una estética cálida y lúdica que refleja la personalidad de la clínica.',
    },
    process: [
      'Sinalu es una clínica veterinaria que buscaba proyectar una imagen más cercana, capaz de transmitir cariño y confianza a las personas que visitan sus instalaciones con sus mascotas.',
      'El punto de partida del proyecto fue el propio nombre de la marca. A través de la exploración de sus formas tipográficas, integré siluetas de animales en las letras «n» y «u», convirtiendo el logotipo en un recurso visual que representa a las mascotas de manera creativa. Además, incorporé una huella sobre la «i», reforzando el concepto y aportando un carácter lúdico y memorable.',
      'A partir del logotipo, desarrollé un sistema de identidad visual con una paleta de lilas y tonos suaves, contrastada con un morado uva y complementada por acentos en durazno, rosa, blanco y arena. Esta combinación busca transmitir calidez y amabilidad sin perder el profesionalismo propio de una clínica veterinaria.',
      'La selección tipográfica también contribuye a esa personalidad. Utilicé Nunito por sus formas redondeadas y su legibilidad, acompañada de Caveat para incorporar detalles más espontáneos y expresivos.',
      'Finalmente, diseñé el logotipo para funcionar tanto en positivo como en negativo, favoreciendo su versatilidad en diferentes fondos y contextos de uso.',
      'El resultado es una identidad visual con personalidad propia, en la que la tipografía se convierte en parte central del concepto y comunica de forma cercana el vínculo entre las personas y sus mascotas.',
    ],
    brand: {
      coverBg: '#D7A3EF',
      whiteLogoOn: ['#D7A3EF', '#F3C18E', '#D7C3A1'],
      logo: 'proyectos/sinalu/logo-positivo.svg',
      logoOnColor: 'proyectos/sinalu/logo-negativo.svg',
      colors: [
        { name: 'Uva', hex: '#6B3D88' },
        { name: 'Lila', hex: '#D7A3EF' },
        { name: 'Durazno', hex: '#F3C18E' },
        { name: 'Arena', hex: '#D7C3A1' },
        { name: 'Bluewash', hex: '#E2E2E2' },
        { name: 'Black Beauty', hex: '#1C0635' },
      ],
      fonts: [
        { name: 'Nunito', style: 'ExtraBold', role: 'Títulos', family: "'Nunito', sans-serif", weight: 800 },
        { name: 'Caveat', style: 'SemiBold', role: 'Detalles', family: "'Caveat', cursive", weight: 600 },
        { name: 'Nunito', style: 'Regular', role: 'Cuerpo de texto', family: "'Nunito', sans-serif", weight: 400 },
      ],
      mockups: [
        'proyectos/sinalu/mockup-tote-blanca.webp',
        'proyectos/sinalu/mockup-bandana.webp',
        'proyectos/sinalu/mockup-uniforme.webp',
      ],
    },
  },
  {
    id: 'mainatek-grafico',
    title: 'Mainatek',
    tagTop: 'Rebranding',
    subtitle: 'Diseño gráfico · Rebranding',
    year: '2024',
    base: 'linear-gradient(135deg,#14245D,#1C0635)',
    glow: '#6A93F1',
    monogram: 'M',
    image: 'proyectos/mainatek-marca/portada.jpg',
    caseStudy: {
      challenge: 'Construir una identidad visual para una empresa de tecnología que transmitiera confianza y profesionalismo, diferenciara su propuesta de valor y conectara su marca con la innovación y la inteligencia artificial.',
      role: 'Desarrollé el rebranding integral de Mainatek, desde el logotipo y el sistema visual hasta sus aplicaciones corporativas y digitales. Diseñé el brochure, las firmas electrónicas, el membrete y el video corporativo, además de proponer una presencia coherente en redes sociales y sitio web.',
      tools: ['Illustrator', 'Photoshop', 'Canva'],
      result: 'Una identidad visual integral, documentada en un manual de marca y aplicada a materiales corporativos, audiovisuales y digitales, que unifica la comunicación de Mainatek y fortalece su reconocimiento en los diferentes puntos de contacto con sus clientes.',
    },
    process: [
      'Mainatek es una empresa de soluciones de tecnología informática que buscaba consolidar una identidad visual capaz de comunicar confianza, profesionalismo y calidad, al tiempo que reflejara su relación con la inteligencia artificial y la innovación tecnológica.',
      'El proceso de rebranding comenzó con el desarrollo de un logotipo que combina una tipografía sans serif, de carácter cercano y seguro, con un recurso visual que destaca las letras «A» e «I» para establecer una asociación con la inteligencia artificial. También diseñé una submarca a partir de las letras M, T y K, concebida para facilitar el reconocimiento de la empresa en diferentes formatos.',
      'A partir de estos elementos, definí un sistema visual que incluye una paleta de azules y verdes asociados con la tecnología, la seguridad y la confianza; la familia tipográfica Inter Tight; y una textura geométrica circular que aporta dinamismo a las composiciones. El sistema se complementó con criterios de uso del logotipo, combinaciones cromáticas y lineamientos para preservar su legibilidad y consistencia.',
      'El proyecto también contempló el desarrollo de diferentes aplicaciones de marca para trasladar esta identidad a los puntos de contacto de la empresa. Diseñé piezas corporativas como el brochure, las firmas electrónicas y el membrete, además de un video corporativo. Asimismo, desarrollé una propuesta de presencia digital que abarcó las redes sociales y el sitio web, buscando mantener una comunicación visual consistente en los distintos canales.',
      'Finalmente, consolidé los lineamientos y aplicaciones en un manual de marca que establece las bases para implementar la identidad y mantener su coherencia en futuras piezas y plataformas.',
      'El resultado es un sistema de identidad visual integral que articula los valores de Mainatek con un lenguaje gráfico reconocible y flexible, y que se extiende desde sus materiales corporativos hasta su presencia digital.',
    ],
    brand: {
      logo: 'proyectos/mainatek-marca/logo-positivo.png',
      logoOnColor: 'proyectos/mainatek-marca/logo-negativo.png',
      coverBg: '#6A93F1', // Bonnie Blue
      colors: [
        { name: 'Blue Opal', hex: '#14245D' },
        { name: 'Bonnie Blue', hex: '#6A93F1' },
        { name: 'Opal', hex: '#96DAC7' },
        { name: 'Black Beauty', hex: '#1C0635' },
        { name: 'Bluewash', hex: '#E2E2E2' },
        { name: 'Jet Black', hex: '#313131' },
      ],
      fonts: [
        { name: 'Inter Tight', style: 'Bold', role: 'Títulos', family: "'Inter Tight', sans-serif", weight: 700 },
        { name: 'Inter Tight', style: 'Semibold Italic', role: 'Detalles', family: "'Inter Tight', sans-serif", weight: 600, italic: true },
        { name: 'Inter Tight', style: 'Regular', role: 'Cuerpo de texto', family: "'Inter Tight', sans-serif", weight: 400 },
      ],
      mockups: [
        'proyectos/mainatek-marca/mockup-servicios.jpg',
        'proyectos/mainatek-marca/mockup-poster.jpg',
        'proyectos/mainatek-marca/mockup-portavasos.jpg',
        'proyectos/mainatek-marca/mockup-caja.jpg',
      ],
    },
  },
  {
    id: 'behome-light',
    title: 'Be Home Light',
    tagTop: 'Identidad visual',
    subtitle: 'Diseño gráfico · Identidad visual',
    year: '2024',
    base: 'linear-gradient(135deg,#184870,#32485B)',
    glow: '#469B7C',
    monogram: 'B',
    image: 'proyectos/behome/portada.jpg',
    caseStudy: {
      challenge: 'Crear una identidad visual para una tienda online de decoración e iluminación que transmitiera creatividad, elegancia y alegría, y conectara sus productos con la idea de transformar los espacios del hogar.',
      role: 'Diseñé la identidad visual integral de la marca, desde el logotipo y la submarca hasta la paleta cromática, la tipografía, la iconografía ilustrada, los patrones gráficos y sus aplicaciones.',
      tools: ['Illustrator', 'Photoshop', 'Canva'],
      result: 'Una identidad visual distintiva y coherente que combina creatividad, elegancia y alegría en un lenguaje gráfico propio, conectando la decoración y la iluminación con una visión contemporánea del hogar.',
    },
    process: [
      'Be Home Light es una tienda online de objetos de decoración e iluminación para el hogar. El proyecto consistió en desarrollar una identidad visual que reflejara la esencia de la marca a partir de tres conceptos principales: creatividad, elegancia y alegría.',
      'El proceso comenzó con el diseño del logotipo, para el que elegí una tipografía sans serif de carácter expresivo e informal. El alargamiento de algunas letras aporta dinamismo, mientras que el juego visual dentro de la letra «o» integra la silueta de una casa con un destello, conectando los conceptos de hogar y luz. Este recurso también dio origen a la submarca, diseñada para funcionar como un elemento gráfico reconocible por sí mismo.',
      'A partir de estos elementos, construí un sistema visual con una paleta de azules, verdes y amarillo verdoso, seleccionados para transmitir elegancia, naturaleza y alegría. La identidad se complementó con la tipografía Rethink Sans y una colección de cinco íconos ilustrados inspirados en elementos de decoración, como lámparas, plantas, velas, espejos y flores de loto.',
      'Para ampliar las posibilidades de aplicación, desarrollé un patrón gráfico que combina la iconografía con el lema «Design for home», creando una textura propia de la marca. También preparé aplicaciones y mockups para visualizar su uso en diferentes soportes, incluyendo etiquetas y portavasos.',
      'Finalmente, reuní los elementos y lineamientos en un manual de identidad visual que establece criterios para el uso del logotipo, los colores, la tipografía y los recursos gráficos, garantizando una comunicación consistente.',
      'El resultado es una identidad visual con un lenguaje gráfico propio, capaz de transmitir la personalidad de Be Home Light y de mantener su coherencia en las distintas aplicaciones de la marca.',
    ],
    brand: {
      logo: 'proyectos/behome/logo-positivo.png',
      logoOnColor: 'proyectos/behome/logo-negativo.png',
      colors: [
        { name: 'Deep Lagoon', hex: '#184870' },
        { name: 'Simply Green', hex: '#469B7C' },
        { name: 'Sharp Green', hex: '#C6DB76' },
        { name: 'Legion Blue', hex: '#32485B' },
        { name: 'Zephyr Blue', hex: '#D4D9D0' },
        { name: 'Dark Shadow', hex: '#4D4D4D' },
      ],
      fonts: [
        { name: 'Rethink Sans', style: 'Extrabold', role: 'Títulos', family: "'Rethink Sans', sans-serif", weight: 800 },
        { name: 'Rethink Sans', style: 'Semibold Italic', role: 'Detalles', family: "'Rethink Sans', sans-serif", weight: 600, italic: true },
        { name: 'Rethink Sans', style: 'Regular', role: 'Cuerpo de texto', family: "'Rethink Sans', sans-serif", weight: 400 },
      ],
      mockups: [
        'proyectos/behome/mockup-manual.jpg',
        'proyectos/behome/mockup-poster.jpg',
        'proyectos/behome/mockup-portavasos.jpg',
        'proyectos/behome/mockup-etiqueta.jpg',
      ],
    },
  },
]

// Lista liviana para el dropdown de acceso rápido en la barra lateral.
export const GRAFICO_PROJECT_LIST = GRAFICO_PROJECTS.map((p) => ({ id: p.id, title: p.title }))

export default function GraficoGallery({
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
      projects={GRAFICO_PROJECTS}
      heading={t.gallery.headings.grafico.title}
      subheading={t.gallery.headings.grafico.sub}
      openId={openId}
      openToken={openToken}
      onOpenChange={onOpenChange}
    />
  )
}
