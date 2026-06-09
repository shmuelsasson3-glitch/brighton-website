export function initAnimations() {
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  const cascIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      e.target.classList.toggle('shown', e.isIntersecting);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.casc').forEach(el => cascIO.observe(el));

  const capColIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      e.target.classList.toggle('cascade', e.isIntersecting);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.cap-col').forEach(el => capColIO.observe(el));
}
