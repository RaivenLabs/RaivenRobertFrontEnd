import React from 'react';
import './styles/sandbox.css';

const SandboxContent= () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>The Tangible Sandbox</h1>
        <p>FastLane Apps and Rapid Prototyping</p>
        <p>Design, test, and deploy rapid prototypes of your best ideas.</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">Key Features</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Process Design</h3>
          <ul className="guide-outcome-list">
            <li>Template-Based Process Definition</li>
            <li>Visual BPMN Diagrams</li>
            <li>Decision Point Mapping</li>
            <li>Workflow Validation</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Workflow Engine</h3>
          <ul className="guide-outcome-list">
            <li>Full Platform Integration</li>
            <li>Automated Execution</li>
            <li>Real-Time Monitoring</li>
            <li>Error Handling & Recovery</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>FastLane Apps</h3>
          <ul className="guide-outcome-list">
            <li>Rapid Prototyping</li>
            <li>White-Labeled Interface</li>
            <li>System Integration</li>
            <li>Scalable Solutions</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">How It Works</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Step 1: Design</h3>
          <ul className="guide-outcome-list">
            <li>Define process steps in template form</li>
            <li>Identify decision points and paths</li>
            <li>Map data requirements</li>
            <li>Review with stakeholders</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Step 2: Model</h3>
          <ul className="guide-outcome-list">
            <li>Convert to BPMN notation</li>
            <li>Visualize process flow</li>
            <li>Add technical details</li>
            <li>Validate logic</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Step 3: Deploy</h3>
          <ul className="guide-outcome-list">
            <li>Deploy</li>
            <li>Configure interfaces</li>
            <li>Test execution</li>
            <li>Monitor performance</li>
          </ul>
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <p>Transform business processes into automated workflows with enterprise-grade reliability.</p>
    </footer>
  </div>
);

const Sandbox = () => {
  return <SandboxContent />;
};

export default Sandbox;
