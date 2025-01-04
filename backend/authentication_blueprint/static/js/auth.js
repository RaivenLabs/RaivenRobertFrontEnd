// Initialize Cognito User Pool with config from our template
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: window.cognitoConfig.UserPoolId,
    ClientId: window.cognitoConfig.ClientId
});

// Helper function to display messages to the user
function displayMessage(message, type = 'info') {
    const resultDiv = document.getElementById('loginResult');
    if (resultDiv) {
        resultDiv.textContent = message;
        resultDiv.style.color = type === 'error' ? 'red' : 
                               type === 'success' ? 'green' : 
                               type === 'warning' ? 'orange' : 'blue';
        resultDiv.style.display = 'block';
    }
    
    // Also log to journey-log if it exists
    const journeyLog = document.getElementById('journey-log');
    if (journeyLog) {
        const entry = document.createElement('div');
        entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        entry.className = `journey-step ${type}`;
        journeyLog.insertBefore(entry, journeyLog.firstChild);
    }
}

// Handle direct Cognito login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create authentication details
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    // Create user data object
    const userData = {
        Username: username,
        Pool: userPool
    };

    // Create Cognito user object
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // Attempt authentication
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async function(result) {
            try {
                // Get tokens
                const accessToken = result.getAccessToken().getJwtToken();
                const idToken = result.getIdToken().getJwtToken();
                
                // First, send tokens to your server to establish session
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        access_token: accessToken,
                        id_token: idToken
                    })
                });
    
                const data = await response.json();
                
                if (data.success) {
                    displayMessage('Successfully logged in!', 'success');
                    // Redirect to the next URL or index
                    window.location.href = data.redirect_url || '/';
                } else {
                    displayMessage('Server session creation failed', 'error');
                }
            } catch (error) {
                displayMessage('Error establishing server session', 'error');
                console.error('Session error:', error);
            }
        },
        onFailure: function(err) {
            displayMessage(err.message, 'error');
            console.error('Authentication error:', err);
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            displayMessage('Please change your password', 'warning');
            // You could redirect to a password change page here
        }
    });
});

// Handle Microsoft SSO login
document.getElementById('msftLogin').addEventListener('click', () => {
    try {
        // Construct authentication parameters
        const msftAuthParams = new URLSearchParams({
            client_id: window.cognitoConfig.ClientId,
            response_type: 'code',
            scope: 'openid email profile',
            redirect_uri: 'http://localhost:5000/callback.html',
            identity_provider: 'AzureAD'
        });

        // Construct and log the full URL
        const url = `${window.cognitoConfig.Domain}/oauth2/authorize?${msftAuthParams}`;
        console.log('Redirecting to:', url);
        
        // Display message before redirect
        displayMessage('Redirecting to Microsoft login...', 'info');
        
        // Perform redirect
        window.location.href = url;
    } catch (error) {
        displayMessage(`Error initiating login: ${error.message}`, 'error');
        console.error('Login error:', error);
    }
});

// Check for authentication response on page load
window.addEventListener('load', () => {
    // Check if we have any stored tokens
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
        displayMessage('Already logged in', 'success');
    }
    
    // Check for authentication code or errors in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (code) {
        displayMessage('Successfully authenticated!', 'success');
        console.log('Authentication code received:', code);
    } else if (error) {
        displayMessage(`Authentication error: ${error} - ${errorDescription}`, 'error');
    }
});