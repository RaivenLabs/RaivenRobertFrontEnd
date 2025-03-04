// src/context/FundContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const FundContext = createContext();

// Action Types
const ACTIONS = {
  SET_PROJECT: 'SET_PROJECT',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  ADD_SELECTED_FUNDS: 'ADD_SELECTED_FUNDS',
  REMOVE_SELECTED_FUNDS: 'REMOVE_SELECTED_FUNDS',
  SET_QUERY_PARAMETERS: 'SET_QUERY_PARAMETERS',
  START_MONITORING: 'START_MONITORING',
  UPDATE_FUND_STATUS: 'UPDATE_FUND_STATUS',
  CLEAR_SESSION: 'CLEAR_SESSION'
};

// Initial State
const initialState = {
  projectName: '',
  projectId: null,
  searchResults: [],
  selectedFunds: [],
  queryParameters: {
    fundName: '',
    fundType: '',
    jurisdiction: '',
    status: ''
  },
  monitoringActive: false,
  lastUpdate: null
};

// Reducer
function fundReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PROJECT:
      return {
        ...state,
        projectName: action.payload.name,
        projectId: action.payload.id
      };
    
    case ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };
    
    case ACTIONS.ADD_SELECTED_FUNDS:
      return {
        ...state,
        selectedFunds: [...state.selectedFunds, ...action.payload]
      };
    
    case ACTIONS.REMOVE_SELECTED_FUNDS:
      return {
        ...state,
        selectedFunds: state.selectedFunds.filter(
          fund => !action.payload.includes(fund.frn)
        )
      };
    
    case ACTIONS.SET_QUERY_PARAMETERS:
      return {
        ...state,
        queryParameters: {
          ...state.queryParameters,
          ...action.payload
        }
      };
    
    case ACTIONS.START_MONITORING:
      return {
        ...state,
        monitoringActive: true,
        lastUpdate: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_FUND_STATUS:
      return {
        ...state,
        selectedFunds: state.selectedFunds.map(fund =>
          fund.frn === action.payload.frn
            ? { ...fund, ...action.payload.updates }
            : fund
        )
      };
    
    case ACTIONS.CLEAR_SESSION:
      return initialState;
    
    default:
      return state;
  }
}

// Provider Component
function FundProvider({ children }) {
  const [state, dispatch] = useReducer(fundReducer, initialState);

  // Helper Functions
  const setProject = (projectData) => {
    dispatch({ type: ACTIONS.SET_PROJECT, payload: projectData });
  };

  const updateSearchResults = (results) => {
    dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results });
  };

  const addSelectedFunds = (funds) => {
    dispatch({ type: ACTIONS.ADD_SELECTED_FUNDS, payload: funds });
  };

  const removeSelectedFunds = (fundIds) => {
    dispatch({ type: ACTIONS.REMOVE_SELECTED_FUNDS, payload: fundIds });
  };

  const setQueryParameters = (params) => {
    dispatch({ type: ACTIONS.SET_QUERY_PARAMETERS, payload: params });
  };

  const startMonitoring = () => {
    dispatch({ type: ACTIONS.START_MONITORING });
  };

  const updateFundStatus = (frn, updates) => {
    dispatch({ 
      type: ACTIONS.UPDATE_FUND_STATUS, 
      payload: { frn, updates } 
    });
  };

  const clearSession = () => {
    dispatch({ type: ACTIONS.CLEAR_SESSION });
  };

  const value = {
    ...state,
    setProject,
    updateSearchResults,
    addSelectedFunds,
    removeSelectedFunds,
    setQueryParameters,
    startMonitoring,
    updateFundStatus,
    clearSession
  };

  return (
    <FundContext.Provider value={value}>
      {children}
    </FundContext.Provider>
  );
}

// Custom Hook
function useFundContext() {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error('useFundContext must be used within a FundProvider');
  }
  return context;
}

// Exports at the bottom, like in MergerControlContext
export { FundProvider, useFundContext };
export default FundContext;
