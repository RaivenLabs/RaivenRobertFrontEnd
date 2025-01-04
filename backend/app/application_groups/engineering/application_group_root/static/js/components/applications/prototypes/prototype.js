
export const program = {
    async initialize(programType) {
        // Dynamically load CSS
        await this.loadStyles();
        this.render(programType);
        this.setupListeners();
    },

    async loadStyles() {
        // Check if styles are already loaded
        if (!document.querySelector('link[href*="prototype.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'C:\Users\RobertReynolds\Python Projects\Python Development Projects\Transaction Platform Development\transaction_platform_app\app\application_groups\engineering\applications\prototype\static\css\prototype.css';
            
            // Wait for CSS to load
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    render(type) {
        const prototypeHTML = `
            <div class="prototype-overlay">
                <div class="prototype-content">
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
    },

    setupListeners() {
        document.querySelector('.prototype').addEventListener('click', () => {
            const overlay = document.querySelector('.prototype-overlay');
            overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => overlay.remove(), 300);
        });
    }
};

  

