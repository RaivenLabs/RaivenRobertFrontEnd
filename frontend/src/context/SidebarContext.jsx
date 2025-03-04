// src/context/SidebarContext.jsx
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [activeSidebar, setActiveSidebar] = useState('main');

  const value = {
    activeSidebar,
    setActiveSidebar: (newSidebar) => {
      console.log('🔄 Sidebar Context: Changing sidebar to:', newSidebar);
      setActiveSidebar(newSidebar);
    }
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
