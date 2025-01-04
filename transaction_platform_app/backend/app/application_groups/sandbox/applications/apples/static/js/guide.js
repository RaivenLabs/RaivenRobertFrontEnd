// guide.js
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        // Get section and application info from the DOM just like we did before
        const appElement = document.querySelector('[data-view-type="application"]');
        const section = appElement.dataset.originSection;
        const application = appElement.dataset.application;
    
        // Build dynamic CSS path
        const cssPath = `/application_groups/${section}/applications/${application}/static/css/guide.css`;
    
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

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="guide-wrapper">
                <header class="guide-header">
                    <div class="guide-container">
                        <h1>Application Build Partner Testing</h1>
                        <p>Enterprise-Grade Application Prototyping Assistant</p>
                        <p>Build and deploy production-ready applications in minutes</p>
                    </div>
                </header>
    
                <section class="guide-principle-section">
                    <h2 class="guide-principle-title">Welcome to Your Build Partner</h2>
                    <div class="guide-principle-container">
                        <div class="guide-principle-box">
                            <h3>How We Help</h3>
                            <p>Your Build Partner will guide you through creating a production-ready application prototype that can be immediately deployed to your chosen sandbox group. Once tested, your application can be seamlessly moved to production at your discretion.</p>
                        </div>
                    </div>
                </section>
    
                <section class="guide-application-details">
                    <div class="guide-container">
                        <h2>Application Details</h2>
                        <form id="applicationForm" class="application-form">
                            <div class="form-group">
                                <label for="appName">Application Name:</label>
                                <input type="text" id="appName" required 
                                       placeholder="Enter a unique application name">
                            </div>
                            <div class="form-group">
                                <label for="appGroup">Sandbox Group:</label>
                                <select id="appGroup" required>
                                    <option value="hawk">Hawk</option>
                                    <option value="kestrel">Kestrel</option>
                                    <option value="raiven">Raiven</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="appDescription">Description:</label>
                                <textarea id="appDescription" required 
                                        placeholder="Describe your application's purpose"></textarea>
                            </div>
                            <button type="submit" class="btn-primary">Create Application</button>
                        </form>
                    </div>
                </section>
    
                <section id="creationStatus" class="guide-creation-status" style="display: none;">
                    <div class="guide-container">
                        <h2>Creation Status</h2>
                        <div class="status-container">
                            <h3>Created Directories and Files:</h3>
                            <ul id="createdItems" class="status-list">
                                <!-- Will be populated dynamically -->
                            </ul>
                        </div>
                    </div>
                </section>
    
                <section id="launchInstructions" class="guide-launch-instructions" style="display: none;">
                    <div class="guide-container">
                        <h2>Launch Instructions</h2>
                        <p>Your new application "<span id="newAppName"></span>" has been added to the Sandbox Portfolio.</p>
                        <p>To launch your application:</p>
                        <ol>
                            <li>Open the Sandbox Portfolio</li>
                            <li>Find your application tile</li>
                            <li>Select your application</li>
                            <li>Click the "Launch Program" button</li>
                        </ol>
                    </div>
                </section>
    
                <section class="guide-support-section">
                    <div class="guide-container">
                        <h2>Need Support?</h2>
                        <p>Tangible is here to help! Our team of experts is ready to assist you with your application development needs.</p>
                        <p>Contact us at: <strong>678-555-1212</strong></p>
                    </div>
                </section>
    
                <footer class="guide-footer">
                    <p>© 2024 Tangible Intelligence, ai. Accelerating enterprise innovation through modern prototyping.</p>
                </footer>
            </div>
        `;
    
       
    },

    setupListeners() {
        // Add event listeners if needed
    }
};