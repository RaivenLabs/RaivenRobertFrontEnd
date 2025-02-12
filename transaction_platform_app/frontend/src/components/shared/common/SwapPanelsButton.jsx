import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

const SwapPanelsButton = ({ onSwap }) => (
  <button
    onClick={onSwap}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
      bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
    title="Swap panels"
  >
    <ArrowLeftRight className="w-5 h-5 text-gray-600" />
  </button>
);

export default SwapPanelsButton;
