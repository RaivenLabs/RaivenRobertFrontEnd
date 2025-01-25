import React, { createContext, useContext, useState, useEffect } from 'react';


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);  // Changed back to null since it's a single user object
  const [userGroups, setUserGroups] = useState([]);  // Array for groups is correct
  const [isLoading, setIsLoading] = useState(true);

  // Add configuration access levels
  const GROUP_PRECEDENCE = {
    'Tangible-Control': 0,  // Highest precedence (full access)
    'Atticus-Admin': 1,     // Company-specific admin access
    'Default': 999          // Lowest precedence
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/auth/check-session', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Session check data:', data);
          setIsAuthenticated(true);
          setUser(data.user);
          setUserGroups(data.userGroups || []);
        } else {
          resetAuthState();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        resetAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const resetAuthState = () => {
    console.log('🔄 Starting auth state reset');
    // Clear any stored tokens first
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userGroups');
    
    // Then reset the state
    setIsAuthenticated(false);
    setUser(null);
    setUserGroups([]);
    
    console.log('✅ Auth state reset complete');
  };
const login = async (userData) => {
  try {
    console.log(`🎉 AUTH STATE: Attempting Login...`);
    console.log(`📦 Full userData received:`, userData);  // See everything we got
    
    if (!userData.accessToken) {
      throw new Error('Missing access token in login data');
    }

    // Set states
    setIsAuthenticated(true);
    setUser(userData);
    setUserGroups(userData.userGroups || []);

    console.log(`✅ AUTH STATE: Login Successful`);
    console.log(`👥 User Groups Set:`, userData.userGroups);
    console.log(`🔐 Full Auth State:`, {
      isAuthenticated: true,
      userGroups: userData.userGroups,
    });
  } catch (error) {
    console.error('❌ Login state update failed:', error);
    resetAuthState();
    throw error;
  }
};

const logout = async () => {
  try {
    console.log(`👋 AUTH STATE: Processing Logout...`);
    console.log('🔍 Pre-logout state:', {
      isAuthenticated,
      userGroups,
      hasUser: !!user
    });
    
    // Clear state
    await resetAuthState();
    
    // Log the cleared state
    console.log('🔍 Post-logout state:', {
      isAuthenticated: false,
      userGroups: [],
      hasUser: false
    });
    
    console.log(`✅ AUTH STATE: Logged Out Successfully!`);
    console.log(`🌍 ENVIRONMENT: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('❌ Logout state update failed:', error);
    // Still attempt to reset state even if something fails
    resetAuthState();
    throw error;
  }
};



  // Enhanced group checking with precedence
  const getGroupPrecedence = (groupName) => {
    const normalizedGroup = groupName.toLowerCase().replace(/[-_\s]/g, '');
    for (const [key, value] of Object.entries(GROUP_PRECEDENCE)) {
      if (key.toLowerCase().replace(/[-_\s]/g, '') === normalizedGroup) {
        return value;
      }
    }
    return GROUP_PRECEDENCE.Default;
  };

  const isInGroup = (groupName) => {
    console.log(`🔍 Checking for group ${groupName} in:`, userGroups);
    const result = userGroups.includes(groupName);  // Direct comparison
    console.log(`✨ isInGroup result for ${groupName}:`, result);
    return result;
  };
  
  // And for Tangible Admin check
  const isTangibleAdmin = () => {
    console.log('👑 Tangible Admin check - Current groups:', userGroups);
    const isAdmin = isInGroup('Tangible-Control');  // Exact match with Cognito group
    console.log('👑 Is Tangible Admin?', isAdmin);
    return isAdmin;
  };

  const getHighestPrecedenceGroup = () => {
    let highestPrecedence = GROUP_PRECEDENCE.Default;
    let highestGroup = null;

    userGroups.forEach(group => {
      const precedence = getGroupPrecedence(group);
      if (precedence < highestPrecedence) {  // Lower number = higher precedence
        highestPrecedence = precedence;
        highestGroup = group;
      }
    });

    return highestGroup;
  };

  const getAccessibleConfigurations = () => {
    if (isTangibleAdmin()) {
      return 'all';  // Full access
    }
    
    const highestGroup = getHighestPrecedenceGroup();
    if (highestGroup) {
      // Extract company name from group (e.g., 'Atticus-Admin' -> 'Atticus')
      return highestGroup.split('-')[0];
    }
    
    return 'demo';  // Default to demo access
  };

  const hasCustomerAccess = (customerId) => {
    console.log(`Checking access for customer: ${customerId}`);
    if (isTangibleAdmin()) {
      console.log('User is Tangible Admin - access granted');
      return true;
    }
    
    const hasAccess = isInGroup(`${customerId}-Users`);
    console.log(`Customer access check result: ${hasAccess}`);
    return hasAccess;
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  const authValue = {
    isAuthenticated,
    user,
    userGroups,
    login,
    logout,
    isInGroup,
    isTangibleAdmin,
    hasCustomerAccess,
    getAccessibleConfigurations,
    getHighestPrecedenceGroup
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
