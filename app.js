// app.js — Single-page app logic for Squan Resources

// ─── Routing ─────────────────────────────────────────────────────────────────

function getCurrentPath() {
    const params = new URLSearchParams(window.location.search);
    return params.get('path') || '';
}

function navigate(path) {
    const url = new URL(window.location.href);
    if (!path) {
        url.searchParams.delete('path');
    } else {
        url.searchParams.set('path', path);
    }
    window.history.pushState({ path }, '', url.toString());
    render(path);
}

// ─── Data traversal ───────────────────────────────────────────────────────────

// Case-insensitive child key lookup (excludes string/boolean metadata values)
function findKey(node, seg) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return undefined;
    // exact match, value must be object/array (not string/boolean metadata)
    if (seg in node && node[seg] !== null && typeof node[seg] === 'object') return seg;
    const lower = seg.toLowerCase();
    return Object.keys(node).find(k =>
        node[k] !== null && typeof node[k] === 'object' && k.toLowerCase() === lower
    );
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

// Children are keys whose values are objects or arrays (not string/boolean metadata)
function getNodeChildren(node) {
    return Object.keys(node).filter(k => node[k] !== null && typeof node[k] === 'object');
}

// Returns true if any ancestor (or the node itself) has gridLayout: true
function isGridLayout(path) {
    if (!path) return !!(RESOURCES.gridLayout);
    let node = RESOURCES;
    for (const seg of path.split('~')) {
        if (node.gridLayout) return true;
        const key = findKey(node, seg);
        if (key === undefined) return false;
        node = node[key];
    }
    return !!(node && node.gridLayout);
}

function countLeafResources(node) {
    if (Array.isArray(node)) return node.length;
    let count = 0;
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
    if (type === 'doc/sheet') {
        const docMatch = url.match(/(https:\/\/docs\.google\.com\/document\/d\/[^/]+)/);
        if (docMatch) return `${docMatch[1]}/pub?embedded=true`;
        const sheetMatch = url.match(/(https:\/\/docs\.google\.com\/spreadsheets\/d\/[^/]+)/);
        if (sheetMatch) return `${sheetMatch[1]}/pubhtml?embedded=true&widget=true`;
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

    if (type === 'website') {
        const imgPath = `./img/${encodeURIComponent(title)}.png`;
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

    return ''; // trainer or unknown — no visual
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
};

function typeMeta(type) {
    return TYPE_META[type] || { label: type, cls: 'type-unknown' };
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function renderBreadcrumb(path) {
    const el = document.getElementById('breadcrumb');
    const segments = getPathSegments(path);

    const parts = [`<span class="bc-item bc-link" data-path="">home</span>`];
    let node = RESOURCES;
    const builtSegs = [];
    for (const seg of segments) {
        const key = findKey(node, seg);
        if (!key) break;
        builtSegs.push(key);
        const p = builtSegs.join('~');
        parts.push(`<span class="bc-sep">›</span><span class="bc-item bc-link" data-path="${p}">${escHtml(key)}</span>`);
        node = node[key];
    }

    el.innerHTML = parts.join('');
    el.querySelectorAll('.bc-link').forEach(item => {
        item.addEventListener('click', () => navigate(item.dataset.path));
    });
}

// ─── Node page (folder view) ──────────────────────────────────────────────────

function renderNode(node, path) {
    const area = document.getElementById('content-area');
    const children = getNodeChildren(node);

    const cards = children.map(key => {
        const child = node[key];
        const label = Array.isArray(child) ? key : (child.label || key);
        const desc = Array.isArray(child) ? '' : (child.description || '');
        const childPath = path ? `${path}~${key}` : key;
        const count = countLeafResources(child);

        return `
      <div class="folder-card" data-path="${childPath}" role="button" tabindex="0">
        <div class="folder-card-body">
          <div class="folder-card-title">${escHtml(label)}</div>
          ${desc ? `<div class="folder-card-desc">${escHtml(desc)}</div>` : ''}
        </div>
        <div class="folder-card-meta">
          <span class="folder-count">${count} resource${count !== 1 ? 's' : ''}</span>
          <span class="folder-arrow">→</span>
        </div>
      </div>`;
    }).join('');

    area.innerHTML = `<div class="folder-grid">${cards}</div>`;

    area.querySelectorAll('.folder-card').forEach(card => {
        const go = () => navigate(card.dataset.path);
        card.addEventListener('click', go);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
    });
}

// ─── Resource card HTML ───────────────────────────────────────────────────────

function resourceCardHtml(resource, globalIndex, col) {
    const { label, cls } = typeMeta(resource.type);
    const featuredAttr = resource.featured ? ' data-featured="true"' : '';
    const colAttr = col ? ` data-col="${col}"` : '';
    return `
    <div class="resource-card${resource.featured ? ' resource-card--featured' : ''}" data-index="${globalIndex}" tabindex="0"${featuredAttr}${colAttr}>
        <div class="resource-card-top">
            <a class="resource-title" href="${resource.url}" target="_blank" rel="noopener">${escHtml(resource.title)}</a>
            <div class="resource-desc">${escHtml(resource.description)}</div>
        </div>
        <div class="resource-card-foot">
            ${resource.credit ? `<span class="resource-credit">${formatCredit(resource.credit)}</span>` : ''}
            <span class="type-badge ${cls}">${label}</span>
        </div>
    </div>`;
}

// ─── Leaf page ────────────────────────────────────────────────────────────────

function renderLeaf(resources, gridLayout) {
    const area = document.getElementById('content-area');

    if (gridLayout) {
        // ── Misc-style unified grid ───────────────────────────────────────────
        const cards = resources.map((r, i) => resourceCardHtml(r, i)).join('');
        area.innerHTML = `<div class="resource-grid">${cards}</div>`;
    } else {
        // ── Learn / Train interleaved flat grid ───────────────────────────────
        // Interleaving lets CSS grid equalize row heights across both columns
        const learnItems = resources.filter(r => !r.section || r.section === 'learn');
        const trainItems = resources.filter(r => r.section === 'train');
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

        area.innerHTML = `
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

function openModal(resource) {
    const backdrop = document.getElementById('modal-backdrop');
    const inner = document.getElementById('modal-inner');
    const { label, cls } = typeMeta(resource.type);
    const visualHtml = getVisualHtml(resource);
    const hasVisual = visualHtml !== '';

    inner.innerHTML = `
    <div class="modal-header">
      <a class="modal-title" href="${resource.url}" target="_blank" rel="noopener">${escHtml(resource.title)}</a>
      <span class="type-badge ${cls}">${label}</span>
    </div>
    <div class="modal-sep"></div>
    <div class="modal-body${hasVisual ? ' has-visual' : ''}">
      ${hasVisual ? `<div class="modal-visual-mobile">${visualHtml}</div>` : ''}
      <div class="modal-desc">${escHtml(resource.description)}</div>
      ${resource.credit ? `<div class="modal-credit">${formatCredit(resource.credit)}</div>` : ''}
      ${hasVisual ? `<div class="modal-visual-desktop">${visualHtml}</div>` : ''}
    </div>
    <a class="modal-visit-btn" href="${resource.url}" target="_blank" rel="noopener">Open ↗</a>`;

    backdrop.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.remove('active');
    document.body.classList.remove('modal-open');
    // Stop iframe / image loading
    document.querySelectorAll('#modal-inner iframe').forEach(f => { f.src = f.src; });
}

// ─── Root render ──────────────────────────────────────────────────────────────

function render(path) {
    const node = getNode(path);
    if (node === null) {
        navigate('');
        return;
    }

    renderBreadcrumb(path);
    document.getElementById('content-area').innerHTML = '';

    if (Array.isArray(node)) {
        renderLeaf(node, isGridLayout(path));
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
    document.getElementById('modal-backdrop').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-backdrop')) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    window.addEventListener('popstate', () => render(getCurrentPath()));
    render(getCurrentPath());
});
