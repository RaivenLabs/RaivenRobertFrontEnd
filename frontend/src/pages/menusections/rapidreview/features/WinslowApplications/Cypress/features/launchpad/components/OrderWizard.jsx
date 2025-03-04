import React from 'react';
import ProviderSelectStep from './ProviderSelectionStep';
import RoleSelectionStep from './RoleSelectionStep';
import ScopeDefinitionStep from './ScopeDefinitionStep';
import DeliverablesStep from './DeliverablesStep';
import OrderReviewStep from './OrderReviewStep';

const OrderWizard = ({
  currentStep,
  totalSteps,
  orderData,
  providers,
  rateCards,
  onOrderDataChange,
  onAddRole,
  onRemoveRole,
  onNextStep,
  onPrevStep
}) => {
  // Check if the current step can proceed to the next step
  const canProceed = () => {
    switch (currentStep) {
      case 1: // Provider selection
        return orderData.providerId !== '';
      case 2: // Role selection
        return orderData.roles.length > 0;
      case 3: // Scope definition
        return orderData.scopeOfServices.trim() !== '';
      case 4: // Deliverables
        return orderData.deliverables.length > 0;
      case 5: // Review
        return true;
      default:
        return false;
    }
  };

  // Render the appropriate step content based on currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProviderSelectStep 
            providers={providers}
            selectedProviderId={orderData.providerId}
            onProviderSelect={(providerId) => onOrderDataChange('providerId', providerId)}
          />
        );
      case 2:
        return (
          <RoleSelectionStep 
            rateCard={rateCards[orderData.providerId] || { roles: [] }}
            selectedRoles={orderData.roles}
            onAddRole={onAddRole}
            onRemoveRole={onRemoveRole}
          />
        );
      case 3:
        return (
          <ScopeDefinitionStep 
            scopeOfServices={orderData.scopeOfServices}
            onScopeChange={(scope) => onOrderDataChange('scopeOfServices', scope)}
          />
        );
      case 4:
        return (
          <DeliverablesStep 
            deliverables={orderData.deliverables}
            onAddDeliverable={(deliverable) => 
              onOrderDataChange('deliverables', [...orderData.deliverables, deliverable])
            }
            onRemoveDeliverable={(index) => 
              onOrderDataChange('deliverables', 
                orderData.deliverables.filter((_, i) => i !== index)
              )
            }
            onUpdateDeliverable={(index, deliverable) => {
              const newDeliverables = [...orderData.deliverables];
              newDeliverables[index] = deliverable;
              onOrderDataChange('deliverables', newDeliverables);
            }}
          />
        );
      case 5:
        return (
          <OrderReviewStep 
            orderData={orderData}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="min-h-64">
        {renderStepContent()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={onPrevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={onNextStep}
          disabled={!canProceed()}
          className={`px-6 py-2 rounded ${
            canProceed()
              ? 'bg-royalBlue text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === totalSteps ? 'Create Order' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OrderWizard;
