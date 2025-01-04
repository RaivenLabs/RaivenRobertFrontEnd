export const handler = {
    currentSection: null,
    isInitialized: false,
 
    init() {
        console.log('🎯 WOOHOO! Appraisal handler init called!');
        if (!this.isInitialized) {
            console.log('🚀 Starting initialization process...');
            
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
        
        const navItems = document.querySelectorAll('.application-nav-item');
        console.log(`🔍 Found ${navItems.length} application nav items on page`);
        
        this.setupEventListeners();
    },
 
    setupEventListeners() {
        console.log('🎮 Setting up event listeners...');
 
        const handleClick = async (e) => {
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
 
            const boundHandler = {
                appraisaltour: this.loadGuide.bind(this),
                appraisalcommand: this.loadDashboard.bind(this),
                launchappraisal: this.loadAppraisalCycle.bind(this),
                registry: this.loadRegistry.bind(this),
                mainmenu: this.returnToMainMenu.bind(this)
            };
 
            try {
                if (boundHandler[section]) {
                    await boundHandler[section]();
                } else {
                    console.log(`❓ Unknown section: ${section}`);
                }
            } catch (error) {
                console.error('Error handling click:', error);
                this.showComingSoon(section);
            }
        };
 
        document.addEventListener('click', handleClick.bind(this));
        console.log('✅ Event listeners setup complete');
    },
 
    async loadGuide() {
        try {
            console.log('📖 Importing guide module...');
            const { program } = await import('/application_groups/houseapps/applications/team-appraisal/static/js/guide.js');
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
            const { program } = await import('/application_groups/houseapps/applications/team-appraisal/static/js/appraisal.js');
            console.log('🎯 Launching dashboard module...');
            await program.launch('dashboard', document.querySelector('.engagement-window'));
            console.log('✅ Dashboard loaded successfully');
        } catch (error) {
            console.error('❌ Error loading application dashboard:', error);
            this.showComingSoon('Application Dashboard');
        }
    },
 
    async loadAppraisalCycle() {
        try {
            console.log('🔄 Importing appraisal cycle module...');
            const { program } = await import('/application_groups/houseapps/applications/team-appraisal/static/js/cycle.js');
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
            const { program } = await import('/application_groups/houseapps/applications/team-appraisal/static/js/registry.js');
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
 
 // Initialize the handler
 console.log('📦 Appraisal handler module loaded');
 handler.init();