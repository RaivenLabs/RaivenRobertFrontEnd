import React from 'react';
import './landed.css';

const Landed = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <h1 className="text-4xl font-semibold mb-4">Landed Projects</h1>
          <p className="text-xl max-w-3xl mx-auto mb-2">Post-Close Lifecycle Management</p>
          <p className="text-lg max-w-3xl mx-auto">
            Managing the vigorous post-closing life of your enterprise agreements
          </p>
        </header>

        {/* Dynamic Management Section */}
        <section className="bg-white py-16 px-4 rounded-lg mb-8">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            Post-Close Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto px-4">
            <div className="bg-lightGray p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">Active Management</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-lg">
                  <span className="text-teal mr-3 text-xl">✓</span>
                  Compliance Updates
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-teal mr-3 text-xl">✓</span>
                  Policy Changes
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-teal mr-3 text-xl">✓</span>
                  New Orders
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <div className="text-6xl text-teal mb-4">↔</div>
                <span className="text-teal font-semibold text-lg">Dynamic Lifecycle</span>
              </div>
            </div>

            <div className="bg-lightGray p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">Intelligent Tracking</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-lg">
                  <span className="text-teal mr-3 text-xl">✓</span>
                  Visual Family Trees
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-teal mr-3 text-xl">✓</span>
                  Event Timelines
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-teal mr-3 text-xl">✓</span>
                  Smart Alerts
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="bg-white py-16 px-4 rounded-lg mb-8">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            Post-Close Management Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Agreement Family Tree",
                desc: "Visual hierarchy of master agreements, orders, and amendments with expandable/collapsible nodes."
              },
              {
                title: "Compliance Dashboard",
                desc: "Real-time monitoring of regulatory requirements, policy updates, and compliance deadlines."
              },
              {
                title: "Event Logger",
                desc: "Chronological tracking of all agreement-related events, changes, and updates."
              },
              {
                title: "Policy Manager",
                desc: "Track and implement enterprise-wide policy changes across agreement portfolios."
              },
              {
                title: "Order Tracker",
                desc: "Monitor new orders, change requests, and amendments under master agreements."
              },
              {
                title: "Alert System",
                desc: "Proactive notifications for upcoming deadlines, required actions, and policy updates."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-lightGray p-6 rounded-lg shadow-md hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className="text-xl font-semibold text-royalBlue mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visualization Section */}
        <section className="bg-white py-16 px-4 rounded-lg mb-8">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            Visual Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-lightGray p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">Agreement Family Tree</h3>
              <ul className="space-y-4">
                <li>• Hierarchical visualization</li>
                <li>• Expandable/collapsible nodes</li>
                <li>• Relationship mapping</li>
                <li>• Document linkages</li>
                <li>• Version control</li>
              </ul>
            </div>
            <div className="bg-lightGray p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">Event Timeline</h3>
              <ul className="space-y-4">
                <li>• Chronological event tracking</li>
                <li>• Status updates</li>
                <li>• Change history</li>
                <li>• Action items</li>
                <li>• Milestone tracking</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
             Built for serious business with a smile. Radical generosity is our motto!</p>
        </footer>
      </div>
    </div>
  );
};

export default Landed;
