
// Add debug log at top of file
console.log('Loading archaeology_hub.js...');

export const program = {
    launch(section) {
        console.log(`🎯 ${section} Dealmaker Hub launched!`);
        window.location.href = `/${section}?section=${section}`;
    },

    setupHouseAppHandlers() {
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const section = menuItem.dataset.section;
            const type = menuItem.dataset.type;

            console.log('Dealmaking menu item clicked:', section, 'Type:', type);

            try {
                const { handler } = await import('/application_groups/archaeology/applications/archaeology/static/handlers/archaeology_handler.js');
                handler.handleAction(type);
            } catch (error) {
                console.error('Error loading archaeology handler:', error);
            }
        });
    },

    init() {
        this.setupHouseAppHandlers();
    }
};

// Replace the old code with this
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Setting up archaeology handlers immediately');
    const { handler } = await import('/application_groups/archaeology/applications/archaeology/static/handlers/archaeology_handler.js');
    handler.handleAction('initial-setup');
});