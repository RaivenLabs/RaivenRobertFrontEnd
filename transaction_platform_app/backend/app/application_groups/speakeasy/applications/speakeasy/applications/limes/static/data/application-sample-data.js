// appraisal-sample-data.js

const appraisalData = {
    metadata: {
        cycleInfo: {
            cycleId: "2024-H1",
            cycleName: "2024 Mid-Year Review",
            startDate: "2024-06-01",
            dueDate: "2024-06-30",
            status: "Active"
        },
        statistics: {
            totalRecipients: 3,
            completedAppraisals: 0,
            inProgress: 0,
            notStarted: 3,
            overdue: 0
        },
        lastUpdated: "2024-12-04",
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
            role: "Staff",
            jobTitle: "Risk, Compliance and Conflicts Executive",
            appraisalDetails: {
                selfAppraisalRequired: true,
                evaluatorRequired: false,
                dueDate: "2024-06-30",
                startDate: "2024-06-01",
                completionDate: null,
                ordinal: 1,
                status: "Not Started",
                progress: 0,
                evaluator: null,
                lastAction: null
            },
            previousAppraisals: [
                {
                    cycleId: "2023-H2",
                    status: "Completed",
                    rating: "Meets Expectations",
                    completionDate: "2023-12-15"
                }
            ],
            fullNameDept: "Sample One - Risk & Compliance",
            tags: ["New Hire", "First Appraisal"]
        },
        {
            recordId: "DEN24002",
            email: "sample2@dentons.com",
            preferredFirstName: "Sample",
            preferredLastName: "Two",
            department: "Corporate",
            designation: "Associate",
            role: "Professional",
            jobTitle: "Corporate Associate",
            appraisalDetails: {
                selfAppraisalRequired: true,
                evaluatorRequired: true,
                dueDate: "2024-06-30",
                startDate: "2024-06-01",
                completionDate: null,
                ordinal: 3,
                status: "Not Started",
                progress: 0,
                evaluator: "John Smith",
                lastAction: null
            },
            previousAppraisals: [
                {
                    cycleId: "2023-H2",
                    status: "Completed",
                    rating: "Exceeds Expectations",
                    completionDate: "2023-12-10"
                }
            ],
            fullNameDept: "Sample Two - Corporate",
            tags: ["Senior Track"]
        },
        {
            recordId: "DEN24003",
            email: "sample3@dentons.com",
            preferredFirstName: "Sample",
            preferredLastName: "Three",
            department: "Human Resources",
            designation: "Assistant",
            role: "Staff",
            jobTitle: "Human Resources Assistant",
            appraisalDetails: {
                selfAppraisalRequired: true,
                evaluatorRequired: false,
                dueDate: "2024-06-30",
                startDate: "2024-06-01",
                completionDate: null,
                ordinal: 1,
                status: "Not Started",
                progress: 0,
                evaluator: null,
                lastAction: null
            },
            previousAppraisals: [
                {
                    cycleId: "2023-H2",
                    status: "Completed",
                    rating: "Meets Expectations",
                    completionDate: "2023-12-20"
                }
            ],
            fullNameDept: "Sample Three - Human Resources",
            tags: []
        }
    ],
    filters: {
        roles: ["Professional", "Staff"],
        departments: ["Risk & Compliance", "Corporate", "Human Resources"],
        statuses: ["Not Started", "In Progress", "Completed", "Overdue"],
        tags: ["New Hire", "First Appraisal", "Senior Track"]
    },
    helpers: {
        filterByRole: (role) => {
            return appraisalData.recipients.filter(r => r.role === role);
        },
        filterByDepartment: (dept) => {
            return appraisalData.recipients.filter(r => r.department === dept);
        },
        filterByStatus: (status) => {
            return appraisalData.recipients.filter(r => r.appraisalDetails.status === status);
        },
        filterByTag: (tag) => {
            return appraisalData.recipients.filter(r => r.tags.includes(tag));
        },
        getOverdueAppraisals: () => {
            const today = new Date();
            return appraisalData.recipients.filter(r => 
                new Date(r.appraisalDetails.dueDate) < today && 
                r.appraisalDetails.status !== "Completed"
            );
        }
    }
};

export { appraisalData };