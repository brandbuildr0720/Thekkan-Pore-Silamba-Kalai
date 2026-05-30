# Thekkan Pore Silamba Kalai — Website

A complete multi-page website for Thekkan Pore Silamba Kalai, ready to deploy on **GitHub Pages**.

---

## 📁 File Structure

```
silambam/
├── index.html              ← Homepage with 4 master cards
├── css/
│   └── style.css           ← All styles (dark gold theme)
├── js/
│   └── main.js             ← Particles, transitions, gallery upload
├── pages/
│   ├── origin.html         ← History of Silambam & Thekkan Pore
│   ├── gallery.html        ← Photo gallery with password upload
│   ├── tournaments.html    ← Tournament results + photo upload
│   ├── training.html       ← Training info, schedule, levels
│   ├── media.html          ← Downloads, social media, videos
│   ├── contact.html        ← All 4 branch locations & master details
│   ├── branch1.html        ← Master 1 + Branch 1 gallery
│   ├── branch2.html        ← Master 2 + Branch 2 gallery
│   ├── branch3.html        ← Master 3 + Branch 3 gallery
│   └── branch4.html        ← Master 4 + Branch 4 gallery
├── images/
│   ├── master1.jpg         ← Add master photos here
│   ├── master2.jpg
│   ├── master3.jpg
│   ├── master4.jpg
│   ├── gallery1.jpg        ← Gallery photos
│   └── ...
├── pdfs/
│   ├── entry-form.pdf      ← Add your actual PDF here
│   └── rules.pdf           ← Add your actual PDF here
└── README.md
```

---

## 🚀 How to Deploy on GitHub Pages

### Step 1 — Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"**
3. Name it: `thekkan-pore-silambam` (or any name)
4. Set to **Public**
5. Click **"Create repository"**

### Step 2 — Upload Files
**Option A — GitHub Web Interface (Easiest):**
1. On your new repo page, click **"Add file" → "Upload files"**
2. Drag the entire `silambam` folder contents
3. Make sure to maintain the folder structure (css/, js/, pages/, images/, pdfs/)
4. Commit changes

**Option B — Git Command Line:**
```bash
cd silambam
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repository → **Settings**
2. Click **"Pages"** in the left sidebar
3. Under **"Source"**, select **"Deploy from a branch"**
4. Select **"main"** branch and **"/ (root)"** folder
5. Click **Save**
6. Wait 1-2 minutes
7. Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

## ✏️ How to Customize

### Add Master Photos
- Name your photos: `master1.jpg`, `master2.jpg`, `master3.jpg`, `master4.jpg`
- Place them in the `images/` folder
- They will automatically appear on the homepage and branch pages

### Update Master Names & Details
Open each branch file and find these lines:
```html
<h3 class="card-name">Master Name 1</h3>
<p class="card-location">📍 Location 1</p>
```
Replace with actual names and locations.

### Update Contact Info
Open `pages/contact.html` and update:
- Names, addresses, phone numbers
- Instagram handles
- Training schedules

### Add Gallery Photos
- Static: Place `gallery1.jpg`, `gallery2.jpg` etc. in `images/`
- Dynamic upload: Use the upload form on the gallery page with password **1711**

### Add PDFs
- Place `entry-form.pdf` and `rules.pdf` in the `pdfs/` folder
- They will automatically become downloadable

### Change Instagram Handle
Search for `@your_instagram` across all HTML files and replace with your handle.

### Change Upload Password
Open `js/main.js` and find:
```javascript
const ADMIN_PASS = '1711';
```
Change `'1711'` to your desired password.

---

## 🎨 Design Features
- Dark gold warrior aesthetic
- Animated particle background
- Smooth page transitions
- Scroll-reveal animations
- 3D card hover effects
- Lightbox photo viewer
- Password-protected gallery upload (localStorage)
- Mobile responsive
- Sticky navigation

---

## ⚠️ Important Notes
- Gallery uploads are saved to **browser localStorage** — they will persist per device/browser
- For permanent cloud storage of uploaded photos, you would need a backend service (beyond GitHub Pages)
- The PDFs folder is empty — add your actual PDF files before deploying
- All placeholder text like "Master Name 1", "Location 1" etc. must be manually replaced

---

*Built for Thekkan Pore Silamba Kalai — Guardian of the Warrior Tradition*
