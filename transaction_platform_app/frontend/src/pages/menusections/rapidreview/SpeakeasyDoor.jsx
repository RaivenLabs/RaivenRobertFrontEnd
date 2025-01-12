// src/pages/menusections/speakeasy/index.jsx
import React from 'react';

import '../../../styles/shared/guidepages.css';

const SpeakeasyContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>The Tangible Speakeasy</h1>
        <p>Your Gateway to Life Beyond the Desk</p>
        <p>Discover apps that make life more enjoyable, both in and out of the office.</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">What We Offer</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Life & Leisure</h3>
          <ul className="guide-outcome-list">
            <li>Olympic Training Guides</li>
            <li>Global Food Adventures</li>
            <li>Personal Development</li>
            <li>Travel Companions</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Culture and Arts</h3>
          <ul className="guide-outcome-list">
            <li>Museum Exhibits</li>
            <li>Top London Theater</li>
            <li>Best Bingeworthy Television</li>
            <li>Best Classic Movies</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Tech & Tools</h3>
          <ul className="guide-outcome-list">
            <li>Personal RAG Builder</li>
            <li>LLM Wingman</li>
            <li>Cloud Storage Solutions</li>
            <li>Learning Resources</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-lifecycle-section">
      <div className="guide-container">
        <h2>Featured Applications</h2>
        <div className="guide-lifecycle-grid">
          {[
            {
              title: "Florence Food Guide",
              desc: "Curated list of the best gelaterias and restaurants in Florence."
            },
            {
              title: "10K Trainer",
              desc: "Personalized training program for your next 10K race."
            },
            {
              title: "Seminary Reading Guide",
              desc: "Structured approach to theological studies."
            },
            {
              title: "Dev Learning Path",
              desc: "Software engineering mastery in 10 steps."
            },
            {
              title: "London Dining",
              desc: "Inside track to London's best restaurants."
            },
            {
              title: "Personal RAG",
              desc: "Build your own AI-powered knowledge base."
            }
          ].map((app, index) => (
            <div key={index} className="guide-lifecycle-card">
              <h3>{app.title}</h3>
              <p>{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <p>© 2024 Tangible Intelligence, ai. Making work and life more enjoyable.</p>
      <button
        onClick={() => {
          sessionStorage.removeItem('speakeasyAccess');
          window.location.reload();
        }}
        className="text-sm underline hover:text-blue-200 transition-colors mt-2"
      >
        Return to Main Menu
      </button>
    </footer>
  </div>
);



export default SpeakeasyContent;
