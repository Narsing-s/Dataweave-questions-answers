(() => {
  if (window.__DW_LAB_ENHANCED__) return;
  window.__DW_LAB_ENHANCED__ = true;
  const load = () => window.DataWeaveLearning;
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  const getId = card => card?.querySelector('.pill:last-of-type')?.textContent?.trim();
  const getMeta = card => ({
    difficulty: card?.querySelector('.pill')?.textContent?.trim() || '',
    topic: card?.querySelectorAll('.pill')?.[1]?.textContent?.trim() || ''
  });
  function refreshCard(card) {
    const id = getId(card), L = load();
    if (!id || !L) return;
    let bar = card.querySelector('.dw-learning-actions');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'actions dw-learning-actions';
      bar.style.cssText = 'margin-top:9px;border-top:1px solid #2a3b5c;padding-top:9px';
      card.querySelector('.actions')?.insertAdjacentElement('afterend', bar);
      if (!card.querySelector('.actions')) card.appendChild(bar);
    }
    const s = L.state();
    const bookmarked = s.bookmarks.includes(String(id));
    const completed = s.completed.includes(String(id));
    const review = s.wrong.includes(String(id));
    bar.innerHTML = `
      <button class="btn dw-bookmark" type="button">${bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</button>
      <button class="btn dw-complete" type="button">${completed ? '✓ Completed' : '✓ Mark completed'}</button>
      <button class="btn dw-review" type="button">${review ? '↻ Needs review' : '↻ Mark needs review'}</button>`;
    bar.querySelector('.dw-bookmark').onclick = () => { L.toggleBookmark(id); refreshCard(card); notify(bookmarked ? 'Bookmark removed' : 'Bookmarked'); };
    bar.querySelector('.dw-complete').onclick = () => { L.mark(id, true, getMeta(card)); refreshCard(card); notify('Marked completed'); };
    bar.querySelector('.dw-review').onclick = () => { L.mark(id, false, getMeta(card)); refreshCard(card); notify('Added to review'); };
    card.dataset.completed = completed ? 'true' : 'false';
    card.dataset.bookmarked = bookmarked ? 'true' : 'false';
    card.dataset.review = review ? 'true' : 'false';
  }
  function notify(text) {
    if (typeof window.toast === 'function') { window.toast(text); return; }
    let t = document.getElementById('dw-enhance-toast');
    if (!t) { t = document.createElement('div'); t.id = 'dw-enhance-toast'; t.style.cssText = 'position:fixed;right:15px;bottom:15px;z-index:999;background:#17324e;border:1px solid #49658b;padding:10px 14px;border-radius:9px;color:white'; document.body.appendChild(t); }
    t.textContent = text; t.hidden = false; clearTimeout(t._timer); t._timer = setTimeout(() => { t.hidden = true; }, 1400);
  }
  function addSummary() {
    if (document.getElementById('dw-learning-summary')) return;
    const toolbar = document.querySelector('.toolbar'); if (!toolbar) return;
    const L = load(); if (!L) return;
    const p = document.createElement('div'); p.id = 'dw-learning-summary'; p.className = 'muted'; p.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
    p.innerHTML = '<a class="btn" href="progress.html">Progress</a><a class="btn" href="review.html">Review center</a><span id="dw-learning-count"></span>';
    toolbar.appendChild(p);
    updateSummary();
  }
  function updateSummary() {
    const el = document.getElementById('dw-learning-count'), L = load(); if (!el || !L) return;
    const s = L.stats(); el.textContent = `Completed ${s.completed} · Bookmarked ${s.bookmarks} · Review ${s.wrong} · Streak ${s.streak} day${s.streak === 1 ? '' : 's'}`;
  }
  function enhance() {
    addSummary();
    document.querySelectorAll('#list .card').forEach(refreshCard);
    updateSummary();
    const list = document.getElementById('list');
    if (list && !list.__dwObserved) { new MutationObserver(() => { document.querySelectorAll('#list .card').forEach(refreshCard); updateSummary(); }).observe(list, {childList:true}); list.__dwObserved = true; }
    if (!document.getElementById('dw-mobile-style')) {
      const style = document.createElement('style'); style.id = 'dw-mobile-style'; style.textContent = '@media(max-width:500px){.links{display:flex!important;overflow-x:auto;flex-wrap:nowrap;justify-content:flex-start;width:100%;padding-bottom:4px}.navin{justify-content:flex-start;overflow:hidden}.links a,.links button{white-space:nowrap}.toolbar{top:0}.dw-learning-actions{display:flex;overflow-x:auto;flex-wrap:nowrap}.dw-learning-actions .btn{white-space:nowrap}}'; document.head.appendChild(style);
    }
  }
  const start = () => { if (!load()) return setTimeout(start, 50); enhance(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
