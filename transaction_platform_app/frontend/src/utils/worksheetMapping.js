// utils/worksheetMapping.js
import { regionalBlockConfigs } from '../pages/evershedsapplications/mergercontrol/features/transactionloadergroup/utils/regionalBlockConfigs.js';

const formatCurrency = (value, currency = 'USD') => {
    if (!value) return null;
    return typeof value === 'number' ? value : parseFloat(value.replace(/[^\d.-]/g, ''));
};

export const mapRunDataToWorksheet = (runData, blockKey, memberStateKey) => {
    console.log('🔍 mapRunDataToWorksheet called with:', { blockKey, memberStateKey });
    
    const targetData = runData?.targetCompanyData?.original?.regional_blocks;
    if (!targetData) {
        console.error('❌ No regional block data found');
        return null;
    }

    // Get the block configuration
    const blockConfig = regionalBlockConfigs[blockKey];
    if (!blockConfig) {
        console.error('❌ No configuration found for block:', blockKey);
        return null;
    }

    // Get member state display name for logging
    const memberState = blockConfig.member_states.find(state => state.dataKey === memberStateKey);
    console.log('🔑 Using block/state:', {
        blockDisplay: blockConfig.display,
        memberStateDisplay: memberState?.display,
        memberStateKey
    });

    // Get member state data from run_data
    const stateData = targetData[blockKey]?.member_states?.[memberStateKey];
    console.log(`📊 Found data for ${memberState?.display}:`, stateData);

    if (!stateData) {
        console.warn('⚠️ No data found for member state:', memberStateKey);
        return null;
    }

    // Common fields for all blocks
    const commonFields = {
        revenue: stateData.revenue,
        assets: stateData.assets,
        employees: stateData.employees,
        marketShare: stateData.market_share,
        local_entities: stateData.local_entities || []
    };

    console.log('🏗️ Building response for block:', blockKey);
    
    switch(blockKey) {
        case 'united_states':
            const usData = {
                ...commonFields,
                isManufacturer: stateData.is_manufacturer,
                transactionSize: stateData.size_of_transaction?.numeric?.us,
                sizeOfPersonApplies: stateData.size_of_transaction?.numeric?.us < 
                    (stateData.thresholds?.hsr?.max_transaction || Infinity),
                annualNetSales: stateData.size_of_person?.annual_net_sales?.numeric,
                totalAssets: stateData.size_of_person?.total_assets?.numeric
            };
            
            console.log('🇺🇸 US member state data:', usData);
            return usData;

        case 'united_kingdom':
            const ukData = {
                ...commonFields,
                marketShare: stateData.market_share || 
                           targetData.united_kingdom?.aggregated_market_share
            };
            console.log('🇬🇧 UK member state data:', ukData);
            return ukData;

        case 'european_union':
            const euData = {
                ...commonFields,
                marketShare: stateData.market_share
            };
            console.log('🇪🇺 EU member state data:', euData);
            return euData;

        default:
            console.log('📎 Default data:', commonFields);
            return commonFields;
    }
};

export const mapWorksheetToRunData = (worksheetData, blockKey, memberStateKey) => {
    console.log('💾 mapWorksheetToRunData called with:', { 
        blockKey, 
        memberStateKey, 
        worksheetData 
    });

    const blockConfig = regionalBlockConfigs[blockKey];
    console.log('🔑 Using block config:', blockConfig);

    // Common fields for all blocks
    const commonUpdates = {
        revenue: formatCurrency(worksheetData.revenue, blockConfig.currency),
        assets: formatCurrency(worksheetData.assets, blockConfig.currency),
        presence: true,
        last_updated: new Date().toISOString()
    };

    // Block-specific updates
    switch(blockKey) {
        case 'united_states':
            const usUpdates = {
                ...commonUpdates,
                is_manufacturer: worksheetData.isManufacturer,
                size_of_transaction: {
                    numeric: {
                        us: formatCurrency(worksheetData.transactionSize, 'USD')
                    }
                },
                ...(worksheetData.sizeOfPersonApplies && {
                    size_of_person: {
                        annual_net_sales: {
                            numeric: formatCurrency(worksheetData.annualNetSales, 'USD')
                        },
                        total_assets: {
                            numeric: formatCurrency(worksheetData.totalAssets, 'USD')
                        }
                    }
                })
            };
            console.log('🇺🇸 US updates:', usUpdates);
            return usUpdates;

        case 'european_union':
        case 'united_kingdom':
            const updates = {
                ...commonUpdates,
                employees: parseInt(worksheetData.employees) || null,
                market_share: parseFloat(worksheetData.marketShare) || null,
                local_entities: worksheetData.local_entities || [],
                member_state_specific: {
                    [memberStateKey]: {
                        market_share: parseFloat(worksheetData.marketShare) || null,
                        employees: parseInt(worksheetData.employees) || null
                    }
                }
            };
            console.log(`${blockKey === 'united_kingdom' ? '🇬🇧' : '🇪🇺'} Updates:`, updates);
            return updates;

        default:
            console.log('📎 Default updates:', commonUpdates);
            return commonUpdates;
    }
};

// Helper function to validate that data keys exist in run_data
export const validateBlockData = (runData, blockKey, memberStateKey) => {
    const hasData = runData?.targetCompanyData?.original?.regional_blocks?.[blockKey]
        ?.member_states?.[memberStateKey];
    
    if (!hasData) {
        console.warn('⚠️ Data validation failed:', {
            block: blockKey,
            memberState: memberStateKey,
            exists: !!hasData
        });
    }

    return !!hasData;
};

export default {
    mapRunDataToWorksheet,
    mapWorksheetToRunData,
    validateBlockData
};
