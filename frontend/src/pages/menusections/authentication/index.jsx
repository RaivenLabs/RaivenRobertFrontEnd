import React from 'react';
import {
  Shield,
  Key,
  Users,
  Building2,
  Settings,
  Lock,
  Fingerprint,
  UserCheck,
  Layout,
  Layers,
  Share2,
  ShieldCheck,
} from 'lucide-react';

const AuthenticationOverview = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">
              Enterprise Authentication
            </h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            World-class security meets seamless access management
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Enterprise-ready authentication with SSO integration and granular
            access controls
          </p>
        </header>

        {/* Main Features Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Authentication & Access Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Key className="w-8 h-8" />,
                title: 'Enterprise SSO',
                description:
                  'Seamless integration with your existing identity providers',
                features: [
                  'Azure AD integration',
                  'SAML 2.0 support',
                  'OAuth 2.0 & OpenID Connect',
                ],
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: 'Access Levels',
                description:
                  'Granular control over platform and application access',
                features: [
                  'Role-based access control',
                  'Custom permission sets',
                  'Feature-level permissions',
                ],
              },
              {
                icon: <Building2 className="w-8 h-8" />,
                title: 'Multi-Tenant Management',
                description: 'Secure separation with flexible sharing options',
                features: [
                  'Tenant isolation',
                  'Cross-tenant collaboration',
                  'Custom domain support',
                ],
              },
              {
                icon: <UserCheck className="w-8 h-8" />,
                title: 'User Management',
                description: 'Comprehensive user lifecycle management',
                features: [
                  'Automated provisioning',
                  'Group management',
                  'Access request workflows',
                ],
              },
              {
                icon: <Fingerprint className="w-8 h-8" />,
                title: 'Security Controls',
                description: 'Enterprise-grade security features',
                features: [
                  'Multi-factor authentication',
                  'Session management',
                  'Security policy enforcement',
                ],
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: 'Collaboration Controls',
                description: 'Secure sharing and collaboration features',
                features: [
                  'External user management',
                  'Sharing policies',
                  'Collaboration spaces',
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-royalBlue mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <ShieldCheck className="w-4 h-4 text-royalBlue mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Integration Benefits Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Enterprise Integration Benefits
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <Lock className="w-6 h-6" />,
                label: 'Zero Trust Security',
                description: 'Complete security with every request verified',
              },
              {
                icon: <Users className="w-6 h-6" />,
                label: 'Unified Access',
                description: 'Single sign-on across all platform features',
              },
              {
                icon: <Settings className="w-6 h-6" />,
                label: 'Flexible Configuration',
                description: 'Adaptable to your security requirements',
              },
              {
                icon: <Layout className="w-6 h-6" />,
                label: 'Custom Workflows',
                description: "Tailored to your organization's needs",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-lightGray rounded-lg"
              >
                <span className="text-royalBlue mr-3 mt-1">{benefit.icon}</span>
                <div>
                  <span className="font-medium block mb-1">
                    {benefit.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {benefit.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Standards */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">
              Security Standards
            </h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  SOC 2 Type II and ISO 27001 certified infrastructure
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  GDPR and CCPA compliant data handling
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Regular third-party security audits and penetration testing
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>
            © 2025 Tangible Intelligence, ai. The Tangible Intelligence
            Platform. Enterprise-grade security without compromise.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthenticationOverview;
