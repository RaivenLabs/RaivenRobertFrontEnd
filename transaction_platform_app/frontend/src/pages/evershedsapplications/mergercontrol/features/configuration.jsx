
import React, {useState} from 'react';
import { 
  Building2, Globe, Scale, Settings, Database,
  Users, Key, FileText, AlertCircle, Link,
  // eslint-disable-next-line no-unused-vars
  Server, Shield, Briefcase, Calculator, Clock,
  // eslint-disable-next-line no-unused-vars
  DollarSign, MapPin, GitBranch, Activity
} from 'lucide-react';
import { useMergerControl } from '../../../../context/MergerControlContext';

const Banner = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>Merger Control Configuration</h1>
        <p>Configure your company settings and merger control parameters</p>
        <p>Set up persistent configurations for transaction analysis</p>
      </div>
    </header>
  </div>
);

const CompanySelector = () => {
  const { 
    buyingCompany, 
    updateBuyingCompany, 
    buyingCompanies,
    buyingCompanyData 
  } = useMergerControl();

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="w-5 h-5 text-royal-blue" />
            <label className="font-medium text-gray-700">Active Company:</label>
            <select
              value={buyingCompany || ''}
              onChange={(e) => updateBuyingCompany(e.target.value)}
              className="bg-white border border-gray-300 text-gray-800 rounded-md px-4 py-2 
                       focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-royal-blue
                       min-w-[250px] cursor-pointer [&_option]:text-gray-800"
            >
              <option value="" className="text-gray-800">Select Company</option>
              {Object.entries(buyingCompanies).map(([id, company]) => (
                <option key={id} value={id} className="text-gray-800">
                  {company.icon} {company.name}
                </option>
              ))}
            </select>
          </div>
          {buyingCompanyData && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                Sector: {buyingCompanyData.sector}
              </span>
              <span>|</span>
              <span>
                Revenue: {buyingCompanyData.revenue.global}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CompanyInfoCard = ({ company }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{company.icon}</span>
            <div>
              <h2 className="font-semibold text-xl text-royal-blue">
                {company.name}
              </h2>
              <p className="text-sm text-gray-600">{company.sector}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Active
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">HQ: {company.locations.headquarters}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Globe className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Presence: {company.locations.major_presence.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Financial & Employee Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Global Revenue</div>
            <div className="text-lg font-semibold text-royal-blue">
              {company.revenue.global}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Global Employees</div>
            <div className="text-lg font-semibold text-royal-blue">
              {company.employees.global.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">US Revenue</div>
            <div className="text-lg font-semibold text-royal-blue">
              {company.revenue.us}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">EU Revenue</div>
            <div className="text-lg font-semibold text-royal-blue">
              {company.revenue.eu}
            </div>
          </div>
        </div>
      </div>

      {/* Subsidiaries & Markets */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Structure & Markets</h3>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">Key Subsidiaries</div>
            <div className="space-y-1">
              {company.subsidiaries.map((sub, index) => (
                <div key={index} className="flex items-center text-sm">
                  <GitBranch className="w-3 h-3 mr-2 text-royal-blue" />
                  {sub}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Key Markets</div>
            <div className="flex flex-wrap gap-2">
              {company.key_markets.map((market, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-royal-blue rounded text-xs"
                >
                  {market}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center">
        <Activity className="w-4 h-4 mr-1" />
        Compliance Status: {company.compliance_status}
      </div>
      <div>
        Last Updated: {company.last_updated}
      </div>
    </div>
  </div>
);

const ConfigSection = ({ section }) => {
  const { acquiringCompanyData: companyData } = useMergerControl();

  const controlSections = {
    'company-profile': {
      title: "Company Profile",
      icon: <Building2 className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { 
          label: "Corporate Structure Setup", 
          icon: Building2,
          detail: companyData ? `${companyData.subsidiaries.length} subsidiaries` : null
        },
        { 
          label: "Revenue Data Management", 
          icon: Calculator,
          detail: companyData ? `Global: ${companyData.revenue.global}` : null
        },
        { 
          label: "Asset Portfolio Configuration", 
          icon: Briefcase,
          detail: companyData ? `Global: ${companyData.assets?.global}` : null
        },
        { 
          label: "Subsidiary Management", 
          icon: Users,
          detail: companyData ? `${companyData.employees.global} employees` : null
        },
        { 
          label: "Historical Transaction Records", 
          icon: Database 
        }
      ]
    },
    'jurisdictions': {
      title: "Jurisdiction Settings",
      icon: <Globe className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { 
          label: "Primary Jurisdictions", 
          icon: Globe,
          detail: companyData ? companyData.locations.major_presence.join(", ") : null
        },
        { label: "Filing Thresholds", icon: Scale },
        { label: "Local Representatives", icon: Users },
        { label: "Jurisdiction-Specific Rules", icon: FileText }
      ]
    },
   
   'workflow': {
      title: "Workflow Configuration",
      icon: <Settings className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Approval Workflows", icon: Users },
        { label: "Document Templates", icon: FileText },
        { label: "Timeline Templates", icon: Clock },
        { label: "Notification Settings", icon: AlertCircle }
      ]
    },
    'security': {
      title: "Security Settings",
      icon: <Shield className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Access Controls", icon: Key },
        { label: "Audit Settings", icon: FileText },
        { label: "Data Protection", icon: Shield },
        { label: "Compliance Monitoring", icon: AlertCircle }
      ]
    },
    'integrations': {
      title: "External Integrations",
      icon: <Link className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Legal Counsel Connections", icon: Scale },
        { label: "Financial Data Sources", icon: Database },
        { label: "Document Management", icon: FileText },
        { label: "Regulatory APIs", icon: Link }
      ]
    }
};

const sectionData = controlSections[section];
if (!sectionData) return null;

return (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center mb-4">
      {sectionData.icon}
      <h3 className="text-xl font-semibold">{sectionData.title}</h3>
    </div>
    <div className="space-y-3">
      {sectionData.controls.map((control, index) => (
        <button
          key={index}
          className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <control.icon className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
            <span>{control.label}</span>
          </div>
          {control.detail && (
            <span className="text-sm text-gray-500">{control.detail}</span>
          )}
        </button>
      ))}
    </div>
  </div>
);
};

const MergerControlConfiguration = () => {
const { 
  acquiringCompanyData,
  error,
  isLoading,
  clearError
} = useMergerControl();

const [activeSection, setActiveSection] = useState('company-profile');

const configSections = [
  {
    id: 'company-profile',
    label: 'Company Profile',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'jurisdictions',
    label: 'Jurisdictions',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: 'workflow',
    label: 'Workflow',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Link className="w-5 h-5" />,
  }
];

return (
  <div className="min-h-screen bg-ivory">
    <Banner />
    <CompanySelector />
    
    <div className="bg-royalBlue shadow-md w-full">
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

    <div className="max-w-7xl mx-auto px-4 py-6">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
                <button
                  onClick={clearError}
                  className="ml-2 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
        </div>
      ) : (
        <>
          {acquiringCompanyData && <CompanyInfoCard company={acquiringCompanyData} />}

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {configSections.find(s => s.id === activeSection)?.label} Configuration
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfigSection 
              section={activeSection}
            />
            {activeSection === 'company-profile' && (
              <ConfigSection 
                section="jurisdictions"
              />
            )}
            {/* ... rest of your conditional renders */}
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default MergerControlConfiguration; 
