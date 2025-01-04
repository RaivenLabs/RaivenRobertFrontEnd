export const program = {
    async launch(programType) {  // Changed from launch to initialize
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
            link.href = `/application_groups/static/shared/prototype/static/css/prototype.css`;
        
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
                    <h1 style="text-transform: capitalize">${type} Flight Deck</h1>
                    <div class="prototype-message">
                        <p>Coming Soon!</p>
                        <div class="prototype-loader"></div>
                        <p>Our team is working hard to bring you powerful tools for ${type}.</p>
                    </div>
                    <button class="btn btn-primary close-prototype">Got it!</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', prototypeHTML);



         // Add timeout to stop the loader
    setTimeout(() => {
        const loader = document.querySelector('.prototype-loader');
        if (loader) {
            loader.classList.add('done');
        }
    }, 2500);  // 10 seconds
    },
    setupListeners() {
        // Close button click
        document.querySelector('.close-prototype').addEventListener('click', () => {
            const overlay = document.querySelector('.prototype-overlay');
            overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => overlay.remove(), 300);
        });
 
        // Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = document.querySelector('.prototype-overlay');
                if (overlay) {
                    overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
                    setTimeout(() => overlay.remove(), 300);
                }
            }
        });
 
        // Click outside modal
        document.querySelector('.prototype-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('prototype-overlay')) {
                const overlay = document.querySelector('.prototype-overlay');
                overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }
 };



    