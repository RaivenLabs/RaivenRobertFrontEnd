// src/pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard.jsx
import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const HouseApplicationsDock = () => {
  return (
    <ApplicationPanel apiEndpoint="/api/programs/houseapps" />
  );
};

export default HouseApplicationsDock;
