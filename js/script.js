// Dark/Light Mode
const modeToggle = document.getElementById('mode-toggle');
modeToggle && modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Back-to-top button
const backToTop = document.getElementById('backToTop');
window.onscroll = () => {
  if (window.scrollY > 300) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';
};
backToTop && backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// Admin login (password: feargod123)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const pass = document.getElementById('adminPass').value;
    if(pass === 'feargod123') {
      document.getElementById('adminContent').style.display = 'block';
      alert('Welcome, Admin!');
    } else {
      alert('Wrong password!');
    }
  });
}

// Dynamic Music
const musicList = document.getElementById('musicList');
function addMusic(title, src){
  if(musicList){
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = src;
    const div = document.createElement('div');
    div.classList.add('audio-player');
    div.innerHTML = `<p>${title}</p>`;
    div.appendChild(audio);
    musicList.appendChild(div);
  }
}

// Dynamic Gallery
const galleryGrid = document.getElementById('galleryGrid');
function addGallery(imgSrc){
  if(galleryGrid){
    const img = document.createElement('img');
    img.src = imgSrc;
    galleryGrid.appendChild(img);
  }
}
