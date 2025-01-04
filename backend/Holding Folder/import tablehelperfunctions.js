// agreementData array remains exactly the same as above, then followed by these helper functions:

// Helper function to get all children of a parent agreement
const getChildren = (parentId) => {
    return agreementData.filter(agreement => 
        agreement.family_role === 'child' && 
        agreement.agreement_id.includes(parentId)
    );
};

// Helper function to get all amendments for an agreement
const getAmendments = (agreementId) => {
    return agreementData.filter(agreement =>
        agreement.family_role === 'amends' &&
        agreement.amends_id === agreementId
    );
};

// Helper function to get complete family tree for an agreement
const getFamilyTree = (parentId) => {
    const parent = agreementData.find(a => a.agreement_id === parentId);
    if (!parent) return null;

    const children = getChildren(parentId);
    const amendments = getAmendments(parentId);

    return {
        ...parent,
        children: children.map(child => ({
            ...child,
            amendments: getAmendments(child.agreement_id)
        })),
        amendments: amendments
    };
};

// Helper function to get all parent agreements
const getParentAgreements = () => {
    return agreementData.filter(agreement => agreement.family_role === 'parent');
};

// Helper function to generate new Tangible ID
const generateTangibleId = () => {
    const year = new Date().getFullYear();
    const lastId = agreementData
        .map(a => parseInt(a.tangible_id.split('-')[2]))
        .sort((a, b) => b - a)[0];
    const newNumber = (lastId + 1).toString().padStart(4, '0');
    return `TT-${year}-${newNumber}`;
};

// Helper function to generate new agreement_id based on family role
const generateAgreementId = (taxonomyCategory, familyRole, parentId = null) => {
    const parentAgreements = agreementData.filter(a => 
        a.taxonomy_category === taxonomyCategory && 
        a.family_role === 'parent'
    );
    
    switch (familyRole) {
        case 'parent':
            const nextParentNum = (parentAgreements.length + 1).toString().padStart(4, '0');
            return `${taxonomyCategory}${nextParentNum}-P`;
            
        case 'child':
            if (!parentId) throw new Error('Parent ID required for child agreements');
            const existingChildren = getChildren(parentId);
            const childNum = existingChildren.length + 1;
            return `${taxonomyCategory}C${childNum}(${parentId})`;
            
        case 'amends':
            if (!parentId) throw new Error('Target ID required for amendments');
            const existingAmendments = getAmendments(parentId);
            const amendNum = existingAmendments.length + 1;
            return `${taxonomyCategory}.A${amendNum}(${parentId})`;
            
        default:
            throw new Error('Invalid family role');
    }
};

// Helper function to validate agreement structure
const validateAgreement = (agreement) => {
    const required = ['agreement_id', 'tangible_id', 'title', 'counterparty', 
                     'taxonomy_category', 'family_role', 'effective_date', 'status'];
    
    const missing = required.filter(field => !agreement[field]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    if (agreement.family_role === 'amends' && !agreement.amends_id) {
        throw new Error('Amendment requires amends_id');
    }
    
    return true;
};

// Helper function to get agreements by counterparty
const getAgreementsByCounterparty = (counterparty) => {
    return agreementData.filter(agreement => 
        agreement.counterparty.toLowerCase() === counterparty.toLowerCase()
    );
};

// Helper function to get agreements by status
const getAgreementsByStatus = (status) => {
    return agreementData.filter(agreement => 
        agreement.status.toLowerCase() === status.toLowerCase()
    );
};

// Helper function to get agreements by date range
const getAgreementsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return agreementData.filter(agreement => {
        const effectiveDate = new Date(agreement.effective_date);
        return effectiveDate >= start && effectiveDate <= end;
    });
};

// Helper function to get all unique counterparties
const getUniqueCounterparties = () => {
    return [...new Set(agreementData.map(agreement => agreement.counterparty))];
};

// Helper function to get all unique taxonomy categories
const getUniqueTaxonomyCategories = () => {
    return [...new Set(agreementData.map(agreement => agreement.taxonomy_category))];
};

// Helper function to search agreements by title or reference
const searchAgreements = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return agreementData.filter(agreement => 
        agreement.title.toLowerCase().includes(term) ||
        agreement.clm_reference.toLowerCase().includes(term) ||
        agreement.agreement_id.toLowerCase().includes(term) ||
        agreement.tangible_id.toLowerCase().includes(term)
    );
};

export {
    agreementData,
    getChildren,
    getAmendments,
    getFamilyTree,
    getParentAgreements,
    generateTangibleId,
    generateAgreementId,
    validateAgreement,
    getAgreementsByCounterparty,
    getAgreementsByStatus,
    getAgreementsByDateRange,
    getUniqueCounterparties,
    getUniqueTaxonomyCategories,
    searchAgreements
};

// If you want a default export as well
export default agreementData;