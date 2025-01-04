// guide.js
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
    },

    async loadStyles() {
        try {
            const appElement = document.querySelector('[data-view-type="application"]');
            const section = appElement.dataset.originSection;
            const application = appElement.dataset.application;
        
            const cssPath = `/application_groups/${section}/applications/${application}/static/css/guide.css`;
        
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
        } catch (error) {
            console.error('Error loading styles:', error);
        }
    },

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="guide-wrapper">
                <header class="guide-header">
                    <div class="guide-container">
                        <h1>Sandbox Engineering Platform</h1>
                        <p>Rapid Enterprise-Grade Prototyping and Development</p>
                        <p>Transform ideas into production-ready solutions at unprecedented speed</p>
                    </div>
                </header>
        
                <section class="guide-principle-section">
                    <h2 class="guide-principle-title">Core Principles</h2>
                    <div class="guide-principle-container">
                        <div class="guide-principle-box">
                            <h3>Our Philosophy</h3>
                            <p>The future of rapid prototyping isn't about the disciplined canvas mapping required by incumbent systems - it's about leveraging enterprise-ready components and modern AI capabilities to bring ideas to life at production quality from day one.</p>
                        </div>
                        
                        <div class="guide-arrow-container">
                            <div class="guide-arrow-right"></div>
                            <span class="guide-arrow-text">Enabling</span>
                        </div>
                        
                        <div class="guide-principle-box">
                            <h3>Key Outcomes</h3>
                            <ul class="guide-outcome-list">
                                <li>Production-Ready Prototypes</li>
                                <li>Enterprise AWS Integration</li>
                                <li>Rapid Development Cycles</li>
                                <li>Seamless Scaling Path</li>
                            </ul>
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
                            <h3>Created Items:</h3>
                            <ul id="createdItems" class="status-list">
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
        
                <section class="guide-lifecycle-section">
                    <div class="guide-container">
                        <h2>The Development Cycle</h2>
                        <div class="guide-lifecycle-grid">
                            <div class="guide-lifecycle-card">
                                <h3>1. Idea Flowcharting</h3>
                                <p>Map your solution's logic flow with modern tools and AI assistance.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>2. Component Selection</h3>
                                <p>Choose from enterprise-ready AWS services (S3, RDS, Cognito, etc.).</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>3. Rapid Development</h3>
                                <p>Build with real code, supported by AI and modern frameworks.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>4. Integration</h3>
                                <p>Connect seamlessly with enterprise infrastructure.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>5. Testing</h3>
                                <p>Validate in real enterprise conditions.</p>
                            </div>
                            <div class="guide-lifecycle-card">
                                <h3>6. Production Ready</h3>
                                <p>Deploy enterprise-grade solutions with confidence.</p>
                            </div>
                        </div>
                    </div>
                </section>
        
                <section class="guide-features-section">
                    <div class="guide-container">
                        <h2 class="guide-features-title">Platform Capabilities</h2>
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
                                    <td>Projects Dashboard</td>
                                    <td>Monitor active prototypes and development metrics</td>
                                    <td>Dashboard</td>
                                </tr>
                                <tr>
                                    <td>Launch Engineer</td>
                                    <td>Start new prototypes with pre-configured AWS components</td>
                                    <td>Launch</td>
                                </tr>
                                <tr>
                                    <td>Application Portfolio</td>
                                    <td>Access and manage your prototype collection</td>
                                    <td>Portfolio</td>
                                </tr>
                                <tr>
                                    <td>Service Desk</td>
                                    <td>Get expert support and guidance</td>
                                    <td>Support</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
        
                <footer class="guide-footer">
                    <p>© 2024 Tangible Intelligence, ai. Accelerating enterprise innovation through modern prototyping.</p>
                </footer>
            </div>
        `;
        
        this.setupFormHandler(targetElement);
    },

    setupFormHandler(targetElement) {
        const form = targetElement.querySelector('#applicationForm');
        const iconPaths = {
            default: "path d='M9 17h6M9 12h6M9 7h6'"
        };
    
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const appName = document.getElementById('appName').value;
            const appId = appName.toLowerCase().replace(/\s+/g, '_');
    
            try {
                const checkResponse = await fetch('/api/check_app_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appId: appId
                    })
                });
    
                const checkResult = await checkResponse.json();
                
                if (checkResult.exists) {
                    alert(`An application with ID "${appId}" already exists. Please choose a different name.`);
                    return;
                }
    
                const appGroup = document.getElementById('appGroup').value;
                const appDescription = document.getElementById('appDescription').value;
    
                const newProgram = {
                    id: appId,
                    name: appName,
                    icon: iconPaths.default,
                    action: "launch_program"
                };
    
                const response = await fetch('/api/create_application', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appName,
                        appGroup,
                        appDescription,
                        programData: newProgram
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('creationStatus').style.display = 'block';
                    document.getElementById('launchInstructions').style.display = 'block';
                    
                    const createdItemsList = document.getElementById('createdItems');
                    result.createdItems.forEach(item => {
                        createdItemsList.innerHTML += `<li>${item}</li>`;
                    });

                    document.getElementById('newAppName').textContent = appName;

                    if (result.jsonUpdated) {
                        createdItemsList.innerHTML += `
                            <li>Updated sandbox_programs.json with new application</li>
                        `;
                    }
                } else {
                    alert(result.error);
                }
    
            } catch (error) {
                console.error('Error checking/creating application:', error);
                alert('Error processing application. Please try again.');
            }
        });
    }
};