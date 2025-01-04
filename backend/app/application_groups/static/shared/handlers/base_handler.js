export const handler = {
    currentSection: null,
    currentType: null,

    async initialize(section, type) {
        this.currentSection = section;
        this.currentType = type;

        console.log(`${this.currentSection} handler initialized in base_handler.js - Type: ${this.currentType}`);
        
        // Check if this should be handled by sandbox handler
        const menuItem = document.querySelector(`[data-section="${section}"]`);
        console.log('Menu item found:', menuItem);
        console.log('Handler type:', menuItem?.dataset.handler);
        
        if (menuItem && menuItem.dataset.handler === 'sandbox') {
            console.log('Deferring to sandbox handler');
            const { handler } = await import('/application_groups/sandbox/applications/sandbox/static/handlers/sandbox_handler.js');
            return handler.handleAction(type);
    }



        // Route to appropriate handler based on type
        switch(this.currentType) {
            case 'applications-package':
                await this.handleApplicationClick();
                break;

            case 'application-packages':
                    await this.handleApplicationClick();
                    break;   

            case 'running-board':
                await this.handleRunningBoardClick();
                break;
            case 'table-reporting':
                await this.handleTableReportingClick();
                break;
            default:
                console.error(`Unknown type: ${this.currentType}`);
        }
        
        this.setupConsoleListeners();
    },

 //Applications Package (Router Management)
    setupConsoleListeners() {
        document.addEventListener('click', (e) => {
            // Application console handling
            if (e.target.closest('.application-console')) {
                const programTile = e.target.closest('.program-tile');
                const closeButton = e.target.closest('.close-button');
                const cancelButton = e.target.closest('.btn-secondary');
                const groupLaunchButton = e.target.closest('.group-launch-btn');
                
                if (closeButton || cancelButton) {
                    this.closeApplicationConsole();
                } else if (groupLaunchButton) {
                    // Get the selected program in this specific group
                    const group = groupLaunchButton.closest('.program-group');
                    const selectedProgram = group.querySelector('input[type="radio"]:checked');
                    if (selectedProgram) {
                        this.launchSelectedProgram();
                    } else {
                        alert('Please select a program from this group first');
                    }
                } else if (programTile) {
                    this.handleProgramSelection(programTile);
                }
            }
    
        });
    },

//applications-package handler
async handleApplicationClick() {
    // Debug step 1: Log which section we're dealing with
    console.log('handleApplicationClick triggered for section:', this.currentSection);
    
    // Debug step 2: Check for sandbox
    if (this.currentSection === 'sandbox') {
        console.log('🎯 Sandbox detected - stopping default handler');
        alert('Sandbox detected - redirecting to sandbox handler');
        return; // Stop execution here
    }
    
    // Debug step 3: Log that we're continuing with normal flow
    console.log('Continuing with normal application console for section:', this.currentSection);
    
    // Original code continues here
    try {
        const response = await fetch(`/application_groups/${this.currentSection}/application_group_root/static/data/${this.currentSection}_programs.json`);
        const data = await response.json();
        this.renderApplicationConsole(data);
    } catch (error) {
        console.error(`Error loading ${this.currentSection} programs:`, error);
    }
},

 

   

    renderApplicationConsole(data) {
        const customerTitle = this.currentSection === 'houseapps' 
        ? (window?.customerConfig?.menu_config?.applications_dock_text || data.title)
        : data.title;
        
        const consoleHTML = `
            <div class="application-console active">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <h2>${customerTitle}</h2>
                    <div class="program-groups">
                        ${this.renderProgramGroups(data.program_groups)}
                    </div>
                   
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', consoleHTML); 
    },
    renderProgramGroups(groups) {
        console.log("Rendering program groups");
        return groups.map(group => `
            <div class="program-group">
                <div class="group-header">
                    <div class="group-header-left">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <${group.icon}/>
                        </svg>
                        <h3>${group.name}</h3>
                    </div>
                    <button class="btn btn-primary group-launch-btn">Launch Program</button>
                </div>
                <div class="program-grid">
                    ${this.renderPrograms(group.programs)}
                </div>
            </div>
        `).join('');
    },
 
    renderPrograms(programs) {
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
 
    closeApplicationConsole() {
        const console = document.querySelector('.application-console');
        if (console) {
            console.remove();
        }
    },
 
    handleProgramSelection(programTile) {
        const radio = programTile.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
    },


    async launchSelectedProgram() {
        // 1. Get the selected program
        const selectedProgram = document.querySelector('.application-console input[type="radio"]:checked');
        if (!selectedProgram) return;
        
        // 2. Get the program ID and track the section we're coming from
        const programID = selectedProgram.value;
        const currentSection = this.currentSection;
        console.log(`Launching ${programID} from ${currentSection} section`);
        
        // 3. Close the application console UI
        this.closeApplicationConsole();
    
        // 4. Handle program launch
        if (programID !== 'prototype') {
            // Convert program ID to route format and navigate
            const route = `/${programID.replace('-', '_')}?section=${currentSection}`;
            window.location.href = route;
        } else {
            // Handle prototype applications
            const programModule = await import('/application_groups/static/shared/prototype/static/js/prototype.js');
            const { program } = programModule;
            program.launch(programName, document.querySelector('.container'));
        }
    },



      
    // Update showComingSoon to handle escape and outside clicks
    showComingSoon(type) {
        const comingSoonHTML = `
            <div class="coming-soon-overlay application-console">
                <div class="coming-soon-content">
                    <h2>${type}</h2>
                    <div class="coming-soon-message">
                        <p>Coming Soon!</p>
                        <p>Our team is working hard to bring you powerful tools for ${type}.</p>
                    </div>
                    <button class="btn btn-primary close-coming-soon">Got it!</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', comingSoonHTML);
    
        // Close on button click
        document.querySelector('.close-coming-soon').addEventListener('click', () => {
            document.querySelector('.coming-soon-overlay')?.remove();
        });
    
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelector('.coming-soon-overlay')?.remove();
            }
        });
    
        // Close on outside click
        document.querySelector('.coming-soon-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('coming-soon-overlay')) {
                e.target.remove();
            }    


  
        });
    },
//Running-Board (Station Package Management)
async handleRunningBoardClick() {
    try {
        // First check if this is the company report menu item
        const menuItem = document.querySelector('.menu-item[data-section="companyreport"]');
        const isCompanyReport = menuItem && this.currentSection === 'companyreport';
        const isConfiguration = this.currentSection === 'configuration';
        const isOperations = this.currentSection === 'operations';
        const isPlatformTour = this.currentSection === 'platformtour';
       
        console.log(`Opening ${this.currentSection} Running Board`);
        
        let programModule;
        // dashboard path
        if (isCompanyReport || isConfiguration || isOperations || isPlatformTour) {
            try {
                console.log(`Loading ${this.currentSection} module`);
                programModule = await import(`/application_groups/${this.currentSection}/application_group_root/static/js/${this.currentSection}.js`);
                console.log(`Successfully loaded ${this.currentSection} module`);
            } catch (specificError) {
                console.log(`Failed to load ${this.currentSection} module:`, specificError);
                throw specificError;
            }
        } else {
            // Hub Path
            try {
                console.log('Before importing Menu Section Hub for Landing Page Sections');
                programModule = await import(`/application_groups/${this.currentSection}/application_group_root/static/js/${this.currentSection}_hub.js`);
                console.log('After importing Menu Section Hub');
                console.log('Found section-specific module');
            } catch (sectionError) {
                console.log('Section-specific module not found, trying prototype:', sectionError);
                
                try {
                    programModule = await import(`/application_groups/${this.currentSection}/applications/${this.currentSection}/static/handlers/${this.currentSection}_handler.js`);
                    console.log('Found module');
                } catch (handlerError) {
                    console.log('Section handler not found, trying section-specific:', handlerError);
                    
                    try {
                        programModule = await import('/application_groups/static/shared/prototype/static/js/prototype.js');
                        console.log('Found prototype module');
                    } catch (prototypeError) {
                        console.log('Prototype not found:', prototypeError);
                        throw prototypeError;
                    }
                }
            }
        }

        // If we got a module, launch it
        const { program } = programModule;
        const targetElement = document.querySelector('.engagement-window');
        console.log(`Launching program in engagement-window`);
        program.launch(this.currentSection, targetElement);
        
    } catch (error) {
        console.error(`Error loading ${this.currentSection} board:`, error);
        await this.showRunningBoardComingSoon();
    }
},

    showRunningBoardComingSoon() {
        const engagementWindow = document.querySelector('.engagement-window');
        engagementWindow.innerHTML = `
            <div class="running-board-content">
                <h2 style="text-transform: capitalize">${this.currentSection} Command Post</h2>
                <div class="coming-soon-message">
                    <p>Coming Soon!</p>
                    <p>Our team is working hard to bring you this command post.</p>
                </div>
            </div>
        `;
    },



    //Table Reporting Package Management
    
    async handleTableReportingClick() {
        console.log(`Opening ${this.currentSection} Table Report`);
        try {
            let programModule;
            
            // Try to load shared table component first
            try {
                programModule = await import('/application_groups/static/shared/table/static/js/data_table.js');
            } catch {
                // If no shared table, try section-specific implementation
                try {
                    programModule = await import(`/application_groups/${this.currentSection}/application_group_root/static/js/${this.currentSection}_table.js`);
                } catch {
                    await this.showTableReportingComingSoon();
                    return;
                }
            }

            const { program } = programModule;
            const engagementWindow = document.querySelector('.engagement-window');
            program.launch(this.currentSection, engagementWindow);
            
        } catch (error) {
            console.error(`Error loading ${this.currentSection} table:`, error);
            await this.showTableReportingComingSoon();
        }
    },
    showTableReportingComingSoon() {
        const engagementWindow = document.querySelector('.engagement-window');
        engagementWindow.innerHTML = `
            <div class="table-reporting-content">
                <h1 style="text-transform: capitalize">${this.currentSection} Data Center</h1>
                <div class="coming-soon-message">
                    <p>Coming Soon!</p>
                    <p>Our team is working hard to bring you this data center.</p>
                </div>
            </div>
        `;
    }
    



 };




 

