/* ================================================================
   main.js — Hero image, particles, and nav (shared across all pages)
   ================================================================ */

/* -------- HERO IMAGE -------- */
(function () {
  /* Exact filenames to try, in priority order */
  const CANDIDATES = [
    'images/hero.jpg',
    'images/hero.jpeg',
    'images/hero.JPG',
    'images/hero.JPEG',
    'images/hero.png',
    'images/hero.PNG',
    'images/hero.webp',
    'Images/hero.jpg',
    'Images/hero.jpeg',
    'Images/hero.JPG',
    'Images/hero.jpeg',
    'Images/hero.png',
    'Images/Hero.jpg',
    'Images/Hero.jpeg',
    'Images/Hero.png',
  ];

  const heroBg  = document.getElementById('hero-bg');
  const allBg   = document.getElementById('all-tributes-bg');

  function tryNext(i) {
    if (i >= CANDIDATES.length) return;
    const src = CANDIDATES[i];
    const img = new Image();
    img.onload = function () {
      const val = "url('" + src + "')";
      if (heroBg) heroBg.style.backgroundImage = val;
      if (allBg)  allBg.style.backgroundImage  = val;
    };
    img.onerror = function () { tryNext(i + 1); };
    img.src = src;
  }

  tryNext(0);
})();

/* -------- PARTICLES -------- */
(function () {
  const c = document.getElementById('particles');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;

  const pts = Array.from({ length: 50 }, () => ({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    r: Math.random() * 1.2 + 0.2,
    s: Math.random() * 0.25 + 0.08,
    o: Math.random() * 0.35 + 0.08,
    d: (Math.random() - 0.5) * 0.15
  }));

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(122,184,200,${p.o})`;
      ctx.fill();
      p.y -= p.s;
      p.x += p.d;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    });
    requestAnimationFrame(draw);
  })();
})();

/* -------- NAV -------- */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    })
  );
})();