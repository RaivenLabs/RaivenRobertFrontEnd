// src/pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Inflight.jsx
import React from 'react';
import '../../../../../styles/speakeasy.css';

const FlorenceGelatoInflight = () => {
  return (
    <div className="guide-wrapper">
      <header className="guide-header">
        <div className="guide-container">
          <h1>Florence Gelato Journey</h1>
          <p>Track your gelato discoveries across Florence</p>
        </div>
      </header>

      <section className="guide-principle-section">
        <h2 className="guide-principle-title">Current Explorations</h2>
        <div className="guide-principle-container">
          <div className="guide-principle-box">
            <h3>Today's Recommendations</h3>
            <ul className="guide-outcome-list">
              <li>Gelateria della Passera (5 min walk)</li>
              <li>Il Procopio (Near Ponte Vecchio)</li>
              <li>La Carraia (Perfect for sunset)</li>
            </ul>
          </div>

          <div className="guide-principle-box">
            <h3>Your Tasting Notes</h3>
            <ul className="guide-outcome-list">
              <li>Dark Chocolate ⭐⭐⭐⭐⭐</li>
              <li>Pistachio ⭐⭐⭐⭐</li>
              <li>Stracciatella ⭐⭐⭐⭐½</li>
            </ul>
          </div>

          <div className="guide-principle-box">
            <h3>Next Up</h3>
            <ul className="guide-outcome-list">
              <li>Vivoli (Historic Center)</li>
              <li>La Sorbettiera (Local Favorite)</li>
              <li>Gelateria dei Neri (Artisanal)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="guide-lifecycle-section">
        <div className="guide-container">
          <h2>Journey Progress</h2>
          <div className="guide-lifecycle-grid">
            {[
              {
                title: "Shops Visited",
                desc: "3 of 12 recommended locations"
              },
              {
                title: "Flavors Tried",
                desc: "7 unique flavors sampled"
              },
              {
                title: "Neighborhood Coverage",
                desc: "2 of 4 districts explored"
              },
              {
                title: "Time of Day",
                desc: "Best evening spots coming up"
              }
            ].map((stat, index) => (
              <div key={index} className="guide-lifecycle-card">
                <h3>{stat.title}</h3>
                <p>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="guide-principle-section">
        <h2 className="guide-principle-title">Today's Weather Impact</h2>
        <p className="text-lg text-center mb-4">
          Perfect gelato weather! 75°F and sunny - ideal for a walking tour.
        </p>
      </section>

      <footer className="guide-footer">
        <p>Tracking your gelato journey across Florence's finest establishments.</p>
      </footer>
    </div>
  );
};

export default FlorenceGelatoInflight;
