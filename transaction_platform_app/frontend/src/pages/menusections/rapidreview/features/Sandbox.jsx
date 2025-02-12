import React, { useState, useEffect } from 'react';
import { MessageSquare, Eye, ArrowRight, Workflow, Brain, Code, Settings,GitBranch, Share2, CheckCircle } from 'lucide-react';
import mermaid from 'mermaid';
import { flowchartDefinition } from './borderCollieDiagram';

const DesignCenterContent = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Initialize mermaid when component mounts
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        useMaxWidth: true
      }
    });
  }, []);

// Replace the flowchartDefinition import with this constant
const flowchartDefinition = `graph TB
    A[Natural Language Input] -->|AI Analysis| B[Structured Requirements]
    B -->|Pattern Recognition| C[Business Process Model]
    C -->|Automation Rules| D[Executable Workflow]
    
    subgraph Input Stage
    A
    end
    
    subgraph Processing Stage
    B --> B1[Extract Key Steps]
    B --> B2[Identify Dependencies]
    B --> B3[Define Conditions]
    end
    
    subgraph Output Stage
    C --> C1[Validation Rules]
    C --> C2[Decision Points]
    C --> C3[Action Items]
    end
    
    subgraph Automation Stage
    D --> D1[API Integration]
    D --> D2[Task Assignment]
    D --> D3[Progress Tracking]
    end
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#9ff,stroke:#333,stroke-width:2px
    style Input Stage fill:#f9f9f9,stroke:#999,stroke-width:1px
    style Processing Stage fill:#f0f0f0,stroke:#999,stroke-width:1px
    style Output Stage fill:#e6e6e6,stroke:#999,stroke-width:1px
    style Automation Stage fill:#d9d9d9,stroke:#999,stroke-width:1px`;




  const steps = [
    {
      title: "Natural Language Description",
      icon: MessageSquare,
      input: `I need a workflow for adopting a border collie. First, we need to check local pet regulations and housing rules. Then we research reputable breeders or rescue centers. We schedule a meet-and-greet with the dog. If it's a good match, we submit adoption application. After approval, we prepare our home with supplies. Finally, we bring the dog home and schedule initial vet visit.`,
      response: "I understand you're creating an adoption workflow. Let me help structure this process. Would you like me to include checkpoints for essential supplies and home preparation requirements specific to border collies?"
    },
    {
      title: "AI Analysis & Suggestions",
      icon: Eye,
      analysis: {
        patterns: [
          "Pre-adoption verification steps",
          "Selection and matching process",
          "Post-adoption care setup"
        ],
        suggestions: [
          "Add a home assessment checklist specific to border collies' exercise needs",
          "Include a training plan preparation step",
          "Consider adding a socialization assessment stage",
          "Incorporate a budget planning step for ongoing care"
        ],
        optimization: "Recommended parallel tracks for home preparation while waiting for application approval"
      }
    },
    {
      title: "Application Pathway",
      icon: GitBranch,
      diagram: {
        steps: [
          { id: 1, name: "Regulation Check", status: "Required", time: "1-2 days" },
          { id: 2, name: "Breeder Research", status: "Required", time: "1-2 weeks" },
          { id: 3, name: "Meet & Greet", status: "Required", time: "1-3 hours" },
          { id: 4, name: "Application", status: "Conditional", time: "3-5 days" },
          { id: 5, name: "Home Preparation", status: "Parallel", time: "1 week" },
          { id: 6, name: "Welcome Home", status: "Final", time: "1 day" }
        ]
      }
    },
    {
      title: "Visual Preview",
      icon: Share2,
      flowchart: true
    }
  ];




  useEffect(() => {
    // Render mermaid diagram when reaching the Visual Preview step
    if (activeStep === 3) {
      mermaid.contentLoading = false;
      mermaid.init(undefined, '.mermaid');
    }
  }, [activeStep]);

  return (
   <div className="w-full">
    <div className="guide-wrapper">
    {/* Header Section */}
    <header className="guide-header">
      <div className="guide-container">
      <h1>AIDA<sup style={{ fontSize: '0.6em' }}>™</sup> Design Center</h1>
       
        <p>From natural language process descriptions to fully automated workflows</p>
      </div>
    </header>

    {/* Core Value Proposition Section */}
    <section className="bg-white py-16 px-4 rounded-lg mb-8">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
        The Power of CoIntelligent Design
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto px-4">
        <div className="bg-lightGray p-8 rounded-lg shadow-md">
          <h1 className="italic text-xl leading-relaxed">
            The breakthrough lies in converting human process knowledge into 
            automated workflows through natural language. Your expertise becomes 
            living automation through conversation.
          </h1>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8">
          <div className="tour-arrow-container">
            <div className="tour-arrow-right"></div>
            <span className="text-teal font-semibold text-lg mt-6">Enabling</span>
          </div>
        </div>
        
        <div className="bg-lightGray p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Process Excellence</h3>
          <ul className="space-y-4">
            <li className="flex items-center text-lg">
              <span className="text-teal mr-3 text-xl">✓</span>
              Rapid process deployment
            </li>
            <li className="flex items-center text-lg">
              <span className="text-teal mr-3 text-xl">✓</span>
              Natural language design
            </li>
            <li className="flex items-center text-lg">
              <span className="text-teal mr-3 text-xl">✓</span>
              AI-guided optimization
            </li>
          </ul>
        </div>
      </div>
    </section>

    {/* Design Process Section */}
    <section className="bg-white py-16 px-4 rounded-lg mb-8">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
        The Design Journey
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {[
          { 
            title: "1. Description", 
            desc: "Describe your process in natural language with AI-guided templates." 
          },
          { 
            title: "2. Analysis", 
            desc: "AI analyzes your process, suggesting optimizations and best practices." 
          },
          { 
            title: "3. Visualization", 
            desc: "See your process come to life on the Tangible Design Canvas." 
          },
          { 
            title: "4. Refinement", 
            desc: "Collaborate with AI to perfect your workflow through natural dialogue." 
          },
          { 
            title: "5. Deployment", 
            desc: "Transform your approved design into a working automated process." 
          }
        ].map((phase, index) => (
          <div
            key={index}
            className="bg-white border border-lightBlue rounded-lg p-4 min-w-[200px] 
                      hover:-translate-y-1 transition-transform duration-300"
          >
            <h3 className="text-royalBlue text-lg mb-2">{phase.title}</h3>
            <p className="text-sm">{phase.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features Section */}
    <section className="bg-gray-50 py-16 px-4 rounded-lg mb-8">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
        Intelligent Design Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "Smart Templates",
            desc: "Industry-specific templates and guided prompts ensure comprehensive process capture"
          },
          {
            title: "Real-Time Preview",
            desc: "Watch your process visualization evolve as you describe and refine it"
          },
          {
            title: "AI Optimization",
            desc: "Receive intelligent suggestions for process improvements and efficiency gains"
          },
          {
            title: "Version Control",
            desc: "Track changes, compare versions, and maintain complete design history"
          },
          {
            title: "Collaborative Refinement",
            desc: "Work with AI to perfect your process through natural conversation"
          },
          {
            title: "Automatic Implementation",
            desc: "Generate complete workflow implementations with all required components"
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-royalBlue mb-3">{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Use Cases Section */}
    <section className="bg-white py-16 px-4 rounded-lg mb-8">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
        From Description to Automation
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-royalBlue text-ivory">
            <tr>
              <th className="p-4 text-left font-semibold">You Describe</th>
              <th className="p-4 text-left font-semibold">Design Center Delivers</th>
              <th className="p-4 text-left font-semibold">Business Impact</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Customer onboarding steps",
                "Automated welcome sequence with checkpoints",
                "Consistent, efficient customer experience"
              ],
              [
                "Contract approval process",
                "Multi-stage approval workflow with notifications",
                "Faster contract execution, no missed steps"
              ],
              [
                "Order fulfillment procedure",
                "Integrated order processing system",
                "Reduced errors, faster delivery"
              ],
              [
                "Employee expense reporting",
                "Digital expense submission and approval flow",
                "Streamlined reimbursement, better compliance"
              ],
              [
                "Service request handling",
                "Automated ticket routing and response system",
                "Improved response times, higher satisfaction"
              ]
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

    {/* Getting Started Section */}
    <section className="bg-gray-50 py-16 px-4 rounded-lg mt-12">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-8">
        Ready to Transform Your Processes?
      </h2>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg mb-8">
          Start with a simple process description. Our AI-powered Design Center will guide you 
          through creating your first automated workflow in minutes.
        </p>
        <button className="bg-royalBlue text-ivory px-8 py-4 rounded-lg text-lg 
                         hover:bg-blue-700 transition-colors duration-300">
          Launch Design Center
        </button>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
      <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
         Built for serious business with a smile. Radical generosity is our motto!</p>
    </footer>
  </div>









    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-royalBlue mb-8">
        Design Your Border Collie Adoption Workflow
      </h1>

      {/* Step Navigator */}
      <div className="flex space-x-4 mb-8">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-300 ${
              activeStep === index
                ? 'bg-royalBlue text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <step.icon className="w-5 h-5 mr-2" />
            <span>{step.title}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Your Process Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{steps[0].input}</p>
            </div>
            
            <div className="border-l-4 border-teal p-4 bg-teal-50">
              <h3 className="text-lg font-semibold mb-2">AI Response</h3>
              <p className="text-gray-700">{steps[0].response}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Smart Template Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border border-gray-200">
                  ✓ Include exercise requirements
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  ✓ Specify space requirements
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  ✓ Add training commitment details
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  ✓ List required documentation
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Process Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-royalBlue">Identified Patterns</h4>
                  <ul className="mt-2 space-y-2">
                    {steps[1].analysis.patterns.map((pattern, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-teal mr-2" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-royalBlue">Optimization Suggestions</h4>
                  <ul className="mt-2 space-y-2">
                    {steps[1].analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-center">
                        <Share2 className="w-4 h-4 text-teal mr-2" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Process Optimization</h3>
              <p className="text-gray-700">{steps[1].analysis.optimization}</p>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Application Pathway</h3>
              <div className="space-y-4">
                {steps[2].diagram.steps.map((step) => (
                  <div 
                    key={step.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-royalBlue text-white flex items-center justify-center">
                        {step.id}
                      </div>
                      <span className="ml-4 font-medium">{step.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        step.status === 'Required' ? 'bg-red-100 text-red-700' :
                        step.status === 'Conditional' ? 'bg-yellow-100 text-yellow-700' :
                        step.status === 'Parallel' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {step.status}
                      </span>
                      <span className="text-gray-500 text-sm">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Request Changes
              </button>
              <button className="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-blue-700">
                Approve Pathway
              </button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Workflow Preview</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="mermaid w-full overflow-x-auto">
                  {flowchartDefinition}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Adjust Flow
                </button>
                <button className="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-blue-700">
                  Approve & Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          className={`px-4 py-2 rounded-lg ${
            activeStep === 0 ? 'invisible' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Previous Step
        </button>
        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          className={`px-4 py-2 rounded-lg ${
            activeStep === steps.length - 1 
              ? 'invisible' 
              : 'bg-royalBlue text-white hover:bg-blue-700'
          }`}
        >
          Next Step
      
       
       
       
        </button>
        </div>
      </div>
    </div>
  );
};



  export default DesignCenterContent;
