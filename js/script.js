/* script.js — FearGod Studios: preloader, theme, nav, music, gallery lightbox, contact form, back-to-top */

(function(){
  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function(){

    const body = document.body;

    /* -------------------- PRELOADER -------------------- */
    const loader = document.getElementById('loading-screen');
    if(loader){
      // hide after 2.8s to let animation breathe
      setTimeout(()=> loader.classList.add('hidden'), 2800);
    }

    /* -------------------- THEME (dark default) -------------------- */
    const modeToggle = document.getElementById('modeToggle');
    const saved = localStorage.getItem('fg_theme');
    if(saved === 'light') body.classList.add('light-mode'); else body.classList.remove('light-mode');

    function updateModeButton(){
      if(!modeToggle) return;
      modeToggle.textContent = body.classList.contains('light-mode') ? '☀️' : '🌙';
    }
    updateModeButton();

    if(modeToggle){
      modeToggle.addEventListener('click', function(){
        const isLight = body.classList.toggle('light-mode');
        localStorage.setItem('fg_theme', isLight ? 'light' : 'dark');
        updateModeButton();
      });
    }

    /* -------------------- MOBILE DRAWER -------------------- */
    const openDrawerBtn = document.querySelector('.menu-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerClose = mobileDrawer && mobileDrawer.querySelector('.drawer-close');

    if(openDrawerBtn && mobileDrawer){
      openDrawerBtn.addEventListener('click', ()=> mobileDrawer.classList.add('open'));
    }
    if(drawerClose){
      drawerClose.addEventListener('click', ()=> mobileDrawer.classList.remove('open'));
    }
    if(mobileDrawer){
      mobileDrawer.addEventListener('click', (e)=> {
        if(e.target.tagName === 'A') mobileDrawer.classList.remove('open');
      });
    }

    /* -------------------- BACK TO TOP -------------------- */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function(){
      if(!backToTop) return;
      backToTop.style.display = window.scrollY > 360 ? 'block' : 'none';
    });
    if(backToTop) backToTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

    /* -------------------- HERO QUOTES (if any) -------------------- */
    // Optional: rotate quotes if an element with id="heroQuote" exists
    const heroQuoteEl = document.getElementById('heroQuote');
    const quotes = window._FG_QUOTES || [];
    if(heroQuoteEl && quotes.length){
      let qi = 0;
      heroQuoteEl.textContent = quotes[0];
      setInterval(()=> {
        qi = (qi + 1) % quotes.length;
        heroQuoteEl.classList.remove('visible');
        setTimeout(()=> {
          heroQuoteEl.textContent = quotes[qi];
          heroQuoteEl.classList.add('visible');
        }, 300);
      }, 4200);
    }

    /* -------------------- GALLERY LIGHTBOX -------------------- */
    // Create lightbox DOM once
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lb-close" aria-label="close">✕</button><img alt="expanded">';
    document.body.appendChild(lightbox);
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lb-close');

    function openLightbox(src){
      lbImg.src = src;
      lightbox.classList.add('open');
    }
    function closeLightbox(){ lightbox.classList.remove('open'); lbImg.src=''; }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e)=> { if(e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeLightbox(); });

    // Attach to gallery images (class .grid img or .gallery-item)
    const galleryImgs = Array.from(document.querySelectorAll('.grid img, .gallery-item'));
    galleryImgs.forEach(img => {
      img.addEventListener('click', ()=> openLightbox(img.src) );
    });

    /* -------------------- CONTACT FORM (Formspree) -------------------- */
    const contactForm = document.querySelector('form[action*="formspree.io"]');
    if(contactForm){
      contactForm.addEventListener('submit', async function(e){
        e.preventDefault();
        const formData = new FormData(contactForm);
        try{
          const resp = await fetch(contactForm.action, {
            method: contactForm.method || 'POST',
            body: formData,
            headers: { Accept: 'application/json' }
          });
          if(resp.ok){
            alert('Thanks! Your message was sent.'); contactForm.reset();
            // store a copy locally for admin view
            const entry = { name: formData.get('name')||'', email: formData.get('email')||'', message: formData.get('message')||'', time: new Date().toISOString() };
            const arr = JSON.parse(localStorage.getItem('fg_messages') || '[]'); arr.unshift(entry); localStorage.setItem('fg_messages', JSON.stringify(arr));
          } else {
            alert('Oops — sending failed. Please try again later.');
          }
        }catch(err){
          alert('Network error. Please check your connection and try again.');
        }
      });
    }

    /* -------------------- MUSIC PLAYER (music page only) -------------------- */
    const audio = document.getElementById('audioPlayer');
    const tracks = Array.from(document.querySelectorAll('.track'));
    if(audio && tracks.length){
      tracks.forEach(t => {
        t.addEventListener('click', function(){
          const src = this.dataset.src;
          const title = this.dataset.title || '';
          if(!src) return;
          audio.src = src;
          audio.play().catch(()=>{});
          // class highlight
          tracks.forEach(x => x.classList.remove('playing'));
          this.classList.add('playing');
          // update now playing title if exists
          const nowEl = document.getElementById('nowPlaying');
          if(nowEl) nowEl.textContent = title;
        });
      });

      // advance when ended
      audio.addEventListener('ended', function(){
        const currentIndex = tracks.findIndex(t => t.dataset.src === audio.src);
        const nextIndex = (currentIndex + 1) % tracks.length;
        const next = tracks[nextIndex];
        if(next){
          next.click();
        }
      });
    }

    /* -------------------- Smooth nav link scroll (if anchors used) -------------------- */
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    navLinks.forEach(a => {
      if(a.hash && document.querySelector(a.hash)){
        a.addEventListener('click', function(e){
          e.preventDefault();
          document.querySelector(a.hash).scrollIntoView({ behavior: 'smooth' });
        });
      }
    });

    /* -------------------- QA console (optional) -------------------- */
    // console.log('FG script initialized');

  }); // DOMContentLoaded
})();
