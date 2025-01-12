// src/pages/menusections/flightdeck/index.jsx
import React from 'react';


const FlightDeckContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>Mission Control</h1>
        <p>Program Management & Control Center</p>
        <p>Monitor, direct and manage your entire platform program from inception to completion.</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title"></h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Program Overview</h3>
          <ul className="guide-outcome-list">
            <li>Program Health Metrics</li>
            <li>Resource Allocation</li>
            <li>Risk Management</li>
            <li>Strategic Planning</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Executive Dashboard</h3>
          <ul className="guide-outcome-list">
            <li>KPI Tracking</li>
            <li>Progress Reports</li>
            <li>Cost Management</li>
            <li>Timeline Oversight</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Platform Control</h3>
          <ul className="guide-outcome-list">
            <li>System Configuration</li>
            <li>User Management</li>
            <li>Integration Control</li>
            <li>Security Oversight</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Program Intelligence</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Analytics Hub</h3>
          <ul className="guide-outcome-list">
            <li>Performance Analytics</li>
            <li>Trend Analysis</li>
            <li>Predictive Insights</li>
            <li>Custom Reporting</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Resource Center</h3>
          <ul className="guide-outcome-list">
            <li>Documentation Library</li>
            <li>Training Materials</li>
            <li>Best Practices</li>
            <li>Support Resources</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Governance</h3>
          <ul className="guide-outcome-list">
            <li>Compliance Monitoring</li>
            <li>Audit Trails</li>
            <li>Policy Management</li>
            <li>Access Control</li>
          </ul>
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <p>Comprehensive program management for your enterprise platform implementation.</p>
    </footer>
  </div>
);

const FlightDeck = () => {
  return <FlightDeckContent />;
};

export default FlightDeck;
