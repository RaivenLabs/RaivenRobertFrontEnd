import React from 'react';
import { Bell, Clock, Headphones, FileSearch, Settings, ArrowRight, MessageSquare } from 'lucide-react';
import './concierge.css';

const Concierge = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <h1 className="text-4xl font-semibold mb-4">Welcome to Your Tangible Concierge</h1>
          <p className="text-xl max-w-3xl mx-auto mb-4">
            How can we assist you today?
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            We're here to make your platform experience seamless and delightful
          </p>
        </header>

        {/* Quick Actions Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-lightGray rounded-lg hover:shadow-md transition-shadow">
              <Clock className="w-12 h-12 text-royalBlue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Active Transactions</h3>
              <p className="text-center text-gray-600">Monitor status, deadlines, and next steps for all your active deals</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-lightGray rounded-lg hover:shadow-md transition-shadow">
              <Bell className="w-12 h-12 text-royalBlue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Service Requests</h3>
              <p className="text-center text-gray-600">Submit new requests or check status of existing support tickets</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-lightGray rounded-lg hover:shadow-md transition-shadow">
              <FileSearch className="w-12 h-12 text-royalBlue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Document Assistance</h3>
              <p className="text-center text-gray-600">Get help with document creation, review, or management</p>
            </div>
          </div>
        </section>

        {/* Service Channels Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Ways We Can Help
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                title: "24/7 Platform Support",
                description: "Technical assistance and platform guidance whenever you need it",
                icon: <Headphones className="w-6 h-6 text-royalBlue" />
              },
              {
                title: "Transaction Advisory",
                description: "Expert guidance on deal structure, process optimization, and best practices",
                icon: <MessageSquare className="w-6 h-6 text-royalBlue" />
              },
              {
                title: "System Configuration",
                description: "Help with customizing the platform to match your workflow",
                icon: <Settings className="w-6 h-6 text-royalBlue" />
              }
            ].map((service, index) => (
              <div key={index} 
                   className="flex items-center p-6 bg-lightGray rounded-lg hover:bg-lightBlue transition-colors">
                {service.icon}
                <div className="ml-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-royalBlue" />
              </div>
            ))}
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Our Commitment to You
          </h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg leading-relaxed mb-6">
              We believe that exceptional service begins with attentiveness and a spirit of radical generosity.
              Our commitment is to provide responsive, proactive support that delights and empowers you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  metric: "15min",
                  label: "Average Response Time"
                },
                {
                  metric: "24/7",
                  label: "Support Availability"
                },
                {
                  metric: "98%",
                  label: "Customer Satisfaction"
                }
              ].map((stat, index) => (
                <div key={index} className="p-4">
                  <div className="text-3xl font-bold text-royalBlue mb-2">{stat.metric}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Need Immediate Assistance Section */}
        <section className="bg-royalBlue text-ivory py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">Need Immediate Assistance?</h2>
            <p className="text-lg mb-6">Our team is standing by to help you with any questions or concerns</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-royalBlue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-royalBlue-hover transition-colors">
                Schedule a Consultation
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white text-center py-8 px-4 mt-12 rounded-lg">
          <p className="text-gray-600">
            © 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
            Built for serious business with a smile. Radical generosity is our motto!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Concierge;
