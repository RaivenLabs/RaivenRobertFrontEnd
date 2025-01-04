// src/config/sectionNavigation/index.js

// Import all configs
import buildkitsConfig from './buildkits';
import conciergeConfig from './concierge';
import inflightConfig from './inflight';
import companyreportConfig from './companyreport';
import flightdeckConfig from './flightdeck';
import r2d2Config from './r2d2';
import landedConfig from './landed';
import readyroomConfig from './readyroom';
import configurationConfig from './configuration';
import sandboxConfig from './sandbox';
import tangibleteamsConfig from './tangibleteams';
import platformtourConfig from './platformtour';
import houseappsConfig from './houseapps';
import exchangeConfig from './exchange';
import speakeasyConfig from './speakeasy';
import rapidreviewConfig from './rapidreview';
import settingsConfig from './settings';
import authenticationConfig from './authentication';

// Create a unified configs object
const configs = {
  buildkits: buildkitsConfig,
  companyreport: companyreportConfig,
  concierge: conciergeConfig,
  inflight: inflightConfig,
  flightdeck: flightdeckConfig,
  r2d2: r2d2Config,
  landed: landedConfig,
  readyroom: readyroomConfig,
  configuration: configurationConfig,
  sandbox: sandboxConfig,
  tangibleteams: tangibleteamsConfig,
  platformtour: platformtourConfig,
  houseapps: houseappsConfig,
  exchange: exchangeConfig,
  speakeasy: speakeasyConfig,
  settings: settingsConfig,
  authentication: authenticationConfig,
  rapidreview: rapidreviewConfig
};

// Named exports for individual configs
export {
  buildkitsConfig,
  companyreportConfig,
  conciergeConfig,
  inflightConfig,
  flightdeckConfig,
  r2d2Config,
  landedConfig,
  readyroomConfig,
  configurationConfig,
  sandboxConfig,
  tangibleteamsConfig,
  platformtourConfig,
  houseappsConfig,
  exchangeConfig,
  speakeasyConfig,
  settingsConfig,
  authenticationConfig,
  rapidreviewConfig
};

// Helper function to get section config
export const getSectionConfig = (sectionId) => {
  const config = configs[sectionId];
  if (!config) {
    console.warn(`No config found for section: ${sectionId}`);
  }
  return config;
};

// Export the entire configs object as default
export default configs;
