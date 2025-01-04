// guide.js
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        await this.render(sectionName, targetElement);
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

    async render(sectionName, targetElement) {
        try {
            const appElement = document.querySelector('[data-view-type="application"]');
            const section = appElement.dataset.originSection;
            const application = appElement.dataset.application;
    
            // First load the HTML template
            const templatePath = `/application_groups/${section}/applications/${section}/static/houseappsguide.html`;
            
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const htmlContent = await response.text();
            targetElement.innerHTML = htmlContent;
    
            // Now load the program groups from JSON
            const jsonPath = `/application_groups/${section}/application_group_root/static/data/houseapps_programs.json`;
            const groupsResponse = await fetch(jsonPath);
            if (!groupsResponse.ok) {
                throw new Error(`HTTP error! status: ${groupsResponse.status}`);
            }
    
            const programData = await groupsResponse.json();
            
            // Get the select element
            const groupSelect = targetElement.querySelector('#appGroup');
            if (groupSelect) {
                // Keep the default option
                groupSelect.innerHTML = '<option value="" disabled selected>Select a group</option>';
                
                // Add options for each program group
                programData.program_groups.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group.name.toLowerCase();
                    option.textContent = group.name;
                    groupSelect.appendChild(option);
                });
            }
            
            this.setupFormHandler(targetElement);
        } catch (error) {
            console.error('Error loading template or program groups:', error);
            targetElement.innerHTML = '<p>Error loading content. Please try again.</p>';
        }
    },

    setupFormHandler(targetElement) {
        const form = targetElement.querySelector('#applicationForm');
        const iconPaths = {
            default: "path d='M9 17h6M9 12h6M9 7h6'"
        };
    
        function generateAppId(appName) {
            const cleanName = appName
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '')
                .substring(0, 25);
                
            console.log('Generated appId:', cleanName);
            return cleanName;
        }
    
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('🚀 Starting application creation process...');
            
            const appName = document.getElementById('appName').value;
            const appId = generateAppId(appName);
            console.log('📝 Original Name:', appName);
            console.log('🔑 Generated ID:', appId);
    
            try {
                // Check if app ID exists
                console.log('🔍 Checking if application ID exists...');
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
                    console.log('❌ Application ID already exists');
                    alert(`An application with ID "${appId}" already exists. Please choose a different name.`);
                    return;
                }
    
                const appGroup = document.getElementById('appGroup').value;
                const appDescription = document.getElementById('appDescription').value;
    
                console.log('📦 Creating new program with cleaned ID...');
                const newProgram = {
                    id: appId,
                    name: appName,
                    displayName: appName,
                    icon: iconPaths.default,
                    action: "launch_program"
                };
    
                console.log('📤 Sending creation request to server...');
                const response = await fetch('/api/create_application', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appId,           // Clean ID for system use
                        appName,         // Original name for display
                        appGroup,
                        appDescription,
                        programData: newProgram
                    })
                });
    
                const result = await response.json();
                
                if (result.success) {
                    console.log('✅ Application created successfully!');
                    
                    // Show success message with both display name and ID
                    const successMessage = `
                        Application "${appName}" created successfully!
                        System ID: ${appId}
                        Location: ${result.path || 'Application directory'}
                    `;
                    
                    alert(successMessage);
                    
                    // Optional: Redirect to new application
                    if (result.redirect) {
                        console.log('🔄 Redirecting to new application...');
                        window.location.href = result.redirect;
                    }
                } else {
                    throw new Error(result.message || 'Failed to create application');
                }
    
            } catch (error) {
                console.error('❌ Error creating application:', error);
                alert(`Failed to create application: ${error.message || 'Please try again.'}`);
            }
        });
    } 
};