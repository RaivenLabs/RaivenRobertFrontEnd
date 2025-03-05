import { Cloud, Building2, Users } from 'lucide-react';


// Program groups configuration
const programGroups = [
    {
      id: 'sourcing',
      name: 'Sourcing Transactions',
      icon: Cloud,
      description: 'Configure templates for SaaS, MSA, and other sourcing agreements'
    },
    {
      id: 'real-estate',
      name: 'Real Estate',
      icon: Building2,
      description: 'Set up templates for leases and property transactions'
    },
    {
      id: 'hr',
      name: 'HR & Employment',
      icon: Users,
      description: 'Manage employment and benefits agreement templates'
    }
  ];
  
  // Agreement types configuration
  const agreementTypes = [
    {
      id: 'parent',
      name: 'Parent Agreements',
      description: 'Master agreements that establish relationship terms'
    },
    {
      id: 'order',
      name: 'Order Forms',
      description: 'Order forms that reference parent agreements'
    }
  ];
  
  // Program classes configuration with parent/order distinction
  //Note well:  The program class id in this file must match the program class in the template registry file because that is a concatenation of the file name.  The fiel name in turn is teablsihed by the new tempalte fucntionality.  ANy file that is uplaoded should follow the namign conventiosn in the template directories.
  const programClasses = {
    'parent': [
      {
        id: 'saas_subscription',
        name: 'SaaS',
        description: 'Software as a Service agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'subscription-only',
            name: 'Subscription Only',
            description: 'Basic SaaS subscription agreement',
            templatePath: 'Foundational/Parents/saas_subscription_template.docx',
            displayOrder: 1
          },
          {
            id: 'subscription-config',
            name: 'Subscription + Configuration',
            description: 'SaaS subscription with professional services',
            templatePath: 'Foundational/Parents/saas_subscription_config_template.docx',
            displayOrder: 2
          }
        ]
      },
      {
        id: 'software_license',
        name: 'Software License',
        description: 'Perpetual software license agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'software_license_template',
            name: 'Perpetual License',
            description: 'Standard perpetual software license',
            templatePath: 'Foundational/Parents/software_license_template.docx',
            displayOrder: 1
          }
        ]
      },
      {
        id: 'Customer Only',
        name: 'Customer Only Confidentiality Agreement',
        description: 'Non-disclosure agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'nda_one_way_template',
            name: 'Customer Only Confidentiality Agreement',
            description: 'Unidirectional confidentiality agreement',
            templatePath: 'Foundational/Parents/nda_one_way_template.docx',
            displayOrder: 1
          }

        ]
      },
      {
            id: 'Mutual Confidentiality',
            name: 'Mutual Confidentiality Agreement',
            description: 'Bilateral non-disclosure agreements',
            group: 'sourcing',
            forms: [


          {
            id: 'nda_bilateral_template',
            name: 'Bilateral NDA',
            description: 'Mutual confidentiality agreement',
            templatePath: 'Foundational/Parents/nda_bilateral_template.docx',
            displayOrder: 2
          }
        ]
      },
      {
        id: 'equipment_purchase',
        name: 'Equipment Purchase',
        description: 'Equipment purchase agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'equipment_purchase_template',
            name: 'Equipment Purchase',
            description: 'Standard equipment purchase agreement',
            templatePath: 'Foundational/Parents/equipment_purchase_template.docx',
            displayOrder: 1
          }
        ]
      },

      {
        id: 'professional_services',
        name: 'Master Services Agreement',
        description: 'Master Services Agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'professional_service_template',
            name: 'Master Services Agreement',
            description: 'Standard Master Services Agreement',
            templatePath: 'Foundational/Parents/professional_services_template.docx',
            displayOrder: 1
          }
        ]
      },

      {
        id: 'reseller_standard',
        name: 'Master Reseller Agreement',
        description: 'Master Reseller Agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'reseller_standard_template',
            name: 'Master Reseller',
            description: 'Standard Master Reseller Agreement',
            templatePath: 'Foundational/Parents/reseller_standard_template.docx',
            displayOrder: 1
          }
        ]
      },

      {
        id: 'tech_evaluation',
        name: 'Technology Evaluation',
        description: 'Technology evaluation agreements',
        group: 'sourcing',
        forms: [
          {
            id: 'tech-evaluation_template',
            name: 'Technology Evaluation',
            description: 'Standard technology evaluation agreement',
            templatePath: 'Foundational/Parents/tech_evaluation_template.docx',
            displayOrder: 1
          }
        ]
      }
    ],
    'order': [
      {
        id: 'eng_us',
        name: 'Engineering Services (US)',
        description: 'US engineering services orders',
        group: 'sourcing',
        forms: [
          {
            id: 'agile-us-order',
            name: 'Agile Services',
            description: 'Order for agile development services',
            templatePath: 'Foundational/Orders/eng_us_agile_template.docx',
            displayOrder: 1,
            parentReferenceId: 'agile-us'
          },
          {
            id: 'resource-us-order',
            name: 'Resource Services',
            description: 'Order for resource-based engineering services',
            templatePath: 'Foundational/Orders/eng_us_resource_template.docx',
            displayOrder: 2,
            parentReferenceId: 'resource-us'
          },
          {
            id: 'project-us-order',
            name: 'Project Services',
            description: 'Order for project-based engineering services',
            templatePath: 'Foundational/Orders/eng_us_project_template.docx',
            displayOrder: 3,
            parentReferenceId: 'project-us'
          },
          {
            id: 'managed-us-order',
            name: 'Managed Services',
            description: 'Order for managed engineering services',
            templatePath: 'Foundational/Orders/eng_us_managed_template.docx',
            displayOrder: 4,
            parentReferenceId: 'managed-us'
          }
        ]
      },
      {
        id: 'eng_india',
        name: 'Engineering Services (India)',
        description: 'India engineering services orders',
        group: 'sourcing',
        forms: [
          {
            id: 'agile-india-order',
            name: 'Agile Services',
            description: 'Order for agile development services',
            templatePath: 'Foundational/Orders/eng_india_agile_template.docx',
            displayOrder: 1,
            parentReferenceId: 'agile-india'
          },
          {
            id: 'resource-india-order',
            name: 'Resource Services',
            description: 'Order for resource-based engineering services',
            templatePath: 'Foundational/Orders/eng_india_resource_template.docx',
            displayOrder: 2,
            parentReferenceId: 'resource-india'
          },
          {
            id: 'project-india-order',
            name: 'Project Services',
            description: 'Order for project-based engineering services',
            templatePath: 'Foundational/Orders/eng_india_project_template.docx',
            displayOrder: 3,
            parentReferenceId: 'project-india'
          },
          {
            id: 'managed-india-order',
            name: 'Managed Services',
            description: 'Order for managed engineering services',
            templatePath: 'Foundational/Orders/eng_india_managed_template.docx',
            displayOrder: 4,
            parentReferenceId: 'managed-india'
          }
        ]
      }
    ]
  };
  
  // Function to fetch available program classes based on selected program group and agreement type
  const getAvailableProgramClasses = (programGroupId, agreementTypeId) => {
    if (!programGroupId || !agreementTypeId) return [];
    
    return programClasses[agreementTypeId]
      .filter(programClass => programClass.group === programGroupId)
      .map(programClass => ({
        id: programClass.id,
        name: programClass.name,
        description: programClass.description
      }));
  };
  
  // Function to fetch available forms based on selected program class and agreement type
  const getAvailableForms = (programClassId, agreementTypeId) => {
    if (!programClassId || !agreementTypeId) return [];
    
    const selectedClassArray = programClasses[agreementTypeId];
    const selectedClass = selectedClassArray.find(cls => cls.id === programClassId);
    
    return selectedClass ? selectedClass.forms : [];
  };

  export {
    programGroups,
    agreementTypes,
    programClasses,
    getAvailableProgramClasses,
    getAvailableForms
  };
