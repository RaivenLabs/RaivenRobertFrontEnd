// data/buyingCompanyData.js

export const buyingCompanies = {
  "artemis": {
    name: "Artemis Pharmaceuticals",
    sector: "Healthcare/Pharmaceuticals",
    is_manufacturer: false,
    size_of_person: {
      annual_net_sales: {
        formatted: "$4.5B",
        numeric: 4500000000
      },
      total_assets: {
        formatted: "$3.8B",
        numeric: 3800000000
      }
    },
    size_of_transaction: {
        formatted: {
          global: "$520M",  // Setting this to match Hippocrates deal
          us: "$520M"
        },
        numeric: {
          global: 520000000,
          us: 520000000
        }
    },
    revenue: {
      global: "$4.5B",
      us: "$2.1B",
      eu: "€1.5B",
      numeric: {
        global: 4500000000,
        us: 2100000000,
        eu: 1500000000
      }
    },
    employees: {
      global: 15000,
      us: 7500,
      eu: 4500,
      countries: {
        germany: 1800,
        france: 1500,
        italy: 1200
      }
    },
    locations: {
      headquarters: "Boston, USA",
      major_presence: ["USA", "EU", "Asia Pacific"]
    },
    subsidiaries: [
      "Artemis Research Labs",
      "Global Biotech Solutions",
      "MedTech Innovations"
    ],
    icon: "💊",
    key_markets: ["Pharmaceuticals", "Biotechnology", "Medical Devices"],
    compliance_status: "Current",
    last_updated: "2024-01-15",
    assets: {
      global: "$3.8B",
      us: "$1.8B",
      eu: "€1.2B",
      numeric: {
        global: 3800000000,
        us: 1800000000,
        eu: 1200000000
      }
    },
    market_share: {
      us: {
        pharmaceuticals: 0.15,
        biotechnology: 0.12,
        medical_devices: 0.10
      },
      eu: {
        pharmaceuticals: 0.13,
        biotechnology: 0.11,
        medical_devices: 0.09
      }
    },
    projects: {
      Hamilton: {
        projectName: "Hamilton",
        targetCompany: "alexandria",
        dateCreated:  1705860000000,
        status: "active"
      }
    },



    jurisdictional_presence: {
      countries: {
        usa: {
          revenue: 2100000000,
          employees: 7500,
          assets: 1800000000,
          blocks: ['nafta']
        },
        germany: {
          revenue: 600000000,
          employees: 1800,
          assets: 400000000,
          blocks: ['eu', 'eea']
        },
        france: {
          revenue: 500000000,
          employees: 1500,
          assets: 350000000,
          blocks: ['eu', 'eea']
        },
        italy: {
          revenue: 400000000,
          employees: 1200,
          assets: 450000000,
          blocks: ['eu', 'eea']
        }
      }
    }
  },
  "hermes": {
    name: "Hermes Recreation",
    sector: "Recreational Equipment",
    is_manufacturer: true,
    size_of_person: {
      annual_net_sales: {
        formatted: "$3.2B",
        numeric: 3200000000
      },
      total_assets: {
        formatted: "$2.5B",
        numeric: 2500000000
      }
    },
    size_of_transaction: {
        formatted: {
          global: "$200M",  // Setting this to match Olympus deal
          us: "$200M"
        },
        numeric: {
          global: 200000000,
          us: 200000000
        }
    },
    revenue: {
      global: "$3.2B",
      us: "$1.5B",
      eu: "€1.0B",
      numeric: {
        global: 3200000000,
        us: 1500000000,
        eu: 1000000000
      }
    },
    employees: {
      global: 12000,
      us: 5000,
      eu: 4000,
      countries: {
        germany: 1600,
        france: 1400,
        austria: 1000
      }
    },
    locations: {
      headquarters: "Denver, USA",
      major_presence: ["USA", "Canada", "EU", "Australia"]
    },
    subsidiaries: [
      "Adventure Gear Co",
      "Mountain Sports Inc",
      "Outdoor Technologies"
    ],
    icon: "🏃",
    key_markets: ["Outdoor Equipment", "Sportswear", "Camping Gear"],
    compliance_status: "Current",
    last_updated: "2024-01-10",
    assets: {
      global: "$2.5B",
      us: "$1.2B",
      eu: "€0.8B",
      numeric: {
        global: 2500000000,
        us: 1200000000,
        eu: 800000000
      }
    },
    market_share: {
      us: {
        outdoor_equipment: 0.18,
        sportswear: 0.12,
        camping_gear: 0.15
      },
      eu: {
        outdoor_equipment: 0.16,
        sportswear: 0.10,
        camping_gear: 0.14
      }
    },
    projects: {
      Redwood: {
        projectName: "Redwood",
        targetCompany: "hippocrates",
        dateCreated:  1705860000000,
        status: "active"
      }
    },

    jurisdictional_presence: {
      countries: {
        usa: {
          revenue: 1500000000,
          employees: 5000,
          assets: 1200000000,
          blocks: ['nafta']
        },
        germany: {
          revenue: 400000000,
          employees: 1600,
          assets: 300000000,
          blocks: ['eu', 'eea']
        },
        france: {
          revenue: 350000000,
          employees: 1400,
          assets: 250000000,
          blocks: ['eu', 'eea']
        },
        austria: {
          revenue: 250000000,
          employees: 1000,
          assets: 250000000,
          blocks: ['eu', 'eea']
        }
      }
    }
  },
  "minerva": {
    name: "Minerva EdTech",
    sector: "Educational Technology",
    is_manufacturer: false,
    size_of_person: {
      annual_net_sales: {
        formatted: "$2.8B",
        numeric: 2800000000
      },
      total_assets: {
        formatted: "$2.0B",
        numeric: 2000000000
      }
    },
    size_of_transaction: {
        formatted: {
          global: "$180M",  // Setting this to match Alexandria deal
          us: "$180M"
        },
        numeric: {
          global: 180000000,
          us: 180000000
        }
    },
    revenue: {
      global: "$2.8B",
      us: "$1.2B",
      eu: "€800M",
      numeric: {
        global: 2800000000,
        us: 1200000000,
        eu: 800000000
      }
    },
    employees: {
      global: 8000,
      us: 3500,
      eu: 2500,
      countries: {
        germany: 1000,
        france: 800,
        uk: 700
      }
    },
    locations: {
      headquarters: "San Francisco, USA",
      major_presence: ["USA", "EU", "UK", "India"]
    },
    subsidiaries: [
      "Digital Learning Systems",
      "EduTech Solutions",
      "Learning Analytics Co"
    ],
    icon: "📚",
    key_markets: ["K-12 Education", "Higher Education", "Corporate Training"],
    compliance_status: "Current",
    last_updated: "2024-01-12",
    assets: {
      global: "$2.0B",
      us: "$900M",
      eu: "€600M",
      numeric: {
        global: 2000000000,
        us: 900000000,
        eu: 600000000
      }
    },
    market_share: {
      us: {
        k12_education: 0.14,
        higher_education: 0.12,
        corporate_training: 0.10
      },
      eu: {
        k12_education: 0.11,
        higher_education: 0.09,
        corporate_training: 0.08
      }
    },
    projects: {
      Jefferson: {
        projectName: "Jefferson",
        targetCompany: "olympus",
        dateCreated:  1705860000000,
        status: "active"
      }
    },


    jurisdictional_presence: {
      countries: {
        usa: {
          revenue: 1200000000,
          employees: 3500,
          assets: 900000000,
          blocks: ['nafta']
        },
        germany: {
          revenue: 300000000,
          employees: 1000,
          assets: 200000000,
          blocks: ['eu', 'eea']
        },
        france: {
          revenue: 250000000,
          employees: 800,
          assets: 150000000,
          blocks: ['eu', 'eea']
        },
        uk: {
          revenue: 250000000,
          employees: 700,
          assets: 250000000,
          blocks: ['uk']
        }
      }
    }
  }
};
