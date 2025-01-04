// Add this at the top of the file, before the EventDelegate class
const _instance = {
    delegate: null
};


class EventDelegate {
    constructor(applicationInfo = null) {

        const appElement = document.querySelector('[data-view-type="application"]');
        if (appElement?.dataset.launchType === 'console') {
            console.log('Console-launched application detected, standing down event delegate');
            return null;
        }
        // Replace the current singleton check with this more robust version
        if (_instance.delegate) {
            console.log('🔄 Returning existing EventDelegate instance');
            return _instance.delegate;
        }



        console.log('🎯 Creating new EventDelegate instance');
        _instance.delegate = this;
        
        this.applicationInfo = applicationInfo;
        console.log('Creating new EventDelegate, application:', applicationInfo);
        console.log('Debug applicationInfo:', {
            info: this.applicationInfo});

        if (applicationInfo) {
            console.log(`${applicationInfo.name} view detected, loading handler...`);
            this.loadApplicationHandler();
        }

        // Keep all your existing bindings
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmenuToggle = this.handleSubmenuToggle.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        
        this.setupEventListeners();
    }

    async loadApplicationHandler() {
        try {
            // Move all variable declarations to top of try block
            const { name } = this.applicationInfo;
            const appElement = document.querySelector('[data-view-type="application"]');
            
            // Add error checking for appElement
            if (!appElement) {
                throw new Error('Application element not found');
            }
            
            const section = appElement.dataset.originSection;
            
            // Add error checking for section
            if (!section) {
                console.warn('Section not found in data attributes, falling back to engineering');
                section = 'engineering'; // Fallback value
            }
    
            console.log(`Attempting to load ${name} handler for section: ${section}`);
            
            // Now define handlerPath after we have all required variables
            const handlerPath = `/application_groups/${section}/applications/${name}/static/handlers/${name}_handler.js`;
            console.log('Loading handler from:', handlerPath);
            
            const { handler } = await import(handlerPath);
            console.log(`${name} handler loaded:`, handler);
            
            if (handler && typeof handler.init === 'function') {
                console.log(`Initializing ${name} handler...`);
                handler.init();
            }
        } catch (error) {
            console.error('Error loading application handler:', error);
        }
     
    }



    




    setupEventListeners() {
        document.body.addEventListener('click', (e) => {
            console.log('Raw click event target:', {
                tagName: e.target.tagName,
                className: e.target.className,
                parentClassList: e.target.parentElement?.classList
            });
            
            const menuItem = e.target.closest('.menu-item');
            console.log('Found menu item:', menuItem?.dataset);
            
            if (menuItem && !menuItem.closest('.application-nav-item')) {
                console.log('Handling menu item click');
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

        console.log('Menu item detected:', {
            isInApplicationConsole: !!menuItem.closest('.application-console'),
            menuItemDataset: menuItem.dataset,
            menuItemClasses: menuItem.classList.toString()
        });



        if (menuItem.closest('.application-console')) {
            console.log('Application console launch detected, standing down');
            return;
        }



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

// Initialization function to detect application
function initializeEventDelegateOrHandler() {
    if (_instance.delegate) {
        console.log('EventDelegate already initialized, skipping');
        return;
    }

    console.log('=== DOM Loaded - Starting Event Delegate Check ===');
    
    // Look for any application elements
    const appElement = document.querySelector('[data-view-type="application"]');
    
    if (appElement) {
        // Get application name from data attribute
        const applicationName = appElement.dataset.application;
        console.log('Detected application:', applicationName);
        
        if (applicationName) {
            const applicationInfo = {
                name: applicationName,
                element: appElement
            };
            new EventDelegate(applicationInfo);
        } else {
            console.log('No application name found, initializing standard delegate');
            new EventDelegate(null);
        }
    } else {
        console.log('No application views found, initializing standard delegate');
        new EventDelegate(null);
    }
}

// Initialize
if (!window.eventDelegateInitialized) {
    window.eventDelegateInitialized = true;
    document.addEventListener('DOMContentLoaded', initializeEventDelegateOrHandler);
}