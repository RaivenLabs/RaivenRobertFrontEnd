// components/MainMenuEasterEgg.jsx
import React from 'react';
import { useSpeakeasy } from '../../../context/SpeakeasyContext';

export const MainMenuEasterEgg = ({ children }) => {
  const { handleMainMenuClick } = useSpeakeasy();
  
  return (
    <div onClick={handleMainMenuClick}>
      {children}
    </div>
  );
};


