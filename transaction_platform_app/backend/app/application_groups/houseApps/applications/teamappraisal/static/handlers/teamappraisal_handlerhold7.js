export const handler = {
    currentSection: null,
    isInitialized: false,

    init() {
        console.log('🎯 WOOHOO! Appraisal handler init called!');
        if (!this.isInitialized) {
            console.log('🚀 Starting initialization process...');
            
            // Ensure we initialize even if event delegate skips our events
            if (document.readyState === 'loading') {
                console.log('📄 DOM still loading, waiting...');
                document.addEventListener('DOMContentLoaded', async () => {
                    await this.doInitialize();
                });
            } else {
                console.log('📄 DOM already loaded, initializing immediately...');
                this.doInitialize();
            }
        }
    },

    async doInitialize() {
        try {
            console.log('🌟 Calling initialize...');
            await this.initialize('appraisals', 'application');
            this.isInitialized = true;
            console.log('✅ Appraisal handler successfully initialized');
        } catch (error) {
            console.error('❌ Error in initialization:', error);
        }
    },

    async initialize(section, type) {
        console.log('🔄 Initialize method called');
        this.currentSection = section;
        console.log(`📍 Appraisal handler initialized for ${section}`);
        
        // Check if we have nav items immediately
        const navItems = document.querySelectorAll('.application-nav-item');
        console.log(`🔍 Found ${navItems.length} application nav items on page`);
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        console.log('🎮 Setting up event listeners...');
        
        // Get all application areas
        const appAreas = document.querySelectorAll('[data-view-type="application"]');
        appAreas.forEach(area => {
            area.addEventListener('click', async (e) => {
                console.log('👆 Click detected in application area');
                
                const navItem = e.target.closest('.application-nav-item');
                if (!navItem) {
                    console.log('⚠️ Click was not on an application nav item');
                    return;
                }

                e.stopPropagation();
                e.preventDefault();

                const section = navItem.dataset.section || navItem.getAttribute('section');
                console.log(`🎯 Click on nav item! Section: ${section}`);

                switch (section) {
                    case 'appraisaltour':
                        console.log('📚 Loading Application Guide...');
                        await this.loadGuide();
                        break;
                    
                    case 'appraisalcommand':
                        console.log('🎛️ Loading Application Dashboard...');
                        await this.loadDashboard();
                        break;

                    case 'launchappraisal':
                        console.log('🚀 Loading Appraisal Cycle...');
                        await this.loadAppraisalCycle();
                        break;

                    case 'registry':
                        console.log('📋 Loading Program Registry...');
                        await this.loadRegistry();
                        break;

                    case 'mainmenu':
                        console.log('🏠 Returning to Main Menu...');
                        this.returnToMainMenu();
                        break;

                    default:
                        console.log(`❓ Unknown section: ${section}`);
                }
            });
        });

        console.log('✅ Event listeners setup complete');
    },

    // Rest of your methods remain the same...
    async loadGuide() { /* ... */ },
    async loadDashboard() { /* ... */ },
    async loadAppraisalCycle() { /* ... */ },
    async loadRegistry() { /* ... */ },
    returnToMainMenu() { /* ... */ },
    showComingSoon() { /* ... */ }
};

console.log('📦 Appraisal handler module loaded');
handler.init();