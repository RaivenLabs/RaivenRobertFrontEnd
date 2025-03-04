// src/pages/menusections/speakeasy/applications/speakeasyclub/features/Events.jsx
import React from 'react';

const Events = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Club Events</h1>
      <p className="text-gray-600 mb-4">Schedule and manage Speakeasy Club events.</p>
      
      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Event Calendar</h2>
        <p>Calendar view coming soon...</p>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
        <p>Events list coming soon...</p>
      </div>
    </div>
  );
};

export default Events;
