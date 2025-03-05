import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeakeasyGateway from './components/SpeakeasyGateway';
import { useSpeakeasy } from '../../../context/SpeakeasyContext';
import {
  Coffee,
  Clipboard,
  Book,
  Code,
  Utensils,
  Brain,
  Palette,
  Plane,
  Globe,
  Bot,
} from 'lucide-react';

const SpeakeasyContent = () => {
  const navigate = useNavigate();
  const { setSpeakeasyAccess } = useSpeakeasy();

  const applications = [
    {
      title: 'Florence Food Guide',
      desc: 'Curated list of the best gelaterias and restaurants in Florence.',
      icon: Coffee,
    },
    {
      title: '10K Trainer',
      desc: 'Personalized training program for your next 10K race.',
      icon: Clipboard,
    },
    {
      title: 'Seminary Reading Guide',
      desc: 'Structured approach to theological studies.',
      icon: Book,
    },
    {
      title: 'Dev Learning Path',
      desc: 'Software engineering mastery in 10 steps.',
      icon: Code,
    },
    {
      title: 'London Dining',
      desc: "Inside track to London's best restaurants.",
      icon: Utensils,
    },
    {
      title: 'Personal RAG',
      desc: 'Build your own AI-powered knowledge base.',
      icon: Brain,
    },
  ];

  const handleLeave = () => {
    sessionStorage.removeItem('speakeasyAccess');
    setSpeakeasyAccess(false);
    navigate('/rapidreview');
  };

  return (
    <div className="guide-wrapper">
      <header className="guide-header">
        <div className="guide-container">
          <h1>The Tangible Speakeasy</h1>
          <p>Your Gateway to Life Beyond the Desk</p>
          <p>
            Discover apps that make life more enjoyable, both in and out of the
            office.
          </p>
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
            {applications.map((app, index) => {
              const IconComponent = app.icon;
              return (
                <div key={index} className="guide-lifecycle-card">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="w-6 h-6 text-royalBlue" />
                    <h3>{app.title}</h3>
                  </div>
                  <p>{app.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleLeave}
              className="px-6 py-3 bg-navyBlue text-ivory rounded hover:bg-royalBlue-hover transition-colors"
            >
              Leave Speakeasy
            </button>
            <button className="px-6 py-3 bg-navyBlue text-ivory rounded hover:bg-royalBlue-hover transition-colors">
              More
            </button>
          </div>
        </div>
      </section>

      <footer className="guide-footer">
        <p>
          © 2025 Tangible Intelligence, ai. Making work and life more enjoyable.
        </p>
      </footer>
    </div>
  );
};

const Speakeasy = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const { speakeasyAccess } = useSpeakeasy();

  useEffect(() => {
    const access = sessionStorage.getItem('speakeasyAccess');
    if (access === 'granted' || speakeasyAccess) {
      setHasAccess(true);
    }
  }, [speakeasyAccess]);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  return hasAccess ? (
    <SpeakeasyContent />
  ) : (
    <SpeakeasyGateway onAccessGranted={handleAccessGranted} />
  );
};

export default Speakeasy;
