import React, { useState, useEffect } from 'react';
import { 
  Database, FolderPlus, Upload, Eye, 
  ChevronDown, ChevronRight, RefreshCcw,
  AlertCircle, X
} from 'lucide-react';

const MongoPanel = () => {
  const [databases, setDatabases] = useState([]);
  const [expandedDB, setExpandedDB] = useState(null);
  const [selectedDB, setSelectedDB] = useState(null);
  const [newDBName, setNewDBName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('databases');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [error, setError] = useState(null);

  // Fetch databases
  const fetchDatabases = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mongodb/databases');
      const data = await response.json();
      
      // Check if we got an error response
      if (data.error) {
        setError(data.error);
        setDatabases([]); // Set empty array as fallback
      } else {
        // Use data.databases or empty array as fallback
        setDatabases(data.databases || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch databases');
      setDatabases([]); // Set empty array as fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  // Create database
  const handleCreateDatabase = async () => {
    if (!newDBName.trim()) return;
    
    try {
      const response = await fetch('/api/mongodb/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDBName })
      });
      
      if (response.ok) {
        await fetchDatabases();
        setNewDBName('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to create database');
    }
  };

  // Create collection
  const handleCreateCollection = async () => {
    if (!selectedDB || !newCollectionName.trim()) return;
    
    try {
      const response = await fetch('/api/mongodb/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: selectedDB,
          name: newCollectionName
        })
      });
      
      if (response.ok) {
        await fetchDatabases();
        setNewCollectionName('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to create collection');
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Load data from file
  const handleLoadData = async () => {
    if (!selectedDB || !uploadedFile) return;

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('database', selectedDB);
    formData.append('collection', newCollectionName);

    try {
      const response = await fetch('/api/mongodb/load-data', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        await fetchDatabases();
        setUploadedFile(null);
        setShowModal(false);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load data');
    }
  };

  // Modal component
  const Modal = ({ children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              MongoDB Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage databases, collections, and data
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-1 p-4">
          {['databases', 'create'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'databases' ? (
          <div className="space-y-4">
            {/* Database List Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Database List
              </h3>
              <button
                onClick={fetchDatabases}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 
                         hover:text-gray-900 border rounded-md hover:bg-gray-50"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>

            {/* Database List */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-gray-600 text-center py-4">Loading databases...</div>
              ) : databases.length === 0 ? (
                <div className="bg-gray-50 border rounded-md p-6 text-center">
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No databases found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Switch to the "Create" tab to create your first database
                  </p>
                </div>
              ) : (
                databases.map((db) => (
                  <div key={db.name} className="border rounded-md">
                    <button
                      onClick={() => setExpandedDB(expandedDB === db.name ? null : db.name)}
                      className="w-full px-4 py-3 flex items-center justify-between 
                               hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{db.name}</span>
                      </div>
                      {expandedDB === db.name ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    {/* Collections List */}
                    {expandedDB === db.name && (
                      <div className="border-t bg-gray-50 p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Collections
                        </h4>
                        <div className="space-y-2">
                          {db.collections?.length ? (
                            db.collections.map((collection) => (
                              <div 
                                key={collection.name}
                                className="bg-white p-3 rounded-md border flex items-center justify-between"
                              >
                                <span className="text-sm">{collection.name}</span>
                                <button
                                  onClick={() => {
                                    setModalContent(collection);
                                    setShowModal(true);
                                  }}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">
                              No collections found
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Create Database Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Create Database
                </h3>
                {databases.length === 0 && (
                  <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    First Database
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDBName}
                  onChange={(e) => setNewDBName(e.target.value)}
                  placeholder="Database name"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleCreateDatabase}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white 
                           rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create
                </button>
              </div>
            </div>

            {/* Create Collection Section */}
            {databases.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Create Collection
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedDB || ''}
                    onChange={(e) => setSelectedDB(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Database</option>
                    {databases.map((db) => (
                      <option key={db.name} value={db.name}>
                        {db.name}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateCollection}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md 
                               hover:bg-blue-700 transition-colors"
                    >
                      Create Collection
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center px-4 py-2 border border-gray-300 
                               rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Load Data
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Create a database first to begin adding collections
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal>
          {modalContent ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Collection Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  Path: {modalContent.path}
                </p>
                <pre className="text-sm bg-white p-4 rounded-md border overflow-auto">
                  {JSON.stringify(modalContent.sample, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Load Data
              </h3>
              <p className="text-sm text-gray-600">
                Upload JSON or CSV file to populate the collection
              </p>
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="w-full"
              />
              <button
                onClick={handleLoadData}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md 
                         hover:bg-blue-700 transition-colors"
              >
                Upload and Load
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default MongoPanel; 
