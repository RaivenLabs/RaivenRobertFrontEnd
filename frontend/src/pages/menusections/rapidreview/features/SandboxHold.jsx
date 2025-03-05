import React from 'react';

const DesignCenterContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>Application Design</h1>
        <p>Transform Business Needs into Custom Solutions</p>
        <p>Combine domain expertise with our CoIntelligence technology platform</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Discovery Path</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Business Analysis</h3>
          <ul className="guide-outcome-list">
            <li>Challenge Definition</li>
            <li>Success Criteria</li>
            <li>Domain Requirements</li>
            <li>Integration Mapping</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Technical Design</h3>
          <ul className="guide-outcome-list">
            <li>Architecture Planning</li>
            <li>Security Framework</li>
            <li>Compliance Review</li>
            <li>Technology Stack</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Implementation</h3>
          <ul className="guide-outcome-list">
            <li>Rapid Prototyping</li>
            <li>Iterative Testing</li>
            <li>User Validation</li>
            <li>Production Deploy</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Application Areas</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Intelligence Solutions</h3>
          <ul className="guide-outcome-list">
            <li>Document Intelligence</li>
            <li>Data Extraction</li>
            <li>Analytics Dashboard</li>
            <li>Business Intelligence</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Process Solutions</h3>
          <ul className="guide-outcome-list">
            <li>Workflow Automation</li>
            <li>Integration Services</li>
            <li>API Development</li>
            <li>Custom Applications</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Platform Solutions</h3>
          <ul className="guide-outcome-list">
            <li>Digital Transformation</li>
            <li>Platform Extensions</li>
            <li>Security Controls</li>
            <li>Compliance Tools</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Guided Assessment</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Business Context</h3>
          <ul className="guide-outcome-list">
            <li>Challenge Identification</li>
            <li>Success Metrics</li>
            <li>Process Scope</li>
            <li>User Requirements</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Technical Review</h3>
          <ul className="guide-outcome-list">
            <li>Data Types & Sources</li>
            <li>System Integration</li>
            <li>Automation Level</li>
            <li>Security Needs</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Solution Design</h3>
          <ul className="guide-outcome-list">
            <li>Architecture Planning</li>
            <li>Technology Selection</li>
            <li>Implementation Path</li>
            <li>Success Criteria</li>
          </ul>
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <div className="call-to-action">
        <h2>Your Ideas Brought to Life</h2>
        <p>Have a unique challenge? Let's combine your domain expertise with our CoIntelligence platform to create something extraordinary.</p>
        <button className="action-button">Start Your Journey</button>
      </div>
    </footer>
  </div>
);

const RapidPrototyping = () => {
  return <DesignCenterContent />;
};

export default RapidPrototyping;
