
export const handler = {
    currentSection: null,
    currentApplication: null,  // Add this to store application name
    isInitialized: false,

    init() {
        console.log('🎯 WOOHOO! Sourcing Package handler init called!');
        if (!this.isInitialized) {
            console.log('🚀 Starting initialization process...');
            
            // Get application info from DOM
            const appElement = document.querySelector('[data-view-type="application"]');
            if (appElement) {
                this.currentSection = appElement.dataset.originSection;
                this.currentApplication = appElement.dataset.application;
                console.log(`📍 Initialized with section: ${this.currentSection}, application: ${this.currentApplication}`);
            }
            
            this.loadGuide();
            this.isInitialized = true;
            console.log('✅ Sourcing Package handler initialized');
        }
    },

    // Then modify each load function to use the dynamic paths:
    async loadGuide() {
        try {
            console.log('📖 Importing guide module...');
            const { program } = await import(`/application_groups/${this.currentSection}/applications/${this.currentApplication}/static/js/guide.js`);
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
            const { program } = await import(`/application_groups/${this.currentSection}/applications/${this.currentApplication}/static/js/data_table.js`);
            console.log('🎯 Launching dashboard...');
            await program.launch('dashboard', document.querySelector('.engagement-window'));
            console.log('✅ Dashboard loaded successfully');
        } catch (error) {
            console.error('❌ Error loading dashboard:', error);
            this.showComingSoon('Dashboard');
        }
    },

    async loadAppraisalCycle() {
        try {
            console.log('🔄 Importing cycle module...');
            const { program } = await import(`/application_groups/${this.currentSection}/applications/${this.currentApplication}/static/js/cycle.js`);
            console.log('🎯 Launching cycle module...');
            await program.launch('cycle', document.querySelector('.engagement-window'));
            console.log('✅ Cycle loaded successfully');
        } catch (error) {
            console.error('❌ Error loading cycle:', error);
            this.showComingSoon('Cycle');
        }
    },

    async loadRegistry() {
        try {
            console.log('📋 Importing registry module...');
            const { program } = await import(`/application_groups/${this.currentSection}/applications/${this.currentApplication}/static/js/registry.js`);
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





