/* script.js — FearGod Studios: theme, preloader, nav, music player, gallery lightbox+swipe, contact storage, admin lite */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  /* ========== PRELOADER ========== */
  const preloader = $('#preloader');
  if(preloader){
    // always play on load -> hide after 3200ms
    setTimeout(()=> {
      preloader.classList.add('hidden');
    }, 3200);
  }

  /* ========== THEME (dark default) ========== */
  const stored = localStorage.getItem('fg_theme');
  if(stored === 'light') body.classList.add('light'); else body.classList.remove('light');

  // theme toggles (buttons with id theme-toggle or class theme-btn)
  $$('#theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const nowLight = body.classList.toggle('light');
      localStorage.setItem('fg_theme', nowLight ? 'light' : 'dark');
      updateThemeIcons();
    });
  });
  $$('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nowLight = body.classList.toggle('light');
      localStorage.setItem('fg_theme', nowLight ? 'light' : 'dark');
      updateThemeIcons();
    });
  });

  function updateThemeIcons(){
    $$('#theme-toggle').forEach(btn => btn.textContent = body.classList.contains('light') ? '🌞' : '🌙');
    $$('.theme-btn').forEach(btn => btn.textContent = body.classList.contains('light') ? '🌞' : '🌙');
  }
  updateThemeIcons();

  /* ========== MOBILE DRAWER ========== */
  const drawer = document.querySelector('.mobile-drawer');
  $$('.menu-btn').forEach(b => b.addEventListener('click', ()=> drawer && drawer.classList.add('open')));
  const drawerClose = drawer && drawer.querySelector('.drawer-close');
  if(drawerClose) drawerClose.addEventListener('click', ()=> drawer.classList.remove('open'));
  if(drawer) drawer.addEventListener('click', e => { if(e.target.tagName === 'A') drawer.classList.remove('open'); });

  /* ========== HERO QUOTES ROTATOR ========== */
  const quoteEl = $('#quote');
  const quotes = window._FG_QUOTES || ["Where creativity meets purpose."];
  if(quoteEl){
    let i = 0;
    quoteEl.textContent = quotes[0];
    setTimeout(()=> quoteEl.classList.add('show'), 350);
    setInterval(()=> {
      i = (i+1) % quotes.length;
      quoteEl.classList.remove('show');
      setTimeout(()=> { quoteEl.textContent = quotes[i]; quoteEl.classList.add('show'); }, 300);
    }, 4200);
  }

  /* ========== BACK TO TOP ========== */
  const backToTop = $('#backToTop');
  window.addEventListener('scroll', () => {
    if(backToTop) backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backToTop && backToTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  /* ========== MUSIC: visual player ========== */
  const playlist = window._FG_PLAYLIST || [];
  const musicListEl = $('#musicList');
  const mainPlayer = $('#mainPlayer');
  if(musicListEl && mainPlayer && playlist.length){
    playlist.forEach((t,i) => {
      const row = document.createElement('div');
      row.className = 'track';
      row.innerHTML = `<div class="title">${t.title}</div><div><button class="play-btn" data-src="${t.src}">Play</button></div>`;
      musicListEl.appendChild(row);
    });

    musicListEl.addEventListener('click', (e) => {
      if(e.target.classList.contains('play-btn')){
        const src = e.target.dataset.src;
        mainPlayer.src = src;
        mainPlayer.play().catch(()=>{});
        $$('.track').forEach(x => x.classList.remove('playing'));
        e.target.closest('.track').classList.add('playing');
      }
    });

    mainPlayer.addEventListener('ended', () => {
      if(!mainPlayer.src) return;
      const idx = playlist.findIndex(p => p.src === mainPlayer.src);
      const next = (idx + 1) % playlist.length;
      mainPlayer.src = playlist[next].src;
      mainPlayer.play().catch(()=>{});
      $$('.track').forEach(x => x.classList.remove('playing'));
      $$('.track')[next] && $$('.track')[next].classList.add('playing');
    });
  }

  /* ========== GALLERY: populate & lightbox with swipe ========== */
  const galleryGrid = $('#galleryGrid');
  const galleryList = window._FG_GALLERY || [];
  if(galleryGrid && galleryList.length){
    galleryList.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.alt = 'FearGod image';
      galleryGrid.appendChild(img);
    });
  }

  const LB = $('#lightbox');
  const lbImg = $('#lbImage');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');
  let current = 0;

  function openLB(idx){
    if(!LB) return;
    current = idx;
    lbImg.src = galleryList[current];
    LB.classList.add('open');
  }
  function closeLB(){ LB && LB.classList.remove('open'); }

  setTimeout(()=> {
    if(galleryGrid){
      Array.from(galleryGrid.querySelectorAll('img')).forEach((img, idx) => {
        img.addEventListener('click', ()=> openLB(idx));
      });
    }
  }, 60);

  if(lbClose) lbClose.addEventListener('click', closeLB);
  if(lbPrev) lbPrev.addEventListener('click', ()=> { current = (current-1 + galleryList.length) % galleryList.length; lbImg.src = galleryList[current]; });
  if(lbNext) lbNext.addEventListener('click', ()=> { current = (current+1) % galleryList.length; lbImg.src = galleryList[current]; });
  if(LB) LB.addEventListener('click', (e)=> { if(e.target === LB) closeLB(); });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowLeft') lbPrev && lbPrev.click();
    if(e.key === 'ArrowRight') lbNext && lbNext.click();
  });

  // touch swipe
  (function addSwipe(){
    if(!LB || !lbImg) return;
    let sx=0, ex=0;
    LB.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
    LB.addEventListener('touchmove', e => ex = e.touches[0].clientX, {passive:true});
    LB.addEventListener('touchend', () => {
      const dx = ex - sx;
      if(Math.abs(dx) > 40){
        if(dx < 0) lbNext && lbNext.click(); else lbPrev && lbPrev.click();
      }
      sx = ex = 0;
    });
  })();

  /* ========== CONTACT: Formspree + localStorage copy + thank you alert ========== */
  const contactForm = $('#contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', e => {
      // let Formspree handle actual sending; we store a copy and show alert
      const fd = new FormData(contactForm);
      const entry = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message'), time: new Date().toISOString() };
      const arr = JSON.parse(localStorage.getItem('fg_messages') || '[]');
      arr.unshift(entry);
      localStorage.setItem('fg_messages', JSON.stringify(arr));
      setTimeout(()=> { alert('Thanks! Your message was sent.'); contactForm.reset(); }, 200);
    });
  }

  /* ========== ADMIN lite ========== */
  const loginForm = $('#loginForm');
  const adminPanel = $('#adminPanel');
  const adminMessages = $('#adminMessages');
  if(loginForm){
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const pass = $('#adminPass').value;
      if(pass === 'feargod123'){ loginForm.style.display='none'; adminPanel.style.display='block'; renderAdmin(); localStorage.setItem('fg_admin_logged','1'); }
      else alert('Wrong password');
    });
  }
  function renderAdmin(){
    const arr = JSON.parse(localStorage.getItem('fg_messages') || '[]');
    if(!adminMessages) return;
    adminMessages.innerHTML = '';
    if(arr.length === 0){ adminMessages.innerHTML = '<p class="msg">No messages yet.</p>'; return; }
    arr.forEach((m,i)=> {
      const d = document.createElement('div'); d.className='msg';
      d.innerHTML = `<strong>${i+1}. ${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;</strong><p>${escapeHtml(m.message)}</p><small>${new Date(m.time).toLocaleString()}</small>`;
      adminMessages.appendChild(d);
    });
  }
  function escapeHtml(s=''){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  if(adminPanel && localStorage.getItem('fg_admin_logged') === '1'){ adminPanel.style.display='block'; loginForm && (loginForm.style.display='none'); renderAdmin(); }

}); // DOMContentLoaded
