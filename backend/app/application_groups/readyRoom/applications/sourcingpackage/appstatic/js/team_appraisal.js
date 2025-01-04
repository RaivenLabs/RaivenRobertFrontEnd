// Set the current customer - easy to change for testing
const CURRENT_CUSTOMER_ID = "TECH001";  // Hawkeye Holdings

// Import all helper functions
import {
    getCustomerById,
    getCustomersByStatus,
    getCustomersByRegion,
    getCustomersByIndustry,
    getCustomersByEngagementLevel,
    getPrimaryContact,
    getCustomerContacts,
    getCustomersByAccountManager,
    getCustomersByRiskRating,
    getCustomersWithRecentReviews,
    getFirmHistory,
    getPracticeAreasByTier,
    getInnovationInitiatives,
    getServiceOfferings,
    getGlobalPresence,
    getUniqueRegions,
    getUniqueIndustries,
    generateCustomerMetrics,
    compareFirms
} from '../data/companyreport_program.js';

// Make helper functions available to the module
const helpers = {
    getCustomerById,
    getCustomersByStatus,
    getCustomersByRegion,
    getCustomersByIndustry,
    getCustomersByEngagementLevel,
    getPrimaryContact,
    getCustomerContacts,
    getCustomersByAccountManager,
    getCustomersByRiskRating,
    getCustomersWithRecentReviews,
    getFirmHistory,
    getPracticeAreasByTier,
    getInnovationInitiatives,
    getServiceOfferings,
    getGlobalPresence,
    getUniqueRegions,
    getUniqueIndustries,
    generateCustomerMetrics,
    compareFirms
};

export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        const customer = await this.loadCustomerData();
        this.render(sectionName, targetElement, customer);
        this.setupListeners();
    },

    async loadCustomerData() {
        try {
            const customer = helpers.getCustomerById(CURRENT_CUSTOMER_ID);
            if (!customer) {
                throw new Error(`Customer ${CURRENT_CUSTOMER_ID} not found`);
            }
            return customer;
        } catch (error) {
            console.error('Error loading customer data:', error);
            throw error;
        }
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="companyreport.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/houseappsapplications/team-appraisal/static/css/companyreport.css';
        
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    render(sectionName, targetElement, customer) {
        targetElement.innerHTML = `
            <div class="company-report">
                <header class="company-header">
                    <h1>${customer.company_name}</h1>
                    <div class="company-overview">
                        <span class="industry">${customer.overview.industry}</span>
                        <span class="category">${customer.overview.category}</span>
                        <span class="revenue">${customer.overview.annual_revenue}</span>
                    </div>
                </header>

                <div class="report-grid">
                    <!-- Key Metrics Section -->
                    <section class="metrics-section card">
                        <h2>Global Presence</h2>
                        <div class="metrics-grid">
                            <div class="metric">
                                <span class="metric-value">${customer.key_metrics.global_presence.countries}</span>
                                <span class="metric-label">Countries</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${customer.key_metrics.global_presence.offices}</span>
                                <span class="metric-label">Offices</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${customer.key_metrics.global_presence.regions.length}</span>
                                <span class="metric-label">Regions</span>
                            </div>
                        </div>
                    </section>

                    <!-- Practice Areas Section -->
                    <section class="practices-section card">
                        <h2>Core Competencies</h2>
                        <div class="practices-list">
                            ${customer.key_metrics.practice_areas.map(practice => `
                                <div class="practice-item">
                                    <span class="practice-name">${practice.name}</span>
                                    <span class="practice-level">${practice.expertise_level}</span>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <!-- Innovation Section -->
                    <section class="innovation-section card">
                        <h2>Innovation Initiatives</h2>
                        <div class="innovation-grid">
                            <div class="tech-innovations">
                                <h3>Technology</h3>
                                <ul>
                                    ${customer.innovation.technology.map(tech => 
                                        `<li>${tech}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="sustainability-innovations">
                                <h3>Sustainability</h3>
                                <ul>
                                    ${customer.innovation.sustainability.map(initiative => 
                                        `<li>${initiative}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Timeline Section -->
                    <section class="timeline-section card">
                        <h2>Key Milestones</h2>
                        <div class="timeline">
                            ${customer.milestones.map(milestone => `
                                <div class="timeline-item">
                                    <span class="year">${milestone.year}</span>
                                    <span class="event">${milestone.event}</span>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <!-- Contacts Section -->
                    <section class="contacts-section card">
                        <h2>Key Contacts</h2>
                        <div class="contacts-grid">
                            ${customer.contacts.map(contact => `
                                <div class="contact-card ${contact.primary ? 'primary' : ''}">
                                    <h3>${contact.name}</h3>
                                    <p class="title">${contact.title}</p>
                                    <p class="location">${contact.location}</p>
                                    <a href="mailto:${contact.email}">${contact.email}</a>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </div>
            </div>
        `;
    },

    async loadComparableCompanies(industry) {
        return helpers.getCustomersByIndustry(industry);
    },

    async loadIndustryMetrics() {
        return helpers.generateCustomerMetrics();
    },

    async compareWithCompany(otherCompanyId) {
        return helpers.compareFirms(CURRENT_CUSTOMER_ID, otherCompanyId);
    },

    setupListeners() {
        // Add any interactive functionality here
    }
};