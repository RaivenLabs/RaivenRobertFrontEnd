// src/pages/menusections/landed/features/AgreementTree.jsx
import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '../../../../utils/api/api';  // Add this import
import { ChevronRight, ChevronDown, Search, Filter } from 'lucide-react';

// Define categoryColors at the top level
const categoryColors = {
  MSA: 'bg-blue-100 border-blue-500',
  LICENSE: 'bg-green-100 border-green-500',
  SAAS: 'bg-purple-100 border-purple-500',
  CSA: 'bg-orange-100 border-orange-500',
  ERP: 'bg-yellow-100 border-yellow-500',
  NETWORK: 'bg-red-100 border-red-500',
  HARDWARE: 'bg-gray-100 border-gray-500'
};

const FamilyTreeDiagram = ({ selectedAgreement, familyData }) => {
  if (!selectedAgreement) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select an agreement to view its family tree
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-royal-blue">
          Family Tree: {selectedAgreement.title}
        </h3>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Parent Agreement */}
        <div className="w-64 p-3 mb-4 bg-blue-100 border-2 border-blue-500 rounded-lg text-center">
          <div className="font-medium">{selectedAgreement.title}</div>
          <div className="text-sm text-gray-600">{selectedAgreement.agreement_id}</div>
        </div>

        {/* Connection Lines */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* Children and Amendments */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Amendments</h4>
            {familyData?.amendments?.map(amendment => (
              <div 
                key={amendment.agreement_id}
                className="p-2 mb-2 bg-green-100 border border-green-500 rounded-lg text-sm"
              >
                {amendment.title}
              </div>
            ))}
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Orders</h4>
            {familyData?.children?.map(child => (
              <div 
                key={child.agreement_id}
                className="p-2 mb-2 bg-purple-100 border border-purple-500 rounded-lg text-sm"
              >
                {child.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AgreementNode = ({ agreement, children, level = 0, onSelect, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children && children.length > 0;
  const indentClass = `ml-${level * 6}`;
  const categoryColor = categoryColors[agreement.taxonomy_category] || 'bg-gray-100 border-gray-500';

  return (
    <div className={`mb-2 ${indentClass}`}>
      <div 
        className={`flex items-center p-3 rounded-lg border-l-4 ${categoryColor} 
          hover:shadow-md transition-shadow w-72 cursor-pointer
          ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => onSelect(agreement)}
      >
        {hasChildren && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }} 
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{agreement.title}</span>
            <span className="text-sm text-gray-600">{agreement.counterparty}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <span className="mr-4">ID: {agreement.agreement_id}</span>
            <span>{agreement.status}</span>
          </div>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

const AgreementTree = () => {
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [selectedFamilyData, setSelectedFamilyData] = useState({ amendments: [], children: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const data = await fetchFromAPI('/api/sampleagreementdata');
        setAgreements(data.agreements);
      } catch (error) {
        console.error('Error loading agreements:', error);
        // You might want to add error state handling here if you have it
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAgreements();
  }, []);

  

  const buildTree = (agreements) => {
    const agreementMap = new Map();
    const roots = [];

    // First pass: Create map of all agreements
    agreements.forEach(agreement => {
      agreementMap.set(agreement.agreement_id, {
        ...agreement,
        children: [],
        amendments: []
      });
    });

    // Second pass: Build relationships
    agreements.forEach(agreement => {
      if (agreement.family_role === 'child') {
        const parentId = agreement.agreement_id.split('(')[1].replace(')', '');
        const parent = agreementMap.get(parentId);
        if (parent) {
          parent.children.push(agreementMap.get(agreement.agreement_id));
        }
      } else if (agreement.family_role === 'amends') {
        const parentId = agreement.amends_id;
        const parent = agreementMap.get(parentId);
        if (parent) {
          parent.amendments.push(agreementMap.get(agreement.agreement_id));
        }
      } else if (agreement.family_role === 'parent') {
        roots.push(agreementMap.get(agreement.agreement_id));
      }
    });

    return roots;
  };

  const renderTree = (nodes) => {
    return nodes.map(node => (
      <AgreementNode 
        key={node.agreement_id} 
        agreement={node}
        onSelect={handleAgreementSelect}
        isSelected={selectedAgreement?.agreement_id === node.agreement_id}
      >
        {node.amendments.map(amendment => (
          <AgreementNode 
            key={amendment.agreement_id}
            agreement={amendment}
            level={1}
            onSelect={handleAgreementSelect}
            isSelected={selectedAgreement?.agreement_id === amendment.agreement_id}
          />
        ))}
        {node.children.map(child => (
          <AgreementNode 
            key={child.agreement_id}
            agreement={child}
            level={1}
            onSelect={handleAgreementSelect}
            isSelected={selectedAgreement?.agreement_id === child.agreement_id}
          />
        ))}
      </AgreementNode>
    ));
  };

  const handleAgreementSelect = (agreement) => {
    setSelectedAgreement(agreement);
    const familyData = {
      amendments: agreements.filter(a => 
        a.family_role === 'amends' && a.amends_id === agreement.agreement_id
      ),
      children: agreements.filter(a => 
        a.family_role === 'child' && a.agreement_id.includes(`(${agreement.agreement_id})`)
      )
    };
    setSelectedFamilyData(familyData);
  };

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = searchTerm === '' || 
      Object.values(agreement).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory = filterCategory === '' || 
      agreement.taxonomy_category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const treeData = buildTree(filteredAgreements);

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search agreements..."
            className="flex-1 px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {Object.keys(categoryColors).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Split View Container */}
      <div className="flex gap-6">
        {/* Agreement List Panel */}
        <div className="w-96 bg-white rounded-lg shadow-lg p-6 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {renderTree(treeData)}
            </div>
          )}
        </div>

        {/* Family Tree Visualization Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-lg" style={{ height: 'calc(100vh - 200px)' }}>
          <FamilyTreeDiagram 
            selectedAgreement={selectedAgreement}
            familyData={selectedFamilyData}
          />
        </div>
      </div>
    </div>
  );
};

export default AgreementTree;
