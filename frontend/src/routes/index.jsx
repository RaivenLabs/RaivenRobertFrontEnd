import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import BaseLayout from '../layouts/BaseLayout';

// Section Sidebars
import SpeakeasySidebar from '../pages/menusections/speakeasy/speakeasysidebar';
import ConciergeSidebar from '../pages/menusections/concierge/conciergesidebar';
import BuildKitsSidebar from '../pages/menusections/buildkits/buildkitssidebar';
import CompanyReportSidebar from '../pages/menusections/companyreport/companyreportsidebar';
import InflightSidebar from '../pages/menusections/inflight/inflightsidebar';
import FlightDeckSidebar from '../pages/menusections/flightdeck/flightdecksidebar';
import R2D2Sidebar from '../pages/menusections/r2d2/r2d2sidebar';
import LandedSidebar from '../pages/menusections/landed/landedsidebar';
import ReadyRoomSidebar from '../pages/menusections/readyroom/readyroomsidebar';
import ConfigurationSidebar from '../pages/menusections/configuration/configurationsidebar';
import SandboxSidebar from '../pages/menusections/sandbox/sandboxsidebar';
import TangibleTeamsSidebar from '../pages/menusections/tangibleteams/tangibleteamssidebar';
import HouseAppsSidebar from '../pages/menusections/houseapps/houseappssidebar';
import ExchangeSidebar from '../pages/menusections/exchange/exchangesidebar';
import SettingsSidebar from '../pages/menusections/settings/settingssidebar';
import AuthenticationSidebar from '../pages/menusections/authentication/authenticationsidebar';

// Speakeasy Club Features
import Dashboard from '../pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard';
import Members from '../pages/menusections/speakeasy/applications/speakeasyclub/features/Members';
import Events from '../pages/menusections/speakeasy/applications/speakeasyclub/features/Events';
import Settings from '../pages/menusections/speakeasy/applications/speakeasyclub/features/Settings';

// Applications
import SpeakeasyClubSidebar from '../pages/menusections/speakeasy/applications/speakeasyclub/sidebar';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route element={<BaseLayout />}>
        {/* Remove the leading slash as these are nested routes */}
        <Route path="concierge/*" element={<ConciergeSidebar />} />
        <Route path="buildkits/*" element={<BuildKitsSidebar />} />
        <Route path="companyreport/*" element={<CompanyReportSidebar />} />
        <Route path="inflight/*" element={<InflightSidebar />} />
        <Route path="flightdeck/*" element={<FlightDeckSidebar />} />
        <Route path="r2d2/*" element={<R2D2Sidebar />} />
        <Route path="landed/*" element={<LandedSidebar />} />
        <Route path="readyroom/*" element={<ReadyRoomSidebar />} />
        <Route path="configuration/*" element={<ConfigurationSidebar />} />
        <Route path="sandbox/*" element={<SandboxSidebar />} />
        <Route path="tangibleteams/*" element={<TangibleTeamsSidebar />} />
        <Route path="houseapps/*" element={<HouseAppsSidebar />} />
        <Route path="exchange/*" element={<ExchangeSidebar />} />
        <Route path="settings/*" element={<SettingsSidebar />} />
        <Route path="authentication/*" element={<AuthenticationSidebar />} />

        {/* Speakeasy Section */}
        <Route path="speakeasy/*" element={<SpeakeasySidebar />} />

        {/* Speakeasy Club Application - Remove leading slash */}
        <Route path="speakeasyclub" element={<SpeakeasyClubSidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="groupapplications" element={<Dashboard />} />
          <Route path="myapps" element={<Members />} />
          <Route path="membersonly" element={<Events />} />
          <Route path="prototypes" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
