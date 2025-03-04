// src/pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard.jsx
import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const MyHouseApplications = () => {
  return (
    <ApplicationPanel apiEndpoint="//programs/houseapps" />
  );
};

export default MyHouseApplications;
