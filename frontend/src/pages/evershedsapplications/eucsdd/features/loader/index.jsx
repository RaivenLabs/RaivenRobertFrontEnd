import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Save, CheckCircle, XCircle, Building, Globe, Calculator, Euro } from 'lucide-react';
// To:
import { Card, CardContent } from "../../../../../components/ui/card";
import { Alert, AlertDescription } from "../../../../../components/ui/alert";

const EUCSDDLoader = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState('initial');
    const [responses, setResponses] = useState({});
    const [results, setResults] = useState(null);
  
    const handleResponse = (key, value) => {
      const newResponses = { ...responses, [key]: value };
      setResponses(newResponses);
      
      if (key === 'isEU') {
        if (value === 'no') {
          setCurrentStep('euOperations');
        } else {
          setCurrentStep('companySize');
        }
      } else if (key === 'euOperations') {
        if (value === 'no') {
          setResults({
            inScope: false,
            reason: 'No significant EU operations'
          });
        } else {
          setCurrentStep('companySize');
        }
      } else if (key === 'employeeCount') {
        if (value < 250) {
          setResults({
            inScope: false,
            reason: 'Company has fewer than 250 employees'
          });
        } else if (value >= 500) {
          setCurrentStep('turnover');
        } else {
          setCurrentStep('sector');
        }
      } else if (key === 'sector') {
        if (value === 'yes' && responses.employeeCount >= 250) {
          setCurrentStep('turnover');
        } else {
          setResults({
            inScope: false,
            reason: value === 'no' ? 
              'Company is not in a high-impact sector and does not meet standard thresholds' :
              'Company does not meet minimum size requirements'
          });
        }
      } else if (key === 'turnover') {
        const isHighImpactSector = responses.sector === 'yes';
        const threshold = isHighImpactSector ? 40 : 150;
        
        if (value >= threshold) {
          setResults({
            inScope: true,
            reason: isHighImpactSector ?
              'Company meets high-impact sector criteria (>250 employees and >€40M turnover)' :
              'Company meets standard criteria (>500 employees and >€150M turnover)'
          });
        } else {
          setResults({
            inScope: false,
            reason: `Company turnover below ${threshold}M threshold`
          });
        }
      }
    };
  
    const renderCurrentStep = () => {
      switch (currentStep) {
        case 'initial':
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Company Location
                </h3>
                <p className="text-gray-600 mb-4">
                  Is your company legally established in the EU?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleResponse('isEU', 'yes')}
                    className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex-1 text-center"
                  >
                    Yes, EU-based
                  </button>
                  <button
                    onClick={() => handleResponse('isEU', 'no')}
                    className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex-1 text-center"
                  >
                    No, non-EU based
                  </button>
                </div>
              </CardContent>
            </Card>
          );
  
        case 'euOperations':
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  EU Market Presence
                </h3>
                <p className="text-gray-600 mb-4">
                  Does your company have significant operations or market presence in the EU?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleResponse('euOperations', 'yes')}
                    className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex-1 text-center"
                  >
                    Yes, significant EU presence
                  </button>
                  <button
                    onClick={() => handleResponse('euOperations', 'no')}
                    className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex-1 text-center"
                  >
                    No significant EU operations
                  </button>
                </div>
              </CardContent>
            </Card>
          );
  
        case 'companySize':
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Company Size Assessment
                </h3>
                <p className="text-gray-600 mb-4">
                  What is your global employee count?
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleResponse('employeeCount', 600)}
                    className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                  >
                    More than 500 employees
                  </button>
                  <button
                    onClick={() => handleResponse('employeeCount', 300)}
                    className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                  >
                    250-500 employees
                  </button>
                  <button
                    onClick={() => handleResponse('employeeCount', 200)}
                    className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                  >
                    Less than 250 employees
                  </button>
                </div>
              </CardContent>
            </Card>
          );
  
        case 'sector':
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Sector Assessment
                </h3>
                <p className="text-gray-600 mb-4">
                  Does your company operate in any of these high-impact sectors?
                </p>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>• Textiles, leather and related products</p>
                  <p>• Agriculture, forestry, fisheries</p>
                  <p>• Food and beverages</p>
                  <p>• Mineral resources extraction</p>
                  <p>• Construction and raw materials</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleResponse('sector', 'yes')}
                    className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex-1 text-center"
                  >
                    Yes, high-impact sector
                  </button>
                  <button
                    onClick={() => handleResponse('sector', 'no')}
                    className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex-1 text-center"
                  >
                    No, other sector
                  </button>
                </div>
              </CardContent>
            </Card>
          );
  
        case 'turnover':
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Euro className="h-5 w-5 text-blue-600" />
                  Financial Assessment
                </h3>
                <p className="text-gray-600 mb-4">
                  What is your company's global net turnover?
                </p>
                <div className="space-y-3">
                  {responses.sector === 'yes' ? (
                    // High-impact sector turnover options
                    <>
                      <button
                        onClick={() => handleResponse('turnover', 50)}
                        className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                      >
                        More than €40M
                      </button>
                      <button
                        onClick={() => handleResponse('turnover', 30)}
                        className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                      >
                        Less than €40M
                      </button>
                    </>
                  ) : (
                    // Standard turnover options
                    <>
                      <button
                        onClick={() => handleResponse('turnover', 200)}
                        className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                      >
                        More than €150M
                      </button>
                      <button
                        onClick={() => handleResponse('turnover', 100)}
                        className="w-full px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left"
                      >
                        Less than €150M
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
  
        default:
          console.warn(`Unexpected step encountered: ${currentStep}`);
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-600">
                  Unexpected State
                </h3>
                <p className="text-gray-600 mb-4">
                  An unexpected error has occurred. Please try refreshing the page or contact support.
                </p>
                <button
                  onClick={() => setCurrentStep('initial')}
                  className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                >
                  Return to Start
                </button>
              </CardContent>
            </Card>
          );
      }
    };
    return (
        <div className="min-h-screen bg-ivory p-6">
          {/* Header */}
          <div className="bg-white/80 rounded-lg shadow p-6 mb-6">
            <div className="flex items-center mb-4">
              <Scale className="text-royal-blue w-6 h-6 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">
                CSDD Applicability Assessment
              </h2>
            </div>
            <p className="text-gray-600">
              Determine your organization's obligations under the EU Corporate Sustainability Due Diligence Directive.
            </p>
    
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-royal-blue text-white flex items-center justify-center">
                  1
                </div>
                <span className="text-royal-blue">Company Details</span>
              </div>
              <div className="h-1 w-16 bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                  2
                </div>
                <span className="text-gray-600">Assessment</span>
              </div>
              <div className="h-1 w-16 bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                  3
                </div>
                <span className="text-gray-600">Results</span>
              </div>
            </div>
          </div>
    
          {/* Main Content */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white/80 rounded-lg shadow">
              {renderCurrentStep()}
            </div>
    
            {/* Preliminary Assessment Panel */}
            {results && (
              <div className="bg-white/80 rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="text-royal-blue w-5 h-5" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Preliminary Assessment Indication
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className={`rounded-lg p-4 ${
                    results.inScope ? 
                    "bg-blue-50/50 border border-blue-100" : 
                    "bg-gray-50/50 border border-gray-100"
                  }`}>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Initial Applicability Analysis
                    </h4>
                    <p className="text-gray-600">
                      Based on the information provided, our preliminary assessment suggests that your organization {" "}
                      {results.inScope ? (
                        <span className="text-blue-700 font-medium">
                          may fall within the scope of the CSDD directive
                        </span>
                      ) : (
                        <span className="text-gray-700 font-medium">
                          may not currently fall within the scope of the CSDD directive
                        </span>
                      )}.
                    </p>
                  </div>
    
                  <div className="rounded-lg p-4 bg-gray-50/50 border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Key Considerations
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {results.reason}
                    </p>
                    <p className="text-sm text-gray-500">
                      Note: This is a preliminary indication based on key threshold criteria. A comprehensive assessment 
                      would consider additional factors including detailed operational analysis and specific member state implementations.
                    </p>
                  </div>
    
                  <div className="rounded-lg p-4 bg-yellow-50/50 border border-yellow-100">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Recommended Next Steps
                    </h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
                        Review detailed assessment findings in the full analysis dashboard
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
                        Consider scheduling a detailed consultation to discuss specific implications
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
                        Monitor relevant member state implementations that may affect your operations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
    
            {/* Action Panel */}
            <div className="bg-white/80 rounded-lg shadow p-6 border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
                              rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Discard Work</span>
                  </button>
                  
                  <button 
                    className="px-4 py-2 bg-royal-blue/10 text-royal-blue hover:bg-royal-blue/20 
                              rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Progress</span>
                  </button>
                </div>
    
                {results && (
                  <button 
                    onClick={() => navigate('/csdd/dashboard')}
                    className="px-6 py-2 bg-royal-blue text-white rounded-lg 
                              hover:bg-royal-blue/90 transition-colors
                              flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>View Full Analysis</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    
        };   
  
  export default EUCSDDLoader;
