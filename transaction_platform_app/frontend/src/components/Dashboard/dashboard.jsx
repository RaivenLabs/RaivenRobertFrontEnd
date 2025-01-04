// dashboard_reporting.js
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
        this.setupListeners();
        await this.loadDashboardData();
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="dashboard_reporting.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/static/shared/dashboardreporting/static/css/dashboard_reporting.css';
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },


    async loadDashboardData() {
        try {
            const response = await fetch('/application_groups/static/shared/dashboardreporting/static/data/dashboardreporting.json');  
            const data = await response.json();
            this.populateProjects(data.projects);
            this.populateMetrics(data.metrics);
            this.populateFlags(data.flags);
            this.populateAlerts(data.alerts);
            
            // Add debug logging
            console.log('Dashboard data loaded:', data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Error loading dashboard data');
        }
    },

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="operations-command">
                <div class="row">
                    <div class="card">
                        <div class="card-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 3H3v18h18V3zM9 9h6M9 15h6M9 12h6"/>
                            </svg>
                            <h3 class="card-title">Active Projects</h3>
                        </div>
                        <div class="card-content" id="projectsContainer"></div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                            </svg>
                            <h3 class="card-title">Key Metrics</h3>
                        </div>
                        <div class="card-content">
                            <div class="metrics-grid" id="metricsContainer"></div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="card">
                        <div class="card-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                            </svg>
                            <h3 class="card-title">Flags</h3>
                        </div>
                        <div class="card-content" id="flagsContainer"></div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            <h3 class="card-title">Alerts</h3>
                        </div>
                        <div class="card-content">
                            <div class="alerts-container" id="alertsContainer"></div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <h3 class="card-title">System Requests</h3>
                        </div>
                        <div class="card-content">
                            <div class="request-container">
                                <h4>Submit Feature Request</h4>
                                <p>Help us improve the platform by suggesting new features</p>
                                <button class="request-button">New Request</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Population methods from your existing code
    populateProjects(projects) {
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        
        container.innerHTML = projects.map(project => `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <span class="project-status">${project.status}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.completion}%"></div>
                </div>
            </div>
        `).join('');
    },
// Continuing dashboard_reporting.js...

populateMetrics(metrics) {
    const container = document.getElementById('metricsContainer');
    if (!container) return;

    container.innerHTML = metrics.map(metric => `
        <div class="metric-card">
            <div class="metric-header">${metric.title}</div>
            <div class="metric-value">${metric.value}</div>
            <div class="metric-trend ${metric.trend.startsWith('+') ? 'trend-up' : 'trend-down'}">
                ${metric.trend}
            </div>
        </div>
    `).join('');
},

populateFlags(flags) {
    const container = document.getElementById('flagsContainer');
    if (!container) return;

    container.innerHTML = flags.map(flag => `
        <div class="flag-item">
            <div class="flag-header">
                <h4>${flag.title}</h4>
                <span class="priority-badge">${flag.priority}</span>
            </div>
            <div>Due: ${flag.dueDate}</div>
        </div>
    `).join('');
},

populateAlerts(alerts) {
    const container = document.getElementById('alertsContainer');
    if (!container) return;

    container.innerHTML = alerts.map(alert => `
        <div class="alert-item">
            <div class="alert-header">
                <span class="alert-badge">${alert.type}</span>
                <span>${alert.timestamp}</span>
            </div>
            <div>${alert.message}</div>
        </div>
    `).join('');
},

setupListeners() {
    // Handle request button clicks
    document.querySelector('.request-button')?.addEventListener('click', () => {
        this.handleNewRequest();
    });

    // Add any other listeners needed
},

handleNewRequest() {
    this.showToast('Feature request functionality coming soon!');
},

showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
};
