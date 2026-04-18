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
