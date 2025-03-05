import { ChevronRight } from 'lucide-react';

const ProcessSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Select Companies",
      description: "Choose both buying and target companies"
    },
    {
      number: 2,
      title: "Project Details",
      description: "Add optional custom project name"
    },
    {
      number: 3,
      title: "Review Data",
      description: "Check jurisdictional information"
    },
    {
      number: 4,
      title: "Save Progress",
      description: "Save work and proceed to analysis"
    },
    {
      number: 5,
      title: "Review Analysis",
      description: "View detailed merger control analysis"
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="relative">
          <div className="relative bg-white rounded-lg border-2 border-navy p-3 w-36 h-26">
            <div className="absolute -top-3 left-4 bg-navy text-white rounded-full w-6 h-6 
                        flex items-center justify-center font-semibold">{step.number}</div>
            <div className="flex flex-col space-y-1">
              <h4 className="text-teal font-medium text-sm">{step.title}</h4>
              <p className="text-xs text-gray-600">
                {step.description}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                <div className="px-0">
                  <ChevronRight className="text-teal" size={24} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessSteps;
