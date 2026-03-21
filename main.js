/* ================================================================
   main.js — Hero image, particles, nav
   Uses the same image discovery logic as gallery.html
   ================================================================ */

/* -------- HERO IMAGE -------- */
(function () {
  /* Same folders and extensions the gallery uses successfully */
  var FOLDERS = ['images/', 'Images/'];
  var NAMES   = ['hero', 'Hero'];
  var EXTS    = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.webp'];

  var heroBg = document.getElementById('hero-bg');
  var allBg  = document.getElementById('all-tributes-bg');

  /* Build flat list of candidates */
  var candidates = [];
  FOLDERS.forEach(function (folder) {
    NAMES.forEach(function (name) {
      EXTS.forEach(function (ext) {
        candidates.push(folder + name + ext);
      });
    });
  });

  function tryNext(i) {
    if (i >= candidates.length) return;
    var src = candidates[i];
    var img = new Image();
    img.onload = function () {
      var val = "url('" + src + "')";
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
  var c = document.getElementById('particles');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H;

  var pts = [];
  for (var i = 0; i < 50; i++) {
    pts.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.2 + 0.2,
      s: Math.random() * 0.25 + 0.08,
      o: Math.random() * 0.35 + 0.08,
      d: (Math.random() - 0.5) * 0.15
    });
  }

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(122,184,200,' + p.o + ')';
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
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();