// guide.js
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="guide.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/houseapps/applications/team-appraisal/static/css/guide.css';
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="guide-wrapper">
                <header class="guide-header">
                    <div class="guide-container">
                        <h1>Team Appraisal Services</h1>
                        <p>A Comprehensive Platform for Performance Management and Team Development</p>
                        <p>Transform performance reviews into meaningful growth opportunities</p>
                    </div>
                </header>
        
                <section class="guide-principle-section">
                    <h2 class="guide-principle-title">Core Principles</h2>
                    <div class="guide-principle-container">
                        <div class="guide-principle-box">
                            <h3>Our Philosophy</h3>
                            <p>Performance appraisals should be continuous, constructive, and growth-oriented conversations that align individual aspirations with organizational goals.</p>
                        </div>
                        
                        <div class="guide-arrow-container">
                            <div class="guide-arrow-right"></div>
                            <span class="guide-arrow-text">Enabling</span>
                        </div>
                        
                        <div class="guide-principle-box">
                            <h3>Key Outcomes</h3>
                            <ul class="guide-outcome-list">
                                <li>Clear Performance Standards</li>
                                <li>Continuous Feedback Loops</li>
                                <li>Data-Driven Insights</li>
                                <li>Development Planning</li>
                            </ul>
                        </div>
                    </div>
                </section>
        
                <section class="guide-lifecycle-section">
                    <div class="guide-container">
                        <h2>The Appraisal Cycle</h2>
                        <div class="guide-lifecycle-grid">
                            <div class="guide-lifecycle-card">
                                <h3>1. Goal Setting</h3>
                                <p>Establish clear, measurable objectives aligned with team and organizational goals.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>2. Continuous Feedback</h3>
                                <p>Regular check-ins and real-time performance tracking.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>3. Self-Assessment</h3>
                                <p>Team members reflect on their achievements and areas for growth.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>4. Peer Input</h3>
                                <p>Gather insights from colleagues and stakeholders.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>5. Review Meeting</h3>
                                <p>Structured discussion of performance and development.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>6. Development Plan</h3>
                                <p>Create actionable plans for growth and improvement.</p>
                            </div>
                        </div>
                    </div>
                </section>
        
                <section class="guide-features-section">
                    <div class="guide-container">
                        <h2 class="guide-features-title">Key Features</h2>
                        <table class="guide-features-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Description</th>
                                    <th>Access Via</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Application Dashboard</td>
                                    <td>Overview of all active appraisals and team metrics</td>
                                    <td>Dashboard Button</td>
                                </tr>
                                <tr>
                                    <td>Launch Appraisal Cycle</td>
                                    <td>Start new appraisal cycles and set parameters</td>
                                    <td>Launch Button</td>
                                </tr>
                                <tr>
                                    <td>Appraisal Registry</td>
                                    <td>Historical records and documentation</td>
                                    <td>Registry Button</td>
                                </tr>
                                <tr>
                                    <td>Return to Platform</td>
                                    <td>Navigate back to main platform</td>
                                    <td>Main Menu Button</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
        
                <footer class="guide-footer">
                   
                        <p>© 2024 Tangible Intelligence, ai. Empowering teams through thoughtful performance management.</p>
                    </div>
                </footer>
            </div>
        `;
    },

    setupListeners() {
        // Add event listeners if needed
    }
};