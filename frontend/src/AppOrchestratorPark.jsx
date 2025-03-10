import React, { Suspense, lazy } from 'react';

// Ultra-simplified orchestrator that just loads Hogwarts from a hardcoded path
const MasterAppOrchestrator = () => {
  // Hardcoded path to Hogwarts index.js
  const indexPath = "applications/hogwarts";
  
  // Dynamically import using the hardcoded path
  const AppComponent = lazy(() => 
    import(`./pages/${indexPath}`)
      .catch(err => {
        console.error(`Failed to load app from path: ${indexPath}`, err);
        return { default: () => <div>Failed to load application. Check console for details.</div> };
      })
  );
  
  return (
    <Suspense fallback={<div>Loading Hogwarts application...</div>}>
      <AppComponent />
    </Suspense>
  );
};

export default MasterAppOrchestrator;
