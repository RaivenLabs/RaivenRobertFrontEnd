// src/utils/litigationUtils.js

/**
 * Fetches and processes litigation data from the API
 * @param {Object} filters - Filter parameters for the query
 * @returns {Promise<Array>} Processed litigation cases
 */
export const fetchLitigationData = async (filters = {}) => {
    try {
      const response = await fetch('/api/litigation/cases');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.error);
      }
  
      // Process and filter the data
      let processedData = result.data.map(processSingleCase);
  
      // Apply filters client-side if needed
      if (Object.keys(filters).length > 0) {
        processedData = filterData(processedData, filters);
      }
  
      return processedData;
    } catch (error) {
      console.error('Error fetching litigation data:', error);
      throw error;
    }
  };
  
  /**
   * Processes a single case from the raw data
   * @param {Object} caseData - Raw case data from API
   * @returns {Object} Processed case data
   */
  const processSingleCase = (caseData) => {
    const lawsuit = caseData.lawsuit_service?.[0] || {};
    const injuredParty = lawsuit.injured_party?.[0] || {};
    const diagnosis = injuredParty.diagnosis?.[0] || {};
    const counsel = lawsuit.counsel?.[0] || {};
    const occupation = injuredParty.occupation_exposure?.[0] || {};
  
    return {
      // Basic Information
      log_number: caseData.file?.log_number,
      case_caption: lawsuit.lawsuit_case_caption,
      jurisdiction_display: formatJurisdiction(lawsuit),
      disease_name: diagnosis.diagnosis_disease_name,
      file_date: lawsuit.lawsuit_file_date,
      answer_due_date: lawsuit.lawsuit_answer_due_date,
      company_served: lawsuit.lawsuit_company_served,
      status: calculateStatus(lawsuit.lawsuit_answer_due_date),
  
      // Case Details
      docket_number: lawsuit.lawsuit_docket_number,
      service_date: lawsuit.lawsuit_service_date,
      received_date: lawsuit.lawsuit_received_date,
      damage_description: lawsuit.lawsuit_damage_descriptions,
      harmful_material: lawsuit.lawsuit_harmful_material,
      allegation: lawsuit.lawsuit_allegation,
  
      // Injured Party Information
      injured_party_name: formatName({
        firstName: injuredParty.injured_party_first_name,
        middleName: injuredParty.injured_party_middle_name,
        lastName: injuredParty.injured_party_last_name,
        suffix: injuredParty.injured_party_suffix
      }),
      injured_party_deceased: injuredParty.injured_party_deceased,
  
      // Medical Information
      diagnosis_date: diagnosis.diagnosis_date,
      disease_category: diagnosis.diagnosis_disease_category,
  
      // Counsel Information
      counsel_info: {
        name: counsel.counsel_name_of_attorney,
        firm: counsel.counsel_firm_name,
        type: counsel.counsel_type
      },
  
      // Occupation Information
      occupation_info: {
        title: occupation.occupation_title,
        jobsite: occupation.occupation_jobsite,
        start_date: occupation.occupation_start_date,
        end_date: occupation.occupation_end_date
      },
  
      // Store raw data for detailed view
      raw: caseData
    };
  };
  
  /**
   * Filters the processed data based on provided filters
   * @param {Array} data - Array of processed cases
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered cases
   */
  const filterData = (data, filters) => {
    return data.filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        
        switch (key) {
          case 'status':
            if (item.status !== value) return false;
            break;
          case 'disease':
            if (item.disease_name !== value) return false;
            break;
          case 'jurisdiction':
            if (item.jurisdiction_display !== value) return false;
            break;
        }
      }
      return true;
    });
  };
  
  /**
   * Formats name from component parts
   * @param {Object} params - Name components
   * @returns {string} Formatted full name
   */
  const formatName = ({ firstName, middleName, lastName, suffix }) => {
    return [firstName, middleName, lastName, suffix]
      .filter(Boolean)
      .join(' ')
      .trim();
  };
  
  /**
   * Formats jurisdiction display string
   * @param {Object} lawsuit - Lawsuit data
   * @returns {string} Formatted jurisdiction string
   */
  const formatJurisdiction = (lawsuit) => {
    if (!lawsuit?.lawsuit_jurisdiction || !lawsuit?.lawsuit_jurisdiction_state) {
      return 'Unknown Jurisdiction';
    }
    return `${lawsuit.lawsuit_jurisdiction}, ${lawsuit.lawsuit_jurisdiction_state}`;
  };
  
  /**
   * Calculates case status based on due date
   * @param {string} dueDate - Due date string
   * @returns {string} Status indicator
   */
  const calculateStatus = (dueDate) => {
    if (!dueDate) return 'PENDING';
    
    try {
      const today = new Date();
      const due = new Date(dueDate);
      const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) return 'OVERDUE';
      if (daysUntilDue <= 7) return 'URGENT';
      return 'ACTIVE';
    } catch (error) {
      console.error('Error calculating status:', error);
      return 'PENDING';
    }
  };
  
  /**
   * Formats date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  /**
   * Gets unique disease categories from cases
   * @param {Array} cases - Array of processed cases
   * @returns {Array} Unique disease categories
   */
  export const getDiseaseCategories = (cases) => {
    return [...new Set(cases.map(c => c.disease_name).filter(Boolean))];
  };
  
  /**
   * Gets unique jurisdictions from cases
   * @param {Array} cases - Array of processed cases
   * @returns {Array} Unique jurisdictions
   */
  export const getJurisdictions = (cases) => {
    return [...new Set(cases.map(c => c.jurisdiction_display).filter(Boolean))];
  };
