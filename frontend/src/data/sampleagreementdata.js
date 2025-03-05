// sampleAgreementData.js

const agreementData = [
    // MSA Family 1 - XYZ Corporation
    {
        "agreement_id": "MSA0001-P",
        "tangible_id": "TT-2023-0001",
        "title": "Master Services Agreement - XYZ Corp",
        "counterparty": "XYZ Corporation",
        "taxonomy_category": "MSA",
        "family_role": "parent",
        "effective_date": "2023-01-01",
        "end_date": "2025-12-31",
        "region": "North America",
        "status": "Active",
        "clm_reference": "CLM-2023-001"
    },
    {
        "agreement_id": "MSAC1(MSA0001-P)",
        "tangible_id": "TT-2023-0002",
        "title": "Statement of Work 1 - Application Development",
        "counterparty": "XYZ Corporation",
        "taxonomy_category": "MSA",
        "family_role": "child",
        "effective_date": "2023-02-01",
        "end_date": "2024-01-31",
        "region": "North America",
        "status": "Active",
        "clm_reference": "CLM-2023-002"
    },
    {
        "agreement_id": "MSA.A1(MSA0001-P)",
        "tangible_id": "TT-2023-0003",
        "title": "Amendment 1 to MSA - Term Extension",
        "counterparty": "XYZ Corporation",
        "taxonomy_category": "MSA",
        "family_role": "amends",
        "amends_id": "MSA0001-P",
        "effective_date": "2023-06-01",
        "end_date": "2025-12-31",
        "region": "North America",
        "status": "Active",
        "clm_reference": "CLM-2023-003"
    },

    // MSA Family 2 - Acme Cloud Services
    {
        "agreement_id": "MSA0002-P",
        "tangible_id": "TT-2023-0004",
        "title": "Master Services Agreement - Acme Cloud",
        "counterparty": "Acme Cloud Services",
        "taxonomy_category": "MSA",
        "family_role": "parent",
        "effective_date": "2023-02-01",
        "end_date": "2026-01-31",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2023-004"
    },
    {
        "agreement_id": "MSAC1(MSA0002-P)",
        "tangible_id": "TT-2023-0005",
        "title": "Cloud Infrastructure Services SOW",
        "counterparty": "Acme Cloud Services",
        "taxonomy_category": "MSA",
        "family_role": "child",
        "effective_date": "2023-02-15",
        "end_date": "2024-02-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2023-005"
    },
    {
        "agreement_id": "MSAC2(MSA0002-P)",
        "tangible_id": "TT-2023-0006",
        "title": "Cloud Security Services SOW",
        "counterparty": "Acme Cloud Services",
        "taxonomy_category": "MSA",
        "family_role": "child",
        "effective_date": "2023-03-01",
        "end_date": "2024-02-28",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2023-006"
    },

    // License Agreement Family 1 - TechCorp
    {
        "agreement_id": "LIC0001-P",
        "tangible_id": "TT-2023-0007",
        "title": "Enterprise License Agreement - TechCorp",
        "counterparty": "TechCorp Global",
        "taxonomy_category": "LICENSE",
        "family_role": "parent",
        "effective_date": "2023-03-01",
        "end_date": "2026-02-28",
        "region": "EMEA",
        "status": "Active",
        "clm_reference": "CLM-2023-007"
    },
    {
        "agreement_id": "LICC1(LIC0001-P)",
        "tangible_id": "TT-2023-0008",
        "title": "Software Module A License",
        "counterparty": "TechCorp Global",
        "taxonomy_category": "LICENSE",
        "family_role": "child",
        "effective_date": "2023-03-15",
        "end_date": "2024-03-14",
        "region": "EMEA",
        "status": "Active",
        "clm_reference": "CLM-2023-008"
    },
    {
        "agreement_id": "LIC.A1(LIC0001-P)",
        "tangible_id": "TT-2023-0009",
        "title": "Amendment 1 - License Extension",
        "counterparty": "TechCorp Global",
        "taxonomy_category": "LICENSE",
        "family_role": "amends",
        "amends_id": "LIC0001-P",
        "effective_date": "2023-04-01",
        "end_date": "2026-02-28",
        "region": "EMEA",
        "status": "Active",
        "clm_reference": "CLM-2023-009"
    },

    // SaaS Agreement Family - CloudTech Solutions
    {
        "agreement_id": "SAAS0001-P",
        "tangible_id": "TT-2023-0010",
        "title": "SaaS Agreement - CloudTech Solutions",
        "counterparty": "CloudTech Solutions",
        "taxonomy_category": "SAAS",
        "family_role": "parent",
        "effective_date": "2023-04-01",
        "end_date": "2026-03-31",
        "region": "North America",
        "status": "Active",
        "clm_reference": "CLM-2023-010"
    },
    {
        "agreement_id": "SAASC1(SAAS0001-P)",
        "tangible_id": "TT-2023-0011",
        "title": "Platform Services Order Form",
        "counterparty": "CloudTech Solutions",
        "taxonomy_category": "SAAS",
        "family_role": "child",
        "effective_date": "2023-04-15",
        "end_date": "2024-04-14",
        "region": "North America",
        "status": "Active",
        "clm_reference": "CLM-2023-011"
    },

    // Consulting Services Agreement - Global Consulting
    {
        "agreement_id": "CSA0001-P",
        "tangible_id": "TT-2023-0012",
        "title": "Consulting Services Agreement - Global Consulting",
        "counterparty": "Global Consulting Partners",
        "taxonomy_category": "CSA",
        "family_role": "parent",
        "effective_date": "2023-05-01",
        "end_date": "2026-04-30",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2023-012"
    },
    {
        "agreement_id": "CSAC1(CSA0001-P)",
        "tangible_id": "TT-2023-0013",
        "title": "Digital Transformation SOW",
        "counterparty": "Global Consulting Partners",
        "taxonomy_category": "CSA",
        "family_role": "child",
        "effective_date": "2023-05-15",
        "end_date": "2024-05-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2023-013"
    },

  
    
        // Microsoft Azure Services Agreement Family
        {
            "agreement_id": "MSA0003-P",
            "tangible_id": "TT-2023-0014",
            "title": "Master Services Agreement - Microsoft Azure",
            "counterparty": "Microsoft Corporation",
            "taxonomy_category": "MSA",
            "family_role": "parent",
            "effective_date": "2023-06-01",
            "end_date": "2026-05-31",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-014"
        },
        {
            "agreement_id": "MSAC1(MSA0003-P)",
            "tangible_id": "TT-2023-0015",
            "title": "Azure Cloud Services Order Form",
            "counterparty": "Microsoft Corporation",
            "taxonomy_category": "MSA",
            "family_role": "child",
            "effective_date": "2023-06-15",
            "end_date": "2024-06-14",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-015"
        },
        {
            "agreement_id": "MSA.A1(MSA0003-P)",
            "tangible_id": "TT-2023-0016",
            "title": "Amendment 1 - Azure Service Level Updates",
            "counterparty": "Microsoft Corporation",
            "taxonomy_category": "MSA",
            "family_role": "amends",
            "amends_id": "MSA0003-P",
            "effective_date": "2023-07-01",
            "end_date": "2026-05-31",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-016"
        },
    
        // Oracle Database License Agreement
        {
            "agreement_id": "LIC0002-P",
            "tangible_id": "TT-2023-0017",
            "title": "Enterprise License Agreement - Oracle Database",
            "counterparty": "Oracle Corporation",
            "taxonomy_category": "LICENSE",
            "family_role": "parent",
            "effective_date": "2023-07-01",
            "end_date": "2026-06-30",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-017"
        },
        {
            "agreement_id": "LICC1(LIC0002-P)",
            "tangible_id": "TT-2023-0018",
            "title": "Database Enterprise Edition License",
            "counterparty": "Oracle Corporation",
            "taxonomy_category": "LICENSE",
            "family_role": "child",
            "effective_date": "2023-07-15",
            "end_date": "2024-07-14",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-018"
        },
    
        // Salesforce CRM Agreement
        {
            "agreement_id": "SAAS0002-P",
            "tangible_id": "TT-2023-0019",
            "title": "Master Subscription Agreement - Salesforce",
            "counterparty": "Salesforce Inc",
            "taxonomy_category": "SAAS",
            "family_role": "parent",
            "effective_date": "2023-08-01",
            "end_date": "2026-07-31",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-019"
        },
        {
            "agreement_id": "SAASC1(SAAS0002-P)",
            "tangible_id": "TT-2023-0020",
            "title": "Sales Cloud Order Form",
            "counterparty": "Salesforce Inc",
            "taxonomy_category": "SAAS",
            "family_role": "child",
            "effective_date": "2023-08-15",
            "end_date": "2024-08-14",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-020"
        },
    
        // ServiceNow ITSM Agreement
        {
            "agreement_id": "SAAS0003-P",
            "tangible_id": "TT-2023-0021",
            "title": "Master Subscription Agreement - ServiceNow",
            "counterparty": "ServiceNow Inc",
            "taxonomy_category": "SAAS",
            "family_role": "parent",
            "effective_date": "2023-09-01",
            "end_date": "2026-08-31",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-021"
        },
        {
            "agreement_id": "SAASC1(SAAS0003-P)",
            "tangible_id": "TT-2023-0022",
            "title": "ITSM Professional Order Form",
            "counterparty": "ServiceNow Inc",
            "taxonomy_category": "SAAS",
            "family_role": "child",
            "effective_date": "2023-09-15",
            "end_date": "2024-09-14",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-022"
        },
    
        // IBM Consulting Services
        {
            "agreement_id": "CSA0002-P",
            "tangible_id": "TT-2023-0023",
            "title": "Professional Services Agreement - IBM",
            "counterparty": "IBM Corporation",
            "taxonomy_category": "CSA",
            "family_role": "parent",
            "effective_date": "2023-10-01",
            "end_date": "2026-09-30",
            "region": "North America",
            "status": "Active",
            "clm_reference": "CLM-2023-023"
        },
        {
            "agreement_id": "CSAC1(CSA0002-P)",
            "tangible_id": "TT-2023-0024",
            "title": "AI Implementation SOW",
            "counterparty": "IBM Corporation",
            "taxonomy_category": "CSA",
            "family_role": "child",
            "effective_date": "2023-10-15",
            "end_date": "2024-10-14",
            "region": "North America",
            "status": "Active",
            "clm_reference": "CLM-2023-024"
        },
    
        // Infosys Development Services
        {
            "agreement_id": "MSA0004-P",
            "tangible_id": "TT-2023-0025",
            "title": "Master Services Agreement - Infosys",
            "counterparty": "Infosys Limited",
            "taxonomy_category": "MSA",
            "family_role": "parent",
            "effective_date": "2023-11-01",
            "end_date": "2026-10-31",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-025"
        },
        {
            "agreement_id": "MSAC1(MSA0004-P)",
            "tangible_id": "TT-2023-0026",
            "title": "Application Development SOW",
            "counterparty": "Infosys Limited",
            "taxonomy_category": "MSA",
            "family_role": "child",
            "effective_date": "2023-11-15",
            "end_date": "2024-11-14",
            "region": "Global",
            "status": "Active",
            "clm_reference": "CLM-2023-026"
        },
      // [Previous entries 1-35 remain exactly the same...]

    // SAP Enterprise Software
    {
        "agreement_id": "ERP0001-P",
        "tangible_id": "TT-2024-0010",
        "title": "Enterprise Software Agreement - SAP",
        "counterparty": "SAP SE",
        "taxonomy_category": "ERP",
        "family_role": "parent",
        "effective_date": "2024-03-01",
        "end_date": "2027-02-28",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-010"
    },
    {
        "agreement_id": "ERPC1(ERP0001-P)",
        "tangible_id": "TT-2024-0011",
        "title": "S/4HANA Cloud Subscription",
        "counterparty": "SAP SE",
        "taxonomy_category": "ERP",
        "family_role": "child",
        "effective_date": "2024-03-15",
        "end_date": "2025-03-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-011"
    },
    {
        "agreement_id": "ERP.A1(ERP0001-P)",
        "tangible_id": "TT-2024-0012",
        "title": "Amendment 1 - Additional User Licenses",
        "counterparty": "SAP SE",
        "taxonomy_category": "ERP",
        "family_role": "amends",
        "amends_id": "ERP0001-P",
        "effective_date": "2024-06-01",
        "end_date": "2027-02-28",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-012"
    },

    // Workday HR/Finance
    {
        "agreement_id": "SAAS0004-P",
        "tangible_id": "TT-2024-0013",
        "title": "Master Subscription Agreement - Workday",
        "counterparty": "Workday Inc",
        "taxonomy_category": "SAAS",
        "family_role": "parent",
        "effective_date": "2024-03-01",
        "end_date": "2027-02-28",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-013"
    },
    {
        "agreement_id": "SAASC1(SAAS0004-P)",
        "tangible_id": "TT-2024-0014",
        "title": "HCM Module Subscription",
        "counterparty": "Workday Inc",
        "taxonomy_category": "SAAS",
        "family_role": "child",
        "effective_date": "2024-03-15",
        "end_date": "2025-03-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-014"
    },
    {
        "agreement_id": "SAASC2(SAAS0004-P)",
        "tangible_id": "TT-2024-0015",
        "title": "Financial Management Subscription",
        "counterparty": "Workday Inc",
        "taxonomy_category": "SAAS",
        "family_role": "child",
        "effective_date": "2024-04-01",
        "end_date": "2025-03-31",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-015"
    },

    // Adobe Creative Cloud
    {
        "agreement_id": "SAAS0005-P",
        "tangible_id": "TT-2024-0016",
        "title": "Enterprise License Agreement - Adobe",
        "counterparty": "Adobe Inc",
        "taxonomy_category": "SAAS",
        "family_role": "parent",
        "effective_date": "2024-04-01",
        "end_date": "2027-03-31",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-016"
    },
    {
        "agreement_id": "SAASC1(SAAS0005-P)",
        "tangible_id": "TT-2024-0017",
        "title": "Creative Cloud Enterprise Subscription",
        "counterparty": "Adobe Inc",
        "taxonomy_category": "SAAS",
        "family_role": "child",
        "effective_date": "2024-04-15",
        "end_date": "2025-04-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-017"
    },

    // Cisco Networking
    {
        "agreement_id": "NET0001-P",
        "tangible_id": "TT-2024-0018",
        "title": "Enterprise Network Agreement - Cisco",
        "counterparty": "Cisco Systems",
        "taxonomy_category": "NETWORK",
        "family_role": "parent",
        "effective_date": "2024-05-01",
        "end_date": "2027-04-30",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-018"
    },
    {
        "agreement_id": "NETC1(NET0001-P)",
        "tangible_id": "TT-2024-0019",
        "title": "Network Equipment Support Services",
        "counterparty": "Cisco Systems",
        "taxonomy_category": "NETWORK",
        "family_role": "child",
        "effective_date": "2024-05-15",
        "end_date": "2025-05-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-019"
    },
    {
        "agreement_id": "NET.A1(NET0001-P)",
        "tangible_id": "TT-2024-0020",
        "title": "Amendment 1 - Service Level Update",
        "counterparty": "Cisco Systems",
        "taxonomy_category": "NETWORK",
        "family_role": "amends",
        "amends_id": "NET0001-P",
        "effective_date": "2024-07-01",
        "end_date": "2027-04-30",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-020"
    },

    // HPE Infrastructure
    {
        "agreement_id": "HW0002-P",
        "tangible_id": "TT-2024-0021",
        "title": "Infrastructure Services Agreement - HPE",
        "counterparty": "Hewlett Packard Enterprise",
        "taxonomy_category": "HARDWARE",
        "family_role": "parent",
        "effective_date": "2024-06-01",
        "end_date": "2027-05-31",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-021"
    },
    {
        "agreement_id": "HWC1(HW0002-P)",
        "tangible_id": "TT-2024-0022",
        "title": "Server Infrastructure Purchase Order",
        "counterparty": "Hewlett Packard Enterprise",
        "taxonomy_category": "HARDWARE",
        "family_role": "child",
        "effective_date": "2024-06-15",
        "end_date": "2025-06-14",
        "region": "Global",
        "status": "Active",
        "clm_reference": "CLM-2024-022"
    }
];

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