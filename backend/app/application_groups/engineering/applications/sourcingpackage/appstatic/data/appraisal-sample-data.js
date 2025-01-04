// sample_data.js

const appraisalData = {
    metadata: {
        lastUpdated: "2024-12-04",
        totalRecords: 3,
        departments: ["Risk & Compliance", "Corporate", "Human Resources"],
        designations: {
            professional: ["Associate", "Partner", "Senior Associate"],
            staff: ["Executive", "Assistant"]
        }
    },
    recipients: [
        {
            recordId: "DEN24001",
            email: "sample1@dentons.com",
            preferredFirstName: "Sample",
            preferredLastName: "One",
            department: "Risk & Compliance",
            designation: "Executive",
            role: "Staff",  // Added role distinction
            jobTitle: "Risk, Compliance and Conflicts Executive",
            selfAppraisalRequired: true,
            evaluatorRequired: false,  // matches your "no" in sample
            appraisalOrdinal: 1,
            fullNameDept: "Sample One - Risk & Compliance",
            status: "Pending"
        },
        {
            recordId: "DEN24002",
            email: "sample2@dentons.com",
            preferredFirstName: "Sample",
            preferredLastName: "Two",
            department: "Corporate",
            designation: "Associate",
            role: "Professional",  // Added role distinction
            jobTitle: "Corporate Associate",
            selfAppraisalRequired: true,
            evaluatorRequired: true,  // matches your "yes" in sample
            appraisalOrdinal: 3,
            fullNameDept: "Sample Two - Corporate",
            status: "Pending"
        },
        {
            recordId: "DEN24003",
            email: "sample3@dentons.com",
            preferredFirstName: "Sample",
            preferredLastName: "Three",
            department: "Human Resources",
            designation: "Assistant",
            role: "Staff",  // Added role distinction
            jobTitle: "Human Resources Assistant",
            selfAppraisalRequired: true,
            evaluatorRequired: false,  // matches your "no" in sample
            appraisalOrdinal: 1,
            fullNameDept: "Sample Three - Human Resources",
            status: "Pending"
        }
    ],
    filters: {
        roles: ["Professional", "Staff"],
        departments: ["Risk & Compliance", "Corporate", "Human Resources"],
        statuses: ["Pending", "Sent", "Completed"]
    },
    helpers: {
        filterByRole: (role) => {
            return appraisalData.recipients.filter(r => r.role === role);
        },
        filterByDepartment: (dept) => {
            return appraisalData.recipients.filter(r => r.department === dept);
        },
        getProfessionalStaff: () => {
            return appraisalData.recipients.filter(r => r.role === "Professional");
        },
        getSupportStaff: () => {
            return appraisalData.recipients.filter(r => r.role === "Staff");
        }
    }
};

export { appraisalData };