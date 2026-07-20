module.exports = function portfolioDefaults() {
  const year = String(new Date().getFullYear());
  return {
    published: true,
    showInNav: false,
    coverBadge: 'Ingeniería · Montaje · Automatización',
    coverTitle: 'Energía que impulsa su operación',
    coverSubtitle:
      'Portafolio técnico de Patagonia Electric: ingeniería eléctrica, automatización industrial y montaje con estándar de excelencia en la Región de los Lagos.',
    coverYear: year,
    coverImage: '/images/portfolio/pf-cover.jpg',
    coverCta: 'Descargar PDF',

    statsTitle: 'Cifras que respaldan nuestro trabajo',
    stats: [
      { value: '+10', label: 'Años de experiencia' },
      { value: '3', label: 'Divisiones especializadas' },
      { value: 'MT/BT', label: 'Media y baja tensión' },
      { value: '100%', label: 'Garantía post venta' },
    ],

    introTitle: 'Quiénes somos',
    introLead: 'Empresa chilena de ingeniería y montaje eléctrico con sello patagón.',
    introParagraphs: [
      'Somos un equipo multidisciplinario de seguridad, logística, ingeniería, técnicos y ayudantes en capacitación continua. El capital humano es el núcleo de Patagonia Electric.',
      'Operamos desde Frutillar, Región de los Lagos, con capitales chilenos y foco en proyectos industriales, habitacionales y de energías renovables.',
      'Integramos diseño, ejecución y mantención: tableros, automatización, redes y sistemas fotovoltaicos con respaldo técnico permanente.',
    ],
    introImage: '/images/portfolio/pf-team.jpg',

    missionTitle: 'Misión',
    missionText:
      'Entregar soluciones eléctricas seguras, eficientes y certificadas que aseguren continuidad operativa y valor de largo plazo para cada cliente.',
    visionTitle: 'Visión',
    visionText:
      'Ser la empresa referente de ingeniería eléctrica en el sur de Chile, reconocida por excelencia técnica, innovación y confianza.',

    strengthsTitle: 'Por qué trabajar con nosotros',
    strengthsSubtitle: 'Diferenciales alineados a los estándares de las mejores empresas de ingeniería eléctrica.',
    strengths: [
      {
        title: 'Equipo multidisciplinario',
        text: 'Ingeniería, terreno y seguridad coordinados en cada etapa del proyecto.',
        image: '/images/portfolio/pf-team.jpg',
      },
      {
        title: 'Cumplimiento normativo',
        text: 'Diseño e instalación bajo criterios SEC, buenas prácticas de montaje y documentación clara.',
        image: '/images/portfolio/pf-industrial.jpg',
      },
      {
        title: 'Alianzas con marcas líderes',
        text: 'Cooperación comercial con las principales marcas eléctricas presentes en Chile.',
        image: '/images/proyecto2.jpg',
      },
      {
        title: 'Garantía post venta',
        text: 'Acompañamiento continuo: una vez clientes, siempre clientes.',
        image: '/images/portfolio/pf-icon-energy.jpg',
      },
    ],

    servicesTitle: 'Capacidades técnicas',
    servicesSubtitle: 'Servicios de ingeniería, montaje y soporte inspirados en el estándar de la industria eléctrica.',
    services: [
      {
        title: 'Ingeniería de detalle',
        text: 'Diseño de instalaciones BT/MT, iluminación, puesta a tierra y tableros de fuerza, comando y control.',
      },
      {
        title: 'Montaje industrial',
        text: 'Canalizaciones, bandejas, tableros, motores, grupos electrógenos y puesta en marcha.',
      },
      {
        title: 'Automatización',
        text: 'PLC, tableros de control, instrumentación básica y optimización de procesos.',
      },
      {
        title: 'Media tensión',
        text: 'Ampliaciones, redistribuciones y mantenciones preventivas/predictivas hasta media tensión.',
      },
      {
        title: 'Energía solar',
        text: 'Sistemas fotovoltaicos, eficiencia energética e iluminación LED de bajo consumo.',
      },
      {
        title: 'Habitacional certificado',
        text: 'Acometidas, protecciones, distribución e iluminación para viviendas y edificios.',
      },
    ],

    divisionsTitle: 'Nuestras divisiones',
    divisionsSubtitle: 'Tres líneas de especialización para cubrir industria, energía limpia y hogar.',
    divisions: [
      {
        title: 'Industrial',
        text: 'Instalaciones industriales, tableros de potencia, comando y control, mantención hasta media tensión.',
        image: '/images/portfolio/pf-industrial.jpg',
      },
      {
        title: 'División Ecológica',
        text: 'Paneles solares, eficiencia energética y soluciones sustentables para reducir impacto y costos.',
        image: '/images/portfolio/pf-solar.jpg',
      },
      {
        title: 'Habitacional',
        text: 'Proyectos residenciales certificados: acometida, distribución, protecciones e iluminación.',
        image: '/images/portfolio/pf-home.jpg',
      },
    ],

    processTitle: 'Cómo trabajamos',
    processSubtitle: 'Metodología clara de punta a punta, como exigen los proyectos eléctricos de alto estándar.',
    processSteps: [
      { title: 'Diagnóstico', text: 'Levantamiento en terreno, riesgos y requerimientos del cliente.' },
      { title: 'Ingeniería', text: 'Diseño técnico, memoria de cálculo y selección de equipos.' },
      { title: 'Ejecución', text: 'Montaje controlado, seguridad y control de calidad en obra.' },
      { title: 'Puesta en marcha', text: 'Pruebas, entrega documentada y capacitación operativa.' },
      { title: 'Post venta', text: 'Mantención, soporte y mejora continua del sistema.' },
    ],

    projectsTitle: 'Proyectos destacados',
    projectsSubtitle: 'Casos representativos de ingeniería, montaje y automatización.',
    projects: [
      {
        title: 'Planta industrial — montaje integral',
        text: 'Instalación eléctrica de potencia y control para continuidad operativa en planta.',
        image: '/images/proyecto1.jpg',
        category: 'Industrial',
        client: 'Cliente industrial',
        scope: 'Fuerza · Control · Puesta en marcha',
      },
      {
        title: 'Tableros de potencia y comando',
        text: 'Diseño, armado y montaje de tableros seccionales y de control.',
        image: '/images/proyecto2.jpg',
        category: 'Tableros',
        client: 'Sector productivo',
        scope: 'BT · Comando · Certificación',
      },
      {
        title: 'Automatización y control',
        text: 'Integración de sistemas de comando para optimizar operación y seguridad.',
        image: '/images/proyecto3.jpg',
        category: 'Automatización',
        client: 'Industria regional',
        scope: 'PLC · Tableros · Pruebas',
      },
      {
        title: 'Infraestructura eléctrica',
        text: 'Obras de infraestructura y distribución para proyectos de gran escala.',
        image: '/images/portfolio/pf-industrial.jpg',
        category: 'Infraestructura',
        client: 'Obra mayor',
        scope: 'Redes · Distribución',
      },
      {
        title: 'Energía renovable',
        text: 'Soluciones solares y eficiencia energética para autoconsumo sustentable.',
        image: '/images/portfolio/pf-solar.jpg',
        category: 'Ecológica',
        client: 'Comercio / Industria',
        scope: 'FV · LED · Auditoría',
      },
      {
        title: 'Proyecto habitacional',
        text: 'Instalaciones residenciales seguras, certificadas y listas para recepción.',
        image: '/images/portfolio/pf-home.jpg',
        category: 'Habitacional',
        client: 'Vivienda / Edificación',
        scope: 'Acometida · Protecciones',
      },
    ],

    clientsTitle: 'Clientes que confían en nosotros',
    clientsSubtitle: 'Marcas y operaciones que respaldan nuestra trayectoria.',
    clients: [
      { name: 'Nestlé', logo: '/images/cliente-nestle.png' },
      { name: "Papa John's", logo: '/images/cliente-papajohns.png' },
      { name: 'Zero Corp', logo: '/images/cliente-zero.jpg' },
    ],

    closingTitle: 'Construyamos su próximo proyecto eléctrico',
    closingText:
      'Cuéntenos su desafío industrial, solar o habitacional. Preparamos una propuesta técnica clara y ejecutable.',
    contactNote: 'contacto@patagoniaelectric.com · +56 9 6227 4047 · Frutillar, Región de los Lagos',
    closingImage: '/images/portfolio/pf-cover.jpg',
  };
};
