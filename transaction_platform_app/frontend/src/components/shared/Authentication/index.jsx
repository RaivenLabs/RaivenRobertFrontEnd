import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const Authentication = ({ onSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/auth/api/auth/cognito-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      const data = await response.json();
      await login(data);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleMicrosoftLogin = () => {
    const msftAuthParams = new URLSearchParams({
      client_id: '47l1p0md5fpj3adg86no3h0sk6',
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: window.location.origin + '/auth/callback',
      identity_provider: 'AzureAD'
    });

    const url = `https://cognito-idp.us-west-2.amazonaws.com/us-west-2_JnwmUHLzc/oauth2/authorize?${msftAuthParams}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 bg-black bg-opacity-50 z-[9999]">
  <div className="w-[400px] h-[7in] bg-gray-100 p-8 rounded-lg shadow-lg flex flex-col justify-between">
    <div className="h-full w-full bg-ivory rounded-lg p-6 mb-[24px]"> {/* Adjusted margin */}
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
            Email Address
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full p-3 border-2 border-light-blue rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue transition-colors bg-white"
            placeholder="Enter your email or username"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 font-semibold text-royal-blue"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border-2 border-light-blue rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue transition-colors bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-royal-blue text-ivory rounded-md hover:bg-hover-blue transition-colors"
        >
          Log In
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
        className="w-full p-3 bg-white text-royal-blue border-2 border-royal-blue rounded-md hover:bg-light-blue transition-colors flex items-center justify-center space-x-2"
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
