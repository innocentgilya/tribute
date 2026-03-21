/* ================================================================
   tributes.js — Tribute slideshow wall + form + overlay
   ================================================================ */
(function () {
  const wall        = document.getElementById('tribute-wall');
  const navRow      = document.getElementById('tribute-wall-nav');
  const pageLabel   = document.getElementById('tribute-page-label');
  const progressBar = document.getElementById('tribute-progress-bar');
  const viewAllBtn  = document.getElementById('tribute-view-all-btn');
  const overlay     = document.getElementById('all-tributes-overlay');
  const overlayGrid = document.getElementById('all-tributes-grid');
  const closeBtn    = document.getElementById('all-tributes-close');
  const btn         = document.getElementById('submit-tribute');
  const msg         = document.getElementById('t-message');
  const toast       = document.getElementById('toast');

  const PER_PAGE  = 3;
  const DURATION  = 15000; // 15 s per page
  let allTributes = [];
  let curPage     = 0;
  let totalPages  = 1;
  let timer;

  /* ---- Helpers ---- */
  function timeAgo(dateStr) {
    const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }

  function cardHTML(t, delay) {
    return `
      <div class="tribute-card" style="animation-delay:${delay}s">
        ${t.relation ? `<div class="tribute-relation">${t.relation}</div>` : ''}
        <p class="tribute-text">${t.message}</p>
        <div class="tribute-meta">
          <span class="tribute-name">${t.name || 'Anonymous'}</span>
          <span class="tribute-time">${timeAgo(t.created_at)}</span>
        </div>
      </div>`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ---- Tribute slideshow ---- */
  function showPage(page) {
    curPage = (page + totalPages) % totalPages;
    const slice = allTributes.slice(curPage * PER_PAGE, curPage * PER_PAGE + PER_PAGE);

    wall.querySelectorAll('.tribute-slide').forEach(el => el.remove());

    const slide = document.createElement('div');
    slide.className = 'tribute-slide active';
    slide.innerHTML = slice.map((t, i) => cardHTML(t, i * 0.08)).join('');
    wall.appendChild(slide);

    pageLabel.textContent = `${curPage + 1} / ${totalPages}`;
    startProgress();
  }

  function startProgress() {
    clearTimeout(timer);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    void progressBar.offsetWidth; // force reflow
    progressBar.style.transition = `width ${DURATION}ms linear`;
    progressBar.style.width = '100%';
    if (totalPages > 1) {
      timer = setTimeout(() => showPage(curPage + 1), DURATION);
    }
  }

  function renderSlideshow(tributes) {
    allTributes = tributes;
    wall.innerHTML = '';

    if (!tributes.length) {
      wall.innerHTML = '<div class="empty-wall">Be the first to leave a tribute — your words bring comfort to those who grieve.</div>';
      navRow.style.display = 'none';
      return;
    }

    totalPages = Math.ceil(tributes.length / PER_PAGE);
    navRow.style.display = 'flex';
    showPage(0);
  }

  /* ---- All tributes overlay ---- */
  function openOverlay() {
    overlayGrid.innerHTML = allTributes.map((t, i) => cardHTML(t, i * 0.04)).join('');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  viewAllBtn.addEventListener('click', openOverlay);
  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });

  /* ---- Load tributes ---- */
  function loadTributes() {
    wall.innerHTML = '<div class="empty-wall">Loading tributes…</div>';
    fetch('/api/tributes')
      .then(r => r.json())
      .then(data => renderSlideshow(data))
      .catch(() => {
        wall.innerHTML = '<div class="empty-wall">Could not load tributes. Please refresh the page.</div>';
      });
  }
  loadTributes();

  /* ---- Char counter ---- */
  msg.addEventListener('input', () => {
    document.getElementById('char-used').textContent = msg.value.length;
  });

  /* ---- Submit tribute ---- */
  btn.addEventListener('click', async () => {
    const name     = document.getElementById('t-name').value.trim();
    const relation = document.getElementById('t-relation').value;
    const message  = msg.value.trim();

    if (!message) {
      msg.style.borderColor = '#c0392b';
      msg.focus();
      setTimeout(() => msg.style.borderColor = '', 1500);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Submitting…';

    try {
      const res  = await fetch('/api/tributes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, relation, message })
      });
      const data = await res.json();

      if (res.ok) {
        document.getElementById('t-name').value     = '';
        document.getElementById('t-relation').value = '';
        msg.value = '';
        document.getElementById('char-used').textContent = '0';
        showToast('Thank you! Your tribute has been submitted and will appear once approved.');
        wall.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        showToast(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      showToast('Could not connect. Please check your internet and try again.');
    }

    btn.disabled = false;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> Leave Your Tribute`;
  });
})();
