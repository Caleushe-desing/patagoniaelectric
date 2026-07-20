const { getSeo, site: staticSite } = require('../config/seo');
const { getContent, mergeSiteConfig } = require('./content');

const PAGE_KEYS = ['index', 'nosotros', 'industrial', 'ecologica', 'habitacional', 'proyectos', 'portafolio', 'contacto'];

const VISUAL_PAGES = [
  { key: 'index', label: 'Inicio', path: '/' },
  { key: 'nosotros', label: 'Nosotros', path: '/nosotros' },
  { key: 'industrial', label: 'División Industrial', path: '/industrial' },
  { key: 'ecologica', label: 'División Ecológica', path: '/division-ecologica' },
  { key: 'habitacional', label: 'División Habitacional', path: '/habitacional' },
  { key: 'proyectos', label: 'Proyectos', path: '/proyectos' },
  { key: 'portafolio', label: 'Portafolio comercial', path: '/portafolio' },
  { key: 'clientes', label: 'Clientes', path: '/#clientes', renderKey: 'index', scrollTo: 'clientes' },
  { key: 'contacto', label: 'Contacto', path: '/contacto' },
];

function buildCmsAttr(editMode, section, field, options = {}) {
  if (!editMode) return '';
  const attrs = [`data-cms-section="${section}"`, `data-cms-field="${field}"`];
  if (options.arrayField) attrs.push(`data-cms-array="${options.arrayField}"`);
  if (options.index != null) attrs.push(`data-cms-index="${options.index}"`);
  if (options.type) attrs.push(`data-cms-type="${options.type}"`);
  return attrs.join(' ');
}

function buildCmsList(editMode, section, arrayField) {
  if (!editMode) return '';
  return `data-cms-list="1" data-cms-section="${section}" data-cms-array="${arrayField}"`;
}

async function renderPage(res, pageKey, extra = {}) {
  const editMode = Boolean(extra.editMode);
  const content = await getContent();
  const site = mergeSiteConfig(staticSite, content.general);
  const cmsAttr = (section, field, options = {}) => buildCmsAttr(editMode, section, field, options);
  const cmsList = (section, arrayField) => buildCmsList(editMode, section, arrayField);

  res.render(`pages/${pageKey}`, {
    seo: getSeo(pageKey),
    site,
    content,
    c: content,
    currentPage: extra.visualPageKey || pageKey,
    editMode,
    cmsAttr,
    cmsList,
    visualPages: VISUAL_PAGES,
    scrollTo: extra.scrollTo || null,
    ...extra,
  });
}

module.exports = {
  renderPage,
  PAGE_KEYS,
  VISUAL_PAGES,
};
