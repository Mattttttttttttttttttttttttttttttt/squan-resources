// app.js — Single-page app logic for Squan Resources

// ─── Routing ─────────────────────────────────────────────────────────────────

function getCurrentPath() {
    const params = new URLSearchParams(window.location.search);
    return params.get('path') || '/';
}

function navigate(path) {
    const url = new URL(window.location.href);
    if (!path || path === '/') {
        url.searchParams.delete('path');
    } else {
        url.searchParams.set('path', path);
    }
    window.history.pushState({ path }, '', url.toString());
    render(path);
}

// ─── Data traversal ───────────────────────────────────────────────────────────

function getNode(path) {
    const segments = path.split('/').filter(Boolean);
    let node = RESOURCES;
    for (const seg of segments) {
        if (node && typeof node === 'object' && !Array.isArray(node) && seg in node) {
            node = node[seg];
        } else {
            return null;
        }
    }
    return node;
}

function getPathSegments(path) {
    return path.split('/').filter(Boolean);
}

function getNodeChildren(node) {
    return Object.keys(node).filter(k => !k.startsWith('_'));
}

// Returns true if any ancestor node along this path has _gridLayout: true.
// Also true if the leaf array itself has a _gridLayout property set.
function isGridLayout(path) {
    const segments = path.split('/').filter(Boolean);
    let node = RESOURCES;
    for (const seg of segments) {
        if (node.gridLayout) return true;
        if (node && typeof node === 'object' && !Array.isArray(node) && seg in node) {
            node = node[seg];
        }
    }
    // Check the final node too (in case it's the leaf or a node itself)
    return !!(node && node.gridLayout);
}

function countLeafResources(node) {
    if (Array.isArray(node)) return node.length;
    let count = 0;
    for (const key of Object.keys(node)) {
        if (!key.startsWith('_')) count += countLeafResources(node[key]);
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
function getVisualHtml(resource) {
    const { type, url, title } = resource;

    if (type === 'image') {
        // The url IS the image
        return `<div class="modal-visual-wrap modal-img-wrap">
      <img src="${url}" alt="${escHtml(title)}" onerror="this.parentElement.classList.add('visual-hidden')" />
    </div>`;
    }

    if (type === 'website') {
        // Screenshot lives at ./img/{title}.png
        const imgPath = `./img/${encodeURIComponent(title)}.png`;
        return `<div class="modal-visual-wrap modal-img-wrap">
      <img src="${imgPath}" alt="${escHtml(title)} screenshot" onerror="this.parentElement.classList.add('visual-hidden')" />
    </div>`;
    }

    const embedUrl = getEmbedUrl(url, type);
    if (embedUrl) {
        return `<div class="modal-visual-wrap modal-iframe-wrap">
      <iframe src="${embedUrl}" allowfullscreen loading="lazy" frameborder="0"></iframe>
    </div>`;
    }

    return ''; // trainer or unknown — no visual
}

function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

    const parts = [`<span class="bc-item bc-link" data-path="/">home</span>`];
    let built = '';
    for (const seg of segments) {
        built += '/' + seg;
        const p = built;
        parts.push(`<span class="bc-sep">›</span><span class="bc-item bc-link" data-path="${p}">${escHtml(seg)}</span>`);
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
        const childPath = path === '/' ? `/${key}` : `${path}/${key}`;
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

function resourceCardHtml(resource, globalIndex) {
    const { label, cls } = typeMeta(resource.type);
    const featuredAttr = resource.featured ? ' data-featured="true"' : '';
    return `
    <div class="resource-card${resource.featured ? ' resource-card--featured' : ''}" data-index="${globalIndex}" tabindex="0"${featuredAttr}>
        <div class="resource-card-top">
            <a class="resource-title" href="${resource.url}" target="_blank" rel="noopener">${escHtml(resource.title)}</a>
            <div class="resource-desc">${escHtml(resource.description)}</div>
        </div>
        <div class="resource-card-foot">
            <span class="type-badge ${cls}">${label}</span>
        </div>
    </div>`;
}

// ─── Leaf page ────────────────────────────────────────────────────────────────

// Detects whether we're in a mobile viewport (matches the CSS breakpoint).
function isMobile() {
    return window.matchMedia('(max-width: 700px)').matches;
}

function renderLeaf(resources, gridLayout) {
    const area = document.getElementById('content-area');

    if (gridLayout) {
        // ── Misc-style unified grid ───────────────────────────────────────────
        const cards = resources.map((r, i) => resourceCardHtml(r, i)).join('');
        area.innerHTML = `<div class="resource-grid">${cards}</div>`;
    } else {
        // ── Learn / Train split ───────────────────────────────────────────────
        const learnItems = resources.filter(r => !r.section || r.section === 'learn');
        const trainItems = resources.filter(r => r.section === 'train');

        area.innerHTML = `
      <!-- Tab bar: only visible on mobile via CSS -->
      <div class="mobile-tab-bar">
        <button class="mobile-tab active-learn" id="tab-learn">Learn</button>
        <button class="mobile-tab" id="tab-train">Train</button>
      </div>
      <div class="resource-split">
        <div class="resource-col tab-active" id="col-learn">
          <h2 class="col-heading ${learnItems.length ? 'col-learn' : 'col-empty'}">Learn</h2>
          <div class="resource-list">
            ${learnItems.length
                ? learnItems.map(r => resourceCardHtml(r, resources.indexOf(r))).join('')
                : '<p class="empty-col">No resources yet.</p>'}
          </div>
        </div>
        <div class="split-divider"></div>
        <div class="resource-col tab-active" id="col-train">
          <h2 class="col-heading ${trainItems.length ? 'col-train' : 'col-empty'}">Train</h2>
          <div class="resource-list">
            ${trainItems.length
                ? trainItems.map(r => resourceCardHtml(r, resources.indexOf(r))).join('')
                : '<p class="empty-col">No resources yet.</p>'}
          </div>
        </div>
      </div>`;

        // Wire up mobile tabs
        const tabLearn = area.querySelector('#tab-learn');
        const tabTrain = area.querySelector('#tab-train');
        const colLearn = area.querySelector('#col-learn');
        const colTrain = area.querySelector('#col-train');

        function activateTab(which) {
            // Tab button styles
            tabLearn.className = 'mobile-tab' + (which === 'learn' ? ' active-learn' : '');
            tabTrain.className = 'mobile-tab' + (which === 'train' ? ' active-train' : '');
            // Column visibility (CSS controls whether .tab-active matters via media query)
            colLearn.classList.toggle('tab-active', which === 'learn');
            colTrain.classList.toggle('tab-active', which === 'train');
        }

        tabLearn.addEventListener('click', () => activateTab('learn'));
        tabTrain.addEventListener('click', () => activateTab('train'));

        // Default: learn active
        activateTab('learn');
    }

    // Attach click handlers
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

// ─── Not found ────────────────────────────────────────────────────────────────

function renderNotFound() {
    document.getElementById('content-area').innerHTML =
        `<div class="not-found"><p>This path doesn't exist.</p><button onclick="navigate('/')">Go home</button></div>`;
}

// ─── Root render ──────────────────────────────────────────────────────────────

function render(path) {
    const node = getNode(path);
    renderBreadcrumb(path);
    document.getElementById('content-area').innerHTML = '';

    if (node === null) {
        renderNotFound();
    } else if (Array.isArray(node)) {
        renderLeaf(node, isGridLayout(path));
    } else {
        renderNode(node, path);
    }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main-title').addEventListener('click', () => navigate('/'));
    document.getElementById('main-title').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') navigate('/');
    });

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-backdrop')) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    window.addEventListener('popstate', () => render(getCurrentPath()));
    render(getCurrentPath());
});
