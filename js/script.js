/* script.js - FearGod Studios */

/* ---------- DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeBtn = document.getElementById('theme-toggle');
  const backToTop = document.getElementById('backToTop');
  const menuBtn = document.querySelector('.menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');

  // THEME: initialize from localStorage or system
  const savedTheme = localStorage.getItem('fg_theme');
  if(savedTheme) {
    document.documentElement.classList.toggle('light', savedTheme === 'light');
    document.body.classList.toggle('light', savedTheme === 'light');
    updateThemeIcon(savedTheme === 'light' ? 'light' : 'dark');
  } else {
    // detect preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateThemeIcon(prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !prefersDark);
  }

  function updateThemeIcon(mode){
    if(!themeBtn) return;
    themeBtn.textContent = (mode === 'light') ? '🌞' : '🌙';
  }

  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('fg_theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight ? 'light' : 'dark');
    });
  }

  // BACK TO TOP
  window.addEventListener('scroll', () => {
    if(window.scrollY > 300) backToTop && (backToTop.style.display = 'block');
    else backToTop && (backToTop.style.display = 'none');
  });
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // MOBILE DRAWER
  menuBtn && menuBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
  drawerClose && drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  // close on link click
  mobileDrawer && mobileDrawer.addEventListener('click', e => {
    if(e.target.tagName === 'A') mobileDrawer.classList.remove('open');
  });

  // ---------------- PLAYLIST (music page)
  const playlist = [
    {title: "Track One - FearGod", src: "assets/music/track1.mp3"},
    {title: "Track Two - FearGod", src: "assets/music/track2.mp3"}
  ];
  const musicListEl = document.getElementById('musicList');
  const mainPlayer = document.getElementById('mainPlayer');

  if(musicListEl && mainPlayer){
    playlist.forEach((t,i) => {
      const tr = document.createElement('div');
      tr.className = 'track';
      tr.innerHTML = `<div class="title">${t.title}</div>
                      <div><button class="play-btn" data-src="${t.src}">Play</button></div>`;
      musicListEl.appendChild(tr);
    });

    // delegate play buttons
    musicListEl.addEventListener('click', (e) => {
      if(e.target.classList.contains('play-btn')){
        const src = e.target.dataset.src;
        mainPlayer.src = src;
        mainPlayer.play();
        // highlight
        Array.from(musicListEl.querySelectorAll('.track')).forEach(el => el.classList.remove('playing'));
        e.target.closest('.track').classList.add('playing');
      }
    });

    // auto next track
    mainPlayer.addEventListener('ended', () => {
      // find current index
      const current = playlist.findIndex(p => p.src === mainPlayer.src);
      const next = (current + 1) % playlist.length;
      mainPlayer.src = playlist[next].src;
      mainPlayer.play();
      // highlight
      Array.from(musicListEl.querySelectorAll('.track')).forEach(el => el.classList.remove('playing'));
      const el = musicListEl.querySelectorAll('.track')[next];
      el && el.classList.add('playing');
    });
  }

  // ---------------- GALLERY (home + gallery pages)
  const galleryGrid = document.getElementById('galleryGrid');
  const sampleImages = [
    'assets/images/photo1.jpg',
    'assets/images/photo2.jpg',
    'assets/images/photo3.jpg'
  ];
  if(galleryGrid){
    sampleImages.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'FearGod image';
      galleryGrid.appendChild(img);
    });
  }
  // helper to add single gallery image (used by gallery page)
  // Exposed on window so inline pages can call `addGallery(src)`
  window.addGallery = function(src){
    const g = document.getElementById('galleryGrid');
    if(!g) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'FearGod image';
    g.appendChild(img);
  };

  // ---------------- CONTACT FORM (Formspree + save to localStorage)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      // allow Formspree to submit, but also capture a copy to localStorage
      const formData = new FormData(contactForm);
      const entry = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        time: new Date().toISOString()
      };
      // save
      const messages = JSON.parse(localStorage.getItem('fg_messages') || '[]');
      messages.unshift(entry); // newest first
      localStorage.setItem('fg_messages', JSON.stringify(messages));
      // UX feedback after short delay (Formspree will navigate/submit if configured)
      setTimeout(() => {
        alert('Thanks! Your message was sent.');
        contactForm.reset();
      }, 200);
    });
  }

  // ---------------- ADMIN: load messages and show if logged in
  const adminLogin = document.getElementById('loginForm');
  const adminPanel = document.getElementById('adminPanel');
  const adminMessagesEl = document.getElementById('adminMessages');

  function renderAdminMessages(){
    const list = JSON.parse(localStorage.getItem('fg_messages') || '[]');
    if(!adminMessagesEl) return;
    adminMessagesEl.innerHTML = '';
    if(list.length === 0){ adminMessagesEl.innerHTML = '<p class="msg">No messages yet.</p>'; return; }
    list.forEach((m, idx) => {
      const d = document.createElement('div');
      d.className = 'msg';
      d.innerHTML = `<strong>${idx+1}. ${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;</strong>
                     <p>${escapeHtml(m.message)}</p>
                     <small>${new Date(m.time).toLocaleString()}</small>`;
      adminMessagesEl.appendChild(d);
    });
  }

  // basic admin auth (client-side)
  if(adminLogin){
    adminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('adminPass').value;
      // NOTE: Client-side auth is not secure. This implementation checks a developer-set
      // localStorage value 'fg_admin_pass' so there is no hardcoded password in the code.
      // For production, implement server-side authentication and remove client-side checks.
      const devPass = localStorage.getItem('fg_admin_pass');
      if(devPass && pass === devPass){
        // show admin
        adminPanel && (adminPanel.style.display = 'block');
        renderAdminMessages();
        adminLogin.style.display = 'none';
        localStorage.setItem('fg_admin_logged','1');
      } else {
        alert('Wrong password. To enable local testing, set a password in the console with:\nlocalStorage.setItem("fg_admin_pass","yourpass")');
      }
    });
  }

  // helper: escape text
  function escapeHtml(s = ''){
    return s.replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});
  }

  // initial render if admin panel exists and allowed (persisted)
  if(adminPanel && localStorage.getItem('fg_admin_logged') === '1'){
    adminPanel.style.display = 'block'; renderAdminMessages();
  }

}); // DOMContentLoaded
