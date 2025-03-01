// src/layouts/BaseLayout/index.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/Tangible-Intelligence-Logo-6Transparent.svg';
import Authentication from '../../components/shared/Authentication';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { authService } from '../../services/authService';

import TopNavBar from '../../components/shared/TopNavBar';

// Import sidebars from their respective menusection directories
import MainSidebar from '../../pages/menusections/mainsidebar/mainsidebar';
import ConciergeSidebar from '../../pages/menusections/concierge/conciergesidebar';
import BuildKitsSidebar from '../../pages/menusections/buildkits/buildkitssidebar';
import CompanyReportSidebar from '../../pages/menusections/companyreport/companyreportsidebar';
import InflightSidebar from '../../pages/menusections/inflight/inflightsidebar';
import FlightDeckSidebar from '../../pages/menusections/flightdeck/flightdecksidebar';
import R2D2Sidebar from '../../pages/menusections/r2d2/r2d2sidebar';
import LandedSidebar from '../../pages/menusections/landed/landedsidebar';
import ReadyRoomSidebar from '../../pages/menusections/readyroom/readyroomsidebar';
import ConfigurationSidebar from '../../pages/menusections/configuration/configurationsidebar';
import SandboxSidebar from '../../pages/menusections/sandbox/sandboxsidebar';
import TangibleTeamsSidebar from '../../pages/menusections/tangibleteams/tangibleteamssidebar';
import HouseAppsSidebar from '../../pages/menusections/houseapps/houseappssidebar';
import ExchangeSidebar from '../../pages/menusections/exchange/exchangesidebar';
import SpeakeasySidebar from '../../pages/menusections/speakeasy/speakeasysidebar';
import SettingsSidebar from '../../pages/menusections/settings/settingssidebar';
import AuthenticationSidebar from '../../pages/menusections/authentication/authenticationsidebar';
import SpeakeasyClubSidebar from '../../pages/menusections/speakeasy/applications/speakeasyclub/sidebar';
import RapidReviewSidebar from '../../pages/menusections/rapidreview/rapidreviewsidebar';
import FundSidebar from '../../pages/evershedsapplications/funds/fundsidebar';
import MergerControlSidebar from '../../pages/evershedsapplications/mergercontrol/mergercontrolsidebar';

import DiversitySidebar from '../../pages/evershedsapplications/diversity/diversitysidebar';
import EUCSDDSidebar from '../../pages/evershedsapplications/eucsdd/eucsddsidebar';
import RecruitingSidebar from '../../pages/evershedsapplications/recruiting/recruitingsidebar';

import WinslowSourcingHubSidebar from '../../pages/menusections/rapidreview/features/WinslowApplications/SourcingHub/sourcinghubsidebar';
import WinslowBooneSidebar from '../../pages/menusections/rapidreview/features/WinslowApplications/Boone/boonesidebar';

import WinslowCypressSidebar from '../../pages/menusections/rapidreview/features/WinslowApplications/Cypress/cypresssidebar';

import FinancialServicesSidebar from '../../pages/evershedsapplications/financialservices/financialservicessidebar';

import PaceAidaSidebar from '../../pages/paceapplications/paceaida/paceaidasidebar';

import FinancialServicesSidebar from '../../pages/evershedsapplications/financialservices/financialservicessidebar';
import FlorenceGelatoSidebar from '../../pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/sidebar';
import { useSidebar } from '../../context/SidebarContext';

// Make sure that the id (the "key") in sidebarComponents matches the id in the rapidresponse_json fiel taht feeds the sidebar route:)

const BaseLayout = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const sidebarComponents = {
    main: <MainSidebar onSidebarChange={setActiveSidebar} />,
    concierge: <ConciergeSidebar onSidebarChange={setActiveSidebar} />,
    buildkits: <BuildKitsSidebar onSidebarChange={setActiveSidebar} />,
    companyreport: <CompanyReportSidebar onSidebarChange={setActiveSidebar} />,
    inflight: <InflightSidebar onSidebarChange={setActiveSidebar} />,
    flightdeck: <FlightDeckSidebar onSidebarChange={setActiveSidebar} />,
    r2d2: <R2D2Sidebar onSidebarChange={setActiveSidebar} />,
    landed: <LandedSidebar onSidebarChange={setActiveSidebar} />,
    readyroom: <ReadyRoomSidebar onSidebarChange={setActiveSidebar} />,
    configuration: <ConfigurationSidebar onSidebarChange={setActiveSidebar} />,
    sandboxsidebar: <SandboxSidebar onSidebarChange={setActiveSidebar} />,
    tangibleteams: <TangibleTeamsSidebar onSidebarChange={setActiveSidebar} />,
    houseapps: <HouseAppsSidebar onSidebarChange={setActiveSidebar} />,
    exchange: <ExchangeSidebar onSidebarChange={setActiveSidebar} />,
    speakeasy: <SpeakeasySidebar onSidebarChange={setActiveSidebar} />,
    settings: <SettingsSidebar onSidebarChange={setActiveSidebar} />,
    authentication: (
      <AuthenticationSidebar onSidebarChange={setActiveSidebar} />
    ),
    speakeasyclub: <SpeakeasyClubSidebar onSidebarChange={setActiveSidebar} />,

    sourcinghubsidebar: (
      <WinslowSourcingHubSidebar onSidebarChange={setActiveSidebar} />
    ),
    boonesidebar: <WinslowBooneSidebar onSidebarChange={setActiveSidebar} />,
    cypresssidebar: (
      <WinslowCypressSidebar onSidebarChange={setActiveSidebar} />
    ),
    rapidreview: <RapidReviewSidebar onSidebarChange={setActiveSidebar} />,
    fundsidebar: <FundSidebar onSidebarChange={setActiveSidebar} />,

    mergercontrolsidebar: (
      <MergerControlSidebar onSidebarChange={setActiveSidebar} />
    ),
    nikeraivensidebar: <NIKERaivenSidebar onSidebarChange={setActiveSidebar} />,
    paceaidasidebar: <PaceAidaSidebar onSidebarChange={setActiveSidebar} />,

    financialservicessidebar: (
      <FinancialServicesSidebar onSidebarChange={setActiveSidebar} />
    ),
    diversitysidebar: <DiversitySidebar onSidebarChange={setActiveSidebar} />,
    eucsddsidebar: <EUCSDDSidebar onSidebarChange={setActiveSidebar} />,
    recruitingsidebar: <RecruitingSidebar onSidebarChange={setActiveSidebar} />,

    florencegelato: (
      <FlorenceGelatoSidebar onSidebarChange={setActiveSidebar} />
    ),
  };

  return (
    <div className="min-h-screen">
      <TopNavBar />

      <div className="flex min-h-screen">
        {/* Fixed, full-height sidebar container */}
        <div className="inset-y-0 left-0 w-sidebar">
          {sidebarComponents[activeSidebar] || sidebarComponents.main}
        </div>

        {/* Main content area with proper margin and background */}
        <main className="flex-1 overflow-auto bg-ivory">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
