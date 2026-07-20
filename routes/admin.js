const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { getContent, updateSection, applyChange, addArrayItem, removeArrayItem } = require('../lib/content');
const { verifyLogin, requireAuth } = require('../lib/auth');
const { renderPage, VISUAL_PAGES, PAGE_KEYS } = require('../lib/render');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
});

const SECTIONS = {
  general: { label: 'Datos generales', fields: 'general', description: 'Contacto, horarios y pie de página', group: 'config' },
  home: { label: 'Inicio', fields: 'home', description: 'Hero, divisiones, ventajas y proyectos destacados', group: 'pages' },
  nosotros: { label: 'Nosotros', fields: 'nosotros', description: 'Historia, valores y equipo', group: 'pages' },
  industrial: { label: 'División Industrial', fields: 'division', description: 'Servicios y soluciones industriales', group: 'divisions' },
  ecologica: { label: 'División Ecológica', fields: 'division', description: 'Energías renovables y eficiencia', group: 'divisions' },
  habitacional: { label: 'División Habitacional', fields: 'division', description: 'Instalaciones residenciales', group: 'divisions' },
  proyectos: { label: 'Proyectos', fields: 'proyectos', description: 'Galería de obras realizadas', group: 'portfolio' },
  clientes: { label: 'Clientes', fields: 'clientes', description: 'Logos y marcas asociadas', group: 'portfolio' },
  portafolio: {
    label: 'Portafolio comercial',
    fields: 'portafolio',
    description: 'Versión digital y PDF para compartir con clientes',
    group: 'portfolio',
  },
  contacto: { label: 'Contacto', fields: 'contacto', description: 'Hero y política de privacidad', group: 'pages' },
};

router.get('/login', (req, res) => {
  if (req.session?.admin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ok = await verifyLogin(username, password);
  if (!ok) return res.render('admin/login', { error: 'Usuario o contraseña incorrectos' });
  req.session.admin = true;
  req.session.adminUser = username;
  res.redirect('/admin');
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/', requireAuth, async (req, res) => {
  res.render('admin/dashboard', { sections: SECTIONS, user: req.session.adminUser, currentSection: null });
});

router.get('/visual', requireAuth, (req, res) => {
  res.redirect('/admin/visual/index');
});

router.get('/visual/:page', requireAuth, async (req, res) => {
  const pageKey = req.params.page;
  const visual = VISUAL_PAGES.find((p) => p.key === pageKey);
  if (!visual) return res.status(404).send('Página no encontrada');
  const renderKey = visual.renderKey || pageKey;
  if (!PAGE_KEYS.includes(renderKey)) return res.status(404).send('Página no encontrada');
  await renderPage(res, renderKey, {
    editMode: true,
    visualPageKey: pageKey,
    scrollTo: visual.scrollTo || null,
  });
});

router.post('/api/visual/patch', requireAuth, async (req, res) => {
  try {
    await applyChange(req.body);
    res.json({ ok: true, message: 'Cambio guardado' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message || 'Error al guardar' });
  }
});

router.post('/api/visual/add', requireAuth, async (req, res) => {
  const { section, arrayField } = req.body;
  try {
    const list = await addArrayItem(section, arrayField);
    res.json({ ok: true, message: 'Elemento agregado', count: list.length });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message || 'Error al agregar' });
  }
});

router.post('/api/visual/remove', requireAuth, async (req, res) => {
  const { section, arrayField, index } = req.body;
  try {
    await removeArrayItem(section, arrayField, index);
    res.json({ ok: true, message: 'Elemento eliminado' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message || 'Error al eliminar' });
  }
});

router.get('/edit/:section', requireAuth, async (req, res) => {
  const key = req.params.section;
  if (!SECTIONS[key]) return res.status(404).send('Sección no encontrada');
  const content = await getContent();
  res.render('admin/edit', {
    sectionKey: key,
    sectionMeta: SECTIONS[key],
    sections: SECTIONS,
    data: content[key],
    content,
    user: req.session.adminUser,
    currentSection: key,
  });
});

router.post('/api/content/:section', requireAuth, async (req, res) => {
  const key = req.params.section;
  if (!SECTIONS[key]) return res.status(404).json({ ok: false, error: 'Sección no encontrada' });
  try {
    const payload = { ...req.body };
    if (key === 'portafolio') {
      payload.showInNav = false;
      payload.published = Boolean(payload.published);
    }
    await updateSection(key, payload);
    res.json({ ok: true, message: 'Contenido guardado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al guardar' });
  }
});

router.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'No se recibió imagen' });
  res.json({ ok: true, url: `/uploads/${req.file.filename}` });
});

router.get('/portafolio/pdf', requireAuth, (req, res) => {
  res.redirect('/portafolio.pdf');
});

module.exports = router;
