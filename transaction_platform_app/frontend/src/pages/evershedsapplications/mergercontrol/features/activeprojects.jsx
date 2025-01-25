import React, { useState } from 'react';
import TableComponent from '../../../../components/shared/TableComponent';

const MergerControlActiveProjects = () => {
  const [data] = useState([
    {
      project_id: 'M2024-001',
      code_name: 'Project Gelato',
      target_name: 'Creamy Delights Ltd.',
      deal_size: '$850M',
      key_jurisdictions: 'US, Germany, France',
      waiting_periods: 'US: 25/30, EU: 15/25',
      filing_status: 'Filed in 2/3 jurisdictions',
      deal_type: 'Full Acquisition',
      target_sector: 'Consumer Goods',
      stage: 'Phase I Review'
    },
    {
      project_id: 'M2024-002',
      code_name: 'Project Evergreen',
      target_name: 'Green Energy Solutions Inc.',
      deal_size: '$2.1B',
      key_jurisdictions: 'US, UK, China',
      waiting_periods: 'US: 12/30, UK: 20/40',
      filing_status: 'All filings submitted',
      deal_type: 'Majority Stake',
      target_sector: 'Renewable Energy',
      stage: 'Clearance Expected'
    },
    {
      project_id: 'M2024-003',
      code_name: 'Project Atlas',
      target_name: 'Global Logistics Co.',
      deal_size: '$1.2B',
      key_jurisdictions: 'US, EU, Brazil',
      waiting_periods: 'US: 5/30, EU: 8/25',
      filing_status: 'Preparing filings',
      deal_type: 'Joint Venture',
      target_sector: 'Transportation',
      stage: 'Pre-Filing'
    },
    {
      project_id: 'M2024-004',
      code_name: 'Project Neptune',
      target_name: 'Blue Ocean Tech',
      deal_size: '$450M',
      key_jurisdictions: 'US, Japan',
      waiting_periods: 'US: 18/30, JP: 12/30',
      filing_status: 'Under review',
      deal_type: 'Full Acquisition',
      target_sector: 'Technology',
      stage: 'Phase I Review'
    },
    {
      project_id: 'M2024-005',
      code_name: 'Project Phoenix',
      target_name: 'Digital Solutions AG',
      deal_size: '$3.5B',
      key_jurisdictions: 'US, EU, UK, China',
      waiting_periods: 'US: 28/30, EU: Phase II',
      filing_status: 'Extended Review',
      deal_type: 'Full Acquisition',
      target_sector: 'Software',
      stage: 'Phase II Review'
    },
    {
      project_id: 'M2024-006',
      code_name: 'Project Horizon',
      target_name: 'Sunrise Healthcare',
      deal_size: '$750M',
      key_jurisdictions: 'US, Canada',
      waiting_periods: 'US: 15/30, CA: 20/30',
      filing_status: 'Filed',
      deal_type: 'Controlling Interest',
      target_sector: 'Healthcare',
      stage: 'Phase I Review'
    },
    {
      project_id: 'M2024-007',
      code_name: 'Project Sierra',
      target_name: 'Mountain Equipment Co.',
      deal_size: '$280M',
      key_jurisdictions: 'US, Canada',
      waiting_periods: 'US: 8/30, CA: 10/30',
      filing_status: 'Under review',
      deal_type: 'Asset Purchase',
      target_sector: 'Retail',
      stage: 'Phase I Review'
    },
    {
      project_id: 'M2024-008',
      code_name: 'Project Quantum',
      target_name: 'Advanced Semiconductors Ltd.',
      deal_size: '$4.2B',
      key_jurisdictions: 'US, EU, China, Korea',
      waiting_periods: 'All pending',
      filing_status: 'Pre-filing consultation',
      deal_type: 'Full Acquisition',
      target_sector: 'Semiconductors',
      stage: 'Pre-Filing'
    },
    {
      project_id: 'M2024-009',
      code_name: 'Project Aurora',
      target_name: 'Nordic Wind AS',
      deal_size: '$1.8B',
      key_jurisdictions: 'EU, UK, Norway',
      waiting_periods: 'EU: 22/25, UK: 15/40',
      filing_status: 'Filed in all jurisdictions',
      deal_type: 'Joint Venture',
      target_sector: 'Energy',
      stage: 'Phase I Review'
    }
  ]);

  const columns = [
    { header: 'Project ID', key: 'project_id' },
    { header: 'Code Name', key: 'code_name' },
    { header: 'Target', key: 'target_name' },
    { header: 'Deal Size', key: 'deal_size' },
    { header: 'Key Jurisdictions', key: 'key_jurisdictions' },
    { header: 'Waiting Periods', key: 'waiting_periods' },
    { header: 'Filing Status', key: 'filing_status', type: 'status' },
    { header: 'Deal Type', key: 'deal_type' },
    { header: 'Sector', key: 'target_sector' },
    { header: 'Stage', key: 'stage', type: 'status' },
    { header: 'Actions', key: 'actions', type: 'action' }
  ];

  const handleActionClick = (row) => {
    console.log('Action clicked for:', row);
    // Handle view/edit action
  };

  return (
    <TableComponent
      title="Active M&A Transactions"
      data={data}
      columns={columns}
      importEnabled={true}
      projectImportEnabled={true}
      onActionClick={handleActionClick}
      importButtonText="Import Transaction Data"
      setData={() => {}}
      apiEndpoint="/mergertransactions"
    />
  );
};

export default MergerControlActiveProjects;
