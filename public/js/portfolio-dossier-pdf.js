/**
 * Exporta el dossier A4 del portafolio: una página HTML = una página PDF.
 * Independiente de la vista web.
 */
(function () {
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
    document.querySelectorAll('[data-dossier-status]').forEach((node) => {
      node.textContent = msg || '';
    });
  }

  function setBusy(on) {
    busy = on;
    document.querySelectorAll('[data-dossier-download]').forEach((btn) => {
      btn.disabled = on;
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

  async function capturePage(pageEl) {
    return window.html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      onclone: (doc, el) => {
        el.style.width = '794px';
        el.style.minHeight = '1123px';
        el.style.margin = '0';
        el.style.boxShadow = 'none';
        const style = doc.createElement('style');
        style.textContent = `
          .no-print, .dossier-toolbar { display: none !important; }
          .dossier-page {
            width: 794px !important;
            min-height: 1123px !important;
            padding: 76px !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .dossier-page--ribbon {
            padding-bottom: 118px !important;
          }
        `;
        doc.head.appendChild(style);
      },
    });
  }

  async function exportDossierPdf() {
    if (busy) return;
    const pages = [...document.querySelectorAll('[data-dossier-page]')];
    if (!pages.length) {
      setStatus('No se encontraron páginas del dossier.');
      return;
    }

    setBusy(true);
    setStatus('Generando PDF corporativo A4…');

    try {
      await ensureLibs();
      await waitForFonts();
      await waitForImages(document.getElementById('dossier-doc') || document.body);

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i += 1) {
        setStatus(`Página ${i + 1} de ${pages.length}…`);
        if (i > 0) pdf.addPage();
        const canvas = await capturePage(pages[i]);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
        // Encajar la página completa en A4 sin recortes
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      pdf.save('Patagonia-Electric-Portafolio-Corporativo.pdf');
      setStatus('PDF corporativo descargado.');
    } catch (err) {
      console.error(err);
      setStatus('Error al generar PDF. Use Imprimir → Guardar como PDF.');
    } finally {
      setBusy(false);
    }
  }

  function bind() {
    document.querySelectorAll('[data-dossier-download]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        exportDossierPdf();
      });
    });
  }

  window.PatagoniaDossierPdf = { export: exportDossierPdf };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  if (document.body.classList.contains('dossier--auto')) {
    const start = () => setTimeout(() => exportDossierPdf(), 500);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
  }
})();
