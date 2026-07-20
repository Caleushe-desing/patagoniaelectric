const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const GREEN = '#008f00';
const DARK = '#1a2332';
const MUTED = '#5a6a78';
const LIGHT = '#f5f8f6';

function resolvePublicFile(urlPath) {
  if (!urlPath || typeof urlPath !== 'string') return null;
  const clean = urlPath.split('?')[0].replace(/^\/+/, '');
  const full = path.join(PUBLIC_DIR, clean);
  if (!full.startsWith(PUBLIC_DIR)) return null;
  if (!fs.existsSync(full)) return null;
  return full;
}

function drawFooter(doc, site, pageNum, total) {
  const bottom = doc.page.height - 36;
  doc.save();
  doc.strokeColor(GREEN).lineWidth(1).moveTo(48, bottom - 10).lineTo(doc.page.width - 48, bottom - 10).stroke();
  doc.fillColor(MUTED).fontSize(8).font('Helvetica');
  doc.text(`${site.name} · ${site.email} · ${site.phone}`, 48, bottom - 2, {
    width: doc.page.width - 140,
    align: 'left',
  });
  doc.text(`${pageNum} / ${total}`, 48, bottom - 2, {
    width: doc.page.width - 96,
    align: 'right',
  });
  doc.restore();
}

function sectionTitle(doc, title, y) {
  doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(11).text(title.toUpperCase(), 48, y);
  doc.strokeColor(GREEN).lineWidth(1.5).moveTo(48, y + 16).lineTo(180, y + 16).stroke();
  return y + 30;
}

function ensureSpace(doc, y, needed, onNewPage) {
  if (y + needed > doc.page.height - 56) {
    doc.addPage();
    onNewPage();
    return 52;
  }
  return y;
}

function buildPortfolioPdf(portafolio, site) {
  let PDFDocument;
  try {
    PDFDocument = require('pdfkit');
  } catch (err) {
    const error = new Error(
      'Falta la dependencia pdfkit en el servidor. Ejecute "npm install" en la carpeta del sitio y reinicie la aplicación.'
    );
    error.cause = err;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 48, bottom: 52, left: 48, right: 48 },
      info: {
        Title: portafolio.coverTitle || 'Portafolio Patagonia Electric',
        Author: site.name,
        Subject: site.tagline,
        Creator: 'Patagonia Electric Web',
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pages = [];
    const trackPage = () => pages.push(doc.page);

    // ── Cover ──
    trackPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(DARK);
    doc.rect(0, 0, 12, doc.page.height).fill(GREEN);

    const coverLogo = resolvePublicFile(site.logo || '/images/logo.png') || resolvePublicFile('/images/logo.png');
    if (coverLogo) {
      try {
        doc.image(coverLogo, 48, 72, { width: 120 });
      } catch {
        /* ignore bad image */
      }
    }

    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(28).text(site.name, 48, 220, { width: 500 });
    doc.fillColor(GREEN).fontSize(12).text((site.tagline || '').toUpperCase(), 48, 260);

    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(22).text(portafolio.coverTitle || 'Portafolio Corporativo', 48, 320, {
      width: 480,
    });
    if (portafolio.coverSubtitle) {
      doc.fillColor('#c8d0d8').font('Helvetica').fontSize(12).text(portafolio.coverSubtitle, 48, 360, { width: 480 });
    }
    if (portafolio.coverYear) {
      doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(14).text(String(portafolio.coverYear), 48, 420);
    }

    doc.fillColor('#9aa8b4').font('Helvetica').fontSize(9).text(
      `${site.address?.city || ''}, ${site.address?.region || ''} · ${site.address?.country || ''}`,
      48,
      doc.page.height - 80
    );

    // ── Intro ──
    doc.addPage();
    trackPage();
    let y = sectionTitle(doc, portafolio.introTitle || 'Quiénes somos', 52);
    doc.fillColor(DARK).font('Helvetica').fontSize(10.5);
    (portafolio.introParagraphs || []).forEach((p) => {
      y = ensureSpace(doc, y, 70, trackPage);
      doc.fillColor(DARK).font('Helvetica').fontSize(10.5).text(p, 48, y, {
        width: doc.page.width - 96,
        align: 'justify',
        lineGap: 3,
      });
      y = doc.y + 14;
    });

    // ── Strengths ──
    if ((portafolio.strengths || []).length) {
      y = ensureSpace(doc, y, 40, trackPage);
      y = sectionTitle(doc, portafolio.strengthsTitle || 'Por qué elegirnos', y + 8);
      (portafolio.strengths || []).forEach((item) => {
        y = ensureSpace(doc, y, 52, trackPage);
        doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(11).text(item.title || '', 48, y);
        y = doc.y + 4;
        doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(item.text || '', 48, y, {
          width: doc.page.width - 96,
          lineGap: 2,
        });
        y = doc.y + 14;
      });
    }

    // ── Divisions ──
    if ((portafolio.divisions || []).length) {
      doc.addPage();
      trackPage();
      y = sectionTitle(doc, portafolio.divisionsTitle || 'Nuestras divisiones', 52);
      (portafolio.divisions || []).forEach((item, i) => {
        y = ensureSpace(doc, y, 70, trackPage);
        doc.roundedRect(48, y, doc.page.width - 96, 58, 4).fill(LIGHT);
        doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(11).text(`${i + 1}. ${item.title || ''}`, 60, y + 12);
        doc.fillColor(MUTED).font('Helvetica').fontSize(9.5).text(item.text || '', 60, y + 28, {
          width: doc.page.width - 120,
          height: 24,
          ellipsis: true,
        });
        y += 70;
      });
    }

    // ── Projects ──
    if ((portafolio.projects || []).length) {
      doc.addPage();
      trackPage();
      y = sectionTitle(doc, portafolio.projectsTitle || 'Proyectos destacados', 52);
      if (portafolio.projectsSubtitle) {
        doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(portafolio.projectsSubtitle, 48, y, {
          width: doc.page.width - 96,
        });
        y = doc.y + 16;
      }

      (portafolio.projects || []).forEach((project) => {
        y = ensureSpace(doc, y, 120, trackPage);
        const startY = y;
        const imgPath = resolvePublicFile(project.image);
        const textX = imgPath ? 188 : 48;
        const textW = imgPath ? doc.page.width - 236 : doc.page.width - 96;

        if (imgPath) {
          try {
            doc.image(imgPath, 48, startY, { width: 120, height: 90, fit: [120, 90], align: 'center', valign: 'center' });
            doc.rect(48, startY, 120, 90).strokeColor('#dde5ea').lineWidth(0.5).stroke();
          } catch {
            /* skip */
          }
        }

        let textY = startY;
        const meta = [project.category, project.client].filter(Boolean).join(' · ');
        if (meta) {
          doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(8).text(meta.toUpperCase(), textX, textY, { width: textW });
          textY = doc.y + 4;
        }
        doc.fillColor(DARK).font('Helvetica-Bold').fontSize(12).text(project.title || '', textX, textY, { width: textW });
        textY = doc.y + 6;
        doc.fillColor(MUTED).font('Helvetica').fontSize(9.5).text(project.text || '', textX, textY, {
          width: textW,
          lineGap: 2,
        });
        y = Math.max(doc.y, imgPath ? startY + 90 : doc.y) + 18;
      });
    }

    // ── Clients ──
    if ((portafolio.clients || []).length) {
      y = ensureSpace(doc, y, 80, trackPage);
      if (y > 52) {
        /* stay on page if space */
      }
      y = sectionTitle(doc, portafolio.clientsTitle || 'Clientes', y + 4);
      if (portafolio.clientsSubtitle) {
        doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(portafolio.clientsSubtitle, 48, y, {
          width: doc.page.width - 96,
        });
        y = doc.y + 12;
      }
      const names = (portafolio.clients || []).map((c) => c.name).filter(Boolean);
      doc.fillColor(DARK).font('Helvetica').fontSize(11).text(names.join('   ·   '), 48, y, {
        width: doc.page.width - 96,
        lineGap: 6,
      });
      y = doc.y + 20;
    }

    // ── Closing ──
    doc.addPage();
    trackPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(DARK);
    doc.rect(0, 0, 12, doc.page.height).fill(GREEN);
    doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(11).text('CONTACTO', 48, 160);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(22).text(portafolio.closingTitle || 'Trabajemos juntos', 48, 190, {
      width: 480,
    });
    doc.fillColor('#c8d0d8').font('Helvetica').fontSize(11).text(portafolio.closingText || '', 48, 240, {
      width: 460,
      lineGap: 4,
    });
    doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(12).text(portafolio.contactNote || `${site.email} · ${site.phone}`, 48, 340, {
      width: 460,
    });
    doc.fillColor('#9aa8b4').font('Helvetica').fontSize(9).text(site.url || 'https://www.patagoniaelectric.com', 48, 380);

    // Footers on content pages (skip cover and closing which are full-bleed)
    const range = doc.bufferedPageRange();
    const total = range.count;
    for (let i = range.start; i < range.start + range.count; i++) {
      const isCover = i === range.start;
      const isClosing = i === range.start + range.count - 1;
      if (isCover || isClosing) continue;
      doc.switchToPage(i);
      drawFooter(doc, site, i - range.start + 1, total);
    }

    doc.end();
  });
}

module.exports = { buildPortfolioPdf, resolvePublicFile };
