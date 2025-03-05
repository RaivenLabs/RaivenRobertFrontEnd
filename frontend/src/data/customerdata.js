

const customerData = [
    {
        customer_id: "LAW001",
        company_name: "Eversheds Sutherland",
        overview: {
            industry: "Legal Services",
            category: "Global Law Firm",
            status: "Active",
            region: "Global",
            annual_revenue: "$1B+",
            relationship_start: "2017-02-01",
            account_manager: "Sarah Phillips"
        },
        key_metrics: {
            global_presence: {
                countries: 30,
                offices: 70,
                regions: ["Europe", "Asia", "North America", "Middle East", "Africa"]
            },
            practice_areas: [
                { name: "Energy and Infrastructure", expertise_level: "Tier 1" },
                { name: "Financial Services", expertise_level: "Tier 1" },
                { name: "Technology and Digital Transformation", expertise_level: "Tier 1" },
                { name: "Corporate and Commercial", expertise_level: "Tier 1" },
                { name: "Employment Law", expertise_level: "Tier 1" }
            ],
            risk_rating: "Low",
            engagement_level: "Strategic"
        },
        milestones: [
            { year: 1992, event: "Formal integration into single national practice" },
            { year: 1995, event: "Beginning of European expansion" },
            { year: 2017, event: "Merger with Sutherland Asbill & Brennan" }
        ],
        contacts: [
            {
                id: "CON001",
                name: "Lee Ranson",
                title: "Co-CEO",
                email: "leeranson@eversheds-sutherland.com",
                location: "London",
                primary: true
            },
            {
                id: "CON002",
                name: "Mark Wasserman",
                title: "Co-CEO",
                email: "markwasserman@eversheds-sutherland.com",
                location: "Atlanta",
                primary: true
            }
        ],
        services: {
            consulting: {
                name: "Eversheds Consulting",
                services: ["Legal Operations", "Risk Management", "Regulatory Compliance"]
            },
            technology: {
                name: "Legal Technology Solutions",
                features: ["Document Automation", "Data Analytics", "Client Collaboration Tools"]
            }
        },
        innovation: {
            technology: ["AI-powered legal tools", "Digital collaboration platforms", "Document automation systems"],
            sustainability: ["Environmental initiatives", "Diversity and inclusion programs", "Talent development"]
        }
    },

    {
        customer_id: "IND001",
        company_name: "3M Company",
        overview: {
            industry: "Manufacturing",
            category: "Diversified Industrial",
            status: "Active",
            region: "Global",
            annual_revenue: "$35B+",
            relationship_start: "2010-06-15",
            account_manager: "John Carter"
        },
        key_metrics: {
            global_presence: {
                countries: 70,
                offices: 200,
                regions: ["North America", "Europe", "Asia Pacific", "Middle East", "South America"]
            },
            practice_areas: [
                { name: "Healthcare Solutions", expertise_level: "Tier 1" },
                { name: "Safety & Industrial", expertise_level: "Tier 1" },
                { name: "Consumer Goods", expertise_level: "Tier 1" },
                { name: "Transportation & Electronics", expertise_level: "Tier 1" }
            ],
            risk_rating: "Medium",
            engagement_level: "Strategic"
        },
        milestones: [
            { year: 1902, event: "Founded as Minnesota Mining and Manufacturing Company" },
            { year: 1948, event: "Launch of Scotch Tape product line" },
            { year: 1960, event: "Introduction of the first commercial photocopier" },
            { year: 2000, event: "Expansion into healthcare technology" }
        ],
        contacts: [
            {
                id: "CON005",
                name: "Mike Roman",
                title: "CEO",
                email: "mike.roman@mmm.com",
                location: "St. Paul, MN",
                primary: true
            },
            {
                id: "CON006",
                name: "Monica Patel",
                title: "Senior VP, Global Operations",
                email: "monica.patel@mmm.com",
                location: "London",
                primary: false
            }
        ],
        services: {
            consulting: {
                name: "3M Operational Consulting",
                services: [
                    "Lean Manufacturing",
                    "Process Optimization",
                    "Workplace Safety Programs"
                ]
            },
            technology: {
                name: "3M Technology Services",
                features: [
                    "Materials Science Innovation",
                    "Digital Manufacturing Platforms",
                    "AI-Powered Supply Chain Solutions"
                ]
            }
        },
        innovation: {
            technology: [
                "Nanotechnology for advanced materials",
                "AI-powered predictive maintenance",
                "Wearable safety devices for industrial workers"
            ],
            sustainability: [
                "Carbon footprint reduction initiatives",
                "Circular economy programs",
                "Sustainable packaging innovations"
            ]
        }
    },
    




    {customer_id: "RET001",
        company_name: "Nike, Inc.",
        overview: {
            industry: "Retail",
            category: "Sportswear and Footwear",
            status: "Active",
            region: "Global",
            annual_revenue: "$50B+",
            relationship_start: "2012-03-10",
            account_manager: "Laura Hernandez"
        },
        key_metrics: {
            global_presence: {
                countries: 120,
                offices: 75,
                regions: ["North America", "Europe", "Asia Pacific", "Middle East", "South America", "Africa"]
            },
            practice_areas: [
                { name: "Athletic Footwear", expertise_level: "Tier 1" },
                { name: "Sports Apparel", expertise_level: "Tier 1" },
                { name: "Digital Retail", expertise_level: "Tier 1" },
                { name: "Sustainable Manufacturing", expertise_level: "Tier 1" }
            ],
            risk_rating: "Low",
            engagement_level: "Strategic"
        },
        milestones: [
            { year: 1964, event: "Founded as Blue Ribbon Sports" },
            { year: 1971, event: "Rebranded as Nike, Inc. and introduced the iconic swoosh logo" },
            { year: 1988, event: "Launched the 'Just Do It' campaign" },
            { year: 2020, event: "Expanded into digital fitness and wellness apps" }
        ],
        contacts: [
            {
                id: "CON007",
                name: "John Donahoe",
                title: "CEO",
                email: "john.donahoe@nike.com",
                location: "Beaverton, OR",
                primary: true
            },
            {
                id: "CON008",
                name: "Ann Hebert",
                title: "VP of North America",
                email: "ann.hebert@nike.com",
                location: "New York, NY",
                primary: false
            }
        ],
        services: {
            consulting: {
                name: "Nike Brand Strategy Consulting",
                services: [
                    "Retail Optimization",
                    "Global Branding Campaigns",
                    "Consumer Insights and Analytics"
                ]
            },
            technology: {
                name: "Nike Digital Solutions",
                features: [
                    "Mobile Fitness Apps",
                    "AI-Driven Personalized Shopping",
                    "E-commerce Platforms"
                ]
            }
        },
        innovation: {
            technology: [
                "3D-printed footwear prototypes",
                "AI-powered customer personalization",
                "Self-lacing shoes for athletes"
            ],
            sustainability: [
                "Move to Zero initiative for zero waste and zero carbon",
                "Recycled materials in manufacturing",
                "Sustainable supply chain innovations"
            ]
        
        }
    },
    





    
    {
        customer_id: "LAW002",
        company_name: "Dentons",
        overview: {
            industry: "Legal Services",
            category: "Global Law Firm",
            status: "Active",
            region: "Global",
            annual_revenue: "$2.9B+",
            relationship_start: "2015-01-01",
            account_manager: "Michael Roberts"
        },
        key_metrics: {
            global_presence: {
                countries: 83,
                offices: 200,
                regions: [
                    "North America",
                    "Europe",
                    "Asia Pacific",
                    "Middle East",
                    "Africa",
                    "Central Asia",
                    "Latin America & Caribbean"
                ]
            },
            practice_areas: [
                { name: "Banking and Finance", expertise_level: "Tier 1" },
                { name: "Corporate/M&A", expertise_level: "Tier 1" },
                { name: "Real Estate", expertise_level: "Tier 1" },
                { name: "Energy", expertise_level: "Tier 1" },
                { name: "Litigation and Dispute Resolution", expertise_level: "Tier 1" }
            ],
            risk_rating: "Low",
            engagement_level: "Strategic"
        },
        milestones: [
            { year: 2013, event: "Formation of Dentons through three-way merger" },
            { year: 2015, event: "Merger with Dacheng Law Offices in China" },
            { year: 2020, event: "Launch of Dentons Global Advisors" }
        ],
        contacts: [
            {
                id: "CON003",
                name: "Elliott Portnoy",
                title: "Global CEO",
                email: "elliott.portnoy@dentons.com",
                location: "Washington, DC",
                primary: true
            },
            {
                id: "CON004",
                name: "Joe Andrew",
                title: "Global Chairman",
                email: "joe.andrew@dentons.com",
                location: "Washington, DC",
                primary: true
            }
        ],
        services: {
            consulting: {
                name: "Dentons Global Advisors",
                services: ["Strategic Communications", "Government Relations", "Business Advisory"]
            },
            technology: {
                name: "NextLaw Labs",
                features: ["Legal Tech Investment", "Innovation Partnerships", "Digital Transformation"]
            }
        },
        innovation: {
            technology: ["Dentons DNA (Digital News Alerts)", "NextLaw Labs technology accelerator"],
            sustainability: ["Global ESG practice", "Pro bono initiatives", "Diversity and inclusion programs"]
        }
    }
];


// Helper Functions

// Get customer by ID
const getCustomerById = (customerId) => {
    return customerData.find(customer => customer.customer_id === customerId);
};

// Get customers by status
const getCustomersByStatus = (status) => {
    return customerData.filter(customer => 
        customer.status.toLowerCase() === status.toLowerCase()
    );
};

// Get customers by region
const getCustomersByRegion = (region) => {
    return customerData.filter(customer => 
        customer.region.toLowerCase() === region.toLowerCase()
    );
};

// Get customers by industry
const getCustomersByIndustry = (industry) => {
    return customerData.filter(customer => 
        customer.industry.toLowerCase() === industry.toLowerCase()
    );
};

// Get customers by engagement level
const getCustomersByEngagementLevel = (level) => {
    return customerData.filter(customer => 
        customer.engagement_level.toLowerCase() === level.toLowerCase()
    );
};

// Get customer's primary contact
const getPrimaryContact = (customerId) => {
    const customer = getCustomerById(customerId);
    return customer?.contacts.find(contact => contact.primary === true);
};

// Get all contacts for a customer
const getCustomerContacts = (customerId) => {
    const customer = getCustomerById(customerId);
    return customer?.contacts || [];
};

// Get customers by account manager
const getCustomersByAccountManager = (manager) => {
    return customerData.filter(customer => 
        customer.account_manager.toLowerCase() === manager.toLowerCase()
    );
};

// Get customers by risk rating
const getCustomersByRiskRating = (rating) => {
    return customerData.filter(customer => 
        customer.risk_rating.toLowerCase() === rating.toLowerCase()
    );
};

// Get customers with recent reviews (within last X days)
const getCustomersWithRecentReviews = (days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return customerData.filter(customer => {
        const reviewDate = new Date(customer.last_review);
        return reviewDate >= cutoffDate;
    });
};

// Get firm historical information
const getFirmHistory = (customerId) => {
    const customer = getCustomerById(customerId);
    return customer?.firm_profile || null;
};

// Get practice areas by expertise level
const getPracticeAreasByTier = (customerId, tier) => {
    const customer = getCustomerById(customerId);
    return customer?.practice_areas.filter(practice => 
        practice.expertise_level === tier
    ) || [];
};

// Get innovation initiatives by category
const getInnovationInitiatives = (customerId, category) => {
    const customer = getCustomerById(customerId);
    return customer?.innovation_initiatives[category] || [];
};

// Get service offerings
const getServiceOfferings = (customerId) => {
    const customer = getCustomerById(customerId);
    return customer?.service_offerings || null;
};

// Get global presence details
const getGlobalPresence = (customerId) => {
    const customer = getCustomerById(customerId);
    return customer?.firm_profile.global_presence || null;
};

// Get all unique regions
const getUniqueRegions = () => {
    return [...new Set(customerData.map(customer => customer.region))];
};

// Get all unique industries
const getUniqueIndustries = () => {
    return [...new Set(customerData.map(customer => customer.industry))];
};

// Generate customer metrics
const generateCustomerMetrics = () => {
    return {
        totalCustomers: customerData.length,
        byStatus: {
            active: customerData.filter(c => c.status === 'Active').length,
            inactive: customerData.filter(c => c.status === 'Inactive').length
        },
        byEngagementLevel: {
            strategic: customerData.filter(c => c.engagement_level === 'Strategic').length,
            tactical: customerData.filter(c => c.engagement_level === 'Tactical').length
        },
        byRiskRating: {
            low: customerData.filter(c => c.risk_rating === 'Low').length,
            medium: customerData.filter(c => c.risk_rating === 'Medium').length,
            high: customerData.filter(c => c.risk_rating === 'High').length
        }
    };
};

const compareFirms = (firmId1, firmId2) => {
    const firm1 = getCustomerById(firmId1);
    const firm2 = getCustomerById(firmId2);
    
    if (!firm1 || !firm2) return null;
    
    return {
        globalPresence: {
            firm1: firm1.key_metrics.global_presence,
            firm2: firm2.key_metrics.global_presence
        },
        practiceAreas: {
            firm1: firm1.key_metrics.practice_areas,
            firm2: firm2.key_metrics.practice_areas
        },
        innovation: {
            firm1: firm1.innovation,
            firm2: firm2.innovation
        },
        serviceOfferings: {
            firm1: firm1.services,
            firm2: firm2.services
        }
    };
};


export {
    customerData,
    getCustomerById,
    getCustomersByStatus,
    getCustomersByRegion,
    getCustomersByIndustry,
    getCustomersByEngagementLevel,
    getPrimaryContact,
    getCustomerContacts,
    getCustomersByAccountManager,
    getCustomersByRiskRating,
    getCustomersWithRecentReviews,
    getFirmHistory,
    getPracticeAreasByTier,
    getInnovationInitiatives,
    getServiceOfferings,
    getGlobalPresence,
    getUniqueRegions,
    getUniqueIndustries,
    generateCustomerMetrics,
    compareFirms
};

export default customerData;