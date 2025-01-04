// Import configuration data and helpers
import { 
    configurationData,
    helpers
} from '../data/configuration_program.js';

export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        await this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="configuration.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/configuration/application_group_root/static/css/configuration.css';
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    async render(sectionName, targetElement) {
        // We'll fetch current configuration from platform config service
        targetElement.innerHTML = `
        <div class="configuration-panel">
        <header class="config-header">
            <h1>Platform Configuration</h1>
            <p>Manage platform settings and preferences</p>
        </header>

        <div class="config-grid">
            <!-- Company Profile Section -->
            <section class="config-section card">
                <h2>Company Profile</h2>
                <div class="setting-group">
                    <label for="customerSelect">Active Company Profile</label>
                    <select id="customerSelect" class="setting-input">
                        ${configurationData.settings.company_report.options.map(company => `
                            <option value="${company.id}" 
                                ${company.id === configurationData.settings.company_report.current_customer_id ? 'selected' : ''}>
                                ${company.name}
                            </option>
                        `).join('')}
                    </select>
                    <p class="setting-description">${configurationData.settings.company_report.description}</p>
                </div>
            </section>

            <!-- Welcome Screen Section -->
            <section class="config-section card">
                <h2>Welcome Screen</h2>
                <div class="setting-group">
                    <label for="welcomeSelect">Welcome Screen Template</label>
                    <select id="welcomeSelect" class="setting-input">
                        ${configurationData.settings.welcome_screen.options.map(template => `
                            <option value="${template.id}"
                                ${template.id === configurationData.settings.welcome_screen.current_template ? 'selected' : ''}>
                                ${template.name}
                            </option>
                        `).join('')}
                    </select>
                    <p class="setting-description">Customize the welcome experience</p>
                </div>
            </section>

            <!-- Application Dock Section -->
            <section class="config-section card">
                <h2>Application Dock</h2>
                <div class="setting-group">
                    <label for="dockSelect">Dock Branding</label>
                    <select id="dockSelect" class="setting-input">
                        ${configurationData.settings.application_dock.options.map(dock => `
                            <option value="${dock.id}"
                                ${dock.id === configurationData.settings.application_dock.current_customer_id ? 'selected' : ''}>
                                ${dock.name} - ${dock.dockTitle}
                            </option>
                        `).join('')}
                    </select>
                    <p class="setting-description">Customize the application dock appearance</p>
                </div>
            </section>

            <!-- House Apps Section -->
            <section class="config-section card">
                <h2>House Applications</h2>
                <div class="setting-group">
                    <label for="appsSelect">Apps Customization</label>
                    <select id="appsSelect" class="setting-input">
                        ${configurationData.settings.house_apps.options.map(apps => `
                            <option value="${apps.id}"
                                ${apps.id === configurationData.settings.house_apps.current_customer_id ? 'selected' : ''}>
                                ${apps.name} - ${apps.appTitle}
                            </option>
                        `).join('')}
                    </select>
                    <p class="setting-description">Customize house applications appearance and behavior</p>
                </div>
            </section>
        </div>

        <div class="setting-actions">
            <button class="btn-save" id="saveAllConfig">Save All Changes</button>
        </div>
    </div>  
        `;

        // Load configuration sections
        await this.loadConfigSections();
    },

    async loadConfigSections() {
        const configGrid = document.querySelector('.config-grid');
        
        // Clear existing sections
        configGrid.innerHTML = '';
        
        // Add configuration sections
        configGrid.appendChild(await this.createCompanySection());
        configGrid.appendChild(await this.createWelcomeSection());
        configGrid.appendChild(await this.createDockSection());
        configGrid.appendChild(await this.createAppsSection());
    },

    async createCompanySection() {
        const section = document.createElement('section');
        section.className = 'config-section card';
        section.innerHTML = `
            <h2>Company Profile</h2>
            <div class="setting-group">
                <label for="customerSelect">Active Company Profile</label>
                <select id="customerSelect" class="setting-input">
                    <!-- Will be populated with company options -->
                </select>
                <p class="setting-description">Selected company profile to display</p>
            </div>
        `;
        return section;
    },

    async createWelcomeSection() {
        const section = document.createElement('section');
        section.className = 'config-section card';
        section.innerHTML = `
            <h2>Welcome Screen</h2>
            <div class="setting-group">
                <label for="welcomeSelect">Welcome Screen Template</label>
                <select id="welcomeSelect" class="setting-input">
                    <!-- Will be populated with welcome screen options -->
                </select>
                <p class="setting-description">Customize the welcome experience</p>
            </div>
        `;
        return section;
    },

    async createDockSection() {
        const section = document.createElement('section');
        section.className = 'config-section card';
        section.innerHTML = `
            <h2>Application Dock</h2>
            <div class="setting-group">
                <label for="dockSelect">Dock Branding</label>
                <select id="dockSelect" class="setting-input">
                    <!-- Will be populated with dock options -->
                </select>
                <p class="setting-description">Customize the application dock appearance</p>
            </div>
        `;
        return section;
    },

    async createAppsSection() {
        const section = document.createElement('section');
        section.className = 'config-section card';
        section.innerHTML = `
            <h2>House Applications</h2>
            <div class="setting-group">
                <label for="appsSelect">Apps Customization</label>
                <select id="appsSelect" class="setting-input">
                    <!-- Will be populated with apps options -->
                </select>
                <p class="setting-description">Customize house applications appearance and behavior</p>
            </div>
        `;
        return section;
    },

    setupListeners() {
        // Simple tracking of changes
        this.pendingChanges = {};

        // Add change listeners for all selects
        ['customerSelect', 'welcomeSelect', 'dockSelect', 'appsSelect'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                this.pendingChanges[id] = e.target.value;
                console.log(`${id} changed to: ${e.target.value}`);
            });
        });

        // Save button handler
        document.getElementById('saveAllConfig')?.addEventListener('click', async () => {
            try {
                await this.saveChanges();
                this.showToast('Settings saved successfully');
            } catch (error) {
                console.error('Error saving settings:', error);
                this.showToast('Error saving settings', 'error');
            }
        });
    },

    async saveChanges() {
        // Will be implemented once we have platform config service
        console.log('Saving changes:', this.pendingChanges);
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

