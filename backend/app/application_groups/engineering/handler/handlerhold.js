export const handler = {
    async initialize(section) {
        console.log(`${section} handler initialized in handler.js for engineering`);
        await this.handleApplicationClick(section);
        this.setupConsoleListeners();
    },
 
    setupConsoleListeners() {
        // Listen for clicks within any Application Console
        document.addEventListener('click', (e) => {
            if (e.target.closest('.application-console')) {
                const programTile = e.target.closest('.program-tile');
                const closeButton = e.target.closest('.close-button');
                const cancelButton = e.target.closest('.btn-secondary');
                const launchButton = e.target.closest('.btn-primary');
 
                if (closeButton || cancelButton) {
                    this.closeApplicationConsole();
                } else if (launchButton) {
                    this.launchSelectedProgram();
                } else if (programTile) {
                    this.handleProgramSelection(programTile);
                }
            }
        });
    },
 
    async handleApplicationClick(section) {
        console.log(`Opening ${section} Console`);
        try {
            const response = await fetch(`/application_groups/${section}/application_group_root/static/data/${section}_programs.json`);
            const data = await response.json();
            this.renderApplicationConsole(section, data);
        } catch (error) {
            console.error(`Error loading ${section} programs:`, error);
        }
    },
 
    renderApplicationConsole(section, data) {
        const consoleHTML = `
            <div class="${section}-console application-console active">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <h2>${data.title}</h2>
                    <div class="program-groups">
                        ${this.renderProgramGroups(data.program_groups)}
                    </div>
                    <div class="modal-buttons">
                        <button class="btn btn-secondary">Cancel</button>
                        <button class="btn btn-primary">Launch Program</button>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <${group.icon}/>
                    </svg>
                    <h3>${group.name}</h3>
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
        const selectedProgram = document.querySelector('.application-console input[type="radio"]:checked');
        if (selectedProgram) {
            const programId = selectedProgram.value;
            this.closeApplicationConsole();
            
            try {
                const { program } = await import(`../applications/${programId}.js`);
                program.launch();
            } catch {
                await this.showComingSoon('Program');
            }
        } else {
            alert('Please select a program to launch');
        }
    },
 
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
    
        document.querySelector('.close-coming-soon').addEventListener('click', () => {
            document.querySelector('.coming-soon-overlay').remove();
        });
    }
 };
