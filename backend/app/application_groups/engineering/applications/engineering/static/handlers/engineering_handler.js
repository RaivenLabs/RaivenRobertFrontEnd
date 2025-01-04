
export const handler = {
    setupComplete: false,
// Add init method
init() {
    console.log('🚀 Initializing Engineering handler...');
    // Remove URL check - if we're initializing, we want the guide
    this.loadEngineeringGuide().catch(error => {
        console.error('❌ Error loading initial guide:', error);
    });
},





    handleAction(type) {
        console.log('🎮 Dealmaking handler received action:', type);
        
        // For applications-package type, directly load portfolio
        if (type === 'applications-package') {
            console.log('📋 Directly loading Dealmaking Package from handler...');
            this.loadBuildkits();
            return;
        }
        
        // Only set up general listeners once and if needed
        if (!this.setupComplete) {
            this.setupEventListeners();
            this.setupComplete = true;
        }
    },

    


    setupEventListeners() {
        document.addEventListener('click', async (e) => {
            const navItem = e.target.closest('.menu-item');  // Changed this line
            console.log('Click detected, navItem:', navItem);
            if (!navItem) {
                console.log('No menu item found');
                return;
            }



            e.stopPropagation();
            e.preventDefault();

            const section = navItem.dataset.section;
            console.log(`🎯 Handling Engineering navigation: ${section}`);

            switch (section) {
                case 'engineeringtour':
                    console.log('📚 Loading Application Guide...');
                    await this.loadEngineeringGuide();
                    break;
                

                case 'launchdealmaker':
                    console.log('🚀 Loading Dealmaker Launchpad...');
                    await this.loadBuildKits();
                    
                    break;

                 // In engineering_handler.js, modify the switch case to:
                case 'engineeringportfolio':
                    console.log('📋 Loading Transactions In Flight...');
                    await this.loadTransactionsInflight();  
                    break;   

                case 'engineeringfeaturerequests':
                    console.log('📋 Loading Feature Requests...');
                    await this.loadEngineeringFeatureRequestDesk();
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

    setupConsoleListeners() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.application-console')) {
                const engineeringLaunchButton = e.target.closest('.engineering-launch-btn');
                const closeButton = e.target.closest('.close-button');
                
                if (closeButton) {
                    this.closeApplicationConsole();
                } else if (engineeringLaunchButton) {
                    console.log('🚀 Engineering Launch Button clicked');
                    const group = engineeringLaunchButton.closest('.program-group');
                    const selectedProgram = group.querySelector('input[type="radio"]:checked');
                    
                    if (selectedProgram) {
                        const programID = selectedProgram.value;
                        console.log('🎯 Selected program ID:', programID);
                        
                        try {
                            // Remove any existing appElement first
                            const existingAppElement = document.querySelector('[data-view-type="application"]');
                            if (existingAppElement) {
                                console.log('🗑️ Removing existing appElement');
                                existingAppElement.remove();
                            }
    
                            // Create new appElement with debug logging
                            console.log('🏗️ Creating new appElement');
                            const appElement = document.createElement('div');
                            appElement.setAttribute('data-view-type', 'application');
                            appElement.setAttribute('data-origin-section', 'engineering');
                            appElement.setAttribute('data-application', programID);
                            document.body.appendChild(appElement);
                            
                            console.log('📌 AppElement attributes set:', {
                                viewType: appElement.getAttribute('data-view-type'),
                                section: appElement.getAttribute('data-origin-section'),
                                application: appElement.getAttribute('data-application')
                            });
                            
                            console.log('📦 Loading application handler for:', programID);
                            const { handler } = await import(`/application_groups/engineering/applications/${programID}/static/handlers/application_handler.js`);
                            
                            console.log('🚀 Application handler loaded, initializing...');
                            await handler.init();
                            
                            this.closeApplicationConsole();
                        } catch (error) {
                            console.error('❌ Error in launch process:', error);
                            alert('Unable to launch program. Please try again.');
                        }
                    } else {
                        alert('Please select a program from this group first');
                    }
                }
            }
        });
    },
    


    async loadEngineeringGuide() {
        try {
            console.log('📖 Importing guide module...');
            const { program } = await import('/application_groups/engineering/applications/engineering/static/js/guide.js');
            console.log('🎯 Launching guide module...');
            await program.launch('guide', document.querySelector('.engagement-window'));
            console.log('✅ Guide loaded successfully');
        } catch (error) {
            console.error('❌ Error loading application guide:', error);
            this.showComingSoon('Application Guide');
        }
    },

    async loadTransactionsInflight() {
        try {
            console.log('📊 Importing dashboard module...');
            // Updated path to point to our new data table module
            const { program } = await import('/application_groups/engineering/applications/engineering/static/js/data_table.js');
            console.log('🎯 Launching Engineering dashboard...');
    
            // Load and initialize the dashboard in the engagement window
            await program.launch('engineering-dashboard', document.querySelector('.engagement-window'));
            console.log('✅ Engineering dashboard loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading Engineering dashboard:', error);
            this.showComingSoon('Engineering Dashboard'); 
        }
    },

 
    async launchCloser() {
        try {
            console.log('🔄 Importing Engineering cycle module...');
            const { program } = await import('/application_groups/engineering/applications/engineering/static/js/cycle.js');
            console.log('🎯 Launching Engineering cycle module...');
            await program.launch('cycle', document.querySelector('.engagement-window'));
            console.log('✅ Engineering engineer loaded successfully');
        } catch (error) {
            console.error('❌ Error loading engineering cycle:', error);
            this.showComingSoon('Engineering Engineer');
        }
    },


    async loadBuildKits() {
        try {
            console.log('📋 Starting to load Engineering Package ...');
            
            console.log('Making fetch request to:', '/application_groups/engineering/application_group_root/static/data/engineering_programs.json');
            const response = await fetch('/application_groups/engineering/application_group_root/static/data/engineering_programs.json');
            
            console.log('Response received:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log('Parsing JSON response...');
            const data = await response.json();
            
            console.log('Data received:', data);
            
            // Change these lines to use the Engineering functions
            this.launchDealmaker(data);
            this.setupConsoleListeners();
            console.log('✅ Engineering Package loaded successfully');
        } catch (error) {
            console.error('❌ Detailed error loading Engineering Package:', error);
            console.error('Error stack:', error.stack);
            this.showComingSoon('Engineering Package');
        }
    },

    launchDealmaker(data) {

        const customerTitle = this.currentSection === 'engineering' 
        ? (window?.customerConfig?.menu_config?.applications_dock_text || data.title)
        : data.title;
        

        console.log("Launching Dealmaking console with data:", data);
        const consoleHTML = `
            <div class="application-console active">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <h2>${customerTitle}</h2>
                    <div class="program-groups">
                        ${this.renderDealmakerProgramGroups(data.program_groups)}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', consoleHTML);
    },
    
    
  
    
    renderDealmakerProgramGroups(groups) {
        console.log("Made it. (This far)"); 
        
        return groups.map(group => `
            <div class="program-group">
                <div class="group-header">
                    <div class="group-header-left">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <${group.icon}/>
                        </svg>
                        <h3>${group.name}</h3>
                    </div>
                    <button class="btn btn-primary engineering-launch-btn">Launch Program</button>
                </div>
                <div class="program-grid">
                    ${this.renderDealmakerPrograms(group.programs)}
                </div>
            </div>
        `).join('');
    },
    
    renderDealmakerPrograms(programs) {
        return programs.map(program => `
            <label class="program-tile">
                <input type="radio" name="program" value="${program.id}">
                <div class="tile-content">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <${program.icon}/>
                    </svg>
                    <span>${program.name}</span>
                </div>
            </label>
        `).join('');
    },
    
    // Also need these helper methods
    closeApplicationConsole() {
        const console = document.querySelector('.application-console');
        if (console) {
            console.remove();
        }
    },
    
    handleDealmakerProgramSelection(programTile) {
        const radio = programTile.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
    },
    async launchDealmakerProgram() {
        const selectedProgram = document.querySelector('.application-console input[type="radio"]:checked');
        console.log('Launch requested, selected program:', selectedProgram?.value);
        
        if (!selectedProgram) {
            console.log('No program selected');
            return;
        }
        
        const programID = selectedProgram.value;
        console.log(`Launching ${programID} from engineering section`);
        
        try {
            // Close console before attempting to load handler
            this.closeApplicationConsole();
    
            const handlerPath = `/application_groups/engineering/applications/${programID}/static/handlers/application_handler.js`;
            console.log(`Loading handler from: ${handlerPath}`);
            
            const { handler } = await import(handlerPath);
            console.log('Handler loaded successfully:', handler);  
            
            if (handler && typeof handler.initialize === 'function') {
                console.log(`Initializing ${programID} handler`);
                await handler.initialize('engineering', 'application');
            } else {
                console.log(`No handler found for ${programID}, falling back to default route`);
                const route = `/${programID.replace('-', '_')}?section=engineering`;
                window.location.href = route;
            }
        } catch (error) {
            console.error(`Error loading handler for ${programID}:`, error);
            const route = `/${programID.replace('-', '_')}?section=engineering`;
            window.location.href = route;
        }
    },
    

    async loadEngineeringFeatureRequestDesk() {
        try {
            console.log('📋 Importing Support Desk Module...');
            const { program } = await import('/application_groups/engineering/applications/engineering/static/js/support_desk.js');
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

// At the very bottom of the file, after all the handler methods
console.log('📦 Engineering handler module loaded');
handler.init();
