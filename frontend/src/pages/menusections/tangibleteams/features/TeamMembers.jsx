import React from 'react';
import ApplicationPanel from '../../../../components/shared/ApplicationPanel';

const TeamMembers = () => {
  return (
    <ApplicationPanel apiEndpoint="/programs/tangibleteams" />
  );
};

export default TeamMembers;
