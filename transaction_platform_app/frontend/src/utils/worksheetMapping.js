// utils/worksheetMapping.js

const formatCurrency = (value, currency = 'USD') => {
    if (!value) return null;
    return typeof value === 'number' ? value : parseFloat(value.replace(/[^\d.-]/g, ''));
  };
  
  export const mapRunDataToWorksheet = (runData, region, jurisdiction) => {
    console.log('🔍 mapRunDataToWorksheet called with:', { region, jurisdiction });
    console.log('📦 Run data structure:', runData);
  
    const jurisdictionData = runData?.targetCompanyData?.original?.jurisdictional_presence?.countries?.[jurisdiction];
    console.log('📊 Found jurisdiction data:', jurisdictionData);
  
    // Common fields for all regions
    const commonFields = {
      revenue: jurisdictionData?.revenue,
      assets: jurisdictionData?.assets,
    };
  
    console.log('🏗️ Building response for region:', region);
    
    // Region-specific mappings
    switch(region) {
      case 'us':
        const usData = {
          ...commonFields,
          isManufacturer: runData?.targetCompanyData?.original?.is_manufacturer,
          transactionSize: runData?.targetCompanyData?.original?.size_of_transaction?.numeric?.us,
          sizeOfPerson: {
            annual_net_sales: runData?.targetCompanyData?.original?.size_of_person?.annual_net_sales?.numeric,
            total_assets: runData?.targetCompanyData?.original?.size_of_person?.total_assets?.numeric
          }
        };
        console.log('🇺🇸 US-specific data:', usData);
        return usData;
  
      case 'uk':
        const ukData = {
          ...commonFields,
          marketShare: runData?.targetCompanyData?.original?.market_share?.uk,
          employees: jurisdictionData?.employees,
          local_entities: jurisdictionData?.local_entities || []
        };
        console.log('🇬🇧 UK-specific data:', ukData);
        return ukData;
  
      case 'eu':
        const euData = {
          ...commonFields,
          marketShare: runData?.targetCompanyData?.original?.market_share?.eu?.[jurisdiction],
          employees: jurisdictionData?.employees,
          local_entities: jurisdictionData?.local_entities || []
        };
        console.log('🇪🇺 EU-specific data:', euData);
        return euData;
  
      default:
        console.log('📎 Default data:', commonFields);
        return commonFields;
    }
  };
  
  export const mapWorksheetToRunData = (worksheetData, region, jurisdiction) => {
    console.log('💾 mapWorksheetToRunData called with:', { region, jurisdiction, worksheetData });
  
    // Common fields for all regions
    const commonUpdates = {
      revenue: formatCurrency(worksheetData.revenue),
      assets: formatCurrency(worksheetData.assets),
      presence: true
    };
  
    // Region-specific updates
    switch(region) {
      case 'us':
        const usUpdates = {
          ...commonUpdates,
          is_manufacturer: worksheetData.isManufacturer,
          size_of_transaction: {
            numeric: {
              us: formatCurrency(worksheetData.transactionSize)
            }
          },
          size_of_person: {
            annual_net_sales: {
              numeric: formatCurrency(worksheetData.sizeOfPerson?.annual_net_sales)
            },
            total_assets: {
              numeric: formatCurrency(worksheetData.sizeOfPerson?.total_assets)
            }
          }
        };
        console.log('🇺🇸 US updates:', usUpdates);
        return usUpdates;
  
      case 'uk':
      case 'eu':
        const updates = {
          ...commonUpdates,
          employees: parseInt(worksheetData.employees) || null,
          market_share: parseFloat(worksheetData.marketShare) || null,
          local_entities: worksheetData.local_entities || []
        };
        console.log(`${region === 'uk' ? '🇬🇧' : '🇪🇺'} Updates:`, updates);
        return updates;
  
      default:
        console.log('📎 Default updates:', commonUpdates);
        return commonUpdates;
    }
  };
