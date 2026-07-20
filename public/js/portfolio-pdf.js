/**
 * Exportación PDF profesional del portafolio (A4 vertical).
 * - Cada sección clave empieza en hoja nueva.
 * - Tarjetas/bloques no se cortan a mitad de página.
 * - Márgenes 15mm y colores corporativos conservados.
 */
(function () {
  const CAPTURE_WIDTH = 794;
  const PAGE_MARGIN_MM = 15;
  const BLOCK_GAP_MM = 3;
  const SCRIPT_SRCS = {
    html2canvas: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    jspdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
  };
  const VERTICAL_CAPTURE_CSS = `
    .pf-pdf-bg-img {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      z-index: 0 !important;
    }
    .pf-hero__media, .pf-cta__media { background-image: none !important; }
    .pf-stats__grid,
    .pf-strengths,
    .pf-services,
    .pf-divisions,
    .pf-process__list,
    .pf-projects,
    .pf-about__grid,
    .pf-mission__grid,
    .pf-project,
    .pf-clients {
      grid-template-columns: 1fr !important;
    }
    .pf-hero {
      min-height: 480px !important;
      align-items: flex-end !important;
    }
    .pf-hero__title {
      max-width: none !important;
      font-size: 2.35rem !important;
    }
    .pf-hero__content { padding: 2.2rem 0 1.8rem !important; }
    .pf-section { padding: 1.6rem 0 !important; }
    .pf-stats { padding: 1.3rem 0 !important; }
    .pf-division { min-height: 260px !important; }
    .pf-project__image { min-height: 180px !important; }
    .pf-cta { min-height: 280px !important; }
    .pf-cta__inner { flex-direction: column !important; align-items: flex-start !important; }
    .pf-about__visual img { aspect-ratio: 16/10 !important; }
    .pf-hero__badge, .pf-hero__year, .pf-hero__title,
    .pf-hero__subtitle, .pf-hero__actions {
      opacity: 1 !important;
      animation: none !important;
      transform: none !important;
    }
    .pf-hero__media { animation: none !important; transform: none !important; }
    .no-print, .pf-export-toolbar, [data-pf-pdf-download], .pf-share {
      display: none !important;
    }
  `;

  const CARD_SELECTORS = [
    '.pf-stat',
    '.pf-mission__card',
    '.pf-strength',
    '.pf-service',
    '.pf-division',
    '.pf-project',
    '.pf-client',
    '.pf-process__list > li',
  ].join(',');

  let busy = false;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if ([...document.scripts].some((s) => s.src === src)) {
        resolve();
        return;
      }
      const el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error('No se pudo cargar ' + src));
      document.head.appendChild(el);
    });
  }

  async function ensureLibs() {
    if (!window.html2canvas) await loadScript(SCRIPT_SRCS.html2canvas);
    if (!(window.jspdf && window.jspdf.jsPDF)) await loadScript(SCRIPT_SRCS.jspdf);
  }

  function setStatus(msg) {
    document.querySelectorAll('[data-pf-pdf-status]').forEach((node) => {
      node.textContent = msg || '';
    });
  }

  function setBusy(on) {
    busy = on;
    document.querySelectorAll('[data-pf-pdf-download]').forEach((btn) => {
      btn.disabled = on;
      if (on) btn.setAttribute('aria-busy', 'true');
      else btn.removeAttribute('aria-busy');
    });
  }

  async function waitForImages(root) {
    const imgs = [...root.querySelectorAll('img')];
    await Promise.all(
      imgs.map((img) => {
        img.loading = 'eager';
        if (img.decode) return img.decode().catch(() => undefined);
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      })
    );
  }

  async function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
    }
  }

  function absoluteUrl(url) {
    try {
      return new URL(url, window.location.origin).href;
    } catch {
      return url;
    }
  }

  function materializeBackgrounds(root) {
    const created = [];
    root.querySelectorAll('.pf-hero__media, .pf-cta__media').forEach((node) => {
      const bg = getComputedStyle(node).backgroundImage;
      const match = bg && bg.match(/url\(["']?(.+?)["']?\)/);
      if (!match) return;
      const img = document.createElement('img');
      img.className = 'pf-pdf-bg-img';
      img.alt = '';
      img.src = absoluteUrl(match[1]);
      img.decoding = 'sync';
      img.loading = 'eager';
      node.appendChild(img);
      created.push(img);
    });
    return created;
  }

  function cleanupBackgrounds(imgs) {
    imgs.forEach((img) => img.remove());
  }

  function getPortfolioSections(root) {
    return [...root.children].filter(
      (el) => el.tagName === 'SECTION' && !el.classList.contains('no-print')
    );
  }

  /**
   * Parte cada sección en unidades atómicas (encabezado + tarjetas)
   * para poder empaquetarlas sin cortar bloques.
   */
  function collectUnits(root) {
    const units = [];
    const sections = getPortfolioSections(root);

    sections.forEach((section, sectionIndex) => {
      const cards = [...section.querySelectorAll(CARD_SELECTORS)].filter((card) => {
        // Evitar anidar (p.ej. stats dentro de otra cosa)
        return !card.parentElement?.closest(CARD_SELECTORS);
      });

      if (cards.length >= 2) {
        const headParts = [];
        const head = section.querySelector('.pf-section__head');
        const kickerOnly = section.querySelector(':scope > .container > .pf-kicker');
        if (head) headParts.push(head);
        else if (kickerOnly) headParts.push(kickerOnly);

        if (headParts.length) {
          units.push({
            els: headParts,
            breakBefore: sectionIndex > 0,
            background: getComputedStyle(section).backgroundColor || '#ffffff',
          });
        } else {
          // Sin head explícito: primera tarjeta abre sección
          units.push({
            els: [cards[0]],
            breakBefore: sectionIndex > 0,
            background: '#ffffff',
          });
          cards.slice(1).forEach((card) => {
            units.push({ els: [card], breakBefore: false, background: '#ffffff' });
          });
          return;
        }

        cards.forEach((card) => {
          units.push({ els: [card], breakBefore: false, background: '#ffffff' });
        });
        return;
      }

      // Sección completa (hero, about, mission corta, cta…)
      units.push({
        els: [section],
        breakBefore: sectionIndex > 0,
        background: '#ffffff',
      });
    });

    return units;
  }

  function applyCloneStyles(doc, el) {
    const target = el;
    target.style.width = CAPTURE_WIDTH + 'px';
    target.style.maxWidth = CAPTURE_WIDTH + 'px';
    target.style.margin = '0';
    target.style.boxSizing = 'border-box';
    const style = doc.createElement('style');
    style.textContent = VERTICAL_CAPTURE_CSS;
    doc.head.appendChild(style);
  }

  async function captureElement(el) {
    return window.html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      windowWidth: CAPTURE_WIDTH,
      scrollX: 0,
      scrollY: -window.scrollY,
      logging: false,
      imageTimeout: 15000,
      onclone: (doc, cloned) => applyCloneStyles(doc, cloned),
    });
  }

  async function captureUnit(unit) {
    if (unit.els.length === 1) {
      return captureElement(unit.els[0]);
    }

    // Varios nodos (p.ej. head): capturar contenedor temporal
    const wrap = document.createElement('div');
    wrap.className = 'pf-pdf-unit-wrap';
    wrap.style.cssText = `width:${CAPTURE_WIDTH}px;background:#fff;padding:8px 0;`;
    const clones = unit.els.map((el) => el.cloneNode(true));
    clones.forEach((c) => wrap.appendChild(c));
    document.body.appendChild(wrap);
    try {
      await waitForImages(wrap);
      return await captureElement(wrap);
    } finally {
      wrap.remove();
    }
  }

  function placeCanvas(pdf, canvas, pageWidth, pageHeight, cursor) {
    const contentW = pageWidth - PAGE_MARGIN_MM * 2;
    const contentH = pageHeight - PAGE_MARGIN_MM * 2;
    let drawW = contentW;
    let drawH = (canvas.height * contentW) / canvas.width;

    // Si un bloque entero no cabe en una hoja, se escala para no cortarlo
    if (drawH > contentH) {
      const scale = contentH / drawH;
      drawH = contentH;
      drawW = drawW * scale;
    }

    let { y, needsNewPage } = cursor;

    if (needsNewPage || (y > PAGE_MARGIN_MM && y + drawH > pageHeight - PAGE_MARGIN_MM)) {
      pdf.addPage();
      y = PAGE_MARGIN_MM;
    }

    const x = PAGE_MARGIN_MM + (contentW - drawW) / 2;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.93);
    pdf.addImage(dataUrl, 'JPEG', x, y, drawW, drawH, undefined, 'FAST');

    return {
      y: y + drawH + BLOCK_GAP_MM,
      needsNewPage: false,
    };
  }

  async function exportPortfolioPdf() {
    if (busy) return;
    const target = document.querySelector('.pf');
    if (!target) {
      setStatus('No se encontró el portafolio para exportar.');
      return;
    }

    const units = collectUnits(target);
    if (!units.length) {
      setStatus('No hay contenido para exportar.');
      return;
    }

    setBusy(true);
    setStatus('Preparando PDF profesional (A4)…');

    const prevTitle = document.title;
    let bgImgs = [];

    try {
      await ensureLibs();
      await waitForFonts();
      bgImgs = materializeBackgrounds(target);
      await waitForImages(target);
      document.body.classList.add('pf-pdf-capturing');

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let cursor = { y: PAGE_MARGIN_MM, needsNewPage: false };

      for (let i = 0; i < units.length; i += 1) {
        const unit = units[i];
        setStatus(`Componiendo bloque ${i + 1} de ${units.length}…`);

        if (unit.breakBefore && i > 0) {
          cursor = { y: PAGE_MARGIN_MM, needsNewPage: true };
        }

        const canvas = await captureUnit(unit);
        cursor = placeCanvas(pdf, canvas, pageWidth, pageHeight, cursor);
      }

      pdf.save('Patagonia-Electric-Portafolio.pdf');
      setStatus('PDF descargado con saltos limpios y sin cortes de bloques.');
    } catch (err) {
      console.error(err);
      setStatus('No se pudo generar el PDF automático. Use Imprimir → Guardar como PDF.');
    } finally {
      cleanupBackgrounds(bgImgs);
      document.body.classList.remove('pf-pdf-capturing');
      document.title = prevTitle;
      setBusy(false);
    }
  }

  function bindButtons() {
    document.querySelectorAll('[data-pf-pdf-download]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        exportPortfolioPdf();
      });
    });
  }

  window.PatagoniaPortfolioPdf = { export: exportPortfolioPdf };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindButtons);
  } else {
    bindButtons();
  }

  function maybeAutoExport() {
    if (document.body.classList.contains('pf-print-mode') && document.body.dataset.autoPdf === '1') {
      setTimeout(() => exportPortfolioPdf(), 600);
    }
  }

  if (document.readyState === 'complete') {
    maybeAutoExport();
  } else {
    window.addEventListener('load', maybeAutoExport);
  }
})();
