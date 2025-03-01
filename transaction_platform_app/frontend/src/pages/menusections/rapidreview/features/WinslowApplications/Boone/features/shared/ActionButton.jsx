// src/components/platform/BooneConfiguration/shared/ActionButton.jsx
import React from 'react';

const ActionButton = ({ onClick, label, icon: Icon, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2
      ${!disabled 
        ? 'bg-royalBlue text-white hover:bg-royalBlue/90' 
        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
  >
    {label}
    <Icon className="w-5 h-5" />
  </button>
);

export default ActionButton;
