import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  fetchDimensionDetail, 
  fetchAttributeValues, 
  updateAttributeValue,
  initializeDimension
} from '../services/transactionService';
import './Dashboard.css';

const DimensionDetail = () => {
  const { transactionId, dimensionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [dimension, setDimension] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [attributeValue, setAttributeValue] = useState('');
  
  // Check if we need to initialize this dimension
  const shouldInitialize = searchParams.get('initialize') === 'true';
  
  useEffect(() => {
    const loadDimensionData = async () => {
      try {
        setLoading(true);
        
        // If this is a new dimension, initialize it first
        if (shouldInitialize) {
          await initializeDimension(transactionId, dimensionId);
        }
        
        // Load dimension details
        const dimensionData = await fetchDimensionDetail(transactionId, dimensionId);
        setDimension(dimensionData);
        
        // Load attribute values
        const attributeData = await fetchAttributeValues(transactionId, dimensionId);
        setAttributes(attributeData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading dimension data:', err);
        setError('Failed to load dimension data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDimensionData();
  }, [transactionId, dimensionId, shouldInitialize]);
  
  // Start editing an attribute
  const handleEditAttribute = (attribute) => {
    setEditingAttribute(attribute.id);
    
    // Set initial value based on data type
    if (attribute.dataType === 'text' || attribute.dataType === 'string') {
      setAttributeValue(attribute.textValue || '');
    } else if (attribute.dataType === 'number') {
      setAttributeValue(attribute.numberValue?.toString() || '');
    } else if (attribute.dataType === 'boolean') {
      setAttributeValue(attribute.booleanValue?.toString() || 'false');
    } else if (attribute.dataType === 'date') {
      // Format date for input
      const dateValue = attribute.dateValue ? new Date(attribute.dateValue) : null;
      setAttributeValue(dateValue ? dateValue.toISOString().split('T')[0] : '');
    }
  };
  
  // Save attribute value
  const handleSaveAttribute = async (attribute) => {
    try {
      setSaving(true);
      
      // Convert value based on data type
      let valueToSave;
      if (attribute.dataType === 'text' || attribute.dataType === 'string') {
        valueToSave = { textValue: attributeValue };
      } else if (attribute.dataType === 'number') {
        valueToSave = { numberValue: parseFloat(attributeValue) };
      } else if (attribute.dataType === 'boolean') {
        valueToSave = { booleanValue: attributeValue === 'true' };
      } else if (attribute.dataType === 'date') {
        valueToSave = { dateValue: new Date(attributeValue).toISOString() };
      }
      
      // Update in backend
      await updateAttributeValue(transactionId, attribute.id, valueToSave);
      
      // Update local state
      setAttributes(prevAttributes => 
        prevAttributes.map(attr => 
          attr.id === attribute.id 
            ? { ...attr, ...valueToSave, completionStatus: 'Completed' } 
            : attr
        )
      );
      
      // Exit edit mode
      setEditingAttribute(null);
      setAttributeValue('');
      
    } catch (err) {
      console.error('Error saving attribute:', err);
      alert('Failed to save attribute value. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingAttribute(null);
    setAttributeValue('');
  };
  
  // Render input field based on data type
  const renderInputField = (attribute) => {
    if (attribute.dataType === 'boolean') {
      return (
        <select 
          value={attributeValue} 
          onChange={(e) => setAttributeValue(e.target.value)}
          disabled={saving}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    } else if (attribute.dataType === 'date') {
      return (
        <input 
          type="date" 
          value={attributeValue} 
          onChange={(e) => setAttributeValue(e.target.value)}
          disabled={saving}
        />
      );
    } else if (attribute.dataType === 'number') {
      return (
        <input 
          type="number" 
          value={attributeValue} 
          onChange={(e) => setAttributeValue(e.target.value)}
          disabled={saving}
          min="0"
          step={attribute.id.includes('percentage') ? "0.01" : "1"}
        />
      );
    } else {
      // Default text input
      return (
        <textarea 
          value={attributeValue} 
          onChange={(e) => setAttributeValue(e.target.value)}
          disabled={saving}
          rows={4}
          maxLength={attribute.maxLength || 2000}
        />
      );
    }
  };
  
  // Determine the attribute display value based on its type
  const getAttributeDisplayValue = (attribute) => {
    if (attribute.dataType === 'boolean') {
      return attribute.booleanValue ? 'Yes' : 'No';
    } else if (attribute.dataType === 'date') {
      return attribute.dateValue ? new Date(attribute.dateValue).toLocaleDateString() : 'Not set';
    } else if (attribute.dataType === 'number') {
      return attribute.numberValue !== null ? attribute.numberValue.toString() : 'Not set';
    } else {
      // Text or string
      return attribute.textValue || 'Not set';
    }
  };
  
  if (loading) {
    return <div className="loading">Loading dimension data...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!dimension) {
    return <div className="error">Dimension not found</div>;
  }
  
  // Calculate completion percentage
  const completedAttributes = attributes.filter(attr => attr.completionStatus === 'Completed').length;
  const completionPercentage = attributes.length > 0 
    ? Math.round((completedAttributes / attributes.length) * 100) 
    : 0;
  
  return (
    <div className="dimension-detail">
      <div className="dimension-header">
        <button 
          className="back-button"
          onClick={() => navigate(`/transactions/${transactionId}`)}
        >
          ← Back to Transaction
        </button>
        <h1>{dimension.displayName}</h1>
        <div className="dimension-status">
          <div className="completion-label">Completion: {completionPercentage}%</div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="attributes-container">
        <h2>Attributes</h2>
        
        <table className="attributes-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map(attribute => (
              <tr key={attribute.id} className={attribute.required ? 'required' : ''}>
                <td>
                  {attribute.displayName}
                  {attribute.required && <span className="required-indicator">*</span>}
                </td>
                <td>
                  {editingAttribute === attribute.id ? (
                    <div className="edit-field">
                      {renderInputField(attribute)}
                    </div>
                  ) : (
                    <div className={`attribute-value ${attribute.completionStatus === 'Not Started' ? 'not-set' : ''}`}>
                      {getAttributeDisplayValue(attribute)}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`status-indicator status-${attribute.completionStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {attribute.completionStatus}
                  </span>
                </td>
                <td>
                  {editingAttribute === attribute.id ? (
                    <div className="action-buttons">
                      <button 
                        className="save-button"
                        onClick={() => handleSaveAttribute(attribute)}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="edit-button"
                      onClick={() => handleEditAttribute(attribute)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="dimension-actions">
        <button className="secondary-button">Upload Documents</button>
        <button className="secondary-button">Add Comment</button>
        <button className="secondary-button">Assign Task</button>
        <button 
          className="primary-button"
          disabled={completionPercentage < 100}
        >
          Mark Dimension as Complete
        </button>
      </div>
    </div>
  );
};

export default DimensionDetail;
