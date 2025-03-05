// src/pages/mergercontrol/TransactionLoaderEntry.jsx
import React from 'react';
import { 
  FileText, 
  PlayCircle, 
  RotateCcw, 
  Clock,
  AlertCircle 
} from 'lucide-react';
import { useApplicationRun } from '../../../contexts/ApplicationRunContext';
import { useMergerControl } from '../../../contexts/MergerControlContext';
import TransactionLoader from './TransactionLoader';

const RunStateCard = ({ icon: Icon, title, description, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-6 border rounded-lg shadow-sm hover:shadow-md transition-all 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-royalBlue'}
                flex flex-col items-center text-center space-y-4 w-full`}
  >
    <Icon className="w-12 h-12 text-royalBlue" />
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </button>
);

const TransactionLoaderEntry = () => {
  const { 
    runState,
    initializeRun,
    loadRun,
    error: runError,
    clearError 
  } = useApplicationRun();

  const { isLoading, error: mergerError } = useMergerControl();

  // Handle starting a new analysis
  const handleNewAnalysis = async () => {
    await initializeRun('MERGER_CONTROL', 'current_user', 4); // 4 main steps in process
  };

  // Show error states
  if (runError || mergerError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 w-5 h-5 mr-2" />
          <div className="flex-1 text-red-700">{runError || mergerError}</div>
          <button 
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-royalBlue">Loading...</div>
      </div>
    );
  }

  // If we have an active run, show the main transaction loader
  if (runState.status === 'IN_PROCESS' || runState.status === 'NEW') {
    return <TransactionLoader />;
  }

  // Entry point selection screen
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-royalBlue mb-8">
        Merger Control Analysis
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <RunStateCard
          icon={PlayCircle}
          title="Launch New Analysis"
          description="Start a new merger control analysis for a transaction"
          onClick={handleNewAnalysis}
        />

        <RunStateCard
          icon={RotateCcw}
          title="Continue Analysis"
          description="Resume work on an in-progress analysis"
          onClick={() => {
            // This would open a modal to select from in-progress runs
            // We'll need to implement this
          }}
        />

        <RunStateCard
          icon={Clock}
          title="Recent Analyses"
          description="View and manage your recent merger control analyses"
          onClick={() => {
            // This would navigate to a recent analyses page
            // We'll need to implement this
          }}
        />

        <RunStateCard
          icon={FileText}
          title="Archived Analyses"
          description="Access completed and archived analyses"
          onClick={() => {
            // This would navigate to archives page
            // We'll need to implement this
          }}
        />
      </div>
    </div>
  );
};

export default TransactionLoaderEntry;
