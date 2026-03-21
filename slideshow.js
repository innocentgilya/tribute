/* ================================================================
   slideshow.js — Gallery slideshow for Dr. Philemon Odiwuor Yugi
   ================================================================ */
(function () {
  const NAMES = [
    'Drphilemonyugi',
    'Drphilemonyugi2',
    'Drphilemonyugi3',
    'Drphilemonyugi4',
    'Drphilemonyugi5',
    'Drphilemonyugi6',
    'Drphilemonyugi7',
    'Drphilemonyugi8'
  ];

  const FOLDERS = ['images/', 'Images/'];
  const EXTS    = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.webp'];

  function tryLoad(img, name, fi, ei) {
    if (fi >= FOLDERS.length) { img.style.display = 'none'; return; }
    if (ei >= EXTS.length)    { tryLoad(img, name, fi + 1, 0); return; }
    img.onerror = () => tryLoad(img, name, fi, ei + 1);
    img.src = FOLDERS[fi] + name + EXTS[ei];
  }

  const stage  = document.getElementById('stage');
  const dotsEl = document.getElementById('dots');
  let cur = 0, timer;

  const slides = NAMES.map(name => {
    const s   = document.createElement('div');
    s.className = 'slide';
    const img = document.createElement('img');
    img.alt = 'Dr. Philemon Odiwuor Yugi';
    s.appendChild(img);
    stage.appendChild(s);
    tryLoad(img, name, 0, 0);
    return s;
  });

  function buildDots() {
    dotsEl.innerHTML = slides.map((_, i) =>
      `<div class="dot${i === cur ? ' active' : ''}" data-i="${i}"></div>`
    ).join('');
    dotsEl.querySelectorAll('.dot').forEach(d =>
      d.addEventListener('click', () => goTo(+d.dataset.i))
    );
  }

  function goTo(n) {
    slides[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === cur)
    );
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), 5000);
  }

  slides[0].classList.add('active');
  buildDots();
  resetTimer();

  document.getElementById('prev').addEventListener('click', () => goTo(cur - 1));
  document.getElementById('next').addEventListener('click', () => goTo(cur + 1));
})();
