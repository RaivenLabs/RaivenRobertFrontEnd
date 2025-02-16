import React from "react";
import {
  Users,
  Shield,
  FileText,
  Database,
  Settings,
  Key,
  Layout,
  Server,
} from "lucide-react";

const Configuration = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container"></div>
        <h1>Platform Configuration</h1>
        <p className="text-xl max-w-3xl mx-auto mb-2">
          Manage your platform settings, users, and enterprise configurations
        </p>
        <p className="text-lg max-w-3xl mx-auto">
          Your central hub for platform administration
        </p>
      </header>

      {/* Configuration Categories */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Platform Management Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Users className="w-8 h-8" />,
              title: "User Management",
              description:
                "Manage user accounts, roles, and access permissions",
              features: ["User Directory", "Role Assignment", "Access Control"],
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Security Settings",
              description:
                "Configure security policies and compliance settings",
              features: [
                "Authentication",
                "Security Policies",
                "Compliance Controls",
              ],
            },
            {
              icon: <FileText className="w-8 h-8" />,
              title: "Content Management",
              description: "Manage templates, forms, and standard content",
              features: ["Template Library", "Form Builder", "Content Rules"],
            },
            {
              icon: <Database className="w-8 h-8" />,
              title: "Data Management",
              description: "Configure data handling and storage settings",
              features: ["Data Retention", "Backup Settings", "Archive Rules"],
            },
            {
              icon: <Layout className="w-8 h-8" />,
              title: "Interface Settings",
              description: "Customize platform appearance and behavior",
              features: ["Branding", "Layout Options", "Navigation Settings"],
            },
            {
              icon: <Server className="w-8 h-8" />,
              title: "Integration Hub",
              description: "Manage external system connections and APIs",
              features: [
                "API Configuration",
                "System Connectors",
                "Data Exchange",
              ],
            },
          ].map((category, index) => (
            <div
              key={index}
              className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-royalBlue mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-sm">
                    <span className="w-1.5 h-1.5 bg-royalBlue rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Settings Section */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Quick Settings
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Key className="w-6 h-6" />,
              label: "API Keys",
              action: "Manage",
            },
            {
              icon: <Settings className="w-6 h-6" />,
              label: "Environment Settings",
              action: "Configure",
            },
          ].map((setting, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-lightGray rounded-lg hover:bg-lightBlue transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <span className="text-royalBlue mr-3">{setting.icon}</span>
                <span className="font-medium">{setting.label}</span>
              </div>
              <button className="px-4 py-2 bg-royalBlue text-white rounded-md hover:bg-royalBlue-hover transition-colors">
                {setting.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="bg-white py-8 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-royalBlue mb-4">
            Important Notes
          </h2>
          <div className="bg-lightGray p-6 rounded-lg">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-royalBlue mr-2">•</span>
                Platform configuration changes affect your entire organization's
                experience
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-2">•</span>
                Program-specific settings are managed through individual program
                configuration panels
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-2">•</span>
                Changes may require system administrator approval
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ivory text-ivory text-center py-8 px-4 mt-12 rounded-lg">
        <p>
          © 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform.
          Enterprise configuration made simple and secure.
        </p>
      </footer>
    </div>
  );
};

export default Configuration;
