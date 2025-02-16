import React, { useState } from "react";

import { ReactComponent as Logo } from "../../../assets/Tangible-Intelligence-Logo-6Transparent.svg";
import Authentication from "../../../components/shared/Authentication";
import { useAuth } from "../../../context/AuthContext";
import { X } from "lucide-react";
import { authService } from "../../../services/authService";

const TopNavBar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      try {
        console.log(
          "👤 Current auth state before logout:",
          authService.checkAuthState()
        );
        await authService.initiateLogout();
        await logout();
        console.log(
          "👤 Auth state after logout:",
          authService.checkAuthState()
        );
      } catch (error) {
        console.error("Logout process failed:", error);
      }
    } else {
      console.log(
        "👤 Opening login modal, current auth state:",
        authService.checkAuthState()
      );
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div className="w-full flex justify-between bg-royalBlue items-center">
        <div className="w-64 px-6 py-3">
          <Logo height="40" />
        </div>
        {/* Auth Button */}
        <button
          onClick={handleAuthClick}
          className="m-4 px-3 py-[6px] bg-stone-50 hover:bg-stone-100 text-gray-medium
             rounded-md 
                    flex items-center justify-center gap-2 transition-colors duration-200
                    shadow-sm hover:shadow-md"
        >
          {isAuthenticated ? (
            <span className="text-base">Logout</span>
          ) : (
            <span className="text-base">Login</span>
          )}
        </button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg w-full max-w-md m-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <Authentication
              onSuccess={() => {
                setShowLoginModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavBar;
