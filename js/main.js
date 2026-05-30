// ===== PAGE TRANSITION =====
const pt = document.createElement('div');
pt.className = 'page-transition';
pt.innerHTML = '<div class="pt-logo">THEKKAN PORE</div>';
document.body.appendChild(pt);

window.addEventListener('load', () => { pt.classList.remove('active'); });

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.hasAttribute('download')) return;
  e.preventDefault();
  pt.classList.add('active');
  setTimeout(() => { window.location = href; }, 350);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => { navLinks.classList.toggle('open'); });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.scroll-reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));
}

// ===== GALLERY UPLOAD WITH PASSWORD =====
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  const ADMIN_PASS = '1711';
  const fileInput = document.getElementById('photoInput');
  const passInput = document.getElementById('uploadPass');
  const msgSuccess = document.querySelector('.msg-success');
  const msgError = document.querySelector('.msg-error');
  const galleryGrid = document.getElementById('galleryGrid');
  const KEY_INDEX = 'gal_index';

  function getIndex() { try { return JSON.parse(localStorage.getItem(KEY_INDEX) || '[]'); } catch(e) { return []; } }
  function saveIndex(arr) { localStorage.setItem(KEY_INDEX, JSON.stringify(arr)); }
  function storageUsedKB() {
    let total = 0;
    for (let k in localStorage) { if (localStorage.hasOwnProperty(k)) total += (localStorage[k].length * 2); }
    return Math.round(total / 1024);
  }
  function updateStorageBar() {
    const bar = document.getElementById('storageBar');
    const label = document.getElementById('storageLabel');
    const count = document.getElementById('photoCount');
    if (!bar) return;
    const kb = storageUsedKB();
    const maxKB = 4800;
    const pct = Math.min(100, Math.round(kb / maxKB * 100));
    bar.style.width = pct + '%';
    bar.style.background = pct > 80 ? '#B22222' : '#C9A84C';
    label.textContent = `Storage: ${kb} KB / ~5000 KB used (${pct}%)`;
    const idx = getIndex();
    if (count) count.textContent = `${idx.length} photo${idx.length !== 1 ? 's' : ''} saved`;
  }
  function compressImage(file, maxW, quality) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function addPhotoToGrid(id, src, prepend = false) {
    const empty = document.getElementById('galleryEmpty');
    if (empty) empty.remove();
    const item = document.createElement('div');
    item.className = 'gallery-item scroll-reveal';
    item.dataset.id = id;
    item.innerHTML = `<img src="${src}" alt="Gallery Photo" loading="lazy"/><div class="gallery-item-overlay"><span class="view-btn">🔍 View</span><span class="del-btn" title="Delete">🗑</span></div>`;
    item.querySelector('.view-btn').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(src); });
    item.querySelector('img').addEventListener('click', () => openLightbox(src));
    item.querySelector('.del-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const pw = prompt('Enter admin password to delete this photo:');
      if (pw !== ADMIN_PASS) { alert('Wrong password.'); return; }
      try { localStorage.removeItem('gal_img_' + id); } catch(err) {}
      const idx = getIndex().filter(i => i !== id);
      saveIndex(idx);
      item.remove();
      updateStorageBar();
      if (getIndex().length === 0) showEmpty();
    });
    if (prepend && galleryGrid.firstChild) { galleryGrid.insertBefore(item, galleryGrid.firstChild); }
    else { galleryGrid.appendChild(item); }
    setTimeout(() => item.classList.add('visible'), 30);
  }
  function showEmpty() {
    if (!document.getElementById('galleryEmpty')) {
      const p = document.createElement('p');
      p.id = 'galleryEmpty';
      p.style.cssText = 'color:var(--text-muted);font-size:13px;text-align:center;grid-column:1/-1;padding:40px 0;opacity:0.6;';
      p.textContent = 'No photos uploaded yet. Use the form above to add photos.';
      galleryGrid.appendChild(p);
    }
  }
  function loadGallery() {
    const idx = getIndex();
    if (idx.length === 0) { showEmpty(); }
    [...idx].reverse().forEach(id => {
      try { const src = localStorage.getItem('gal_img_' + id); if (src) addPhotoToGrid(id, src, false); } catch(e) {}
    });
    updateStorageBar();
  }
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (passInput.value !== ADMIN_PASS) {
      msgError.textContent = '❌ Wrong password.'; msgError.style.display = 'block'; msgSuccess.style.display = 'none';
      setTimeout(() => msgError.style.display = 'none', 3500); return;
    }
    if (!fileInput.files.length) {
      msgError.textContent = '❌ Please select at least one photo.'; msgError.style.display = 'block';
      setTimeout(() => msgError.style.display = 'none', 3000); return;
    }
    const files = Array.from(fileInput.files);
    const uploadBtn = uploadForm.querySelector('.upload-btn');
    uploadBtn.textContent = `Uploading 0 / ${files.length}...`; uploadBtn.disabled = true;
    let saved = 0, failed = 0;
    const idx = getIndex();
    for (let i = 0; i < files.length; i++) {
      uploadBtn.textContent = `Uploading ${i + 1} / ${files.length}...`;
      try {
        const compressed = await compressImage(files[i], 900, 0.75);
        const id = 'p' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        localStorage.setItem('gal_img_' + id, compressed);
        idx.unshift(id); saveIndex(idx);
        addPhotoToGrid(id, compressed, true); saved++;
      } catch (err) { failed++; }
    }
    uploadBtn.textContent = 'Upload Photos'; uploadBtn.disabled = false;
    uploadForm.reset(); updateStorageBar();
    if (saved > 0) {
      msgSuccess.textContent = `✅ ${saved} photo${saved > 1 ? 's' : ''} uploaded!`;
      msgSuccess.style.display = 'block'; msgError.style.display = 'none';
    }
    if (failed > 0) {
      msgError.textContent = `⚠️ ${failed} photo(s) failed — storage may be full.`;
      msgError.style.display = 'block';
    }
    setTimeout(() => { msgSuccess.style.display = 'none'; msgError.style.display = 'none'; }, 5000);
  });
  loadGallery();
}

// ===== LIGHTBOX =====
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<span class="lightbox-close">✕</span><img id="lbImg" src="" alt=""/>';
document.body.appendChild(lightbox);
function openLightbox(src) { document.getElementById('lbImg').src = src; lightbox.classList.add('open'); }
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => { const img = item.querySelector('img'); if (img) openLightbox(img.src); });
});

// ===== MASTER CARD HOVER =====
document.querySelectorAll('.master-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-8px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPage = link.getAttribute('href').split('/').pop();
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
