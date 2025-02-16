// src/pages/menusections/mainsidebar/MainSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigationConfig } from "../../../config/navigation";
import { useConfig } from "../../../context/ConfigContext";
import { ChevronRight } from "lucide-react";
import { useSidebar } from "../../../context/SidebarContext"; // Add this

const MainSidebar = () => {
  // Remove onSidebarChange prop
  const [expandedSection, setExpandedSection] = useState(null);
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const { customerType, config } = useConfig();
  const { setActiveSidebar } = useSidebar(); // Add this

  const getItemLabel = (item) => {
    console.log("Getting label for item:", item);
    console.log("Customer type:", customerType);
    console.log("Current config:", config);

    if (item.useConfigLabel) {
      if (config?.menu_config) {
        if (item.id === "companyreport") {
          return config.menu_config.briefing_room_text;
        }
        if (item.id === "houseapps") {
          return config.menu_config.applications_dock_text;
        }
      }

      const companyName = config?.company_name || "Hawkeye";
      if (item.id === "companyreport") {
        return `${companyName} Briefing Room`;
      }
      if (item.id === "houseapps") {
        return `${companyName} Applications Dock`;
      }
    }
    return item.label;
  };

  const handleMainNavigation = (item) => {
    setActiveItem(item.id);

    console.log("🎯 Main Navigation:", {
      id: item.id,
      level: "main",
      type: item.type,
      route: item.route,
      hasSubmenu: item.hasSubmenu,
    });

    if (item.hasSubmenu) {
      console.log("📂 Toggling main menu section:", item.id);
      setExpandedSection((prev) => (prev === item.id ? null : item.id));
      return;
    }

    console.log("🚀 Transitioning to section:", item.id);

    if (item.route) {
      console.log("📍 Navigating to route:", item.route);
      navigate(`/${item.route}`);
    }

    // Use context instead of prop
    console.log("🔄 MainSidebar: Setting sidebar to:", item.id);
    setActiveSidebar(item.id);
  };

  if (!navigationConfig.mainItems) {
    console.warn("⚠️ No navigation config found");
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-sidebarDark text-ivory shadow-sidebar relative">
      <nav className="overflow-y-auto mt-[24px]">
        {navigationConfig.mainItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleMainNavigation(item)}
              className={`w-full px-6 py-2 flex items-center justify-between 
                  hover:bg-gray-light transition-colors text-lg group
                  ${
                    activeItem === item.id ? "bg-[var(--sidebar-active)]" : ""
                  }`}
            >
              <div className="flex items-center gap-3 text-gray-medium">
                {item.icon && (
                  <svg className="w-5 h-5 fill-current">
                    <use href={`#icon-${item.icon}`} />
                  </svg>
                )}
                <div className="text-start">{getItemLabel(item)}</div>
              </div>
              {item.hasSubmenu && (
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-200 ${
                    expandedSection === item.id ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            {item.hasSubmenu && expandedSection === item.id && (
              <div className="bg-navyBlue">
                {item.submenuItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() =>
                      handleMainNavigation({ ...subItem, level: "main" })
                    }
                    className="w-full pl-14 py-2 text-left hover:bg-gray-light text-sm transition-colors"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MainSidebar;
