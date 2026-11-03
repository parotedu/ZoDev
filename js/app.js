/**
 * ZODEV - The Deluge & Zoho Developer Suite by PAROT Corp
 * Central Application Coordinator
 * Strictly LTR, Safari-Compatible, High Performance
 */

window.App = {
    activeTab: 'hub',

    init() {
        // Enforce strict LTR on document root - eliminates Safari BiDi code reversal bugs
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
        try {
            localStorage.removeItem('parot_zoho_lang');
        } catch(e) {}

        this.initNavigation();
        this.initSidebarSearch();
        this.initHubFilter();
        this.initMobileDrawer();
        this.initCopyButtons();
        this.initShortcuts();

        // Initialize All 18 Developer Tools
        try { if (window.JsonDelugeTool) window.JsonDelugeTool.init(); } catch(e) { console.error('JsonDelugeTool init error', e); }
        try { if (window.CurlInvokeurlTool) window.CurlInvokeurlTool.init(); } catch(e) { console.error('CurlInvokeurlTool init error', e); }
        try { if (window.DateTools) window.DateTools.init(); } catch(e) { console.error('DateTools init error', e); }
        try { if (window.CoqlBuilderTool) window.CoqlBuilderTool.init(); } catch(e) { console.error('CoqlBuilderTool init error', e); }
        try { if (window.PaginationTool) window.PaginationTool.init(); } catch(e) { console.error('PaginationTool init error', e); }
        try { if (window.WebhookUnpackerTool) window.WebhookUnpackerTool.init(); } catch(e) { console.error('WebhookUnpackerTool init error', e); }
        try { if (window.StringRegexTool) window.StringRegexTool.init(); } catch(e) { console.error('StringRegexTool init error', e); }
        try { if (window.SnippetVaultTool) window.SnippetVaultTool.init(); } catch(e) { console.error('SnippetVaultTool init error', e); }
        try { if (window.CriteriaBuilderTool) window.CriteriaBuilderTool.init(); } catch(e) { console.error('CriteriaBuilderTool init error', e); }
        try { if (window.JsonXmlTool) window.JsonXmlTool.init(); } catch(e) { console.error('JsonXmlTool init error', e); }
        try { if (window.PayloadDiffTool) window.PayloadDiffTool.init(); } catch(e) { console.error('PayloadDiffTool init error', e); }
        try { if (window.HmacSignerTool) window.HmacSignerTool.init(); } catch(e) { console.error('HmacSignerTool init error', e); }
        try { if (window.StatementThrottlerTool) window.StatementThrottlerTool.init(); } catch(e) { console.error('StatementThrottlerTool init error', e); }
        try { if (window.DeskBuilderTool) window.DeskBuilderTool.init(); } catch(e) { console.error('DeskBuilderTool init error', e); }
        try { if (window.BooksEngineTool) window.BooksEngineTool.init(); } catch(e) { console.error('BooksEngineTool init error', e); }
        try { if (window.CurrencyCleanerTool) window.CurrencyCleanerTool.init(); } catch(e) { console.error('CurrencyCleanerTool init error', e); }
        try { if (window.UnitTestingTool) window.UnitTestingTool.init(); } catch(e) { console.error('UnitTestingTool init error', e); }
        try { if (window.LeadDedupTool) window.LeadDedupTool.init(); } catch(e) { console.error('LeadDedupTool init error', e); }

        // Render Lucide SVG Icons
        this.renderIcons();

        // Handle URL hash if present
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            this.switchTab(hash);
        } else {
            this.switchTab('hub');
        }
    },

    renderIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try {
                window.lucide.createIcons();
            } catch(e) {
                console.warn('Lucide icons error', e);
            }
        }
    },

    initNavigation() {
        // Sidebar buttons
        document.querySelectorAll('.sidebar-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.dataset.target;
                if (target) this.switchTab(target);
            });
        });

        // Hub cards click to navigate
        document.querySelectorAll('.hub-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = card.dataset.target;
                if (target) this.switchTab(target);
            });
        });

        // Hub button inside tool headers ("Back to Hub")
        document.querySelectorAll('.btn-back-hub').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab('hub');
            });
        });
    },

    switchTab(tabId) {
        const panels = document.querySelectorAll('.tool-panel');
        const sidebarButtons = document.querySelectorAll('.sidebar-tool-btn');

        let matched = false;
        panels.forEach(p => {
            if (p.id === `panel-${tabId}`) {
                p.classList.remove('hidden');
                matched = true;
            } else {
                p.classList.add('hidden');
            }
        });

        if (!matched && panels.length > 0) {
            const fallback = document.getElementById('panel-hub') || panels[0];
            fallback.classList.remove('hidden');
            tabId = fallback.id.replace('panel-', '');
        }

        sidebarButtons.forEach(b => {
            if (b.dataset.target === tabId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        this.activeTab = tabId;
        window.location.hash = tabId;

        // Close mobile drawer if open
        this.closeMobileDrawer();

        // Scroll view to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Refresh icons
        this.renderIcons();
    },

    initSidebarSearch() {
        const searchInput = document.getElementById('tool-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const toolButtons = document.querySelectorAll('.sidebar-tool-btn');
            const groups = document.querySelectorAll('.sidebar-group');

            toolButtons.forEach(btn => {
                // Keep Hub button always visible
                if (btn.dataset.target === 'hub') {
                    btn.classList.remove('hidden');
                    return;
                }
                const name = (btn.dataset.name || btn.textContent).toLowerCase();
                const category = (btn.dataset.category || '').toLowerCase();
                if (name.includes(query) || category.includes(query)) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            });

            // Hide section headings if all children are hidden
            groups.forEach(group => {
                const visibleButtons = group.querySelectorAll('.sidebar-tool-btn:not(.hidden)');
                if (visibleButtons.length === 0) {
                    group.classList.add('hidden');
                } else {
                    group.classList.remove('hidden');
                }
            });
        });

        // Clear on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        });
    },

    initHubFilter() {
        const pills = document.querySelectorAll('.hub-filter-pill');
        const cards = document.querySelectorAll('.hub-card');
        const searchInput = document.getElementById('hub-search-input');

        const applyFilter = () => {
            const activePill = document.querySelector('.hub-filter-pill.active');
            const cat = activePill ? activePill.dataset.category : 'all';
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

            cards.forEach(card => {
                const cardCat = card.dataset.category || '';
                const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
                const desc = (card.querySelector('p')?.textContent || '').toLowerCase();

                const matchesCat = (cat === 'all' || cardCat === cat);
                const matchesQuery = (!query || title.includes(query) || desc.includes(query));

                if (matchesCat && matchesQuery) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                applyFilter();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }
    },

    initMobileDrawer() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('sidebar-close-btn');
        const backdrop = document.getElementById('sidebar-backdrop');
        const sidebar = document.getElementById('app-sidebar');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.add('open');
                if (backdrop) backdrop.classList.remove('hidden');
            });
        }

        const close = () => {
            if (sidebar) sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.add('hidden');
        };

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (backdrop) backdrop.addEventListener('click', close);
    },

    closeMobileDrawer() {
        const sidebar = document.getElementById('app-sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.add('hidden');
    },

    initCopyButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.copy-code-btn');
            if (!btn) return;
            const targetId = btn.dataset.target;
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                this.copyToClipboard(targetElem.textContent, btn);
            }
        });
    },

    copyToClipboard(text, triggerBtn = null) {
        if (!text || text.trim() === '') return;

        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Code copied to clipboard!', 'success');
            if (triggerBtn) {
                const originalHtml = triggerBtn.innerHTML;
                triggerBtn.classList.add('bg-emerald-600', 'border-emerald-400');
                triggerBtn.innerHTML = `
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Copied!</span>
                `;
                this.renderIcons();
                setTimeout(() => {
                    triggerBtn.classList.remove('bg-emerald-600', 'border-emerald-400');
                    triggerBtn.innerHTML = originalHtml;
                    this.renderIcons();
                }, 1500);
            }
        }).catch(err => {
            this.showToast('Failed to copy: ' + err.message, 'error');
        });
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-msg ${
            type === 'success' ? 'border-emerald-500/50 text-emerald-200' :
            type === 'error' ? 'border-red-500/50 text-red-200' :
            'border-purple-500/50 text-purple-200'
        }`;

        const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';
        toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4"></i> <span>${message}</span>`;

        container.appendChild(toast);
        this.renderIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.2s ease';
            setTimeout(() => toast.remove(), 200);
        }, 2200);
    },

    initShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check for / or Cmd+K / Ctrl+K
            if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && 
                document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const search = document.getElementById('tool-search-input');
                if (search) {
                    search.focus();
                    search.select();
                }
            }
        });
    }
};

// Auto boot on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});
