export interface ExperienceItem {
  id: string;
  date: string;
  company: string;
  role: string;
  location: string;
  description: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  date: string;
  institution: string;
  degree: string;
  details: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export const resumeData = {
  personal: {
    name: "Samuel Fitoussi",
    role: "Product & Data Engineer",
    email: "samuelfitoussi15@gmail.com",
    location: "Tel-Aviv, Israel",
    linkedin: "https://www.linkedin.com/in/samuel-fitoussi/",
    github: "github.com/samuelfitoussi", // Placeholder
    bio: "I like tackling complex problems where the path isn’t obvious. That usually means building something new, learning fast, and refining until it delivers real value. I care about solutions that hold up in the real world, not just on paper."
  },
  experience: [
    {
      id: "lightblocks",
      date: "Dec 2024 -- Present",
      company: "eOracle",
      role: "Product & Data Engineer",
      location: "Israel",
      description: [
        "Built a custom multi-chain indexer and analytics platform across 40+ chains to monitor oracle publishing and compute per-feed metrics.",
        "Drove publishing-policy changes contributing to ~50% cost reduction ($10–15k/mo to $3–7k/mo) while scaling volume (~30k to ~100k tx/mo).",
        "Architected a vault-agnostic NAV engine across EVM chains and protocols (Morpho, Euler, Silo, Fluid) with multi-source pricing.",
        "Productized NAV reporting into an enterprise offering supporting 3 deals; delivered business-daily NAV for Midas mF-ONE (~$150M TVL).",
        "Designed oracle solutions and risk controls (floors/ceilings, safeguards) and led audit remediation for the oracle factory.",
        "Developed a daily competitor benchmarking pipeline vs Chainlink and RedStone.",
        "Shipped investor-facing dashboards and financial projections contributing to a successful partial re-raise."
      ],
      technologies: ["Multi-chain Indexing", "EVM", "NAV Engine", "Analytics", "Risk Controls"]
    },
    {
      id: "nchain",
      date: "Jun 2024 -- Sep 2024",
      company: "nChain",
      role: "Summer Intern",
      location: "UK",
      description: [
        "Engineered an on-chain Digital Product Passport (DPP) system for EV battery lifecycle management.",
        "Implemented on-chain registration, real-time updates, and data querying using Bitcoin SV.",
        "Developed transaction scripts for unique asset identification using QR-code-based access and public-key cryptography.",
        "Reduced per-DPP cost to $0.001 with 21 KB of storage per asset."
      ],
      technologies: ["Bitcoin SV", "Cryptography", "Digital Product Passport"]
    },
    {
      id: "bary-consultant",
      date: "May 2023 -- Sep 2023",
      company: "BARY",
      role: "Project Consultant (Freelance)",
      location: "Israel",
      description: [
        "Coordinated delivery of NFT campaign portals; contributed to UI and analytics instrumentation (e.g., Joker Club).",
        "Designed an NFT ticketing concept for football events; ran client demos with French clubs (OM, RC Strasbourg).",
        "Facilitated Web3 training workshops on wallet/NFT flows and campaign mechanics."
      ],
      technologies: ["NFT", "Web3", "UI/UX", "Analytics"]
    },
    {
      id: "bary-intern",
      date: "May 2022 -- Sep 2022",
      company: "BARY",
      role: "Development Intern",
      location: "Israel",
      description: [
        "Supported client sales cycles by preparing pitch decks and product materials for Web3 agency engagements.",
        "Assisted delivery of NFT campaign projects (e.g., Sweet Tiger Cub)."
      ],
      technologies: ["Web3", "Product Management"]
    },
    {
      id: "initiator-vc",
      date: "Sep 2021 -- Apr 2022",
      company: "Initiator VC",
      role: "Sponsorship Executive",
      location: "UK",
      description: [
        "Helped launch a student-focused start-up studio, contributing to a £500k raise (£150k raised directly).",
        "Built strategic partnerships with Jellysmack, Super Capital, and Mural.",
        "Mentored early-stage university teams on pitching and product clarity."
      ],
      technologies: ["VC", "Fundraising", "Partnerships"]
    }
  ] as ExperienceItem[],
  education: [
    {
      id: "ucl-msc",
      date: "Sep 2023 -- Sep 2024",
      institution: "University College London",
      degree: "MSc Financial Technology -- First Class Honours",
      details: [
        "Thesis: Blockchain-Based Digital Passport for EV Batteries (Bitcoin SV).",
        "Applied neural networks and sentiment analysis to predict ICO success.",
        "Created Remuscent, a decentralized music production platform (Agile).",
        "Developed predictive models and algorithmic trading strategies."
      ]
    },
    {
      id: "ucl-beng",
      date: "Sep 2020 -- Jun 2023",
      institution: "University College London",
      degree: "BEng Electrical and Electronic Engineering -- Upper Second Class Honours",
      details: [
        "Project: Machine Learning and Blockchain: Tokenization for Finance.",
        "97.50/100 in Advanced Engineering Mathematics.",
        "Coursework: Machine Learning, Control Systems, Robotics, Electronic Systems."
      ]
    },
    {
      id: "lycee",
      date: "Sep 2018 -- Jun 2020",
      institution: "Lycée Maimonide Rambam",
      degree: "French Scientific Baccalaureate -- Highest Honours",
      details: [
        "Overall: 19.33/20",
        "Mathematics, Physics, Biology: 20/20"
      ]
    }
  ] as EducationItem[],
  skills: [
    {
      category: "Programming",
      items: ["Python", "JavaScript", "TypeScript", "Solidity", "SQL", "C", "MATLAB", "Simulink", "Verilog", "React.js", "Node.js", "HTML/CSS"]
    },
    {
      category: "Data & Analytics",
      items: ["Dune Analytics", "The Graph", "Subsquid", "On-chain Explorers"]
    },
    {
      category: "DevOps",
      items: ["Docker", "Kubernetes", "Argo CD", "MongoDB", "CI/CD Pipelines"]
    },
    {
      category: "Tools & Hardware",
      items: ["Ganache", "Truffle", "Arduino", "TinkerCAD", "SimAVR", "Diptrace"]
    },
    {
      category: "Languages",
      items: ["French (Native)", "English (Fluent)", "Hebrew (Fluent)", "Spanish (Intermediate)"]
    }
  ] as SkillCategory[],
  interests: [
    "Technological Innovation", "Entrepreneurship", "Physics", "Mathematics Research", 
    "Music Production (Guitar, Piano)", "Chess", "Surfing", "Table Tennis"
  ]
};
