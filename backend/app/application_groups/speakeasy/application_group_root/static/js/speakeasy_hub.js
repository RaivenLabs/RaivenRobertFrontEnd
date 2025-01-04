
// Add debug log at top of file
console.log('Loading speakeasy_hub.js...');

export const program = {
    launch(section) {
        console.log(`🎯 ${section} Speakeasy Hub launched!`);
        window.location.href = `/${section}?section=${section}`;
    },

    setupSpeakeasyHandlers() {
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const section = menuItem.dataset.section;
            const type = menuItem.dataset.type;

            console.log('Speakeasy menu item clicked:', section, 'Type:', type);

            try {
                const { handler } = await import('/application_groups/speakeasy/applications/speakeasy/static/handlers/speakeasy_handler.js');
                handler.handleAction(type);
            } catch (error) {
                console.error('Error loading speakeasy handler:', error);
            }
        });
    },

    init() {
        this.setupSpeakeasyHandlers();
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    console.log('Setting up speakeasy handlers immediately');
    const { handler } = await import('/application_groups/speakeasy/applications/speakeasy/static/handlers/speakeasy_handler.js');
    handler.handleAction('initial-setup');
});