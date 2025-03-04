import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { fetchFromAPI } from '../../../utils/api/api';  // Add this import
import './companyreport.css';

const CompanyReport = () => {
  const { coreconfig, config } = useConfig();  // Get both coreconfig and config
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const customerId = config?.id || 'HAWKEYE';
        console.log('Fetching data for customer:', customerId);
        
        const customerData = await fetchFromAPI(
          `/company-report/${customerId}`, 
          coreconfig.apiUrl
        );
        console.log('Received customer data:', customerData);
        console.log('Received customer data:', customerData);
        
        setCustomerData(customerData);
      } catch (err) {
        console.error('Error loading customer data:', err);
        setError('Unable to load customer information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [config?.id]);

  // Rest of the component remains the same...
  if (loading) {
    return (
      <div className="company-report">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-report">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="company-report">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p>Customer information is currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-report">
      <header className="company-header">
        <h1>{customerData.company_name}</h1>
        <div className="company-overview">
          <span className="industry">{customerData.overview.industry}</span>
          <span className="category">{customerData.overview.category}</span>
          <span className="revenue">{customerData.overview.annual_revenue}</span>
        </div>
      </header>

      <div className="report-grid">
        {/* Key Metrics Section */}
        <section className="metrics-section card">
          <h2>Global Presence</h2>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-value">{customerData.key_metrics.global_presence.countries}</span>
              <span className="metric-label">Countries</span>
            </div>
            <div className="metric">
              <span className="metric-value">{customerData.key_metrics.global_presence.offices}</span>
              <span className="metric-label">Offices</span>
            </div>
            <div className="metric">
              <span className="metric-value">{customerData.key_metrics.global_presence.regions.length}</span>
              <span className="metric-label">Regions</span>
            </div>
          </div>
        </section>

        {/* Rest of the sections remain unchanged */}
        {/* Practice Areas Section */}
        <section className="practices-section card">
          <h2>Core Competencies</h2>
          <div className="practices-list">
            {customerData.key_metrics.practice_areas.map((practice, index) => (
              <div key={index} className="practice-item">
                <span className="practice-name">{practice.name}</span>
                <span className="practice-level">{practice.expertise_level}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Innovation Section */}
        <section className="innovation-section card">
          <h2>Innovation Initiatives</h2>
          <div className="innovation-grid">
            <div className="tech-innovations">
              <h3>Technology</h3>
              <ul>
                {customerData.innovation.technology.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
            <div className="sustainability-innovations">
              <h3>Sustainability</h3>
              <ul>
                {customerData.innovation.sustainability.map((initiative, index) => (
                  <li key={index}>{initiative}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section card">
          <h2>Key Milestones</h2>
          <div className="timeline">
            {customerData.milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <span className="year">{milestone.year}</span>
                <span className="event">{milestone.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contacts Section */}
        <section className="contacts-section card">
          <h2>Key Contacts</h2>
          <div className="contacts-grid">
            {customerData.contacts.map((contact, index) => (
              <div key={index} className={`contact-card ${contact.primary ? 'primary' : ''}`}>
                <h3>{contact.name}</h3>
                <p className="title">{contact.title}</p>
                <p className="location">{contact.location}</p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyReport;
