const fs = require('fs').promises;
const path = require('path');
const portfolioDefaults = require('./portfolio-defaults');

const CONTENT_FILE = path.join(__dirname, '..', 'data', 'content.json');

function defaultContent() {
  return {
    general: {
      tagline: 'Ingeniería y Montaje Eléctrico',
      legalName: 'Patagonia Eléctric',
      email: 'contacto@patagoniaelectric.com',
      phone: '+56 9 6227 4047',
      phoneRaw: '+56962274047',
      whatsapp: '56962274047',
      hours: 'Lunes a Viernes 08:30 a 18:00',
      city: 'Frutillar',
      region: 'Región de los Lagos',
      country: 'Chile',
      footerText:
        'Patagonia Eléctric es una empresa chilena con capitales chilenos de la ciudad de Frutillar en la Región de los Lagos. Soluciones eléctricas con atención experta.',
      logoHeader: '/images/logo-color.png',
      logoFooter: '/images/logo.png',
      logoHero: '/images/logo.png',
    },
    home: {
      heroBadge: '⚡ +10 años de experiencia',
      heroTitle: 'Patagonia',
      heroTitleHighlight: 'Electric',
      heroSlides: [
        { image: '/images/hero1.jpg', alt: 'Instalaciones eléctricas industriales', position: '50% 50%' },
        { image: '/images/hero2.jpg', alt: 'Líneas de transmisión eléctrica', position: '50% 50%' },
        { image: '/images/equipo.jpg', alt: 'Equipo técnico en terreno', position: '50% 50%' },
      ],
      aboutTitle: 'Equipo Patagonia',
      aboutParagraphs: [
        'Un grupo multidisciplinario de profesionales de distintas áreas componen nuestro equipo: seguridad, logística, ingeniería, técnicos y ayudantes en constante capacitación constituyen la pieza fundamental de nuestra compañía, el equipo humano.',
        'Patagonia Eléctric es una empresa chilena con capitales chilenos de la ciudad de Frutillar en la Región de los Lagos.',
      ],
      aboutImage: '/images/equipo.jpg',
      whyTitle: 'Patagonia Electric',
      whySubtitle: 'Por qué trabajar con nosotros',
      whyIntro:
        'Contamos con un equipo multidisciplinario en continuo proceso de capacitación técnica y humana. Con más de 10 años de experiencia en el desarrollo de proyectos eléctricos y en automatización industrial, nuestra trayectoria nos posiciona como la opción más destacada para llevar a cabo sus proyectos.',
      features: [
        { title: 'Equipo Multidisciplinario', text: 'Capacitamos a nuestro equipo de manera continua.', image: '/images/equipo.jpg' },
        { title: 'Certificaciones', text: 'Certificaciones para el personal técnico.', image: '/images/proyecto2.jpg' },
        { title: 'Alianzas', text: 'Cooperación comercial con las principales marcas eléctricas de Chile.', image: '/images/proyecto3.jpg' },
        {
          title: 'Garantía Post venta',
          text: 'Una vez que se convierten en nuestros clientes, siempre lo serán; respaldamos nuestros trabajos de por vida.',
          image: '/images/hero1.jpg',
        },
      ],
      divisionsTitle: 'Nuestras Divisiones',
      divisionsSubtitle: 'Soluciones integrales en ingeniería eléctrica y automatización industrial',
      divisions: [
        {
          title: 'Industrial',
          text: 'Diseño y ejecución de instalaciones eléctricas industriales, tableros de potencia, comando y control. Mantenimientos preventivos y predictivos hasta media tensión.',
          link: '/industrial',
          image: '/images/proyecto1.jpg',
        },
        {
          title: 'División Ecológica',
          text: 'Energías renovables y soluciones sustentables. Paneles solares fotovoltaicos y eficiencia energética para reducir el impacto ambiental.',
          link: '/division-ecologica',
          image: '/images/hero2.jpg',
        },
        {
          title: 'Habitacional',
          text: 'Instalaciones eléctricas para viviendas y edificaciones. Acometida, distribución, protecciones e iluminación certificada.',
          link: '/habitacional',
          image: '/images/hero1.jpg',
        },
      ],
      projectsTitle: 'Imágenes Proyectos',
      projectsSubtitle: 'Más de 10 años desarrollando proyectos eléctricos de excelencia',
      clientsTitle: 'Clientes Patagonia',
      clientsSubtitle: 'Empresas que confían en nuestro trabajo',
      clientsBg: '/images/clientes-bg.jpg',
      ctaTitle: '¿Tiene un proyecto?',
      ctaSubtitle: 'Contáctenos y reciba asesoría experta',
    },
    nosotros: {
      heroImage: '/images/equipo.jpg',
      heroTitle: 'Nosotros',
      heroSubtitle: 'El equipo humano es la pieza fundamental de nuestra compañía',
      title: 'Equipo Patagonia',
      paragraphs: [
        'Un grupo multidisciplinario de profesionales de distintas áreas componen nuestro equipo: seguridad, logística, ingeniería, técnicos y ayudantes en constante capacitación constituyen la pieza fundamental de nuestra compañía, el equipo humano.',
        'Patagonia Eléctric es una empresa chilena con capitales chilenos de la ciudad de Frutillar en la Región de los Lagos.',
        'Contamos con un equipo multidisciplinario en continuo proceso de capacitación técnica y humana. Con más de 10 años de experiencia en el desarrollo de proyectos eléctricos y en automatización industrial, nuestra trayectoria nos posiciona como la opción más destacada para llevar a cabo sus proyectos.',
        'Estamos comprometidos con la excelencia y la innovación, garantizando resultados de alta calidad que se adaptan a las necesidades específicas de cada cliente.',
      ],
      image: '/images/equipo.jpg',
      valuesTitle: 'Nuestros Valores',
      values: [
        { title: 'Excelencia', text: 'Resultados de alta calidad en cada proyecto eléctrico que ejecutamos.', image: '/images/proyecto1.jpg' },
        { title: 'Capacitación', text: 'Formación continua técnica y humana para todo nuestro equipo.', image: '/images/equipo.jpg' },
        { title: 'Compromiso', text: 'Garantía post venta de por vida con cada uno de nuestros clientes.', image: '/images/hero2.jpg' },
        { title: 'Innovación', text: 'Tecnología de punta en automatización industrial y energías renovables.', image: '/images/proyecto3.jpg' },
      ],
      ctaTitle: '¿Listo para trabajar juntos?',
      ctaSubtitle: 'Contáctenos y reciba una asesoría personalizada',
    },
    industrial: {
      heroImage: '/images/proyecto1.jpg',
      heroTitle: 'División Industrial',
      heroSubtitle: 'Ingeniería eléctrica y automatización para la industria',
      intro:
        'Nuestra División Industrial ofrece soluciones integrales para plantas, fábricas y complejos industriales en la Región de los Lagos y todo Chile. Diseñamos, ejecutamos y mantenemos instalaciones eléctricas de alto rendimiento.',
      solutions: [
        {
          title: 'Tableros de Potencia',
          text: 'Diseño, montaje y puesta en marcha de tableros seccionales y generales de media y baja tensión.',
          image: '/images/proyecto2.jpg',
        },
        {
          title: 'Automatización Industrial',
          text: 'Sistemas de control, programación de PLC, plaquetas electrónicas y sistemas automatizados.',
          image: '/images/proyecto3.jpg',
        },
        {
          title: 'Mantenimiento',
          text: 'Mantenimientos preventivos y predictivos con tecnología de punta para continuidad operativa.',
          image: '/images/hero1.jpg',
        },
        {
          title: 'Media Tensión',
          text: 'Redistribución y ampliación eléctrica hasta media tensión con certificaciones técnicas.',
          image: '/images/hero2.jpg',
        },
        {
          title: 'Grupos Electrógenos',
          text: 'Instalación y mantenimiento de grupos electrógenos para respaldo energético industrial.',
          image: '/images/proyecto1.jpg',
        },
        {
          title: 'Control de Motores',
          text: 'Montaje, puesta en marcha y mantenimiento de motores eléctricos industriales.',
          image: '/images/equipo.jpg',
        },
      ],
      ctaTitle: 'Cotice su proyecto industrial',
      ctaButton: 'Contactar ahora',
    },
    ecologica: {
      heroImage: '/images/hero2.jpg',
      heroTitle: 'División Ecológica',
      heroSubtitle: 'Energías renovables y eficiencia energética',
      intro:
        'La División Ecológica de Patagonia Electric impulsa la transición energética con soluciones sustentables. Instalamos sistemas solares fotovoltaicos y asesoramos en eficiencia energética para hogares, comercios e industria.',
      solutions: [
        {
          title: 'Paneles Solares',
          text: 'Instalación de sistemas fotovoltaicos para autoconsumo y generación de energía limpia.',
          image: '/images/hero2.jpg',
        },
        {
          title: 'Eficiencia Energética',
          text: 'Auditorías y mejoras para reducir el consumo eléctrico y optimizar costos operativos.',
          image: '/images/proyecto3.jpg',
        },
        {
          title: 'Iluminación LED',
          text: 'Modernización de sistemas de iluminación con tecnología LED de bajo consumo.',
          image: '/images/hero1.jpg',
        },
        {
          title: 'Energía Limpia',
          text: 'Sistemas de generación de energía renovable adaptados a las necesidades del cliente.',
          image: '/images/equipo.jpg',
        },
        {
          title: 'Asesoría Técnica',
          text: 'Evaluación de viabilidad y diseño de proyectos de energía sustentable.',
          image: '/images/proyecto1.jpg',
        },
        {
          title: 'Mantenimiento Solar',
          text: 'Servicio post-instalación y mantenimiento de sistemas fotovoltaicos.',
          image: '/images/proyecto2.jpg',
        },
      ],
      ctaTitle: 'Impulse su proyecto sustentable',
      ctaButton: 'Solicitar asesoría',
    },
    habitacional: {
      heroImage: '/images/hero1.jpg',
      heroTitle: 'División Habitacional',
      heroSubtitle: 'Instalaciones eléctricas residenciales certificadas',
      intro:
        'Nuestra División Habitacional brinda instalaciones eléctricas seguras y certificadas para viviendas unifamiliares, edificios y proyectos residenciales en Frutillar y la Región de los Lagos.',
      solutions: [
        {
          title: 'Instalación Completa',
          text: 'Proyectos eléctricos desde cero: acometida, distribución y tablero general.',
          image: '/images/hero1.jpg',
        },
        {
          title: 'Protecciones',
          text: 'Instalación de protecciones diferenciales y magnetotérmicas según normativa vigente.',
          image: '/images/proyecto2.jpg',
        },
        {
          title: 'Iluminación',
          text: 'Diseño e instalación de sistemas de iluminación interior y exterior.',
          image: '/images/proyecto3.jpg',
        },
        {
          title: 'Automatización Hogar',
          text: 'Sistemas automatizados para mayor confort y eficiencia en el hogar.',
          image: '/images/equipo.jpg',
        },
        {
          title: 'Ampliaciones',
          text: 'Ampliación y modernización de instalaciones eléctricas existentes.',
          image: '/images/proyecto1.jpg',
        },
        {
          title: 'Certificación',
          text: 'Trabajos certificados con los más altos estándares de seguridad eléctrica.',
          image: '/images/hero2.jpg',
        },
      ],
      ctaTitle: 'Cotice su proyecto residencial',
      ctaButton: 'Contactar ahora',
    },
    proyectos: {
      heroImage: '/images/proyecto3.jpg',
      heroTitle: 'Proyectos',
      heroSubtitle: 'Más de 10 años de experiencia en ingeniería eléctrica',
      title: 'Portafolio de Obras',
      subtitle: 'Proyectos eléctricos industriales, comerciales y residenciales',
      items: [
        {
          title: "Planta industrial — montaje integral",
          text: "Instalación eléctrica de potencia y control para continuidad operativa en planta. Se ejecutó el montaje de alimentadores, tableros seccionales, canalizaciones y circuitos de fuerza y comando, con pruebas de puesta en marcha y entrega de documentación de obra ejecutada para mantenimiento.",
          image: "/images/proyecto1.jpg",
          category: "Industrial",
          client: "Cliente industrial",
          scope: "Fuerza · Control · Puesta en marcha",
          results: "Mayor confiabilidad operativa y trazabilidad de circuitos críticos.",
        },
        {
          title: "Tableros de potencia y comando",
          text: "Diseño, armado y montaje de tableros seccionales y de control con selección de protecciones, cableado interno etiquetado y pruebas de aislamiento. El alcance incluyó integración a la red existente y capacitación básica al equipo de mantenimiento del cliente.",
          image: "/images/proyecto2.jpg",
          category: "Tableros",
          client: "Sector productivo",
          scope: "BT · Comando · Certificación",
          results: "Estandarización de protecciones y reducción de tiempos de falla.",
        },
        {
          title: "Automatización y control",
          text: "Integración de sistemas de comando para optimizar operación y seguridad. Se implementaron tableros de control, lógica de enclavamiento y señales de estado para supervisión, con pruebas funcionales y protocolos de puesta en servicio.",
          image: "/images/proyecto3.jpg",
          category: "Automatización",
          client: "Industria regional",
          scope: "PLC · Tableros · Pruebas",
          results: "Operación más segura y control visual del proceso.",
        },
        {
          title: "Infraestructura eléctrica",
          text: "Obras de infraestructura y distribución para proyectos de gran escala: tendidos, ductos, tableros generales y circuitos de servicios auxiliares. Se priorizó el orden de montaje, la segregación de circuitos y la documentación para inspección y mantenimiento futuro.",
          image: "/images/portfolio/pf-industrial.jpg",
          category: "Infraestructura",
          client: "Obra mayor",
          scope: "Redes · Distribución",
          results: "Base eléctrica escalable para etapas posteriores de la obra.",
        },
        {
          title: "Energía renovable — autoconsumo solar",
          text: "Solución fotovoltaica y medidas de eficiencia energética para autoconsumo sostenible. Incluyó evaluación de consumo, dimensionamiento de paneles e inversor, instalación y verificación de generación, complementada con reconversión LED en zonas críticas.",
          image: "/images/portfolio/pf-solar.jpg",
          category: "Ecológica",
          client: "Comercio / Industria",
          scope: "FV · LED · Auditoría",
          results: "Menor demanda de red y avance en metas de sostenibilidad.",
        },
        {
          title: "Proyecto habitacional certificado",
          text: "Instalaciones residenciales seguras y certificadas, listas para recepción: acometida, tablero general, protecciones, circuitos de fuerza e iluminación. Se entregó la obra con pruebas y documentación alineada a los requisitos de inspección.",
          image: "/images/portfolio/pf-home.jpg",
          category: "Habitacional",
          client: "Vivienda / Edificación",
          scope: "Acometida · Protecciones",
          results: "Recepción sin observaciones eléctricas relevantes.",
        }
      ],
      ctaTitle: '¿Tiene un proyecto en mente?',
      ctaButton: 'Solicitar cotización',
    },
    clientes: {
      items: [
        { name: 'Nestlé', logo: '/images/cliente-nestle.png' },
        { name: "Papa John's", logo: '/images/cliente-papajohns.png' },
        { name: 'Zero Corp', logo: '/images/cliente-zero.png' },
      ],
    },
    contacto: {
      heroImage: '/images/clientes-bg.jpg',
      heroTitle: 'Contacto',
      heroSubtitle: 'Estamos listos para atender su proyecto eléctrico',
      privacyTitle: 'Política de Privacidad',
      privacyParagraphs: [
        'En Patagonia Electric respetamos su privacidad. Los datos personales enviados a través del formulario de contacto (nombre, email, teléfono y mensaje) serán utilizados exclusivamente para responder a su consulta y gestionar la relación comercial solicitada.',
        'No compartimos sus datos con terceros sin su consentimiento. Puede solicitar la eliminación de sus datos escribiendo a contacto@patagoniaelectric.com.',
      ],
    },
    portafolio: portfolioDefaults(),
  };
}

async function getContent() {
  const defaults = defaultContent();
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf8');
    const saved = JSON.parse(raw);
    // El contenido guardado por el editor prevalece; los defaults solo rellenan claves nuevas.
    return mergeContentPreserveCms(defaults, saved);
  } catch {
    const defaultsOnly = defaultContent();
    await saveContent(defaultsOnly);
    return defaultsOnly;
  }
}

/**
 * Fusiona defaults de código con el JSON del CMS.
 * Regla: lo editado en admin/visual siempre gana.
 * Los defaults solo aportan secciones/campos nuevos que aún no existen en el CMS.
 */
function mergeContentPreserveCms(defaults, saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
    return cloneJson(defaults);
  }

  const out = {};
  const sectionKeys = new Set([...Object.keys(defaults || {}), ...Object.keys(saved)]);

  sectionKeys.forEach((section) => {
    const defSection = defaults?.[section];
    const savedSection = saved?.[section];

    if (savedSection === undefined) {
      out[section] = cloneJson(defSection);
      return;
    }
    if (defSection === undefined) {
      out[section] = cloneJson(savedSection);
      return;
    }
    out[section] = mergeSectionPreserveCms(defSection, savedSection);
  });

  // Reglas de producto que deben mantenerse aunque el CMS no las tenga
  if (out.portafolio && typeof out.portafolio === 'object') {
    out.portafolio.showInNav = false;
    if (typeof out.portafolio.published !== 'boolean') {
      out.portafolio.published = Boolean(defaults.portafolio?.published);
    }
  }

  return out;
}

function mergeSectionPreserveCms(defaults, saved) {
  if (Array.isArray(defaults)) {
    return Array.isArray(saved) ? cloneJson(saved) : cloneJson(defaults);
  }
  if (!isPlainObject(defaults)) {
    return saved === undefined ? cloneJson(defaults) : cloneJson(saved);
  }
  if (!isPlainObject(saved)) {
    return cloneJson(defaults);
  }

  const out = { ...cloneJson(defaults), ...cloneJson(saved) };
  Object.keys(defaults).forEach((key) => {
    const defVal = defaults[key];
    const savedVal = saved[key];

    if (savedVal === undefined) {
      out[key] = cloneJson(defVal);
      return;
    }
    if (Array.isArray(defVal)) {
      // Array del CMS gana siempre (incluye lista vacía intencional)
      out[key] = Array.isArray(savedVal) ? cloneJson(savedVal) : cloneJson(defVal);
      return;
    }
    if (isPlainObject(defVal) && isPlainObject(savedVal)) {
      out[key] = mergeSectionPreserveCms(defVal, savedVal);
      return;
    }
    out[key] = cloneJson(savedVal);
  });

  // Conservar claves extras que solo existan en el CMS
  Object.keys(saved).forEach((key) => {
    if (!(key in out)) out[key] = cloneJson(saved[key]);
  });

  return out;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneJson(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

async function saveContent(content) {
  await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true });
  // Guardar solo lo persistible del CMS (sin reintroducir defaults en disco de más)
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

async function updateSection(section, data) {
  const content = await getContent();
  content[section] = data;
  await saveContent(content);
  return content[section];
}

async function applyChange(change) {
  const content = await getContent();
  const { section, field, arrayField, index, value } = change;

  if (!content[section]) throw new Error('Sección no encontrada');

  if (arrayField) {
    if (!Array.isArray(content[section][arrayField])) {
      content[section][arrayField] = [];
    }
    const idx = Number(index);
    if (Number.isNaN(idx)) throw new Error('Índice inválido');
    if (field && field !== '_self') {
      if (!content[section][arrayField][idx]) content[section][arrayField][idx] = {};
      content[section][arrayField][idx][field] = value;
    } else {
      content[section][arrayField][idx] = value;
    }
  } else if (field) {
    content[section][field] = value;
  } else {
    throw new Error('Campo no especificado');
  }

  await saveContent(content);
  return content;
}

async function addArrayItem(section, arrayField) {
  const content = await getContent();
  const defaults = defaultContent();

  if (!content[section][arrayField]) content[section][arrayField] = [];

  const template =
    content[section][arrayField].at(-1) ||
    defaults[section]?.[arrayField]?.[0] ||
    {};

  content[section][arrayField].push(JSON.parse(JSON.stringify(template)));
  await saveContent(content);
  return content[section][arrayField];
}

async function removeArrayItem(section, arrayField, index) {
  const content = await getContent();
  const idx = Number(index);
  const list = content[section]?.[arrayField];

  if (!Array.isArray(list) || !list[idx]) throw new Error('Elemento no encontrado');
  if (list.length <= 1) throw new Error('Debe quedar al menos un elemento');

  list.splice(idx, 1);
  await saveContent(content);
  return list;
}

function mergeSiteConfig(staticSite, general) {
  return {
    ...staticSite,
    tagline: general.tagline,
    legalName: general.legalName,
    email: general.email,
    phone: general.phone,
    phoneRaw: general.phoneRaw,
    whatsapp: general.whatsapp,
    hours: general.hours,
    address: {
      street: general.city,
      city: general.city,
      region: general.region,
      country: general.country,
      countryCode: 'CL',
    },
  };
}

module.exports = {
  getContent,
  saveContent,
  updateSection,
  applyChange,
  addArrayItem,
  removeArrayItem,
  defaultContent,
  mergeSiteConfig,
  mergeContentPreserveCms,
  CONTENT_FILE,
};
