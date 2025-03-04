import React, { useEffect, useState } from 'react';
import { Users, FileSpreadsheet, ArrowRight } from 'lucide-react';

// Template variable mappings
const TEMPLATE_MAPPINGS = {
  CUSTOMER: '{{Customer}}',
  CUSTOMER_ADDRESS: '{{CustomerAddress}}',
  CONTRACTOR: '{{Contractor}}',
  CONTRACTOR_ADDRESS: '{{ContractorAddress}}',
  EFFECTIVE_DATE: '{{EffectiveDate}}',
  GOVERNING_LAW: '{{GoverningLaw}}',
  PROJECT_DESCRIPTION: '{{ProjectDescription}}',
  CUSTOMER_SIGNATURE_BLOCK: '{{CUSTOMERSIGNATUREBLOCK}}',
  CONTRACTOR_SIGNATURE_BLOCK: '{{CONTRACTORSIGNATUREBLOCK}}'
};

const predefinedCustomers = [
  { 
    id: 'nike', 
    name: 'NIKE, Inc.',
    address: '1 SW Bowerman Dr, Beaverton, OR 97005',
    preferredState: 'Oregon'
  },
  { id: 'converse', name: 'Converse, Inc.' },
  { id: 'ge', name: 'General Electric, Inc.' },
  { id: '3m', name: '3M, Inc.' },
  { value: 'new', name: '+ Add New Company' }
];

const predefinedContractors = [
  { 
    id: 'infosys', 
    name: 'Infosys, Inc.',
    address: 'Electronics City, Hosur Road, Bangalore 560 100, India',
    preferredState: 'California'
  },
  { id: 'wipro', name: 'Wipro Limited' },
  { id: 'cognizant', name: 'Cognizant Technology Solutions' },
  { value: 'new', name: '+ Add New Company' }
];

const DealConstantsConfig = ({ 
    templates,  // Should receive the full template objects
    programClass, 
    onContinue 
  }) => {
    const [customerData, setCustomerData] = useState({});
    const [contractorData, setContractorData] = useState({});
    const [dealData, setDealData] = useState({});
  
    // Log when templates prop changes
    useEffect(() => {
      console.log('📝 Templates in DealConstantsConfig updated:', templates);
    }, [templates]);
  
    // Constants for template variable mappings
   
        const TEMPLATE_MAPPINGS = {
            CUSTOMER: 'Customer',
            CUSTOMER_ADDRESS: 'CustomerAddress',
            CONTRACTOR: 'Contractor',
            CONTRACTOR_ADDRESS: 'ContractorAddress',
            EFFECTIVE_DATE: 'EffectiveDate',
            GOVERNING_LAW: 'GoverningLaw',
            PROJECT_DESCRIPTION: 'ProjectDescription',
            CUSTOMER_SIGNATURE_BLOCK: 'CUSTOMERSIGNATUREBLOCK',
            CONTRACTOR_SIGNATURE_BLOCK: 'CONTRACTORSIGNATUREBLOCK'
        };
  
    const handleContinue = () => {
        // Log initial state
        console.log('🔍 Starting handleContinue with:', {
          templates,
          customerData,
          contractorData,
          dealData
        });
      
        // Create precise mappings between form data and template variables
        const templateSubstitutions = {
          [TEMPLATE_MAPPINGS.CUSTOMER]: customerData.Customer || '',
          [TEMPLATE_MAPPINGS.CUSTOMER_ADDRESS]: customerData.CustomerAddress || '',
          [TEMPLATE_MAPPINGS.CONTRACTOR]: contractorData.Contractor || '',
          [TEMPLATE_MAPPINGS.CONTRACTOR_ADDRESS]: contractorData.ContractorAddress || '',
          [TEMPLATE_MAPPINGS.EFFECTIVE_DATE]: dealData.EffectiveDate || '',
          [TEMPLATE_MAPPINGS.GOVERNING_LAW]: dealData.GoverningLaw || '',
          [TEMPLATE_MAPPINGS.PROJECT_DESCRIPTION]: dealData.ProjectDescription || '',
          [TEMPLATE_MAPPINGS.CUSTOMER_SIGNATURE_BLOCK]: customerData.Customer || '',
          [TEMPLATE_MAPPINGS.CONTRACTOR_SIGNATURE_BLOCK]: contractorData.Contractor || ''
        };
      
        // Ensure we have the template info
        if (!templates || (Array.isArray(templates) && templates.length === 0)) {
          console.warn('⚠️ No templates found in DealConstantsConfig!');
        }
      
        // Package all data together, ensuring template data is included
        const dealPackageData = {
          template: Array.isArray(templates) ? templates[0] : templates,  // Use single template
          templateSubstitutions,
          programClass,
          rawData: {
            customerData,
            contractorData,
            dealData
          }
        };
      
        console.log('📦 Assembled deal package:', dealPackageData);
      
        if (onContinue) {
          console.log('🚀 Calling onContinue with deal package');
          onContinue(dealPackageData);
        }
      };
  
    // Rest of component JSX...
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Party Information Panel */}
        <div className="col-span-2 rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal to-teal/90 text-white px-6 py-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Party Information</h3>
            </div>
          </div>
          
          <div className="p-6 bg-white">
            <div className="grid grid-cols-3 gap-8">
              {/* Concepts Column */}
              <div className="space-y-8">
                <div className="mb-2 text-sm text-gray-500 uppercase tracking-wider">
                  Concept
                </div>
                <div className="py-2">
                  <p className="text-royalBlue font-medium">Legal Entity Name</p>
                  <p className="text-sm text-gray-500 mt-1">Full legal name of the entity</p>
                </div>
                <div className="py-2">
                  <p className="text-royalBlue font-medium">Principal Address</p>
                  <p className="text-sm text-gray-500 mt-1">Principal place of business</p>
                </div>
              </div>

              {/* Customer Column */}
              <div className="space-y-8">
                <div className="mb-2 text-sm text-gray-500 uppercase tracking-wider">
                  Customer Data
                </div>
                <div className="py-2">
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal"
                    value={customerData.Customer || ''}
                    onChange={(e) => {
                      const selectedCustomer = predefinedCustomers.find(c => c.name === e.target.value);
                      setCustomerData(prev => ({
                        ...prev,
                        Customer: e.target.value,
                        CustomerAddress: selectedCustomer?.address || ''
                      }));
                      
                      if (selectedCustomer?.preferredState) {
                        setDealData(prev => ({
                          ...prev,
                          GoverningLaw: selectedCustomer.preferredState
                        }));
                      }
                    }}
                  >
                    <option value="">Select Customer</option>
                    {predefinedCustomers.map(customer => (
                      <option key={customer.id || customer.value} value={customer.name}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-2">
                  <input
                    type="text"
                    placeholder="Enter customer address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal"
                    value={customerData.CustomerAddress || ''}
                    onChange={(e) => setCustomerData(prev => ({
                      ...prev,
                      CustomerAddress: e.target.value
                    }))}
                  />
                </div>
              </div>

              {/* Contractor Column */}
              <div className="space-y-8">
                <div className="mb-2 text-sm text-gray-500 uppercase tracking-wider">
                  Contractor Data
                </div>
                <div className="py-2">
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal"
                    value={contractorData.Contractor || ''}
                    onChange={(e) => {
                      const selectedContractor = predefinedContractors.find(c => c.name === e.target.value);
                      setContractorData(prev => ({
                        ...prev,
                        Contractor: e.target.value,
                        ContractorAddress: selectedContractor?.address || ''
                      }));

                      // Only set contractor's preferred state if no customer preference exists
                      const selectedCustomer = predefinedCustomers.find(c => c.name === customerData.Customer);
                      if (selectedContractor?.preferredState && !selectedCustomer?.preferredState) {
                        setDealData(prev => ({
                          ...prev,
                          GoverningLaw: selectedContractor.preferredState
                        }));
                      }
                    }}
                  >
                    <option value="">Select Contractor</option>
                    {predefinedContractors.map(contractor => (
                      <option key={contractor.id || contractor.value} value={contractor.name}>
                        {contractor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-2">
                  <input
                    type="text"
                    placeholder="Enter contractor address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal"
                    value={contractorData.ContractorAddress || ''}
                    onChange={(e) => setContractorData(prev => ({
                      ...prev,
                      ContractorAddress: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Information Panel */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal to-teal/90 text-white px-6 py-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Deal Information</h3>
            </div>
          </div>

          <div className="p-6 bg-white space-y-6">
            <div>
              <label className="block text-royalBlue font-medium mb-2">
                Effective Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal"
                value={dealData.EffectiveDate || ''}
                onChange={(e) => setDealData(prev => ({
                  ...prev,
                  EffectiveDate: e.target.value
                }))}
              />
            </div>

            <div>
              <label className="block text-royalBlue font-medium mb-2">
                Governing Law
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal"
                value={dealData.GoverningLaw || ''}
                onChange={(e) => setDealData(prev => ({
                  ...prev,
                  GoverningLaw: e.target.value
                }))}
              >
                <option value="">Select State</option>
                <option value="Oregon">Oregon</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Delaware">Delaware</option>
              </select>
            </div>

            <div>
              <label className="block text-royalBlue font-medium mb-2">
                Project Description
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal h-32"
                placeholder="Enter project description"
                value={dealData.ProjectDescription || ''}
                onChange={(e) => setDealData(prev => ({
                  ...prev,
                  ProjectDescription: e.target.value
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
        >
          Continue to Build Deal Package
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DealConstantsConfig;
