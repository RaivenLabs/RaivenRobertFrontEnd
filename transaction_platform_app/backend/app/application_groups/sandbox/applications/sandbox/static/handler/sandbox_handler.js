export const handler = {
    setupComplete: false,

    handleAction(type) {
        console.log('🎮 Sandbox handler received action:', type);
        
        // Only set up listeners once
        if (!this.setupComplete) {
            this.setupEventListeners();
            this.setupComplete = true;
        }
    },

    setupEventListeners() {
        document.addEventListener('click', async (e) => {
            const navItem = e.target.closest('.application-nav-item');
            if (!navItem) return;

            e.stopPropagation();
            e.preventDefault();

            const section = navItem.dataset.section;
            console.log(`🎯 Handling sandbox navigation: ${section}`);

            switch (section) {
                case 'sandboxtour':
                    console.log('📚 Loading Application Guide...');
                    await this.loadGuide();
                    break;
                
                case 'sandboxprojects':
                    console.log('🎛️ Loading Application Dashboard...');
                    await this.loadDashboard();
                    break;

                case 'launchsandboxengineer':
                    console.log('🚀 Loading Sandbox Launcher...');
                    await this.launchSandboxEngineer();
                    break;

                case 'sandboxapplications':
                    console.log('📋 Loading Sandbox Portfolio...');
                    await this.loadSandboxPortfolio();
                    break;

                case 'servicerequests':
                    console.log('📋 Loading Service Requests...');
                    await this.loadSupportRequestDesk();
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
            const { program } = await import('/application_groups/sandbox/applications/sandbox/static/js/guide.js');
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
            const { program } = await import('/application_groups/sandbox/applications/sandbox/static/js/data_table.js');
            console.log('🎯 Launching sandbox dashboard...');
    
            // Load and initialize the dashboard in the engagement window
            await program.launch('sandbox-dashboard', document.querySelector('.engagement-window'));
            console.log('✅ Sandbox dashboard loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading sandbox dashboard:', error);
            this.showComingSoon('Sandbox Dashboard'); 
        }
    },
 
    async launchSandboxEngineer() {
        try {
            console.log('🔄 Importing sandbox cycle module...');
            const { program } = await import('/application_groups/sandbox/applications/sandbox/static/js/cycle.js');
            console.log('🎯 Launching sandbox cycle module...');
            await program.launch('cycle', document.querySelector('.engagement-window'));
            console.log('✅ Sandbox engineer loaded successfully');
        } catch (error) {
            console.error('❌ Error loading sandbox cycle:', error);
            this.showComingSoon('Sandbox Engineer');
        }
    },
 
    async loadSandboxPortfolio() {
        try {
            console.log('📋 Importing registry module...');
            const { program } = await import('/application_groups/sandbox/applications/sandbox/static/js/registry.js');
            console.log('🎯 Launching registry module...');
            await program.launch('registry', document.querySelector('.engagement-window'));
            console.log('✅ Registry loaded successfully');
        } catch (error) {
            console.error('❌ Error loading program registry:', error);
            this.showComingSoon('Program Registry');
        }
    },


    async loadSupportRequestDesk() {
        try {
            console.log('📋 Importing Support Desk Module...');
            const { program } = await import('/application_groups/sandbox/applications/sandbox/static/js/support_desk.js');
            console.log('🎯 Launching Support Desk module...');
            await program.launch('support_desk', document.querySelector('.engagement-window'));
            console.log('✅ Support Desk Module loaded successfully');
        } catch (error) {
            console.error('❌ Error loading Support Desk Module:', error);
            this.showComingSoon('Support Desk Module');
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

console.log('📦 Sandbox handler module loaded');
