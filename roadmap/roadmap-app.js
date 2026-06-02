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

function _isGridLayout(path) {
    if (!path) return !!(RESOURCES.gridLayout);
    let node = RESOURCES;
    for (const seg of path.split('~')) {
        if (node.gridLayout) return true;
        const key = _findKey(node, seg);
        if (key === undefined) return false;
        node = node[key];
    }
    return !!(node && node.gridLayout);
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

// Find a single resource by its url property within a node (searches leaf arrays recursively)
function _findResourceWithPath(node, url) {
    if (Array.isArray(node.resources)) return node.resources.find(r => r.path === url) || null;
    for (const key of Object.keys(node)) {
        const val = node[key];
        if (val !== null && typeof val === 'object') {
            const found = _findResourceWithPath(val, url);
            if (found) return found;
        }
    }
    return null;
}

// Resolve a resource path like "cs~cs~sk":
// all segments except the last = node path; last segment = resource url value.
function _getResourceByPath(fullPath) {
    const segs = fullPath.split('~');
    if (segs.length < 2) return null;
    const resourceUrl = segs.pop();
    const node = _getNode(segs.join('~'));
    if (!node) return null;
    return _findResourceWithPath(node, resourceUrl);
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
                if (!path) continue;
                const node = _getNode(path);
                if (!node) continue;
                const all = _collectFeatured(node);
                if (_isGridLayout(path)) {
                    if (all.length) groups.push({ flat: true, all });
                } else {
                    groups.push({ flat: false, learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
                }
            } else {
                const all = res.map(_getResourceByPath).filter(Boolean);
                groups.push({ flat: false, learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
            }
        }
    } else if (Array.isArray(step.resources) && step.resources.length > 0) {
        const all = step.resources.map(_getResourceByPath).filter(Boolean);
        groups.push({ flat: false, learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
    } else {
        for (const path of paths) {
            const node = _getNode(path);
            if (!node) continue;
            const all = _collectFeatured(node);
            if (_isGridLayout(path)) {
                if (all.length) groups.push({ flat: true, all });
            } else {
                groups.push({ flat: false, learn: all.filter(r => r.type !== 'trainer'), train: all.filter(r => r.type === 'trainer') });
            }
        }
    }

    return groups.filter(g => g.flat ? g.all.length : (g.learn.length || g.train.length));
}

// ─── Tab state ────────────────────────────────────────────────────────────────

let activeTab = null;
let _pathSelectorHistoryPushed = false;
let _roadmapIgnoreNextPopstate = false;

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

function escHtmlAngled(str) {
    return String(str)
        .replace(/&/g, '&amp;')
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

    function resSection(resources, section) {
        const label = section === 'learn' ? 'Learn' : 'Train';
        if (!resources.length) {
            if (multiGroup) return '';
            return `<div class="fp-empty-section">
                <span class="fp-section-label fp-empty">${label}</span>
                <span class="fp-empty-note">${emptyNote}</span>
            </div>`;
        }
        const rows = resources.map(resource => {
            const meta = TYPE_META[resource.type] || { label: resource.type, cls: 'type-unknown' };
            const creditHtml = resource.credit ? `<span class="fp-resource-credit">${formatCredit(resource.credit)}</span>` : '';
            return `<a class="fp-resource-link" href="${escHtml(resource.url)}" target="_blank" rel="noopener">
                <span class="fp-resource-title-group">
                    <span class="fp-resource-title">${escHtml(resource.title)}</span> ${creditHtml}
                </span>
                <span class="type-badge ${meta.cls}">${meta.label}</span>
            </a>`;
        }).join('');
        return `<div class="fp-section">
            <span class="fp-section-label fp-${section}">${label}</span>
            ${rows}
        </div>`;
    }

    const groupsHtml = groups.map(g => {
        if (g.flat) {
            const rows = g.all.map(r => {
                const creditHtml = r.credit ? `<span class="fp-resource-credit">${formatCredit(r.credit)}</span>` : '';
                return `<a class="fp-resource-link" href="${escHtml(r.url)}" target="_blank" rel="noopener">
                    <span class="fp-resource-title-group">
                        <span class="fp-resource-title">${escHtml(r.title)}</span> ${creditHtml}
                    </span>
                </a>`;
            }).join('');
            return `<div class="fp-group">${rows}</div>`;
        }
        return `<div class="fp-group">${resSection(g.learn, 'learn')}${resSection(g.train, 'train')}</div>`;
    }).join('<div class="fp-separator" aria-hidden="true"></div>');

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
    const isMultiPath = Array.isArray(step.path) && step.path.length > 1;
    const firstPath = Array.isArray(step.path) ? step.path[0] : step.path;
    const navUrl = (hasNav && firstPath && !isMultiPath)
        ? `../?path=${encodeURIComponent(firstPath).replace(/%7E/g, '~')}`
        : '#';
    const pathsAttr = isMultiPath
        ? ` data-paths="${escHtml(JSON.stringify(step.path))}"`
        : '';

    return `<div class="step-card${hasPopup ? ' has-popup' : ''}${isMultiPath ? ' step-card--multi-path' : ''}"
                 data-url="${escHtml(navUrl)}"${pathsAttr}
                 tabindex="0"
                 role="button"
                 aria-label="${escHtml(step.title)}">
        <div class="step-card-inner">
            <div class="step-card-title">${escHtml(step.title)}</div>
            ${step.description ? `
                <div class="step-card-desc">${escHtmlAngled(step.description)}</div>` :
            ''}
            ${hasNav ? `<div class="step-card-hint">
                <span class="step-hint-desktop">${isMultiPath ? 'Click to select page' : 'Click to open'} · hover for resources</span>
                <span class="step-hint-mobile">Tap for resources · double-tap to ${isMultiPath ? 'select page' : 'open'}</span>
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
            html += renderTimelineRow(item, isLast);
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
                <span class="branch-label">Choose a path:</span>
                <span class="branch-nav-indicator" aria-live="polite"></span>
                <button class="branch-nav-btn branch-nav-prev" aria-label="Previous option"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                <button class="branch-nav-btn branch-nav-next" aria-label="Next option"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
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
    // First string element (if any) is the tab description — skip it here, rendered in selectTab
    const items = tab.filter(item => typeof item !== 'string');
    container.innerHTML = renderBranch(items);
    attachCardListeners(container);
}

// ─── Path selector modal ──────────────────────────────────────────────────────

function ensurePathSelectorModal() {
    if (document.getElementById('path-selector-backdrop')) return;
    const el = document.createElement('div');
    el.id = 'path-selector-backdrop';
    el.className = 'path-selector-backdrop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Select resource page');
    el.innerHTML = `
        <div class="path-selector-modal">
            <div class="path-selector-topbar">
                <span class="path-selector-title">Select the resource page...</span>
                <button class="path-selector-close" id="path-selector-close" aria-label="Close">&times;</button>
            </div>
            <div class="path-selector-list" id="path-selector-list"></div>
        </div>`;
    document.body.appendChild(el);

    el.addEventListener('click', e => {
        if (e.target === el) closePathSelector();
    });
    document.getElementById('path-selector-close').addEventListener('click', closePathSelector);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePathSelector();
    });
}

let _pathSelectorOpenTime = 0;

function openPathSelector(paths) {
    ensurePathSelectorModal();
    const list = document.getElementById('path-selector-list');
    const arrowSvg = `<svg class="path-selector-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    list.innerHTML = paths.map(p => {
        const node = _getNode(p);
        if (!node) return '';
        const title = escHtml(node.title || p);
        const bait = node.bait ? `<span class="path-selector-bait">${escHtml(node.bait)}</span>` : '';
        const url = `../?path=${encodeURIComponent(p).replace(/%7E/g, '~')}`;
        return `<a class="path-selector-row" href="${escHtml(url)}">
            ${arrowSvg}
            <span class="path-selector-text">
                <span class="path-selector-node-title">${title}:</span> ${bait}
            </span>
        </a>`;
    }).join('');
    _pathSelectorOpenTime = Date.now();
    if (!document.getElementById('path-selector-backdrop')?.classList.contains('active')) {
        window.history.pushState({ squan: 'roadmap-path-selector' }, '', window.location.href);
        _pathSelectorHistoryPushed = true;
    }
    document.getElementById('path-selector-backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePathSelector(ignoreHistory = false) {
    // Ignore close calls within 250ms of opening — swallows synthetic clicks from the opening touch
    if (Date.now() - _pathSelectorOpenTime < 250) return;
    document.getElementById('path-selector-backdrop')?.classList.remove('active');
    document.body.style.overflow = '';
    if (_pathSelectorHistoryPushed && !ignoreHistory) {
        _pathSelectorHistoryPushed = false;
        _roadmapIgnoreNextPopstate = true;
        window.history.back();
    }
}

// ─── Card interaction ─────────────────────────────────────────────────────────

function attachCardListeners(container) {
    const cards = container.querySelectorAll('.step-card');
    const isMobile = () => window.matchMedia('(max-width: 700px)').matches;

    cards.forEach(card => {
        const url = card.dataset.url;
        const popup = card.querySelector('.featured-popup');
        const isMultiPath = card.classList.contains('step-card--multi-path');
        const paths = isMultiPath ? JSON.parse(card.dataset.paths) : null;

        // ── Desktop: click = navigate or open path selector ───────────────────
        card.addEventListener('click', e => {
            if (isMobile()) return;
            if (e.target.closest('.featured-popup')) return;
            if (isMultiPath) { openPathSelector(paths); return; }
            if (url && url !== '#') window.location.href = url;
        });

        // Keyboard: Enter = navigate or open path selector
        card.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            if (isMultiPath) { openPathSelector(paths); return; }
            if (url && url !== '#') window.location.href = url;
        });

        // ── Mobile touch ──────────────────────────────────────────────────────
        let lastTap = 0;
        let touchStartX = 0;
        let touchStartY = 0;

        card.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        if (popup || isMultiPath) {
            card.addEventListener('touchend', e => {
                if (!isMobile()) return;
                const dx = e.changedTouches[0].clientX - touchStartX;
                const dy = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) return;

                const now = Date.now();
                const gap = now - lastTap;
                lastTap = now;

                if (gap < 320) {
                    // Double-tap
                    if (isMultiPath) {
                        e.preventDefault(); // suppress synthetic click so backdrop doesn't immediately close
                        openPathSelector(paths);
                    } else if (url && url !== '#') {
                        window.location.href = url;
                    }
                    return;
                }

                // Single tap → toggle popup
                if (!popup) return;
                e.preventDefault();
                const isOpen = card.classList.contains('popup-open');
                container.querySelectorAll('.step-card.popup-open').forEach(c => {
                    if (c !== card) c.classList.remove('popup-open');
                });
                card.classList.toggle('popup-open', !isOpen);
            });
        }
    });

    // Close mobile popups when tapping outside — skip entirely if path selector is open
    document.addEventListener('touchend', e => {
        if (document.getElementById('path-selector-backdrop')?.classList.contains('active')) return;
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

    // Show tab description (first string element of the tab array, if present)
    const descEl = document.getElementById('roadmap-tab-desc');
    if (descEl) {
        const tab = ROADMAP[key];
        const desc = Array.isArray(tab) ? tab.find(item => typeof item === 'string') : null;
        descEl.textContent = desc || '';
        descEl.hidden = !desc;
    }

    renderRoadmap(key);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    renderTabs();

    window.history.pushState({ squan: 'roadmap' }, '', window.location.href);
    window.addEventListener('popstate', () => {
        if (_roadmapIgnoreNextPopstate) {
            _roadmapIgnoreNextPopstate = false;
            return;
        }
        if (document.getElementById('path-selector-backdrop')?.classList.contains('active')) {
            closePathSelector(true);
            return;
        }
        window.location.href = '..';
    });

    const tabs = Object.keys(ROADMAP);
    const fromTab = detectTabFromUrl();
    selectTab(fromTab && ROADMAP[fromTab] ? fromTab : tabs[0]);

    // Title click → back to main resources
    document.getElementById('main-title')?.addEventListener('click', () => {
        window.location.href = '..';
    });
});
