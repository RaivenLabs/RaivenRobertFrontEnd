// src/config/routes/index.js
import { lazy } from 'react';

// Lazy load page components
const CompanyReport = lazy(() => import('../../pages/menusections/companyreport'));
const RapidReview = lazy(() => import('../../pages/menusections/rapidreview'));
const Concierge = lazy(() => import('../../pages/menusections/concierge'));
const Operations = lazy(() => import('../../pages/menusections/operations'));
const Inflight = lazy(() => import('../../pages/menusections/inflight'));
const BuildKits = lazy(() => import('../../pages/menusections/buildkits'));
const R2D2 = lazy(() => import('../../pages/menusections/r2d2'));
const Keeper = lazy(() => import('../../pages/menusections/'));
const ReadyRoom = lazy(() => import('../../pages/menusections/readyroom'));
const Configuration = lazy(() => import('../../pages/menusections/configuration'));
const Sandbox = lazy(() => import('../../pages/menusections/sandbox'));
const TangibleTeams = lazy(() => import('../../pages/menusections/tangibleteams'));
const HouseApps = lazy(() => import('../../pages/menusections/houseapps'));
const Exchange = lazy(() => import('../../pages/menusections/exchange'));
const Speakeasy = lazy(() => import('../../pages/menusections/speakeasy'));
const PlatformTour = lazy(() => import('../../pages/menusections/platformtour'));
const Settings = lazy(() => import('../../pages/menusections/settings'));
const Login = lazy(() => import('../../pages/menusections/login'));

export const routes = [
  {
    path: 'companyreport',
    element: CompanyReport
  },
  {
    path: 'rapidreview',
    element: RapidReview
  },
  {
    path: 'concierge',
    element: Concierge
  },
  {
    path: 'headquarters',
    children: [
      { path: 'operations', element: Operations },
      { path: 'inflight', element: Inflight },
      { path: 'buildkits', element: BuildKits },
      { path: 'r2d2', element: R2D2 },
      { path: 'landed', element: Keeper },
      { path: 'readyroom', element: ReadyRoom },
      { path: 'configuration', element: Configuration },
      { path: 'sandbox', element: Sandbox }
    ]
  },
  {
    path: 'tangibleteams',
    element: TangibleTeams
  },
  {
    path: 'houseapps',
    element: HouseApps
  },
  {
    path: 'exchange',
    element: Exchange
  },
  {
    path: 'Speakeasy',
    element: Speakeasy
  },
  {
    path: 'platformtour',
    element: PlatformTour
  },
  {
    path: 'settings',
    element: Settings
  },
  {
    path: 'login',
    element: Login
  }
];
