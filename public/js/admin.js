document.addEventListener('DOMContentLoaded', () => {
  initUploads();
  initRepeaters();
  initParagraphLists();
  initForm();
  initPortfolioToolbar();
  document.querySelectorAll('.admin-repeater').forEach(updateRepeaterCount);
});

function initUploads() {
  document.querySelectorAll('.admin-image-field').forEach((field) => {
    if (field.dataset.uploadBound) return;
    field.dataset.uploadBound = '1';

    const input = field.querySelector('.admin-image-url');
    const fileInput = field.querySelector('.admin-upload-input');
    const previewWrap = field.querySelector('.admin-image-field__preview') || field;

    const setPreview = (url) => {
      let preview = previewWrap.querySelector('img.admin-preview');
      const empty = previewWrap.querySelector('.admin-preview--empty');
      if (empty) empty.remove();
      if (!preview) {
        preview = document.createElement('img');
        preview.className = 'admin-preview';
        preview.alt = 'Vista previa';
        previewWrap.appendChild(preview);
      }
      preview.src = url;
    };

    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const fd = new FormData();
      fd.append('image', file);

      try {
        const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.ok) {
          input.value = data.url;
          setPreview(data.url);
          showAlert('Fotografía actualizada — recuerde Guardar cambios', 'success');
        } else {
          showAlert(data.error || 'Error al subir', 'error');
        }
      } catch {
        showAlert('Error de conexión al subir imagen', 'error');
      }
      fileInput.value = '';
    });

    input?.addEventListener('change', () => {
      if (input.value) setPreview(input.value);
    });
  });
}

function initRepeaters() {
  document.querySelectorAll('.admin-repeater').forEach((repeater) => {
    if (repeater.dataset.bound) return;
    repeater.dataset.bound = '1';

    repeater.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.admin-add');
      const removeBtn = e.target.closest('.admin-remove');

      if (addBtn && repeater.contains(addBtn)) {
        addRepeaterItem(repeater);
      }
      if (removeBtn && repeater.contains(removeBtn)) {
        const item = removeBtn.closest('.admin-repeater__item');
        if (item) removeRepeaterItem(repeater, item);
      }
    });
  });
}

function addRepeaterItem(repeater) {
  const items = repeater.querySelectorAll('.admin-repeater__item');
  const last = items[items.length - 1];
  if (!last) return;

  const clone = last.cloneNode(true);
  clone.querySelectorAll('input, textarea').forEach((el) => {
    if (el.type !== 'file') el.value = '';
  });
  clone.querySelectorAll('.admin-image-field').forEach((el) => {
    delete el.dataset.uploadBound;
    const previewWrap = el.querySelector('.admin-image-field__preview');
    if (previewWrap) {
      previewWrap.innerHTML = '<div class="admin-preview admin-preview--empty">Sin foto — use «Cambiar foto»</div>';
    } else {
      el.querySelectorAll('.admin-preview').forEach((img) => img.remove());
    }
  });

  const addBtn = repeater.querySelector('.admin-add');
  repeater.insertBefore(clone, addBtn);
  reindexRepeater(repeater);
  initUploads();
  updateRepeaterCount(repeater);
}

function removeRepeaterItem(repeater, item) {
  const items = repeater.querySelectorAll('.admin-repeater__item');
  if (items.length <= 1) {
    showAlert('Debe quedar al menos un elemento', 'error');
    return;
  }
  item.remove();
  reindexRepeater(repeater);
  updateRepeaterCount(repeater);
}

function reindexRepeater(repeater) {
  const label = repeater.dataset.itemLabel || 'Elemento';
  repeater.querySelectorAll('.admin-repeater__item').forEach((item, i) => {
    const num = item.querySelector('.admin-item-num');
    if (num) num.textContent = i + 1;
    const heading = item.querySelector('.admin-repeater__item-header h4');
    if (heading && !heading.querySelector('.admin-item-num')) {
      heading.textContent = `${label} ${i + 1}`;
    }
  });
}

function updateRepeaterCount(repeater) {
  const field = repeater.dataset.field;
  const count = repeater.querySelectorAll('.admin-repeater__item').length;
  const badge = document.querySelector(`[data-count-for="${field}"]`);
  if (badge) badge.textContent = count;
}

function initParagraphLists() {
  document.querySelectorAll('.admin-paragraph-list').forEach((list) => {
    if (list.dataset.bound) return;
    list.dataset.bound = '1';

    list.addEventListener('click', (e) => {
      if (e.target.closest('.admin-paragraph-add')) {
        addParagraph(list);
      }
      if (e.target.closest('.admin-paragraph-remove')) {
        const item = e.target.closest('.admin-paragraph-list__item');
        if (item) removeParagraph(list, item);
      }
    });
  });
}

function addParagraph(list) {
  const items = list.querySelectorAll('.admin-paragraph-list__item');
  const last = items[items.length - 1];
  if (!last) return;

  const clone = last.cloneNode(true);
  clone.querySelector('textarea').value = '';
  const addBtn = list.querySelector('.admin-paragraph-add');
  list.insertBefore(clone, addBtn);
  reindexParagraphs(list);
}

function removeParagraph(list, item) {
  const items = list.querySelectorAll('.admin-paragraph-list__item');
  if (items.length <= 1) {
    showAlert('Debe quedar al menos un párrafo', 'error');
    return;
  }
  item.remove();
  reindexParagraphs(list);
}

function reindexParagraphs(list) {
  list.querySelectorAll('.admin-paragraph-list__item').forEach((item, i) => {
    const num = item.querySelector('.admin-item-num');
    if (num) num.textContent = i + 1;
  });
}

function collectForm(form) {
  const data = {};
  const repeaters = new Set([...form.querySelectorAll('.admin-repeater')].map((r) => r.dataset.field));

  form.querySelectorAll('input[name], textarea[name], select[name]').forEach((el) => {
    const name = el.name;
    if (!name || el.closest('.admin-repeater__item')) return;
    if (repeaters.has(name)) return;
    if (el.type === 'file') return;

    if (el.type === 'checkbox') {
      data[name] = el.checked;
      return;
    }

    if (data[name] !== undefined) {
      if (!Array.isArray(data[name])) data[name] = [data[name]];
      data[name].push(el.value);
    } else {
      data[name] = el.value;
    }
  });

  form.querySelectorAll('.admin-repeater').forEach((repeater) => {
    const field = repeater.dataset.field;
    data[field] = [];
    repeater.querySelectorAll('.admin-repeater__item').forEach((item) => {
      const obj = {};
      item.querySelectorAll('input[name], textarea[name]').forEach((el) => {
        if (el.type === 'file') return;
        if (el.type === 'checkbox') {
          obj[el.name] = el.checked;
          return;
        }
        obj[el.name] = el.value;
      });
      if (Object.keys(obj).length) data[field].push(obj);
    });
  });

  ['aboutParagraphs', 'paragraphs', 'privacyParagraphs', 'introParagraphs'].forEach((key) => {
    if (data[key] && !Array.isArray(data[key])) data[key] = [data[key]];
  });

  return data;
}

function initForm() {
  const form = document.getElementById('admin-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const section = form.dataset.section;
    const payload = collectForm(form);
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      const res = await fetch(`/admin/api/content/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) showAlert(data.message || 'Guardado correctamente', 'success');
      else showAlert(data.error || 'Error al guardar', 'error');
    } catch {
      showAlert('Error de conexión', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Guardar cambios';
    }
  });
}

function showAlert(text, type) {
  const el = document.getElementById('admin-alert');
  if (!el) return;
  el.textContent = text;
  el.className = `admin-alert admin-alert--${type}`;
  el.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initPortfolioToolbar() {
  const copyBtn = document.getElementById('admin-copy-portfolio-link');
  if (!copyBtn) return;
  copyBtn.addEventListener('click', async () => {
    const url = new URL(copyBtn.dataset.url || '/portafolio', window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      showAlert('Enlace del portafolio copiado', 'success');
    } catch {
      window.prompt('Copie el enlace:', url);
    }
  });
}
