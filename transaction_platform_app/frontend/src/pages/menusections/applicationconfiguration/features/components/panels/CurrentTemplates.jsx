import React from 'react';
import { 
  FileText, 
  Upload, 
  Building2, 
  Users, 
  Briefcase,
  Plus,
  ArrowRight
} from 'lucide-react';

const CurrentTemplates = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-medium mb-6 text-teal">Current Templates</h3>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Base Templates */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-teal" />
            <h4 className="font-medium">Base Templates</h4>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Generic templates ready for customer configuration
            </p>
            <ul className="space-y-2">
              <li className="p-2 bg-white rounded border border-gray-200 text-sm">
                Engineering Services Agreement
              </li>
              <li className="p-2 bg-white rounded border border-gray-200 text-sm">
                Software License Agreement
              </li>
            </ul>
          </div>

          <button className="flex items-center gap-2 text-teal hover:text-teal/80 text-sm">
            <Plus className="w-4 h-4" />
            Add Base Template
          </button>
        </div>

        {/* Customer-Specific */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-teal" />
            <h4 className="font-medium">Customer-Specific</h4>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Templates configured for specific customers
            </p>
            <ul className="space-y-2">
              <li className="p-2 bg-white rounded border border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span>Acme - Engineering Services</span>
                  <button className="text-blue-500 hover:text-blue-600">
                    Configure
                  </button>
                </div>
              </li>
              <li className="p-2 bg-white rounded border border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span>GlobalTech - Software License</span>
                  <button className="text-blue-500 hover:text-blue-600">
                    Configure
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <button className="flex items-center gap-2 text-teal hover:text-teal/80 text-sm">
            <Plus className="w-4 h-4" />
            Create Customer Template
          </button>
        </div>

        {/* Customer-Provider Specific */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-teal" />
            <h4 className="font-medium">Customer-Provider Specific</h4>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Templates configured for specific customer-provider pairs
            </p>
            <ul className="space-y-2">
              <li className="p-2 bg-white rounded border border-gray-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Acme - TechServices Inc</span>
                    <button className="text-blue-500 hover:text-blue-600">
                      Update
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Upload className="w-3 h-3" />
                    <span>Rate card uploaded</span>
                  </div>
                </div>
              </li>
              <li className="p-2 bg-white rounded border border-gray-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>GlobalTech - SoftVendor</span>
                    <button className="text-blue-500 hover:text-blue-600">
                      Upload Rate Card
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-500">
                    <Upload className="w-3 h-3" />
                    <span>Rate card needed</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <button className="flex items-center gap-2 text-teal hover:text-teal/80 text-sm">
            <Plus className="w-4 h-4" />
            Add Provider Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentTemplates;
