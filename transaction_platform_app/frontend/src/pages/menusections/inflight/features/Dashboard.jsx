// src/pages/menusections/inflight/features/Dashboard.jsx
import React, { useState } from 'react';
import TableComponent from '../../../../components/shared/TableComponent';

const Dashboard = () => {  // Changed name to match the file
  const [data, setData] = useState([]);

  const columns = [
    { header: 'Agreement ID', key: 'agreement_id' },
    { header: 'Title', key: 'title' },
    { header: 'Counterparty', key: 'counterparty' },
    { header: 'Category', key: 'taxonomy_category' },
    { header: 'Role', key: 'family_role' },
    { header: 'Effective Date', key: 'effective_date' },
    { header: 'End Date', key: 'end_date' },
    { header: 'Region', key: 'region' },
    { header: 'Status', key: 'status', type: 'status' },
    { header: 'CLM Reference', key: 'clm_reference' },
    { header: 'Actions', key: 'actions', type: 'action' }
  ];

  const handleActionClick = (row) => {
    console.log('Action clicked for:', row);
    // Handle view action
  };

  return (
    <TableComponent
      title="Active Projects & Agreements"
      data={data}
      columns={columns}
      importEnabled={true}
      projectImportEnabled={true}
      onActionClick={handleActionClick}
      importButtonText="Import Sample Agreement Data"
      setData={setData}
      apiEndpoint="/sampleagreementdata"  // Add this (removed /api/ prefix)
    />
  );
};

export default Dashboard;  // Export matches the file name
