// src/pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard.jsx
import React from 'react';
import ApplicationPanel from '../../../components/shared/ApplicationPanel';

const Exchange = () => {
  return (
    <ApplicationPanel apiEndpoint="/api/programs/exchange" />
  );
};

export default Exchange;
