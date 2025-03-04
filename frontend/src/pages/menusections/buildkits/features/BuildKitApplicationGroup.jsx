import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const BuildKitApplications = () => {
  return (
    <ApplicationPanel apiEndpoint="/programs/buildkits" />
  );
};

export default BuildKitApplications;
