
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        if (!document.querySelector('link[href*="data_table.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/static/shared/table/static/css/data_table.css';
            
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },

    render(sectionName, targetElement) {
        targetElement.innerHTML = `
            <div class="table-reporting">
                <div class="panel-title">
                    Active Projects
                </div>
                <div class="panel-content">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Agreement ID</th>
                                    <th>Title</th>
                                    <th>Counterparty</th>
                                    <th>Category</th>
                                    <th>Role</th>
                                    <th>Effective Date</th>
                                    <th>End Date</th>
                                    <th>Region</th>
                                    <th>Status</th>
                                    <th>CLM Reference</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="agreementTableBody">
                            </tbody>
                        </table>
                    </div>
                </div>
               <div class="dashboard-actions">
    <button class="import-button" id="importDataButton">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Import Sample Transaction Data
    </button>
    
    <button class="import-button" id="importProjectDataButton">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Import Project Data
    </button>
</div>
           

            </div>
            <input type="file" id="fileInput" accept=".json,.csv" style="display: none">
            <div id="toast" class="toast"></div>
        `;

       
    },

    async loadInitialData() {
        try {
            const { 
                agreementData, 
                getChildren, 
                getAmendments, 
                getFamilyTree,
                searchAgreements 
            } = await import('/application_groups/static/shared/table/static/data/sampleagreementdata.js');
       
            this.agreementHelpers = {
                getChildren,
                getAmendments,
                getFamilyTree,
                searchAgreements
            };

            const processedData = this.processImportData(agreementData);
            this.populateTable(processedData);
            this.showToast('Sample data imported successfully', 'success');
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showToast('Error loading initial data', 'error');
        }
    },

    processImportData(data) {
        try {
            const categoryCounters = {};
            const parentIdMapping = new Map();
            const amendmentCounters = new Map();
            const childCounters = new Map();
            
            // First pass - process parent records
            let processedData = data.map(agreement => {
                if (agreement.family_role === 'parent') {
                    if (!categoryCounters[agreement.taxonomy_category]) {
                        categoryCounters[agreement.taxonomy_category] = 1;
                    }
                    const counter = categoryCounters[agreement.taxonomy_category]++;
                    const sequenceNumber = String(counter).padStart(4, '0');
                    const newParentId = `${agreement.taxonomy_category}${sequenceNumber}-P`;
                    
                    parentIdMapping.set(agreement.title, newParentId);
                    
                    return {
                        agreement_id: newParentId,
                        original_parent_id: agreement.parent_id,
                        ...agreement
                    };
                }
                return agreement;
            });

            // Second pass - process child records
            processedData = processedData.map(agreement => {
                if (agreement.family_role === 'child') {
                    const parentRecord = processedData.find(
                        parent => parent.family_role === 'parent' && 
                                parent.taxonomy_category === agreement.taxonomy_category &&
                                parent.counterparty === agreement.counterparty
                    );
                    
                    const parentId = parentRecord ? parentRecord.agreement_id : agreement.parent_id;
                    
                    if (!childCounters.has(parentId)) {
                        childCounters.set(parentId, 1);
                    }
                    const childNumber = childCounters.get(parentId);
                    childCounters.set(parentId, childNumber + 1);
                    
                    const agreement_id = `${agreement.taxonomy_category}C${childNumber}(${parentId})`;
                    
                    return {
                        agreement_id,
                        original_parent_id: agreement.parent_id,
                        ...agreement
                    };
                }
                return agreement;
            });

            // Third pass - process amendments
            processedData = processedData.map(agreement => {
                if (agreement.family_role === 'amends') {
                    const targetId = agreement.amends_id;
                    
                    if (!amendmentCounters.has(targetId)) {
                        amendmentCounters.set(targetId, 1);
                    }
                    const amendmentNumber = amendmentCounters.get(targetId);
                    amendmentCounters.set(targetId, amendmentNumber + 1);

                    const agreement_id = `${agreement.taxonomy_category}.A${amendmentNumber}(${targetId})`;
                    
                    return {
                        agreement_id,
                        amends_id: targetId,
                        amendment_number: amendmentNumber,
                        ...agreement
                    };
                }
                return agreement;
            });

            // Debug logging
            console.log('\nProcessed Agreements:', processedData);
            console.log('\nParent ID Mapping:', parentIdMapping);
            console.log('\nChild Counters:', childCounters);
            console.log('\nAmendment Counters:', amendmentCounters);

            return processedData;

        } catch (error) {
            console.error('Error processing data:', error);
            this.showToast('Error processing data', 'error');
            throw error;
        }
    },

    populateTable(data) {
        const tableBody = document.getElementById('agreementTableBody');
        tableBody.innerHTML = data.map(row => `
            <tr>
                <td><span class="agreement-id" title="Full ID: ${row.agreement_id}">${row.agreement_id}</span></td>
                <td>${row.title}</td>
                <td>${row.counterparty}</td>
                <td>${row.taxonomy_category}</td>
                <td>${row.family_role}</td>
                <td>${row.effective_date}</td>
                <td>${row.end_date}</td>
                <td>${row.region}</td>
                <td><span class="status-indicator status-${row.status?.toLowerCase()}">${row.status}</span></td>
                <td>${row.clm_reference || ''}</td>
                <td>
                    <button class="action-button" data-id="${row.agreement_id}">View</button>
                </td>
            </tr>
        `).join('');
    },

    setupListeners() {
        // Import button handler to load sample data
        const importButton = document.getElementById('importDataButton');
    
        importButton?.addEventListener('click', async () => {
            await this.loadInitialData();
        });
    
        // File input handler (if needed separately)
        const fileInput = document.getElementById('fileInput');
        fileInput?.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;
    
            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        const processedData = this.processImportData(data);
                        this.populateTable(processedData);
                        this.showToast('Data imported successfully', 'success');
                    } catch (error) {
                        console.error('Error parsing file:', error);
                        this.showToast('Error parsing file', 'error');
                    }
                };
                reader.readAsText(file);
            } catch (error) {
                console.error('Error reading file:', error);
                this.showToast('Error reading file', 'error');
            }
        });
    
        // Action button handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                const agreementId = e.target.dataset.id;
                this.handleActionClick(agreementId);
  
    
            }
        });
    },





    





    handleActionClick(agreementId) {
        // Implement view action
        console.log(`View clicked for agreement: ${agreementId}`);
        // Add your view logic here
    },

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast toast-${type} active`;

        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    },




};

