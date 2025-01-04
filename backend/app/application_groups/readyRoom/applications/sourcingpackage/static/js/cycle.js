export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        await this.loadFormData();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        // Get section and application info from the DOM just like we did before
        const appElement = document.querySelector('[data-view-type="application"]');
        const section = appElement.dataset.originSection;
        const application = appElement.dataset.application;
    
        // Build dynamic CSS path
        const cssPath = `/application_groups/${section}/applications/${application}/static/css/cycle.css`;
    
        // Check if stylesheet is already loaded using dynamic path
        if (!document.querySelector(`link[href*="${cssPath}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
    
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    async loadFormData() {
        this.formData = {
            professional: {
                sections: [
                    {
                        id: 'client-matters',
                        title: 'Client Matters & Supervision',
                        fields: [
                            {
                                id: 'significant_matters',
                                label: 'Significant Client Matter Projects',
                                description: 'List the significant client matter projects from the past year.',
                                format: [
                                    'Project Name/Client',
                                    'Your Role & Involvement',
                                    'Revenue Impact & Achievements'
                                ],
                                placeholder: 'Example:\n\nProject: ABC Corp Acquisition\nRole: Lead Associate\nContribution: Managed due diligence process, resulting in successful $50M transaction\nRevenue Impact: Generated fees of $X'
                            },
                            {
                                id: 'write_off',
                                label: 'Write-Offs and Reduced Fees',
                                description: 'Detail any matters with write-offs or reduced fees.',
                                format: [
                                    'Matter Description',
                                    'Reason for Write-off/Reduction',
                                    'Supervising Lawyer (if applicable)',
                                    'Value Recognition Despite Reduced Billing'
                                ],
                                placeholder: 'Example:\n\nMatter: XYZ Corp Litigation\nReason: Strategic decision by Partner A to reduce fees\nValue: Successfully established precedent for future matters'
                            },
                            {
                                id: 'supervisory',
                                label: 'Supervisory Work',
                                description: 'Describe your supervisory responsibilities.',
                                format: [
                                    'Staff/Associates Supervised',
                                    'Mentoring Activities',
                                    'Delegation & Training',
                                    'Development Outcomes'
                                ],
                                placeholder: 'Example:\n\nSupervised: 2 junior associates, 1 paralegal\nMentoring: Weekly check-ins, skill development sessions\nTraining: Led research methodology workshops'
                            }
                        ]
                    },
                    {
                        id: 'professional-development',
                        title: 'Professional Development',
                        fields: [
                            {
                                id: 'cpd',
                                label: 'Continuing Professional Development',
                                format: [
                                    'Event Name',
                                    'Type (External/In-house)',
                                    'Your Role (Speaker/Participant)',
                                    'Key Outcomes'
                                ],
                                placeholder: 'Example:\n\nEvent: Legal Tech Summit 2024\nType: External\nRole: Panel Speaker\nOutcomes: Shared expertise on AI in legal practice'
                            },
                            {
                                id: 'client_education',
                                label: 'Client Education & BD Events',
                                format: [
                                    'Event Title',
                                    'Your Role',
                                    'Impact & Results'
                                ],
                                placeholder: 'Example:\n\nEvent: Financial Regulations Workshop\nRole: Lead Speaker & Material Development\nResults: 20+ client attendees, 2 new matter referrals'
                            },
                            {
                                id: 'written_contributions',
                                label: 'Written Contributions',
                                format: [
                                    'Title',
                                    'Publication/Platform',
                                    'Type (External/In-house)',
                                    'Impact'
                                ],
                                placeholder: 'Example:\n\nTitle: "ESG Compliance in 2024"\nPublication: Legal Business Quarterly\nType: External\nImpact: Cited by industry leaders'
                            }
                        ]
                    },
                    {
                        id: 'business-development',
                        title: 'Business Development',
                        fields: [
                            {
                                id: 'work_generated',
                                label: 'Work Generated',
                                format: [
                                    'New Clients Originated',
                                    'Additional Work from Existing Clients',
                                    'Cross-selling Successes',
                                    'Business Development Activities',
                                    'Practice Area Development'
                                ],
                                placeholder: 'Example:\n\nNew Clients: Secured ABC Corp as new client\nExpanded Work: Additional practice areas for XYZ Corp\nCross-selling: Referred litigation matter to Dispute Resolution team'
                            },
                            {
                                id: 'non_legal_work',
                                label: 'Non-Legal Work Contributions',
                                description: 'Describe non-legal work beyond business development.',
                                placeholder: 'Example: Led associate recruitment committee, developed internal knowledge management system'
                            }
                        ]
                    },
                    {
                        id: 'community-contributions',
                        title: 'Community & Professional Contributions',
                        fields: [
                            {
                                id: 'committees',
                                label: 'Committee Participation',
                                format: [
                                    'Committee Name',
                                    'Your Role/Designation',
                                    'Key Contributions & Results'
                                ],
                                placeholder: 'Example:\n\nCommittee: Technology Innovation Committee\nRole: Chair\nResults: Implemented 3 new legal tech solutions'
                            },
                            {
                                id: 'probono',
                                label: 'Pro Bono Work',
                                format: [
                                    'Project/Organization',
                                    'Time Commitment',
                                    'Impact & Results'
                                ],
                                placeholder: 'Example:\n\nProject: Legal Aid Clinic\nCommitment: Monthly sessions\nImpact: Assisted 20+ individuals with legal advice'
                            }
                        ]
                    },
                    {
                        id: 'reflection',
                        title: 'Professional Growth & Additional Notes',
                        fields: [
                            {
                                id: 'lessons_learnt',
                                label: 'Professional Growth',
                                format: [
                                    'Key Learnings',
                                    'Skills Development',
                                    'Value Addition'
                                ],
                                placeholder: 'Example:\n\nLearnings: Enhanced expertise in M&A transactions\nSkills: Improved client communication and project management\nValue: Can now independently handle complex deals'
                            },
                            {
                                id: 'anything_else',
                                label: 'Additional Achievements',
                                format: [
                                    'External Recognition',
                                    'Leadership Demonstrations',
                                    'Other Notable Achievements'
                                ],
                                placeholder: 'Example:\n\nRecognition: Featured in Legal 500 Rising Stars\nLeadership: Led associate training program'
                            },
                            {
                                id: 'additional_handicaps',
                                label: 'Additional Considerations',
                                description: 'Note any circumstances affecting performance not mentioned above.',
                                placeholder: 'Example: Extended leave for professional certification'
                            }
                        ]
                    }
                ]
            },
            // Staff form sections would go here
        };
     },

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="appraisal-cycle">
                <div class="cycle-header">
                    <h1>Self-Appraisal Form</h1>
                    <p>Year-End Review 2024</p>
                </div>

                <div class="form-type-selection">
                    <h2>Select Your Form Type</h2>
                    <div class="form-cards">
                        <div class="form-card" data-type="professional">
                            <div class="card-icon">👨‍⚖️</div>
                            <h3>Professional Staff</h3>
                            <p>For lawyers and legal professionals</p>
                            <ul>
                                <li>Comprehensive performance review</li>
                                <li>Professional development tracking</li>
                                <li>Client matter assessment</li>
                            </ul>
                            <button class="start-form-btn" data-type="professional">Start Professional Form</button>
                        </div>

                        <div class="form-card" data-type="staff">
                            <div class="card-icon">👥</div>
                            <h3>Support Staff</h3>
                            <p>For administrative and support staff</p>
                            <ul>
                                <li>Task-based performance review</li>
                                <li>Project contribution assessment</li>
                                <li>Efficiency improvements</li>
                            </ul>
                            <button class="start-form-btn" data-type="staff">Start Staff Form</button>
                        </div>
                    </div>
                </div>

                <div class="form-container" style="display: none;">
                    <div class="progress-bar">
                        <!-- Will be populated based on form type -->
                    </div>

                    <div class="form-content">
                        <!-- Form sections will be rendered here -->
                    </div>

                    <div class="form-navigation">
                        <button class="nav-btn back-btn" disabled>Back</button>
                        <button class="nav-btn save-btn">Save Progress</button>
                        <button class="nav-btn next-btn">Next</button>
                    </div>
                </div>
            </div>
        `;
    },

    setupListeners() {
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('start-form-btn')) {
                const formType = e.target.dataset.type;
                await this.initializeForm(formType);
            }

            if (e.target.classList.contains('back-btn')) {
                this.navigateForm('back');
            }

            if (e.target.classList.contains('next-btn')) {
                this.navigateForm('next');
            }

            if (e.target.classList.contains('save-btn')) {
                this.saveProgress();
            }
        });
    },

    async initializeForm(formType) {
        const formContainer = document.querySelector('.form-container');
        const typeSelection = document.querySelector('.form-type-selection');
        
        // Hide selection, show form
        typeSelection.style.display = 'none';
        formContainer.style.display = 'block';

        // Initialize progress bar
        this.renderProgressBar(formType);
        
        // Load first section
        this.currentSection = 0;
        this.currentFormType = formType;
        this.renderFormSection();
    },

    renderProgressBar(formType) {
        const progressBar = document.querySelector('.progress-bar');
        const sections = this.formData[formType].sections;
        
        progressBar.innerHTML = sections.map((section, index) => `
            <div class="progress-step ${index === 0 ? 'active' : ''}" data-step="${index}">
                <div class="step-indicator">${index + 1}</div>
                <div class="step-label">${section.title}</div>
            </div>
        `).join('');
    },

    renderFormSection() {
        const formContent = document.querySelector('.form-content');
        const sections = this.formData[this.currentFormType].sections;
        const currentSection = sections[this.currentSection];

        formContent.innerHTML = `
            <h2>${currentSection.title}</h2>
            <div class="section-fields">
                ${this.renderFields(currentSection.fields)}
            </div>
        `;

        // Update navigation buttons
        document.querySelector('.back-btn').disabled = this.currentSection === 0;
        const nextBtn = document.querySelector('.next-btn');
        nextBtn.textContent = this.currentSection === sections.length - 1 ? 'Submit' : 'Next';
    },


    renderFields(fields) {
       return fields.map(field => `
           <div class="form-field">
               <label for="${field.id}">${field.label} <span class="required">*</span></label>
               ${field.description ? `<p class="field-description">${field.description}</p>` : ''}
               ${field.format ? `
                   <div class="format-guide">
                       <h4>Please include:</h4>
                       <ul>
                           ${field.format.map(item => `<li>${item}</li>`).join('')}
                       </ul>
                   </div>
               ` : ''}
               <textarea 
                   id="${field.id}" 
                   rows="8" 
                   placeholder="${field.placeholder || ''}"
                   required
               ></textarea>
           </div>
       `).join('');
    },

    formatFieldLabel(field) {
        return field.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    navigateForm(direction) {
        if (direction === 'back' && this.currentSection > 0) {
            this.currentSection--;
        } else if (direction === 'next') {
            const sections = this.formData[this.currentFormType].sections;
            if (this.currentSection < sections.length - 1) {
                this.currentSection++;
            } else {
                this.submitForm();
            }
        }
        this.renderFormSection();
        this.updateProgress();
    },

    updateProgress() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index === this.currentSection) {
                step.classList.add('active');
            } else if (index < this.currentSection) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    },

    saveProgress() {
        // Will implement actual save functionality
        console.log('Progress saved!');
        this.showToast('Progress saved successfully!');
    },

    submitForm() {
        // Will implement actual submit functionality
        console.log('Form submitted!');
        this.showToast('Form submitted successfully!');
    },
    showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) {
            // Create toast element if it doesn't exist
            const newToast = document.createElement('div');
            newToast.id = 'toast';
            newToast.className = 'toast';
            document.body.appendChild(newToast);
        }
        
        const toastElement = document.getElementById('toast');
        toastElement.textContent = message;
        
        // Remove existing classes and add show class
        toastElement.classList.remove('hide');
        toastElement.classList.add('show');
        
        // Set timer to hide toast
        setTimeout(() => {
            toastElement.classList.remove('show');
            toastElement.classList.add('hide');
            
            // After animation completes, reset
            toastElement.addEventListener('animationend', () => {
                if (toastElement.classList.contains('hide')) {
                    toastElement.classList.remove('hide');
                    toastElement.style.display = 'none';
                }
            }, { once: true });
        }, 3000); // Toast will show for 3 seconds
    }

   
};