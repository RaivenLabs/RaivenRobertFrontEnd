
// Add debug log at top of file
console.log('Loading sandbox_hub.js...');

export const program = {
    launch(section) {
        console.log(`🎯 ${section} Hub launched!`);
        window.location.href = `/${section}?section=${section}`;
    },

    setupSandboxHandlers() {
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const section = menuItem.dataset.section;
            const type = menuItem.dataset.type;

            console.log('Sandbox menu item clicked:', section, 'Type:', type);

            try {
                const { handler } = await import('/application_groups/sandbox/applications/sandbox/static/handlers/sandbox_handler.js');
                handler.handleAction(type);
            } catch (error) {
                console.error('Error loading sandbox handler:', error);
            }
        });
    },

    init() {
        this.setupSandboxHandlers();
    }
};

// Replace the old code with this
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Setting up sandbox handlers immediately');
    const { handler } = await import('/application_groups/sandbox/applications/sandbox/static/handlers/sandbox_handler.js');
    handler.handleAction('initial-setup');
});