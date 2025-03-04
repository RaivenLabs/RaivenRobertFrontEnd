import React, { useState } from 'react';
import { 
  Shield, 
  Lock,
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  EyeOff,
  Eye
} from 'lucide-react';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInitiateReset = (e) => {
    e.preventDefault();
    // In production, this would trigger the actual password reset flow
    setStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const renderPasswordStrengthIndicator = () => {
    // Simple password strength check for demo
    const strength = newPassword.length >= 12 ? 'strong' : 
                    newPassword.length >= 8 ? 'medium' : 'weak';
    
    return (
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <div className={`h-2 flex-1 rounded ${
            strength === 'strong' ? 'bg-green-500' :
            strength === 'medium' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {strength.charAt(0).toUpperCase() + strength.slice(1)}
          </span>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                <p className="text-sm text-blue-700">
                  We'll help you reset your password safely. You'll need access to your email 
                  and your registered phone for MFA verification.
                </p>
              </div>
            </div>

            <form onSubmit={handleInitiateReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Reset Instructions
              </button>
            </form>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                <p className="text-sm text-blue-700">
                  We've sent a verification code to {email}. Please also check your spam folder if you don't see it.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"
                    placeholder="Enter verification code"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify Code
              </button>
            </form>

            <div className="flex justify-center">
              <button 
                onClick={() => setStep(1)}
                className="text-sm text-gray-600 hover:text-royalBlue"
              >
                Didn't receive the code? Try again
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                <p className="text-sm text-blue-700">
                  Create a strong password that includes uppercase and lowercase letters, 
                  numbers, and symbols. Minimum 12 characters recommended.
                </p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? 
                      <EyeOff className="w-5 h-5 text-gray-400" /> : 
                      <Eye className="w-5 h-5 text-gray-400" />
                    }
                  </button>
                </div>
                {renderPasswordStrengthIndicator()}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="w-5 h-5 text-gray-400" /> : 
                      <Eye className="w-5 h-5 text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset Password
              </button>
            </form>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold">Password Reset Successfully</h3>
            <p className="text-gray-600">
              Your password has been securely updated. You can now log in with your new password.
            </p>
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="mt-4 w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Shield className="w-6 h-6 text-royalBlue" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">
            We'll help you get back to your account securely
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div 
                key={stepNumber}
                className={`flex-1 ${stepNumber !== 4 ? 'border-t-2' : ''} ${
                  step >= stepNumber 
                    ? 'border-royalBlue' 
                    : 'border-gray-200'
                } pt-4 relative`}
              >
                <div 
                  className={`w-6 h-6 rounded-full ${
                    step > stepNumber 
                      ? 'bg-royalBlue text-white' 
                      : step === stepNumber 
                        ? 'border-2 border-royalBlue bg-white' 
                        : 'bg-gray-200'
                  } flex items-center justify-center absolute -top-3 ${
                    stepNumber === 1 
                      ? 'left-0' 
                      : stepNumber === 4 
                        ? 'right-0' 
                        : 'left-1/2 transform -translate-x-1/2'
                  }`}
                >
                  {step > stepNumber ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{stepNumber}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
