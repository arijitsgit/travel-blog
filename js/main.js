// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Sticky nav shadow + mobile menu
const nav = document.getElementById('siteNav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  if (backToTopBtn) backToTopBtn.classList.toggle('show', window.scrollY > 300);
});

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? 'CLOSE' : 'MENU';
  });
}

// Back to top
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Love button
function toggleLove(tripId) {
  const btn    = document.getElementById('loveBtn');
  const count  = document.getElementById('loveCount');
  if (!btn) return;

  const key      = 'love_' + tripId;
  const countKey = 'love_count_' + tripId;
  const loved    = localStorage.getItem(key) === '1';
  let   n        = parseInt(localStorage.getItem(countKey) || '0', 10);

  if (loved) {
    n = Math.max(0, n - 1);
    localStorage.setItem(key, '0');
    btn.classList.remove('loved');
    btn.querySelector('.love-label').textContent = 'Show some love';
  } else {
    n++;
    localStorage.setItem(key, '1');
    btn.classList.add('loved', 'pop');
    btn.querySelector('.love-label').textContent = 'You loved this!';
    setTimeout(() => btn.classList.remove('pop'), 450);
  }

  localStorage.setItem(countKey, n);
  count.textContent = n;
}

// Restore love state on load
document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.getElementById('loveBtn');
  const count = document.getElementById('loveCount');
  if (!btn) return;

  const tripId   = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  const key      = 'love_' + tripId;
  const countKey = 'love_count_' + tripId;
  const n        = parseInt(localStorage.getItem(countKey) || '0', 10);

  count.textContent = n;
  if (localStorage.getItem(key) === '1') {
    btn.classList.add('loved');
    btn.querySelector('.love-label').textContent = 'You loved this!';
  }
});

// Subscribe form
const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    subscribeForm.style.display = 'none';
    const thanks = document.getElementById('subscribeThanks');
    if (thanks) thanks.style.display = 'block';
  });
}

// Lightbox
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<div class="lightbox-inner"><img class="lightbox-img" alt="" /><button class="lightbox-close" aria-label="Close">✕ CLOSE</button></div>';
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('.lightbox-img');
  const lbClose = overlay.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.g-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  // Pin label toggle on click (for touch devices)
  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('label-visible');
    });
  });

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  lbClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
});
