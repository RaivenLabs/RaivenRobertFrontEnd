import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const MyBuildKits = () => {
  return (
    <ApplicationPanel apiEndpoint="/api/programs/buildkits" />
  );
};

export default MyBuildKits;
