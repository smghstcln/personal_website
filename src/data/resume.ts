export interface ExperienceItem {
  id: string;
  date: string;
  year: string;
  company: string;
  role: string;
  location: string;
  summary: string;
  description: string[];
  technologies: string[];
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

export interface MetricItem {
  value: string;
  label: string;
}

export interface CapabilityItem {
  key: string;
  title: string;
  blurb: string;
  stack: string[];
}

export type ProjectShape = 'rag' | 'nav' | 'oracle' | 'agent';

export interface ProjectItem {
  id: string;
  n: string;
  title: string;
  metricBig: string;
  metricSub: string;
  description: string;
  tech: string[];
  role: string;
  shape: ProjectShape;
}

export const resumeData = {
  personal: {
    name: "Samuel Fitoussi",
    role: "Internal AI Lead",
    email: "samuelfitoussi15@gmail.com",
    location: "Tel-Aviv, Israel",
    linkedin: "https://www.linkedin.com/in/samuel-fitoussi/",
    headline: "I build agentic systems that ship.",
    sub: "Internal AI Lead at a 5-person protocol startup. RAG, agents, and multi-chain data infrastructure — wired into production, not into a deck.",
    bio: "Internal AI Lead building production agentic systems and due-diligence engines that compress research from days to hours.",
  },
  metrics: [
    { value: "1d→2h", label: "Per-document review time" },
    { value: "$150M", label: "TVL on shipped NAV platform" },
    { value: "40+",   label: "Chains indexed in production" },
    { value: "~50%",  label: "Protocol cost reduction" },
  ] as MetricItem[],
  experience: [
    {
      id: "lightblocks-ai-lead",
      date: "Mar 2026 — Present",
      year: "'26",
      company: "Lightblocks Labs / eOracle",
      role: "Internal AI Lead",
      location: "Israel",
      summary: "Promoted to lead AI for a 5-person protocol startup. Owns end-to-end design and deployment of agentic systems while keeping product responsibilities.",
      description: [
        "Lead company-wide AI initiatives at a protocol startup building blockchain-based data and telemetry for the GPU/chip ecosystem (private credit, secondary market, datacenter optimisation).",
        "Built and shipped a claim-validation engine and DD-review pipeline used daily by the team — 25 claims validated, including one flagged and retracted from the investor deck. Per-document review time cut from ~1 day to ~2 hours.",
        "Productised the RAG + agent architecture into an R&D pipeline at the product↔R&D intersection, a content-generation pipeline shaping the CEO's external presence, and a second-brain for company-wide knowledge.",
        "Operationalised RAG, context engineering, and agent orchestration with Claude (Code + Cowork) and LangChain — backed by Pinecone for retrieval and Langfuse for evaluation/observability."
      ],
      technologies: ["Claude", "LangChain", "Pinecone", "Langfuse", "RAG", "Agents"]
    },
    {
      id: "lightblocks-pde",
      date: "Dec 2024 — Mar 2026",
      year: "'24",
      company: "Lightblocks Labs / eOracle",
      role: "Product & Data Engineer",
      location: "Israel",
      summary: "Designed and shipped multi-chain analytics and a vault-agnostic NAV engine; turned ambiguous research into the team's decision tooling.",
      description: [
        "Designed and implemented end-to-end a multi-chain ingestion and analytics platform across 40+ EVM and alt-L1 chains. Drove ~50% protocol cost reduction in 6 months.",
        "Designed and implemented end-to-end a vault-agnostic NAV platform across EVM protocols (Morpho, Euler, Silo, Fluid) — productised into an enterprise offering supporting 3 deals and delivering business-daily NAV for Midas mF-ONE (~$150M TVL).",
        "Took over financial and product research post-restructure, translating ambiguous protocol questions into specifications and stakeholder-facing outputs."
      ],
      technologies: ["Multi-chain Indexing", "EVM", "NAV Engine", "Analytics", "Risk Controls"]
    },
    {
      id: "nchain",
      date: "Jun 2024 — Sep 2024",
      year: "'24",
      company: "nChain",
      role: "Summer Intern",
      location: "London, UK",
      summary: "Engineered an on-chain Digital Product Passport for EV battery lifecycle on Bitcoin SV.",
      description: [
        "Engineered an on-chain Digital Product Passport (DPP) system for EV battery lifecycle management.",
        "Implemented on-chain registration, real-time updates, and data querying using Bitcoin SV.",
        "Developed transaction scripts for unique asset identification using QR-code-based access and public-key cryptography.",
        "Reduced per-DPP cost to $0.001 with 21 KB of storage per asset."
      ],
      technologies: ["Bitcoin SV", "Cryptography", "DPP"]
    },
    {
      id: "bary",
      date: "May 2022 — Sep 2023",
      year: "'22",
      company: "BARY",
      role: "Project Consultant & Development Intern",
      location: "Tel-Aviv, Israel",
      summary: "Coordinated NFT campaign portals from brief to launch; client demos with French football clubs.",
      description: [
        "Coordinated delivery of NFT campaign portals from client brief to launch (Joker Club for Partouche; demos with OM and RC Strasbourg; Formula 1 PoC), contributing to UI, demos, and analytics instrumentation."
      ],
      technologies: ["Web3", "UI/UX", "Analytics"]
    }
  ] as ExperienceItem[],
  education: [
    {
      id: "ucl-msc",
      date: "Sep 2023 — Sep 2024",
      institution: "University College London",
      degree: "MSc Financial Technology — First Class Honours",
      details: [
        "Applied neural networks and sentiment analysis to predict ICO success.",
        "Developed predictive models and algorithmic trading strategies.",
        "Master's thesis: Blockchain-Based Digital Passport for EV Batteries (Bitcoin SV)."
      ]
    },
    {
      id: "ucl-beng",
      date: "Sep 2020 — Jun 2023",
      institution: "University College London",
      degree: "BEng Electrical and Electronic Engineering — Upper Second Class Honours",
      details: [
        "Project: Machine Learning and Blockchain — Tokenisation for Finance.",
        "97.50/100 in Advanced Engineering Mathematics.",
        "Coursework: Machine Learning, Control Systems, Robotics, Electronic Systems."
      ]
    },
    {
      id: "lycee",
      date: "Sep 2018 — Jun 2020",
      institution: "Lycée Maimonide Rambam",
      degree: "French Scientific Baccalaureate — Highest Honours",
      details: [
        "Overall: 19.33/20",
        "Mathematics, Physics, Biology: 20/20"
      ]
    }
  ] as EducationItem[],
  capabilities: [
    {
      key: "rag",
      title: "RAG & Retrieval",
      blurb: "Production retrieval pipelines with Pinecone, evaluated through Langfuse — not a notebook demo.",
      stack: ["Pinecone", "LangChain", "Langfuse", "Claude"]
    },
    {
      key: "agents",
      title: "Agent Orchestration",
      blurb: "Tool-calling, planning, context engineering. Wired into the team's daily research and decision-making.",
      stack: ["Claude Code", "Cowork", "LangChain"]
    },
    {
      key: "data",
      title: "Multi-chain Data",
      blurb: "Indexers and analytics across 40+ EVM and alt-L1 chains — turned on-chain data into decision tooling.",
      stack: ["Subsquid", "The Graph", "Dune", "viem"]
    },
    {
      key: "nav",
      title: "NAV & Pricing",
      blurb: "Vault-agnostic NAV engine across Morpho, Euler, Silo, Fluid — multi-source pricing, validations, daily reporting.",
      stack: ["EVM", "RWA", "LST", "PT/LP"]
    }
  ] as CapabilityItem[],
  skills: [
    {
      category: "AI & Agents",
      items: ["RAG", "Agentic Workflows", "Context Engineering", "Eval & Observability", "Knowledge Pipelines", "Claude Code", "Claude Cowork", "LangChain", "Pinecone", "Langfuse", "Anthropic API", "OpenAI API"]
    },
    {
      category: "Programming",
      items: ["Python", "TypeScript", "JavaScript", "SQL", "Solidity", "C", "React.js", "Node.js"]
    },
    {
      category: "Blockchain & Data",
      items: ["Multi-chain Indexing", "DeFi Analytics", "Oracle Systems", "NAV Reporting", "Foundry", "Hardhat", "viem / ethers.js", "Dune Analytics", "The Graph", "Subsquid"]
    },
    {
      category: "DevOps",
      items: ["Docker", "Kubernetes", "Argo CD", "MongoDB", "CI/CD"]
    },
    {
      category: "Languages",
      items: ["French (Native)", "English (Fluent)", "Hebrew (Fluent)", "Spanish (Intermediate)"]
    }
  ] as SkillCategory[],
  projects: [
    {
      id: "dd-acceleration",
      n: "01",
      title: "Due-Diligence Acceleration Pipeline",
      metricBig: "1d → 2h",
      metricSub: "per document",
      description: "RAG-based engine surfacing verifiable proofs for due-diligence and product arguments. Used daily by the team; 25 claims validated, including one flagged and retracted from the investor deck.",
      tech: ["Claude", "LangChain", "Pinecone", "Langfuse"],
      role: "Internal AI Lead",
      shape: "rag"
    },
    {
      id: "nav-platform",
      n: "02",
      title: "NAV Platform",
      metricBig: "$150M",
      metricSub: "TVL · 3 institutional deals",
      description: "Vault-agnostic NAV engine across EVM protocols (Morpho, Euler, Silo, Fluid) and asset classes (RWAs, LSTs, PTs, LPs) with multi-source pricing and automated reporting. Business-daily NAV for Midas mF-ONE.",
      tech: ["EVM", "Multi-source Pricing", "RWA / LST / PT", "Automated Reporting"],
      role: "Product & Data Engineer",
      shape: "nav"
    },
    {
      id: "oracle-analytics",
      n: "03",
      title: "Multi-Chain Oracle Analytics",
      metricBig: "40+",
      metricSub: "chains · ~50% cost reduction",
      description: "Custom multi-chain indexer and analytics platform monitoring oracle publishing — per-feed metrics (cost, latency, calldata batching, deviation) and a daily benchmarking pipeline vs Chainlink and RedStone.",
      tech: ["Indexing", "Observability", "Benchmarking", "EVM + alt-L1"],
      role: "Product & Data Engineer",
      shape: "oracle"
    },
    {
      id: "agentic-research",
      n: "04",
      title: "Agentic Research & Knowledge Platform",
      metricBig: "Research",
      metricSub: "Content · Knowledge",
      description: "Productised RAG + agent architecture across an R&D pipeline at the product↔R&D intersection, a content-generation pipeline shaping the CEO's external presence, and a second-brain for company-wide knowledge.",
      tech: ["Claude Cowork", "Knowledge Pipelines", "Agents"],
      role: "Internal AI Lead",
      shape: "agent"
    }
  ] as ProjectItem[],
  interests: [
    "Technological Innovation", "Entrepreneurship", "Physics", "Mathematics Research",
    "Music Production (Guitar, Piano)", "Chess", "Surfing", "Table Tennis"
  ]
};
