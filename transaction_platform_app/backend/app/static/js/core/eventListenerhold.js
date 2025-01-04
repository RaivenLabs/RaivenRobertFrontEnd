let eventDelegateInstance = null;

class EventDelegate {
    constructor(isTeamAppraisalView = false) {
        if (eventDelegateInstance) {
            console.log('EventDelegate already exists, returning instance');
            return eventDelegateInstance;
        }
        
        this.isTeamAppraisalView = isTeamAppraisalView;
        console.log('Creating new EventDelegate, isTeamAppraisalView:', isTeamAppraisalView);

        if (isTeamAppraisalView) {
            console.log('Team Appraisal view detected, loading handler...');
            this.loadTeamAppraisalHandler();
        }

        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmenuToggle = this.handleSubmenuToggle.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        
        this.setupEventListeners();
        eventDelegateInstance = this;
    }

    async loadTeamAppraisalHandler() {
        try {
            console.log('Attempting to load team appraisal handler...');
            const { handler } = await import('/application_groups/houseapps/applications/teamappraisal/static/handlers/teamappraisal_handler.js');
            console.log('Team appraisal handler loaded:', handler);
            
            if (handler && typeof handler.init === 'function') {
                console.log('Initializing team appraisal handler...');
                handler.init();
            }
        } catch (error) {
            console.error('Error loading team appraisal handler:', error);
        }
    }

    setupEventListeners() {
        // Platform-level menu items
        document.body.addEventListener('click', (e) => {
            // Log click details
            console.log('Click detected on:', e.target.tagName, 
                       'Class:', e.target.className,
                       'Inside team appraisal?', !!e.target.closest('[data-view-type="application"]'));

            // Skip if in team appraisal area
            if (this.isTeamAppraisalView && 
                (e.target.closest('#sidebar-app') || e.target.closest('#content-app'))) {
                console.log('Skipping team appraisal event');
                return;
            }
            
            if (e.target.closest('.menu-item') && !e.target.closest('.application-nav-item')) {
                this.handleClick(e);
            }
        });

        // Global key events for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Modal handling
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.application-nav-item')) {
                this.handleOutsideModalClick(e);
            }
        });
    }

    async handleClick(e) {
        const menuItem = e.target.closest('.menu-item');
        if (!menuItem) return;

        const section = menuItem.dataset.section;
        const type = menuItem.dataset.type;

        console.log('Platform menu item clicked:', section, 'Type:', type);

        // Handle submenu toggles
        if (menuItem.classList.contains('has-submenu')) {
            this.handleSubmenuToggle(e, menuItem);
            return;
        }

        // Handle nested submenu toggles
        if (menuItem.classList.contains('unique-has-submenu')) {
            this.handleNestedSubmenuToggle(e, menuItem);
            return;
        }

        // For regular menu items, load their handlers
        if (section && type) {
            await this.loadHandler(section, type);
        }

        // Handle other platform-level buttons
        if (e.target.closest('.btn-login')) {
            this.handleLogin();
        }
        if (e.target.closest('.btn-refresh')) {
            this.handleRefresh();
        }
    }

    async loadHandler(section, type) {
        console.log('Loading platform handler for:', section, 'Type:', type);
        try {
            const { handler } = await import('/application_groups/static/shared/handlers/base_handler.js');
            console.log('Platform handler loaded successfully for:', section);
            await handler.initialize(section, type);
        } catch (error) {
            console.error(`Error loading handler for ${section}:`, error);
        }
    }

    handleSubmenuToggle(e, menuItem) {
        if (menuItem.closest('.application-nav-item')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        menuItem.classList.toggle('active');
        const submenu = menuItem.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle('active');
        }
    }

    handleNestedSubmenuToggle(e, menuItem) {
        if (menuItem.closest('.application-nav-item')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const apolloSubmenu = menuItem.querySelector('.apollo-submenu');
        if (apolloSubmenu) {
            apolloSubmenu.classList.toggle('active');
        }
    }

    handleLogin() {
        console.log('Platform login clicked');
        // Login logic here
    }

    handleRefresh() {
        console.log('Platform refresh clicked');
        const refreshBtn = document.querySelector('.btn-refresh');
        if (!refreshBtn) return;

        refreshBtn.textContent = 'Refreshing...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            refreshBtn.textContent = 'Refresh';
            refreshBtn.disabled = false;
        }, 1000);
    }

    handleOutsideModalClick(e) {
        if (e.target.closest('.application-nav-item')) return;

        const consoleTypes = [
            '.application-console',
            '.running-board-console',
            '.report-console'
        ];
        
        consoleTypes.forEach(type => {
            const console = document.querySelector(type);
            if (console) {
                const modalContent = console.querySelector('.modal-content');
                if (modalContent && !modalContent.contains(e.target) && !e.target.closest('.close-button')) {
                    this.closeAllModals();
                }
            }
        });
    }

    closeAllModals() {
        const consoleTypes = [
            '.application-console',
            '.running-board-console',
            '.report-console'
        ];
        
        consoleTypes.forEach(type => {
            const console = document.querySelector(type);
            if (console) {
                console.remove();
            }
        });
    }
}

function initializeEventDelegateOrHandler() {
    if (eventDelegateInstance) {
        console.log('EventDelegate already initialized, skipping');
        return;
    }

    console.log('=== DOM Loaded - Starting Event Delegate Check ===');
    console.log('Checking for team appraisal view...');
    
    const appElements = document.querySelectorAll('[data-view-type="application"]');
    console.log('Application elements found:', appElements.length);
    
    appElements.forEach(el => {
        console.log('Found application element:', el.id);
    });

    new EventDelegate(appElements.length > 0);
}

// Initialize
if (!window.eventDelegateInitialized) {
    window.eventDelegateInitialized = true;
    document.addEventListener('DOMContentLoaded', initializeEventDelegateOrHandler);
}