

import { appraisalData } from '../data/appraisal-sample-data.js';
console.log('team-appraisal.js loaded');

export const program = {
    launch: function(section, container) {
        console.log('Launch function called - setting up full page layout');
        
        // Render our complete structure
        container.innerHTML = `

       
            <div style="display: flex; width: 100%; min-height: 100vh;">
             <div class="appraisal-sidebar" style="width: 250px; background-color: var(--navy-blue);">
                    <div class="logo-container">
                        <div class="logo">Team Appraisal Service Application</div>
                        <div class="logo-separator"></div>
                    </div>
                   
<div class="menu-item" id="briefButton">
    <svg><use href="#icon-companyreport"/></svg>
    Application Brief
</div>
<div class="menu-item" id="dashboardButton">
   <svg><use href="#icon-settings"/></svg>
    Dashboard
</div>
<div class="menu-item" id="processingButton">
    <svg><use href="#icon-concierge"/></svg>
    Appraisal Processing
</div>
                    <div class="menu-item" id="programLogButton">
                        <svg><use href="#icon-settings"/></svg>
                        Program Log
                    </div>
                    <div class="menu-item">
                        <svg><use href="#icon-settings"/></svg>
                        Log-In
                    </div>
                    <div>
                        <p style="color: var(--cyan); padding-top:196px; margin:5px; ">Powered by Tangible Intelligence</p>
                    </div>
                </div>
                <div class="appraisal-content" style="flex: 1; padding: 20px;">
                    <!-- Content will be inserted here -->
                </div>
            </div>
        `;
 // Simple direct event listeners
 document.getElementById('briefButton').onclick = () => {
    console.log('Brief button clicked');
    this.showApplicationBrief();
};

document.getElementById('dashboardButton').onclick = () => {
    console.log('Dashboard button clicked');
    this.showDeck();
};

document.getElementById('processingButton').onclick = () => {
    console.log('Processing button clicked');
    this.showAppraisalForm();
};


        
        // Show initial view
        this.showApplicationBrief();
},

    

    handleMenuClick(section) {
        console.log(`Handling menu click for section: ${section}`);
        switch(section) {
            case 'brief':
                this.showApplicationBrief();
                break;
            case 'appraisaldeck':
                this.showDeck();
                break;
            case 'processing':
                this.showAppraisalForm();
                break;
            default:
                console.log(`Unhandled section: ${section}`);
        }
    },

    showApplicationBrief() {
        console.log('Rendering Application Brief content');
        const briefContent = `
         <style>
         
         body {
            
            background-color: ivory;
            
        }

        </style>
        
            <div class="appraisal-header">
                <h1 class="appraisal-title" style="text-align: center;">Team Appraisal Service</h1>
            </div>
            <div class="brief-content" style="display: flex; gap: 2rem; padding: 2rem;">
                <div class="brief-panel" style="flex: 1; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <h2 class="brief-section-title">Streamlining Self-Appraisals with Modern Tools</h2>
                    <div class="brief-text">
                        <p>The Team Services Appraisal Application has been developed by our internal Business Operations team to support staff and professional employees in completing their self-appraisals efficiently and effectively. Designed with user experience in mind, this application leverages modern technologies to simplify each step of the appraisal process, from the initial launch of the cycle to the final submission.</p>
                        <p>Previously, the self-appraisal process relied on manual methods that, while effective at the time, presented challenges as the firm grew and evolved. The new application enhances this approach by automating key components and introducing intuitive workflows, ensuring that employees can focus on thoughtful self-assessment rather than navigating complex procedures.</p>
                        <p>This advancement reflects the firm's ongoing commitment to innovation and operational excellence. By adopting these streamlined processes, we aim to provide a seamless, professional, and user-friendly experience for all participants, reinforcing our dedication to supporting both individual growth and organizational success.</p>
                    </div>
                </div>

                <div class="brief-panel" style="flex: 1; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <h2 class="brief-section-title">Core Functionality Summary</h2>
                    <div class="brief-text">
                        <p>The Team Services Appraisal Application automates the key steps of the self-appraisal process to ensure a smooth and consistent experience for all participants. It begins by identifying team members scheduled to complete their self-appraisals and sending personalized notifications that clearly outline the purpose and steps of the process.</p>
                        <p>The application guides team members through their self-appraisal, presenting it as an opportunity for thoughtful reflection and professional development. Friendly follow-ups are automated to ensure timely completion, reducing the administrative burden on HR while maintaining an engaging and supportive tone.</p>
                        <p>Throughout the cycle, HR leads receive real-time updates on appraisal progress and completion rates, allowing them to manage the program proactively. Once the process concludes, the application securely archives the results, creating an organized record for future reference and ensuring compliance with firm policies. This thoughtful design underscores the firm's commitment to fostering a professional and efficient appraisal process.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.appraisal-content').innerHTML = briefContent;
        console.log('Application Brief content rendered');
    },

    showDeck() {
        console.log('Rendering Dashboard with recipient data');
        const deckContent = `
            <div class="appraisal-header">
                <h1 class="appraisal-title" style="text-align: center;">Team Appraisal Dashboard</h1>
            </div>
            <div class="appraisal-dashboard-controls" style="margin: 20px;">
                <select id="roleFilter">
                    <option value="">Filter by Role</option>
                    <option value="Professional">Professional Staff</option>
                    <option value="Staff">Support Staff</option>
                </select>
                <select id="departmentFilter">
                    <option value="">Filter by Department</option>
                    ${appraisalData.filters.departments.map(dept => 
                        `<option value="${dept}">${dept}</option>`
                    ).join('')}
                </select>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Department</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Role</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Job Title</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Self Appraisal</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appraisalData.recipients.map(recipient => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${recipient.preferredFirstName} ${recipient.preferredLastName}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${recipient.department}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${recipient.role}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${recipient.jobTitle}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${recipient.selfAppraisalRequired ? 'Yes' : 'No'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${recipient.status}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                <button onclick="handleRecipientAction('${recipient.recordId}')">Action</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        document.querySelector('.appraisal-content').innerHTML = deckContent;
    },

    showAppraisalForm() {
        console.log('Appraisal Form view requested - not yet implemented');
        document.querySelector('.appraisal-content').innerHTML = '<h1>Appraisal Form Coming Soon</h1>';
    }
};