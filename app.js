// app.js — Single-page app logic for Squan Resources

// ─── Routing ─────────────────────────────────────────────────────────────────

function getCurrentPath() {
    const params = new URLSearchParams(window.location.search);
    return params.get('path') || '';
}

let _historyIndex = 0;
let _historyMaxIndex = 0;

function initHistoryState() {
    const state = window.history.state;
    const baseState = state && typeof state === 'object' ? { ...state } : {};
    if (typeof baseState.squanIndex === 'number') {
        _historyIndex = baseState.squanIndex;
        _historyMaxIndex = typeof baseState.squanMaxIndex === 'number' ? baseState.squanMaxIndex : baseState.squanIndex;
    } else {
        window.history.replaceState({ ...baseState, squanIndex: 0, squanMaxIndex: 0 }, '', window.location.href);
        _historyIndex = 0;
        _historyMaxIndex = 0;
    }
}

function updateBreadcrumbNavState() {
    const backBtn = document.querySelector('.bc-nav-btn[data-nav="back"]');
    const forwardBtn = document.querySelector('.bc-nav-btn[data-nav="forward"]');
    if (!backBtn || !forwardBtn) return;

    const canBack = _historyIndex > 0;
    const canForward = _historyIndex < _historyMaxIndex;

    if (canBack) {
        backBtn.classList.remove('disabled');
        backBtn.disabled = false;
        backBtn.setAttribute('aria-disabled', 'false');
    } else {
        backBtn.classList.add('disabled');
        backBtn.disabled = true;
        backBtn.setAttribute('aria-disabled', 'true');
    }

    if (canForward) {
        forwardBtn.classList.remove('disabled');
        forwardBtn.disabled = false;
        forwardBtn.setAttribute('aria-disabled', 'false');
    } else {
        forwardBtn.classList.add('disabled');
        forwardBtn.disabled = true;
        forwardBtn.setAttribute('aria-disabled', 'true');
    }
}

function navigate(path) {
    const url = new URL(window.location.href);
    if (!path) {
        url.searchParams.delete('path');
    } else {
        url.searchParams.set('path', path);
    }

    if (path === getCurrentPath()) {
        return;
    }

    if (_historyIndex < _historyMaxIndex) {
        _historyMaxIndex = _historyIndex;
    }
    _historyMaxIndex += 1;
    _historyIndex = _historyMaxIndex;

    window.history.pushState({ squanIndex: _historyIndex, squanMaxIndex: _historyMaxIndex, path }, '', url.toString());
    render(path);
}

// ─── Data traversal ───────────────────────────────────────────────────────────

// Case-insensitive child key lookup (excludes string/boolean metadata and the reserved 'resources' key)
function findKey(node, seg) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return undefined;
    const isNav = k => k !== 'resources' && node[k] !== null && typeof node[k] === 'object';
    if (seg in node && isNav(seg)) return seg;
    const lower = seg.toLowerCase();
    return Object.keys(node).find(k => isNav(k) && k.toLowerCase() === lower);
}

function getNode(path) {
    if (!path) return RESOURCES;
    let node = RESOURCES;
    for (const seg of path.split('~')) {
        const key = findKey(node, seg);
        if (key === undefined) return null;
        node = node[key];
    }
    return node;
}

function getPathSegments(path) {
    return path ? path.split('~') : [];
}

// Children are navigable keys — objects/arrays, excluding reserved keys and metadata
function getNodeChildren(node) {
    return Object.keys(node).filter(k => k !== 'resources' && node[k] !== null && typeof node[k] === 'object');
}

// Returns true if the current node has gridLayout: true
function isGridLayout(path) {
    const node = getNode(path);
    return !!(node && node.gridLayout);
}

function countLeafResources(node) {
    if (Array.isArray(node)) return node.length;
    let count = Array.isArray(node.resources) ? node.resources.length : 0;
    for (const key of getNodeChildren(node)) {
        count += countLeafResources(node[key]);
    }
    return count;
}

// ─── Embed / visual helpers ───────────────────────────────────────────────────

// Returns an iframe embed URL for video/doc/sheet types. Null otherwise.
function getEmbedUrl(url, type) {
    if (!url) return null;
    if (type === 'video') {
        const ytStd = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
        if (ytStd) return `https://www.youtube.com/embed/${ytStd[1]}`;
        const ytShort = url.match(/youtu\.be\/([^?&\s]+)/);
        if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
        return url;
    }
    return null;
}

// Returns the HTML for the visual section of a modal (iframe or image).
// Returns empty string for trainers or types with no visual.
// All visuals start at opacity 0 (via CSS) and reveal themselves on successful load.
function getVisualHtml(resource) {
    const { type, url, title } = resource;

    if (type === 'image') {
        return `<div class="modal-visual-wrap modal-img-wrap">
      <img src="${url}" alt="${escHtml(title)}"
        onload="this.closest('.modal-visual-wrap').classList.add('visual-loaded')"
        onerror="onVisualError(this)" />
    </div>`;
    }

    if (type === 'doc/sheet' ||
        type === 'website' ||
        type === 'trainer' ||
        type === 'code' ||
        type === 'other' ||
        (!type && getNode(_currentFolderPath)?.gridLayout)
    ) {
        const parentFolder = _currentFolderPath.split('~').pop();
        const imgName = resource.path ? `${parentFolder}-${resource.path}` : encodeURIComponent(title);
        const imgPath = `./img/${imgName}.png`;
        return `<div class="modal-visual-wrap modal-img-wrap">
      <img src="${imgPath}" alt="${escHtml(title)} screenshot"
        onload="this.closest('.modal-visual-wrap').classList.add('visual-loaded')"
        onerror="onVisualError(this)" />
    </div>`;
    }

    const embedUrl = getEmbedUrl(url, type);
    if (embedUrl) {
        return `<div class="modal-visual-wrap modal-iframe-wrap">
      <iframe src="${embedUrl}" allowfullscreen loading="lazy" frameborder="0"
        onload="this.closest('.modal-visual-wrap').classList.add('visual-loaded')"></iframe>
    </div>`;
    }

    return ''; // unknown — no visual
}

// Called when an image visual fails to load — collapses the modal layout
function onVisualError(imgEl) {
    const body = imgEl.closest('.modal-body');
    if (body) {
        body.classList.remove('has-visual');
        body.querySelectorAll('.modal-visual-mobile, .modal-visual-desktop').forEach(el => el.remove());
    }
}

function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Formats a credit string: italicizes the part before the first colon.
function formatCredit(credit) {
    if (!credit) return '';
    const colon = credit.indexOf(':');
    if (colon === -1) return escHtml(credit);
    return `<em>${escHtml(credit.slice(0, colon))}</em>${escHtml(credit.slice(colon))}`;
}

// ─── Type metadata ────────────────────────────────────────────────────────────

const TYPE_META = {
    'doc/sheet': { label: 'Doc / Sheet', cls: 'type-doc-sheet' },
    'video': { label: 'Video', cls: 'type-video' },
    'trainer': { label: 'Trainer', cls: 'type-trainer' },
    'image': { label: 'Image', cls: 'type-image' },
    'website': { label: 'Website', cls: 'type-website' },
    'code': { label: 'Code', cls: 'type-website' },
    'other': { label: 'Other', cls: 'type-other' },
};

function typeMeta(type) {
    return TYPE_META[type] || { label: type || '', cls: 'type-unknown' };
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function renderBreadcrumb(path) {
    const el = document.getElementById('breadcrumb');
    const segments = getPathSegments(path);

    const parts = [
        `<div class="bc-nav-capsule">
            <button class="bc-nav-btn" type="button" data-nav="back" aria-label="Go back">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <span class="bc-nav-inner-sep" aria-hidden="true"></span>
            <button class="bc-nav-btn" type="button" data-nav="forward" aria-label="Go forward">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>`,
        `<button class="bc-search-btn" type="button" id="bc-search-btn" aria-label="Search folders and resources" title="Search (Ctrl+F)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.3-4.3"/>
            </svg>
        </button>`,
        `<span class="bc-vdiv" aria-hidden="true"></span>`,
        `<svg class="bc-folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
        `<span class="bc-item bc-link" data-path="">home</span>`
    ];
    let node = RESOURCES;
    const builtSegs = [];
    for (const seg of segments) {
        const key = findKey(node, seg);
        if (!key) break;
        builtSegs.push(key);
        const p = builtSegs.join('~');
        parts.push(`<span class="bc-sep">/</span><span class="bc-item bc-link" data-path="${p}">${escHtml(key)}</span>`);
        node = node[key];
    }

    el.innerHTML = parts.join('');
    el.querySelectorAll('.bc-link').forEach(item => {
        item.addEventListener('click', () => navigate(item.dataset.path));
    });
    el.querySelectorAll('.bc-nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            if (button.dataset.nav === 'back') window.history.back();
            else window.history.forward();
        });
    });
    const searchBtn = el.querySelector('#bc-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    updateBreadcrumbNavState();
}

// ─── Node page (folder view) ──────────────────────────────────────────────────

function renderNode(node, path) {
    const area = document.getElementById('content-area');
    const children = getNodeChildren(node);

    const cards = children.map(key => {
        const child = node[key];
        const title = child.title || key;
        const desc = child.bait || child.description || '';
        const childPath = path ? `${path}~${key}` : key;
        const count = countLeafResources(child);

        return `
      <div class="folder-card" data-path="${childPath}" role="button" tabindex="0">
        <div class="folder-card-body">
          <div class="folder-card-title">${escHtml(title)}</div>
          ${desc ? `<div class="folder-card-desc">${desc}</div>` : ''}
        </div>
        <div class="folder-card-meta">
          <span class="folder-count">${count} resource${count !== 1 ? 's' : ''}</span>
          <span class="folder-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </div>`;
    }).join('');

    area.innerHTML = `<div class="card-grid">${cards}</div>`;

    area.querySelectorAll('.folder-card').forEach(card => {
        const go = () => navigate(card.dataset.path);
        card.addEventListener('click', go);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
    });
}

// ─── Resource card HTML ───────────────────────────────────────────────────────

function resourceCardHtml(resource, globalIndex, col, hideBadge = false) {
    const { label, cls } = typeMeta(resource.type);
    const featuredAttr = resource.featured ? ' data-featured="true"' : '';
    const derivedCol = col ?? (resource.type === 'trainer' ? 'train' : 'learn');
    const colAttr = ` data-col="${derivedCol}"`;
    return `
    <div class="resource-card${resource.featured ? ' resource-card--featured' : ''}" data-index="${globalIndex}" tabindex="0"${featuredAttr}${colAttr}>
        <div class="resource-card-top">
            <a class="resource-title" href="${resource.url}" target="_blank" rel="noopener">${escHtml(resource.title)}</a>
            ${resource.credit ? `<div class="resource-credit">${formatCredit(resource.credit)}</div>` : ''}
            <div class="resource-desc">${resource.description || ''}</div>
        </div>
        ${hideBadge || !resource.type ? '' : `<div class="resource-card-foot">
            <span class="type-badge ${cls}">${label}</span>
        </div>`}
    </div>`;
}

// ─── Leaf page ────────────────────────────────────────────────────────────────

function renderLeaf(resources, gridLayout, folderPath, node, append = false) {
    _currentResources = resources; // store for resource path auto-open
    _currentFolderPath = folderPath ?? '';
    const area = document.getElementById('content-area');
    const descHtml = (!append && node && node.description)
        ? `<div class="leaf-description">${node.description}</div>` : '';

    if (gridLayout) {
        // ── Misc-style unified grid ───────────────────────────────────────────
        const cards = resources.map((r, i) => resourceCardHtml(r, i, undefined, false)).join('');
        if (append) {
            const grid = area.querySelector('.card-grid');
            if (grid) {
                grid.insertAdjacentHTML('beforeend', cards);
            } else {
                area.insertAdjacentHTML('beforeend', `<div class="card-grid">${cards}</div>`);
            }
        } else {
            const html = descHtml + `<div class="card-grid">${cards}</div>`;
            area.innerHTML = html;
        }
    } else {
        // ── Learn / Train interleaved flat grid ───────────────────────────────
        // Interleaving lets CSS grid equalize row heights across both columns
        const learnItems = resources.filter(r => r.type !== 'trainer');
        const trainItems = resources.filter(r => r.type === 'trainer');
        const rows = Math.max(learnItems.length, trainItems.length);

        let interleaved = '';
        for (let i = 0; i < rows; i++) {
            if (learnItems[i]) {
                interleaved += resourceCardHtml(learnItems[i], resources.indexOf(learnItems[i]), 'learn');
            } else {
                interleaved += `<div class="resource-card-placeholder" data-col="learn"></div>`;
            }
            if (trainItems[i]) {
                interleaved += resourceCardHtml(trainItems[i], resources.indexOf(trainItems[i]), 'train');
            } else {
                interleaved += `<div class="resource-card-placeholder" data-col="train"></div>`;
            }
        }

        const learnHeadCls = learnItems.length ? 'col-learn' : 'col-empty';
        const trainHeadCls = trainItems.length ? 'col-train' : 'col-empty';

        area.innerHTML = descHtml + `
      <div class="mobile-tab-bar">
        <button class="mobile-tab" id="tab-learn">Learn</button>
        <button class="mobile-tab" id="tab-train">Train</button>
      </div>
      <div class="resource-flat-grid" id="resource-flat-grid">
        <h2 class="col-heading ${learnHeadCls}" data-col="learn">Learn</h2>
        <h2 class="col-heading ${trainHeadCls}" data-col="train">Train</h2>
        ${interleaved}
      </div>`;

        const grid = area.querySelector('#resource-flat-grid');
        const tabLearn = area.querySelector('#tab-learn');
        const tabTrain = area.querySelector('#tab-train');

        function activateTab(which) {
            grid.dataset.active = which;
            tabLearn.className = 'mobile-tab' + (which === 'learn' ? ' active-learn' : '');
            tabTrain.className = 'mobile-tab' + (which === 'train' ? ' active-train' : '');
        }

        tabLearn.addEventListener('click', () => activateTab('learn'));
        tabTrain.addEventListener('click', () => activateTab('train'));
        activateTab('learn');
    }

    // Card click → modal
    area.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.resource-title')) return;
            const idx = parseInt(card.dataset.index, 10);
            openModal(resources[idx]);
        });
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const idx = parseInt(card.dataset.index, 10);
                openModal(resources[idx]);
            }
        });
    });
}

// ─── Modal ────────────────────────────────────────────────────────────────────

// Tracks the resources array currently displayed, for auto-opening by resource path segment
let _currentResources = [];
let _currentFolderPath = '';
let _modalOpen = false;
let _modalHistoryPushed = false;
let _ignoreNextPopstate = false;

// Builds a ?path= URL with literal ~ instead of %7E
function buildUrl(folderPath, resourcePath) {
    const fullPath = resourcePath ? `${folderPath}~${resourcePath}` : folderPath;
    const url = new URL(window.location.href);
    if (fullPath) {
        url.searchParams.set('path', fullPath);
    } else {
        url.searchParams.delete('path');
    }
    return url.toString().replace(/%7E/g, '~');
}

function openModal(resource, updateUrl = true) {
    const backdrop = document.getElementById('modal-backdrop');
    const inner = document.getElementById('modal-inner');
    const { label, cls } = typeMeta(resource.type);
    const visualHtml = getVisualHtml(resource);
    const hasVisual = visualHtml !== '';

    // Append resource path as ~segment to ?path= for shareability
    if (resource.path && updateUrl) {
        const url = buildUrl(_currentFolderPath, resource.path);
        window.history.pushState({ squan: 'modal', squanIndex: _historyIndex, squanMaxIndex: _historyMaxIndex }, '', url);
        _modalHistoryPushed = true;
    }

    _modalOpen = true;
    inner.innerHTML = `
    <div class="modal-header">
      <a class="modal-title" href="${resource.url}" target="_blank" rel="noopener">${escHtml(resource.title)}</a>
      ${resource.type ? `<span class="type-badge ${cls}">${label}</span>` : ''}
    </div>
    ${resource.credit ? `<div class="modal-credit">${formatCredit(resource.credit)}</div>` : ''}
    <div class="modal-sep"></div>
    <div class="modal-body${hasVisual ? ' has-visual' : ''}">
      ${hasVisual ? `<div class="modal-visual-mobile">${visualHtml}</div>` : ''}
      <div class="modal-desc">${resource.description || ''}</div>
      ${hasVisual ? `<div class="modal-visual-desktop">${visualHtml}</div>` : ''}
    </div>
    <div class="modal-actions">
      <a class="modal-visit-btn" href="${resource.url}" target="_blank" rel="noopener">Open ↗</a>
            <button class="modal-copy-btn" id="modal-copy-btn" title="Copy the link of this resource">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="9" height="11" rx="2"/>
                    <rect x="3" y="5" width="9" height="11" rx="2"/>
                </svg>
                <span id="copy-label">Copy Link</span>
            </button>
            ${resource.path ? `<button class="modal-share-btn" id="modal-share-btn" title="Copy link to this page in the website">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <path d="M16 6l-4-4-4 4"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <span id="share-label">Share</span>
            </button>` : ''}
    </div>`;

    const copyBtn = inner.querySelector('#modal-copy-btn');
    const shareBtn = inner.querySelector('#modal-share-btn');

    // Shared flash duration (ms)
    const FLASH_DURATION = 2000;

    const copyLabel = copyBtn ? copyBtn.querySelector('#copy-label') : null;
    const defaultCopy = copyLabel ? copyLabel.textContent : 'Copy Link';
    const shareLabel = shareBtn ? shareBtn.querySelector('#share-label') : null;
    const defaultShare = shareLabel ? shareLabel.textContent : 'Share';

    function clearAllFlashes() {
        [copyBtn, shareBtn].forEach(b => {
            if (!b) return;
            b.classList.remove('copied-flash');
            const lbl = b.querySelector('#copy-label') || b.querySelector('#share-label');
            if (lbl) {
                lbl.textContent = b === copyBtn ? defaultCopy : defaultShare;
            }
        });
    }

    function doCopy(text, btn, labelEl, defaultText) {
        if (!btn || !labelEl) return;

        // Stop other flashes immediately so they don't overlap
        clearAllFlashes();

        const reset = () => setTimeout(() => {
            labelEl.textContent = defaultText;
            btn.classList.remove('copied-flash');
        }, FLASH_DURATION);

        const succeed = () => {
            labelEl.textContent = 'Copied!';
            btn.classList.add('copied-flash');
            // blur to remove persistent focus (helps mobile/devtools behavior)
            try { btn.blur(); } catch (e) { /* ignore */ }
            reset();
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(succeed).catch(() => {
                // fallback
                const tmp = document.createElement('input');
                tmp.value = text;
                document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand('copy'); succeed(); } catch (e) { /* no-op */ }
                document.body.removeChild(tmp);
            });
        } else {
            const tmp = document.createElement('input');
            tmp.value = text;
            document.body.appendChild(tmp);
            tmp.select();
            try { document.execCommand('copy'); succeed(); } catch (e) { /* no-op */ }
            document.body.removeChild(tmp);
        }
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => doCopy(resource.url || '', copyBtn, copyLabel, defaultCopy));
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => doCopy(window.location.href, shareBtn, shareLabel, defaultShare));
    }

    backdrop.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal({ ignoreHistory = false } = {}) {
    if (!_modalOpen) return;
    document.getElementById('modal-backdrop').classList.remove('active');
    document.body.classList.remove('modal-open');
    _modalOpen = false;

    // Stop iframe / image loading
    document.querySelectorAll('#modal-inner iframe').forEach(f => { f.src = f.src; });

    if (_modalHistoryPushed && !ignoreHistory) {
        _modalHistoryPushed = false;
        _ignoreNextPopstate = true;
        window.history.back();
        return;
    }

    if (!ignoreHistory) {
        window.history.replaceState({}, '', buildUrl(_currentFolderPath, ''));
    }
}

// ─── Search ───────────────────────────────────────────────────────────────────

let _searchIndex = null;
let _searchActiveIndex = -1;

// Walks the resource tree once, flattening every folder and resource into a
// searchable list. Folders carry their nav path; resources carry their parent
// folder path so they can be navigated to and opened.
function buildSearchIndex() {
    const index = [];

    function walk(node, path) {
        for (const key of getNodeChildren(node)) {
            const child = node[key];
            const childPath = path ? `${path}~${key}` : key;
            index.push({
                kind: 'folder',
                title: child.title || key,
                desc: child.bait || child.description || '',
                path: childPath,
            });
            walk(child, childPath);
        }
        if (Array.isArray(node.resources)) {
            for (const r of node.resources) {
                index.push({
                    kind: 'resource',
                    title: r.title || '',
                    desc: [r.description, r.credit].filter(Boolean).join(' '),
                    folderPath: path,
                    resource: r,
                });
            }
        }
    }

    walk(RESOURCES, '');
    return index;
}

// Strips HTML tags so descriptions (which may contain markup) match on text.
function stripTags(str) {
    return String(str).replace(/<[^>]*>/g, ' ');
}

// Scores an entry against a lowercased query. Returns -1 for no match.
// Folders get a large base bonus so any matching folder outranks resources.
function scoreEntry(entry, q) {
    const title = entry.title.toLowerCase();
    const desc = stripTags(entry.desc).toLowerCase();
    let score = -1;

    if (title.includes(q)) {
        score = title === q ? 100 : (title.startsWith(q) ? 70 : 45);
    } else if (desc.includes(q)) {
        score = 15;
    }
    if (score < 0) return -1;
    if (entry.kind === 'folder') score += 1000;
    return score;
}

function runSearch(query) {
    const resultsEl = document.getElementById('search-results');
    const q = query.trim().toLowerCase();
    _searchActiveIndex = -1;

    if (!q) {
        resultsEl.innerHTML = `<div class="search-empty">Type to search all folders and resources.</div>`;
        resultsEl.dataset.count = '0';
        return;
    }

    const matches = _searchIndex
        .map(entry => ({ entry, score: scoreEntry(entry, q) }))
        .filter(m => m.score >= 0)
        .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
        .slice(0, 30);

    if (!matches.length) {
        resultsEl.innerHTML = `<div class="search-empty">No results for “${escHtml(query.trim())}”.</div>`;
        resultsEl.dataset.count = '0';
        return;
    }

    const folderIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
    const fileIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`;

    resultsEl.innerHTML = matches.map((m, i) => {
        const e = m.entry;
        const isFolder = e.kind === 'folder';
        const descText = stripTags(e.desc).trim();
        return `<button class="search-result${isFolder ? ' is-folder' : ''}" type="button" data-i="${i}" role="option">
            <span class="search-result-icon">${isFolder ? folderIcon : fileIcon}</span>
            <span class="search-result-text">
                <span class="search-result-title">${escHtml(e.title)}${isFolder ? '<span class="search-result-tag">folder</span>' : ''}</span>
                ${descText ? `<span class="search-result-crumb">${escHtml(descText.slice(0, 90))}</span>` : ''}
            </span>
        </button>`;
    }).join('');
    resultsEl.dataset.count = String(matches.length);

    resultsEl.querySelectorAll('.search-result').forEach(btn => {
        btn.addEventListener('click', () => selectSearchResult(matches[parseInt(btn.dataset.i, 10)].entry));
    });
}

function selectSearchResult(entry) {
    closeSearch();
    if (entry.kind === 'folder') {
        navigate(entry.path);
    } else {
        // Navigate to the parent folder so _currentFolderPath / resources are set,
        // then open the resource modal.
        navigate(entry.folderPath);
        openModal(entry.resource);
    }
}

function openSearch() {
    if (!_searchIndex) _searchIndex = buildSearchIndex();
    const backdrop = document.getElementById('search-backdrop');
    const input = document.getElementById('search-input');
    backdrop.classList.add('active');
    document.body.classList.add('modal-open');
    input.value = '';
    runSearch('');
    setTimeout(() => input.focus(), 30);
}

function closeSearch() {
    const backdrop = document.getElementById('search-backdrop');
    if (!backdrop.classList.contains('active')) return;
    backdrop.classList.remove('active');
    if (!_modalOpen) document.body.classList.remove('modal-open');
}

function isSearchOpen() {
    return document.getElementById('search-backdrop').classList.contains('active');
}

// Keyboard navigation within the results list (arrow keys + Enter).
function moveSearchActive(delta) {
    const resultsEl = document.getElementById('search-results');
    const items = resultsEl.querySelectorAll('.search-result');
    if (!items.length) return;
    _searchActiveIndex = (_searchActiveIndex + delta + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('active', i === _searchActiveIndex));
    items[_searchActiveIndex].scrollIntoView({ block: 'nearest' });
}

// ─── Root render ──────────────────────────────────────────────────────────────

function render(path) {
    let node = getNode(path);
    let autoOpenResource = null;

    // If path resolves to null, check if last segment is a resource path
    if (node === null && path.includes('~')) {
        const lastTilde = path.lastIndexOf('~');
        const parentPath = path.slice(0, lastTilde);
        const lastSeg = path.slice(lastTilde + 1);
        const parentNode = getNode(parentPath);
        if (parentNode && Array.isArray(parentNode.resources)) {
            const match = parentNode.resources.find(r => r.path === lastSeg);
            if (match) {
                node = parentNode;
                autoOpenResource = match;
                path = parentPath;
            }
        }
    }

    if (node === null) {
        navigate('');
        return;
    }

    renderBreadcrumb(path);
    document.getElementById('content-area').innerHTML = '';

    if (isGridLayout(path) && Array.isArray(node.resources) && getNodeChildren(node).length > 0) {
        renderNode(node, path);
        renderLeaf(node.resources, true, path, node, true);
        if (autoOpenResource) openModal(autoOpenResource, false);
    } else if (Array.isArray(node.resources)) {
        renderLeaf(node.resources, isGridLayout(path), path, node);
        if (autoOpenResource) openModal(autoOpenResource, false);
    } else {
        renderNode(node, path);
    }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main-title').addEventListener('click', () => navigate(''));
    document.getElementById('main-title').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') navigate('');
    });

    document.getElementById('modal-close').addEventListener('click', closeModal);

    const feedbackBtn = document.getElementById('feedback-btn');
    const feedbackBackdrop = document.getElementById('feedback-backdrop');
    const feedbackClose = document.getElementById('feedback-close');
    function openFeedback() { feedbackBackdrop.classList.add('active'); }
    function closeFeedback() { feedbackBackdrop.classList.remove('active'); }
    feedbackBtn.addEventListener('click', openFeedback);
    feedbackClose.addEventListener('click', closeFeedback);
    feedbackBackdrop.addEventListener('click', e => { if (e.target === feedbackBackdrop) closeFeedback(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFeedback(); });
    document.getElementById('modal-backdrop').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-backdrop')) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ── Search wiring ──────────────────────────────────────────────────────────
    const searchBackdrop = document.getElementById('search-backdrop');
    const searchInput = document.getElementById('search-input');
    document.getElementById('search-close').addEventListener('click', closeSearch);
    searchBackdrop.addEventListener('click', e => { if (e.target === searchBackdrop) closeSearch(); });
    searchInput.addEventListener('input', () => runSearch(searchInput.value));
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchActive(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearchActive(-1); }
        else if (e.key === 'Enter') {
            const items = document.querySelectorAll('#search-results .search-result');
            const target = items[_searchActiveIndex] || items[0];
            if (target) target.click();
        }
    });
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
            e.preventDefault();
            if (isSearchOpen()) closeSearch(); else openSearch();
        } else if (e.key === 'Escape' && isSearchOpen()) {
            closeSearch();
        }
    });

    window.addEventListener('popstate', event => {
        if (_ignoreNextPopstate) {
            _ignoreNextPopstate = false;
            return;
        }

        if (_modalOpen) {
            closeModal({ ignoreHistory: true });
            return;
        }

        const state = event.state;
        if (state && typeof state.squanIndex === 'number') {
            _historyIndex = state.squanIndex;
            if (typeof state.squanMaxIndex === 'number') {
                _historyMaxIndex = Math.max(_historyMaxIndex, state.squanMaxIndex);
            }
        }

        render(getCurrentPath());
    });

    initHistoryState();
    render(getCurrentPath());

    const mobileTab = document.getElementById('mobile-page-tab');
    if (mobileTab) {
        new IntersectionObserver(
            ([entry]) => mobileTab.classList.toggle('visible', entry.isIntersecting),
            { threshold: 1.0 }
        ).observe(mobileTab);
    }
});
