// --- Navigation & Mobile Menu ---
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');

function closeMenu() {
  mobileMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  menuIcon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
}

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menuIcon.innerHTML = isOpen
      ? '<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
      : '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
  });
}

document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeMenu(); });

// --- Scroll Animation Observer ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(element => observer.observe(element));

// --- Quote Form Validation & Formspree Integration ---
const quoteForm = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const requiredFields = ['name', 'email', 'phone', 'shipmentType', 'route'];

function validateField(field) {
  const error = document.getElementById(`${field.id}Error`);
  let valid = field.checkValidity();
  if (field.id === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) valid = false;
  field.setAttribute('aria-invalid', String(!valid));
  if (error) error.classList.toggle('hidden', valid);
  return valid;
}

requiredFields.forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  }
});

if (quoteForm) {
  quoteForm.addEventListener('submit', async event => {
    event.preventDefault();
    formSuccess.classList.add('hidden');
    
    const valid = requiredFields.map(id => validateField(document.getElementById(id))).every(Boolean);
    if (!valid) {
      const firstInvalid = requiredFields.map(id => document.getElementById(id)).find(field => !field.checkValidity());
      firstInvalid?.focus();
      return;
    }

    // If using Formspree, submit via fetch asynchronously
    try {
      const formData = new FormData(quoteForm);
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok || !quoteForm.action) {
        formSuccess.classList.remove('hidden');
        quoteForm.reset();
        requiredFields.forEach(id => document.getElementById(id).setAttribute('aria-invalid', 'false'));
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        alert("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      // Fallback behavior if offline or testing locally without a live Formspree endpoint yet
      formSuccess.classList.remove('hidden');
      quoteForm.reset();
      requiredFields.forEach(id => document.getElementById(id).setAttribute('aria-invalid', 'false'));
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// --- Dynamic Footer Year ---
const yearElement = document.getElementById('currentYear');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// --- Shipment Tracking Simulator ---
const trackingForm = document.getElementById('trackingForm');
const trackingInput = document.getElementById('trackingInput');
const trackingResult = document.getElementById('trackingResult');

if (trackingForm && trackingInput && trackingResult) {
  trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ref = trackingInput.value.trim();
    if (!ref) return;

    document.getElementById('resRef').textContent = ref.toUpperCase();
    document.getElementById('resOrigin').textContent = 'Johannesburg Hub, SA';
    document.getElementById('resDest').textContent = 'Windhoek Depot, NA';
    document.getElementById('resEta').textContent = 'In Transit - Cleared Border';
    
    trackingResult.classList.remove('hidden');
    trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}