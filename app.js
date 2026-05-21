/* ============================================================
   PROMPT//FORGE — main application script
   ============================================================ */

// ---------------- STATE ----------------
const state = {
  prompts: [],
  category: 'All',
  search: '',
  mode: 'local', // 'firebase' | 'local'
  db: null,
};

// ---------------- SEED DATA ----------------
const SEED_PROMPTS = [
  {
    id: 'seed-1',
    title: 'Ultimate Code Reviewer',
    category: 'Coding',
    author: 'forge_team',
    tags: ['code', 'review', 'gpt-4', 'claude'],
    body: `You are a senior staff engineer doing a rigorous code review.\n\nReview the code I paste next using this protocol:\n1. Correctness — bugs, edge cases, race conditions\n2. Security — injection, auth, secrets, OWASP top 10\n3. Performance — big-O, allocations, N+1 queries\n4. Readability — naming, structure, comments\n5. Maintainability — coupling, testability, future-proofing\n\nFor each issue: cite the line, explain the impact, and give a one-line fix.\nEnd with a TL;DR and a severity-ranked action list.\n\nCode:\n[paste here]`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'seed-2',
    title: 'Viral Twitter Thread Forge',
    category: 'Marketing',
    author: 'ghostwriter',
    tags: ['twitter', 'x', 'thread', 'copywriting'],
    body: `You are a top-1% X (Twitter) ghostwriter who's written threads with 10M+ impressions.\n\nTopic: [TOPIC]\nAudience: [AUDIENCE]\nDesired outcome: [OUTCOME]\n\nWrite a 9-tweet thread that:\n- Opens with a pattern-interrupt hook (no clichés, no "Let me tell you...")\n- Builds tension and curiosity across tweets 2-7\n- Drops a counter-intuitive insight in tweet 5\n- Closes with a memorable one-liner + soft CTA\n\nConstraints:\n- Each tweet ≤ 270 chars\n- No emojis except one in the hook (optional)\n- No hashtags\n- Conversational, punchy, line breaks for rhythm`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'seed-3',
    title: 'First Principles Decomposer',
    category: 'Research',
    author: 'operator',
    tags: ['thinking', 'analysis', 'frameworks'],
    body: `Act as a first-principles reasoner in the style of Feynman.\n\nTopic: [TOPIC]\n\n1. State the topic in one sentence a 12-year-old understands.\n2. List the 3-5 atomic assumptions underneath it.\n3. For each assumption, ask: "Is this actually true, or just convention?"\n4. Rebuild the topic from only the assumptions that survive.\n5. Surface the single non-obvious insight this reveals.\n\nBe ruthless. Cut anything you can't justify from scratch.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'seed-4',
    title: 'Cinematic Image Prompt Builder',
    category: 'Creative',
    author: 'pixel_priest',
    tags: ['midjourney', 'sdxl', 'flux', 'image'],
    body: `Generate a cinematic image prompt for [SUBJECT].\n\nFormat:\n[subject], [action/pose], [environment + time of day], [lighting style], [camera + lens], [film stock / color grade], [aspect ratio], [mood keywords] --ar 16:9 --style raw\n\nRules:\n- One concrete subject only\n- Specify lens (e.g. 35mm, 85mm, anamorphic 50mm)\n- Specify lighting (rim light, golden hour, neon practicals, etc.)\n- Reference 1-2 cinematographers or films for style (e.g. "Roger Deakins, Blade Runner 2049")\n- No purple prose. Concrete nouns and verbs only.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: 'seed-5',
    title: 'Brutal Resume Auditor',
    category: 'Business',
    author: 'recruiter_x',
    tags: ['resume', 'career', 'hiring'],
    body: `You are a senior tech recruiter at a top-tier company. You've screened 50,000+ resumes.\n\nI will paste my resume next. Audit it brutally:\n\n1. 6-second scan test — would you keep reading? Why / why not?\n2. Top 3 weaknesses (be specific — point at bullets, not vibes)\n3. Buzzword count — flag anything that doesn't earn its place\n4. Impact bullets — which ones lack numbers / outcomes?\n5. Layout — what hurts scanability?\n6. Rewrite my 3 weakest bullets with stronger verbs + metrics\n\nNo compliments. No softening. I want the truth.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'seed-6',
    title: 'Debug Like a Detective',
    category: 'Coding',
    author: 'segfault',
    tags: ['debug', 'troubleshooting', 'systems'],
    body: `Act as a senior systems engineer debugging a production incident.\n\nSymptoms: [describe what's broken]\nWhat I've tried: [list attempts]\nStack: [languages, frameworks, infra]\n\nResponse format:\n1. Top 5 hypotheses ranked by likelihood (with reasoning)\n2. The single cheapest experiment to falsify hypothesis #1\n3. What logs / commands / metrics I should pull next\n4. The most common gotcha for this exact symptom pattern\n5. Worst-case scenario I should rule out\n\nThink like House M.D. — start with the most dangerous diagnosis, then work backwards.`,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'seed-7',
    title: 'Cold Outreach That Doesn\'t Suck',
    category: 'Marketing',
    author: 'sales_op',
    tags: ['cold-email', 'outreach', 'b2b'],
    body: `Write a cold email to [PROSPECT_ROLE] at [COMPANY].\n\nWhat I'm offering: [ONE LINE]\nResearch on the prospect: [2-3 bullets]\n\nConstraints:\n- Subject line ≤ 5 words, lowercase, looks like a colleague wrote it\n- Body ≤ 80 words total\n- Open with one specific observation about them (not "I noticed your company is doing well")\n- One concrete value claim with a number\n- One question they can answer in <10 seconds\n- No "I hope this finds you well", no "Just circling back", no "Quick question"\n- Sign-off: just my first name\n\nReturn 3 variations with different angles.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: 'seed-8',
    title: 'The Socratic Tutor',
    category: 'Education',
    author: 'forge_team',
    tags: ['learning', 'tutor', 'feynman'],
    body: `You are a Socratic tutor. I want to learn [TOPIC].\n\nRules:\n- NEVER give me the answer first.\n- Ask me one question at a time to figure out what I already know.\n- When I'm wrong, don't correct — ask a question that reveals the contradiction.\n- When I'm right, push deeper with "why" or "what if".\n- Track my understanding silently. Adapt difficulty.\n- After 5 exchanges, summarize what I now understand and what's still fuzzy.\n\nStart with question 1.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

// ---------------- DOM ----------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const grid = $('#grid');
const emptyState = $('#emptyState');
const searchInput = $('#searchInput');
const categoryChips = $('#categoryChips');
const statusText = $('#status-text');
const statusPill = document.querySelector('.status-pill');
const modal = $('#modal');
const viewModal = $('#viewModal');
const promptForm = $('#promptForm');

// ---------------- FIREBASE INIT ----------------
function isConfigValid(cfg) {
  return cfg && cfg.apiKey && !cfg.apiKey.startsWith('REPLACE_') && cfg.projectId && !cfg.projectId.startsWith('REPLACE_');
}

function initFirebase() {
  const cfg = window.FIREBASE_CONFIG;
  if (!isConfigValid(cfg)) {
    state.mode = 'local';
    setStatus('LOCAL MODE · ADD FIREBASE CONFIG', false);
    return false;
  }
  try {
    firebase.initializeApp(cfg);
    state.db = firebase.firestore();
    // Force long-polling transport — works through restrictive networks/ISPs
    // that block or throttle Firestore's default WebChannel/WebSocket transport.
    try {
      state.db.settings({
        experimentalAutoDetectLongPolling: true,
        merge: true,
      });
    } catch (settingsErr) {
      console.warn('Firestore settings already applied:', settingsErr);
    }
    state.mode = 'firebase';
    setStatus('LIVE · REALTIME', true);
    return true;
  } catch (e) {
    console.error('Firebase init failed:', e);
    state.mode = 'local';
    setStatus('LOCAL MODE · INIT FAILED', false);
    return false;
  }
}

function setStatus(text, online = true) {
  statusText.textContent = text;
  if (online) statusPill.classList.remove('offline');
  else statusPill.classList.add('offline');
}

// ---------------- DATA LOAD ----------------
function loadLocal() {
  try {
    const raw = localStorage.getItem('promptforge:prompts');
    const arr = raw ? JSON.parse(raw) : [];
    // merge seeds with locally-added (dedupe by id)
    const map = new Map();
    [...SEED_PROMPTS, ...arr].forEach(p => map.set(p.id, p));
    state.prompts = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    state.prompts = [...SEED_PROMPTS];
  }
  render();
}

function saveLocal() {
  // only save user-added (non-seed) to localStorage
  const userPrompts = state.prompts.filter(p => !String(p.id).startsWith('seed-'));
  localStorage.setItem('promptforge:prompts', JSON.stringify(userPrompts));
}

function subscribeFirestore() {
  state.db.collection('prompts').orderBy('createdAt', 'desc').onSnapshot(
    (snap) => {
      const fromDb = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || 'Untitled',
          category: data.category || 'Other',
          author: data.author || 'anon',
          tags: Array.isArray(data.tags) ? data.tags : [],
          body: data.body || '',
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
        };
      });
      // If db is empty, show seeds so it's not a blank canvas
      state.prompts = fromDb.length > 0 ? fromDb : [...SEED_PROMPTS];
      render();
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      setStatus('OFFLINE · USING LOCAL', false);
      loadLocal();
    }
  );
}

// ---------------- ADD PROMPT ----------------
async function addPrompt(payload) {
  if (state.mode === 'firebase' && state.db) {
    // Race the Firestore write against a 15s timeout — on flaky networks
    // the write succeeds locally (cache) but server-ack hangs forever.
    // We resolve as soon as the local cache has it; sync happens in background.
    const writePromise = state.db.collection('prompts').add({
      ...payload,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Server ack timeout — write queued, will sync when network recovers')), 15000));
    try {
      await Promise.race([writePromise, timeout]);
    } catch (err) {
      // If it's the timeout, the write is still queued in Firestore's offline cache
      // and will sync automatically when connection recovers. Don't fail the UI.
      if (String(err.message || '').includes('Server ack timeout')) {
        console.warn('Write queued for background sync:', err.message);
        return; // treat as success — onSnapshot already updated UI from cache
      }
      throw err;
    }
    return;
  }
  // local mode
  const item = { ...payload, id: 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8), createdAt: Date.now() };
  state.prompts = [item, ...state.prompts];
  saveLocal();
  render();
}

// ---------------- RENDER ----------------
function render() {
  // Categories
  const counts = {};
  state.prompts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  const cats = ['All', ...Object.keys(counts).sort()];
  categoryChips.innerHTML = cats.map(c => {
    const n = c === 'All' ? state.prompts.length : (counts[c] || 0);
    const active = state.category === c ? 'active' : '';
    return `<button class="chip ${active}" data-cat="${escapeAttr(c)}">${escapeHtml(c)}<span class="count">${n}</span></button>`;
  }).join('');
  $$('#categoryChips .chip').forEach(b => b.addEventListener('click', () => {
    state.category = b.dataset.cat; render();
  }));

  // Stats
  $('#stat-total').textContent = state.prompts.length;
  $('#stat-categories').textContent = Object.keys(counts).length;
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  $('#stat-today').textContent = state.prompts.filter(p => p.createdAt >= todayStart.getTime()).length;

  // Filter
  const q = state.search.trim().toLowerCase();
  let filtered = state.prompts;
  if (state.category !== 'All') filtered = filtered.filter(p => p.category === state.category);
  if (q) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      (p.author || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  emptyState.hidden = filtered.length !== 0;

  grid.innerHTML = filtered.map(p => `
    <article class="card" data-id="${escapeAttr(p.id)}">
      <div class="card-head">
        <span class="cat-chip cat-${escapeAttr(p.category)}">${escapeHtml(p.category)}</span>
        <span class="card-time">${timeAgo(p.createdAt)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(p.title)}</h3>
      <p class="card-preview">${escapeHtml(p.body)}</p>
      <div class="card-tags">${(p.tags||[]).slice(0,4).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
      <div class="card-foot">
        <span class="card-author">by <span>${escapeHtml(p.author || 'anon')}</span></span>
        <div class="card-actions">
          <button class="card-btn js-copy" data-id="${escapeAttr(p.id)}">⧉ copy</button>
          <button class="card-btn js-open" data-id="${escapeAttr(p.id)}">↗ open</button>
        </div>
      </div>
    </article>
  `).join('');

  // Card events
  $$('.card').forEach(c => c.addEventListener('click', (e) => {
    if (e.target.closest('.card-btn')) return;
    openView(c.dataset.id);
  }));
  $$('.js-copy').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const p = state.prompts.find(x => x.id === b.dataset.id);
    if (p) copyText(p.body, 'Copied to clipboard ⚡');
  }));
  $$('.js-open').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    openView(b.dataset.id);
  }));
}

// ---------------- VIEW MODAL ----------------
function openView(id) {
  const p = state.prompts.find(x => x.id === id);
  if (!p) return;
  $('#viewCat').textContent = p.category;
  $('#viewCat').className = 'cat-chip cat-' + p.category;
  $('#viewAuthor').textContent = 'by ' + (p.author || 'anon') + ' · ' + timeAgo(p.createdAt);
  $('#viewTitle').textContent = p.title;
  $('#viewTags').innerHTML = (p.tags||[]).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('');
  $('#viewBody').textContent = p.body;
  $('#viewCopy').textContent = '⧉ copy';
  $('#viewCopy').classList.remove('copied');
  $('#viewCopy').onclick = () => {
    copyText(p.body, 'Copied to clipboard ⚡');
    $('#viewCopy').textContent = '✓ copied';
    $('#viewCopy').classList.add('copied');
  };
  viewModal.hidden = false;
}
function closeView() { viewModal.hidden = true; }

// ---------------- ADD MODAL ----------------
function openModal() { modal.hidden = false; setTimeout(() => promptForm.querySelector('input[name=title]').focus(), 50); }
function closeModal() { modal.hidden = true; promptForm.reset(); }

promptForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(promptForm);
  const submitBtn = $('#submitBtn');
  submitBtn.disabled = true;
  const original = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="btn-glyph">⚡</span> deploying...';

  try {
    const payload = {
      title: String(fd.get('title')||'').trim(),
      category: String(fd.get('category')||'Other').trim(),
      author: String(fd.get('author')||'').trim() || 'anon',
      tags: String(fd.get('tags')||'').split(',').map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 8),
      body: String(fd.get('body')||'').trim(),
    };
    if (!payload.title || !payload.body || !payload.category) throw new Error('Missing required fields');
    await addPrompt(payload);
    toast(state.mode === 'firebase' ? 'Deployed to live vault ⚡' : 'Saved locally · add Firebase for global sync');
    closeModal();
  } catch (err) {
    console.error(err);
    toast('Deployment failed · ' + (err.message || 'unknown'), true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = original;
  }
});

// ---------------- UTIL ----------------
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }
function timeAgo(ts) {
  if (!ts) return 'just now';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + 's ago';
  const m = Math.floor(s/60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m/60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h/24); if (d < 7) return d + 'd ago';
  const w = Math.floor(d/7); if (w < 5) return w + 'w ago';
  return new Date(ts).toLocaleDateString();
}
function copyText(text, msg) {
  navigator.clipboard.writeText(text).then(() => toast(msg || 'Copied')).catch(() => toast('Copy failed', true));
}
let toastTimer;
function toast(msg, isError = false) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.toggle('error', !!isError);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ---------------- EVENTS ----------------
$('#heroAddBtn').addEventListener('click', openModal);
$('#addBtn').addEventListener('click', openModal);
$('#aboutAddBtn').addEventListener('click', openModal);
$('#modalClose').addEventListener('click', closeModal);
$('#cancelBtn').addEventListener('click', closeModal);
$('#viewClose').addEventListener('click', closeView);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
viewModal.addEventListener('click', (e) => { if (e.target === viewModal) closeView(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeView(); }
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault(); searchInput.focus();
  }
});

searchInput.addEventListener('input', (e) => { state.search = e.target.value; render(); });

// ---------------- UPTIME CLOCK ----------------
const bootTime = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - bootTime) / 1000);
  const hh = String(Math.floor(s/3600)).padStart(2,'0');
  const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  const up = $('#uptime'); if (up) up.textContent = `${hh}:${mm}:${ss}`;
}, 1000);

// ---------------- MATRIX RAIN (subtle) ----------------
(function matrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, cols, drops;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w / 18);
    drops = Array(cols).fill(0).map(() => Math.random() * -h);
  }
  resize();
  window.addEventListener('resize', resize);
  const glyphs = '01アイウエオカキクケコサシスセソタチツテト$#><{}[]/\\=+-*';
  function draw() {
    ctx.fillStyle = 'rgba(5,6,8,0.08)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#00ffaa';
    ctx.font = '14px JetBrains Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillText(ch, i * 18, drops[i]);
      if (drops[i] > h && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 18;
    }
  }
  setInterval(draw, 60);
})();

// ---------------- BOOT ----------------
const ok = initFirebase();
if (ok) {
  // Show seed prompts immediately so the page isn't empty while Firestore connects
  state.prompts = [...SEED_PROMPTS];
  render();
  subscribeFirestore();

  // Network-resilience watchdog: if Firestore hasn't responded in 12s,
  // surface a clear status so the user knows what's happening.
  setTimeout(() => {
    if (statusText.textContent === 'LIVE · REALTIME' && state.prompts === SEED_PROMPTS) {
      setStatus('CONNECTING… (slow network)', true);
    }
  }, 12000);
} else {
  loadLocal();
}

// Re-render time-ago strings every 30s so cards stay fresh
setInterval(() => { if (state.prompts.length) render(); }, 30000);
