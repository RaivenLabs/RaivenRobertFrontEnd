// data/targetCompanyData.js

export const targetCompanies = {
    "alexandria": {
      name: "Alexandria Library Systems",
      sector: "Educational Technology",
      is_manufacturer: false,
      size_of_person: {
        annual_net_sales: {
          formatted: "$380M",
          numeric: 380000000
        },
        total_assets: {
          formatted: "$250M",
          numeric: 250000000
        }
      },
      size_of_transaction: {
        formatted: {
          global: "$180M",
          us: "$180M"
        },
        numeric: {
          global: 180000000,
          us: 180000000
        }
      },
      revenue: {
        global: "$380M",
        us: "$200M",
        eu: "€120M",
        numeric: {
          global: 380000000,
          us: 200000000,
          eu: 120000000
        }
      },
      employees: {
        global: 1200,
        us: 600,
        eu: 400,
        countries: {
          germany: 180,
          france: 120,
          italy: 100,
          uk: 80,
          spain: 60
        }
      },
      locations: {
        headquarters: "Austin, USA",
        major_presence: ["USA", "UK", "Germany", "France", "Italy"],
        registered_offices: {
          eu: "Frankfurt, Germany",
          uk: "London, UK",
          us: "Delaware, USA"
        }
      },
      subsidiaries: [
        {
          name: "Digital Archive Solutions",
          location: "Germany",
          revenue: 40000000,
          employees: 80,
          key_contracts: ["German Universities Consortium"]
        },
        {
          name: "EduTech Learning Systems",
          location: "USA",
          revenue: 80000000,
          employees: 200,
          key_contracts: ["US State University Systems"]
        },
        {
          name: "Alexandria Cloud Services",
          location: "UK",
          revenue: 30000000,
          employees: 60,
          key_contracts: ["UK Academic Cloud Initiative"]
        }
      ],
      icon: "📚",
      key_markets: ["Digital Libraries", "Academic Software", "Learning Management"],
      market_share: {
        us: {
          digital_libraries: 0.08,
          learning_management: 0.05,
          academic_software: 0.06
        },
        eu: {
          digital_libraries: 0.06,
          learning_management: 0.04,
          academic_software: 0.05
        },
        uk: {
          digital_libraries: 0.07,
          learning_management: 0.04,
          academic_software: 0.05
        }
      },
      jurisdictional_presence: {
        countries: {
          usa: {
            revenue: 200000000,
            employees: 600,
            assets: 150000000,
            blocks: ['nafta'],
            local_entities: ["Alexandria US Holdings Inc."],
            market_position: "Significant competitor",
            vertical_relationships: ["Content providers", "University systems"]
          },
          germany: {
            revenue: 50000000,
            employees: 180,
            assets: 30000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Alexandria GmbH"],
            market_position: "Growing presence",
            vertical_relationships: ["European academic institutions"]
          },
          france: {
            revenue: 40000000,
            employees: 120,
            assets: 25000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Alexandria France SAS"],
            market_position: "Emerging player",
            vertical_relationships: ["French universities"]
          },
          italy: {
            revenue: 30000000,
            employees: 100,
            assets: 15000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Alexandria Italia S.r.l"],
            market_position: "New entrant",
            vertical_relationships: ["Italian educational institutions"]
          },
          uk: {
            revenue: 35000000,
            employees: 80,
            assets: 20000000,
            blocks: ['uk'],
            local_entities: ["Alexandria UK Ltd"],
            market_position: "Established player",
            vertical_relationships: ["UK universities"]
          }
        }
      },
      assets: {
        global: "$250M",
        us: "$150M",
        eu: "€70M",
        numeric: {
          global: 250000000,
          us: 150000000,
          eu: 70000000
        },
        types: {
          tangible: {
            data_centers: 80000000,
            office_facilities: 40000000,
            equipment: 30000000
          },
          intangible: {
            intellectual_property: 60000000,
            software_licenses: 25000000,
            customer_relationships: 15000000
          }
        }
      },
      projects: {
        Hamilton: {
          projectName: "Hamilton",
          buyingCompany: "artemis",
          dateCreated:  1705860000000,
          status: "active"
        }
      },

      transaction_rationale: {
        strategic_fit: [
          "Market expansion in educational technology",
          "Technology stack complementarity",
          "Geographic market penetration"
        ],
        efficiency_gains: [
          "R&D consolidation",
          "Sales force optimization",
          "Infrastructure sharing"
        ]
      }
    },
  
    "hippocrates": {
      name: "Hippocrates Medical Solutions",
      sector: "Healthcare/Pharmaceuticals",
      is_manufacturer: true,
      size_of_person: {
        annual_net_sales: {
          formatted: "$850M",
          numeric: 850000000
        },
        total_assets: {
          formatted: "$600M",
          numeric: 600000000
        }
      },
      size_of_transaction: {
        formatted: {
          global: "$520M",
          us: "$520M"
        },
        numeric: {
          global: 520000000,
          us: 520000000
        }
      },
      revenue: {
        global: "$850M",
        us: "$400M",
        eu: "€300M",
        numeric: {
          global: 850000000,
          us: 400000000,
          eu: 300000000
        }
      },
      employees: {
        global: 2800,
        us: 1200,
        eu: 1000,
        countries: {
          germany: 400,
          france: 350,
          spain: 250,
          uk: 200,
          italy: 150
        }
      },
      locations: {
        headquarters: "Cambridge, USA",
        major_presence: ["USA", "Germany", "France", "UK"],
        registered_offices: {
          eu: "Munich, Germany",
          uk: "Cambridge, UK",
          us: "Delaware, USA"
        }
      },
      subsidiaries: [
        {
          name: "Clinical Data Systems",
          location: "Germany",
          revenue: 120000000,
          employees: 300,
          key_contracts: ["European Hospital Network"]
        },
        {
          name: "MedTech Research Labs",
          location: "USA",
          revenue: 180000000,
          employees: 400,
          key_contracts: ["US Healthcare Systems"]
        },
        {
          name: "Healthcare Analytics Co",
          location: "UK",
          revenue: 90000000,
          employees: 150,
          key_contracts: ["NHS Framework Agreement"]
        }
      ],
      icon: "⚕️",
      key_markets: ["Clinical Software", "Medical Devices", "Healthcare Analytics"],
      market_share: {
        us: {
          clinical_software: 0.12,
          medical_devices: 0.08,
          healthcare_analytics: 0.09
        },
        eu: {
          clinical_software: 0.10,
          medical_devices: 0.07,
          healthcare_analytics: 0.08
        },
        uk: {
          clinical_software: 0.11,
          medical_devices: 0.06,
          healthcare_analytics: 0.09
        }
      },
      jurisdictional_presence: {
        countries: {
          usa: {
            revenue: 400000000,
            employees: 1200,
            assets: 280000000,
            blocks: ['nafta'],
            local_entities: ["Hippocrates US Inc."],
            market_position: "Major player",
            vertical_relationships: ["Hospitals", "Research institutions"]
          },
          germany: {
            revenue: 120000000,
            employees: 400,
            assets: 80000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Hippocrates GmbH"],
            market_position: "Leading provider",
            vertical_relationships: ["Medical research centers"]
          },
          france: {
            revenue: 100000000,
            employees: 350,
            assets: 70000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Hippocrates France SAS"],
            market_position: "Established player",
            vertical_relationships: ["French hospitals"]
          },
          uk: {
            revenue: 80000000,
            employees: 200,
            assets: 50000000,
            blocks: ['uk'],
            local_entities: ["Hippocrates UK Ltd"],
            market_position: "Growing presence",
            vertical_relationships: ["NHS trusts"]
          }
        }
      },
      assets: {
        global: "$600M",
        us: "$280M",
        eu: "€200M",
        numeric: {
          global: 600000000,
          us: 280000000,
          eu: 200000000
        },
        types: {
          tangible: {
            research_facilities: 200000000,
            medical_equipment: 150000000,
            office_facilities: 50000000
          },
          intangible: {
            patents: 100000000,
            software_ip: 70000000,
            customer_contracts: 30000000
          }
        }
      },
      
      
          projects: {
            Redwood: {
              projectName: "Redwood",
              buyingCompany: "hermes",
              dateCreated:  1705860000000,
              status: "active"
            }
          },

      transaction_rationale: {
        strategic_fit: [
          "Healthcare technology integration",
          "R&D capabilities enhancement",
          "Market consolidation"
        ],
        efficiency_gains: [
          "Research facility optimization",
          "Clinical trial efficiencies",
          "Technology platform integration"
        ]
      }
    },
  
    "olympus": {
      name: "Olympus Performance Gear",
      sector: "Recreational Equipment",
      is_manufacturer: true,
      size_of_person: {
        annual_net_sales: {
          formatted: "$450M",
          numeric: 450000000
        },
        total_assets: {
          formatted: "$300M",
          numeric: 300000000
        }
      },
      size_of_transaction: {
        formatted: {
          global: "$200M",
          us: "$200M"
        },
        numeric: {
          global: 200000000,
          us: 200000000
        }
      },
      revenue: {
        global: "$450M",
        us: "$250M",
        eu: "€150M",
        numeric: {
          global: 450000000,
          us: 250000000,
          eu: 150000000
        }
      },
      employees: {
        global: 1500,
        us: 800,
        eu: 500,
        countries: {
          germany: 200,
          france: 150,
          austria: 150,
          switzerland: 100,
          italy: 100
        }
      },
      locations: {
        headquarters: "Boulder, USA",
        major_presence: ["USA", "Germany", "France", "Austria"],
        registered_offices: {
          eu: "Munich, Germany",
          uk: "London, UK",
          us: "Delaware, USA"
        }
      },
      subsidiaries: [
        {
          name: "Alpine Equipment Co",
          location: "Austria",
          revenue: 60000000,
          employees: 150,
          key_contracts: ["European Alpine Clubs"]
        },
        {
          name: "Peak Performance Systems",
          location: "USA",
          revenue: 100000000,
          employees: 250,
          key_contracts: ["US National Parks"]
        },
        {
          name: "Mountain Tech Innovations",
          location: "Germany",
          revenue: 50000000,
          employees: 120,
          key_contracts: ["German Mountain Sports Federation"]
        }
      ],
      icon: "🏔️",
      key_markets: ["Climbing Equipment", "Winter Sports", "Outdoor Apparel"],
      market_share: {
        us: {
          climbing_equipment: 0.15,
          winter_sports: 0.12,
          outdoor_apparel: 0.08
        },
        eu: {
          climbing_equipment: 0.18,
          winter_sports: 0.14,
          outdoor_apparel: 0.10
        },
        uk: {
          climbing_equipment: 0.12,
          winter_sports: 0.09,
          outdoor_apparel: 0.07
        }
      },
      jurisdictional_presence: {
        countries: {
          usa: {
            revenue: 250000000,
            employees: 800,
            assets: 180000000,
            blocks: ['nafta'],
            local_entities: ["Olympus US Inc."],
            market_position: "Market leader",
            vertical_relationships: ["Retail chains", "Sports facilities"]
          },
          germany: {
            revenue: 60000000,
            employees: 200,
            assets: 35000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Olympus GmbH"],
            market_position: "Premium provider",
            vertical_relationships: ["Alpine associations"]
          },
          austria: {
            revenue: 40000000,
            employees: 150,
            assets: 25000000,
            blocks: ['eu', 'eea'],
            local_entities: ["Olympus Austria GmbH"],
            market_position: "Regional leader",
            vertical_relationships: ["Ski resorts"]
          }
        }
      },
      assets: {
        global: "$300M",
        us: "$180M",
        eu: "€90M",
        numeric: {
          global: 300000000,
          us: 180000000,
          eu: 90000000
        },
        types: {
          tangible: {
            manufacturing_facilities: 100000000,
            warehouses: 80000000,
            retail_locations: 40000000
          },
          intangible: {
            brand_value: 50000000,
            patents: 20000000,
            distribution_networks: 10000000
          }
        }
      },
      projects: {
        Jefferson: {
          projectName: "Jefferson",
          buyingCompany: "minerva",
          dateCreated:  1705860000000,
          status: "active"
        }
      },


      transaction_rationale: {
        strategic_fit: [
          "Product line expansion",
          "Geographic market access",
          "Manufacturing optimization"
        ],
        efficiency_gains: [
          "Supply chain integration",
          "Distribution network optimization",
          "R&D collaboration"
        ]
      }
    }
  };
