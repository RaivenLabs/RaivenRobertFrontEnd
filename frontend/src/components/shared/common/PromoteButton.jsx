import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Tooltip from './Tooltip';  // We'll need to move Tooltip too if not already done

const PromoteButton = ({ onClick, label, tooltip }) => (
  <Tooltip content={tooltip}>
    <button
      onClick={onClick}
      className="mt-4 px-6 py-3 bg-teal text-white rounded-xl hover:bg-teal/90 
        transition-colors flex items-center justify-center gap-2 w-full"
    >
      <ArrowUpRight className="w-5 h-5" />
      {label}
    </button>
  </Tooltip>
);

export default PromoteButton;
