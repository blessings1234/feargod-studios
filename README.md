# FearGod Studios — Static Site

This repository contains a small static website for FearGod Studios (HTML/CSS/JS). Changes applied in this update:

- Normalized asset references so pages use `css/style.css` and `js/script.js` for stylesheet and script.
- Removed the hardcoded admin password from `js/script.js`. Client-side admin login now checks a developer-set localStorage key `fg_admin_pass`. NOTE: client-side auth is not secure; use server-side auth in production.
- Added a global helper `window.addGallery(src)` in `js/script.js` so pages can add gallery images programmatically.

Quick preview (local static server):

```bash
# from repository root
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Security notes:
- The contact form posts to Formspree as configured in `contact.html`.
- Messages saved to `localStorage` under `fg_messages` are only stored in the browser and are not private or persistent across devices.
- Admin panel is for demo/local use only. To enable local testing, run in your browser console:

```js
localStorage.setItem('fg_admin_pass', 'yourpass');
```

Then log in at `/admin.html` with `yourpass`. For production, implement server-side authentication and a proper message storage backend.

If you want, I can:
- Replace the localStorage message store with a simple server API (needs a backend).
- Add a small deploy guide or GitHub Pages config.
