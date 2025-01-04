export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        await this.loadAppraisalData();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="data_table.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/houseapps/applications/team-appraisal/static/css/data_table.css';
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    async loadAppraisalData() {
        try {
            const { appraisalData } = await import('/application_groups/houseapps/applications/team-appraisal/static/data/appraisal-sample-data.js');
            this.appraisalData = appraisalData;
            console.log('✅ Appraisal data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading appraisal data:', error);
        }
    },

    render(sectionName, targetElement) {
        const { cycleInfo, statistics } = this.appraisalData.metadata;
        
        targetElement.innerHTML = `
            <div class="table-reporting">
                <!-- Cycle Information -->
                <div class="cycle-header">
                    <div class="cycle-info">
                        <h1>${cycleInfo.cycleName}</h1>
                        <p>Cycle Period: ${cycleInfo.startDate} - ${cycleInfo.dueDate}</p>
                    </div>
                    <div class="cycle-status ${cycleInfo.status.toLowerCase()}">
                        ${cycleInfo.status}
                    </div>
                </div>

                <!-- Statistics Summary -->
                <div class="statistics-grid">
                    <div class="stat-card">
                        <div class="stat-number">${statistics.totalRecipients}</div>
                        <div class="stat-label">Total Recipients</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${statistics.completedAppraisals}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${statistics.inProgress}</div>
                        <div class="stat-label">In Progress</div>
                    </div>
                    <div class="stat-card alert">
                        <div class="stat-number">${statistics.overdue}</div>
                        <div class="stat-label">Overdue</div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="filter-controls">
                    <select id="departmentFilter" class="filter-select">
                        <option value="">All Departments</option>
                        ${this.appraisalData.filters.departments.map(dept => 
                            `<option value="${dept}">${dept}</option>`
                        ).join('')}
                    </select>
                    <select id="roleFilter" class="filter-select">
                        <option value="">All Roles</option>
                        ${this.appraisalData.filters.roles.map(role => 
                            `<option value="${role}">${role}</option>`
                        ).join('')}
                    </select>
                    <select id="statusFilter" class="filter-select">
                        <option value="">All Statuses</option>
                        ${this.appraisalData.filters.statuses.map(status => 
                            `<option value="${status}">${status}</option>`
                        ).join('')}
                    </select>
                </div>

                <!-- Main Table -->
                <div class="panel-content">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Record ID</th>
                                    <th>Name & Department</th>
                                    <th>Role</th>
                                    <th>Job Title</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="appraisalTableBody">
                                ${this.renderTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderTableRows() {
        return this.appraisalData.recipients.map(recipient => `
            <tr>
                <td>${recipient.recordId}</td>
                <td>
                    <div class="recipient-info">
                        <div class="recipient-name">${recipient.preferredFirstName} ${recipient.preferredLastName}</div>
                        <div class="recipient-dept">${recipient.department}</div>
                        ${recipient.tags.length ? `
                            <div class="recipient-tags">
                                ${recipient.tags.map(tag => `
                                    <span class="tag">${tag}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td>${recipient.role}</td>
                <td>${recipient.jobTitle}</td>
                <td>
                    <span class="status-indicator status-${recipient.appraisalDetails.status.toLowerCase().replace(/\s+/g, '-')}">
                        ${recipient.appraisalDetails.status}
                    </span>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${recipient.appraisalDetails.progress}%"></div>
                    </div>
                </td>
                <td>${recipient.appraisalDetails.dueDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-button view" data-id="${recipient.recordId}">
                            View
                        </button>
                        <button class="action-button start" data-id="${recipient.recordId}">
                            ${recipient.appraisalDetails.status === 'Not Started' ? 'Start' : 'Continue'}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    setupListeners() {
        // Filter handlers
        ['department', 'role', 'status'].forEach(filterType => {
            const filter = document.getElementById(`${filterType}Filter`);
            filter?.addEventListener('change', () => this.applyFilters());
        });

        // Action button handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                const recordId = e.target.dataset.id;
                if (e.target.classList.contains('view')) {
                    this.handleViewClick(recordId);
                } else if (e.target.classList.contains('start')) {
                    this.handleStartClick(recordId);
                }
            }
        });
    },

    applyFilters() {
        const department = document.getElementById('departmentFilter').value;
        const role = document.getElementById('roleFilter').value;
        const status = document.getElementById('statusFilter').value;

        let filteredData = this.appraisalData.recipients;

        if (department) {
            filteredData = filteredData.filter(r => r.department === department);
        }
        if (role) {
            filteredData = filteredData.filter(r => r.role === role);
        }
        if (status) {
            filteredData = filteredData.filter(r => r.appraisalDetails.status === status);
        }

        const tbody = document.getElementById('appraisalTableBody');
        tbody.innerHTML = this.renderTableRows(filteredData);
    },

    handleViewClick(recordId) {
        console.log('View clicked for:', recordId);
        // Implement view functionality
    },

    handleStartClick(recordId) {
        console.log('Start/Continue clicked for:', recordId);
        // Implement start/continue functionality
    }
};