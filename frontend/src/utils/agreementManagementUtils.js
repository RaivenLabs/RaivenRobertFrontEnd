// src/utils/agreementUtils.js

// Helper function to get all children of a parent agreement
export const getChildren = (agreements, parentId) => {
    return agreements.filter(agreement => 
        agreement.family_role === 'child' && 
        agreement.agreement_id.includes(parentId)
    );
};

// Helper function to get all amendments for an agreement
export const getAmendments = (agreements, agreementId) => {
    return agreements.filter(agreement =>
        agreement.family_role === 'amends' &&
        agreement.amends_id === agreementId
    );
};

// Helper function to get complete family tree for an agreement
export const getFamilyTree = (agreements, parentId) => {
    const parent = agreements.find(a => a.agreement_id === parentId);
    if (!parent) return null;

    const children = getChildren(agreements, parentId);
    const amendments = getAmendments(agreements, parentId);

    return {
        ...parent,
        children: children.map(child => ({
            ...child,
            amendments: getAmendments(agreements, child.agreement_id)
        })),
        amendments: amendments
    };
};

// Other helper functions as needed...
