// static/js/engineering/applications/comingSoon.js
export const program = {
    async initialize(programType) {
        // Dynamically load CSS
        await this.loadStyles();
        this.render(programType);
        this.setupListeners();
    },

    async loadStyles() {
        // Check if styles are already loaded
        if (!document.querySelector('link[href*="coming_soon.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/static/css/components/coming_soon.css';
            
            // Wait for CSS to load
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    render(type) {
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
    },

    setupListeners() {
        document.querySelector('.close-coming-soon').addEventListener('click', () => {
            const overlay = document.querySelector('.coming-soon-overlay');
            overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => overlay.remove(), 300);
        });
    }
};

  

