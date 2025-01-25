// src/features/transaction-loader/components/Worksheet/JurisdictionRow.jsx
import React from 'react';
import { calculateSizeOfPerson } from '../../../../../../../utils/mergerControlAlgorithms';


const JurisdictionRow = ({
  data,
  region,
  onInputChange,
  getValue,
  calculateSizeOfPerson
}) => {
  // Helper to format currency values
  const formatCurrency = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Helper to format percentage values
  const formatPercentage = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : `${num.toFixed(2)}%`;
  };

  // Helper to render input field with consistent styling
  const InputField = ({ field, label, format = value => value, ...props }) => (
    <div className="flex flex-col">
      {label && <label className="text-xs text-gray-500 mb-1">{label}</label>}
      <input 
        type="text"
        value={format(getValue(region, data.name, field))}
        onChange={(e) => onInputChange(region, data.name, field, e.target.value)}
        className="border-b border-gray-300 focus:border-royalBlue focus:ring-0 bg-transparent w-full"
        placeholder={data.isTotal ? "Calculated total" : "Enter value"}
        readOnly={data.isTotal}
        {...props}
      />
    </div>
  );

  return (
    <div className="bg-white">
      <table className="min-w-full">
        <tbody>
          <tr className={data.isTotal ? 'bg-gray-50 font-semibold' : ''}>
            {/* Jurisdiction name column */}
            <td className="pl-6 pr-4 py-4 whitespace-normal text-sm w-48">
              <div className={`flex flex-col ${data.isState ? 'ml-4' : ''}`}>
                <span className="font-medium">{data.name}</span>
                {data.name === "United States (Total)" && (
                  <span className="text-xs text-gray-500">HSR Analysis</span>
                )}
              </div>
            </td>

            {/* Common fields for all regions */}
            <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
              <InputField field="revenue" format={formatCurrency} />
            </td>

            <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
              <InputField field="assets" format={formatCurrency} />
            </td>

            {/* Region-specific fields */}
            {region === 'us' ? (
              <>
                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField field="transactionSize" format={formatCurrency} />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <div className="text-left">
                    <select
                      value={getValue(region, data.name, 'isManufacturer') || ''}
                      onChange={(e) => onInputChange(region, data.name, 'isManufacturer', e.target.value === 'true')}
                      className="border-b border-gray-300 focus:border-royalBlue focus:ring-0 bg-transparent w-full"
                      disabled={data.isTotal}
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <div className="flex flex-col space-y-4">
                    <InputField 
                      field="sizeOfPerson.annual_net_sales" 
                      label="Annual Net Sales"
                      format={formatCurrency}
                    />
                    <InputField 
                      field="sizeOfPerson.total_assets" 
                      label="Total Assets"
                      format={formatCurrency}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Test Met:</span>
                      <span className={`text-sm font-medium ${
                        calculateSizeOfPerson(region, data.name) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {calculateSizeOfPerson(region, data.name) ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </td>
              </>
            ) : (
              <>
                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField field="employees" />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField field="marketShare" format={formatPercentage} />
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default JurisdictionRow;
