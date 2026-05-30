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

// Returns groups: Array<{ learn: resource[], train: resource[] }>
// path can be a string or string[].
// resources can be:
//   - string[]            → single group of explicit paths (old behaviour)
//   - Array<string[]|null> → one group per entry; null = fall back to featured for that path
// If neither is present, one group per path using featured resources.
function getFeaturedForStep(step) {
    const paths = Array.isArray(step.path) ? step.path : (step.path ? [step.path] : []);

    // Detect multi-group resources format: outer array whose elements are arrays or null
    const isMultiGroup = Array.isArray(step.resources) && step.resources.length > 0 &&
        step.resources.every(r => r === null || Array.isArray(r));

    let groups = [];

    if (isMultiGroup) {
        const count = Math.max(step.resources.length, paths.length);
        for (let i = 0; i < count; i++) {
            const res = step.resources[i];
            const path = paths[i];
            if (res === null) {
                // Fall back to featured for the corresponding path
                if (!path) continue;
                const node = _getNode(path);
                if (!node) continue;
                const all = _collectFeatured(node);
                groups.push({ learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
            } else {
                let all = [];
                for (const p of res) { const node = _getNode(p); if (node) all.push(..._collectFeatured(node)); }
                groups.push({ learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
            }
        }
    } else if (Array.isArray(step.resources) && step.resources.length > 0) {
        // Flat string[] — single explicit group
        let all = [];
        for (const p of step.resources) { const node = _getNode(p); if (node) all.push(..._collectFeatured(node)); }
        groups.push({ learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
    } else {
        // No resources override — one group per path
        for (const path of paths) {
            const node = _getNode(path);
            if (!node) continue;
            const all = _collectFeatured(node);
            groups.push({ learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
        }
    }

    return groups.filter(g => g.learn.length || g.train.length);
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

function formatCredit(credit) {
    if (!credit) return '';
    const colon = credit.indexOf(':');
    if (colon === -1) return escHtml(credit);
    return `<em>${escHtml(credit.slice(0, colon))}</em>${escHtml(credit.slice(colon))}`;
}

const TYPE_META = {
    'doc/sheet': { label: 'Doc / Sheet', cls: 'type-doc-sheet' },
    'video': { label: 'Video', cls: 'type-video' },
    'trainer': { label: 'Trainer', cls: 'type-trainer' },
    'image': { label: 'Image', cls: 'type-image' },
    'website': { label: 'Website', cls: 'type-website' },
};

function renderFeaturedCard(groups) {
    if (!groups.length) return '';

    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const emptyNote = isMobile
        ? 'Double-tap the step to see the full resource list.'
        : 'Click the step card to see the full resource list.';
    const multiGroup = groups.length > 1;

    function resRows(resources, section) {
        if (!resources.length) {
            if (multiGroup) return ''; // don't show empty-section notes in multi-group mode
            return `<div class="fp-empty-section">
                <span class="fp-section-label fp-empty">${section === 'learn' ? 'Learn' : 'Train'}</span>
                <span class="fp-empty-note">${emptyNote}</span>
            </div>`;
        }
        return resources.map(resource => {
            const meta = TYPE_META[resource.type] || { label: resource.type, cls: 'type-unknown' };
            const creditHtml = resource.credit ? `<span class="fp-resource-credit">${formatCredit(resource.credit)}</span>` : '';
            return `<div class="fp-resource-row">
                <span class="fp-section-label fp-${section}">${section === 'learn' ? 'Learn' : 'Train'}</span>
                <a class="fp-resource-link" href="${escHtml(resource.url)}" target="_blank" rel="noopener">
                    <span class="fp-resource-title-group">
                        <span class="fp-resource-title">${escHtml(resource.title)}</span> ${creditHtml}
                    </span>
                    <span class="type-badge ${meta.cls}">${meta.label}</span>
                </a>
            </div>`;
        }).join('');
    }

    const groupsHtml = groups.map(({ learn, train }) =>
        `<div class="fp-group">${resRows(learn, 'learn')}${resRows(train, 'train')}</div>`
    ).join('<div class="fp-separator" aria-hidden="true"></div>');

    return `<div class="featured-popup" role="complementary" aria-label="Featured resources">
        <div class="fp-heading">Featured resources</div>
        ${groupsHtml}
    </div>`;
}

function renderStep(step) {
    const groups = getFeaturedForStep(step);
    const hasPopup = groups.length > 0;
    const featuredHtml = hasPopup ? renderFeaturedCard(groups) : '';
    const hasNav = !!(step.path || step.resources);
    const firstPath = Array.isArray(step.path) ? step.path[0] : step.path;
    const navUrl = hasNav && firstPath ? `../?path=${encodeURIComponent(firstPath).replace(/%7E/g, '~')}` : '#';

    return `<div class="step-card${hasPopup ? ' has-popup' : ''}"
                 data-url="${escHtml(navUrl)}"
                 tabindex="0"
                 role="button"
                 aria-label="${escHtml(step.title)}">
        <div class="step-card-inner">
            <div class="step-card-title">${escHtml(step.title)}</div>
            ${step.description ? `<div class="step-card-desc">${escHtml(step.description)}</div>` : ''}
            ${hasNav ? `<div class="step-card-hint">
                <span class="step-hint-desktop">Click to open · hover for resources</span>
                <span class="step-hint-mobile">Tap for resources · double-tap to open</span>
            </div>` : ''}
        </div>
        ${featuredHtml}
    </div>`;
}

// ─── Branch rendering engine ──────────────────────────────────────────────────

// An item is a branchGroup if it's an array (of branch arrays).
function isBranchGroup(item) {
    return Array.isArray(item);
}

// Render one timeline row for a step.
function renderTimelineRow(step, isLast) {
    return `<div class="timeline-row${isLast ? ' timeline-row--last' : ''}">
        <div class="timeline-left">
            <span class="timeline-timestamp">${escHtml(step.timestamp)}</span>
            <div class="timeline-dot"></div>
        </div>
        <div class="timeline-steps">
            ${renderStep(step)}
        </div>
    </div>`;
}

// Render a branch: an array of steps and/or branchGroups.
// isNested = true when rendering inside a branch lane — uses simple card stack,
// no sub-timeline grid, so the main timeline's line passes through cleanly.
function renderBranch(items, isNested = false) {
    let html = `<div class="${isNested ? 'branch-timeline' : 'roadmap-timeline'}">`;
    items.forEach((item, i) => {
        const isLast = i === items.length - 1;
        if (isBranchGroup(item)) {
            html += renderBranchGroup(item);
        } else {
            html += renderTimelineRow(item, isLast && !isNested);
        }
    });
    html += '</div>';
    return html;
}

// Render a branchGroup: an array of branch arrays.
// Rendered as a top-level sibling of timeline-rows (NOT wrapped in a timeline-row),
// so branch step rows share the same grid and line position as main rows.
function renderBranchGroup(branches) {
    const lanesHtml = branches.map((branchItems, idx) =>
        `<div class="branch-lane" data-branch-index="${idx}">
            ${renderBranch(branchItems, true)}
        </div>`
    ).join('');

    return `<div class="branch-group" data-active-branch="0">
        <div class="branch-nav-row">
            <div class="timeline-left"></div>
            <div class="branch-nav" role="group" aria-label="Branch navigation">
                <button class="branch-nav-btn branch-nav-prev" aria-label="Previous option">&#8592;</button>
                <span class="branch-nav-indicator" aria-live="polite"></span>
                <button class="branch-nav-btn branch-nav-next" aria-label="Next option">&#8594;</button>
            </div>
        </div>
        <div class="branch-group-lanes">
            ${lanesHtml}
        </div>
    </div>`;
}

function renderRoadmap(tabKey) {
    const container = document.getElementById('roadmap-container');
    const tab = ROADMAP[tabKey];
    if (!tab) { container.innerHTML = ''; return; }
    container.innerHTML = renderBranch(tab);
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
            if (isMobile()) return;
            if (e.target.closest('.featured-popup')) return;
            if (url && url !== '#') window.location.href = url;
        });

        // Keyboard: Enter = navigate
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' && url && url !== '#') window.location.href = url;
        });

        // ── Mobile: tap = toggle popup; double-tap = navigate ─────────────────
        if (popup) {
            let lastTap = 0;
            let touchStartX = 0;
            let touchStartY = 0;

            card.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            card.addEventListener('touchend', e => {
                if (!isMobile()) return;

                // Ignore if the finger moved — this was a scroll/drag
                const dx = e.changedTouches[0].clientX - touchStartX;
                const dy = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) return;

                const now = Date.now();
                const gap = now - lastTap;
                lastTap = now;

                if (gap < 320) {
                    // Double-tap → navigate
                    if (url && url !== '#') window.location.href = url;
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

    attachBranchNavListeners(container);
}

// ─── Branch navigation ────────────────────────────────────────────────────────

function updateBranchNav(group) {
    const lanes = group.querySelectorAll(':scope > .branch-group-lanes > .branch-lane');
    const count = lanes.length;
    const active = parseInt(group.dataset.activeBranch) || 0;

    const indicator = group.querySelector('.branch-nav-indicator');
    if (indicator) indicator.textContent = `${active + 1} / ${count}`;

    const prevBtn = group.querySelector('.branch-nav-prev');
    const nextBtn = group.querySelector('.branch-nav-next');
    if (prevBtn) prevBtn.disabled = active === 0;
    if (nextBtn) nextBtn.disabled = active === count - 1;

    lanes.forEach((lane, i) => lane.classList.toggle('branch-lane--active', i === active));
}

function navigateBranch(group, delta) {
    const lanes = group.querySelectorAll(':scope > .branch-group-lanes > .branch-lane');
    const count = lanes.length;
    const current = parseInt(group.dataset.activeBranch) || 0;
    const next = Math.max(0, Math.min(count - 1, current + delta));
    group.dataset.activeBranch = String(next);
    updateBranchNav(group);
}

function attachBranchNavListeners(container) {
    container.querySelectorAll('.branch-group').forEach(group => {
        updateBranchNav(group);
        group.querySelector('.branch-nav-prev')
            ?.addEventListener('click', e => { e.stopPropagation(); navigateBranch(group, -1); });
        group.querySelector('.branch-nav-next')
            ?.addEventListener('click', e => { e.stopPropagation(); navigateBranch(group, 1); });
    });
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
