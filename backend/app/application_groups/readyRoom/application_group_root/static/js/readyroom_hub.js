
// Add debug log at top of file
console.log('Loading readyroom_hub.js...');

export const program = {
    launch(section) {
        console.log(`🎯 ${section} Ready Room Hub launched!`);
        window.location.href = `/${section}?section=${section}`;
    },

    setupHouseAppHandlers() {
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const section = menuItem.dataset.section;
            const type = menuItem.dataset.type;

            console.log('Ready Room menu item clicked:', section, 'Type:', type);

            try {
                const { handler } = await import('/application_groups/readyroom/applications/readyroom/static/handlers/readyroom_handler.js');
                handler.handleAction(type);
            } catch (error) {
                console.error('Error loading readyroom handler:', error);
            }
        });
    },

    init() {
        this.setupHouseAppHandlers();
    }
};

// Replace the old code with this
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Setting up Ready Room handlers immediately');
    const { handler } = await import('/application_groups/readyroom/applications/readyroom/static/handlers/readyroom_handler.js');
    handler.handleAction('initial-setup');
});