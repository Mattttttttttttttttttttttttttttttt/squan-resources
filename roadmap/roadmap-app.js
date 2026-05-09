// roadmap-app.js

// ─── Resources lookup helpers ─────────────────────────────────────────────────
// Lightweight re-implementation so we can look up featured resources
// without depending on the full app.js being loaded.

function _findKey(node, seg) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return undefined;
    if (seg in node && node[seg] !== null && typeof node[seg] === 'object') return seg;
    const lower = seg.toLowerCase();
    return Object.keys(node).find(k =>
        node[k] !== null && typeof node[k] === 'object' && k.toLowerCase() === lower
    );
}

function _getNode(path) {
    if (!path) return RESOURCES;
    let node = RESOURCES;
    for (const seg of path.split('~')) {
        const key = _findKey(node, seg);
        if (key === undefined) return null;
        node = node[key];
    }
    return node;
}

// Recursively collect all items with featured: true from a node or leaf array
function _collectFeatured(node) {
    if (Array.isArray(node)) return node.filter(r => r.featured);
    const results = [];
    for (const key of Object.keys(node)) {
        const val = node[key];
        if (val !== null && typeof val === 'object') {
            results.push(..._collectFeatured(val));
        }
    }
    return results;
}

// Extract path from a step URL like "../?path=VDB~EP"
function _parseStepPath(url) {
    try {
        const u = new URL(url, window.location.href);
        return u.searchParams.get('path') || '';
    } catch {
        return '';
    }
}

// Returns { learn: resource|null, train: resource|null } for featured resources
function getFeaturedForStep(stepUrl) {
    const path = _parseStepPath(stepUrl);
    if (!path) return { learn: null, train: null };
    const node = _getNode(path);
    if (!node) return { learn: null, train: null };
    const all = _collectFeatured(node);
    return {
        learn: all.find(r => !r.section || r.section === 'learn') || null,
        train: all.find(r => r.section === 'train') || null,
    };
}

// ─── Tab state ────────────────────────────────────────────────────────────────

let activeTab = null;

// Try to find a tab matching URL ?from= param (path segments ~-split)
function detectTabFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from') || '';
    if (!from) return null;
    const segs = from.split('~').map(s => s.toLowerCase());
    const tabKeys = Object.keys(ROADMAP);
    return tabKeys.find(t => segs.includes(t.toLowerCase())) || null;
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const TYPE_META = {
    'doc/sheet': { label: 'Doc / Sheet', cls: 'type-doc-sheet' },
    'video':     { label: 'Video',       cls: 'type-video'     },
    'trainer':   { label: 'Trainer',     cls: 'type-trainer'   },
    'image':     { label: 'Image',       cls: 'type-image'     },
    'website':   { label: 'Website',     cls: 'type-website'   },
};

function renderFeaturedCard(featured) {
    const { learn, train } = featured;
    const hasAny = learn || train;
    if (!hasAny) return '';

    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const emptyNote = isMobile
        ? 'Double-tap the step to see the full resource list.'
        : 'Click the step card to see the full resource list.';

    function resRow(resource, section) {
        if (!resource) {
            return `<div class="fp-empty-section">
                <span class="fp-section-label fp-empty">${section === 'learn' ? 'Learn' : 'Train'}</span>
                <span class="fp-empty-note">${emptyNote}</span>
            </div>`;
        }
        const meta = TYPE_META[resource.type] || { label: resource.type, cls: 'type-unknown' };
        return `<div class="fp-resource-row">
            <span class="fp-section-label fp-${section}">${section === 'learn' ? 'Learn' : 'Train'}</span>
            <a class="fp-resource-link" href="${escHtml(resource.url)}" target="_blank" rel="noopener">
                <span class="fp-resource-title">${escHtml(resource.title)}</span>
                <span class="type-badge ${meta.cls}">${meta.label}</span>
            </a>
        </div>`;
    }

    return `<div class="featured-popup" role="complementary" aria-label="Featured resources">
        <div class="fp-heading">Featured resources</div>
        ${resRow(learn, 'learn')}
        ${resRow(train, 'train')}
    </div>`;
}

function renderStep(step, isParallel) {
    const featured = getFeaturedForStep(step.url);
    const hasPopup = !!(featured.learn || featured.train);
    const featuredHtml = hasPopup ? renderFeaturedCard(featured) : '';

    return `<div class="step-card${isParallel ? ' step-card--parallel' : ''}${hasPopup ? ' has-popup' : ''}" 
                 data-url="${escHtml(step.url)}"
                 tabindex="0"
                 role="button"
                 aria-label="${escHtml(step.title)}">
        <div class="step-card-inner">
            <div class="step-card-title">${escHtml(step.title)}</div>
            <div class="step-card-desc">${escHtml(step.description)}</div>
            <div class="step-card-hint">
                <span class="step-hint-desktop">Click to open · hover for resources</span>
                <span class="step-hint-mobile">Tap for resources · double-tap to open</span>
            </div>
        </div>
        ${featuredHtml}
    </div>`;
}

function renderRoadmap(tabKey) {
    const container = document.getElementById('roadmap-container');
    const tab = ROADMAP[tabKey];
    if (!tab) { container.innerHTML = ''; return; }

    const timestamps = Object.keys(tab);
    let html = '<div class="roadmap-timeline">';

    timestamps.forEach((ts, i) => {
        const value = tab[ts];
        const isParallel = Array.isArray(value);
        const steps = isParallel ? value : [value];
        const isLast = i === timestamps.length - 1;

        html += `<div class="timeline-row${isLast ? ' timeline-row--last' : ''}">
            <div class="timeline-left">
                <span class="timeline-timestamp">${escHtml(ts)}</span>
                <div class="timeline-dot"></div>
            </div>
            <div class="timeline-steps${isParallel ? ' timeline-steps--parallel' : ''}">
                ${steps.map(s => renderStep(s, isParallel)).join('')}
            </div>
        </div>`;
    });

    html += '</div>';
    container.innerHTML = html;
    attachCardListeners(container);
}

// ─── Card interaction ─────────────────────────────────────────────────────────

function attachCardListeners(container) {
    const cards = container.querySelectorAll('.step-card');
    const isMobile = () => window.matchMedia('(max-width: 700px)').matches;

    cards.forEach(card => {
        const url = card.dataset.url;
        const popup = card.querySelector('.featured-popup');

        // ── Desktop: click = navigate ─────────────────────────────────────────
        card.addEventListener('click', e => {
            if (isMobile()) return; // mobile handled separately
            if (e.target.closest('.featured-popup')) return; // don't nav from popup
            window.location.href = url;
        });

        // Keyboard: Enter = navigate
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter') window.location.href = url;
        });

        // ── Mobile: tap = toggle popup; double-tap = navigate ─────────────────
        if (popup) {
            let lastTap = 0;

            card.addEventListener('touchend', e => {
                if (!isMobile()) return;
                const now = Date.now();
                const gap = now - lastTap;
                lastTap = now;

                if (gap < 320) {
                    // Double-tap → navigate
                    window.location.href = url;
                    return;
                }

                // Single tap → toggle popup
                e.preventDefault();
                const isOpen = card.classList.contains('popup-open');
                // Close all other open popups first
                container.querySelectorAll('.step-card.popup-open').forEach(c => {
                    if (c !== card) c.classList.remove('popup-open');
                });
                card.classList.toggle('popup-open', !isOpen);
            });
        }
    });

    // Close mobile popups when tapping outside
    document.addEventListener('touchend', e => {
        if (!e.target.closest('.step-card')) {
            container.querySelectorAll('.step-card.popup-open').forEach(c => c.classList.remove('popup-open'));
        }
    }, { passive: true });
}

// ─── Tab switcher ─────────────────────────────────────────────────────────────

function renderTabs() {
    const switcher = document.getElementById('tab-switcher');
    const tabs = Object.keys(ROADMAP);

    switcher.innerHTML = tabs.map(t =>
        `<button class="tab-btn" data-tab="${escHtml(t)}" role="tab" aria-selected="false">${escHtml(t)}</button>`
    ).join('');

    switcher.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => selectTab(btn.dataset.tab));
    });
}

function selectTab(key) {
    if (!ROADMAP[key]) return;
    activeTab = key;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        const sel = btn.dataset.tab === key;
        btn.classList.toggle('tab-btn--active', sel);
        btn.setAttribute('aria-selected', sel ? 'true' : 'false');
    });

    renderRoadmap(key);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    renderTabs();

    const tabs = Object.keys(ROADMAP);
    const fromTab = detectTabFromUrl();
    selectTab(fromTab && ROADMAP[fromTab] ? fromTab : tabs[0]);

    // Title click → back to main resources
    document.getElementById('main-title')?.addEventListener('click', () => {
        window.location.href = '..';
    });
});
