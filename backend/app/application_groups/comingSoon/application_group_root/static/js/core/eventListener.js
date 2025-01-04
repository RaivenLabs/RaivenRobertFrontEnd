class EventDelegate {
    constructor() {
        document.body.addEventListener('click', this.handleClick.bind(this));
        console.log('Event Delegate initialized');
    }

    async handleClick(e) {
        if (e.target.closest('.menu-item')) {
            const menuItem = e.target.closest('.menu-item');
            const section = menuItem.dataset.section;
            
            console.log('Menu item clicked:', section);
            
            // Handle submenu toggles first
            if (menuItem.classList.contains('has-submenu')) {
                this.handleSubmenuToggle(e, menuItem);
                return;
            }
            
            // Handle nested submenu toggles
            if (menuItem.classList.contains('unique-has-submenu')) {
                this.handleNestedSubmenuToggle(e, menuItem);
                return;
            }

            // For regular menu items, dynamically load their handlers
            if (!menuItem.classList.contains('has-submenu') && 
                !menuItem.classList.contains('unique-has-submenu')) {
                await this.loadHandler(section);
            }
        }

        // Handle other button clicks
        if (e.target.closest('.btn-login')) {
            this.handleLogin();
        }
        if (e.target.closest('.btn-refresh')) {
            this.handleRefresh();
        }
    }

    async loadHandler(section) {
        console.log('Attempting to load handler for:', section);
        try {
            const { handler } = await import(`../js/${section}/handler/handler.js`);
            console.log('Handler loaded successfully for:', section);
            handler.initialize();
            console.log('Handler initialized for:', section);
        } catch (error) {
            console.log(`No handler found for: ${section}`, error);
        }
    }

    handleSubmenuToggle(e, menuItem) {
        e.preventDefault();
        e.stopPropagation();
        
        menuItem.classList.toggle('active');
        
        const submenu = menuItem.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle('active');
        }
    }

    handleNestedSubmenuToggle(e, menuItem) {
        e.preventDefault();
        e.stopPropagation();
        
        const apolloSubmenu = menuItem.querySelector('.apollo-submenu');
        if (apolloSubmenu) {
            apolloSubmenu.classList.toggle('active');
        }
    }

    handleLogin() {
        console.log('Login clicked');
        // Login logic here
    }

    handleRefresh() {
        console.log('Refresh clicked');
        const refreshBtn = document.querySelector('.btn-refresh');
        refreshBtn.textContent = 'Refreshing...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            refreshBtn.textContent = 'Refresh';
            refreshBtn.disabled = false;
        }, 1000);
    }
}