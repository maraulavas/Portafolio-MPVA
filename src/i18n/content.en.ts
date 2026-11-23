// Contenido en inglés. Mismo orden y estructura que data/content.ts (español):
// si cambias algo en español, actualiza aquí su versión en inglés.
import { aboutChats as aboutChatsEs, contact as contactEs, documents as documentsEs, projectAreas as projectAreasEs } from '../data/content'
import type { CaseStudy, Showroom } from '../components/windows/PortadasGallery'
import type { AboutChat, ContactContent, DocFile, ProjectArea, ProjectAreaId } from '../data/content'

const areaText: Record<ProjectAreaId, Pick<ProjectArea, 'name' | 'object' | 'title' | 'description'>> = {
  uxui: {
    name: 'UX/UI',
    object: 'Laptop',
    title: 'UX/UI Designer',
    description: 'I design clear, beautiful digital experiences: apps, websites and design systems built around people.',
  },
  industrial: {
    name: 'Industrial',
    object: 'Notebook',
    title: 'Industrial Designer',
    description: 'Product and furniture design: functional objects that solve real needs with a carefully crafted aesthetic.',
  },
  grafico: {
    name: 'Graphic',
    object: 'iPad',
    title: 'Graphic Designer',
    description: 'Visual identity, illustration and editorial pieces with purposeful art direction.',
  },
  otros: {
    name: 'Other',
    object: 'Phone',
    title: 'Exploration & AI',
    description: 'Creative experiments, content and projects where I blend design with artificial intelligence.',
  },
}

export const projectAreas: ProjectArea[] = projectAreasEs.map((a) => ({ ...a, ...areaText[a.id] }))

const docEn: Record<string, { label: string; filename: string; href?: string; sizeHint?: string }> = {
  cv: { label: 'Resume', filename: 'resume-en.pdf', href: '/assets/docs/resume-en.pdf', sizeHint: '65 KB' },
  portafolio: { label: 'Portfolio (PDF)', filename: 'portfolio-en.pdf', href: '/assets/docs/portfolio-en.pdf', sizeHint: '8.1 MB' },
}

export const documents: DocFile[] = documentsEs.map((d) => ({ ...d, ...(docEn[d.id] ?? {}) }))

export const contact: ContactContent = {
  ...contactEs,
  role: 'UX/UI · Industrial · Graphic Designer',
  description: "Design that blends aesthetics with artificial intelligence. Want to work together?",
  links: contactEs.links.map((l) => (l.id === 'email' ? { ...l, label: 'Email' } : l)),
}

// Toma los colores de los avatares del español para no duplicarlos.
const accentOf = (id: string) => aboutChatsEs.find((c) => c.id === id)!.accent

export const aboutChats: AboutChat[] = [
  {
    id: 'paula',
    name: 'Maria Paula',
    role: 'online',
    photo: true,
    accent: accentOf('paula'),
    greeting: ["Hi! I'm Maria Paula", "Tap a question and I'll be happy to tell you about myself."],
    questions: [
      {
        q: 'Who are you?',
        a: [
          "I'm a multidisciplinary designer: I move between industrial design, graphic design and, above all, UX/UI.",
          "I'm very versatile and adapt to any environment. I don't put limits on the way I express my creativity.",
          'I love challenges and learning new things',
        ],
      },
      {
        q: 'How do you use AI?',
        a: [
          'AI has become a key tool for me: it helps me explore ideas, concepts and strategies, and work faster and more effectively.',
          'I work hand in hand with it: it boosts the skills I have built over my years as a designer, but the final work is always mine.',
        ],
      },
      {
        q: 'Tell me a fun fact about you',
        a: [
          'I love learning things I once thought I could never do, and breaking my own mental limits along the way.',
          'This year, for example, I made a video game from scratch without knowing anything about programming, relying on artificial intelligence to code it.',
          "I'm really proud of it: I never thought I could pull it off, and I proved to myself that I could",
          { image: 'videojuego/1.jpg', caption: 'It\'s called "La Travesía de Briel", a 2D pixel art adventure game' },
          {
            image: 'videojuego/2.jpg',
            caption: 'It has 5 levels (3 action and 2 trivia) and several characters that bring the story to life.',
          },
          {
            video: 'videojuego/demo.mp4',
            poster: 'videojuego/demo-poster.jpg',
            caption: "Here's a bit of how it plays. Turn the sound on",
          },
        ],
      },
      {
        q: 'What languages do you speak?',
        a: [
          'I speak Spanish and English: in 2023 I took the iTEP and got certified at C1 level. I can communicate and work in both languages with ease.',
          'I also have a soft spot for Italian; I studied it for a while, but more as a hobby',
        ],
      },
      {
        q: 'How can I contact you?',
        a: [
          "Interested in working together? Write to me, I'd love to hear from you!",
          { action: 'open-contact', label: 'See my contact info' },
        ],
      },
    ],
  },
  {
    id: 'experiencia',
    name: 'Work experience',
    role: 'career',
    emoji: '',
    icon: 'maletin',
    accent: accentOf('experiencia'),
    greeting: ['My work experience'],
    questions: [
      {
        q: 'What is your career path?',
        a: [
          "Since 2024 I have led the design area and worked as a UX/UI designer on SGI S.A.S.'s development team.",
          "Our main project has been the company's internal management app, which brings together more than 5 modules (purchasing and inventory, advances, accounting, human resources, among others) that run and complement each other to improve internal processes.",
          'I was part of the whole process: from concept, through design, to the final release in production.',
          'I also support users and create the training materials.',
        ],
        next: {
          q: 'What else did you do at SGI?',
          a: [
            "I also led our digital presence: in 2024 I did the first redesign of SGI's website, as part of the initiative to strengthen our online presence. A new redesigned version is now live.",
            {
              link: 'https://sgisas.co/paginaWebSGI/paginas/',
              title: 'SGI S.A.S.',
              description: 'Consulting, engineering and environmental services with more than 30 years of experience.',
              site: 'sgisas.co',
              accent: 'linear-gradient(150deg,#3b82f6,#1d4ed8)',
              icon: '',
            },
            "This month we launched the Fundación SGI website, which I designed with Claude and Figma. It aims to show the world the foundation's work across Colombia, bringing food-health and sustainability education to schools and institutions.",
            {
              link: 'https://fundacion.sgisas.co/',
              title: 'Fundación S.G.I.',
              description: 'Social and environmental development in Colombia: school gardens, environmental projects and educational programs.',
              site: 'fundacion.sgisas.co',
              accent: 'linear-gradient(150deg,#4ade80,#16a34a)',
              icon: '',
            },
          ],
          next: {
            q: 'Great! Where else have you worked?',
            a: [
              "I'm also the Communications lead for the Creación Digital undergraduate program at Universidad El Bosque, in charge of social media and the program's entire communication strategy.",
              'You can see more of the program on our new microsite, where I also worked on the design and the final build.',
              {
                link: 'https://creaciondigital-ueb.netlify.app/',
                title: 'Creación Digital · Universidad El Bosque',
                description: "Undergraduate program in Digital Creation. We didn't come to lecture: we came to create.",
                site: 'creaciondigital-ueb.netlify.app',
                accent: 'linear-gradient(150deg,#818cf8,#4338ca)',
                icon: '',
              },
            ],
            next: {
              q: 'What else did you do at the university?',
              a: [
                "I'm currently a full-time faculty member.",
                'In 2025-2 and 2026-1 I taught Digital Humanism I, where we explored the relationship between technology, AI and human development: from language and how we relate to others, to politics, security, personal data, culture and education.',
                'In 2026-2 I will teach Plastic Composition IV, where we will learn to integrate AI and technology into audiovisual composition.',
                "I'm also the lead faculty member of the Álgora research group, where we explore artificial intelligence applied to creative processes.",
              ],
            },
          },
        },
      },
      {
        q: 'Have you worked as a freelancer?',
        a: [
          "Yes, I've worked independently for several companies.",
          'For Mainatek I did the complete rebranding and the design of their website.',
          'For Behomelight, an online store for home products, I designed their entire visual identity.',
          'And for Sinalu, a veterinary clinic, I also designed their brand identity.',
        ],
      },
      {
        q: 'Any fun fact about your experience?',
        a: [
          'I did my internship at Zientte, where I spent a full year in the development and design area.',
          'There I got to know the world of high-end furniture up close, documenting and preparing the information for the correct manufacturing of each piece: technical drawings, renders, production data, among others.',
          'It was a year in which I learned the whole creative process behind making furniture of the highest quality.',
        ],
      },
    ],
  },
  {
    id: 'educacion',
    name: 'Education',
    role: 'studies',
    emoji: '',
    icon: 'birrete',
    accent: accentOf('educacion'),
    greeting: ["This is what I've studied"],
    questions: [
      {
        q: 'Where did you study?',
        a: [
          "I'm an Industrial Design graduate from Universidad El Bosque.",
          'During my degree I was passionate about furniture and interior design, but I also stood out for my versatility.',
        ],
        next: {
          q: 'What else did you do at university?',
          a: [
            'I was also a teaching assistant for Fundamentals of Geometry and Representation 1, helping students with three-dimensional object representation and technical drawings.',
            'I was a member and leader of the freehand drawing research group "Los Mano Alzada", at the Faculty of Creation and Communication. We researched illustration techniques, created content for the group\'s social media and took part in talks and research-creation events.',
            'Between 2021 and 2022 I was the Industrial Design student representative, taking part in processes to find ways to improve the student experience.',
          ],
          next: {
            q: 'Did you receive any awards?',
            a: [
              "Yes, I was awarded the Academic Excellence scholarship on 3 separate occasions, which recognized the program's highest GPA.",
              'I also did community service, working with communities such as children and older adults.',
            ],
          },
        },
      },
      {
        q: 'Do you have other courses or certifications?',
        a: [
          'Yes, in August 2025 I took the course UX/UI: Designing Innovative Digital Products, from Universidad de los Andes.',
          { image: 'certificado-uxui-uniandes-2025.jpg', caption: 'My course certificate' },
        ],
      },
    ],
  },
  {
    id: 'habilidades',
    name: 'Skills',
    role: 'what I do',
    emoji: '',
    icon: 'paleta',
    accent: accentOf('habilidades'),
    greeting: ['These are my skills and tools'],
    questions: [
      {
        q: 'What are your skills?',
        a: [
          'On one hand, I do UX/UI and web design.',
          'I also do 3D modeling and rendering, and digital sculpting.',
          { image: 'habilidades/3d-3.jpg' },
          "Lately I've been interested in making product animations and transitions with AI.",
          { video: 'habilidades/animacion-demo.mp4', poster: 'habilidades/animacion-demo-poster.jpg' },
          "Finally, I'm also passionate about visual identity and digital illustration.",
        ],
      },
      {
        q: 'What tools do you use?',
        a: [
          'For UX/UI design I use Figma and Adobe XD.',
          'For the 3D world I use Rhinoceros, KeyShot and ZBrush.',
          'And for visual design, identity and illustration I use the Adobe suite, with a special focus on Illustrator and Photoshop, as well as Canva, Affinity and Procreate.',
          'I also use several AI tools such as Claude, Higgsfield, ChatGPT, Midjourney and Runway, among others. They are an important part of my creative processes.',
        ],
      },
      {
        q: "What's your strongest area?",
        a: [
          'Right now I feel a strong affinity for the world of UX/UI.',
          "That said, I don't limit my creativity: I like to create across different worlds.",
          'What excites me most at the moment is using AI across different media, because it lets me create beyond the skills and limits I thought I had.',
        ],
      },
    ],
  },
]

// Proyectos de las galerías: solo los textos que cambian en inglés (por id).
export const projectText: Record<string, { title?: string; tagTop?: string; subtitle?: string; process?: string[]; caseStudy?: CaseStudy; showroom?: Showroom }> = {
  // UX/UI
  sgi: {
    caseStudy: {
      challenge: 'Redesign a website with a consolidated identity but with navigation problems, an unintuitive structure and room for improvement in accessibility, mobile adaptation and visual dynamism.',
      role: 'I led the redesign of the site and coordinated the research with the company’s key stakeholders. I gathered and analyzed their needs to turn them into a digital experience aligned with their goals and their identity.',
      tools: ['Figma', 'Claude', 'Photoshop'],
      result: 'A website with more than 11 sections, a clearer information architecture and intuitive, accessible navigation that adapts to mobile devices, communicating the track record and professionalism of a company with more than 32 years of experience.',
    },
    subtitle: 'UX/UI Design · Website redesign',
    process: [
      'SGI is a company with more than 32 years of experience in geosciences and environmental engineering. In 2024 I developed the first redesign of its website, as part of an initiative to strengthen its digital presence and build its own visual identity.',
      'Until then, the site gathered the company’s information but lacked a defined identity and a design that represented it. The first renovation, designed in Adobe XD, aimed to address these needs. The project ran for six months alongside a front-end developer.',
      'In 2026 I took the project up again with a new goal: to take the digital experience to the next level. Although the previous version already had an identity closer to SGI’s, it had room for improvement in navigation, visual hierarchy, accessibility and user experience. It was also not adapted to mobile devices.',
      'This time I took on the process autonomously, relying on Claude as a working tool. In just one month, I redesigned and launched a new version, with a clearer structure, an experience that adapts to different devices and a more polished, accessible interface.',
      'The result is a website that better communicates SGI’s experience, solidity and professionalism, connecting its track record with a more current digital presence.',
    ],
  },
  mainatek: {
    caseStudy: {
      challenge: 'Renew the digital presence of a technology and artificial intelligence brand whose first website did not convey its visual identity, innovation or value proposition strongly enough.',
      role: 'I led the design of the visual identity and the website, from the brand concept to the interface design. I integrated the managers’ perspectives to align the visual proposal with the business goals.',
      tools: ['Adobe XD', 'Claude', 'Photoshop'],
      result: 'An eight-section website with a renewed visual identity, intuitive navigation and responsive design. A consistent experience that adapts to different devices and projects a more innovative and professional image of Mainatek.',
    },
    subtitle: 'Rebranding · Web design',
    process: [
      'Mainatek is a technology company that offers software and hardware solutions, process automation, application integration and generative artificial intelligence. It wanted to strengthen its digital presence and communicate its value proposition more clearly in the technology sector. Although it already had a website, its visual identity had little presence and did not fully convey the brand’s innovation.',
      'The first stage of the project consisted of renewing the visual identity and designing a new proposal for the website in Adobe XD. The goal was to build a stronger visual language and carry it into a coherent digital experience, taking care of the structure, the presentation of the services and the consistency across sections.',
      'Throughout the process, I incorporated the managers’ perspectives to understand the business priorities and align the design decisions with the company’s goals.',
      'Later, I picked the project up again to take the design into implementation with the support of Claude. I also worked on the responsive adaptation, considering navigation and display needs across different devices, from computers to mobile phones.',
      'The result was an eight-section website that brings together Mainatek’s renewed identity with a clear, consistent and adaptable digital experience, strengthening the presentation of its services and its professional image.',
    ],
  },
  'creacion-digital': {
    caseStudy: {
      challenge: 'Create a web experience that communicated Creación Digital’s value proposition in a dynamic and interactive way, connecting with prospective students, current students, families and companies interested in the program.',
      role: 'I started from the initial proposal by professor Carlos Almeyda and continued leading the development of the project, structuring the web experience and bringing together content, visual design and interactivity with the program’s identity.',
      tools: ['Figma', 'Claude', 'ChatGPT', 'Higgsfield'],
      result: 'A web platform that presents the program in a visual, dynamic and interactive way, makes relevant information easy to reach for different audiences and keeps a consistent graphic identity through images created with artificial intelligence.',
    },
    subtitle: 'UX/UI Design · Implementation',
    process: [
      'Creación Digital is an undergraduate program at Universidad El Bosque, the first of its kind in Colombia, that trains professionals in different fields of creation, such as digital product and code, video games and 3D experiences, content creation, business generation and the use of AI. The project started from an initial proposal by professor Carlos Almeyda, with the intention of creating a digital space to present the Creación Digital undergraduate program in a more engaging, dynamic and interactive way. From that idea, I kept developing the proposal until it became a web experience aimed at communicating the essence and the possibilities of the program.',
      'The main challenge was to gather academic information and convey it in an accessible way to audiences with different interests: prospective students looking to learn about their future career, current students, parents and companies interested in the talent and capabilities of our future professionals.',
      'To do this, I worked on the experience design and visual structure in Figma, and used Claude as support in building the site. The proposal aims to go beyond a traditional informational page, through a visual presentation that invites people to explore the program and discover its different dimensions.',
      'A key component was the creation of images with artificial intelligence tools, such as ChatGPT and Higgsfield. These pieces were developed following a visual line consistent with the program’s identity, with the purpose of building a recognizable graphic language and reinforcing the personality of the digital experience.',
      'The result is a platform that brings Creación Digital closer to its different audiences through contemporary visual communication, an interactive experience and a graphic identity aligned with the creative spirit of the program.',
    ],
  },
  'fundacion-sgi': {
    caseStudy: {
      challenge: 'Give visibility to the social and environmental work of Fundación SGI through a website of its own that brought together its initiatives, communicated its impact and reflected the importance of its work with communities.',
      role: 'I designed and built the website, structuring the content and defining a visual experience aligned with the foundation’s social and environmental focus, from the graphic identity to its responsive adaptation.',
      tools: ['Claude', 'Figma'],
      result: 'An independent seven-section website that presents Fundación SGI, its work with communities since 2014 and its initiatives in environmental education, birdwatching tourism and sustainability, through a dynamic visual experience that adapts to mobile devices.',
    },
    subtitle: 'UX/UI Design · AI-assisted design',
    process: [
      'Since 2014, Fundación SGI has carried out initiatives focused on community well-being, environmental education and sustainable development. Its work covers several lines of action, including environmental education, birdwatching tourism and the promotion of sustainable practices.',
      'Initially, the foundation had a section within SGI’s corporate website. However, the breadth of its initiatives and the impact of its work made it clear that it needed a digital space of its own, one able to communicate its purpose and give greater visibility to the projects it carries out.',
      'In 2026 I designed and built an independent seven-section website, with a visual proposal inspired by nature and the environment. The goal was to move away from an overly institutional look and build a more dynamic, approachable and visual experience, one that lets people explore the foundation’s different lines of work and understand its contribution to communities.',
      'The organization of the content and the visual resources were planned to highlight the initiatives, the people and the places that are part of its work. I also incorporated a responsive design to ensure navigation adapted to different devices and to make information easy to reach from computers, tablets and mobile phones.',
      'The result is a digital platform that gives Fundación SGI greater prominence, communicates its social and environmental commitment and presents more clearly the work it has built alongside communities for more than a decade.',
    ],
  },
  'app-sgi': {
    subtitle: 'UX/UI Design · App design',
    caseStudy: {
      challenge: 'Centralize the internal processes of a company of 700 to 1,000 employees, previously spread across different platforms, in a flexible, scalable system adapted to SGI’s operational needs.',
      role: 'I lead the UX/UI design, from user research and flow definition to interface design and prototypes. I currently also build the frontend with the support of Claude, bringing design and code together in a single process.',
      tools: ['Figma', 'Claude', 'Adobe XD'],
      result: 'A centralized platform that integrates multiple business processes, improves traceability and information security, and has cut the time of some processes by up to 30%, with an architecture ready to add new modules.',
    },
    process: [
      'Since 2024, SGI has been developing an internal platform aimed at centralizing and optimizing the processes of an organization of 700 to 1,000 employees. Previously, different areas relied on external platforms and third-party solutions, which made it harder to integrate information, limited customization and increased the complexity of implementing new features.',
      'The initiative began in the software development and design areas, with the goal of building an in-house solution, adaptable to the company’s operational needs and able to evolve along with it.',
      'Development started with the Purchasing and Inventory module, which brings together features to manage requisitions, purchase orders, asset deliveries, inventory and suppliers. The platform later expanded with modules for advances, expense reports, accounting and human resources, including processes such as clearance and performance reviews.',
      'As lead designer, I have accompanied the platform’s evolution through research and people-centered design. In the early stage, I worked alongside the area leader to identify needs, get closer to users and understand their workflows. From those findings, I designed the journeys and interfaces in Figma, which were then prototyped and implemented by the frontend and backend development teams.',
      'Currently, my role combines UX/UI design and frontend development. Making use of the component libraries, structures and frameworks built during the project, I use Claude as a support tool to turn design decisions into working interfaces more directly. This evolution has sped up the development process and shortened the distance between concept and implementation, keeping the focus on usability and the real needs of users.',
      'The result is an enterprise platform in constant growth that centralizes processes, makes traceability easier, strengthens control of information and lets digital tools adapt to SGI’s operations. According to results reported by the company, some processes have reduced their times by up to 30%, showing the value of combining people-centered design, technology and continuous improvement.',
    ],
  },
  // Industrial
  brisa: { tagTop: 'Product', subtitle: 'Product', caseStudy: { challenge: 'Create a piece of furniture for small spaces that serves more than one purpose without taking up more room.', role: 'Concept design, 3D modeling, technical drawings and renders.', tools: ['Rhinoceros', 'KeyShot'], result: 'A double-sided modular piece that adapts to bedrooms and living rooms.' } },
  dupla: {
    tagTop: 'Furniture',
    subtitle: 'Furniture',
    caseStudy: {
      challenge: 'Design a multifunctional piece of furniture for young adults aged 25 to 35 who live alone in studio apartments in Colombia, where the lack of space forces them to give up storage, order and a comfortable place to work. The piece had to integrate universal design so that anyone could use it.',
      role: 'I developed the project from start to finish as my Industrial Design thesis: user research, concept, 3D modeling and renders, technical drawings, brand identity, the building of a full-scale working prototype and its validation with users.',
      tools: ['Rhinoceros', 'KeyShot', 'Krea AI'],
      result: 'Dupla, a modular room-divider that combines storage with a self-storing, expandable desk. It brings together multifunctionality, universal design, space saving, modularity and personalization, and was built as a working prototype and validated with users.',
    },
    showroom: {
      hero: 'proyectos/dupla/hero.webp',
      hotspots: [
        { x: 22, y: 30, label: 'Wardrobe module', text: 'Pull-out drawer for hanging clothes and an LED bar with sensor.' },
        { x: 42, y: 14, label: 'L-shaped shelf', text: 'Optional accessory for books, plants and decorative objects.' },
        { x: 45, y: 62, label: 'Drawer module', text: 'Soft-close slides and open shelves for display.' },
        { x: 73, y: 68, label: 'Self-storing desk', text: 'It tucks away inside the module and expands to work comfortably.' },
      ],
      back: {
        hero: 'proyectos/dupla/hero-posterior.webp',
        hotspots: [
          { x: 70, y: 17, label: 'L-shaped shelf', text: 'Optional accessory that fits the corner of any module.' },
          { x: 47, y: 62, label: 'Display shelves', text: 'This side adds display and decoration toward the living area.' },
          { x: 72, y: 70, label: 'Self-storing desk', text: 'It rolls out of the module on locking wheels and expands.' },
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
      'Dupla began as my Industrial Design thesis at Universidad El Bosque, within the Ergonomics and Universal Design line. In Bogotá, homes under 40 m² went from 7% in 2004 to 37% in 2023, and single-person households keep growing. People living in studio apartments often give up spaces such as a dining or living area and have little room to store their things.',
      'I worked with a five-phase methodology based on human-centered design. I surveyed 18 people, analyzed the market offering and defined the product requirements in a matrix of determinants and parameters. The main problem was storage, followed by the need for a place to work or study at home. That opened the opportunity: a single piece of furniture that stores things and also offers a workspace.',
      'In the creation phase I moved from sketches and exploration with artificial intelligence to 3D modeling, and tested ideas through user interviews. A 1:1 kraft paper prototype showed the piece was too deep, so I reduced it by 10 cm to 50 cm, a suitable measure both for a room divider and for the self-storing desk.',
      'The result is a divider with two active sides: toward the bedroom it prioritizes storage, and toward the living area it adds decoration and a workspace. It is made up of four modules (wardrobe, desk, drawers and seats) that users arrange to fit their space, plus accessories such as shelves and a footrest. It includes push-open doors, soft-close slides and LED bars with sensor, and I evaluated it with human figures from the 5th to the 95th percentile to make sure it could be used by as many people as possible.',
      'I also developed the brand identity, with a palette of blues and yellows, the Poppins typeface and a “dp” sub-brand that reads the same when rotated 180°, a nod to the product’s two sides. I produced the technical drawings and built a high-fidelity, full-scale prototype in flormorado wood panels, together with a carpentry workshop. I also proposed an eco-design strategy that uses wood offcuts to produce recycled boards.',
      'Finally, I validated the prototype with users through the think-aloud technique. They highlighted the finishes and how practical the piece is, and their feedback led me to adjust details: moving the LED light to the bottom of the wardrobe because it dazzled, and reducing the depth of the pull-out drawer so it doesn’t cover the hanging clothes.',
    ],
  },
  'diseno-producto': {
    title: 'Product design',
    tagTop: 'Product',
    subtitle: 'Product design',
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['Rhinoceros', 'ZBrush', 'KeyShot'],
      result: '',
    },
    process: [
      'I am interested in understanding how people interact with objects: how they pick them up, use them and bring them into their everyday life. Before defining a form, I try to understand what need it must solve and what experience I want to create. From there, I explore the relationship between function, ergonomics and visual language.',
      'I take ideas from sketch to digital model. I use Rhinoceros to develop geometry, proportions and details; ZBrush to explore volumes and organic forms; and KeyShot to experiment with materials, finishes and lighting until I get a representation faithful to the design intent.',
      'Brisa is a portable fan conceived to blend naturally into the space. Its language of clean lines and simple shapes seeks to balance function and aesthetics in an everyday object.',
      'Lumina is a lamp that explores the relationship between light and form. Its design gives the object presence even when it is off, while on it creates a warm atmosphere in the space.',
      '3D Sculpture is an exercise in exploring organic modeling and digital detail. Through ZBrush I worked on volumes, textures and transitions to achieve a piece with formal richness and depth.',
      'Rendering brings together an exploration of photorealistic visualization applied to a pair of sneakers. The work focuses on recreating materials, textures and lighting to build an image that conveys the product’s characteristics with the greatest possible realism.',
      'Each project is an opportunity to explore different ways of bringing an idea to life. From the physical object to its digital representation, I want design decisions to have intent and the result to communicate both its function and its personality.',
    ],
  },
  'diseno-mobiliario': {
    title: 'Furniture design',
    tagTop: 'Furniture',
    subtitle: 'Furniture design',
    caseStudy: {
      challenge: '',
      role: '',
      tools: ['KeyShot', 'Rhinoceros', 'Fusion 360'],
      result: '',
    },
    process: [
      'My process starts by understanding how people use and inhabit spaces. I want each piece to go beyond its main function: to transform, make use of the space and find a balance between comfort, utility and aesthetics.',
      'From the first sketches I think about how to bring each idea to reality. I explore materials, joints and construction possibilities; I model in Rhinoceros and Fusion 360 to develop and validate forms and mechanisms, and use KeyShot to visualize the result. On some projects I also take the process all the way to fabrication, which lets me understand each piece from concept to materialization.',
      'Sakuru is a multifunctional coffee table with a rotating top, an integrated tray and curved stools that tuck under its structure.',
      'Nido is an armchair I developed from conceptualization to final fabrication, caring for both its form and the experience of use.',
      'Brote is a metal shelf I designed and fabricated myself, exploring the relationship between structure, material and function.',
      'More than designing objects, I want to create solutions that make sense in everyday life. Each piece is an opportunity to explore new possibilities, experiment with materials and take an idea beyond the paper.',
    ],
  },
  // Gráfico
  'mainatek-grafico': {
    caseStudy: {
      challenge: 'Build a visual identity for a technology company that conveyed trust and professionalism, differentiated its value proposition and connected its brand with innovation and artificial intelligence.',
      role: 'I developed Mainatek’s comprehensive rebranding, from the logo and visual system to its corporate and digital applications. I designed the brochure, email signatures, letterhead and corporate video, and also proposed a coherent presence on social media and the website.',
      tools: ['Illustrator', 'Photoshop', 'Canva'],
      result: 'A comprehensive visual identity, documented in a brand manual and applied to corporate, audiovisual and digital materials, that unifies Mainatek’s communication and strengthens its recognition across the different touchpoints with its clients.',
    },
    subtitle: 'Graphic design · Rebranding',
    process: [
      'Mainatek is an IT solutions company that wanted to consolidate a visual identity able to communicate trust, professionalism and quality, while reflecting its relationship with artificial intelligence and technological innovation.',
      'The rebranding process began with the development of a logo that combines a sans serif typeface, approachable yet confident, with a visual device that highlights the letters “A” and “I” to create an association with artificial intelligence. I also designed a sub-brand from the letters M, T and K, conceived to make the company easier to recognize across different formats.',
      'From these elements, I defined a visual system that includes a palette of blues and greens associated with technology, security and trust; the Inter Tight type family; and a circular geometric texture that adds dynamism to the compositions. The system was complemented with logo usage rules, color combinations and guidelines to preserve legibility and consistency.',
      'The project also covered the development of several brand applications to carry this identity to the company’s touchpoints. I designed corporate pieces such as the brochure, email signatures and letterhead, as well as a corporate video. I also developed a digital presence proposal covering social media and the website, aiming to keep visual communication consistent across channels.',
      'Finally, I consolidated the guidelines and applications into a brand manual that sets the foundation for implementing the identity and keeping it coherent in future pieces and platforms.',
      'The result is a comprehensive visual identity system that brings Mainatek’s values together with a recognizable and flexible graphic language, extending from its corporate materials to its digital presence.',
    ],
  },
  'behome-light': {
    caseStudy: {
      challenge: 'Create a visual identity for an online decor and lighting store that conveyed creativity, elegance and joy, and connected its products with the idea of transforming the spaces of the home.',
      role: 'I designed the brand’s comprehensive visual identity, from the logo and sub-brand to the color palette, typography, illustrated iconography, graphic patterns and their applications.',
      tools: ['Illustrator', 'Photoshop', 'Canva'],
      result: 'A distinctive, coherent visual identity that combines creativity, elegance and joy in a graphic language of its own, connecting decor and lighting with a contemporary vision of the home.',
    },
    tagTop: 'Visual identity',
    subtitle: 'Graphic design · Visual identity',
    process: [
      'Be Home Light is an online store of home decor and lighting objects. The project consisted of developing a visual identity that reflected the essence of the brand around three main concepts: creativity, elegance and joy.',
      'The process began with the design of the logo, for which I chose an expressive, informal sans serif typeface. Stretching some of the letters adds dynamism, while the visual play inside the letter “o” integrates the silhouette of a house with a spark, connecting the ideas of home and light. This device also gave rise to the sub-brand, designed to work as a recognizable graphic element on its own.',
      'From these elements, I built a visual system with a palette of blues, greens and a yellow-green, selected to convey elegance, nature and joy. The identity was complemented with the Rethink Sans typeface and a collection of five illustrated icons inspired by decor elements such as lamps, plants, candles, mirrors and lotus flowers.',
      'To broaden the possibilities of application, I developed a graphic pattern that combines the iconography with the slogan “Design for home”, creating a texture of its own for the brand. I also prepared applications and mockups to show its use on different media, including labels and coasters.',
      'Finally, I gathered the elements and guidelines into a visual identity manual that sets criteria for the use of the logo, colors, typography and graphic resources, ensuring consistent communication.',
      'The result is a visual identity with a graphic language of its own, able to convey Be Home Light’s personality and keep its coherence across the brand’s different applications.',
    ],
  },
  sinalu: {
    caseStudy: {
      challenge: 'Create a visual identity for a veterinary clinic that conveyed warmth and trust, with an approachable and friendly image for both people and their pets.',
      role: 'I designed Sinalu’s visual identity, developing the logo concept, the color palette and the typographic system to build a coherent, expressive and recognizable brand.',
      tools: ['Illustrator', 'Photoshop'],
      result: 'A distinctive and versatile visual identity, with a logo that builds animal silhouettes into its letters and a warm, playful aesthetic that reflects the clinic’s personality.',
    },
    tagTop: 'Visual identity',
    subtitle: 'Graphic design · Visual identity',
    process: [
      'Sinalu is a veterinary clinic that wanted to project a more approachable image, able to convey warmth and trust to the people who visit its facilities with their pets.',
      'The starting point of the project was the brand’s own name. By exploring its typographic forms, I built animal silhouettes into the letters “n” and “u”, turning the logo into a visual device that represents pets in a creative way. I also added a paw print above the “i”, reinforcing the concept and adding a playful, memorable character.',
      'From the logo, I developed a visual identity system with a palette of lilacs and soft tones, contrasted with a grape purple and complemented by accents in peach, pink, white and sand. This combination aims to convey warmth and friendliness without losing the professionalism of a veterinary clinic.',
      'The choice of typefaces also contributes to that personality. I used Nunito for its rounded forms and legibility, together with Caveat to add more spontaneous and expressive details.',
      'Finally, I designed the logo to work in both positive and negative, making it versatile across different backgrounds and contexts of use.',
      'The result is a visual identity with a personality of its own, in which typography becomes a central part of the concept and communicates the bond between people and their pets in an approachable way.',
    ],
  },
  // Otros
  'experimentos-ia': {
    title: 'AI Experiments',
    tagTop: 'Exploration',
    subtitle: 'AI exploration',
    caseStudy: { challenge: '', role: '', tools: ['Higgsfield', 'Claude'], result: '' },
    process: [
      'I am interested in exploring how artificial intelligence is transforming creative processes and the possibilities it opens up for design and audiovisual production. Rather than using a tool for its results, I like to understand its language, experiment with its capabilities and discover how to integrate it into a creative process with a clear intention.',
      'Each project starts from an idea and develops through the exploration of different tools, models and resources. The goal is not just to generate images or videos, but to build pieces with visual direction, narrative intent and aesthetic coherence.',
      'MIRA is an exploration of advertising content for a portable mirror. I developed different communication scenarios for the product and a transition between scenes using the morphing technique. Made with Higgsfield.',
      'Entre etiquetas (Between Labels) is a short film developed for the Creación Digital program. Through a conceptual narrative, it addresses the need to question the labels that define us and find an identity of our own. Made with Claude and Higgsfield through the integration of its connector.',
      'The Proposal is a cinematic horror short film that builds a story around the unexpected outcome of a date. An exploration of audiovisual storytelling, atmosphere and cinematic language through Higgsfield Cinema.',
      'Artificial intelligence expands what we can imagine and create. For me, the interesting part is learning to direct those possibilities, experimenting without losing intention and discovering new ways of telling stories.',
    ],
  },
  'contenido-redes': { title: 'Social media content', subtitle: 'Social media', caseStudy: { challenge: '', role: '', tools: ['Canva', 'CapCut', 'Photoshop'], result: '' }, process: [
      'Creating social media content is about finding the best way to tell something and making it connect with whoever is watching. I am interested in exploring how an idea can become an audiovisual piece capable of informing, sparking curiosity and conveying the personality of a brand or community.',
      'Since becoming communications lead for Creación Digital, I have been in charge of telling what happens in the program through social media. I have made videos about the degree, its students and everything we do, so that anyone watching understands what it is like to study Creación Digital and feels part of it.',
      'Each piece starts from a story: a project, a person or a moment in the program. From there, I define the format, rhythm and visual language to build content that is clear, approachable and consistent with the identity of Creación Digital.',
      'I have also created content for 3derizo, where I communicate and promote products made through 3D printing. Here, the challenge is finding a way to present each object attractively, highlighting its details, finishes and particularities.',
      'Although the projects and their audiences are different, in both I look for the same thing: to understand what makes each story or product special and to find a visual way of communicating it that grabs attention and builds connection.',
    ] },
  'ilustracion-digital': { title: 'Digital illustration', tagTop: 'Illustration', subtitle: 'Digital illustration', caseStudy: { challenge: '', role: '', tools: ['Procreate', 'Photoshop', 'Illustrator'], result: '' }, process: [
      'Digital illustration is a way of turning ideas into images and exploring different ways of communicating through them. It is a space where I can experiment freely with color, shapes and composition, not necessarily starting from a commission, but from my own curiosity.',
      'I start from simple ideas, things I observe or imagine, and develop them through clean shapes, defined color palettes and attention to detail. Each illustration is an opportunity to explore how a few elements can build an image, convey an idea or create a feeling.',
      'This series gathers pieces I have created at different times and that reflect part of that exploration. Rather than following a single style, they are a sample of my constant search to experiment, find new forms of expression and build a visual language of my own.',
    ] },
}
