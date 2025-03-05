
import React from 'react';


const NIKERaivenContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>NIKE Raiven Application</h1>
        <p>Your Artisanal Gelato Adventure in Florence</p>
        <p>Discover the city's finest gelaterias, from historic establishments to innovative artisans.</p>
      </div>
    </header>

    <section className="guide-principle-section">
      <h2 className="guide-principle-title">What Makes Great Gelato</h2>
      <div className="guide-principle-container">
        <div className="guide-principle-box">
          <h3>Artisanal Quality</h3>
          <ul className="guide-outcome-list">
            <li>Natural Ingredients</li>
            <li>Made Fresh Daily</li>
            <li>Small-Batch Production</li>
            <li>Seasonal Flavors</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Neighborhood Gems</h3>
          <ul className="guide-outcome-list">
            <li>Historic Center</li>
            <li>Oltrarno District</li>
            <li>Santo Spirito Area</li>
            <li>San Niccolò Finds</li>
          </ul>
        </div>
        <div className="guide-principle-box">
          <h3>Local Favorites</h3>
          <ul className="guide-outcome-list">
            <li>Traditional Flavors</li>
            <li>Modern Innovations</li>
            <li>Secret Recipes</li>
            <li>Family Traditions</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-lifecycle-section">
      <div className="guide-container">
        <h2>Featured Gelaterias</h2>
        <div className="guide-lifecycle-grid">
          {[
            {
              title: "Gelateria della Passera",
              desc: "Hidden gem featuring unique flavor combinations in Santo Spirito."
            },
            {
              title: "Vivoli",
              desc: "Florence's oldest gelateria, serving classic flavors since 1929."
            },
            {
              title: "La Carraia",
              desc: "Famous for creamy textures and innovative recipes near Ponte alla Carraia."
            },
            {
              title: "Gelateria dei Neri",
              desc: "Local favorite known for rich chocolate and nut flavors."
            },
            {
              title: "Il Procopio",
              desc: "Award-winning gelato with Sicilian influences in Sant'Ambrogio."
            },
            {
              title: "La Sorbettiera",
              desc: "Artisanal gelato focusing on organic ingredients and seasonal fruits."
            }
          ].map((shop, index) => (
            <div key={index} className="guide-lifecycle-card">
              <h3>{shop.title}</h3>
              <p>{shop.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer className="guide-footer">
      <p>Explore Florence one gelato at a time.</p>
      <p className="text-sm mt-2">Updated seasonally with new discoveries and local recommendations.</p>
    </footer>
  </div>
);

const NIKERaiven = () => {
  return <NIKERaivenContent />;
};

export default NIKERaiven;
