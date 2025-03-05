// src/pages/menusections/landed/features/LogBook.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Clock, AlertCircle } from 'lucide-react';

const eventTypes = {
  NEW_ORDER: {
    label: 'New Order',
    color: 'bg-green-100 text-green-800',
    icon: Tag
  },
  AMENDMENT: {
    label: 'Amendment',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock
  },
  POLICY_UPDATE: {
    label: 'Policy Update',
    color: 'bg-purple-100 text-purple-800',
    icon: AlertCircle
  }
};

const LogEntry = ({ entry }) => {
  const eventType = eventTypes[entry.type];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`${eventType.color} p-2 rounded-lg mr-4`}>
            <eventType.icon size={20} />
          </div>
          <div>
            <h3 className="font-medium text-lg">{entry.title}</h3>
            <p className="text-gray-600">{entry.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">{entry.date}</div>
          <div className="text-sm text-gray-600">{entry.initiator}</div>
        </div>
      </div>
      
      <div className="mt-3 flex gap-2">
        {entry.tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 text-sm">
        <span className="text-gray-600">Agreement Family: </span>
        <span className="font-medium">{entry.agreementFamily}</span>
      </div>
    </div>
  );
};

const LogBook = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [filterFamily, setFilterFamily] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - replace with actual API call
  useEffect(() => {
    const sampleEntries = [
      {
        id: 1,
        type: 'NEW_ORDER',
        title: 'New Service Order: Cloud Infrastructure',
        description: 'Added SOW for additional cloud services under Microsoft Azure MSA',
        date: '2024-01-02',
        initiator: 'John Smith',
        tags: ['Cloud Services', 'Azure', 'Infrastructure'],
        agreementFamily: 'Microsoft MSA'
      },
      {
        id: 2,
        type: 'AMENDMENT',
        title: 'Payment Terms Update',
        description: 'Updated payment terms to NET-60 across all active orders',
        date: '2024-01-01',
        initiator: 'Sarah Johnson',
        tags: ['Payment Terms', 'Policy Change'],
        agreementFamily: 'Adobe MSA'
      },
      {
        id: 3,
        type: 'POLICY_UPDATE',
        title: 'GDPR Compliance Update',
        description: 'Updated data processing terms for EU regulations',
        date: '2023-12-30',
        initiator: 'Legal Department',
        tags: ['Compliance', 'GDPR', 'Data Privacy'],
        agreementFamily: 'Salesforce MSA'
      }
    ];

    setLogEntries(sampleEntries);
  }, []);

  const filteredEntries = logEntries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = filterFamily === '' || entry.agreementFamily === filterFamily;
    const matchesType = filterType === '' || entry.type === filterType;
    return matchesSearch && matchesFamily && matchesType;
  });

  const uniqueFamilies = [...new Set(logEntries.map(entry => entry.agreementFamily))];

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Agreement Family LogBook</h1>
        <p className="text-gray-600">Track changes and updates across agreement families</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search logs..."
          className="px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-4 py-2 border rounded-lg"
          value={filterFamily}
          onChange={(e) => setFilterFamily(e.target.value)}
        >
          <option value="">All Agreement Families</option>
          {uniqueFamilies.map(family => (
            <option key={family} value={family}>{family}</option>
          ))}
        </select>

        <select
          className="px-4 py-2 border rounded-lg"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Event Types</option>
          {Object.entries(eventTypes).map(([key, value]) => (
            <option key={key} value={key}>{value.label}</option>
          ))}
        </select>
      </div>

      {/* Log Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No log entries match your filters
          </div>
        ) : (
          filteredEntries.map(entry => (
            <LogEntry key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
};

export default LogBook;
