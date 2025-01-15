// src/services/authService.js
const getBaseUrl = () => {
    return process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api/auth'
        : 'https://hawkeye-plaform20-env.eba-rmrjrpxg.us-west-2.elasticbeanstalk.com/api/auth';
};

export const authService = {
    initiateLogin: async (identifier, password) => {
        console.log('🔐 Starting login process for:', identifier);
        try {
            const response = await fetch(`${getBaseUrl()}/cognito-auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            });

            const data = await response.json();
            console.log('🔑 Auth Response:', {
                success: !!data.accessToken,
                hasUserGroups: !!data.userGroups,
                groups: data.userGroups || [],
                timestamp: new Date().toISOString()
            });
            
            if (data.accessToken && data.userGroups) {
                console.log('✅ Login successful');
                return {
                    success: true,
                    data
                };
            }

            console.log('❌ Login failed: Invalid authentication response');
            return {
                success: false,
                error: 'Invalid authentication response'
            };

        } catch (error) {
            console.error('❌ Login error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    initiateLogout: async () => {
        console.log('🔒 Starting logout process');
        try {
            // Log current auth state before logout
            console.log('📊 Pre-logout state:', {
                hasAccessToken: !!localStorage.getItem('accessToken'),
                hasIdToken: !!localStorage.getItem('idToken'),
                hasRefreshToken: !!localStorage.getItem('refreshToken'),
                userGroups: sessionStorage.getItem('userGroups'),
                timestamp: new Date().toISOString()
            });

            const response = await fetch(`${getBaseUrl()}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            
            // Clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('idToken');
            localStorage.removeItem('refreshToken');
            sessionStorage.removeItem('userGroups');

            console.log('✅ Logout complete - all tokens cleared');
            
            return {
                success: true,
                data: {
                    message: 'Logged out successfully'
                }
            };
        } catch (error) {
            console.error('⚠️ Logout API error:', error);
            // Still clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('idToken');
            localStorage.removeItem('refreshToken');
            sessionStorage.removeItem('userGroups');
            
            console.log('✅ Local logout complete despite API error');
            
            return {
                success: true,
                data: {
                    message: 'Logged out successfully'
                }
            };
        }
    },

    // Add a new method to check current auth state
    checkAuthState: () => {
        const authState = {
            hasAccessToken: !!localStorage.getItem('accessToken'),
            hasIdToken: !!localStorage.getItem('idToken'),
            hasRefreshToken: !!localStorage.getItem('refreshToken'),
            userGroups: JSON.parse(sessionStorage.getItem('userGroups') || 'null'),
            timestamp: new Date().toISOString()
        };
        
        console.log('🔍 Current Auth State:', authState);
        return authState;
    }
};


