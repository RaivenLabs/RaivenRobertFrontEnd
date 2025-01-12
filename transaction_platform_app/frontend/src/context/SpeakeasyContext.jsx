// context/SpeakeasyContext.jsx
import React, { createContext, useContext, useState } from 'react';

const SpeakeasyContext = createContext();

export function SpeakeasyProvider({ children }) {
  const [clicks, setClicks] = useState([]);
  const [speakeasyAccess, setSpeakeasyAccess] = useState(false);

  const handleMainMenuClick = () => {
    const now = Date.now();
    setClicks(prevClicks => {
      // Keep only clicks within last 1 second
      const recentClicks = [...prevClicks, now].filter(time => now - time < 1000);
      
      // Check for three clicks
      if (recentClicks.length === 3) {
        setSpeakeasyAccess(true);
        return [];  // Reset clicks
      }
      return recentClicks;
    });
  };

  return (
    <SpeakeasyContext.Provider value={{ handleMainMenuClick, speakeasyAccess }}>
      {children}
    </SpeakeasyContext.Provider>
  );
}

export const useSpeakeasy = () => useContext(SpeakeasyContext);
