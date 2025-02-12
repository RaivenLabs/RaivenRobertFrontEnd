// src/config/patterns/index.js

export const ENTERPRISE_PATTERNS = {
    RAIVEN: {
      id: 'raiven',
      name: "Raiven",
      purpose: "High-volume transaction processing",
      description: "Streamlines the creation, management, and execution of high-volume transactions and documents with built-in validation and compliance checks.",
      use_cases: [
        "Contract generation",
        "KYC processing",
        "Service orders",
        "Compliance certificates",
        "Document automation",
        "Regulatory filings"
      ],
      key_features: [
        "Template management",
        "Data validation",
        "Batch processing",
        "Audit trails",
        "Version control",
        "Compliance tracking"
      ],
      example_applications: [
        "NDA processing system",
        "Service agreement generator",
        "Customer onboarding workflow",
        "Compliance certification platform",
        "Vendor agreement management"
      ]
    },
  
    VECTOR: {
      id: 'vector',
      name: "Vector",
      purpose: "Legacy data transformation and routing",
      description: "Unlocks and transforms legacy data into structured, API-ready formats while maintaining data integrity and governance.",
      use_cases: [
        "Data migration",
        "System integration",
        "API enablement",
        "Data structuring",
        "Legacy modernization",
        "Data consolidation"
      ],
      key_features: [
        "Data extraction",
        "Format transformation",
        "Routing logic",
        "Payload management",
        "Schema mapping",
        "Data validation"
      ],
      example_applications: [
        "Legacy system modernization",
        "Data lake ingestion",
        "API gateway transformation",
        "Cross-system data sync",
        "Database migration tool"
      ]
    },
  
    JEEVES: {
      id: 'jeeves',
      name: "Jeeves",
      purpose: "Structured checklist management",
      description: "Creates and manages dynamic checklists with evidence collection and verification capabilities for complex processes.",
      use_cases: [
        "Due diligence",
        "Audits",
        "Quality assurance",
        "Safety checks",
        "Compliance verification",
        "Process validation"
      ],
      key_features: [
        "Dynamic checklists",
        "Evidence collection",
        "Progress tracking",
        "Certification generation",
        "Task dependencies",
        "Validation rules"
      ],
      example_applications: [
        "M&A due diligence",
        "Safety inspection system",
        "Quality control process",
        "Audit management platform",
        "Compliance verification tool"
      ]
    },
  
    SENSOR: {
      id: 'sensor',
      name: "Sensor",
      purpose: "Regulatory compliance monitoring",
      description: "Monitors and validates compliance with regulatory standards in real-time, providing gap analysis and remediation tracking.",
      use_cases: [
        "Real-time compliance",
        "Transaction screening",
        "Standard adherence",
        "Gap analysis",
        "Risk monitoring",
        "Regulatory reporting"
      ],
      key_features: [
        "Standard mapping",
        "Current state assessment",
        "Gap identification",
        "Real-time monitoring",
        "Alert generation",
        "Compliance scoring"
      ],
      example_applications: [
        "GDPR compliance monitor",
        "Financial transaction screening",
        "Environmental compliance tracker",
        "Healthcare standards validator",
        "Regulatory reporting system"
      ]
    },
  
    CONCIERGE: {
      id: 'concierge',
      name: "Concierge",
      purpose: "Process orchestration and approval",
      description: "Orchestrates complex approval workflows and processes across multiple systems and stakeholders.",
      use_cases: [
        "Approval workflows",
        "System orchestration",
        "Process coordination",
        "Status tracking",
        "Multi-party workflows",
        "Decision routing"
      ],
      key_features: [
        "Workflow routing",
        "Approval management",
        "System coordination",
        "Status dashboards",
        "Role management",
        "SLA tracking"
      ],
      example_applications: [
        "Purchase order approval",
        "Document review workflow",
        "Change management system",
        "Leave request processor",
        "Project approval system"
      ]
    },
  
    ATLAS: {
      id: 'atlas',
      name: "Atlas",
      purpose: "System and data mapping",
      description: "Maps and manages relationships between enterprise systems, data flows, and dependencies.",
      use_cases: [
        "Enterprise system mapping",
        "Data relationship modeling",
        "Integration planning",
        "System dependencies",
        "Impact analysis",
        "Architecture planning"
      ],
      key_features: [
        "System mapping",
        "Relationship tracking",
        "Dependency management",
        "Impact analysis",
        "Visual modeling",
        "Change tracking"
      ],
      example_applications: [
        "Enterprise architecture mapper",
        "System dependency tracker",
        "Integration blueprint tool",
        "Change impact analyzer",
        "Data flow modeler"
      ]
    },
  
    GUARDIAN: {
      id: 'guardian',
      name: "Guardian",
      purpose: "Security and access management",
      description: "Manages security, access controls, and audit logging across enterprise systems and data.",
      use_cases: [
        "Access control",
        "Data protection",
        "Audit logging",
        "Compliance tracking",
        "Security monitoring",
        "Permission management"
      ],
      key_features: [
        "Permission management",
        "Activity monitoring",
        "Security validation",
        "Audit reporting",
        "Access control",
        "Threat detection"
      ],
      example_applications: [
        "Role-based access control",
        "Security audit system",
        "Data protection platform",
        "Activity monitoring tool",
        "Permission management system"
      ]
    }
  };
  
  // Helper functions
  export const getPatternById = (id) => ENTERPRISE_PATTERNS[id.toUpperCase()];
  
  export const getPatternDescription = (id) => {
    const pattern = getPatternById(id);
    return pattern?.description || '';
  };
  
  export const getPatternExamples = (id) => {
    const pattern = getPatternById(id);
    return pattern?.example_applications || [];
  };
  
  export const getCompatiblePatterns = (primaryPattern) => {
    // Could be expanded with more sophisticated compatibility logic
    const pattern = getPatternById(primaryPattern);
    return Object.values(ENTERPRISE_PATTERNS).filter(p => p.id !== pattern.id);
  };
  
  export const validatePatternForUseCase = (patternId, useCase) => {
    const pattern = getPatternById(patternId);
    return pattern?.use_cases.some(uc => 
      uc.toLowerCase().includes(useCase.toLowerCase())
    );
  };
  
  export default ENTERPRISE_PATTERNS;
