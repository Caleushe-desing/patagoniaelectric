(function () {
  if (!window.__CMS_VISUAL__) return;

  let activeImageEl = null;
  let activeHeroIndex = 0;

  const status = document.getElementById('cms-status');
  const toast = document.getElementById('cms-toast');
  const modal = document.getElementById('cms-modal');
  const modalTitle = document.getElementById('cms-modal-title');
  const modalPreview = document.getElementById('cms-modal-preview');
  const modalUrl = document.getElementById('cms-modal-url');
  const modalFile = document.getElementById('cms-modal-file');
  const pageSelect = document.getElementById('cms-page-select');

  const SECTION_NAMES = {
    general: 'Datos generales',
    home: 'Página de inicio',
    nosotros: 'Nosotros',
    industrial: 'División Industrial',
    ecologica: 'División Ecológica',
    habitacional: 'División Habitacional',
    proyectos: 'Proyectos',
    clientes: 'Clientes',
    portafolio: 'Portafolio comercial',
    contacto: 'Contacto',
  };

  const FIELD_NAMES = {
    image: 'Imagen',
    logo: 'Logo',
    logoHeader: 'Logo del menú (cabecera)',
    logoFooter: 'Logo del pie de página',
    logoHero: 'Logo principal del inicio',
    heroImage: 'Imagen del banner',
    aboutImage: 'Imagen del equipo',
    clientsBg: 'Fondo de clientes',
    coverImage: 'Fotografía de portada',
    introImage: 'Fotografía Quiénes somos',
    closingImage: 'Fotografía de cierre',
  };

  const ADD_LABELS = {
    heroSlides: '+ Agregar foto al slider',
    divisions: '+ Agregar división',
    projectsPreview: '+ Agregar proyecto destacado',
    solutions: '+ Agregar servicio',
    items: '+ Agregar elemento',
    features: '+ Agregar ventaja',
    values: '+ Agregar valor',
    aboutParagraphs: '+ Agregar párrafo',
    paragraphs: '+ Agregar párrafo',
    privacyParagraphs: '+ Agregar párrafo',
    strengths: '+ Agregar fortaleza',
    services: '+ Agregar servicio',
    processSteps: '+ Agregar paso',
    projects: '+ Agregar proyecto',
    clients: '+ Agregar cliente',
    introParagraphs: '+ Agregar párrafo',
  };

  document.body.classList.add('cms-edit-mode');

  pageSelect?.addEventListener('change', () => {
    window.location.href = `/admin/visual/${pageSelect.value}`;
  });

  document.getElementById('cms-exit')?.addEventListener('click', () => {
    window.location.href = '/admin';
  });

  document.getElementById('cms-modal-close')?.addEventListener('click', closeModal);
  document.getElementById('cms-modal-cancel')?.addEventListener('click', closeModal);
  document.getElementById('cms-modal-backdrop')?.addEventListener('click', closeModal);
  document.getElementById('cms-modal-save')?.addEventListener('click', saveImage);
  modalFile?.addEventListener('change', () => uploadFile(modalFile.files?.[0]));

  modalUrl?.addEventListener('input', () => {
    if (modalUrl.value) {
      modalPreview.src = modalUrl.value;
      modalPreview.style.display = 'block';
    }
  });

  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.cms-item-remove');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      removeItem(removeBtn);
      return;
    }

    const addBtn = e.target.closest('.cms-list-add');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      addItem(addBtn);
      return;
    }

    if (e.target.closest('.cms-img-edit-btn, .cms-hero-bar, #cms-modal, #cms-toolbar, .cms-list-controls, #cms-image-panel')) return;

    const cmsEl = e.target.closest('[data-cms-section]:not([data-cms-list]):not([data-cms-type="image"]):not([data-cms-type="bg-image"])');
    if (!cmsEl) return;

    e.preventDefault();
    startTextEdit(cmsEl);
  });

  initImageButtons();
  initHeroBar();
  initPageHeroBars();
  initLists();
  initImagePanel();

  if (window.__CMS_VISUAL__.scrollTo) {
    requestAnimationFrame(() => {
      const target = document.getElementById(window.__CMS_VISUAL__.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setStatus('Sección Clientes — edite logos y fondo aquí');
      }
    });
  }

  function getMeta(el) {
    return {
      section: el.dataset.cmsSection,
      field: el.dataset.cmsField,
      arrayField: el.dataset.cmsArray || null,
      index: el.dataset.cmsIndex != null ? Number(el.dataset.cmsIndex) : null,
    };
  }

  function getAddLabel(section, arrayField) {
    if (section === 'clientes' && arrayField === 'items') return '+ Agregar logo de cliente';
    if (section === 'proyectos' && arrayField === 'items') return '+ Agregar proyecto';
    if (arrayField === 'features') return '+ Agregar ventaja';
    if (arrayField === 'values') return '+ Agregar valor';
    return ADD_LABELS[arrayField] || '+ Agregar elemento';
  }

  function getImageUrl(el) {
    if (el.dataset.cmsType === 'bg-image') {
      const match = el.style.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
      return match ? match[1] : '';
    }
    let url = el.getAttribute('src') || '';
    if (url.startsWith(window.location.origin)) url = url.replace(window.location.origin, '');
    return url;
  }

  function getImageLabel(el) {
    const { section, field, arrayField, index } = getMeta(el);
    const page = SECTION_NAMES[section] || section;

    if (section === 'home' && arrayField === 'heroSlides') {
      return `Slider del inicio — Foto ${index + 1}`;
    }
    if (arrayField === 'divisions') return `${page} — División ${index + 1} (imagen)`;
    if (arrayField === 'projectsPreview') return `${page} — Proyecto destacado ${index + 1}`;
    if (arrayField === 'solutions') return `${page} — Servicio ${index + 1} (imagen)`;
    if (arrayField === 'features') return `${page} — Ventaja ${index + 1} (imagen)`;
    if (arrayField === 'values') return `${page} — Valor ${index + 1} (imagen)`;
    if (arrayField === 'items' && section === 'proyectos') return `${page} — Proyecto ${index + 1}`;
    if (arrayField === 'items' && section === 'clientes') return `Cliente ${index + 1} — Logo`;
    if (section === 'portafolio' && arrayField === 'strengths') return `Portafolio — Fortaleza ${index + 1} (foto)`;
    if (section === 'portafolio' && arrayField === 'projects') return `Portafolio — Proyecto ${index + 1} (foto)`;
    if (section === 'portafolio' && arrayField === 'divisions') return `Portafolio — División ${index + 1} (foto)`;

    const fieldLabel = FIELD_NAMES[field] || 'Imagen';
    return `${page} — ${fieldLabel}`;
  }

  function getImageButtonHost(el) {
    if (el.closest('.hero__slides')) return null;
    if (el.dataset.cmsType === 'bg-image' && el.closest('.page-hero')) return null;

    // Portafolio comercial: hosts con posición relativa para no romper layouts absolute
    if (el.closest('.pf-hero__media')) return el.closest('.pf-hero');
    if (el.closest('.pf-cta__media')) return el.closest('.pf-cta');
    if (el.closest('.pf-division')) return el.closest('.pf-division');
    if (el.closest('.pf-strength__media')) return el.closest('.pf-strength__media');
    if (el.closest('.pf-project__image')) return el.closest('.pf-project__image');
    if (el.closest('.pf-about__visual')) return el.closest('.pf-about__visual');
    if (el.closest('.pf-client')) return el.closest('.pf-client');
    if (el.closest('.clients-logos__item')) return el.closest('.clients-logos__item');
    if (el.closest('.dossier-client')) return el.closest('.dossier-client');

    if (el.dataset.cmsType === 'bg-image') {
      return el.closest('.page-hero, .clients-banner') || el;
    }
    if (el.closest('.clients-banner__bg')) {
      return el.closest('.clients-banner');
    }
    if (el.closest('.header .logo')) {
      return el.closest('.header .logo');
    }
    return el;
  }

  function initImageButtons() {
    document.querySelectorAll('[data-cms-type="image"], [data-cms-type="bg-image"]').forEach((el) => {
      if (el.dataset.cmsBtnInit) return;
      const host = getImageButtonHost(el);
      if (!host) return;

      const btnId = [
        el.dataset.cmsSection,
        el.dataset.cmsField,
        el.dataset.cmsArray || '',
        el.dataset.cmsIndex ?? '',
      ].join('-');
      if (host.querySelector(`[data-cms-btn-for="${btnId}"]`)) return;

      el.dataset.cmsBtnInit = '1';
      host.classList.add('cms-img-host');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.cmsBtnFor = btnId;
      btn.className = 'cms-img-edit-btn' + (host !== el ? ' cms-img-edit-btn--corner' : '');
      if (el.classList.contains('hero__logo') || el.closest('.header .logo') || el.closest('.clients-logos__item') || el.closest('.pf-client')) {
        btn.classList.add('cms-img-edit-btn--compact');
      }
      btn.textContent = '📷 Cambiar imagen';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(el);
      });
      host.appendChild(btn);
    });
  }

  function initHeroBar() {
    const slides = document.querySelectorAll('.hero__slide');
    if (!slides.length) return;

    const hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.cms-hero-bar')) return;

    const bar = document.createElement('div');
    bar.className = 'cms-hero-bar';

    const label = document.createElement('span');
    label.className = 'cms-hero-bar__label';
    label.textContent = 'Imágenes del slider:';

    const tabs = document.createElement('div');
    tabs.className = 'cms-hero-bar__tabs';

    slides.forEach((slide, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'cms-hero-bar__tab' + (slide.classList.contains('active') ? ' is-active' : '');
      tab.textContent = `Foto ${i + 1}`;
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectHeroSlide(i);
      });
      tabs.appendChild(tab);
    });

    const changeBtn = document.createElement('button');
    changeBtn.type = 'button';
    changeBtn.className = 'cms-hero-bar__change cms-img-edit-btn';
    changeBtn.textContent = '📷 Cambiar foto seleccionada';
    changeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const img = getHeroImg(activeHeroIndex);
      if (img) openModal(img);
      else showToast('Seleccione una foto del slider', true);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'cms-hero-bar__add cms-list-add';
    addBtn.dataset.section = 'home';
    addBtn.dataset.array = 'heroSlides';
    addBtn.textContent = '+ Agregar foto';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'cms-hero-bar__remove cms-item-remove';
    removeBtn.dataset.section = 'home';
    removeBtn.dataset.array = 'heroSlides';
    removeBtn.textContent = 'Eliminar foto';
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeBtn.dataset.index = String(activeHeroIndex);
      removeItem(removeBtn);
    });

    bar.append(label, tabs, changeBtn, addBtn, removeBtn);
    hero.appendChild(bar);
  }

  function initImagePanel() {
    const panel = document.getElementById('cms-image-panel');
    const list = document.getElementById('cms-image-list');
    const toggle = document.getElementById('cms-images-toggle');
    const countEl = document.getElementById('cms-images-count');
    if (!panel || !list || !toggle) return;

    function renderImagePanel() {
      const items = [...document.querySelectorAll('[data-cms-type="image"], [data-cms-type="bg-image"]')];
      if (countEl) countEl.textContent = String(items.length);
      list.innerHTML = '';

      if (!items.length) {
        const empty = document.createElement('li');
        empty.className = 'cms-image-panel__empty';
        empty.textContent = 'No hay imágenes en esta página.';
        list.appendChild(empty);
        return;
      }

      items.forEach((el) => {
        const url = getImageUrl(el);
        const li = document.createElement('li');
        li.className = 'cms-image-panel__item';

        const thumb = document.createElement('img');
        thumb.className = 'cms-image-panel__thumb';
        thumb.src = url || '/images/logo-color.png';
        thumb.alt = '';

        const info = document.createElement('div');
        info.className = 'cms-image-panel__info';

        const label = document.createElement('strong');
        label.textContent = getImageLabel(el);

        const changeBtn = document.createElement('button');
        changeBtn.type = 'button';
        changeBtn.className = 'cms-image-panel__btn';
        changeBtn.textContent = 'Cambiar imagen';
        changeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          openModal(el);
        });

        info.append(label, changeBtn);
        li.append(thumb, info);
        list.appendChild(li);
      });
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        renderImagePanel();
        setStatus('Seleccione una imagen de la lista para cambiarla');
      }
    });

    document.getElementById('cms-image-panel-close')?.addEventListener('click', () => {
      panel.hidden = true;
    });

    window.cmsRefreshImagePanel = renderImagePanel;
    renderImagePanel();
  }

  function initPageHeroBars() {
    document.querySelectorAll('.page-hero').forEach((hero) => {
      if (hero.querySelector('.cms-page-hero-bar')) return;
      const bg = hero.querySelector('[data-cms-type="bg-image"]');
      if (!bg) return;

      const section = bg.dataset.cmsSection;
      const page = SECTION_NAMES[section] || section;

      const bar = document.createElement('div');
      bar.className = 'cms-hero-bar cms-page-hero-bar';

      const label = document.createElement('span');
      label.className = 'cms-hero-bar__label';
      label.textContent = `${page} — banner:`;

      const changeBtn = document.createElement('button');
      changeBtn.type = 'button';
      changeBtn.className = 'cms-hero-bar__change cms-img-edit-btn';
      changeBtn.textContent = '📷 Cambiar imagen del banner';
      changeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(bg);
      });

      bar.append(label, changeBtn);
      hero.appendChild(bar);
    });
  }

  function getHeroImg(index) {
    return document.querySelector(`.hero__slide[data-cms-item="${index}"] img[data-cms-type="image"]`);
  }

  function selectHeroSlide(index) {
    activeHeroIndex = index;
    document.querySelectorAll('.hero__slide').forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.cms-hero-bar__tab').forEach((t, i) => {
      t.classList.toggle('is-active', i === index);
    });
    setStatus(`Foto ${index + 1} del slider — pulse «Cambiar foto seleccionada» o «Eliminar foto»`);
  }

  function openModal(el) {
    activeImageEl = el;
    const url = getImageUrl(el);

    modalTitle.textContent = getImageLabel(el);
    modalUrl.value = url;
    modalPreview.src = url || '';
    modalPreview.style.display = url ? 'block' : 'none';
    modal.hidden = false;
    document.body.classList.add('cms-modal-open');
    setStatus('Suba o seleccione una imagen y pulse Guardar');
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('cms-modal-open');
    activeImageEl = null;
    modalFile.value = '';
    setStatus('Pulse «Imágenes» para ver todas las fotos de esta página');
  }

  async function uploadFile(file) {
    if (!file) {
      showToast('Seleccione un archivo de imagen', true);
      return;
    }
    const name = String(file.name || '').toLowerCase();
    const type = String(file.type || '').toLowerCase();
    const okExt = /\.(jpe?g|png|svg)$/.test(name);
    const okMime =
      !type ||
      type === 'application/octet-stream' ||
      /^image\/(jpeg|jpg|pjpeg|png|x-png|svg\+xml|svg)$/.test(type);
    if (!okExt || !okMime) {
      showToast('Formato no permitido. Use JPG, PNG o SVG.', true);
      return;
    }
    const fd = new FormData();
    fd.append('image', file);
    setStatus('Subiendo imagen...');
    try {
      const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok) {
        modalUrl.value = data.url;
        modalPreview.src = data.url;
        modalPreview.style.display = 'block';
        modalPreview.classList.toggle('cms-modal__preview--svg', /\.svg($|\?)/i.test(data.url));
        showToast('Imagen subida — pulse Guardar imagen');
      } else {
        showToast(data.error || 'Error al subir', true);
      }
    } catch {
      showToast('Error de conexión', true);
    }
    modalFile.value = '';
    setStatus('Pulse Guardar imagen para aplicar el cambio');
  }

  async function saveImage() {
    if (!activeImageEl) return;
    let url = modalUrl.value.trim();
    if (!url) return showToast('Suba una imagen o ingrese una URL', true);
    if (url.startsWith(window.location.origin)) url = url.replace(window.location.origin, '');

    const meta = getMeta(activeImageEl);
    const type = activeImageEl.dataset.cmsType;

    if (type === 'bg-image') {
      activeImageEl.style.backgroundImage = `url('${url}')`;
    } else {
      activeImageEl.src = url;
    }

    setStatus('Guardando...');
    const ok = await patch(meta, url);
    if (ok) {
      showToast('Imagen guardada correctamente');
      window.cmsRefreshImagePanel?.();
      closeModal();
    }
    setStatus('Pulse «Imágenes» para ver todas las fotos de esta página');
  }

  async function patch(meta, value) {
    try {
      const res = await fetch('/admin/api/visual/patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: meta.section,
          field: meta.field,
          arrayField: meta.arrayField,
          index: meta.index,
          value,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        showToast(data.error || 'Error al guardar', true);
        return false;
      }
      return true;
    } catch {
      showToast('Error de conexión', true);
      return false;
    }
  }

  function initLists() {
    const IMAGE_ARRAY_FIELDS = new Set(['divisions', 'projectsPreview', 'solutions', 'items', 'features', 'values', 'clients']);

    document.querySelectorAll('[data-cms-list]').forEach((list) => {
      const section = list.dataset.cmsSection;
      const arrayField = list.dataset.cmsArray;
      if (list.classList.contains('hero__slides')) return;
      if (!IMAGE_ARRAY_FIELDS.has(arrayField)) return;

      list.querySelectorAll('[data-cms-item]').forEach((item, index) => {
        item.dataset.cmsItem = index;
        if (item.querySelector('.cms-item-remove')) return;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'cms-item-remove';
        removeBtn.textContent = '× Eliminar';
        removeBtn.dataset.section = section;
        removeBtn.dataset.array = arrayField;
        removeBtn.dataset.index = String(index);
        item.appendChild(removeBtn);
      });

      const controlsId = `cms-controls-${section}-${arrayField}`;
      if (document.getElementById(controlsId)) return;

      const controls = document.createElement('div');
      controls.id = controlsId;
      controls.className = 'cms-list-controls';
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'cms-list-add';
      addBtn.textContent = getAddLabel(section, arrayField);
      addBtn.dataset.section = section;
      addBtn.dataset.array = arrayField;
      controls.appendChild(addBtn);
      list.parentElement?.appendChild(controls) || list.appendChild(controls);
    });
  }

  async function addItem(btn) {
    try {
      const res = await fetch('/admin/api/visual/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: btn.dataset.section, arrayField: btn.dataset.array }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast('Agregado — recargando');
        setTimeout(() => window.location.reload(), 600);
      } else showToast(data.error || 'Error', true);
    } catch {
      showToast('Error de conexión', true);
    }
  }

  async function removeItem(btn) {
    if (!confirm('¿Eliminar este elemento?')) return;
    try {
      const res = await fetch('/admin/api/visual/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: btn.dataset.section,
          arrayField: btn.dataset.array,
          index: Number(btn.dataset.index),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast('Eliminado');
        setTimeout(() => window.location.reload(), 600);
      } else showToast(data.error || 'Error', true);
    } catch {
      showToast('Error de conexión', true);
    }
  }

  function startTextEdit(el) {
    if (el.getAttribute('contenteditable') === 'true') return;
    el.setAttribute('contenteditable', 'true');
    el.classList.add('cms-editing');
    el.focus();
    const onBlur = async () => {
      el.removeEventListener('blur', onBlur);
      el.removeAttribute('contenteditable');
      el.classList.remove('cms-editing');
      await patch(getMeta(el), el.innerText.trim());
      showToast('Texto actualizado');
    };
    el.addEventListener('blur', onBlur);
  }

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  function showToast(msg, isError) {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'cms-toast' + (isError ? ' cms-toast--error' : '');
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.hidden = true; }, 3000);
  }
})();
