
export const handler = {
    setupComplete: false,
// Add init method
init() {
    console.log('🚀 Initializing Exchange handler...');
    // Remove URL check - if we're initializing, we want the guide
    this.loadExchangeGuide().catch(error => {
        console.error('❌ Error loading initial guide:', error);
    });
},





    handleAction(type) {
        console.log('🎮 Exchange handler received action:', type);
        
        // For applications-package type, directly load portfolio
        if (type === 'applications-package') {
            console.log('📋 Directly loading Exchange Rosters from handler...');
            this.loadExchangePortfolio();
            return;
        }
        
        // Only set up general listeners once and if needed
        if (!this.setupComplete) {
            this.setupEventListeners();
            this.setupComplete = true;
        }
    },

    async loadExchangePortfolio() {
        try {
            console.log('📋 Starting to load Exchange Rosters ...');
            
            console.log('Making fetch request to:', '/application_groups/exchange/application_group_root/static/data/exchange_programs.json');
            const response = await fetch('/application_groups/exchange/application_group_root/static/data/exchange_programs.json');
            
            console.log('Response received:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log('Parsing JSON response...');
            const data = await response.json();
            
            console.log('Data received:', data);
            
            // Change these lines to use the Exchange functions
            this.renderExchangeConsole(data);
            this.setupConsoleListeners();
            console.log('✅ Exchange Rosters loaded successfully');
        } catch (error) {
            console.error('❌ Detailed error loading Exchange rosters:', error);
            console.error('Error stack:', error.stack);
            this.showComingSoon('Exchange Rosters');
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
            console.log(`🎯 Handling Exchange navigation: ${section}`);

            switch (section) {
                case 'exchangetour':
                    console.log('📚 Loading Application Guide...');
                    await this.loadExchangeGuide();
                    break;
                

                case 'launchexchangeengineer':
                    console.log('🚀 Loading Exchange Launcher...');
                    await this.launchExchangeEngineer();
                    break;

                 // In exchange_handler.js, modify the switch case to:
                case 'exchangeportfolio':
                    console.log('📋 Loading Exchange Console...');
                    await this.loadExchangePortfolio();  // Use this instead of renderExchangeProgramGroups
                    break;   

                case 'exchangeservicerequests':
                    console.log('📋 Loading Service Requests...');
                    await this.loadExchangeRequestDesk();
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
                const exchangeLaunchButton = e.target.closest('.exchange-launch-btn');
                const closeButton = e.target.closest('.close-button');
                
                if (closeButton) {
                    this.closeApplicationConsole();
                } else if (exchangeLaunchButton) {
                    console.log('🚀 Exchange Launch Button clicked');
                    const group = exchangeLaunchButton.closest('.program-group');
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
                            appElement.setAttribute('data-origin-section', 'exchange');
                            appElement.setAttribute('data-application', programID);
                            document.body.appendChild(appElement);
                            
                            console.log('📌 AppElement attributes set:', {
                                viewType: appElement.getAttribute('data-view-type'),
                                section: appElement.getAttribute('data-origin-section'),
                                application: appElement.getAttribute('data-application')
                            });
                            
                            console.log('📦 Loading application handler for:', programID);
                            const { handler } = await import(`/application_groups/exchange/applications/${programID}/static/handlers/application_handler.js`);
                            
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
    


    async loadExchangeGuide() {
        try {
            console.log('📖 Importing guide module...');
            const { program } = await import('/application_groups/exchange/applications/exchange/static/js/guide.js');
            console.log('🎯 Launching guide module...');
            await program.launch('guide', document.querySelector('.engagement-window'));
            console.log('✅ Guide loaded successfully');
        } catch (error) {
            console.error('❌ Error loading application guide:', error);
            this.showComingSoon('Application Guide');
        }
    },

    async loadExchangeDashboard() {
        try {
            console.log('📊 Importing dashboard module...');
            // Updated path to point to our new data table module
            const { program } = await import('/application_groups/exchange/applications/exchange/static/js/data_table.js');
            console.log('🎯 Launching Exchange dashboard...');
    
            // Load and initialize the dashboard in the engagement window
            await program.launch('exchange-dashboard', document.querySelector('.engagement-window'));
            console.log('✅ Exchange dashboard loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading Exchange dashboard:', error);
            this.showComingSoon('Exchange Dashboard'); 
        }
    },

 
    async launchExchangeEngineer() {
        try {
            console.log('🔄 Importing Exchange cycle module...');
            const { program } = await import('/application_groups/exchange/applications/exchange/static/js/cycle.js');
            console.log('🎯 Launching Exchange cycle module...');
            await program.launch('cycle', document.querySelector('.engagement-window'));
            console.log('✅ Exchange engineer loaded successfully');
        } catch (error) {
            console.error('❌ Error loading exchange cycle:', error);
            this.showComingSoon('Exchange Engineer');
        }
    },
    renderExchangeConsole(data) {

        const customerTitle = this.currentSection === 'exchange' 
        ? (window?.customerConfig?.menu_config?.applications_dock_text || data.title)
        : data.title;
        

        console.log("Rendering Exchange console with data:", data);
        const consoleHTML = `
            <div class="application-console active">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <h2>${customerTitle}</h2>
                    <div class="program-groups">
                        ${this.renderExchangeProgramGroups(data.program_groups)}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', consoleHTML);
    },
    
    
  
    
    renderExchangeProgramGroups(groups) {
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
                    <button class="btn btn-primary exchange-launch-btn">Launch Program</button>
                </div>
                <div class="program-grid">
                    ${this.renderExchangePrograms(group.programs)}
                </div>
            </div>
        `).join('');
    },
    
    renderExchangePrograms(programs) {
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
    
    handleExchangeProgramSelection(programTile) {
        const radio = programTile.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
    },
    async launchExchangeProgram() {
        const selectedProgram = document.querySelector('.application-console input[type="radio"]:checked');
        console.log('Launch requested, selected program:', selectedProgram?.value);
        
        if (!selectedProgram) {
            console.log('No program selected');
            return;
        }
        
        const programID = selectedProgram.value;
        console.log(`Launching ${programID} from exchange section`);
        
        try {
            // Close console before attempting to load handler
            this.closeApplicationConsole();
    
            const handlerPath = `/application_groups/exchange/applications/${programID}/static/handlers/application_handler.js`;
            console.log(`Loading handler from: ${handlerPath}`);
            
            const { handler } = await import(handlerPath);
            console.log('Handler loaded successfully:', handler);  
            
            if (handler && typeof handler.initialize === 'function') {
                console.log(`Initializing ${programID} handler`);
                await handler.initialize('exchange', 'application');
            } else {
                console.log(`No handler found for ${programID}, falling back to default route`);
                const route = `/${programID.replace('-', '_')}?section=exchange`;
                window.location.href = route;
            }
        } catch (error) {
            console.error(`Error loading handler for ${programID}:`, error);
            const route = `/${programID.replace('-', '_')}?section=exchange`;
            window.location.href = route;
        }
    },
    

    async loadExchangeRequestDesk() {
        try {
            console.log('📋 Importing Support Desk Module...');
            const { program } = await import('/application_groups/exchange/applications/exchange/static/js/support_desk.js');
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
console.log('📦 Exchange handler module loaded');
handler.init();
