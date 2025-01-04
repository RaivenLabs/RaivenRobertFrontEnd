// src/components/shared/ReturnButton/index.jsx
import React from 'react';

const ReturnButton = ({ onReturn }) => (
  <button
    onClick={onReturn}
    className="absolute top-0 right-0 m-6 flex items-center gap-2 text-sm text-cyan hover:text-blue-400 transition-colors"
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
    Return to Main Menu
  </button>
);

export default ReturnButton;
