import React, { useState } from 'react';
import { 
  Plus, Trash2, ChevronDown, ChevronRight,
  Edit2, Check, X, AlertTriangle
} from 'lucide-react';

const DATA_TYPES = [
  'string', 'number', 'boolean', 'date', 'datetime', 
  'object', 'array', 'uuid', 'enum', 'integer'
];

const SchemaFieldTable = ({ schema, onUpdateSchema }) => {
  const [editingField, setEditingField] = useState(null);
  const [expandedFields, setExpandedFields] = useState({});

  // Toggle field expansion (for nested fields)
  const toggleExpand = (fieldPath) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldPath]: !prev[fieldPath]
    }));
  };

  // Start editing a field
  const startEditing = (field) => {
    setEditingField({
      ...field,
      // Make a copy to avoid direct mutation
      originalPath: field.path 
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingField(null);
  };

  // Save field edits
  const saveFieldEdit = () => {
    if (!editingField) return;
    
    const updatedSchema = {...schema};
    let currentLevel = updatedSchema.fields;
    const pathParts = editingField.originalPath.split('.');
    
    // If this is a nested field, navigate to its parent
    if (pathParts.length > 1) {
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        const field = currentLevel.find(f => f.name === part);
        if (field && field.fields) {
          currentLevel = field.fields;
        }
      }
    }
    
    // Find the field to update
    const fieldName = pathParts[pathParts.length - 1];
    const fieldIndex = currentLevel.findIndex(f => f.name === fieldName);
    
    if (fieldIndex !== -1) {
      // Update the existing field
      currentLevel[fieldIndex] = {
        ...currentLevel[fieldIndex],
        name: editingField.name,
        type: editingField.type,
        description: editingField.description,
        required: editingField.required,
        format: editingField.format
      };
    }
    
    onUpdateSchema(updatedSchema);
    setEditingField(null);
  };

  // Add a new field
  const addField = (parentPath = '') => {
    const newField = {
      name: 'new_field',
      type: 'string',
      description: '',
      required: false,
      path: parentPath ? `${parentPath}.new_field` : 'new_field'
    };
    
    const updatedSchema = {...schema};
    let currentLevel = updatedSchema.fields;
    
    // If adding to a nested path, navigate to it
    if (parentPath) {
      const pathParts = parentPath.split('.');
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const field = currentLevel.find(f => f.name === part);
        if (field) {
          if (!field.fields) {
            field.fields = [];
          }
          currentLevel = field.fields;
        }
      }
    }
    
    currentLevel.push(newField);
    onUpdateSchema(updatedSchema);
    
    // Expand the parent if adding a nested field
    if (parentPath) {
      setExpandedFields(prev => ({
        ...prev,
        [parentPath]: true
      }));
    }
    
    // Start editing the new field
    startEditing(newField);
  };

  // Delete a field
  const deleteField = (fieldPath) => {
    const pathParts = fieldPath.split('.');
    const fieldName = pathParts[pathParts.length - 1];
    
    const updatedSchema = {...schema};
    let currentLevel = updatedSchema.fields;
    
    // Navigate to the parent level
    if (pathParts.length > 1) {
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        const field = currentLevel.find(f => f.name === part);
        if (field && field.fields) {
          currentLevel = field.fields;
        }
      }
    }
    
    // Remove the field
    const fieldIndex = currentLevel.findIndex(f => f.name === fieldName);
    if (fieldIndex !== -1) {
      currentLevel.splice(fieldIndex, 1);
      onUpdateSchema(updatedSchema);
    }
  };

  // Recursive function to render fields
  const renderFields = (fields, parentPath = '') => {
    return fields.map((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
      const isExpanded = !!expandedFields[fieldPath];
      const hasChildren = field.type === 'object' && field.fields && field.fields.length > 0;
      
      // Check if this is the field being edited
      const isEditing = editingField && editingField.originalPath === fieldPath;
      
      return (
        <React.Fragment key={fieldPath}>
          <tr className={`border-b ${isEditing ? 'bg-blue-50' : ''}`}>
            <td className="px-4 py-3">
              <div className="flex items-center">
                {hasChildren && (
                  <button 
                    onClick={() => toggleExpand(fieldPath)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                )}
                
                {!isEditing ? (
                  <span className="font-medium">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                ) : (
                  <input 
                    type="text"
                    value={editingField.name}
                    onChange={(e) => setEditingField({...editingField, name: e.target.value})}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                )}
              </div>
            </td>
            
            <td className="px-4 py-3">
              {!isEditing ? (
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                  {field.type}
                  {field.format && <span className="text-gray-500 ml-1">({field.format})</span>}
                </span>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={editingField.type}
                    onChange={(e) => setEditingField({...editingField, type: e.target.value})}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {DATA_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  {editingField.type === 'string' && (
                    <input
                      type="text"
                      placeholder="Format (optional)"
                      value={editingField.format || ''}
                      onChange={(e) => setEditingField({...editingField, format: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                    />
                  )}
                </div>
              )}
            </td>
            
            <td className="px-4 py-3">
              {!isEditing ? (
                field.description || <span className="text-gray-400 italic">No description</span>
              ) : (
                <input 
                  type="text"
                  value={editingField.description || ''}
                  onChange={(e) => setEditingField({...editingField, description: e.target.value})}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Field description"
                />
              )}
            </td>
            
            <td className="px-4 py-3 text-center">
              {!isEditing ? (
                <div className="flex justify-center">
                  {field.required ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </div>
              ) : (
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={editingField.required || false}
                    onChange={(e) => setEditingField({...editingField, required: e.target.checked})}
                    className="h-4 w-4 text-royalBlue"
                  />
                </div>
              )}
            </td>
            
            <td className="px-4 py-3">
              <div className="flex justify-end space-x-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => startEditing(field)}
                      className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                      title="Edit field"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteField(fieldPath)}
                      className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Delete field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {field.type === 'object' && (
                      <button
                        onClick={() => addField(fieldPath)}
                        className="p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
                        title="Add nested field"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={saveFieldEdit}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                      title="Save changes"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
          
          {/* Render nested fields if applicable and expanded */}
          {hasChildren && isExpanded && (
            <tr>
              <td colSpan="5" className="p-0">
                <div className="pl-8 border-l-2 border-gray-200 ml-4">
                  <table className="w-full">
                    <tbody>
                      {renderFields(field.fields, fieldPath)}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  };

  // Check if schema is empty
  const isSchemaEmpty = !schema || !schema.fields || schema.fields.length === 0;

  return (
    <div className="overflow-x-auto">
      {isSchemaEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Schema Fields Defined</h3>
          <p className="text-gray-500 max-w-md mb-4">
            No fields have been defined for this schema yet. Add your first field to get started.
          </p>
          <button
            onClick={() => addField()}
            className="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-royalBlue/90 
              transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add First Field
          </button>
        </div>
      ) : (
        <>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Field Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Required</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderFields(schema.fields)}
            </tbody>
          </table>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => addField()}
              className="px-4 py-2 text-royalBlue border border-royalBlue rounded-lg
                hover:bg-royalBlue/10 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SchemaFieldTable;
