import React from 'react';
import './platformtour.css';

const PlatformTour = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <h1 className="text-4xl font-semibold mb-4">Transaction Services Platform</h1>
          <p className="text-xl max-w-3xl mx-auto mb-2">Powered by Tangible Intelligence</p>
          <p className="text-lg max-w-3xl mx-auto">
            From paper-based, siloed contracting processes to fluid Transactional Streams
          </p>
        </header>

      
        {/* Platform Architecture Section */}
<section className="bg-white py-16 px-4 rounded-lg mb-8">
  <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
    Platform Architecture
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto px-4">
    {/* First Box */}
    <div className="bg-lightGray p-8 rounded-lg shadow-md">
      <h1 className="italic text-xl leading-relaxed">
        The Critical Unlock resides at the Intersection of Computational Automation, 
        Data Intelligence and Sector Expertise. The pattern of the high volume 
        transaction portfolio is the key.
      </h1>
    </div>
    
    {/* Arrow Section */}
    <div className="flex flex-col items-center justify-center py-8">
      <div className="tour-arrow-container">
        <div className="tour-arrow-right"></div>
        <span className="text-teal font-semibold text-lg mt-6">Driving</span>
      </div>
    </div>
    
    {/* Second Box */}
    <div className="bg-lightGray p-8 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6">Transactional Excellence</h3>
      <ul className="space-y-4">
        <li className="flex items-center text-lg">
          <span className="text-teal mr-3 text-xl">✓</span>
          Accelerated speed to close
        </li>
        <li className="flex items-center text-lg">
          <span className="text-teal mr-3 text-xl">✓</span>
          Quality of Deal Content
        </li>
        <li className="flex items-center text-lg">
          <span className="text-teal mr-3 text-xl">✓</span>
          Low Friction
        </li>
      </ul>
    </div>
  </div>
</section>
        {/* Lifecycle Section */}
        <section className="bg-white py-16 px-4 rounded-lg mb-8">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            The Transaction Lifecycle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-4">
            {[
              { title: "1. Ideation", desc: "Transforming concepts into actionable opportunities." },
              { title: "2. Sourcing", desc: "Defining goals and structure for seamless execution." },
              { title: "3. Transacting", desc: "Driving value with informed and strategic counterparty transacting." },
              { title: "4. Priming", desc: "Securing approvals for close." },
              { title: "5. Closing", desc: "Signing the final package." },
              { title: "6. Archiving", desc: "Extracting metadata and putaway." },
              { title: "7. Performing", desc: "Tracking counterparty performance and optimizing for sustained success." }
            ].map((phase, index) => (
              <div
                key={index}
                className="bg-white border border-lightBlue rounded-lg p-4 min-w-[150px] 
                          hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className="text-royalBlue text-lg mb-2">{phase.title}</h3>
                <p className="text-sm">{phase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Finder Section */}
        <section className="bg-gray-50 py-16 px-4 rounded-lg mt-12">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-8">
            Where Do I Find It?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-royalBlue text-ivory">
                <tr>
                  <th className="p-4 text-left font-semibold">Mission</th>
                  <th className="p-4 text-left font-semibold">Transaction Stage and Gates</th>
                  <th className="p-4 text-left font-semibold">Platform Functionality</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Build a Transaction", "Sourcing and Transacting", "Dealmaking"],
                  ["Look up Transaction Status", "Planning, Negotiation, Execution", "Active Projects"],
                  ["Run my transactional system", "System Management", "Concierge"],
                  ["Load Legacy Data", "Transacting", "Configuration"],
                  ["Archive Transactions", "Archiving", "My Locker"],
                  ["Analyze a Portfolio of Transactions", "Management", "Portfolio Analytics"],
                  ["Check system health", "System Management", "Headquarters"],
                  ["Tune my Platform", "Platform Management", "Settings"]
                ].map((row, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-lightBlue border-b border-lightBlue last:border-b-0"
                  >
                    <td className="p-4">{row[0]}</td>
                    <td className="p-4">{row[1]}</td>
                    <td className="p-4">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
             Built for serious business with a smile. Radical generosity is our motto!</p>
        </footer>
      </div>
    </div>
  );
};

export default PlatformTour;
