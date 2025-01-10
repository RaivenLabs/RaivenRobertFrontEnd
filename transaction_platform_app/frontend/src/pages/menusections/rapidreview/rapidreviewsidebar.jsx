import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rapidreviewConfig } from '../../../config/sectionNavigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const RapidReviewSidebar = ({ onSidebarChange }) => {
 const navigate = useNavigate();
 const [expandedSection, setExpandedSection] = useState(null);

 const handleSectionNavigation = (item) => {
   console.log('🎯 Section Navigation:', {
     id: item.id,
     level: 'section',
     type: item.type,
     route: item.route
   });

   if (item.hasSubmenu) {
     console.log('📂 Toggling section menu:', item.id);
     setExpandedSection(prev => prev === item.id ? null : item.id);
     return;
   }

   // Navigate to application
   if (item.route) {
     console.log('🚀 Navigating to application:', item.route);
     navigate(`/${item.route}`);
   }
 };

 const handleReturn = () => {
   console.log('⬅️ Returning to main menu');
   onSidebarChange('main');
   navigate('/');
 };

 return (
   <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
     <div className="mb-6">
       <div className="text-2xl font-bold text-cyan mb-2 p-6">
         Application Suite & Solutions
       </div>
       <div className="w-full h-[2px] bg-[rgb(229,241,241)] mt-[5px] mb-[15px] shadow-[0_0_8px_rgb(229,241,241)]" />
     </div>

     <div className="flex-1 overflow-y-auto">
       {/* Section menu items */}
       {rapidreviewConfig.sectionItems.map((item) => (
         <div key={item.id}>
           <button
             onClick={() => handleSectionNavigation(item)}
             className="w-full px-6 py-3 flex items-center justify-between hover:bg-royalBlue-hover text-left transition-colors text-xl"
           >
             <div className="flex items-center gap-3">
               {item.icon && (
                 <svg className="w-5 h-5 text-ivory fill-current">
                   <use href={`#icon-${item.icon}`} />
                 </svg>
               )}
               <span>{item.label}</span>
             </div>
             {item.hasSubmenu && (
               <ChevronRight 
                 className={`w-5 h-5 transition-transform duration-200 ${
                   expandedSection === item.id ? 'rotate-90' : ''
                 }`}
               />
             )}
           </button>

           {item.hasSubmenu && expandedSection === item.id && (
             <div className="bg-navyBlue">
               {item.submenuItems.map((subItem) => (
                 <button
                   key={subItem.id}
                   onClick={() => handleSectionNavigation({...subItem, level: 'section'})}
                   className="w-full pl-14 py-2 text-left hover:bg-royalBlue-hover text-sm transition-colors"
                 >
                   {subItem.label}
                 </button>
               ))}
             </div>
           )}
         </div>
       ))}

       {/* Main Menu button */}
       <div className="mt-4 border-t border-gray-700">
         <button
           onClick={handleReturn}
           className="w-full px-6 py-3 flex items-center gap-3 hover:bg-royalBlue-hover text-left transition-colors text-xl"
         >
           <ArrowLeft className="w-5 h-5 text-ivory" />
           <span>Main Menu</span>
         </button>
       </div>
     </div>

     <div className="mt-auto border-t border-gray-700">
       <p className="text-cyan mb-2 p-6">Powered by Tangible Intelligence</p>
     </div>
   </div>
 );
};

export default RapidReviewSidebar;
