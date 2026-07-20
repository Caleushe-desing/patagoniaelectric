/**
 * Genera un PDF vertical (A4) del portafolio.
 * Cada sección del portafolio empieza en una hoja nueva;
 * no se corta contenido a mitad de página entre secciones.
 */
(function () {
  const CAPTURE_WIDTH = 794;
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
      min-height: 520px !important;
      align-items: flex-end !important;
    }
    .pf-hero__title {
      max-width: none !important;
      font-size: 2.4rem !important;
    }
    .pf-hero__content { padding: 2.5rem 0 2rem !important; }
    .pf-section { padding: 2.2rem 0 !important; }
    .pf-stats { padding: 1.6rem 0 !important; }
    .pf-division { min-height: 280px !important; }
    .pf-project__image { min-height: 200px !important; }
    .pf-cta { min-height: 320px !important; }
    .pf-cta__inner { flex-direction: column !important; align-items: flex-start !important; }
    .pf-about__visual img { aspect-ratio: 16/10 !important; }
    .pf-hero__badge, .pf-hero__year, .pf-hero__title,
    .pf-hero__subtitle, .pf-hero__actions {
      opacity: 1 !important;
      animation: none !important;
      transform: none !important;
    }
    .pf-hero__media { animation: none !important; transform: none !important; }
    .no-print, .pf-export-toolbar { display: none !important; }
  `;

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

  function applyCloneStyles(doc, sectionEl) {
    sectionEl.style.width = CAPTURE_WIDTH + 'px';
    sectionEl.style.maxWidth = CAPTURE_WIDTH + 'px';
    sectionEl.style.margin = '0';
    sectionEl.style.boxSizing = 'border-box';
    const style = doc.createElement('style');
    style.textContent = VERTICAL_CAPTURE_CSS;
    doc.head.appendChild(style);
  }

  async function captureSection(section) {
    return window.html2canvas(section, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: CAPTURE_WIDTH,
      scrollX: 0,
      scrollY: -window.scrollY,
      logging: false,
      imageTimeout: 15000,
      onclone: (doc, el) => applyCloneStyles(doc, el),
    });
  }

  /**
   * Añade un canvas al PDF empezando siempre en hoja nueva.
   * Si la sección es más alta que una hoja, continúa en hojas siguientes
   * sin mezclar con otra sección.
   */
  function addSectionCanvasToPdf(pdf, canvas, pageWidth, pageHeight) {
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.93);

    // Primera hoja de la sección
    let y = 0;
    let remaining = imgHeight;
    let first = true;

    while (remaining > 0.5) {
      if (!first) pdf.addPage();
      first = false;

      // Dibuja el tramo visible de esta hoja (recorte por desplazamiento Y)
      pdf.addImage(dataUrl, 'JPEG', 0, y, imgWidth, imgHeight, undefined, 'FAST');

      remaining -= pageHeight;
      y -= pageHeight;
    }
  }

  async function exportPortfolioPdf() {
    if (busy) return;
    const target = document.querySelector('.pf');
    if (!target) {
      setStatus('No se encontró el portafolio para exportar.');
      return;
    }

    const sections = getPortfolioSections(target);
    if (!sections.length) {
      setStatus('No hay secciones para exportar.');
      return;
    }

    setBusy(true);
    setStatus('Preparando PDF por secciones…');

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

      for (let i = 0; i < sections.length; i += 1) {
        setStatus(`Capturando sección ${i + 1} de ${sections.length}…`);
        if (i > 0) pdf.addPage();
        const canvas = await captureSection(sections[i]);
        addSectionCanvasToPdf(pdf, canvas, pageWidth, pageHeight);
      }

      pdf.save('Patagonia-Electric-Portafolio.pdf');
      setStatus('PDF descargado: una sección por hoja.');
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
