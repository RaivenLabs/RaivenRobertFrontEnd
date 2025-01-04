





// engineering/handler/handler.js
export const handler = {
    async initialize() {
        console.log('Engineering handler initialized');
        await this.handleEngineeringClick();
        this.setupConsoleListeners();
    },

    setupConsoleListeners() {
        // Listen for clicks within the Engineering Console
        document.addEventListener('click', (e) => {
            if (e.target.closest('.engineering-console')) {
                const programTile = e.target.closest('.program-tile');
                const closeButton = e.target.closest('.close-button');
                const cancelButton = e.target.closest('.btn-secondary');
                const launchButton = e.target.closest('.btn-primary');

                if (closeButton || cancelButton) {
                    this.closeEngineeringConsole();
                } else if (launchButton) {
                    this.launchSelectedEngineeringProgram();
                } else if (programTile) {
                    this.handleEngineeringProgramSelection(programTile);
                }
            }
        });
    },

    async handleEngineeringClick() {
        console.log('Opening Engineering Console');
        try {
            const response = await fetch('/static/data/engineering_programs.json');
            const data = await response.json();
            this.renderEngineeringConsole(data);
        } catch (error) {
            console.error('Error loading engineering programs:', error);
        }
    },

    renderEngineeringConsole(data) {
        const consoleHTML = `
            <div class="engineering-console active">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <h2>${data.title}</h2>
                    <div class="program-groups">
                        ${this.renderEngineeringProgramGroups(data.program_groups)}
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

    renderEngineeringProgramGroups(groups) {
        console.log("Rendering engineering groups");
        return groups.map(group => `
            <div class="program-group">
                <div class="group-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <${group.icon}/>
                    </svg>
                    <h3>${group.name}</h3>
                </div>
                <div class="program-grid">
                    ${this.renderEngineeringPrograms(group.programs)}
                </div>
            </div>
        `).join('');
    },

    renderEngineeringPrograms(programs) {
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

    closeEngineeringConsole() {
        const console = document.querySelector('.engineering-console');
        if (console) {
            console.remove();
        }
    },

    handleEngineeringProgramSelection(programTile) {
        const radio = programTile.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
    },

    async launchSelectedEngineeringProgram() {
        const selectedProgram = document.querySelector('.engineering-console input[type="radio"]:checked');
        if (selectedProgram) {
            const programId = selectedProgram.value;
            this.closeEngineeringConsole();
            
            // Import and launch specific application
            try {
                const { program } = await import(`../applications/${programId}.js`);
                program.launch();
            } catch {
                // Fall back to Coming Soon if program isn't ready
                await this.showComingSoon('Engineering Tools');
            }
        } else {
            alert('Please select an engineering program to launch');
        }
    },

    showComingSoon(type) {
        const comingSoonHTML = `
            <div class="coming-soon-overlay">
                <div class="coming-soon-content">
                    <h2>${type}</h2>
                    <div class="coming-soon-message">
                        <p>Coming Soon!</p>
                        <div class="coming-soon-loader"></div>
                        <p>Our team is working hard to bring you powerful tools for ${type}.</p>
                    </div>
                    <button class="btn btn-primary close-coming-soon">Got it!</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', comingSoonHTML);
    
        // Add event listener for the close button
        document.querySelector('.close-coming-soon').addEventListener('click', () => {
            const overlay = document.querySelector('.coming-soon-overlay');
            overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => overlay.remove(), 300);
        });
    }

}


