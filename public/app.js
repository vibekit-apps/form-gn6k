const form = document.getElementById('survey');
const stepSections = form.querySelectorAll('.step-section');
const stepLabels = document.querySelectorAll('.step-labels .step');
const progressBar = document.getElementById('progress-bar');
const reviewEl = document.getElementById('review');
const totalSteps = 4;

let currentStep = 1;

function showStep(n) {
  currentStep = n;
  stepSections.forEach((sec) => {
    sec.hidden = parseInt(sec.dataset.step, 10) !== n;
  });
  stepLabels.forEach((lbl) => {
    const sn = parseInt(lbl.dataset.step, 10);
    lbl.classList.toggle('active', sn === n);
    lbl.classList.toggle('done', sn < n);
  });
  progressBar.style.width = `${(n / totalSteps) * 100}%`;
  const firstField = form.querySelector(`.step-section[data-step="${n}"] input, .step-section[data-step="${n}"] select, .step-section[data-step="${n}"] textarea`);
  if (firstField) setTimeout(() => firstField.focus(), 100);
  if (n === totalSteps) renderReview();
}

function validateStep(n) {
  let ok = true;
  if (n === 1) {
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const role = form.elements.role.value;
    if (!name) { ok = false; markError(form.elements.name, 'Required'); } else clearError(form.elements.name);
    if (!email || !/\S+@\S+\.\S+/.test(email)) { ok = false; markError(form.elements.email, 'Enter a valid email'); } else clearError(form.elements.email);
    if (!role) { ok = false; markError(form.elements.role, 'Choose one'); } else clearError(form.elements.role);
  } else if (n === 2) {
    const teamSize = form.elements.teamSize.value;
    if (!teamSize || parseInt(teamSize, 10) < 1) { ok = false; markError(form.elements.teamSize, 'Enter a number'); } else clearError(form.elements.teamSize);
    const features = Array.from(form.querySelectorAll('input[name="features"]:checked'));
    if (!features.length) { ok = false; markFieldset(form.querySelector('fieldset'), 'Pick at least one'); } else clearFieldset(form.querySelector('fieldset'));
  } else if (n === 3) {
    const rating = form.elements.rating.value;
    if (!rating) { ok = false; document.getElementById('rating').classList.add('error'); } else document.getElementById('rating').classList.remove('error');
  }
  return ok;
}

function markError(el, msg) {
  el.classList.add('error');
  let hint = el.parentElement.querySelector('.field-error');
  if (!hint) { hint = document.createElement('span'); hint.className = 'field-error'; el.parentElement.appendChild(hint); }
  hint.textContent = msg;
}
function clearError(el) {
  el.classList.remove('error');
  const hint = el.parentElement.querySelector('.field-error');
  if (hint) hint.remove();
}
function markFieldset(el, msg) {
  el.classList.add('error');
  let hint = el.querySelector('.field-error');
  if (!hint) { hint = document.createElement('span'); hint.className = 'field-error'; el.appendChild(hint); }
  hint.textContent = msg;
}
function clearFieldset(el) {
  el.classList.remove('error');
  const hint = el.querySelector('.field-error');
  if (hint) hint.remove();
}

form.querySelectorAll('[data-next]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (validateStep(currentStep)) showStep(parseInt(btn.dataset.next, 10));
  });
});
form.querySelectorAll('[data-back]').forEach((btn) => {
  btn.addEventListener('click', () => showStep(parseInt(btn.dataset.back, 10)));
});
stepLabels.forEach((lbl) => {
  lbl.addEventListener('click', () => {
    const target = parseInt(lbl.dataset.step, 10);
    if (target < currentStep) showStep(target);
  });
});

document.querySelectorAll('.star').forEach((star) => {
  star.addEventListener('click', () => {
    const val = parseInt(star.dataset.val, 10);
    form.elements.rating.value = val;
    document.querySelectorAll('.star').forEach((s, idx) => {
      s.classList.toggle('on', idx < val);
    });
  });
});

function collect() {
  const data = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    role: form.elements.role.value,
    teamSize: parseInt(form.elements.teamSize.value, 10),
    features: Array.from(form.querySelectorAll('input[name="features"]:checked')).map((c) => c.value),
    rating: parseInt(form.elements.rating.value, 10),
    notes: form.elements.notes.value.trim(),
  };
  return data;
}

function renderReview() {
  const data = collect();
  reviewEl.innerHTML = `
    <dt>Name</dt><dd>${escape(data.name)}</dd>
    <dt>Email</dt><dd>${escape(data.email)}</dd>
    <dt>Role</dt><dd>${escape(data.role)}</dd>
    <dt>Team size</dt><dd>${data.teamSize}</dd>
    <dt>Features</dt><dd>${data.features.map(escape).join(', ') || '—'}</dd>
    <dt>Rating</dt><dd>${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</dd>
    <dt>Notes</dt><dd>${escape(data.notes) || '—'}</dd>`;
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = document.getElementById('submit-error');
  err.hidden = true;
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collect()),
  });
  if (res.ok) {
    window.location.href = '/results.html';
    return;
  }
  let body = null;
  try { body = await res.json(); } catch (_) {}
  err.hidden = false;
  err.textContent = body && body.error === 'validation_failed'
    ? Object.entries(body.fields).map(([k, v]) => `${k}: ${v}`).join(' • ')
    : 'Something went wrong. Please try again.';
});

showStep(1);
