/* ============================================================
   KHOMAS FREIGHT — Interactions
   ============================================================ */

/* ---------- Mobile Menu ---------- */
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon   = document.getElementById('menuIcon');

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

/* Close mobile menu on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

/* ---------- Scroll Reveal ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ---------- Email Validation ---------- */
const commonTypos = {
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'outlok.com': 'outlook.com'
};

function validateEmail(email) {
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!basic) return { valid: false, message: 'Please enter a valid email address.' };

  const domain = email.split('@')[1].toLowerCase();
  if (commonTypos[domain]) {
    return { valid: false, message: `Did you mean ${commonTypos[domain]}?` };
  }
  return { valid: true };
}

/* ---------- Form Validation ---------- */
const quoteForm   = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const formSummary = document.getElementById('formSummary');
const submitBtn   = document.querySelector('[data-submit-btn]');
const requiredFields = ['name', 'email', 'phone', 'shipmentType', 'route'];

function setButtonState(state) {
  if (!submitBtn) return;
  const label   = submitBtn.querySelector('.btn-label');
  const spinner = submitBtn.querySelector('.btn-spinner');
  const check   = submitBtn.querySelector('.btn-check');

  spinner.classList.add('hidden');
  check.classList.add('hidden');
  label.classList.remove('hidden');

  if (state === 'loading') {
    label.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
  } else if (state === 'success') {
    label.classList.add('hidden');
    check.classList.remove('hidden');
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
}

function validateField(field) {
  const error = document.getElementById(`${field.id}Error`);
  let valid = field.checkValidity();

  if (field.id === 'email' && field.value) {
    const emailCheck = validateEmail(field.value);
    if (!emailCheck.valid) {
      valid = false;
      if (error) error.textContent = emailCheck.message;
    } else if (error) {
      error.textContent = 'Please enter a valid email.';
    }
  }

  field.setAttribute('aria-invalid', String(!valid));
  if (error) error.classList.toggle('hidden', valid);
  return valid;
}

requiredFields.forEach(id => {
  const field = document.getElementById(id);
  if (!field) return;
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});

if (quoteForm) {
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formSuccess.classList.add('hidden');
    formSummary.classList.add('hidden');

    const invalidFields = [];
    requiredFields.forEach(id => {
      const field = document.getElementById(id);
      if (!validateField(field)) invalidFields.push(field);
    });

    if (invalidFields.length > 0) {
      formSummary.innerHTML = `<strong class="block">Please correct ${invalidFields.length} field${invalidFields.length > 1 ? 's' : ''}:</strong> ${invalidFields.map(f => f.previousElementSibling?.textContent.replace('*','').trim()).filter(Boolean).join(', ')}`;
      formSummary.classList.remove('hidden');
      invalidFields[0].focus();
      return;
    }

    setButtonState('loading');

    try {
      const formData = new FormData(quoteForm);
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setButtonState('success');
        formSuccess.classList.remove('hidden');
        setTimeout(() => {
          quoteForm.reset();
          requiredFields.forEach(id => document.getElementById(id).setAttribute('aria-invalid', 'false'));
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setButtonState('idle');
        }, 1400);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      setButtonState('idle');
      formSummary.innerHTML = `<strong class="block">Something went wrong.</strong> Please try again or email us directly at info@khomasfreight.com.`;
      formSummary.classList.remove('hidden');
      formSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* ---------- Footer Year ---------- */
const yearElement = document.getElementById('currentYear');
if (yearElement) yearElement.textContent = new Date().getFullYear();

/* ---------- Live Corridor "Updated" Timer ---------- */
const corridorTime = document.getElementById('corridorTime');
if (corridorTime) {
  let seconds = 0;
  setInterval(() => {
    seconds += 1;
    if (seconds < 60) corridorTime.textContent = `${seconds}s ago`;
    else if (seconds < 3600) corridorTime.textContent = `${Math.floor(seconds/60)}m ago`;
    else corridorTime.textContent = 'just now';
    if (seconds > 3600) seconds = 0;
  }, 1000);
}

/* ---------- Tracking Widget ---------- */
const trackingForm     = document.getElementById('trackingForm');
const trackingInput    = document.getElementById('trackingInput');
const trackingResult   = document.getElementById('trackingResult');
const trackingSkeleton = document.getElementById('trackingSkeleton');
const trackBtn         = document.querySelector('[data-track-btn]');

const TRACKING_STAGES = ['Booked', 'Picked up', 'In transit', 'Customs', 'Delivered'];

/* Deterministic pseudo-status from reference string */
function fakeStatusFromRef(ref) {
  let hash = 0;
  for (let i = 0; i < ref.length; i++) hash = (hash * 31 + ref.charCodeAt(i)) >>> 0;
  const stage = hash % TRACKING_STAGES.length;
  return { stage, hash };
}

function renderTrackingResult(ref) {
  const { stage, hash } = fakeStatusFromRef(ref);
  const isDelivered = stage === TRACKING_STAGES.length - 1;

  const statusColor = isDelivered
    ? 'bg-emerald-500/10 text-emerald-400'
    : stage >= 2
      ? 'bg-amber-500/10 text-amber-400'
      : 'bg-blue-500/10 text-blue-400';

  const origin      = hash % 2 === 0 ? 'Johannesburg Hub, ZA' : 'Walvis Bay Port, NA';
  const destination = hash % 3 === 0 ? 'Windhoek Depot, NA'   : 'Lusaka, ZM';
  const etaDays     = (hash % 4) + 1;
  const eta         = isDelivered ? 'Delivered' : `${etaDays} day${etaDays>1?'s':''} remaining`;

  const stepsHtml = TRACKING_STAGES.map((label, i) => {
    const cls = i < stage ? 'done' : i === stage ? 'current' : '';
    return `<div class="tracking-step ${cls}"><span>${label}</span></div>`;
  }).join('');

  trackingResult.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
      <div class="text-xs">
        <span class="text-slate-500 uppercase tracking-wider">Ref</span>
        <span class="ml-2 font-mono text-ember">${ref.toUpperCase()}</span>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor}">
        <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
        ${TRACKING_STAGES[stage]}
      </span>
    </div>

    <div class="tracking-steps">${stepsHtml}</div>

    <div class="mt-6 grid gap-4 border-t border-white/10 pt-4 text-xs sm:grid-cols-3">
      <div><span class="block uppercase text-slate-500">Origin</span> <span class="text-white font-medium">${origin}</span></div>
      <div><span class="block uppercase text-slate-500">Destination</span> <span class="text-white font-medium">${destination}</span></div>
      <div><span class="block uppercase text-slate-500">Estimated</span> <span class="text-white font-medium">${eta}</span></div>
    </div>
  `;
}

function showTrackingError(message) {
  trackingResult.innerHTML = `
    <div class="flex items-start gap-3">
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div>
        <strong class="block text-white">${message}</strong>
        <span class="text-slate-400">Check the reference on your waybill, or contact our ops desk at <a class="text-ember hover:underline" href="mailto:info@khomasfreight.com">info@khomasfreight.com</a>.</span>
      </div>
    </div>
  `;
  trackingResult.classList.remove('hidden');
}

if (trackingForm && trackingInput && trackingResult && trackingSkeleton) {
  trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ref = trackingInput.value.trim();

    if (!ref) {
      trackingResult.classList.add('hidden');
      trackingSkeleton.classList.add('hidden');
      return;
    }

    // Simulate lookup
    trackingResult.classList.add('hidden');
    trackingSkeleton.classList.remove('hidden');
    if (trackBtn) trackBtn.disabled = true;

    setTimeout(() => {
      trackingSkeleton.classList.add('hidden');
      if (trackBtn) trackBtn.disabled = false;

      // Strict format check
      if (!/^KFS-\d{4}-\d{3,5}$/i.test(ref)) {
        showTrackingError(`No consignment found for "${ref}"`);
        return;
      }

      renderTrackingResult(ref);
      trackingResult.classList.remove('hidden');
      trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 900);
  });

  // Prefill demo hint on focus
  trackingInput.addEventListener('focus', () => {
    if (!trackingInput.value) trackingInput.placeholder = 'Try KFS-2026-9842';
  });
  trackingInput.addEventListener('blur', () => {
    if (!trackingInput.value) trackingInput.placeholder = 'e.g. KFS-2026-9842';
  });
}