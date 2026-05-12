window.toggleMenu = function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('open');
};

window.sendForm = function sendForm() {
  const fn = document.getElementById('fn')?.value.trim() ?? '';
  const em = document.getElementById('em')?.value.trim() ?? '';
  const msg = document.getElementById('msg')?.value.trim() ?? '';
  const fb = document.getElementById('fmsg');
  if (!fb) return;
  if (!fn || !em || !msg) {
    fb.style.cssText = 'display:block;background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;border-radius:7px;padding:11px 15px;font-size:.84rem;';
    fb.textContent = '⚠ Veuillez remplir tous les champs obligatoires.';
    return;
  }
  fb.style.cssText = 'display:block;background:#f0fdf4;border:1px solid #86efac;color:#16a34a;border-radius:7px;padding:11px 15px;font-size:.84rem;';
  fb.textContent = '✓ Merci ! Votre message a bien été envoyé. Réponse sous 24h.';
  ['fn','ln','em','co','sec','msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  setTimeout(() => { if (fb) fb.style.display = 'none'; }, 6000);
};

function updateNavbarOnScroll() {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}

function initNavLinks() {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    });
  });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  revealItems.forEach(el => observer.observe(el));
}

function runCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || target <= 0) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 35);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbarOnScroll();
  initNavLinks();
  initRevealAnimations();
  runCounters();
});
window.addEventListener('scroll', updateNavbarOnScroll);
