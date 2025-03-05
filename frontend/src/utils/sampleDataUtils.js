// src/utils/sampleDataUtils.js

export const processImportData = (data) => {
    try {
        const categoryCounters = {};
        const parentIdMapping = new Map();
        const amendmentCounters = new Map();
        const childCounters = new Map();
        
        // First pass - process parent records
        let processedData = data.map(agreement => {
            if (agreement.family_role === 'parent') {
                if (!categoryCounters[agreement.taxonomy_category]) {
                    categoryCounters[agreement.taxonomy_category] = 1;
                }
                const counter = categoryCounters[agreement.taxonomy_category]++;
                const sequenceNumber = String(counter).padStart(4, '0');
                const newParentId = `${agreement.taxonomy_category}${sequenceNumber}-P`;
                
                parentIdMapping.set(agreement.title, newParentId);
                
                return {
                    agreement_id: newParentId,
                    original_parent_id: agreement.parent_id,
                    ...agreement
                };
            }
            return agreement;
        });

        // Second pass - process child records
        processedData = processedData.map(agreement => {
            if (agreement.family_role === 'child') {
                const parentRecord = processedData.find(
                    parent => parent.family_role === 'parent' && 
                            parent.taxonomy_category === agreement.taxonomy_category &&
                            parent.counterparty === agreement.counterparty
                );
                
                const parentId = parentRecord ? parentRecord.agreement_id : agreement.parent_id;
                
                if (!childCounters.has(parentId)) {
                    childCounters.set(parentId, 1);
                }
                const childNumber = childCounters.get(parentId);
                childCounters.set(parentId, childNumber + 1);
                
                const agreement_id = `${agreement.taxonomy_category}C${childNumber}(${parentId})`;
                
                return {
                    agreement_id,
                    original_parent_id: agreement.parent_id,
                    ...agreement
                };
            }
            return agreement;
        });

        // Third pass - process amendments
        processedData = processedData.map(agreement => {
            if (agreement.family_role === 'amends') {
                const targetId = agreement.amends_id;
                
                if (!amendmentCounters.has(targetId)) {
                    amendmentCounters.set(targetId, 1);
                }
                const amendmentNumber = amendmentCounters.get(targetId);
                amendmentCounters.set(targetId, amendmentNumber + 1);

                const agreement_id = `${agreement.taxonomy_category}.A${amendmentNumber}(${targetId})`;
                
                return {
                    agreement_id,
                    amends_id: targetId,
                    amendment_number: amendmentNumber,
                    ...agreement
                };
            }
            return agreement;
        });

        return processedData;
    } catch (error) {
        console.error('Error processing data:', error);
        throw error;
    }
};
