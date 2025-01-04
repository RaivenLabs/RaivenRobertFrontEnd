export const handler = {
    currentSection: null,
    isInitialized: false,

    init() {
        console.log('🎯 WOOHOO! Appraisal handler init called!');
        if (!this.isInitialized) {
            console.log('🚀 Starting initialization process...');
            this.loadGuide();
            
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
        
        document.addEventListener('click', async (e) => {
            console.log('👆 Click detected somewhere on page');
            
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

        console.log('✅ Event listeners setup complete');
    },

    async loadGuide() {
        try {
            console.log('📖 Importing guide module...');
            const { program } = await import('/application_groups/houseapps/applications/teamappraisal/static/js/guide.js');
            console.log('🎯 Launching guide module...');
            await program.launch('guide', document.querySelector('.engagement-window'));
            console.log('✅ Guide loaded successfully');
        } catch (error) {
            console.error('❌ Error loading application guide:', error);
            this.showComingSoon('Application Guide');
        }
    },

    async loadDashboard() {
        try {
            console.log('📊 Importing dashboard module...');
            // Updated path to point to our new data table module
            const { program } = await import('/application_groups/houseapps/applications/teamappraisal/static/js/data_table.js');
            console.log('🎯 Launching appraisal dashboard...');
    
            // Load and initialize the dashboard in the engagement window
            await program.launch('appraisal-dashboard', document.querySelector('.engagement-window'));
            console.log('✅ Appraisal dashboard loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading appraisal dashboard:', error);
            this.showComingSoon('Appraisal Dashboard'); 
        }
    },
 
    async loadAppraisalCycle() {
        try {
            console.log('🔄 Importing appraisal cycle module...');
            const { program } = await import('/application_groups/houseapps/applications/teamappraisal/static/js/cycle.js');
            console.log('🎯 Launching appraisal cycle module...');
            await program.launch('cycle', document.querySelector('.engagement-window'));
            console.log('✅ Appraisal cycle loaded successfully');
        } catch (error) {
            console.error('❌ Error loading appraisal cycle:', error);
            this.showComingSoon('Appraisal Cycle');
        }
    },
 
    async loadRegistry() {
        try {
            console.log('📋 Importing registry module...');
            const { program } = await import('/application_groups/houseapps/applications/teamappraisal/static/js/registry.js');
            console.log('🎯 Launching registry module...');
            await program.launch('registry', document.querySelector('.engagement-window'));
            console.log('✅ Registry loaded successfully');
        } catch (error) {
            console.error('❌ Error loading program registry:', error);
            this.showComingSoon('Program Registry');
        }
    },
 
    returnToMainMenu() {
        console.log('🏠 Navigating to main menu...');
        window.location.href = '/';
    },
 
    showComingSoon(feature) {
        console.log('🚧 Showing coming soon message for:', feature);
        const content = document.querySelector('.engagement-window');
        content.innerHTML = `
            <div class="coming-soon-message">
                <h2>${feature}</h2>
                <div class="coming-soon-content">
                    <p>Coming Soon!</p>
                    <p>Our team is working hard to bring you this feature.</p>
                </div>
            </div>
        `;
        console.log('✅ Coming soon message displayed');
    }
};

console.log('📦 Appraisal handler module loaded');
handler.init();