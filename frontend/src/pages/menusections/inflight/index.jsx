// src/pages/menusections/inflight/index.jsx
import React from 'react';
import './styles/inflight.css';  // Reusing the nice styling we already have

const InflightContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>Flight Ops</h1>
        <p>Active Projects and Agreements</p>
        <p>Monitor and manage your active transactions, from agreements to implementations.</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Key Features</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Active Agreements</h3>
          <ul className="guide-outcome-list">
            <li>Monitor Active MSAs</li>
            <li>Track License Agreements</li>
            <li>View SaaS Subscriptions</li>
            <li>Follow Project Milestones</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Real-time Updates</h3>
          <ul className="guide-outcome-list">
            <li>Status Tracking</li>
            <li>Timeline Management</li>
            <li>Milestone Alerts</li>
            <li>Team Notifications</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Document Control</h3>
          <ul className="guide-outcome-list">
            <li>Version Management</li>
            <li>Change Tracking</li>
            <li>Approval Workflows</li>
            <li>Audit History</li>
          </ul>
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <p>Managing active transactions and projects across your organization.</p>
    </footer>
  </div>
);

const Inflight = () => {
  return <InflightContent />;
};

export default Inflight;
