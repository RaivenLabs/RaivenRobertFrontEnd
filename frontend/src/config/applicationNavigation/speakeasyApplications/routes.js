// src/config/applicationNavigation/speakeasyApplications/routes.js
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load each feature component
const Dashboard = lazy(() => {
  console.log('🔄 Loading Dashboard component');
  return import('../../../pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard');
});

const Members = lazy(() => {
  console.log('🔄 Loading Members component');
  return import('../../../pages/menusections/speakeasy/applications/speakeasyclub/features/Members');
});

const Events = lazy(() => {
  console.log('🔄 Loading Events component');
  return import('../../../pages/menusections/speakeasy/applications/speakeasyclub/features/Events');
});

const Settings = lazy(() => {
  console.log('🔄 Loading Settings component');
  return import('../../../pages/menusections/speakeasy/applications/speakeasyclub/features/Settings');
});

// Loading component to show while feature is loading
const LoadingFeature = () => (
  <div className="p-4">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const SpeakeasyClubRoutes = () => {
  console.log('🎯 Setting up Speakeasy Club routes');
  
  return (
    <Suspense fallback={<LoadingFeature />}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="events" element={<Events />} />
        <Route path="settings" element={<Settings />} />
        {/* Default route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
};

export default SpeakeasyClubRoutes;
