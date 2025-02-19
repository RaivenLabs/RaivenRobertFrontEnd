// Step 1: Create the component file with proper imports
import React from 'react';
// Import any required icons, components, constants, etc.
import { TEMPLATE_STAGES } from '../../constants/templateConstants';

// Step 2: Define the component with its props interface
const ComponentName = ({ 
  prop1,
  prop2,
  // other props
}) => {
  // Step 3: Extract any state or effects specific to this component
  const [localState, setLocalState] = useState(initialValue);
  
  useEffect(() => {
    // Component-specific effect logic
  }, [dependencies]);
  
  // Step 4: Extract any helper functions specific to this component
  const handleSomeAction = () => {
    // Function logic
  };
  
  // Step 5: Component render logic
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

// Step 6: Export the component
export default ComponentName;


// Step 7: Update imports in parent component
/*
import ComponentName from '../path/to/ComponentName';

// Step 8: Replace the inline component with the imported one
<ComponentName
  prop1={value1}
  prop2={value2}
/>
*/
