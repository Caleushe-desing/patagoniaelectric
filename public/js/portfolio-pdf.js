/**
 * Genera un PDF visualmente idéntico al portafolio web
 * (colores, fotos, tipografía y layout de escritorio).
 */
(function () {
  const CAPTURE_WIDTH = 1440;
  const SCRIPT_SRCS = {
    html2canvas: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    jspdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
  };

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
        if (img.decode) {
          return img.decode().catch(() => undefined);
        }
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

  /** html2canvas a veces falla con background-image en CSS; clona a <img> temporales. */
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

  async function exportPortfolioPdf() {
    if (busy) return;
    const target = document.querySelector('.pf');
    if (!target) {
      setStatus('No se encontró el portafolio para exportar.');
      return;
    }

    setBusy(true);
    setStatus('Preparando PDF idéntico a la web…');

    const prevTitle = document.title;
    let bgImgs = [];

    try {
      await ensureLibs();
      await waitForFonts();
      bgImgs = materializeBackgrounds(target);
      await waitForImages(target);

      document.body.classList.add('pf-pdf-capturing');
      setStatus('Capturando diseño, fotos y colores…');

      const canvas = await window.html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: CAPTURE_WIDTH,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        imageTimeout: 15000,
        onclone: (doc) => {
          const cloned = doc.querySelector('.pf');
          if (!cloned) return;
          cloned.style.width = CAPTURE_WIDTH + 'px';
          cloned.style.maxWidth = CAPTURE_WIDTH + 'px';
          cloned.style.margin = '0 auto';
          // Forzar grillas de escritorio en el clon
          const style = doc.createElement('style');
          style.textContent = `
            .pf-pdf-bg-img {
              position: absolute !important;
              inset: 0 !important;
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              z-index: 0 !important;
            }
            .pf-hero__media, .pf-cta__media { background-image: none !important; }
            .pf-stats__grid { grid-template-columns: repeat(4, 1fr) !important; }
            .pf-strengths { grid-template-columns: repeat(4, 1fr) !important; }
            .pf-services { grid-template-columns: repeat(3, 1fr) !important; }
            .pf-divisions { grid-template-columns: repeat(3, 1fr) !important; }
            .pf-process__list { grid-template-columns: repeat(5, 1fr) !important; }
            .pf-projects { grid-template-columns: repeat(2, 1fr) !important; }
            .pf-about__grid { grid-template-columns: 1.1fr 0.9fr !important; }
            .pf-mission__grid { grid-template-columns: 1fr 1fr !important; }
            .pf-project { grid-template-columns: 0.9fr 1.1fr !important; }
            .pf-hero { min-height: 720px !important; }
            .pf-hero__badge, .pf-hero__year, .pf-hero__title,
            .pf-hero__subtitle, .pf-hero__actions {
              opacity: 1 !important;
              animation: none !important;
              transform: none !important;
            }
            .pf-hero__media { animation: none !important; transform: none !important; }
            .no-print, .pf-export-toolbar { display: none !important; }
          `;
          doc.head.appendChild(style);
        },
      });

      setStatus('Componiendo archivo PDF…');

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // JPEG de alta calidad: más liviano que PNG y conserva el look
      const dataUrl = canvas.toDataURL('image/jpeg', 0.93);

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 1) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const filename = 'Patagonia-Electric-Portafolio.pdf';
      pdf.save(filename);
      setStatus('PDF descargado — misma apariencia que la web.');
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
