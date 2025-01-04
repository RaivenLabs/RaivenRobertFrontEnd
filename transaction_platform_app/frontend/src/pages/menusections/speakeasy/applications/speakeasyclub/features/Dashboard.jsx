// src/pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard.jsx
import React from 'react';
import ApplicationPanel from '../../../../../../components/shared/ApplicationPanel';

const Dashboard = () => {
  return (
    <ApplicationPanel apiEndpoint="/api/programs/speakeasy" />
  );
};

export default Dashboard;
