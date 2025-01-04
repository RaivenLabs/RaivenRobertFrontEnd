export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="platformtour.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
          
            link.href = '/application_groups/platformtour/application_group_root/static/css/platformtour.css';
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="tour-wrapper">
                <header class="tour-header">
                    <div class="tour-container">
                        <h1>Transaction Services Platform</h1>
                        <p>Powered by Tangible Intelligence</p>
                        <p>From paper-based, siloed contracting processes to fluid Transactional Streams</p>
                    </div>
                </header>
        
                <section class="tour-principle-section">
                    <h2 class="tour-principle-title">Platform Architecture</h2>
                    <div class="tour-principle-container">
                        <div class="tour-principle-box">
                            <h1 style="font-style: italic;">The Critical Unlock resides at the Intersection of Computational Automation, Data Intelligence and Sector Expertise. The pattern of the high volume transaction portfolio is the key.</h1>
                        </div>
                        
                        <div class="tour-arrow-container">
                            <div class="tour-arrow-right"></div>
                            <span class="tour-arrow-text">Driving</span>
                        </div>
                        
                        <div class="tour-principle-box">
                            <h3>Transactional Excellence</h3>
                            <ul class="tour-outcome-list">
                                <li>Accelerated speed to close</li>
                                <li>Quality of Deal Content</li>
                                <li>Low Friction</li>
                            </ul>
                        </div>
                    </div>
                </section>
        
                <section class="tour-lifecycle-section">
                    <div class="tour-container">
                        <h2 style="text-align: center; color: var(--royal-blue);">The Transaction Lifecycle</h2>
                        <div class="tour-lifecycle-grid">
                            <div class="tour-lifecycle-card">
                                <h3>1. Ideation</h3>
                                <p>Transforming concepts into actionable opportunities.</p>
                            </div>
                            <div class="tour-lifecycle-card">
                                <h3>2. Sourcing</h3>
                                <p>Defining goals and structure for seamless execution.</p>
                            </div>
                            <div class="tour-lifecycle-card">
                                <h3>3. Transacting</h3>
                                <p>Driving value with informed and strategic counterparty transacting.</p>
                            </div>
                            <div class="tour-lifecycle-card">
                                <h3>4. Packaging</h3>
                                <p>Securing approvals for close.</p>
                            </div>
                            <div class="tour-lifecycle-card">
                                <h3>5. Closing</h3>
                                <p>Signing the final package.</p>
                            </div>
                            <div class="tour-lifecycle-card">
                                <h3>6. Archiving</h3>
                                <p>Extracting metadata and putaway.</p>
                            </div>
                            <div class="tour-lifecycle-card">
                                <h3>7. Management</h3>
                                <p>Tracking counterparty performance and optimizing for sustained success.</p>
                            </div>
                        </div>
                    </div>
                </section>
        
                <section class="tour-finder-section">
                    <div class="tour-container">
                        <h2 class="tour-finder-title">Where Do I Find It?</h2>
                        <table class="tour-finder-table">
                            <thead>
                                <tr>
                                    <th>Mission</th>
                                    <th>Transaction Stage</th>
                                    <th>Platform Functionality</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Build a Transaction</td>
                                    <td>Sourcing and Transacting</td>
                                    <td>Engineering</td>
                                </tr>
                                <tr>
                                    <td>Look up Transaction Status</td>
                                    <td>Planning, Negotiation, Execution</td>
                                    <td>Transaction Dashboard</td>
                                </tr>
                                <tr>
                                    <td>Run my transactional system</td>
                                    <td>System Management</td>
                                    <td>Concierge</td>
                                </tr>
                                <tr>
                                    <td>Load Legacy Data</td>
                                    <td>Transacting</td>
                                    <td>Configuration</td>
                                </tr>
                                <tr>
                                    <td>Archive Transactions</td>
                                    <td>Archiving</td>
                                    <td>Concierge</td>
                                </tr>
                                <tr>
                                    <td>Analyze a Portfolio of Transactions</td>
                                    <td>Management</td>
                                    <td>Transaction Analysis</td>
                                </tr>
                                <tr>
                                    <td>Check system health</td>
                                    <td>System Management</td>
                                    <td>Transaction Ops Command</td>
                                </tr>
                                <tr>
                                    <td>Tune my Platform</td>
                                    <td>Platform Management</td>
                                    <td>Settings</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
        
                <footer class="tour-footer">
                    <div class="tour-container">
                        <p>© 2024 Transaction Services Platform. Built for serious business with a smile.  Radical generosity is our motto!</p>
                    </div>
                </footer>
            </div>
        `;
    },

    setupListeners() {
        // Add any listeners needed for tour interactivity
    }
};