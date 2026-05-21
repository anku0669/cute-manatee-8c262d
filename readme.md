# PROMPT//FORGE ⚡

A live, community-driven AI prompt library with a cyberpunk terminal aesthetic.
When anyone adds a prompt, it appears for every visitor **instantly** — powered by Firebase Firestore realtime sync.

> **Inspired by:** [anku0669.github.io](https://anku0669.github.io/) (hacker terminal vibe) + [unjail.ai](https://www.unjail.ai/) (card grid layout)

---

## ✨ Features

- 🟢 **Realtime sync** — new prompts appear for every visitor with zero refresh (Firestore `onSnapshot`)
- 🎨 **Top-tier cyberpunk UI** — neon-green/cyan gradients, animated matrix rain, scanlines, glitch effects
- 🔍 **Live search + category filters** — filter by Coding, Writing, Marketing, Research, etc.
- 📋 **One-tap copy** — copy any prompt straight to your clipboard
- ➕ **Frictionless contribution** — no login, no review queue, drop and deploy
- 📱 **Fully responsive** — looks great on every screen
- 🪶 **Static site** — deploys free to GitHub Pages, Vercel, Netlify, or Cloudflare Pages
- 💾 **Graceful fallback** — works locally with seed prompts even before you connect Firebase

---

## 🚀 Setup (≈ 3 minutes)

### 1. Create a free Firebase project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com/)**
2. Click **"Add project"** → name it `promptforge` → continue (you can disable Analytics)
3. On the project home, click the **`</>` web icon** to add a web app
4. Give it a nickname (e.g. `web`) → **Register app**
5. Firebase will show a `firebaseConfig` object — **copy it**

### 2. Paste your config

Open `config.js` and replace the placeholder values with your real ones:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "promptforge-xxx.firebaseapp.com",
  projectId: "promptforge-xxx",
  storageBucket: "promptforge-xxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc..."
};
```

### 3. Enable Firestore

1. In the Firebase console, sidebar → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (allows public read/write for 30 days — fine for launch)
4. Pick a region near you → **Enable**

### 4. (Recommended) Lock down rules a bit

After you launch, replace the test rules with something a little safer.
In Firestore → **Rules** tab, paste this and Publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /prompts/{doc} {
      // Anyone can read
      allow read: if true;
      // Anyone can create, but enforce shape + size to prevent abuse
      allow create: if request.resource.data.keys().hasOnly(['title','category','author','tags','body','createdAt'])
                    && request.resource.data.title is string
                    && request.resource.data.title.size() > 0
                    && request.resource.data.title.size() < 200
                    && request.resource.data.body is string
                    && request.resource.data.body.size() > 0
                    && request.resource.data.body.size() < 8000
                    && request.resource.data.category is string
                    && request.resource.data.tags is list;
      // Nobody can update or delete from the client
      allow update, delete: if false;
    }
  }
}
```

---

## 🌐 Deploy

Pick any one — all are free.

### Option A — GitHub Pages (easiest)

```bash
git init
git add .
git commit -m "Launch PROMPT//FORGE"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/promptforge.git
git push -u origin main
```

Then in your repo: **Settings → Pages → Source = `main` / root → Save**.
Your site goes live at `https://YOUR_USERNAME.github.io/promptforge/` in ~30 seconds.

### Option B — Vercel

1. Push the folder to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo → **Deploy**
3. Done — you get a `*.vercel.app` URL

### Option C — Netlify

1. Drag the entire `promptforge` folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
2. Done — instant URL

### Option D — Cloudflare Pages

Same as Vercel but on Cloudflare. Free, fast, global edge.

---

## 📁 Project structure

```
promptforge/
├── index.html      # Layout + sections
├── styles.css      # Cyberpunk terminal theme (~700 lines)
├── app.js          # State, Firestore sync, render, modals
├── config.js       # ← YOU paste your Firebase config here
└── README.md       # This file
```

No build step. No dependencies to install. Just static files.

---

## 🛠 Customizing

- **Brand name / tagline** — edit `index.html` (search for `PROMPT//FORGE`)
- **Color theme** — edit the `:root` variables at the top of `styles.css`
  - `--accent` (neon green) and `--accent-2` (cyan) are the two main brand colors
- **Default categories** — edit the `<select name="category">` block in `index.html`
- **Seed prompts** (shown when DB is empty) — edit `SEED_PROMPTS` array in `app.js`

---

## ⌨️ Keyboard shortcuts

- `/` — focus the search bar
- `Esc` — close any open modal

---

## 🔒 Notes on safety

Test-mode Firestore is fine to launch with, but for a public site you should:
1. Apply the rules above (validates payload size + shape)
2. Enable **App Check** in Firebase to block bots (optional, takes 5 min)
3. Add a simple profanity filter or moderation UI later if growth demands it

---

Built with ⚡ for operators.
