
// Add debug log at top of file
console.log('Loading engagementpackage_hub.js...');

export const program = {
    launch(section) {
        console.log(`🎯 ${section} Hub launched!`);
        window.location.href = `/${section}?section=${section}`;
    },

    setupHouseAppHandlers() {
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const section = menuItem.dataset.section;
            const type = menuItem.dataset.type;

            console.log('HouseApp menu item clicked:', section, 'Type:', type);

            try {
                const { handler } = await import('/application_groups/engagementpackage/applications/engagementpackage/static/handlers/engagementpackage_handler.js');
                handler.handleAction(type);
            } catch (error) {
                console.error('Error loading houseapp handler:', error);
            }
        });
    },

    init() {
        this.setupHouseAppHandlers();
    }
};

// Replace the old code with this
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Setting up houseapp handlers immediately');
    const { handler } = await import('/application_groups/engagementpackage/applications/engagementpackage/static/handlers/engagementpackage_handler.js');
    handler.handleAction('initial-setup');
});