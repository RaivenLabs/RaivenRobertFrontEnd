export const handler = {
    currentSection: null,
    currentApplication: null,
    currentView: 'upload',
    isInitialized: false,

   // Note to Robert:  This handler should first pull the entire page liek the job done by sandbox-hub includign both sidebar and the engagement window as with the ohter applciation landing pages.  The flow should be from here to run.py route followign the pattern of sandbox hub except taht sandbox hub was calling a section and we are calling an application (programID?)
   
   
   //launch(section) {
     //   console.log(`🎯 ${section} Hub launched!`);
       // window.location.href = `/${section}?section=${section}`;
  //  }


  //




    async init() {
        console.log('🚀 S3 Utility handler initializing...');
        if (!this.isInitialized) {
            const appElement = document.querySelector('[data-view-type="application"]');
            if (appElement) {
                this.currentSection = appElement.dataset.originSection;
                this.currentApplication = appElement.dataset.application;
                console.log(`📍 Initialized with section: ${this.currentSection}, application: ${this.currentApplication}`);
            }
            
            // First load the template
            await this.loadTemplate();
            // Then setup the interactions
            this.setupEventListeners();
            this.setupDropZone();
            this.isInitialized = true;
            console.log('✅ S3 Utility handler initialized');
        }
    },

    async loadTemplate() {
        try {
            console.log('📜 Loading S3 utility template...');
            const appElement = document.querySelector('[data-view-type="application"]');
            const section = appElement.dataset.originSection;
            
            // Check if we're already here via a redirect
            if (!window.location.href.includes('&redirected=true')) {
                window.location.href = `/s3?section=${section}&redirected=true`;
            }
            // If we're already redirected, do nothing and let the page load normally
            
        } catch (error) {
            console.error('❌ Error loading template:', error);
        }
    },

    setupEventListeners() {
        // Sidebar menu actions
        document.querySelectorAll('.menu-item[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                switch(action) {
                    case 'upload':
                        this.showUploadView();
                        break;
                    case 'browse':
                        this.showBrowserView();
                        break;
                    case 'manage':
                        this.showManageView();
                        break;
                    case 'return':
                        this.returnToMainMenu();
                        break;
                }
            });
        });

        // Upload controls
        const uploadButton = document.getElementById('uploadButton');
        const clearButton = document.getElementById('clearButton');
        const fileInput = document.getElementById('fileInput');

        if (uploadButton) {
            uploadButton.addEventListener('click', () => this.handleUpload());
        }
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearSelection());
        }
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        }
    },

    setupDropZone() {
        const dropzone = document.getElementById('uploadDropzone');
        if (dropzone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            dropzone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                this.handleFileSelection({ target: { files } });
            });
        }
    },

    showUploadView() {
        console.log('📤 Showing upload view');
        document.querySelector('.upload-section').style.display = 'block';
        document.querySelector('.file-browser-section').style.display = 'none';
    },

    showBrowserView() {
        console.log('📁 Showing browser view');
        document.querySelector('.upload-section').style.display = 'none';
        document.querySelector('.file-browser-section').style.display = 'block';
        this.loadFileList();
    },

    showManageView() {
        console.log('⚙️ Showing manage view');
        // TODO: Implement storage management view
    },

    async handleFileSelection(event) {
        const files = Array.from(event.target.files);
        console.log('📂 Files selected:', files.map(f => f.name));
        
        const fileList = document.querySelector('.file-list');
        fileList.innerHTML = files.map(file => `
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
        `).join('');

        document.getElementById('uploadButton').disabled = files.length === 0;
        document.getElementById('clearButton').disabled = files.length === 0;
    },

    returnToMainMenu() {
        window.location.href = '/';
    },
// Add these functions to your handler object

async handleUpload() {
    try {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput.files.length) {
            console.log('No files selected');
            return;
        }

        const formData = new FormData();
        Array.from(fileInput.files).forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch('/s3/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            console.log('✅ Files uploaded successfully');
            // Clear the selection
            this.clearSelection();
            // Refresh the file list if in browser view
            if (this.currentView === 'browse') {
                this.loadFileList();
            }
        } else {
            console.error('❌ Upload failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Upload error:', error);
    }
},

async loadFileList() {
    try {
        const response = await fetch('/s3/list');
        const result = await response.json();
        
        if (result.success) {
            const fileBrowser = document.getElementById('fileBrowser');
            if (fileBrowser) {
                fileBrowser.innerHTML = result.files.map(file => `
                    <div class="file-item">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span class="file-date">${new Date(file.last_modified).toLocaleDateString()}</span>
                        <button onclick="handler.deleteFile('${file.name}')" class="delete-btn">
                            Delete
                        </button>
                    </div>
                `).join('');
            }
        } else {
            console.error('❌ Failed to load file list:', result.error);
        }
    } catch (error) {
        console.error('❌ Error loading file list:', error);
    }
},

clearSelection() {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.querySelector('.file-list');
    
    if (fileInput) {
        fileInput.value = '';
    }
    if (fileList) {
        fileList.innerHTML = '';
    }
    
    document.getElementById('uploadButton').disabled = true;
    document.getElementById('clearButton').disabled = true;
},

async deleteFile(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
        return;
    }

    try {
        const response = await fetch(`/s3/delete/${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('✅ File deleted successfully');
            this.loadFileList();  // Refresh the list
        } else {
            console.error('❌ Delete failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Delete error:', error);
    }
}

};

console.log('📦 S3 Utility handler module loaded');
handler.init();