import React, { useState } from 'react';
import DashboardHeader from './components/Dashboard/DashboardHeader';
import FilterPanel from './components/Dashboard/FilterPanel';
import MetricsPanel from './components/Dashboard/MetricsPanel';
import TabNavigation from './components/Dashboard/TabNavigation';
import TableHeader from './components/Dashboard/TableHeader';
import OrderTable from './components/Table/OrderTable';
import Pagination from './components/Table/Pagination';
import { getFilteredOrders } from './utils/filterUtils';
import { calculateSummaryMetrics } from './utils/dataCalculations';
import LoadingIndicator from './ui/LoadingIndicator';

const ModelDashboard = ({ 
  data, loading, error, onUpdateOrder, onDeleteOrder, onCreateOrder, onRefreshData 
}) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [filterValues, setFilterValues] = useState({
    search: '', provider: '', status: '', resourceRole: '', fiscalYear: ''
  });
  
  const serviceOrders = data?.serviceOrders || [];
  const filteredOrders = getFilteredOrders(serviceOrders, filterValues);
  const metrics = calculateSummaryMetrics(filteredOrders);
  
  // Event handlers
  const handleFilterChange = (e) => {/* ... */};
  const resetFilters = () => {/* ... */};
  const toggleOrder = (id) => {/* ... */};
  
  // Render the component
  return (
    <div className="bg-gray-100 rounded-lg shadow-md">
      <DashboardHeader />
      <FilterPanel 
        filterValues={filterValues} 
        onFilterChange={handleFilterChange} 
        onReset={resetFilters} 
      />
      <MetricsPanel metrics={metrics} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <TableHeader 
        count={filteredOrders.length} 
        onRefresh={onRefreshData} 
        onNewOrder={onCreateOrder} 
      />
      {loading && serviceOrders.length > 0 && <LoadingIndicator />}
      <OrderTable 
        orders={filteredOrders} 
        activeOrder={activeOrder} 
        onToggleOrder={toggleOrder}
        onUpdateOrder={onUpdateOrder}
        onDeleteOrder={onDeleteOrder}
        error={error}
      />
      {filteredOrders.length > 0 && <Pagination count={filteredOrders.length} />}
    </div>
  );
};

export default ModelDashboard;
