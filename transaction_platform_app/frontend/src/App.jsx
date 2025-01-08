import React from 'react';
import './styles/base/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { AuthProvider } from './context/AuthContext';
import BaseLayout from './layouts/BaseLayout';
import WelcomePage from './pages/WelcomePage';

// Main section imports
import CompanyReport from './pages/menusections/companyreport';
import PlatformTour from './pages/menusections/platformtour';
import Concierge from './pages/menusections/concierge';
import RapidResponse from './pages/menusections/rapidreview';
import Inflight from './pages/menusections/inflight';

import BuildKitsOverview from './pages/menusections/buildkits';
import InsightsOverview from './pages/menusections/r2d2';
import Landed from './pages/menusections/landed';
import ReadyRoom from './pages/menusections/readyroom';
import Configuration from './pages/menusections/configuration';
import Sandbox from './pages/menusections/sandbox';
import FlightDeckContent from './pages/menusections/flightdeck';
import TangibleTeamsOverview from './pages/menusections/tangibleteams';
import HouseApps from './pages/menusections/houseapps';
import Exchange from './pages/menusections/exchange';
import Speakeasy from './pages/menusections/speakeasy';
import Settings from './pages/menusections/settings';
import Authentication from './pages/menusections/authentication';

// Add this with the other imports
import SpeakeasyClubIndex from './pages/menusections/speakeasy/applications/speakeasyclub/index';

// Speakeasy Club application imports
import SpeakeasyClubDashboard from './pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard';
import SpeakeasyClubMembers from './pages/menusections/speakeasy/applications/speakeasyclub/features/Members';
import SpeakeasyClubEvents from './pages/menusections/speakeasy/applications/speakeasyclub/features/Events';
import SpeakeasyClubSettings from './pages/menusections/speakeasy/applications/speakeasyclub/features/Settings';

//Inflight Dashboard imports
// In App.jsx
import Dashboard from './pages/menusections/inflight/features/Dashboard';

//Flight Deck Imports

import FlightDeckDashboard from './pages/menusections/flightdeck/features/Dashboard';

//LandedImports
import { 
  AgreementTree, 
  LandedLogBook, 
  LandedDashboard 
} from './pages/menusections/landed/features';


//Configuration Import

import PlatformConfiguration from './pages/menusections/configuration/features/PlatformConfiguration';

//Company Report Import

import CompanyResources from './pages/menusections/companyreport/features/CompanyResources';

//Rapid Response Imports
import TangibleInside from './pages/menusections/rapidreview/features/TangibleInside';
import PartnerApplications from './pages/menusections/rapidreview/features/PartnerApplications';
import IndustryApplications from './pages/menusections/rapidreview/features/IndustryApplications';
import EnterpriseApplications from './pages/menusections/rapidreview/features/EnterpriseApplications';
import RapidPrototyping from './pages/menusections/rapidreview/features/Sandbox';




//Authentication Imports
import AuthenticationConfiguration from './pages/menusections/authentication/features/AuthenticationConfiguration';
import ResetPassword from './pages/menusections/authentication/features/ResetPassword';

//House Apps Imports
import HouseApplicationsDock from './pages/menusections/houseapps/features/HouseApplicationsDock';
import MyHouseApplications from './pages/menusections/houseapps/features/MyHouseApplications';

//Tangible Team Imports

import TeamMembers from './pages/menusections/tangibleteams/features/TeamMembers';

//Build Kits Imports

import BuildKitApplications from './pages/menusections/buildkits/features/BuildKitApplicationGroup';

//Insights Imports

import InsightProgramApplications from './pages/menusections/r2d2/features/InsightPrograms';
import MyInsightApplications from './pages/menusections/r2d2/features/MyInsightPrograms';





// Florence Gelato feature imports
import FlorenceGelatoIndex from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato';
import FlorenceGelatoOverview from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Overview';
import FlorenceGelatoLaunch from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Launch';
import FlorenceGelatoInflight from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Inflight';
import FlorenceGelatoPortfolio from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Portfolio';

function App() {
  
    return (
      <AuthProvider>
         
      <ConfigProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<WelcomePage />} />
           
            <Route path="platformtour" element={<PlatformTour />} />
            <Route path="concierge" element={<Concierge />} />
            <Route path="rapidreview" element={<RapidResponse />} />
            <Route path="inflight" element={<Inflight />} />
            <Route path="buildkits" element={<BuildKitsOverview />} />
            <Route path="r2d2" element={<InsightsOverview />} />
            <Route path="landed" element={<Landed />} />
            <Route path="readyroom" element={<ReadyRoom />} />
         
            <Route path="sandbox" element={<Sandbox />} />
            <Route path="flightdeck" element={<FlightDeckContent />} />
            <Route path="tangibleteams" element={<TangibleTeamsOverview />} />
            <Route path="houseapps" element={<HouseApps />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="speakeasy" element={<Speakeasy />} />
            <Route path="settings" element={<Settings />} />
            
            <Route path="speakeasyclub" element={<SpeakeasyClubIndex />} />
            <Route path="authentication" element={<Authentication />} />
           

            {/* Speakeasy Club routes as top-level routes */}
            <Route path="speakeasyclub/applicationpanel" element={<SpeakeasyClubDashboard />} />
            <Route path="speakeasyclub/builds" element={<SpeakeasyClubMembers />} />
            <Route path="speakeasyclub/prototypes" element={<SpeakeasyClubEvents />} />
            <Route path="speakeasyclub/features" element={<SpeakeasyClubSettings />} />

          
            {/* Florence Gelato routes - complete set */}
<Route path="speakeasyclub/applicationgroups/florencegelato" element={<FlorenceGelatoIndex />} />
<Route path="speakeasyclub/applicationgroups/florencegelato/overview" element={<FlorenceGelatoOverview />} />
<Route path="speakeasyclub/applicationgroups/florencegelato/launch" element={<FlorenceGelatoLaunch />} />
<Route path="speakeasyclub/applicationgroups/florencegelato/inflight" element={<FlorenceGelatoInflight />} />
<Route path="speakeasyclub/applicationgroups/florencegelato/portfolio" element={<FlorenceGelatoPortfolio />} />

 {/* Inflight routes as top-level routes */}

 <Route path="inflight/overview" element={<Inflight />} />  

 <Route path="inflight/dashboard" element={<Dashboard />} />

 {/* FlightDeck routes as top-level routes */}
 <Route path="flightdeck/overview" element={<FlightDeckContent />} />
  <Route path="flightdeck/dashboard" element={<FlightDeckDashboard />} />

 {/* FlightDeck routes as top-level routes */}
  <Route path="landed" element={<Landed />} />
<Route path="landed/dashboard" element={<LandedDashboard />} />
<Route path="landed/agreementtrees" element={<AgreementTree />} />
<Route path="landed/logbook" element={<LandedLogBook />} />

 {/* Configuration routes as top-level routes */}
 <Route path="configuration" element={<Configuration />} />
              <Route path="configuration/overview" element={<Configuration />} />
              <Route path="configuration/platformconfiguration" element={<PlatformConfiguration />} />


<Route path="companyreport" element={<CompanyReport />} />
<Route path="companyreport/overview" element={<CompanyReport />} />
<Route path="companyreport/resources" element={<CompanyResources />} />

<Route path="rapidresponse" element={<RapidResponse />} />
<Route path="rapidresponse/overview" element={<RapidResponse />} />
<Route path="rapidresponse/tangibleinside" element={<TangibleInside />} />
<Route path="rapidresponse/enterpriseapplications" element={<EnterpriseApplications />} />
<Route path="rapidresponse/industryapplications" element={<IndustryApplications />} />
<Route path="rapidresponse/partnerapplications" element={<PartnerApplications />} />
<Route path="rapidresponse/rapidprototyping" element={<RapidPrototyping />} />




<Route path="authentication" element={<Authentication />} />
<Route path="authentication/overview" element={<Authentication />} />
<Route path="authentication/configuration" element={<AuthenticationConfiguration />} />
<Route path="authentication/resetpassword" element={<ResetPassword />} />


<Route path="houseapps" element={<HouseApps />} />
<Route path="houseapps/overview" element={<HouseApps />} />
<Route path="houseapps/applicationsdock" element={<HouseApplicationsDock />} />
<Route path="houseapps/myhouseapplications" element={<MyHouseApplications />} />


<Route path="tangibleteams" element={<TangibleTeamsOverview />} />
<Route path="tangibleteams/overview" element={<TangibleTeamsOverview />} />
<Route path="tangibleteams/teammembers" element={<TeamMembers />} />
<Route path="tangibleteams/engagements" element={<TangibleTeamsOverview />} />
<Route path="tangibleteams/teamrosters" element={<TangibleTeamsOverview />} />
<Route path="tangibleteams/myteam" element={<TangibleTeamsOverview />} />

<Route path="buildkits" element={<BuildKitsOverview />} />
<Route path="buildkits/overview" element={<BuildKitsOverview />} />
<Route path="buildkits/buildkitprograms" element={<BuildKitApplications />} />
<Route path="buildkits/mybuildkits" element={<BuildKitApplications />} />
<Route path="buildkits/inflight" element={<BuildKitsOverview />} />

<Route path="r2d2" element={<InsightsOverview />} />
<Route path="r2d2/overview" element={<InsightsOverview />} />
<Route path="r2d2/insightprograms" element={<InsightProgramApplications />} />
<Route path="r2d2/myinsights" element={<MyInsightApplications />} />
<Route path="r2d2/inflight" element={<InsightsOverview />} />


          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
    </AuthProvider>


  );
}

export default App;


