import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  BarChart2,
  Inbox,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import './financedesk.css';

// Billing Review Modal
const BillingReviewModal = ({ isOpen, onClose, billingData, onApprove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Billing Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{billingData.client}</h3>
              <p className="text-sm text-gray-600">Matter: {billingData.matter}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${billingData.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{billingData.hours} hours</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Time Entries</h4>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Timekeeper</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Hours</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billingData.entries?.map((entry, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2">{entry.date}</td>
                    <td>{entry.timekeeper}</td>
                    <td className="max-w-md truncate">{entry.description}</td>
                    <td className="text-right">{entry.hours}</td>
                    <td className="text-right">${entry.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApprove(billingData.id);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Approve for Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceDesk = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  // Mock data - replace with API calls
  const financialMetrics = {
    pendingBilling: 245750.50,
    outstandingAR: 567890.25,
    mtdCollections: 398450.75,
    ytdCollections: 2456789.50,
    averageDaysToPay: 32,
    utilizationRate: 85.5,
    realization: 92.3,
    pendingPayments: 78500.25
  };

  const billingItems = [
    {
      id: 1,
      client: 'Fortune 500 Corp',
      matter: 'Oracle License Amendment',
      status: 'pending',
      amount: 12500.75,
      hours: 42.5,
      date: '2024-02-01',
      entries: [
        {
          date: '2024-01-15',
          timekeeper: 'John Smith',
          description: 'Review and revise license agreement terms',
          hours: 3.5,
          amount: 1225.00
        },
        {
          date: '2024-01-16',
          timekeeper: 'Sarah Johnson',
          description: 'Client meeting to discuss amendments',
          hours: 2.0,
          amount: 700.00
        }
      ]
    },
    // Add more mock data as needed
  ];

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const handleBillingApproval = async (billingId) => {
    try {
      const response = await fetch('/api/billing/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingId })
      });
      
      if (!response.ok) throw new Error('Failed to approve billing');
      
      showAlert('success', 'Billing approved successfully');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  return (
    <div className="p-4">
      {alertInfo && (
        <div className={`alert alert-${alertInfo.type}`}>
          {alertInfo.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> : 
           <CheckCircle className="h-5 w-5 mr-2" />}
          {alertInfo.message}
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Billing</h3>
            <DollarSign className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${financialMetrics.pendingBilling.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Needs review and processing
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Outstanding AR</h3>
            <CreditCard className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${financialMetrics.outstandingAR.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Average {financialMetrics.averageDaysToPay} days to pay
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">MTD Collections</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${financialMetrics.mtdCollections.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            YTD: ${financialMetrics.ytdCollections.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
            <BarChart2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Utilization</span>
              <span className="font-semibold">{financialMetrics.utilizationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Realization</span>
              <span className="font-semibold">{financialMetrics.realization}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'pending' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending Billing
              </button>
              <button
                onClick={() => setActiveTab('invoiced')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'invoiced' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Invoiced
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'payments' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'reports' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Reports
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Clients</option>
                <option value="client1">Fortune 500 Corp</option>
                <option value="client2">Tech Startup Inc</option>
              </select>

              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="30">Last 30 Days</option>
                <option value="90">Last Quarter</option>
                <option value="365">Last Year</option>
              </select>

              <button className="action-button">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client/Matter</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <div className="font-medium">{item.client}</div>
                      <div className="text-sm text-gray-600">{item.matter}</div>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.hours}</td>
                  <td>${item.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-indicator ${
                      item.status === 'pending' ? 'status-pending' :
                      item.status === 'approved' ? 'status-confirmed' :
                      'status-rejected'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedBilling(item);
                        setShowBillingModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BillingReviewModal
        isOpen={showBillingModal}
        onClose={() => {
          setShowBillingModal(false);
          setSelectedBilling(null);
        }}
        billingData={selectedBilling}
        onApprove={handleBillingApproval}
      />
    </div>
  );
};

export default FinanceDesk;
