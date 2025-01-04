// login_module.js
export const program = {
    async launch(sectionName, targetElement) {
        await this.loadStyles();
        this.render(sectionName, targetElement);
        this.setupListeners();
    },

    async loadStyles() {
        console.log("Attempting to load login styles...");
        if (!document.querySelector('link[href*="login.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/application_groups/login/application_group_root/static/css/login.css';
            
            try {
                await new Promise((resolve, reject) => {
                    link.onload = () => {
                        console.log("Login styles loaded successfully");
                        resolve();
                    };
                    link.onerror = (e) => {
                        console.error("Failed to load login styles:", e);
                        reject(e);
                    };
                    document.head.appendChild(link);
                });
            } catch (error) {
                console.error("Error loading login styles:", error);
            }
        }
    },

    render(sectionName, targetElement) {
        console.log('Target Element:', targetElement);
        console.log('Target Element class:', targetElement.className);
        console.log('Target Element parent:', targetElement.parentElement);

        targetElement.innerHTML = `
           <div class="login-overlay">  <!-- New wrapper that respects engagement window -->
            <div class="login-container">  <!-- Renamed to avoid conflicts -->
                    <h2>Tangible Intelligence Login</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Email Address</label>
                            <input type="email" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit">Log In</button>
                    </form>
                    <div class="divider">Or</div>
                    <button id="msftLogin" class="microsoft-btn">
                        <svg class="microsoft-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
                            <path fill="#f25022" d="M1 1h10v10H1z"/>
                            <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                            <path fill="#7fba00" d="M12 1h10v10H12z"/>
                            <path fill="#ffb900" d="M12 12h10v10H12z"/>
                        </svg>
                        Sign in with Microsoft
                    </button>
                </div>
            </div>
        `;
    },

    setupListeners() {
        const loginForm = document.getElementById('loginForm');
        const msftLoginBtn = document.getElementById('msftLogin');
        const loginResult = document.getElementById('loginResult');

        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                // Here we'd add actual authentication logic
                await this.handleLogin(username, password);
            } catch (error) {
                loginResult.textContent = 'Login failed: ' + error.message;
                loginResult.style.color = 'red';
            }
        });

        msftLoginBtn?.addEventListener('click', () => {
            this.handleMicrosoftLogin();
        });
    },

    async handleLogin(username, password) {
        // Placeholder for actual authentication logic
        console.log('Login attempted with:', username);
        // Add your authentication logic here
    },

    async handleMicrosoftLogin() {
        // Placeholder for Microsoft authentication logic
        console.log('Microsoft login attempted');
        // Add your Microsoft authentication logic here
    }
};