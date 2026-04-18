// Scroll fade-in
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Back to top
const btn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btn.classList.toggle('show', window.scrollY > 300);
});
btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Love button
function toggleLove(tripId) {
  const loveBtn   = document.getElementById('loveBtn');
  const loveCount = document.getElementById('loveCount');
  if (!loveBtn) return;

  const key     = 'love_' + tripId;
  const countKey = 'love_count_' + tripId;
  const loved   = localStorage.getItem(key) === '1';
  let   count   = parseInt(localStorage.getItem(countKey) || '0', 10);

  if (loved) {
    count = Math.max(0, count - 1);
    localStorage.setItem(key, '0');
    loveBtn.classList.remove('loved');
    loveBtn.querySelector('.love-label').textContent = 'Show some love';
  } else {
    count += 1;
    localStorage.setItem(key, '1');
    loveBtn.classList.add('loved', 'pop');
    loveBtn.querySelector('.love-label').textContent = 'You loved this!';
    setTimeout(() => loveBtn.classList.remove('pop'), 400);
  }

  localStorage.setItem(countKey, count);
  loveCount.textContent = count;
}

// Restore love state on page load
document.addEventListener('DOMContentLoaded', () => {
  const loveBtn   = document.getElementById('loveBtn');
  const loveCount = document.getElementById('loveCount');
  if (!loveBtn) return;

  const tripId   = loveBtn.closest('[data-trip]')?.dataset.trip
                   || window.location.pathname.split('/').pop().replace('.html','');
  const key      = 'love_' + tripId;
  const countKey = 'love_count_' + tripId;
  const count    = parseInt(localStorage.getItem(countKey) || '0', 10);

  loveCount.textContent = count;
  if (localStorage.getItem(key) === '1') {
    loveBtn.classList.add('loved');
    loveBtn.querySelector('.love-label').textContent = 'You loved this!';
  }
});
