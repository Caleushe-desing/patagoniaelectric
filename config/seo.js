const site = require('./site');

const pages = {
  index: {
    title: 'Patagonia Electric | Soluciones eléctricas con atención experta',
    description:
      'Patagonia Electric: más de 10 años en ingeniería eléctrica, automatización industrial y montaje eléctrico en Frutillar, Región de los Lagos. Cotice su proyecto hoy.',
    keywords: [
      ...site.defaultKeywords,
      'soluciones eléctricas',
      'empresa instalaciones eléctricas Chile',
      'electricidad industrial Frutillar',
    ],
    path: '/',
    ogType: 'website',
  },
  nosotros: {
    title: 'Nosotros | Patagonia Electric - Equipo multidisciplinario',
    description:
      'Conozca al equipo Patagonia Electric: profesionales en seguridad, logística, ingeniería y técnicos certificados. Empresa chilena con más de 10 años de experiencia.',
    keywords: [
      ...site.defaultKeywords,
      'equipo Patagonia Electric',
      'empresa eléctrica chilena',
      'técnicos electricistas certificados',
      'nosotros Patagonia Electric',
    ],
    path: '/nosotros',
    ogType: 'website',
  },
  industrial: {
    title: 'División Industrial | Patagonia Electric',
    description:
      'Instalaciones eléctricas industriales, tableros de potencia, comando y control, mantenimiento preventivo y automatización industrial. Media tensión en Los Lagos.',
    keywords: [
      ...site.defaultKeywords,
      'instalaciones eléctricas industriales',
      'tableros de potencia Chile',
      'automatización industrial',
      'mantenimiento eléctrico industrial',
      'montaje tableros eléctricos',
      'media tensión',
    ],
    path: '/industrial',
    ogType: 'website',
  },
  ecologica: {
    title: 'División Ecológica | Patagonia Electric - Energías renovables',
    description:
      'Paneles solares fotovoltaicos, energías renovables y eficiencia energética. División Ecológica de Patagonia Electric en la Región de los Lagos.',
    keywords: [
      ...site.defaultKeywords,
      'paneles solares Frutillar',
      'energías renovables Chile',
      'instalación solar fotovoltaica',
      'eficiencia energética',
      'división ecológica',
      'energía limpia',
    ],
    path: '/division-ecologica',
    ogType: 'website',
  },
  habitacional: {
    title: 'División Habitacional | Patagonia Electric',
    description:
      'Instalaciones eléctricas residenciales certificadas: acometida, distribución, protecciones e iluminación para viviendas en Frutillar y Los Lagos.',
    keywords: [
      ...site.defaultKeywords,
      'instalación eléctrica residencial',
      'electricista habitacional',
      'instalaciones eléctricas viviendas',
      'electricidad hogar Chile',
      'certificación SEC eléctrica',
    ],
    path: '/habitacional',
    ogType: 'website',
  },
  proyectos: {
    title: 'Proyectos | Patagonia Electric - Portafolio eléctrico',
    description:
      'Galería de proyectos eléctricos industriales, tableros de control, infraestructura y montaje eléctrico ejecutados por Patagonia Electric.',
    keywords: [
      ...site.defaultKeywords,
      'proyectos eléctricos',
      'portafolio instalaciones eléctricas',
      'obras eléctricas Chile',
      'montaje eléctrico proyectos',
    ],
    path: '/proyectos',
    ogType: 'website',
  },
  contacto: {
    title: 'Contacto | Patagonia Electric - Frutillar, Los Lagos',
    description:
      'Contáctenos: contacto@patagoniaelectric.com | +56 9 6227 4047. Horario Lun-Vie 08:30-18:00. Frutillar, Región de los Lagos, Chile.',
    keywords: [
      ...site.defaultKeywords,
      'contacto Patagonia Electric',
      'cotización instalación eléctrica',
      'electricista Frutillar contacto',
      'presupuesto proyecto eléctrico',
    ],
    path: '/contacto',
    ogType: 'website',
  },
};

function getSeo(pageKey) {
  const page = pages[pageKey] || pages.index;
  return {
    ...page,
    canonical: `${site.url}${page.path}`,
    keywordsStr: page.keywords.join(', '),
    image: `${site.url}/images/logo-color.png`,
  };
}

module.exports = { pages, getSeo, site };
