export function initGallery(images) {
  let cur = 0;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = lb.querySelector('.lb-close');
  const lbPrev = lb.querySelector('.lb-prev');
  const lbNext = lb.querySelector('.lb-next');

  function openLb(i) {
    cur = i;
    lbImg.src = images[i];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function shiftLb(d) {
    cur = (cur + d + images.length) % images.length;
    lbImg.src = images[cur];
  }

  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => openLb(idx));
  });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => shiftLb(-1));
  lbNext.addEventListener('click', () => shiftLb(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') shiftLb(1);
    if (e.key === 'ArrowLeft') shiftLb(-1);
  });
}
