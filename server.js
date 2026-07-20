require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const { getSeo, pages, site: staticSite } = require('./config/seo');
const { getContent, mergeSiteConfig } = require('./lib/content');
const { renderPage } = require('./lib/render');
const { initAuth } = require('./lib/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'patagonia-electric-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
  })
);
app.use(express.static(path.join(__dirname, 'public')));

const routes = [
  ['/', 'index'],
  ['/nosotros', 'nosotros'],
  ['/industrial', 'industrial'],
  ['/division-ecologica', 'ecologica'],
  ['/habitacional', 'habitacional'],
  ['/proyectos', 'proyectos'],
  ['/contacto', 'contacto'],
];

routes.forEach(([route, page]) => {
  app.get(route, (req, res) => renderPage(res, page));
});

app.get('/portafolio', async (req, res) => {
  const content = await getContent();
  const isAdmin = Boolean(req.session?.admin);
  if (!content.portafolio?.published && !isAdmin) {
    return res.status(404).render('pages/portafolio-unavailable', {
      seo: {
        title: 'Portafolio no disponible | Patagonia Electric',
        description: 'El portafolio corporativo no está publicado en este momento.',
        canonical: `${staticSite.url}/portafolio`,
        keywordsStr: '',
        image: `${staticSite.url}/images/logo-color.png`,
        path: '/portafolio',
        ogType: 'website',
      },
      site: mergeSiteConfig(staticSite, content.general),
      content,
      c: content,
      currentPage: 'portafolio',
      editMode: false,
      cmsAttr: () => '',
      cmsList: () => '',
      visualPages: [],
      scrollTo: null,
      printMode: false,
      autoPrint: false,
    });
  }
  return renderPage(res, 'portafolio', { printMode: false, autoPrint: false });
});

async function renderPortfolioExport(req, res, { autoPrint = false } = {}) {
  const content = await getContent();
  const isAdmin = Boolean(req.session?.admin);
  if (!content.portafolio?.published && !isAdmin) {
    return res.status(404).send('Portafolio no publicado');
  }
  // Misma plantilla y CSS que la web, en modo exportación PDF
  return renderPage(res, 'portafolio', { printMode: true, autoPrint });
}

app.get('/portafolio/imprimir', (req, res) => renderPortfolioExport(req, res, { autoPrint: false }));
app.get('/portafolio.pdf', (req, res) => renderPortfolioExport(req, res, { autoPrint: true }));

app.use('/admin', adminRoutes);

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: ${staticSite.url}/sitemap.xml
`);
});

app.get('/sitemap.xml', async (req, res) => {
  const content = await getContent();
  const baseUrl = staticSite.url;
  const pageList = Object.entries(pages).filter(([key]) => {
    if (key === 'portafolio') return Boolean(content.portafolio?.published);
    return true;
  });
  const urls = pageList
    .map(
      ([, p]) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n');

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
});

async function saveMessage(data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, 'messages.json');
  let messages = [];
  try {
    const raw = await fs.readFile(file, 'utf8');
    messages = JSON.parse(raw);
  } catch {
    messages = [];
  }
  messages.push({ ...data, fecha: new Date().toISOString() });
  await fs.writeFile(file, JSON.stringify(messages, null, 2));
}

async function sendEmail(data, siteEmail) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return false;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO || siteEmail,
    replyTo: data.email,
    subject: `[Web] ${data.asunto || 'Consulta'} - ${data.nombre}`,
    text: `Nombre: ${data.nombre}
Email: ${data.email}
Teléfono: ${data.telefono || 'No indicado'}
Asunto: ${data.asunto || 'Consulta general'}

Mensaje:
${data.mensaje}`,
  });

  return true;
}

app.post('/api/contact', async (req, res) => {
  const { nombre, email, telefono, asunto, mensaje, privacidad } = req.body;
  const content = await getContent();

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim() || !privacidad) {
    return res.status(400).json({ ok: false, error: 'Complete los campos obligatorios y acepte la política de privacidad.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Ingrese un correo electrónico válido.' });
  }

  const data = {
    nombre: nombre.trim(),
    email: email.trim(),
    telefono: telefono?.trim() || '',
    asunto: asunto?.trim() || 'Consulta general',
    mensaje: mensaje.trim(),
  };

  try {
    await saveMessage(data);
    const emailed = await sendEmail(data, content.general.email);

    res.json({
      ok: true,
      message: emailed
        ? '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.'
        : '¡Mensaje recibido correctamente! Nos pondremos en contacto pronto.',
    });
  } catch (err) {
    console.error('Error al procesar contacto:', err);
    res.status(500).json({ ok: false, error: 'Error al enviar el mensaje. Intente por WhatsApp o teléfono.' });
  }
});

initAuth().then(() => {
  getContent().then(() => {
    app.listen(PORT, () => {
      console.log(`Patagonia Electric → http://localhost:${PORT}`);
      console.log(`Panel admin       → http://localhost:${PORT}/admin`);
      console.log(`Editor visual     → http://localhost:${PORT}/admin/visual`);
    });
  });
});
