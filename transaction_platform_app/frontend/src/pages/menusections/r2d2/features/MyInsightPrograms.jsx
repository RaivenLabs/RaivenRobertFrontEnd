import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const MyInsightApplications = () => {
  return (
    <ApplicationPanel apiEndpoint="/api/programs/r2d2" />
  );
};

export default MyInsightApplications;
