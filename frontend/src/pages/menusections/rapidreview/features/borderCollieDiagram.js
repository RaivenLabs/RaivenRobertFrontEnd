// borderCollieDiagram.js
export const flowchartDefinition = `
flowchart TD
    %% Start and Initial Steps
    A[Start] --> B[Check Local Pet Regulations]
    B --> C[Research Breeders/Rescue Centers]
    
    %% Meet and Greet Process
    C --> D[Schedule Meet & Greet]
    D --> E{Good Match?}
    E -->|Yes| F[Submit Application]
    E -->|No| C
    
    %% Application Process
    F --> G{Application Approved?}
    G -->|Yes| H[Home Preparation]
    G -->|No| I[Review Feedback]
    I --> C
    
    %% Final Steps
    H --> J[Purchase Supplies]
    J --> K[Bring Dog Home]
    K --> L[Schedule Vet Visit]
    L --> M[End]
    
    %% Parallel Activities
    subgraph "Parallel Activities"
        direction TB
        N[Research Training Classes]
        O[Set Up Exercise Area]
        P[Prepare Family Members]
    end
    
    %% Connect parallel activities
    F --> N
    F --> O
    F --> P

    %% Style definitions
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef decision fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef process fill:#f5f5f5,stroke:#333,stroke-width:2px
    classDef parallel fill:#f3e5f5,stroke:#4a148c,stroke-width:2px

    %% Apply styles
    class E,G decision
    class N,O,P parallel
    class B,C,D,F,H,I,J,K,L process
`;

export default flowchartDefinition;
