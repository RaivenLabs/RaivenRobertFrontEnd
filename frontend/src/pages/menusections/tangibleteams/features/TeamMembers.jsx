import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const TeamMembers = () => {
  return (
    <ApplicationPanel apiEndpoint="/api/programs/tangibleteams" />
  );
};

export default TeamMembers;
