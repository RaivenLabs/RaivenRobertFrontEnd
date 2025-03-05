import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Shield, Users, UserCheck, AlertCircle } from 'lucide-react';

const AuthTester = () => {
  const {
    isAuthenticated,
    user,
    userGroups,
    isInGroup,
    isTangibleAdmin
  } = useAuth();

  const [lastAuthState, setLastAuthState] = useState({
    isAuthenticated: false,
    groups: []
  });

  // Enhanced debugging useEffect
  useEffect(() => {
    console.log('AuthTester - Auth State Change Detected:', {
      isAuthenticated,
      user,
      userGroups,
      timestamp: new Date().toISOString()
    });

    // Track state changes
    if (isAuthenticated !== lastAuthState.isAuthenticated || 
        JSON.stringify(userGroups) !== JSON.stringify(lastAuthState.groups)) {
      console.log('State changed from:', lastAuthState, 'to:', {
        isAuthenticated,
        groups: userGroups
      });
      setLastAuthState({
        isAuthenticated,
        groups: userGroups
      });
    }
  }, [isAuthenticated, user, userGroups]);

  // Explicit group checks based on Cognito groups
  const checkTangibleControl = () => {
    const hasTangibleAccess = isInGroup('Tangible-Control');
    console.log('Tangible-Control check:', {
      result: hasTangibleAccess,
      currentGroups: userGroups
    });
    return hasTangibleAccess;
  };

  const checkAtticusAccess = () => {
    const hasAtticusAccess = isInGroup('Atticus');
    console.log('Atticus check:', {
      result: hasAtticusAccess,
      currentGroups: userGroups
    });
    return hasAtticusAccess;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Authentication Status Tester
      </h3>

      <div className="space-y-4">
        {/* Authentication Status */}
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          <span>Authentication Status: </span>
          <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>

        {/* Groups Debug Info */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Current Groups: </span>
          <span className="font-mono text-sm">
            {userGroups.length > 0 ? userGroups.join(', ') : 'No groups'}
          </span>
        </div>

        {/* Group-specific checks */}
        <div className="ml-7 space-y-2">
          <div className="flex items-center gap-2">
            <span>Tangible Control:</span>
            <span className={`${checkTangibleControl() ? 'text-green-600' : 'text-gray-500'}`}>
              {checkTangibleControl() ? '✅ Yes' : '❌ No'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Atticus Access:</span>
            <span className={`${checkAtticusAccess() ? 'text-green-600' : 'text-gray-500'}`}>
              {checkAtticusAccess() ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Debug Info:</span>
          </div>
          <pre className="mt-2 text-xs overflow-x-auto">
            {JSON.stringify({
              isAuthenticated,
              userGroups,
              user: user ? {
                ...user,
                // Remove sensitive info from debug output
                tokens: undefined,
                password: undefined
              } : null
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AuthTester;
