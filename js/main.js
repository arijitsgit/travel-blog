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

// Expedition filter + pagination
(function () {
  const PER_PAGE = 9;
  let currentFilter = 'all';
  let currentPage   = 1;
  let currentSearch = '';

  const grid       = document.getElementById('expeditionGrid');
  const searchInput= document.getElementById('filterSearch');
  const tabButtons = document.querySelectorAll('.filter-tab');
  const prevBtn    = document.getElementById('prevPage');
  const nextBtn    = document.getElementById('nextPage');
  const pageInfo   = document.getElementById('pageInfo');
  const noResults  = document.getElementById('noResults');
  const paginationBar = document.getElementById('paginationBar');

  if (!grid) return;

  const allCards = Array.from(grid.querySelectorAll(':scope > [data-region]'));

  function getFiltered() {
    const q = currentSearch.toLowerCase();
    return allCards.filter(card => {
      const regionMatch = currentFilter === 'all' || card.dataset.region === currentFilter;
      const searchMatch = !q || card.dataset.title.toLowerCase().includes(q);
      return regionMatch && searchMatch;
    });
  }

  function render() {
    const filtered   = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    currentPage      = Math.min(currentPage, totalPages);
    const start      = (currentPage - 1) * PER_PAGE;
    const visible    = new Set(filtered.slice(start, start + PER_PAGE));

    allCards.forEach(card => {
      card.style.display = visible.has(card) ? '' : 'none';
      card.classList.add('visible');
    });

    const show = filtered.length > 0;
    noResults.style.display      = show ? 'none' : 'block';
    paginationBar.style.display  = filtered.length > PER_PAGE ? 'flex' : 'none';
    pageInfo.textContent         = `${currentPage} / ${totalPages}`;
    prevBtn.disabled             = currentPage === 1;
    nextBtn.disabled             = currentPage === totalPages;
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentPage   = 1;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      currentPage   = 1;
      render();
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { currentPage--; render(); window.scrollTo({ top: document.getElementById('expeditions').offsetTop - 80, behavior: 'smooth' }); });
  if (nextBtn) nextBtn.addEventListener('click', () => { currentPage++; render(); window.scrollTo({ top: document.getElementById('expeditions').offsetTop - 80, behavior: 'smooth' }); });

  render();
})();

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
  overlay.innerHTML = `
    <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8592;</button>
    <div class="lightbox-inner">
      <img class="lightbox-img" alt="" />
      <div class="lightbox-location"></div>
      <button class="lightbox-close" aria-label="Close">✕ CLOSE</button>
    </div>
    <button class="lightbox-nav lightbox-next" aria-label="Next">&#8594;</button>
  `;
  document.body.appendChild(overlay);

  const lbImg      = overlay.querySelector('.lightbox-img');
  const lbClose    = overlay.querySelector('.lightbox-close');
  const lbLocation = overlay.querySelector('.lightbox-location');
  const lbPrev     = overlay.querySelector('.lightbox-prev');
  const lbNext     = overlay.querySelector('.lightbox-next');

  let items = [];
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item  = items[currentIndex];
    const img   = item.querySelector('img');
    const label = item.querySelector('.g-label');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbLocation.textContent = label ? label.textContent : '';
    lbPrev.style.visibility = items.length > 1 ? 'visible' : 'hidden';
    lbNext.style.visibility = items.length > 1 ? 'visible' : 'hidden';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    openLightbox(currentIndex);
  }

  function initGallery() {
    items = Array.from(document.querySelectorAll('.g-item'));
    items.forEach((item, i) => {
      const img = item.querySelector('img');
      if (!img) return;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(i); });
    });
  }

  initGallery();

  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  lbClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
});
