// Import sample data
import { appraisalData } from '../data/appraisal-sample-data.js';

export const program = {
    launch: function(section, container) {
        // Render initial structure
        container.innerHTML = `
            <div class="container">
                <div class="sidebar">
                    <div class="sidebar" id="sidebar">
                        <div class="logo-container">
                            <div class="logo">Team Appraisal Service Application</div>
                            <div class="logo-separator"></div>
                        </div>
                        <div class="menu-item" data-section="brief" data-type="running-board">
                            <svg><use href="#icon-companyreport"/></svg>
                            Application Brief
                        </div>
                        <div class="menu-item" data-section="dashboard" data-type="applications-package">
                            <svg><use href="#icon-rapidreview"/></svg>
                            Dashboard
                        </div>
                        <div class="menu-item" data-section="processing" data-type="running-board">
                            <svg><use href="#icon-concierge"/></svg>
                            Appraisal Processing
                        </div>
                        <div class="menu-item" data-section="programlog" data-type="running-board">
                            <svg><use href="#icon-settings"/></svg>
                            Program Log
                        </div>
                        <div class="menu-item" data-section="login" data-type="running-board">
                            <svg><use href="#icon-settings"/></svg>
                            Log-In
                        </div>
                        <div class="footer-text">
                            <p>Powered by Tangible Intelligence</p>
                        </div>
                    </div>
                </div>
                <div class="engagement-window">
                    <div class="appraisal-container">
                        <!-- Content will be inserted here -->
                    </div>
                </div>
            </div>
        `;

        // Set up event listeners
        this.initializeEventListeners();
        
        // Show initial view (Application Brief)
        this.showApplicationBrief();
    },

    initializeEventListeners() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.handleMenuClick(section);
            });
        });
    },

    handleMenuClick(section) {
        switch(section) {
            case 'brief':
                this.showApplicationBrief();
                break;
            case 'dashboard':
                this.showDashboard();
                break;
            case 'processing':
                this.showAppraisalForm();
                break;
        }
    },

    showApplicationBrief() {
        const briefContent = `
            <div class="appraisal-header">
                <h1 class="appraisal-title" style="text-align: center;">Team Appraisal Service</h1>
            </div>
            <div class="brief-content">
                <div class="brief-panel">
                    <h2 class="brief-section-title">Streamlining Self-Appraisals with Modern Tools</h2>
                    <div class="brief-text">
                        <p>The Team Services Appraisal Application has been developed by our internal Business Operations team to support staff and professional employees in completing their self-appraisals efficiently and effectively. Designed with user experience in mind, this application leverages modern technologies to simplify each step of the appraisal process, from the initial launch of the cycle to the final submission.</p>
                        <p>Previously, the self-appraisal process relied on manual methods that, while effective at the time, presented challenges as the firm grew and evolved. The new application enhances this approach by automating key components and introducing intuitive workflows, ensuring that employees can focus on thoughtful self-assessment rather than navigating complex procedures.</p>
                        <p>This advancement reflects the firm's ongoing commitment to innovation and operational excellence. By adopting these streamlined processes, we aim to provide a seamless, professional, and user-friendly experience for all participants, reinforcing our dedication to supporting both individual growth and organizational success.</p>
                    </div>
                </div>

                <div class="brief-panel">
                    <h2 class="brief-section-title">Core Functionality Summary</h2>
                    <div class="brief-text">
                        <p>The Team Services Appraisal Application automates the key steps of the self-appraisal process to ensure a smooth and consistent experience for all participants. It begins by identifying team members scheduled to complete their self-appraisals and sending personalized notifications that clearly outline the purpose and steps of the process.</p>
                        <p>The application guides team members through their self-appraisal, presenting it as an opportunity for thoughtful reflection and professional development. Friendly follow-ups are automated to ensure timely completion, reducing the administrative burden on HR while maintaining an engaging and supportive tone.</p>
                        <p>Throughout the cycle, HR leads receive real-time updates on appraisal progress and completion rates, allowing them to manage the program proactively. Once the process concludes, the application securely archives the results, creating an organized record for future reference and ensuring compliance with firm policies. This thoughtful design underscores the firm's commitment to fostering a professional and efficient appraisal process.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.appraisal-container').innerHTML = briefContent;
    },

    showDashboard() {
        // To be implemented
    },

    showAppraisalForm() {
        // To be implemented
    }
};