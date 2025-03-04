// mergerControlAlgorithms.js

// ============================
// Global Constants (2024)
// ============================
export const THRESHOLDS = {
    hsr: {
      size_of_transaction: 111.4e6,
      size_of_person_small: 22.3e6,
      size_of_person_large: 222.7e6,
      max_transaction: 445.5e6
    },
    eu: {
      global_primary: 5e9,
      eu_revenue: 250e6,
      global_alternative: 2.5e9,
      ms_threshold: 100e6,
      individual_ms: 25e6
    },
    uk: {
      turnover: 70e6,
      share_of_supply: 0.25  // 25%
    },
    comesa: {
      combined_turnover: 50e6
    },
    brazil: {
      large_group: 750e6,
      small_group: 75e6
    },
    california: {
      healthcare: 40e6
    },
    connecticut: {
      physician_count: 8
    }
  };
  
  // ============================
  // Data Validation Functions
  // ============================
  export function validateCompanyData(companyData) {
    // First check if we're getting the wrapped response
    const dataToValidate = companyData.targetCompanyData || companyData.buyingCompanyData || companyData;

    console.log('🔍 Validating company data:', {
        originalType: typeof companyData,
        hasTargetData: Boolean(companyData.targetCompanyData),
        hasBuyingData: Boolean(companyData.buyingCompanyData),
        dataToValidate: typeof dataToValidate
    });

    const requiredFields = [
        // Global metrics structure
        ['global_metrics'],
        ['global_metrics', 'global_revenue'],
        ['global_metrics', 'global_revenue', 'numeric'],
        ['global_metrics', 'size_of_person'],
        ['global_metrics', 'size_of_person', 'annual_net_sales', 'numeric'],
        ['global_metrics', 'size_of_person', 'total_assets', 'numeric'],
        // Basic company info
        ['name'],
        ['sector'],
        ['is_manufacturer'],
        // Regional data
        ['regional_blocks']
    ];

    for (const field of requiredFields) {
        let value = dataToValidate;
        for (const key of field) {
            if (!value || typeof value !== 'object' || !(key in value)) {
                console.error('❌ Validation failed at:', {
                    path: field.join('.'),
                    failedAt: key,
                    value: value
                });
                throw new Error(`Missing required field: ${field.join('.')}`);
            }
            value = value[key];
        }
    }

    return true;
}
  
  // ============================
  // Value Formatting Functions
  // ============================
  export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  export function formatPercentage(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
  }
  
  // ============================
  // Market Share Calculations
  // ============================
  export function normalizeMarketShare(share) {
    if (typeof share === 'string') {
      return parseFloat(share.replace('%', '')) / 100;
    }
    return share > 1 ? share / 100 : share;
  }
  
  export function calculateCombinedShare(buyerShare, sellerShare) {
    return normalizeMarketShare(buyerShare) + normalizeMarketShare(sellerShare);
  }
  
  export function calculateHHIDelta(buyerShare, sellerShare) {
    const buyer = normalizeMarketShare(buyerShare);
    const seller = normalizeMarketShare(sellerShare);
    return 2 * buyer * seller * 10000;
  }
  
  export function calculateMarketShareOverlap(buyerData, sellerData) {
    const markets = ['us', 'eu', 'uk'];
    const overlaps = {};
  
    markets.forEach(region => {
      const buyerMarkets = buyerData.market_share?.[region] || {};
      const sellerMarkets = sellerData.market_share?.[region] || {};
      const segments = [...new Set([
        ...Object.keys(buyerMarkets),
        ...Object.keys(sellerMarkets)
      ])];
  
      overlaps[region] = segments.reduce((acc, segment) => {
        const buyerShare = normalizeMarketShare(buyerMarkets[segment] || 0);
        const sellerShare = normalizeMarketShare(sellerMarkets[segment] || 0);
        const combinedShare = buyerShare + sellerShare;
  
        acc[segment] = {
          buyer_share: buyerShare,
          seller_share: sellerShare,
          combined_share: combinedShare,
          hhi_delta: calculateHHIDelta(buyerShare, sellerShare),
          is_significant: combinedShare >= 0.2 || calculateHHIDelta(buyerShare, sellerShare) >= 250
        };
        return acc;
      }, {});
    });
  
    return overlaps;
  }
  
  // ============================
  // HSR Calculations
  // ============================
  export function calculateSizeOfPerson(companyData) {
    validateCompanyData(companyData);
  
    const qualifying_size = companyData.is_manufacturer ?
      Math.max(
        companyData.size_of_person.annual_net_sales.numeric,
        companyData.size_of_person.total_assets.numeric
      ) :
      (companyData.size_of_person.annual_net_sales.numeric > THRESHOLDS.hsr.size_of_person_large ?
        companyData.size_of_person.annual_net_sales.numeric :
        companyData.size_of_person.total_assets.numeric);
  
    return {
      qualifying_size,
      components: {
        annual_net_sales: companyData.size_of_person.annual_net_sales.numeric,
        total_assets: companyData.size_of_person.total_assets.numeric
      },
      is_manufacturer: companyData.is_manufacturer,
      calculation_method: companyData.is_manufacturer ? 
        'manufacturer_larger_of_both' : 
        'non_manufacturer_conditional'
    };
  }
  
  export function calculateSizeOfTransaction(transactionData) {
    return {
      value: transactionData.size_of_transaction.numeric.us,
      components: {
        base_value: transactionData.size_of_transaction.numeric.us,
        assumed_liabilities: transactionData.assumed_liabilities || 0,
        excluded_assets: transactionData.excluded_assets || 0
      }
    };
  }
  
  export function calculateHSRFiling(buyerData, sellerData, transactionValue) {
    validateCompanyData(buyerData);
    validateCompanyData(sellerData);
  
    const buyer = calculateSizeOfPerson(buyerData);
    const seller = calculateSizeOfPerson(sellerData);
    const transaction = typeof transactionValue === 'object' ? 
      transactionValue.value : transactionValue;
  
    // Skip size of person test if transaction exceeds maximum threshold
    if (transaction >= THRESHOLDS.hsr.max_transaction) {
      return {
        filing_required: true,
        transaction_test_met: true,
        person_test_required: false,
        reason: 'transaction_exceeds_maximum',
        thresholds_used: {
          transaction: THRESHOLDS.hsr.max_transaction,
          person: 'not_applicable'
        }
      };
    }
  
    // Size of Transaction Test
    const transactionTestMet = transaction >= THRESHOLDS.hsr.size_of_transaction;
    if (!transactionTestMet) {
      return {
        filing_required: false,
        transaction_test_met: false,
        person_test_required: false,
        reason: 'transaction_below_threshold',
        thresholds_used: {
          transaction: THRESHOLDS.hsr.size_of_transaction
        }
      };
    }
  
    // Size of Person Test
    const personTestMet = (
      (buyer.qualifying_size >= THRESHOLDS.hsr.size_of_person_large && 
       seller.qualifying_size >= THRESHOLDS.hsr.size_of_person_small) ||
      (buyer.qualifying_size >= THRESHOLDS.hsr.size_of_person_small && 
       seller.qualifying_size >= THRESHOLDS.hsr.size_of_person_large)
    );
  
    return {
      filing_required: personTestMet,
      transaction_test_met: true,
      person_test_met: personTestMet,
      reason: personTestMet ? 'both_tests_met' : 'person_test_not_met',
      thresholds_used: {
        transaction: THRESHOLDS.hsr.size_of_transaction,
        person_large: THRESHOLDS.hsr.size_of_person_large,
        person_small: THRESHOLDS.hsr.size_of_person_small
      },
      details: {
        buyer: {
          qualifying_size: buyer.qualifying_size,
          calculation_method: buyer.calculation_method
        },
        seller: {
          qualifying_size: seller.qualifying_size,
          calculation_method: seller.calculation_method
        }
      }
    };
  }
  
  // ============================
  // EU Merger Control
  // ============================
  export function calculateEUFiling(buyerData, sellerData) {
    const worldwideCombined = 
      buyerData.revenue.numeric.global + 
      sellerData.revenue.numeric.global;
  
    const primaryTest = {
      worldwide_met: worldwideCombined > THRESHOLDS.eu.global_primary,
      eu_revenue_met: (
        buyerData.revenue.numeric.eu > THRESHOLDS.eu.eu_revenue &&
        sellerData.revenue.numeric.eu > THRESHOLDS.eu.eu_revenue
      )
    };
  
    const twoThirdsRule = !(
      (buyerData.revenue.numeric.eu / buyerData.revenue.numeric.global > 2/3) &&
      (sellerData.revenue.numeric.eu / sellerData.revenue.numeric.global > 2/3)
    );
  
    // Alternative test for significant presence in multiple member states
    const memberStates = new Set([
      ...Object.keys(buyerData.jurisdictional_presence?.countries || {}),
      ...Object.keys(sellerData.jurisdictional_presence?.countries || {})
    ]).filter(country => 
      buyerData.jurisdictional_presence?.countries[country]?.blocks?.includes('eu') ||
      sellerData.jurisdictional_presence?.countries[country]?.blocks?.includes('eu')
    );
  
    const qualifyingStates = memberStates.filter(state => {
      const buyerRevenue = buyerData.jurisdictional_presence?.countries[state]?.revenue || 0;
      const sellerRevenue = sellerData.jurisdictional_presence?.countries[state]?.revenue || 0;
      return buyerRevenue > THRESHOLDS.eu.individual_ms && 
             sellerRevenue > THRESHOLDS.eu.individual_ms;
    });
  
    const alternativeTest = {
      worldwide_met: worldwideCombined > THRESHOLDS.eu.global_alternative,
      ms_threshold_met: (
        buyerData.revenue.numeric.eu > THRESHOLDS.eu.ms_threshold &&
        sellerData.revenue.numeric.eu > THRESHOLDS.eu.ms_threshold
      ),
      qualifying_states: qualifyingStates.length,
      state_test_met: qualifyingStates.length >= 3
    };
  
    const filingRequired = (
      (primaryTest.worldwide_met && primaryTest.eu_revenue_met && twoThirdsRule) ||
      (alternativeTest.worldwide_met && alternativeTest.ms_threshold_met && 
       alternativeTest.state_test_met && twoThirdsRule)
    );
  
    return {
      filing_required: filingRequired,
      primary_test: primaryTest,
      alternative_test: alternativeTest,
      two_thirds_rule_applies: !twoThirdsRule,
      qualifying_member_states: qualifyingStates,
      thresholds_used: THRESHOLDS.eu
    };
  }
  
  // ============================
  // UK Merger Control
  // ============================
  export function calculateUKFiling(buyerData, sellerData) {
    // Turnover test
    const turnoverTest = {
      met: sellerData.revenue.numeric.uk > THRESHOLDS.uk.turnover,
      value: sellerData.revenue.numeric.uk
    };
  
    // Share of supply test
    const marketOverlaps = calculateMarketShareOverlap(buyerData, sellerData).uk;
    const shareOfSupplyTest = {
      met: false,
      qualifying_segments: []
    };
  
    Object.entries(marketOverlaps).forEach(([segment, data]) => {
      if (data.combined_share >= THRESHOLDS.uk.share_of_supply) {
        shareOfSupplyTest.met = true;
        shareOfSupplyTest.qualifying_segments.push({
          segment,
          combined_share: data.combined_share,
          buyer_share: data.buyer_share,
          seller_share: data.seller_share
        });
      }
    });
  
    return {
      filing_required: turnoverTest.met || shareOfSupplyTest.met,
      turnover_test: turnoverTest,
      share_of_supply_test: shareOfSupplyTest,
      thresholds_used: THRESHOLDS.uk
    };
  }

  
// ============================
// COMESA
// ============================
function calculateCOMESAFiling(buyerData, targetData) {
    const COMESA_THRESHOLD = 50e6;  // $50 million
    
    // Get COMESA member states where companies operate
    const comesaStates = new Set([
        ...Object.keys(buyerData.jurisdictional_presence?.countries || {})
            .filter(country => country.comesa_member),
        ...Object.keys(targetData.jurisdictional_presence?.countries || {})
            .filter(country => country.comesa_member)
    ]);
    
    // Need operations in 2+ member states
    const jurisdictionalTest = comesaStates.size >= 2;
    
    // Combined turnover test
    const comesaTurnover = (
        (buyerData.revenue.numeric.comesa || 0) + 
        (targetData.revenue.numeric.comesa || 0)
    );
    
    const turnoverTest = comesaTurnover > COMESA_THRESHOLD;
    
    return jurisdictionalTest && turnoverTest;
}

// ============================
// Brazil (CADE)
// ============================
function calculateBrazilFiling(buyerData, targetData) {
    const LARGE_GROUP_THRESHOLD = 750e6;  // R$750 million
    const SMALL_GROUP_THRESHOLD = 75e6;   // R$75 million
    
    const buyerBrazilTurnover = buyerData.revenue.numeric.brazil || 0;
    const targetBrazilTurnover = targetData.revenue.numeric.brazil || 0;
    
    // At least one group > R$750 million
    const largeGroupTest = Math.max(
        buyerBrazilTurnover, 
        targetBrazilTurnover
    ) > LARGE_GROUP_THRESHOLD;
    
    // Other group > R$75 million
    const smallGroupTest = Math.min(
        buyerBrazilTurnover, 
        targetBrazilTurnover
    ) > SMALL_GROUP_THRESHOLD;
    
    return largeGroupTest && smallGroupTest;
}

  
  // ============================
  // Industry-Specific Tests
  // ============================
  export function calculateHealthcareFiling(buyerData, sellerData, jurisdiction) {
    switch (jurisdiction.toLowerCase()) {
      case 'california':
        const isHealthcare = 
          buyerData.sector === 'healthcare' || 
          sellerData.sector === 'healthcare';
        
        const facilityChange = 
          sellerData.healthcare_facilities?.california?.length > 0;
        
        return {
          filing_required: (
            (isHealthcare && sellerData.revenue.numeric.us > THRESHOLDS.california.healthcare) ||
            facilityChange
          ),
          is_healthcare_transaction: isHealthcare,
          involves_facility_change: facilityChange,
          thresholds_used: THRESHOLDS.california
        };
  
      case 'connecticut':
        return {
          filing_required: 
            sellerData.type === 'physician_practice' &&
            (sellerData.physician_count || 0) >= THRESHOLDS.connecticut.physician_count,
          is_physician_practice: sellerData.type === 'physician_practice',
          physician_count: sellerData.physician_count || 0,
          thresholds_used: THRESHOLDS.connecticut
        };
  
      default:
        throw new Error(`Unsupported healthcare jurisdiction: ${jurisdiction}`);
    }
  }
  
  // ============================
  // Comprehensive Filing Analysis
  // ============================
  export function determineFilingRequirements(buyerData, sellerData, options = {}) {
    try {
      validateCompanyData(buyerData);
      validateCompanyData(sellerData);
  
      const {
        checkHealthcare = true,
        considerJointVenture = false,
        transactionValue = sellerData.size_of_transaction.numeric.us
      } = options;
  
      // Market analysis
      const marketOverlaps = calculateMarketShareOverlap(buyerData, sellerData);
      const significantOverlaps = Object.entries(marketOverlaps).reduce((acc, [region, segments]) => {
        acc[region] = Object.entries(segments).filter(([_, data]) => data.is_significant);
        return acc;
      }, {});
  
      const requirements = {
        us: {
            hsr: calculateHSRFiling(buyerData, sellerData, transactionValue),
            healthcare: checkHealthcare ? {
              california: calculateHealthcareFiling(buyerData, sellerData, 'california'),
              connecticut: calculateHealthcareFiling(buyerData, sellerData, 'connecticut')
            } : null
          },
          eu: calculateEUFiling(buyerData, sellerData),
          uk: calculateUKFiling(buyerData, sellerData),
          comesa: calculateCOMESAFiling(buyerData, sellerData),
          brazil: calculateBrazilFiling(buyerData, sellerData),
          
          market_analysis: {
            overlaps: marketOverlaps,
            significant_overlaps: significantOverlaps,
            highest_combined_share: findHighestCombinedShare(marketOverlaps),
            highest_hhi_delta: findHighestHHIDelta(marketOverlaps)
          },
    
          transaction_characteristics: {
            joint_venture: considerJointVenture,
            transaction_value: transactionValue,
            sector_overlap: buyerData.sector === sellerData.sector,
            vertical_relationships: findVerticalRelationships(buyerData, sellerData)
          },
    
          metadata: {
            calculation_date: new Date().toISOString(),
            thresholds_version: '2024-01',
            options_used: {
              checkHealthcare,
              considerJointVenture
            }
          }
        };
    
        return requirements;
      } catch (error) {
        console.error('Error determining filing requirements:', error);
        throw new Error(`Filing determination failed: ${error.message}`);
      }
    }
    
    // ============================
    // Additional Helper Functions
    // ============================
    function findHighestCombinedShare(marketOverlaps) {
      let highest = {
        value: 0,
        region: null,
        segment: null
      };
    
      Object.entries(marketOverlaps).forEach(([region, segments]) => {
        Object.entries(segments).forEach(([segment, data]) => {
          if (data.combined_share > highest.value) {
            highest = {
              value: data.combined_share,
              region,
              segment
            };
          }
        });
      });
    
      return highest;
    }
    
    function findHighestHHIDelta(marketOverlaps) {
      let highest = {
        value: 0,
        region: null,
        segment: null
      };
    
      Object.entries(marketOverlaps).forEach(([region, segments]) => {
        Object.entries(segments).forEach(([segment, data]) => {
          if (data.hhi_delta > highest.value) {
            highest = {
              value: data.hhi_delta,
              region,
              segment
            };
          }
        });
      });
    
      return highest;
    }
    
    function findVerticalRelationships(buyerData, sellerData) {
      const relationships = [];
    
      // Check vertical relationships in each country
      Object.entries(buyerData.jurisdictional_presence?.countries || {}).forEach(([country, buyerCountry]) => {
        const sellerCountry = sellerData.jurisdictional_presence?.countries?.[country];
        if (sellerCountry) {
          const buyerRelations = buyerCountry.vertical_relationships || [];
          const sellerRelations = sellerCountry.vertical_relationships || [];
          
          // Check if buyer appears in seller's relationships or vice versa
          const vertical = buyerRelations.some(rel => 
            sellerRelations.includes(rel) ||
            sellerRelations.some(sRel => sRel.toLowerCase().includes(rel.toLowerCase()))
          );
    
          if (vertical) {
            relationships.push({
              country,
              buyer_relationships: buyerRelations,
              seller_relationships: sellerRelations
            });
          }
        }
      });
    
      return relationships;
    }
    
    // ============================
    // Export Everything
    // ============================
    export {
      // Constants
    
      // Core Analysis Functions
  
 
 


     
  

 
   
      
      // Main Entry Point
      determineFilingRequirements as default
    };  

