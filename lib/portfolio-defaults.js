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
      'Entregar soluciones eléctricas seguras, eficientes y certificadas que aseguren continuidad operativa y valor de largo plazo para cada cliente. Trabajamos con rigor técnico, seguridad en terreno y comunicación clara, acompañando desde la ingeniería hasta la puesta en marcha y el soporte post venta. Nuestro compromiso es que cada instalación opere con confiabilidad, eficiencia energética y cumplimiento normativo.',
    visionTitle: 'Visión',
    visionText:
      'Ser la empresa referente de ingeniería eléctrica en el sur de Chile, reconocida por excelencia técnica, innovación responsable y confianza. Aspiramos a liderar la transición hacia energías más limpias en la Patagonia, integrando automatización, eficiencia y energías renovables en proyectos industriales, comerciales y habitacionales que impulsen el desarrollo sustentable de la región.',

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
        text:
          'Diseño de instalaciones BT/MT, memoria de cálculo, iluminación, puesta a tierra y tableros de fuerza, comando y control. Entregamos planos, especificaciones y criterios de montaje listos para ejecución.',
      },
      {
        title: 'Montaje industrial',
        text:
          'Canalizaciones, bandejas, tableros, motores, grupos electrógenos y puesta en marcha. Coordinamos seguridad, logística y control de calidad en terreno para minimizar detenciones de planta.',
      },
      {
        title: 'Automatización',
        text:
          'PLC, tableros de control, instrumentación básica y optimización de procesos. Mejoramos seguridad operativa, trazabilidad y eficiencia de líneas productivas.',
      },
      {
        title: 'Media tensión',
        text:
          'Ampliaciones, redistribuciones y mantenciones preventivas/predictivas hasta media tensión. Enfoque en confiabilidad de alimentadores, protecciones y continuidad del suministro.',
      },
      {
        title: 'Energía solar',
        text:
          'Sistemas fotovoltaicos, eficiencia energética e iluminación LED de bajo consumo. Evaluamos generación, retorno y compatibilidad con la instalación existente.',
      },
      {
        title: 'Habitacional certificado',
        text:
          'Acometidas, protecciones, distribución e iluminación para viviendas y edificios. Cumplimiento normativo y entrega documentada para recepción de obras.',
      },
    ],

    divisionsTitle: 'Nuestras divisiones',
    divisionsSubtitle: 'Tres líneas de especialización para cubrir industria, energía limpia y hogar.',
    divisions: [
      {
        title: 'División Industrial',
        text:
          'Diseño y ejecución de instalaciones eléctricas para plantas, faenas y procesos productivos. Desarrollamos tableros de potencia, comando y control; canalizaciones y bandejas; alimentadores BT/MT; puesta a tierra; y mantenciones preventivas y predictivas hasta media tensión. Integramos automatización básica, grupos electrógenos y puesta en marcha documentada para continuidad operativa con estándares de seguridad industrial.',
        image: '/images/portfolio/pf-industrial.jpg',
        highlights: ['Tableros BT/MT', 'Montaje en planta', 'Mantención predictiva'],
      },
      {
        title: 'División Ecológica',
        text:
          'Soluciones de energía limpia y eficiencia energética: sistemas fotovoltaicos para autoconsumo, auditorías de consumo, reconversión a LED y apoyo a proyectos con menor huella de carbono. Acompañamos el dimensionamiento, la instalación y la optimización para reducir costos eléctricos y avanzar hacia una operación más sustentable, alineada con el potencial renovable del sur de Chile.',
        image: '/images/portfolio/pf-solar.jpg',
        highlights: ['Fotovoltaico', 'Eficiencia energética', 'Iluminación LED'],
      },
      {
        title: 'División Habitacional',
        text:
          'Instalaciones eléctricas residenciales y de edificación con foco en seguridad, certificación y calidad de terminaciones. Cubrimos acometidas, tableros de distribución, protecciones diferenciales y termomagnéticas, circuitos de fuerza e iluminación, y preparación para sistemas de respaldo o domótica básica. Entregamos obras listas para recepción, con documentación clara para el propietario y la inspección.',
        image: '/images/portfolio/pf-home.jpg',
        highlights: ['Acometidas', 'Protecciones', 'Certificación'],
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
        text:
          'Instalación eléctrica de potencia y control para continuidad operativa en planta. Se ejecutó el montaje de alimentadores, tableros seccionales, canalizaciones y circuitos de fuerza/comando, con pruebas de puesta en marcha y entrega de documentación as-built para mantención.',
        image: '/images/proyecto1.jpg',
        category: 'Industrial',
        client: 'Cliente industrial',
        scope: 'Fuerza · Control · Puesta en marcha',
        results: 'Mayor confiabilidad operativa y trazabilidad de circuitos críticos.',
      },
      {
        title: 'Tableros de potencia y comando',
        text:
          'Diseño, armado y montaje de tableros seccionales y de control con selección de protecciones, cableado interno etiquetado y pruebas de aislamiento. El alcance incluyó integración a la red existente y capacitación básica al equipo de mantención del cliente.',
        image: '/images/proyecto2.jpg',
        category: 'Tableros',
        client: 'Sector productivo',
        scope: 'BT · Comando · Certificación',
        results: 'Estandarización de protecciones y reducción de tiempos de falla.',
      },
      {
        title: 'Automatización y control',
        text:
          'Integración de sistemas de comando para optimizar operación y seguridad. Se implementaron tableros de control, lógica de enclavamiento y señales de estado para supervisión, con pruebas funcionales y protocolos de puesta en servicio.',
        image: '/images/proyecto3.jpg',
        category: 'Automatización',
        client: 'Industria regional',
        scope: 'PLC · Tableros · Pruebas',
        results: 'Operación más segura y control visual del proceso.',
      },
      {
        title: 'Infraestructura eléctrica',
        text:
          'Obras de infraestructura y distribución para proyectos de gran escala: tendidos, ductos, tableros generales y circuitos de servicios auxiliares. Se priorizó orden de montaje, segregación de circuitos y documentación para fiscalización y mantención futura.',
        image: '/images/portfolio/pf-industrial.jpg',
        category: 'Infraestructura',
        client: 'Obra mayor',
        scope: 'Redes · Distribución',
        results: 'Base eléctrica escalable para etapas posteriores de la obra.',
      },
      {
        title: 'Energía renovable — autoconsumo solar',
        text:
          'Solución fotovoltaica y medidas de eficiencia energética para autoconsumo sustentable. Incluyó evaluación de consumo, dimensionamiento de paneles/inversor, instalación y verificación de generación, complementada con reconversión LED en zonas críticas.',
        image: '/images/portfolio/pf-solar.jpg',
        category: 'Ecológica',
        client: 'Comercio / Industria',
        scope: 'FV · LED · Auditoría',
        results: 'Menor demanda de red y avance en metas de sustentabilidad.',
      },
      {
        title: 'Proyecto habitacional certificado',
        text:
          'Instalaciones residenciales seguras y certificadas, listas para recepción: acometida, tablero general, protecciones, circuitos de fuerza e iluminación. Se entregó obra con pruebas y documentación alineada a los requisitos de inspección.',
        image: '/images/portfolio/pf-home.jpg',
        category: 'Habitacional',
        client: 'Vivienda / Edificación',
        scope: 'Acometida · Protecciones',
        results: 'Recepción sin observaciones eléctricas relevantes.',
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
