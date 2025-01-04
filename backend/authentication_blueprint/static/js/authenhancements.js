// Initialize Cognito User Pool with config from our template
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: window.cognitoConfig.UserPoolId,
    ClientId: window.cognitoConfig.ClientId
});

// Constants for token management and security
const TOKEN_REFRESH_MARGIN = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Track login attempts
let loginAttempts = 0;
let lastFailedLogin = 0;

// Helper function to display messages to the user with timeout
function displayMessage(message, type = 'info', timeout = 5000) {
    const resultDiv = document.getElementById('loginResult');
    if (resultDiv) {
        resultDiv.textContent = message;
        resultDiv.className = `message ${type}`; // Use CSS classes instead of inline styles
        resultDiv.style.display = 'block';
        
        // Clear message after timeout unless it's an error
        if (type !== 'error') {
            setTimeout(() => {
                resultDiv.style.display = 'none';
            }, timeout);
        }
    }
    
    // Log to journey-log with timestamp
    const journeyLog = document.getElementById('journey-log');
    if (journeyLog) {
        const entry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="timestamp">${timestamp}</span> - ${message}`;
        entry.className = `journey-step ${type}`;
        journeyLog.insertBefore(entry, journeyLog.firstChild);
        
        // Limit journey log entries
        while (journeyLog.children.length > 10) {
            journeyLog.removeChild(journeyLog.lastChild);
        }
    }
}

// Check if user is locked out
function isLockedOut() {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - lastFailedLogin;
        if (timeSinceLastAttempt < LOCKOUT_DURATION) {
            const remainingLockout = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
            displayMessage(`Too many failed attempts. Please try again in ${remainingLockout} minutes.`, 'error');
            return true;
        } else {
            // Reset attempts after lockout period
            loginAttempts = 0;
        }
    }
    return false;
}

// Handle direct Cognito login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (isLockedOut()) return;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic input validation
    if (!username || !password) {
        displayMessage('Please enter both email and password', 'error');
        return;
    }
    
    if (!username.includes('@')) {
        displayMessage('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    displayMessage('Authenticating...', 'info');

    try {
        // Create authentication details
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password
        });

        const userData = {
            Username: username,
            Pool: userPool
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        // Attempt authentication
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: async function(result) {
                loginAttempts = 0; // Reset attempts on success
                
                const accessToken = result.getAccessToken().getJwtToken();
                const idToken = result.getIdToken().getJwtToken();
                
                // Securely store tokens
                try {
                    sessionStorage.setItem('accessToken', accessToken);
                    sessionStorage.setItem('idToken', idToken);
                    sessionStorage.setItem('loginTime', Date.now().toString());
                    
                    displayMessage('Successfully logged in!', 'success');
                    
                    // Get user attributes
                    await new Promise((resolve, reject) => {
                        cognitoUser.getUserAttributes((err, attributes) => {
                            if (err) reject(err);
                            else resolve(attributes);
                        });
                    }).then(attributes => {
                        const userProfile = {};
                        attributes.forEach(attr => {
                            userProfile[attr.getName()] = attr.getValue();
                        });
                        sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
                        
                        // Redirect to dashboard or home page
                        window.location.href = '/dashboard';
                    });
                } catch (error) {
                    console.error('Error storing session data:', error);
                    displayMessage('Login successful but error setting up session', 'warning');
                }
            },
            onFailure: function(err) {
                loginAttempts++;
                lastFailedLogin = Date.now();
                displayMessage(err.message || 'Login failed', 'error');
                console.error('Authentication error:', err);
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                displayMessage('Please change your password', 'warning');
                // Redirect to password change page
                window.location.href = '/auth/change-password';
            }
        });
    } catch (error) {
        displayMessage('An error occurred during login', 'error');
        console.error('Login error:', error);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Handle Microsoft SSO login
document.getElementById('msftLogin').addEventListener('click', () => {
    try {
        // Generate and store state parameter for CSRF protection
        const state = Math.random().toString(36).substring(2);
        sessionStorage.setItem('oauth_state', state);
        
        // Construct authentication parameters
        const msftAuthParams = new URLSearchParams({
            client_id: window.cognitoConfig.ClientId,
            response_type: 'code',
            scope: 'openid email profile',
            redirect_uri: window.location.origin + '/auth/callback',
            identity_provider: 'AzureAD',
            state: state
        });

        const url = `${window.cognitoConfig.Domain}/oauth2/authorize?${msftAuthParams}`;
        displayMessage('Redirecting to Microsoft login...', 'info');
        window.location.href = url;
    } catch (error) {
        displayMessage('Error initiating Microsoft login', 'error');
        console.error('Microsoft login error:', error);
    }
});

// Check for authentication response on page load
window.addEventListener('load', () => {
    // Verify stored tokens and check expiration
    const accessToken = sessionStorage.getItem('accessToken');
    const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0');
    
    if (accessToken && loginTime) {
        const elapsed = Date.now() - loginTime;
        if (elapsed > (60 * 60 * 1000)) { // 1 hour
            sessionStorage.clear();
            displayMessage('Session expired. Please log in again.', 'warning');
        } else if (elapsed > (55 * 60 * 1000)) { // 55 minutes
            displayMessage('Session expiring soon', 'warning');
        }
    }
    
    // Check URL parameters for OAuth response
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');
    
    if (code) {
        // Verify state parameter
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
            displayMessage('Invalid authentication state', 'error');
            return;
        }
        
        sessionStorage.removeItem('oauth_state'); // Clean up
        displayMessage('Successfully authenticated!', 'success');
    } else if (error) {
        displayMessage(`Authentication error: ${urlParams.get('error_description')}`, 'error');
    }
});