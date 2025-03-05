import React from 'react';
import { Database, FileText } from 'lucide-react';
import StatusCard from '../shared/StatusCard'; // Adjust this path to wherever your StatusCard component is located

// StatusSection.jsx
const SchemaStatusSection = ({ proposedSchema, uploadedFiles }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <StatusCard 
      title="Schema Generation Status"
      status={proposedSchema ? "active" : "pending"}
      description={proposedSchema 
        ? "Schema generated and ready for refinement" 
        : "Waiting for document analysis"}
      icon={Database}
    />
    <StatusCard 
      title="Document Analysis"
      status={uploadedFiles?.length > 0 ? "active" : "pending"}
      description={`${uploadedFiles?.length || 0} document(s) ready for processing`}
      icon={FileText}
    />
  </div>
);

export default SchemaStatusSection;
