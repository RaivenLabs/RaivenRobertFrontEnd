import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';



import { Mail, User, Eye, EyeOff } from 'lucide-react';

const Authentication = ({ onSuccess }) => {
  // Keep all existing state hooks
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const isEmail = (value) => {
    return value.includes('@');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        // Use our new initiateLogin from authService
        const result = await authService.initiateLogin(identifier, password);
        
        if (result.success) {
            // Only update AuthContext if we got success
            await login({
                accessToken: result.data.accessToken,
                idToken: result.data.idToken,
                refreshToken: result.data.refreshToken,
                userGroups: result.data.userGroups || [],
                expiresIn: result.data.expiresIn
            });

            // Only call onSuccess (which closes modal) after confirmed success
            if (onSuccess) {
                onSuccess();
            }
        } else {
            // Handle specific error from service
            setError(result.error || 'Login failed. Please check your credentials.');
        }
    } catch (err) {
        console.error('Login error:', err);
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  // Rest of the component stays exactly the same...

  const handleMicrosoftLogin = () => {
    const msftAuthParams = new URLSearchParams({
      client_id: '4bbnjatfcvh75e178mnigqvlp',
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: window.location.origin + '/auth/callback',
      identity_provider: 'AzureAD'
    });

    const url = `https://cognito-idp.us-west-2.amazonaws.com/us-west-2_DUnrszKaF/oauth2/authorize?${msftAuthParams}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 bg-black bg-opacity-50 z-[9999]">
      <div className="w-[400px] h-[7in] bg-gray-100 p-8 rounded-lg shadow-lg flex flex-col justify-between">
        <div className="h-full w-full bg-ivory rounded-lg p-6 mb-[24px]">
          <h2 className="text-2xl text-teal font-bold text-center mb-6">
            Tangible Intelligence Login
          </h2>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block mb-2 font-semibold text-royal-blue"
              >
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  {isEmail(identifier) ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <User className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full p-3 pl-11 border-2 border-light-blue rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue transition-colors bg-white"
                  placeholder="Enter your email or username"
                  disabled={isLoading}
                />
              </div>
              {identifier && (
                <p className="mt-1 text-xs text-gray-500">
                  {isEmail(identifier) 
                    ? 'Using email address for login'
                    : 'Using username for login'}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-semibold text-royal-blue"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-light-blue rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue transition-colors bg-white"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 bg-gray-100 text-royal-blue rounded-md transition-colors ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-hover-blue'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className={`w-full p-3 bg-gray-100 text-royal-blue border-2 border-royal-blue rounded-md transition-colors flex items-center justify-center space-x-2 ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-light-blue'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M1 12h10v10H1z" />
              <path fill="#7fba00" d="M12 1h10v10H12z" />
              <path fill="#ffb900" d="M12 12h10v10H12z" />
            </svg>
            <span>Sign in with Microsoft</span>
          </button>
        </div>

        <div className="mt-auto text-sm text-center">
          <a
            href="/auth/forgot-password"
            className="text-royal-blue hover:text-hover-blue transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
