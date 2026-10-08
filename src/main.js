const intro = document.querySelector('.intro');
const hero = document.querySelector('.hero');
const skip = document.querySelector('.skip-intro');
const replay = document.querySelector('.replay');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sessionKey = 'nurolanda-intro-seen';
let finishTimer;

function finishIntro() {
  clearTimeout(finishTimer);
  document.documentElement.classList.remove('is-intro');
  hero.inert = false;
  intro.setAttribute('aria-hidden', 'true');
  skip.tabIndex = -1;
  try { sessionStorage.setItem(sessionKey, 'yes'); } catch { /* Storage can be blocked in private browsing. */ }
}

function playIntro() {
  finishIntro();
  if (reducedMotion.matches) return;
  // Restart the same CSS timeline for the review control.
  void intro.offsetWidth;
  document.documentElement.classList.add('is-intro');
  hero.inert = true;
  intro.setAttribute('aria-hidden', 'false');
  skip.tabIndex = 0;
  finishTimer = window.setTimeout(finishIntro, 3900);
}

let seen = false;
try { seen = sessionStorage.getItem(sessionKey) === 'yes'; } catch { /* Intro still works without storage. */ }
if (!seen) playIntro();

skip.addEventListener('click', () => { finishIntro(); replay.focus(); });
replay.addEventListener('click', () => { playIntro(); if (!reducedMotion.matches) skip.focus({ preventScroll: true }); });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishIntro(); });
intro.addEventListener('animationend', (event) => {
  if (event.animationName === 'curtain-up') {
    hero.inert = false;
    skip.tabIndex = -1;
    intro.setAttribute('aria-hidden', 'true');
    if (document.activeElement === skip) replay.focus({ preventScroll: true });
  }
});

document.querySelectorAll('[data-preview]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.preview-note').textContent = button.dataset.preview === 'menu'
      ? 'Katalog menu menyusul. Ini pratinjau hero.'
      : 'Nomor WhatsApp resmi belum ditambahkan.';
  });
});
