document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroSlider();
  initMobileMenu();
  initContactForm();
  initScrollAnimations();
  initDropdown();
});

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  const links = document.querySelectorAll('.nav__link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (links.length && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }
}

function initHeroSlider() {
  if (window.__CMS_VISUAL__) return;
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const links = document.querySelectorAll('.nav__link, .nav__submenu a');

  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle?.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function initDropdown() {
  const dropdown = document.querySelector('.nav__dropdown');
  if (!dropdown) return;

  const trigger = dropdown.querySelector('.nav__link--dropdown');
  trigger?.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdown.classList.toggle('open');
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const message = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      nombre: formData.get('nombre')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      telefono: formData.get('telefono')?.toString().trim(),
      asunto: formData.get('asunto')?.toString().trim(),
      mensaje: formData.get('mensaje')?.toString().trim(),
      privacidad: formData.get('privacidad'),
    };

    if (!payload.nombre || !payload.email || !payload.mensaje || !payload.privacidad) {
      showFormMessage(message, 'error', 'Por favor complete todos los campos obligatorios y acepte la política de privacidad.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      showFormMessage(message, 'error', 'Ingrese un correo electrónico válido.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.ok) {
        showFormMessage(message, 'success', data.message);
        form.reset();
      } else {
        showFormMessage(message, 'error', data.error || 'Error al enviar el mensaje.');
      }
    } catch {
      showFormMessage(message, 'error', 'Error de conexión. Intente por WhatsApp o teléfono.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensaje';
    }
  });
}

function showFormMessage(el, type, text) {
  if (!el) return;
  el.className = `form-message ${type}`;
  el.textContent = text;
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.feature-card, .division-card, .project-card, .about__image, .about__content, .service-item, .value-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}
