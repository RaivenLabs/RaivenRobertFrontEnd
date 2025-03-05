import React from 'react';

const FundComponentContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>Fund Client Application</h1>
        <p>Streamline Your Fund Client Support Capabilities with Intelligent Regulatory Oversight</p>
        <p>Monitor, track, and manage fund regulatory compliance with ease and precision.</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Enhanced Practice Management</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Real-Time Monitoring</h3>
          <ul className="guide-outcome-list">
            <li>Instant FCA Status Updates</li>
            <li>Automated Compliance Checks</li>
            <li>Proactive Alert System</li>
            <li>Change Detection</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Efficient Workflow</h3>
          <ul className="guide-outcome-list">
            <li>Batch Query Processing</li>
            <li>Custom Search Templates</li>
            <li>Automated Reporting</li>
            <li>Document Generation</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Risk Management</h3>
          <ul className="guide-outcome-list">
            <li>Compliance Timeline</li>
            <li>Status Tracking</li>
            <li>Regulatory Alerts</li>
            <li>Audit Trail</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-lifecycle-section">
      <div className="guide-container">
        <h2>Key Features</h2>
        <div className="guide-lifecycle-grid">
          {[
            {
              title: "Fund Family Management",
              desc: "Organize and monitor multiple funds with intuitive grouping and hierarchical views."
            },
            {
              title: "Regulatory Updates",
              desc: "Stay current with automated monitoring of regulatory status and requirements."
            },
            {
              title: "Smart Alerts",
              desc: "Receive timely notifications about compliance deadlines and regulatory changes."
            },
            {
              title: "Fund Finder",
              desc: "Create and save custom searches for frequent regulatory inquiries."
            },
            {
              title: "Compliance Dashboard",
              desc: "View your entire fund portfolio's compliance status at a glance."
            },
            {
              title: "Historical Archive",
              desc: "Access comprehensive historical records of regulatory filings and changes."
            }
          ].map((feature, index) => (
            <div key={index} className="guide-lifecycle-card">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <p>Transform your regulatory compliance workflow with intelligent automation.</p>
      <p className="text-sm mt-2">
        Developed in partnership with Eversheds Sutherland to meet the specific needs of fund practice groups.
      </p>
    </footer>
  </div>
);

const FundComponent = () => {
  return <FundComponentContent />;
};

export default FundComponent;
