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
    .pf-pdf-bg-img { display: none !important; }
    .pf-hero__media, .pf-hero__veil, .pf-hero__grid,
    .pf-cta__media, .pf-cta__veil { display: none !important; }

    .pf, .pf > section, .pf-hero, .pf-stats, .pf-section,
    .pf-section--dark, .pf-section--soft, .pf-cta, .pf-mission,
    .pf-about, .pf-process, .container {
      background: #ffffff !important;
      background-image: none !important;
      color: #111111 !important;
    }

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

    .pf-hero, .pf-cta {
      min-height: 0 !important;
      border: 1px solid #e5e7eb !important;
      color: #111111 !important;
    }
    .pf-hero__content, .pf-cta__inner {
      position: relative !important;
      z-index: 1 !important;
      padding: 1.5rem 0 !important;
    }
    .pf-hero__title { max-width: none !important; font-size: 2.2rem !important; color: #111111 !important; }
    .pf-hero__badge {
      opacity: 1 !important; animation: none !important; transform: none !important;
      background: #f3f7f4 !important; border-color: #b7e0b9 !important; color: #0a6b0a !important;
    }
    .pf-hero__year, .pf-hero__subtitle, .pf-hero__actions {
      opacity: 1 !important; animation: none !important; transform: none !important;
    }
    .pf-hero__year { color: #0a6b0a !important; }
    .pf-hero__subtitle { color: #333333 !important; }
    .pf-hero__actions .pf-btn--ghost,
    .pf-cta__actions .pf-btn--ghost {
      border-color: #111111 !important; color: #111111 !important;
    }

    .pf-section { padding: 1.4rem 0 !important; }
    .pf-stats {
      padding: 1.2rem 0 !important;
      border-top: 2px solid #00a800 !important;
      border-bottom: 1px solid #e5e7eb !important;
    }

    .pf-kicker, .pf-title, .pf-title--light { color: #111111 !important; }
    .pf-kicker { color: #0a6b0a !important; }
    .pf-lead, .pf-lead--muted, .pf-prose p { color: #333333 !important; }

    .pf-stat, .pf-mission__card, .pf-mission__card--alt, .pf-strength,
    .pf-service, .pf-division, .pf-project, .pf-client, .pf-process__list > li {
      background: #f9f9f9 !important;
      background-image: none !important;
      border: 1px solid #e5e7eb !important;
      box-shadow: none !important;
      color: #111111 !important;
    }
    .pf-stat strong, .pf-mission__card h3, .pf-service__num,
    .pf-division__body span, .pf-process__list li::before,
    .pf-project__meta, .pf-cta__note { color: #0a6b0a !important; }
    .pf-stat span, .pf-mission__card p, .pf-strength p, .pf-service p,
    .pf-division__body p, .pf-process__list span, .pf-project__body p,
    .pf-client figcaption, .pf-cta__text { color: #333333 !important; }
    .pf-strength h3, .pf-service h3, .pf-division__body h3,
    .pf-project__body h3, .pf-process__list strong,
    .pf-cta__title, .pf-project__scope { color: #111111 !important; }

    .pf-division { min-height: 0 !important; position: relative !important; overflow: hidden !important; }
    .pf-division img {
      position: relative !important; inset: auto !important;
      width: 100% !important; height: auto !important; max-height: 220px !important;
      object-fit: cover !important;
    }
    .pf-division__body {
      position: relative !important; inset: auto !important;
      padding: 0.9rem !important; background: transparent !important;
    }
    .pf-project__image { min-height: 160px !important; }
    .pf-about__visual img { aspect-ratio: 16/10 !important; }
    .pf-cta__inner { flex-direction: column !important; align-items: flex-start !important; }
    .pf-process__list > li { border-top: 3px solid #00a800 !important; }
    .pf-client img { filter: none !important; opacity: 1 !important; }

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
   * Parte secciones largas en unidades atómicas (encabezado + tarjetas).
   * Secciones compactas se capturan enteras para no perder fondos ni dejar huecos raros.
   */
  function collectUnits(root) {
    const units = [];
    const sections = getPortfolioSections(root);

    sections.forEach((section, sectionIndex) => {
      const keepWhole =
        section.classList.contains('pf-hero') ||
        section.classList.contains('pf-stats') ||
        section.classList.contains('pf-about') ||
        section.classList.contains('pf-mission') ||
        section.classList.contains('pf-cta');

      const cards = [...section.querySelectorAll(CARD_SELECTORS)].filter((card) => {
        return !card.parentElement?.closest(CARD_SELECTORS);
      });

      if (!keepWhole && cards.length >= 2) {
        const head = section.querySelector('.pf-section__head');
        if (head) {
          units.push({
            els: [head],
            breakBefore: sectionIndex > 0,
          });
          cards.forEach((card) => {
            units.push({ els: [card], breakBefore: false });
          });
          return;
        }
      }

      units.push({
        els: [section],
        breakBefore: sectionIndex > 0,
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
      backgroundColor: '#ffffff',
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
