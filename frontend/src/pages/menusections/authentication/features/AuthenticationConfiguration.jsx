import React, { useState } from 'react';
import { useConfig } from '../../../../context/ConfigContext';
import { 
    Settings, Shield, Key, Users, 
    Building2, Lock, Fingerprint, 
    UserCheck, AlertCircle, Share2
} from 'lucide-react';

const SSOConfigSelector = () => {
  const { config } = useConfig();
  const [selectedProvider, setSelectedProvider] = useState('');

  const providers = [
    {
      type: 'AZURE',
      name: 'Azure Active Directory',
      description: 'Microsoft Azure AD SSO'
    },
    {
      type: 'OKTA',
      name: 'Okta',
      description: 'Okta Identity Provider'
    },
    {
      type: 'GOOGLE',
      name: 'Google Workspace',
      description: 'Google SSO Integration'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Key className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">SSO Configuration</h3>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Identity Provider
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-royalBlue focus:ring-1 focus:ring-royalBlue"
        >
          <option value="">Select a provider</option>
          {providers.map(provider => (
            <option key={provider.type} value={provider.type}>
              {provider.name}
            </option>
          ))}
        </select>
        {selectedProvider && (
          <div className="mt-4 p-3 bg-lightGray rounded-md flex items-center">
            <AlertCircle className="w-4 h-4 text-royalBlue mr-2" />
            <span className="text-sm">
              Active Provider: <span className="font-medium">
                {providers.find(p => p.type === selectedProvider)?.name}
              </span>
              <br />
              <span className="text-xs text-gray-600">
                {providers.find(p => p.type === selectedProvider)?.description}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthenticationConfiguration = () => {
  const [activeSection, setActiveSection] = useState('sso');

  const configSections = [
    {
      id: 'sso',
      label: 'SSO Setup',
      icon: <Key className="w-5 h-5" />,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'access',
      label: 'Access Control',
      icon: <Lock className="w-5 h-5" />,
    },
    {
      id: 'mfa',
      label: 'MFA',
      icon: <Fingerprint className="w-5 h-5" />,
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'sso':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SSO Configuration Card */}
            <SSOConfigSelector />

            {/* Authentication Controls Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-royalBlue mr-3" />
                <h3 className="text-xl font-semibold">Authentication Controls</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group">
                  <span>Test SSO Configuration</span>
                  <Key className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
                </button>
                <button className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group">
                  <span>Download SAML Metadata</span>
                  <Share2 className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
                </button>
                <button className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group">
                  <span>Reset Authentication Settings</span>
                  <AlertCircle className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
                </button>
              </div>
            </div>

            {/* Security Policy Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-royalBlue mr-3" />
                <h3 className="text-xl font-semibold">Security Policies</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-lightGray rounded-md">
                  <span>Enforce MFA</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-royalBlue" />
                </div>
                <div className="flex items-center justify-between p-3 bg-lightGray rounded-md">
                  <span>Session Timeout (minutes)</span>
                  <input type="number" className="w-20 p-1 border rounded" defaultValue={30} />
                </div>
                <div className="flex items-center justify-between p-3 bg-lightGray rounded-md">
                  <span>Password Policy</span>
                  <select className="p-1 border rounded">
                    <option>Standard</option>
                    <option>Strong</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Access Control Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <UserCheck className="w-6 h-6 text-royalBlue mr-3" />
                <h3 className="text-xl font-semibold">Access Controls</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-lightGray rounded-md">
                  <span>IP Restrictions</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-royalBlue" />
                </div>
                <div className="flex items-center justify-between p-3 bg-lightGray rounded-md">
                  <span>Device Trust</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-royalBlue" />
                </div>
                <div className="flex items-center justify-between p-3 bg-lightGray rounded-md">
                  <span>Conditional Access</span>
                  <select className="p-1 border rounded">
                    <option>Disabled</option>
                    <option>Basic</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a configuration area</div>;
    }
  };

  return (
    <div className="h-full bg-ivory">
      {/* Top Navigation Bar */}
      <div className="bg-royalBlue shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 flex items-center space-x-2 text-sm font-medium transition-colors
                          ${activeSection === section.id 
                            ? 'text-white border-b-2 border-white' 
                            : 'text-blue-100 hover:text-white'}`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {configSections.find(s => s.id === activeSection)?.label} Configuration
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthenticationConfiguration;
