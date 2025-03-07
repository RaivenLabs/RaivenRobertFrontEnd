import React from 'react';


import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { AuthProvider } from './context/AuthContext';
import { SpeakeasyProvider } from './context/SpeakeasyContext';
import {MergerControlProvider} from './context/MergerControlContext';
import {FundProvider} from './context/FundContext';
import {PrototypingProvider} from './context/PrototypingContext'

import {SidebarProvider} from './context/SidebarContext';
import { useConfig } from './context/ConfigContext';
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

// Speakeasy Club imports
import SpeakeasyClubIndex from './pages/menusections/speakeasy/applications/speakeasyclub/index';
import SpeakeasyClubDashboard from './pages/menusections/speakeasy/applications/speakeasyclub/features/Dashboard';
import SpeakeasyClubMembers from './pages/menusections/speakeasy/applications/speakeasyclub/features/Members';
import SpeakeasyClubEvents from './pages/menusections/speakeasy/applications/speakeasyclub/features/Events';
import SpeakeasyClubSettings from './pages/menusections/speakeasy/applications/speakeasyclub/features/Settings';

// Other feature imports
import Dashboard from './pages/menusections/inflight/features/Dashboard';
import FlightDeckDashboard from './pages/menusections/flightdeck/features/Dashboard';
import { AgreementTree, LandedLogBook, LandedDashboard } from './pages/menusections/landed/features';
import PlatformConfiguration from './pages/menusections/configuration/features/PlatformConfiguration';
import CompanyResources from './pages/menusections/companyreport/features/CompanyResources';
import TangibleInside from './pages/menusections/rapidreview/features/TangibleInside';
import WinslowInside from './pages/menusections/rapidreview/features/WinslowApplications';



import ApplicationSuite from './pages/menusections/rapidreview/features/ApplicationSuite';

import ForecastingDashboards from './pages/menusections/rapidreview/features/ForecastingDashboards';
import RapidPrototyping from './pages/menusections/rapidreview/features/Sandbox';

import AuthenticationConfiguration from './pages/menusections/authentication/features/AuthenticationConfiguration';
import ResetPassword from './pages/menusections/authentication/features/ResetPassword';
import HouseApplicationsDock from './pages/menusections/houseapps/features/HouseApplicationsDock';
import MyHouseApplications from './pages/menusections/houseapps/features/MyHouseApplications';
import TeamMembers from './pages/menusections/tangibleteams/features/TeamMembers';
import BuildKitApplications from './pages/menusections/buildkits/features/BuildKitApplicationGroup';
import InsightProgramApplications from './pages/menusections/r2d2/features/InsightPrograms';
import MyInsightApplications from './pages/menusections/r2d2/features/MyInsightPrograms';

//Eversheds Application Group

//Eversheds Fund Management
import FundComponent from './pages/evershedsapplications/funds';
import FundDashboard from './pages/evershedsapplications/funds/features/dashboard';
import FundLoader from './pages/evershedsapplications/funds/features/loader';
import FundFamiliesTable from './pages/evershedsapplications/funds/features/fundfamilies';

//import EUCSDDConfiguration from './pages/evershedsapplications/eucsdd/features/configuration';
import EUCSDDDashboard from './pages/evershedsapplications/eucsdd/features/dashboard';

import EUCSDDLoader from './pages/evershedsapplications/eucsdd/features/loader';


//Application Configuration Components
//import ApplicationConfiguration from './pages/menusections/applicationconfiguration/features/LandingPage';
import ApplicationConfiguration from './pages/menusections/applicationconfiguration';


//Sandbox Components
import PrototypingLab from './pages/menusections/sandbox/features/sandboxlab';




import EvershedsDiversity from './pages/evershedsapplications/diversity';
import EvershedsEUCSDD from './pages/evershedsapplications/eucsdd';
import MergerControlContent from './pages/evershedsapplications/mergercontrol';
import EvershedsFinancialServices from './pages/evershedsapplications/financialservices';


import NIKERaivenContent from './pages/nikeapplications/raiven';
//import NIKERaivenConfiguration from './pages/nikeapplications/raiven/features/configuration';
//import NIKERaivenDashboard from './pages/nikeapplications/raiven/features/reporting';
//import NikeRaivenActiveProjects from './pages/nikeapplications/raiven/features/activeprojects';
//import NIKERaivenPackageBuilder from './pages/nikeapplications/raiven/features/filings';
//import NIKERaivenTransactionAnalysis from './pages/nikeapplications/raiven/features/transactionanalysis';
//import NIKERaivenTransactionLoader from './pages/nikeapplications/raiven/features/transactionloadergroup';


import PaceAida from './pages/paceapplications/paceaida';
import PaceAidaDashboard from './pages/paceapplications/paceaida/features/dashboard';
import FullPayload from './pages/paceapplications/paceaida/features/fullpayload';
import  ConfirmationTable from './pages/paceapplications/paceaida/features/confirmation';
import  ClientTable from './pages/paceapplications/paceaida/features/clienttable';


import EvershedsRecruiting from './pages/evershedsapplications/recruiting';
import ActiveReviewsTable from './pages/evershedsapplications/recruiting/features/activereviews';
import RecruitingDashboard from './pages/evershedsapplications/recruiting/features/dashboard';
import RecruitingLoader from './pages/evershedsapplications/recruiting/features/loader';
import ReviewArchiveTable from './pages/evershedsapplications/recruiting/features/reviewarchive';



import ProgramConfiguration from './pages/menusections/concierge/features/programconfiguration';
import ConciergeDashboard from './pages/menusections/concierge/features/conciergedashboard';
import Launchpad from './pages/menusections/concierge/features/launchpad';
import FinanceDesk from './pages/menusections/concierge/features/financedesk';
import TimeManagement from './pages/menusections/concierge/features/timemanagement';
import RegistryTable from './pages/menusections/concierge/features/registry';



import MergerControlConfiguration from './pages/evershedsapplications/mergercontrol/features/configuration';
import MergerControlDashboard from './pages/evershedsapplications/mergercontrol/features/reporting';
import MergerControlActiveProjects from './pages/evershedsapplications/mergercontrol/features/activeprojects';
import FilingPackageBuilder from './pages/evershedsapplications/mergercontrol/features/filings';
import TransactionAnalysis from './pages/evershedsapplications/mergercontrol/features/transactionanalysis';
import TransactionLoader from './pages/evershedsapplications/mergercontrol/features/transactionloadergroup';



//Winslow feature imports
import SourcingHubContent from './pages/menusections/rapidreview/features/WinslowApplications/SourcingHub';
import BooneLanding from './pages/menusections/rapidreview/features/WinslowApplications/Boone';
import CypressLanding from './pages/menusections/rapidreview/features/WinslowApplications/Cypress';

//Boone
import BooneConfiguration from './pages/menusections/rapidreview/features/WinslowApplications/Boone/features/booneconfiguration/booneconfiguration';
import BoonePayload from './pages/menusections/rapidreview/features/WinslowApplications/Boone/features/payload/payloads';
import BooneDashboard from './pages/menusections/rapidreview/features/WinslowApplications/Boone/features/dashboard/dashboard';

//Cypress
import CypressConfiguration from './pages/menusections/rapidreview/features/WinslowApplications/Cypress/features/cypressconfiguration/cypressconfiguration';
import CypressOrderPortfolio from './pages/menusections/rapidreview/features/WinslowApplications/Cypress/features/cypressarchives/cypressretrieval';
import CypressDashboard from './pages/menusections/rapidreview/features/WinslowApplications/Cypress/features/dashboard/dashboard';



import OrderLaunchpad from './pages/menusections/rapidreview/features/WinslowApplications/Cypress/features/launchpad/launchpad';
import CypressProviders from './pages/menusections/rapidreview/features/WinslowApplications/Cypress/features/providers/providers';



// Florence Gelato feature imports
import FlorenceGelatoIndex from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato';
import FlorenceGelatoOverview from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Overview';
import FlorenceGelatoLaunch from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Launch';
import FlorenceGelatoInflight from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Inflight';
import FlorenceGelatoPortfolio from './pages/menusections/speakeasy/applications/speakeasyclub/applicationgroups/florencegelato/features/Portfolio';
import { ApplicationRunProvider } from './context/ApplicationRunContext';

function AppRoutes() {
  const { coreconfig } = useConfig();
  const location = useLocation();

  React.useEffect(() => {
    console.log("tiger");
    console.log('Current environment:', coreconfig?.environment);
    console.log('API URL:', coreconfig?.apiUrl);
  }, [coreconfig, location]);

  return (
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
        <Route path="rapidresponse/partnerapplications/fundcomponent" element={<FundComponent />} />
        <Route path="rapidresponse/partnerapplications/diversitycomponent" element={<EvershedsDiversity/>} />
        <Route path="rapidresponse/partnerapplications/mergercontrolcomponent" element={<MergerControlContent />} />
        <Route path="rapidresponse/partnerapplications/recruitingcomponent" element={<EvershedsRecruiting />} />
        <Route path="rapidresponse/partnerapplications/eucsddcomponent" element={<EvershedsEUCSDD />} />
        <Route path="rapidresponse/partnerapplications/financialservicescomponent" element={<EvershedsFinancialServices />} />

            
        
        
        <Route path="authentication" element={<Authentication />} />


        {/* Speakeasy Club routes */}
        <Route path="speakeasyclub/applicationpanel" element={<SpeakeasyClubDashboard />} />
        <Route path="speakeasyclub/builds" element={<SpeakeasyClubMembers />} />
        <Route path="speakeasyclub/prototypes" element={<SpeakeasyClubEvents />} />
        <Route path="speakeasyclub/features" element={<SpeakeasyClubSettings />} />

        {/* Florence Gelato routes */}
        <Route path="speakeasyclub/applicationgroups/florencegelato" element={<FlorenceGelatoIndex />} />
        <Route path="speakeasyclub/applicationgroups/florencegelato/overview" element={<FlorenceGelatoOverview />} />
        <Route path="speakeasyclub/applicationgroups/florencegelato/launch" element={<FlorenceGelatoLaunch />} />
        <Route path="speakeasyclub/applicationgroups/florencegelato/inflight" element={<FlorenceGelatoInflight />} />
        <Route path="speakeasyclub/applicationgroups/florencegelato/portfolio" element={<FlorenceGelatoPortfolio />} />

        {/* Inflight routes */}
        <Route path="inflight/overview" element={<Inflight />} />  
        <Route path="inflight/dashboard" element={<Dashboard />} />

        {/* FlightDeck routes */}
        <Route path="flightdeck/overview" element={<FlightDeckContent />} />
        <Route path="flightdeck/dashboard" element={<FlightDeckDashboard />} />

        {/* Landed routes */}
        <Route path="landed/dashboard" element={<LandedDashboard />} />
        <Route path="landed/agreementtrees" element={<AgreementTree />} />
        <Route path="landed/logbook" element={<LandedLogBook />} />

        {/* Platform Configuration routes */}
        <Route path="configuration" element={<Configuration />} />
        <Route path="configuration/overview" element={<Configuration />} />
        <Route path="configuration/platformconfiguration" element={<PlatformConfiguration />} />




       {/* Concierge routes */}
        <Route path="concierge/overview" element={<Concierge />} />
        <Route path="concierge/programconfiguration" element={<ProgramConfiguration />} />
        <Route path="concierge/dashboard" element={<ConciergeDashboard />} />
        <Route path="concierge/launchpad" element={<Launchpad />} />
        <Route path="concierge/financedesk" element={<FinanceDesk />} />
        <Route path="concierge/timemanagement" element={<TimeManagement />} />
        <Route path="concierge/registry" element={<RegistryTable />} />

      {/* Sandbox routes */}
      <Route path="sandbox/overview" element={<Sandbox />} />
      <Route path="sandbox/thelab" element={<PrototypingLab />} />


        {/* Company Report routes */}
        <Route path="companyreport/overview" element={<CompanyReport />} />
        <Route path="companyreport/resources" element={<CompanyResources />} />

        {/* Rapid Response routes */}
        <Route path="rapidresponse/overview" element={<RapidResponse />} />
        <Route path="rapidresponse/tangibleinside" element={<TangibleInside />} />
        <Route path="rapidresponse/winslowapplications" element={<WinslowInside />} />
        <Route path="rapidresponse/applicationsuite" element={<ApplicationSuite />} />
        <Route path="rapidresponse/forecastingdashboards" element={<ForecastingDashboards />} />
        <Route path="rapidresponse/partnerapplications" element={<ApplicationSuite />} />
        <Route path="rapidresponse/rapidprototyping" element={<RapidPrototyping />} />
        <Route path="rapidresponse/configurable" element={<Configuration />} />

        {/* Authentication routes */}
        <Route path="authentication/overview" element={<Authentication />} />
        <Route path="authentication/configuration" element={<AuthenticationConfiguration />} />
        <Route path="authentication/resetpassword" element={<ResetPassword />} />

        {/* House Apps routes */}
        <Route path="houseapps/overview" element={<HouseApps />} />
        <Route path="houseapps/applicationsdock" element={<HouseApplicationsDock />} />
        <Route path="houseapps/myhouseapplications" element={<MyHouseApplications />} />

        {/* Tangible Teams routes */}
        <Route path="tangibleteams/overview" element={<TangibleTeamsOverview />} />
        <Route path="tangibleteams/teammembers" element={<TeamMembers />} />
        <Route path="tangibleteams/engagements" element={<TangibleTeamsOverview />} />
        <Route path="tangibleteams/teamrosters" element={<TangibleTeamsOverview />} />
        <Route path="tangibleteams/myteam" element={<TangibleTeamsOverview />} />

        {/* Build Kits routes */}
        <Route path="buildkits/overview" element={<BuildKitsOverview />} />
        <Route path="buildkits/buildkitprograms" element={<BuildKitApplications />} />
        <Route path="buildkits/mybuildkits" element={<BuildKitApplications />} />
        <Route path="buildkits/inflight" element={<BuildKitsOverview />} />

 {/* Winslow Sourcing Hub routes */}
 <Route path="rapidresponse/winslowapplications/sourcinghubcomponent" element={<SourcingHubContent />} />
 <Route path="winslowsourcing/overview" element={<SourcingHubContent />} />

 <Route path="rapidresponse/winslowapplications/boonecomponent" element={<BooneLanding />} />
 <Route path="winslowboone/overview" element={<BooneLanding />} />
 <Route path="winslowboone/configuration" element={<BooneConfiguration />} />

 <Route path="winslowboone/payloads" element={<BoonePayload />} />
 <Route path="winslowboone/dashboard" element={<BooneDashboard />} />

 
 <Route path="rapidresponse/winslowapplications/cypresscomponent" element={<CypressLanding />} />
 <Route path="winslowcypress/overview" element={<CypressLanding />} />
 <Route path="winslowcypress/configuration" element={<CypressConfiguration />} />

 <Route path="winslowcypress/retrieval" element={<CypressOrderPortfolio />} />
 <Route path="winslowcypress/dashboard" element={<CypressDashboard />} />



 <Route path="winslowcypress/launchpad" element={<OrderLaunchpad />} />
 <Route path="winslowcypress/providers" element={<CypressProviders />} />


 {/* Eversheds Merger Control routes */}
 <Route path="rapidresponse/partnerapplications/nikeraivencomponent" element={<NIKERaivenContent />} />


 <Route path="mergercontrolcomponent" element={<MergerControlContent />} />
 <Route path="mergercontrol/overview" element={<MergerControlContent />} />
 <Route path="mergercontrol/loader" element={<TransactionLoader />} />
 <Route path="mergercontrol/transactionanalysis" element={<TransactionAnalysis />} />
 <Route path="mergercontrol/filings" element={<FilingPackageBuilder />} />
 <Route path="mergercontrol/reporting" element={<MergerControlDashboard />} />
 <Route path="mergercontrol/activeprojects" element={<MergerControlActiveProjects />} />
 <Route path="mergercontrol/configuration" element={<MergerControlConfiguration />} />

{/* NIKE Raiven routes */}
<Route path="rapidresponse/partnerapplications/nikeraivencomponent" element={<NIKERaivenContent />} />

 <Route path="nikeraiven/overview" element={<MergerControlContent />} />
 <Route path="nikeraiven/loader" element={<TransactionLoader />} />
 <Route path="nikeraiven/transactionanalysis" element={<TransactionAnalysis />} />
 <Route path="nikeraiven/filings" element={<FilingPackageBuilder />} />
 <Route path="nikeraiven/reporting" element={<MergerControlDashboard />} />
 <Route path="nikeraiven/activeprojects" element={<MergerControlActiveProjects />} />
 <Route path="nikeraiven/configuration" element={<MergerControlConfiguration />} />


{/* Pace Aida routes */}
<Route path="rapidresponse/partnerapplications/paceaidacomponent" element={<PaceAida />} />
<Route path="paceaida/dashboard" element={<PaceAidaDashboard />} />
<Route path="paceaida/overview" element={<PaceAida />} />
<Route path="paceaida/payload" element={<FullPayload />} />
<Route path="paceaida/confirmation" element={<ConfirmationTable />} />
<Route path="paceaida/activematters" element={<ClientTable />} />



{/* Eversheds Fund Management routes */}

<Route path="fundmonitoring/overview" element={<FundComponent />} />
<Route path="fundmonitoring/families" element={<FundFamiliesTable />} />

 <Route path="fundmonitoring/research" element={<FundLoader />} />

 <Route path="fundmonitoring/dashboard" element={<FundDashboard />} />


 <Route path="eucsddcomponent" element={<EvershedsEUCSDD />} />
 <Route path="eucsdd/overview" element={<EvershedsEUCSDD />} />
 <Route path="eucsdd/loader" element={<EUCSDDLoader />} />
 
 <Route path="eucsdd/dashboard" element={<EUCSDDDashboard />} />
 
 <Route path="eucsdd/configuration" element={<EvershedsEUCSDD />} />



 <Route path="recruiting/overview" element={<EvershedsRecruiting />} />
 <Route path="recruiting/loader" element={<RecruitingLoader />} />
 
 <Route path="recruiting/dashboard" element={<RecruitingDashboard />} />

 <Route path="recruiting/activereviews" element={<ActiveReviewsTable />} />

 <Route path="recruiting/archive" element={<ReviewArchiveTable />} />
 
 <Route path="recruiting/configuration" element={<EvershedsEUCSDD />} />

 <Route path="recruiting/configuration" element={<EvershedsEUCSDD />} />


{/* Application Configuration routes */}

 <Route path="rapidresponse/configurableapplications" element={<ApplicationConfiguration />} />



        {/* R2D2 routes */}
        <Route path="r2d2/overview" element={<InsightsOverview />} />
        <Route path="r2d2/insightprograms" element={<InsightProgramApplications />} />
        <Route path="r2d2/myinsights" element={<MyInsightApplications />} />
        <Route path="r2d2/inflight" element={<InsightsOverview />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
      <AuthProvider>
        <ConfigProvider>
  
      <SidebarProvider>
        <ApplicationRunProvider>
          <PrototypingProvider>
          <MergerControlProvider>
            <FundProvider>
              <SpeakeasyProvider> 
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </SpeakeasyProvider>
            </FundProvider>
          </MergerControlProvider>
          </PrototypingProvider>
        </ApplicationRunProvider>
      </SidebarProvider>
   </ConfigProvider> 
   </AuthProvider>
  
  );
}

export default App;
