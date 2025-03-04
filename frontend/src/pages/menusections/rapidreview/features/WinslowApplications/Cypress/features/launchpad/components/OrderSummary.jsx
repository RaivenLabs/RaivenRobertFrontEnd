import React, { useState } from 'react';

const OrderSummary = ({ orderData, contacts, onSendPackage }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [customEmail, setCustomEmail] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Toggle contact selection
  const toggleContactSelection = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };
  
  // Get email addresses from selected contacts
  const getSelectedEmails = () => {
    const emails = contacts
      .filter(contact => selectedContacts.includes(contact.id))
      .map(contact => contact.email);
      
    if (customEmail.trim() !== '') {
      emails.push(customEmail);
    }
    
    return emails;
  };
  
  // Handle send button click
  const handleSend = async () => {
    if (isApproved && getSelectedEmails().length > 0) {
      setIsSending(true);
      await onSendPackage(getSelectedEmails());
      setIsSending(false);
    } else if (!isApproved) {
      alert('Please approve the order before sending.');
    } else {
      alert('Please select at least one recipient.');
    }
  };
  
  // Format currency amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate the total duration of the order (for display)
  const calculateTotalDuration = () => {
    if (orderData.roles.length === 0) return '0 days';
    
    // Find earliest start date and latest end date
    const startDates = orderData.roles.map(role => new Date(role.startDate));
    const endDates = orderData.roles.map(role => new Date(role.endDate));
    
    const earliestStart = new Date(Math.min(...startDates));
    const latestEnd = new Date(Math.max(...endDates));
    
    const diffTime = Math.abs(latestEnd - earliestStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Order Header */}
      <div className="bg-gray-50 p-6 rounded-t-lg border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order #{orderData.orderNumber}</h2>
            <p className="text-gray-600 mt-1">{orderData.providerName}</p>
            <p className="text-sm text-gray-500 mt-2">
              Master Agreement: {orderData.masterAgreement}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {orderData.status}
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Order Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Financials */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold">{formatCurrency(orderData.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate Card Variance:</span>
                <span className={`font-bold ${orderData.rateCardVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {orderData.rateCardVariance >= 0 ? '+' : ''}{formatCurrency(orderData.rateCardVariance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-bold">{calculateTotalDuration()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Roles:</span>
                <span className="font-bold">{orderData.roles.length}</span>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-4">Project Timeline</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Earliest Start Date:</span>
                <span className="font-bold">
                  {orderData.roles.length > 0 
                    ? new Date(Math.min(...orderData.roles.map(role => new Date(role.startDate))))
                        .toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Latest End Date:</span>
                <span className="font-bold">
                  {orderData.roles.length > 0 
                    ? new Date(Math.max(...orderData.roles.map(role => new Date(role.endDate))))
                        .toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deliverables Count:</span>
                <span className="font-bold">{orderData.deliverables.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Roles Table */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-800 mb-4">Roles and Rates</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderData.roles.map((role, index) => {
                  const duration = calculateDuration(role.startDate, role.endDate);
                  const subtotal = role.rate * duration * 8; // 8 hours/day
                  
                  // This would need the standard rate for comparison
                  const variance = role.standardRate 
                    ? (role.standardRate - role.rate) * duration * 8
                    : 0;
                  
                  return (
                    <tr key={index}>
                      <td className="py-3 px-4">{role.roleName}</td>
                      <td className="py-3 px-4">${role.rate}/hour</td>
                      <td className="py-3 px-4">{new Date(role.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(role.endDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{formatCurrency(subtotal)}</td>
                      <td className="py-3 px-4">
                        <span className={variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="py-3 px-4 text-right font-bold">Total:</td>
                  <td className="py-3 px-4 font-bold">{formatCurrency(orderData.totalAmount)}</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={orderData.rateCardVariance > 0 ? 'text-green-600' : orderData.rateCardVariance < 0 ? 'text-red-600' : 'text-gray-600'}>
                      {orderData.rateCardVariance > 0 ? '+' : ''}{formatCurrency(orderData.rateCardVariance)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Scope of Services */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-800 mb-4">Scope of Services</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="whitespace-pre-line">{orderData.scopeOfServices}</p>
          </div>
        </div>
        
        {/* Deliverables */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-800 mb-4">Deliverables</h3>
          <div className="space-y-3">
            {orderData.deliverables.length > 0 ? (
              orderData.deliverables.map((deliverable, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{deliverable.title}</h4>
                      <p className="text-gray-600 mt-1">{deliverable.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No deliverables specified</p>
            )}
          </div>
        </div>
        
        {/* Order Approval */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="approve-order"
              checked={isApproved}
              onChange={() => setIsApproved(!isApproved)}
              className="h-4 w-4 text-royalBlue focus:ring-royalBlue border-gray-300 rounded"
            />
            <label htmlFor="approve-order" className="ml-2 block text-sm text-gray-700">
              I have reviewed this order and approve it for submission
            </label>
          </div>
        </div>
        
        {/* Recipients Selection */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-800 mb-4">Select Recipients</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContactSelection(contact.id)}
                    className="h-4 w-4 text-royalBlue focus:ring-royalBlue border-gray-300 rounded"
                  />
                  <label htmlFor={`contact-${contact.id}`} className="ml-2 block">
                    <span className="text-sm font-medium text-gray-700">{contact.name}</span>
                    <span className="block text-xs text-gray-500">{contact.email} • {contact.role}</span>
                  </label>
                </div>
              ))}
            </div>
            
            <div>
              <label htmlFor="custom-email" className="block text-sm font-medium text-gray-700 mb-1">
                Add Additional Email
              </label>
              <input
                type="email"
                id="custom-email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="email@example.com"
                className="p-2 border border-gray-300 rounded w-full md:w-72"
              />
            </div>
          </div>
        </div>
        
        {/* Send Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSend}
            disabled={!isApproved || getSelectedEmails().length === 0 || isSending}
            className={`px-6 py-3 rounded font-medium ${
              isApproved && getSelectedEmails().length > 0 && !isSending
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSending ? 'Sending...' : 'Send Order Package'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Calculate duration in days between two dates
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default OrderSummary;
