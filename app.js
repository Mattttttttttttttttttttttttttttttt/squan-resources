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

// Get child folders/keys from a node object (exclude _ metadata keys)
function getNodeChildren(node) {
    return Object.keys(node).filter(k => !k.startsWith('_'));
}

// ─── Embed URL helpers ────────────────────────────────────────────────────────

function getEmbedUrl(url, type) {
    if (!url) return null;

    if (type === 'video') {
        // YouTube
        const ytStd = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
        if (ytStd) return `https://www.youtube.com/embed/${ytStd[1]}`;
        const ytShort = url.match(/youtu\.be\/([^?&\s]+)/);
        if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
        // Return as-is for other video URLs
        return url;
    }

    if (type === 'doc/sheet') {
        // Google Docs: convert /edit or /view to /pub?embedded=true
        const docMatch = url.match(/(https:\/\/docs\.google\.com\/document\/d\/[^/]+)/);
        if (docMatch) return `${docMatch[1]}/pub?embedded=true`;
        // Google Sheets: convert /edit to /pubhtml?embedded=true
        const sheetMatch = url.match(/(https:\/\/docs\.google\.com\/spreadsheets\/d\/[^/]+)/);
        if (sheetMatch) return `${sheetMatch[1]}/pubhtml?embedded=true&widget=true`;
        // Already a publish URL — use as is
        return url;
    }

    return null; // trainers don't get iframed
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function renderBreadcrumb(path) {
    const el = document.getElementById('breadcrumb');
    const segments = getPathSegments(path);

    if (segments.length === 0) {
        el.innerHTML = '<span class="bc-item bc-link" data-path="/">home</span>';
        return;
    }

    const parts = [
        `<span class="bc-item bc-link" data-path="/">home</span>`
    ];

    let built = '';
    for (const seg of segments) {
        built += '/' + seg;
        const p = built;
        parts.push(`<span class="bc-sep">›</span><span class="bc-item bc-link" data-path="${p}">${seg}</span>`);
    }

    el.innerHTML = parts.join('');

    el.querySelectorAll('.bc-link').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.path));
    });
}

// ─── Node page (folder view) ──────────────────────────────────────────────────

function renderNode(node, path) {
    const area = document.getElementById('content-area');
    const children = getNodeChildren(node);

    const cards = children.map(key => {
        const child = node[key];
        const label = Array.isArray(child) ? key : (child._label || key);
        const desc = Array.isArray(child) ? `${child.length} resource${child.length !== 1 ? 's' : ''}` : (child._description || '');
        const isLeaf = Array.isArray(child);
        const childPath = path === '/' ? `/${key}` : `${path}/${key}`;
        const count = isLeaf ? child.length : countLeafResources(child);

        return `
      <div class="folder-card" data-path="${childPath}" role="button" tabindex="0">
        <div class="folder-card-body">
          <div class="folder-card-title">${label}</div>
          <div class="folder-card-desc">${desc}</div>
        </div>
        <div class="folder-card-meta">
          <span class="folder-count">${count} resource${count !== 1 ? 's' : ''}</span>
          <span class="folder-arrow">→</span>
        </div>
      </div>
    `;
    }).join('');

    area.innerHTML = `<div class="folder-grid">${cards}</div>`;

    area.querySelectorAll('.folder-card').forEach(card => {
        const handler = () => navigate(card.dataset.path);
        card.addEventListener('click', handler);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
    });
}

function countLeafResources(node) {
    if (Array.isArray(node)) return node.length;
    let count = 0;
    for (const key of Object.keys(node)) {
        if (!key.startsWith('_')) count += countLeafResources(node[key]);
    }
    return count;
}

// ─── Leaf page (resource view) ────────────────────────────────────────────────

const TYPE_LABELS = {
    'doc/sheet': 'Doc / Sheet',
    'video': 'Video',
    'trainer': 'Trainer'
};

function resourceCard(resource, index) {
    const typeClass = resource.type.replace('/', '-');
    const typeLabel = TYPE_LABELS[resource.type] || resource.type;

    return `
    <div class="resource-card" data-index="${index}" tabindex="0">
      <div class="resource-card-top">
        <a class="resource-title" href="${resource.url}" target="_blank" rel="noopener">${resource.title}</a>
        <div class="resource-desc">${resource.description}</div>
      </div>
      <div class="resource-card-foot">
        <span class="type-badge type-${typeClass}">${typeLabel}</span>
      </div>
    </div>
  `;
}

function renderLeaf(resources) {
    const area = document.getElementById('content-area');
    const learnItems = resources.filter(r => r.section === 'learn');
    const trainItems = resources.filter(r => r.section === 'train');
    // Items without a section default to learn
    const noSection = resources.filter(r => !r.section);
    const allLearn = [...learnItems, ...noSection];

    area.innerHTML = `
    <div class="resource-split">
      <div class="resource-col">
        <h2 class="col-heading">Learn</h2>
        <div class="resource-list" id="learn-list">
          ${allLearn.length ? allLearn.map((r, i) => resourceCard(r, resources.indexOf(r))).join('') : '<p class="empty-col">No resources yet.</p>'}
        </div>
      </div>
      <div class="resource-col">
        <h2 class="col-heading">Train</h2>
        <div class="resource-list" id="train-list">
          ${trainItems.length ? trainItems.map((r, i) => resourceCard(r, resources.indexOf(r))).join('') : '<p class="empty-col">No resources yet.</p>'}
        </div>
      </div>
    </div>
  `;

    // Attach click handlers — card click (not title) opens modal
    area.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.resource-title')) return; // let link through
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
    const typeClass = resource.type.replace('/', '-');
    const typeLabel = TYPE_LABELS[resource.type] || resource.type;
    const embedUrl = getEmbedUrl(resource.url, resource.type);
    const hasEmbed = !!embedUrl;

    const iframeHtml = hasEmbed
        ? `<div class="modal-iframe-wrap">
        <iframe src="${embedUrl}" allowfullscreen loading="lazy" frameborder="0"></iframe>
       </div>`
        : '';

    inner.innerHTML = `
    <div class="modal-header">
      <a class="modal-title" href="${resource.url}" target="_blank" rel="noopener">${resource.title}</a>
      <span class="type-badge type-${typeClass}">${typeLabel}</span>
    </div>
    <div class="modal-sep"></div>
    <div class="modal-body ${hasEmbed ? 'has-embed' : ''}">
      ${hasEmbed ? `<div class="modal-iframe-mobile">${iframeHtml}</div>` : ''}
      <div class="modal-desc">${resource.description}</div>
      ${hasEmbed ? `<div class="modal-iframe-desktop">${iframeHtml}</div>` : ''}
    </div>
    <a class="modal-visit-btn" href="${resource.url}" target="_blank" rel="noopener">
      Open ↗
    </a>
  `;

    backdrop.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
    // Clear iframe to stop playback
    const iframes = backdrop.querySelectorAll('iframe');
    iframes.forEach(f => { f.src = f.src; });
}

// ─── Not found ────────────────────────────────────────────────────────────────

function renderNotFound() {
    const area = document.getElementById('content-area');
    area.innerHTML = `<div class="not-found"><p>This path doesn't exist.</p><button onclick="navigate('/')">Go home</button></div>`;
}

// ─── Root render ──────────────────────────────────────────────────────────────

function render(path) {
    const node = getNode(path);
    renderBreadcrumb(path);

    const area = document.getElementById('content-area');
    area.innerHTML = '';

    if (node === null) {
        renderNotFound();
    } else if (Array.isArray(node)) {
        renderLeaf(node);
    } else {
        renderNode(node, path);
    }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Title click → home
    document.getElementById('main-title').addEventListener('click', () => navigate('/'));

    // Modal close button
    document.getElementById('modal-close').addEventListener('click', closeModal);

    // Click backdrop to close
    document.getElementById('modal-backdrop').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-backdrop')) closeModal();
    });

    // Escape to close
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => render(getCurrentPath()));

    // Initial render
    render(getCurrentPath());
});
