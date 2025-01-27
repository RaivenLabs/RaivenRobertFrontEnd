// src/features/transaction-loader/components/Worksheet/MemberStateRow.jsx
import React from 'react';
import { regionalBlockConfigs } from '../../utils/regionalBlockConfigs';

const MemberStateRow = ({
  data,
  blockKey,
  onInputChange,
  getValue
}) => {
  const blockConfig = regionalBlockConfigs[blockKey];

  // Formatting helpers
  const formatCurrency = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    // Get currency from block config
    const currency = blockConfig.currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatPercentage = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : `${num.toFixed(2)}%`;
  };

  const InputField = ({ field, label, format = value => value, disabled = false }) => {
    const [localValue, setLocalValue] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);

    const handleFocus = () => {
      setIsEditing(true);
      const rawValue = getValue(blockKey, data.dataKey, field) || '';
      console.log('🎯 Starting edit:', {
        block: blockKey,
        memberState: data.name,
        field,
        currentValue: rawValue
      });
      setLocalValue(rawValue);
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      console.log('✍️ User typing:', {
        block: blockKey,
        memberState: data.name,
        field,
        newValue,
        oldValue: localValue
      });
      setLocalValue(newValue);
    };

    const handleBlur = () => {
      setIsEditing(false);
      // Special logging for important fields
      if (blockKey === 'united_kingdom' && field === 'revenue') {
        console.log('🇬🇧 UK Revenue Change:', {
          from: getValue(blockKey, data.dataKey, field),
          to: localValue,
          cleaned: localValue.toString().replace(/[^0-9.-]/g, '')
        });
      }
      
      if (localValue) {
        const cleanValue = localValue.toString().replace(/[^0-9.-]/g, '');
        onInputChange(blockKey, data.dataKey, field, cleanValue);
      }
    };

    return (
      <div className="flex flex-col">
        {label && <label className="text-xs text-gray-500 mb-1">{label}</label>}
        <input
          type="text"
          value={isEditing ? localValue : format(getValue(blockKey, data.dataKey, field))}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="border-b border-gray-300 focus:border-royalBlue focus:ring-0 
                    bg-transparent w-full"
          placeholder="Enter value"
          disabled={disabled}
        />
      </div>
    );
  };

  return (
    <div className="bg-white">
      <table className="min-w-full">
        <tbody>
          <tr className={data.isTotal ? 'bg-gray-50 font-semibold' : ''}>
            {/* Member State name column */}
            <td className="pl-6 pr-4 py-4 whitespace-normal text-sm w-48">
              <div className={`flex flex-col ${data.isMemberState ? 'ml-4' : ''}`}>
                <span className="font-medium">{data.name}</span>
                {data.name === "United States (Total)" && (
                  <span className="text-xs text-gray-500">HSR Analysis</span>
                )}
              </div>
            </td>

            {/* Block-specific fields */}
            {blockKey === 'united_states' ? (
              <>
                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="revenue" 
                    format={formatCurrency}
                    disabled={data.isTotal} 
                  />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="assets" 
                    format={formatCurrency}
                    disabled={data.isTotal} 
                  />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="transactionSize" 
                    format={formatCurrency}
                    disabled={data.isTotal} 
                  />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <div className="text-left">
                    <select
                      value={getValue(blockKey, data.dataKey, 'isManufacturer') || ''}
                      onChange={(e) => onInputChange(blockKey, data.dataKey, 'isManufacturer', e.target.value === 'true')}
                      className="border-b border-gray-300 focus:border-royalBlue focus:ring-0 bg-transparent w-full"
                      disabled={data.isTotal}
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </td>

                {getValue(blockKey, data.dataKey, 'sizeOfPersonApplies') ? (
                  <>
                    <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                      <InputField 
                        field="annualNetSales" 
                        label="Annual Net Sales"
                        format={formatCurrency}
                        disabled={data.isTotal}
                      />
                    </td>
                    <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                      <InputField 
                        field="totalAssets" 
                        label="Total Assets"
                        format={formatCurrency}
                        disabled={data.isTotal}
                      />
                    </td>
                  </>
                ) : (
                  <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48 text-gray-500" colSpan="2">
                    Not Required for this Transaction Size
                  </td>
                )}
              </>
            ) : (
              <>
                {/* EU/UK fields */}
                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="revenue" 
                    format={formatCurrency}
                  />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="marketShare" 
                    format={formatPercentage}
                  />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="assets" 
                    format={formatCurrency}
                  />
                </td>

                <td className="pl-6 pr-4 py-4 whitespace-nowrap w-48">
                  <InputField 
                    field="employees" 
                  />
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MemberStateRow;
