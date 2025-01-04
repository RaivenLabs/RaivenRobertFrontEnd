// src/hooks/useSidebarNavigation.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export const useSidebarNavigation = (onSidebarChange) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const navigate = useNavigate();
  const config = useConfig();

  const cleanupStates = () => {
    setIsConsoleOpen(false);
  };

  const getItemLabel = (item) => {
    if (item.useConfigLabel) {
      return config?.menu_config?.applications_dock_text || item.label;
    }
    return item.label;
  };

  const handleNavigation = async (item, isSubmenuItem = false) => {
    try {
      console.log('handleNavigation called with:', {
        item,
        isSubmenuItem,
        currentExpandedSection: expandedSection
      });
  
      // Add detailed logging of the item
      console.log('Item details before submenu check:', {
        itemId: item.id,
        itemHasSubmenu: item.hasSubmenu,
        itemType: item.type,
        fullItem: item,
        hasSubmenuType: typeof item.hasSubmenu
      });
  
      // Handle submenu toggling - just check hasSubmenu
      if (item.hasSubmenu) {
        console.log('INSIDE hasSubmenu condition for:', item.id);
        // ... rest of the code
        console.log('Toggling submenu for:', item.id);
        setExpandedSection(prevSection => 
          prevSection === item.id ? null : item.id
        );
        return; // Don't proceed with other navigation
      }

      // If it's a submenu item or regular item
      cleanupStates();
      
      if (item.type === 'applications-package') {
        setTimeout(() => {
          setIsConsoleOpen(true);
        }, 0);
      } else if (item.type === 'table-reporting' || item.type === 'controlpanelmenu') {
        if (onSidebarChange) {
          await onSidebarChange(item.id);
        }
        navigate(`/${item.id}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      cleanupStates();
    }
  };

  useEffect(() => {
    return () => cleanupStates();
  }, []);

  return {
    expandedSection,
    isConsoleOpen,
    setIsConsoleOpen,
    handleNavigation,
    getItemLabel
  };
};
