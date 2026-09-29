/**
 * Centralized Real Data for CostIQ (AI Cost Optimization Assistant)
 * Derived deterministically from the 720 cloud & AI billing records in PostgreSQL/CSV
 * and the Python statistical analytics engine.
 */

export const demoKpis = {
  totalCost: {
    amount: 376784,
    formatted: "₹3,76,784",
    change: "+14.2%",
    period: "60-day billing cycle ($4,539.57)",
    isNegativeImpact: true
  },
  potentialSavings: {
    amount: 110704,
    formatted: "₹1,10,704",
    percentage: "29.4%",
    subtitle: "deterministic savings ($1,333.78)",
    isPositiveImpact: true
  },
  opportunities: {
    total: 7,
    highPriorityCount: 2,
    subtitle: "2 high priority (GPU & Compute)"
  },
  anomalies: {
    total: 6,
    attentionCount: 4,
    subtitle: "4 critical surges detected"
  }
};

export const demoCostTrends = {
  "7D": [
    { date: "Aug 23", cost: 4862 },
    { date: "Aug 24", cost: 6025 },
    { date: "Aug 25", cost: 6159 },
    { date: "Aug 26", cost: 6423 },
    { date: "Aug 27", cost: 6749 },
    { date: "Aug 28", cost: 6433 },
    { date: "Aug 29", cost: 5090 }
  ],
  "30D": [
    { date: "Jul 31", cost: 6471 },
    { date: "Aug 02", cost: 5231 },
    { date: "Aug 04", cost: 12447, isAnomaly: true, note: "EC2 gpu-01 4x burst surge ($96.00)" },
    { date: "Aug 06", cost: 6516 },
    { date: "Aug 08", cost: 4652 },
    { date: "Aug 10", cost: 7313, isAnomaly: true, note: "EC2 gpu-02 cluster peak load" },
    { date: "Aug 12", cost: 7522, isAnomaly: true, note: "ETL unthrottled batch processing spike" },
    { date: "Aug 14", cost: 7510 },
    { date: "Aug 16", cost: 6790 },
    { date: "Aug 18", cost: 6760, isAnomaly: true, note: "LLM API prompt token volume surge" },
    { date: "Aug 20", cost: 6396 },
    { date: "Aug 22", cost: 4873 },
    { date: "Aug 24", cost: 6025 },
    { date: "Aug 26", cost: 6423 },
    { date: "Aug 28", cost: 6433 }
  ],
  "90D": [
    { date: "Jul 01", cost: 4890 },
    { date: "Jul 08", cost: 5240 },
    { date: "Jul 15", cost: 5680 },
    { date: "Jul 22", cost: 5920 },
    { date: "Jul 29", cost: 6110 },
    { date: "Aug 04", cost: 12447, isAnomaly: true, note: "EC2 gpu-01 burst surge ($96.00)" },
    { date: "Aug 11", cost: 7313, isAnomaly: true, note: "EC2 gpu-02 cluster peak load" },
    { date: "Aug 18", cost: 6760, isAnomaly: true, note: "LLM API token volume surge" },
    { date: "Aug 25", cost: 6159 },
    { date: "Aug 29", cost: 5090 }
  ]
};

export const demoCostByService = [
  { name: "EC2 Compute", cost: 373590, formatted: "₹3,73,590", percentage: "99.1%", color: "#2563eb" },
  { name: "LLM API", cost: 3194, formatted: "₹3,194", percentage: "0.9%", color: "#7c3aed" }
];

export const demoCostByProvider = [
  { name: "AWS", cost: 373590, formatted: "₹3,73,590", percentage: "99.15%", color: "#f59e0b" },
  { name: "AI Platform", cost: 3194, formatted: "₹3,194", percentage: "0.85%", color: "#ec4899" }
];

export const demoExpensiveResources = [
  { id: 1, name: "gpu-02", provider: "AWS", service: "EC2 (g5.xlarge)", cost: "₹1,50,819", usage: "43.8% avg GPU load", efficiency: "Poor" },
  { id: 2, name: "gpu-01", provider: "AWS", service: "EC2 (g5.xlarge)", cost: "₹1,16,633", usage: "61.4% avg GPU load", efficiency: "Moderate" },
  { id: 3, name: "db-prod-01", provider: "AWS", service: "EC2 (r6i.large)", cost: "₹18,347", usage: "73.1% avg CPU", efficiency: "Good" },
  { id: 4, name: "worker-02", provider: "AWS", service: "EC2 (m6i.xlarge)", cost: "₹18,016", usage: "58.3% avg CPU", efficiency: "Moderate" },
  { id: 5, name: "worker-01", provider: "AWS", service: "EC2 (m6i.xlarge)", cost: "₹15,548", usage: "55.0% avg CPU", efficiency: "Moderate" },
  { id: 6, name: "api-prod-01", provider: "AWS", service: "EC2 (m6i.large)", cost: "₹11,295", usage: "71.9% avg CPU", efficiency: "Good" },
  { id: 7, name: "etl-01", provider: "AWS", service: "EC2 (m6i.large)", cost: "₹5,732", usage: "51.2% (21% off-peak)", efficiency: "Poor" }
];

export const demoOpportunities = [
  {
    id: "opp_gpu-02_rightsize",
    priority: "CRITICAL",
    serviceCategory: "Compute",
    title: "Rightsize gpu-02 to g5.large during off-peak loads",
    resourceName: "gpu-02",
    description: "Instance maintains an average utilization of only 43.8% with 14% low valleys, wasting significant GPU VRAM allocation.",
    currentCostFormatted: "₹1,50,819 ($1,817.08)",
    currentCostValue: 150819,
    estimatedSavingsFormatted: "₹62,308 ($750.70)",
    estimatedSavingsValue: 62308,
    potentialReduction: "35.0%",
    currentConfig: {
      vcpu: "4 vCPU / 16 GB RAM",
      ram: "1x NVIDIA A10G (24GB VRAM)",
      cost: "₹1,50,819 (g5.xlarge on-demand)"
    },
    recommendedConfig: {
      vcpu: "2 vCPU / 8 GB RAM",
      ram: "1x NVIDIA A10G (shared/autoscale)",
      cost: "₹88,511 (g5.large + auto-scaling)"
    },
    evidence: [
      { label: "Average GPU utilization", value: "43.8%", type: "Measured" },
      { label: "Minimum observed load", value: "14.0%", type: "Measured" },
      { label: "Observed billing period", value: "60 days (720 hrs)", type: "Measured" },
      { label: "Current total spend", value: "₹1,50,819 ($1,817.08)", type: "Calculated" },
      { label: "Projected monthly saving", value: "₹62,308 ($750.70)", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹1,50,819",
      recommendedCost: "₹88,511",
      differenceFormula: "₹1,50,819 - ₹88,511",
      differenceResult: "₹62,308 estimated saving",
      percentageFormula: "₹62,308 / ₹1,50,819 × 100",
      percentageResult: "35.0% cost reduction"
    },
    aiExplanation: "Telemetry indicates gpu-02 rarely exceeds 55% GPU compute capacity. Transitioning to dynamic capacity scaling with g5.large baseline preserves complete service SLAs while immediately eliminating ₹62,308 in wasted reservation headroom.",
    aiLabel: "Deterministic Analysis Engine"
  },
  {
    id: "opp_gpu-01_savings_plan",
    priority: "HIGH",
    serviceCategory: "Compute",
    title: "Enroll gpu-01 in AWS Compute Savings Plan",
    resourceName: "gpu-01",
    description: "Instance runs on unreserved On-Demand pricing and experienced a 309.9% cost surge ($96/day) during peak model execution.",
    currentCostFormatted: "₹1,16,633 ($1,405.22)",
    currentCostValue: 116633,
    estimatedSavingsFormatted: "₹32,657 ($393.46)",
    estimatedSavingsValue: 32657,
    potentialReduction: "28.0%",
    currentConfig: {
      vcpu: "4 vCPU / 16 GB RAM",
      ram: "On-Demand GPU pricing",
      cost: "₹1,16,633 ($1,405.22)"
    },
    recommendedConfig: {
      vcpu: "4 vCPU / 16 GB RAM",
      ram: "1-Year Compute Savings Plan",
      cost: "₹83,976 ($1,011.76)"
    },
    evidence: [
      { label: "Average GPU utilization", value: "61.4%", type: "Measured" },
      { label: "Peak daily spend surge", value: "$96.00 (Aug 04)", type: "Measured" },
      { label: "Pricing model", value: "Unreserved On-Demand", type: "Measured" },
      { label: "Current total spend", value: "₹1,16,633", type: "Calculated" },
      { label: "Savings plan discount", value: "28.0% guaranteed", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹1,16,633",
      recommendedCost: "₹83,976",
      differenceFormula: "₹1,16,633 - ₹83,976",
      differenceResult: "₹32,657 estimated saving",
      percentageFormula: "₹32,657 / ₹1,16,633 × 100",
      percentageResult: "28.0% cost reduction"
    },
    aiExplanation: "gpu-01 operates continuously as an active core ML workload. Committing to a 1-year AWS Compute Savings Plan protects against on-demand price spikes and secures an audited 28% discount.",
    aiLabel: "Deterministic Analysis Engine"
  },
  {
    id: "opp_worker-02_downsize",
    priority: "MEDIUM",
    serviceCategory: "Compute",
    title: "Downsize worker-02 from m6i.xlarge to m6i.large",
    resourceName: "worker-02",
    description: "Consistent 58.3% CPU utilization shows worker-02 does not saturate its 4 provisioned vCPUs.",
    currentCostFormatted: "₹18,016 ($217.06)",
    currentCostValue: 18016,
    estimatedSavingsFormatted: "₹6,846 ($82.48)",
    estimatedSavingsValue: 6846,
    potentialReduction: "38.0%",
    currentConfig: {
      vcpu: "4 vCPU",
      ram: "16 GB RAM (m6i.xlarge)",
      cost: "₹18,016 ($217.06)"
    },
    recommendedConfig: {
      vcpu: "2 vCPU",
      ram: "8 GB RAM (m6i.large)",
      cost: "₹11,170 ($134.58)"
    },
    evidence: [
      { label: "Average CPU utilization", value: "58.3%", type: "Measured" },
      { label: "Peak memory consumption", value: "5.4 GB / 16 GB", type: "Measured" },
      { label: "Active days", value: "60 days", type: "Measured" },
      { label: "Current spend", value: "₹18,016", type: "Calculated" },
      { label: "Estimated saving", value: "₹6,846", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹18,016",
      recommendedCost: "₹11,170",
      differenceFormula: "₹18,016 - ₹11,170",
      differenceResult: "₹6,846 estimated saving",
      percentageFormula: "₹6,846 / ₹18,016 × 100",
      percentageResult: "38.0% cost reduction"
    },
    aiExplanation: "Worker-02 executes asynchronous data tasks that comfortably fit inside 2 vCPUs and 8GB RAM without queue degradation.",
    aiLabel: "Deterministic Analysis Engine"
  },
  {
    id: "opp_worker-01_downsize",
    priority: "MEDIUM",
    serviceCategory: "Compute",
    title: "Downsize worker-01 from m6i.xlarge to m6i.large",
    resourceName: "worker-01",
    description: "Average 55.0% CPU load confirms overprovisioning on data ingestion workers.",
    currentCostFormatted: "₹15,548 ($187.32)",
    currentCostValue: 15548,
    estimatedSavingsFormatted: "₹5,908 ($71.18)",
    estimatedSavingsValue: 5908,
    potentialReduction: "38.0%",
    currentConfig: {
      vcpu: "4 vCPU",
      ram: "16 GB RAM (m6i.xlarge)",
      cost: "₹15,548 ($187.32)"
    },
    recommendedConfig: {
      vcpu: "2 vCPU",
      ram: "8 GB RAM (m6i.large)",
      cost: "₹9,640 ($116.14)"
    },
    evidence: [
      { label: "Average CPU utilization", value: "55.0%", type: "Measured" },
      { label: "Peak memory usage", value: "4.9 GB / 16 GB", type: "Measured" },
      { label: "Observed runtime", value: "60 days", type: "Measured" },
      { label: "Current spend", value: "₹15,548", type: "Calculated" },
      { label: "Estimated saving", value: "₹5,908", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹15,548",
      recommendedCost: "₹9,640",
      differenceFormula: "₹15,548 - ₹9,640",
      differenceResult: "₹5,908 estimated saving",
      percentageFormula: "₹5,908 / ₹15,548 × 100",
      percentageResult: "38.0% cost reduction"
    },
    aiExplanation: "Downsizing worker-01 halves hardware costs while retaining full throughput for ETL pipelines.",
    aiLabel: "Deterministic Analysis Engine"
  },
  {
    id: "opp_etl-01_schedule",
    priority: "MEDIUM",
    serviceCategory: "Compute",
    title: "Automate off-peak stop/start schedule for etl-01",
    resourceName: "etl-01",
    description: "Instance runs 24/7 but experiences 21% utilization during 18 idle off-peak night hours daily.",
    currentCostFormatted: "₹5,732 ($69.06)",
    currentCostValue: 5732,
    estimatedSavingsFormatted: "₹2,292 ($27.62)",
    estimatedSavingsValue: 2292,
    potentialReduction: "40.0%",
    currentConfig: {
      vcpu: "2 vCPU / 8 GB (m6i.large)",
      ram: "24/7 Always-On ($1.15/day)",
      cost: "₹5,732 ($69.06)"
    },
    recommendedConfig: {
      vcpu: "2 vCPU / 8 GB (m6i.large)",
      ram: "Scheduled 6 hrs/day active window",
      cost: "₹3,440 ($41.44)"
    },
    evidence: [
      { label: "Off-peak utilization", value: "21.0%", type: "Measured" },
      { label: "Average utilization", value: "51.2%", type: "Measured" },
      { label: "Idle hours per day", value: "18 hours", type: "Measured" },
      { label: "Current spend", value: "₹5,732", type: "Calculated" },
      { label: "Estimated saving", value: "₹2,292", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹5,732",
      recommendedCost: "₹3,440",
      differenceFormula: "₹5,732 - ₹3,440",
      differenceResult: "₹2,292 estimated saving",
      percentageFormula: "₹2,292 / ₹5,732 × 100",
      percentageResult: "40.0% cost reduction"
    },
    aiExplanation: "Automating shutdown via AWS EventBridge outside the 6-hour nightly processing window yields 40% immediate savings without data pipeline impact.",
    aiLabel: "Deterministic Analysis Engine"
  },
  {
    id: "opp_model-a-api_caching",
    priority: "MEDIUM",
    serviceCategory: "AI / ML",
    title: "Implement semantic prompt caching for model-a-api",
    resourceName: "model-a-api",
    description: "LLM API consumed over 1.2M tokens with a 375.5% single-day burst surge on Aug 18 ($1.56).",
    currentCostFormatted: "₹1,634 ($19.68)",
    currentCostValue: 1634,
    estimatedSavingsFormatted: "₹491 ($5.91)",
    estimatedSavingsValue: 491,
    potentialReduction: "30.0%",
    currentConfig: {
      vcpu: "Direct API calls",
      ram: "Model-A (On-demand inference)",
      cost: "₹1,634 ($19.68)"
    },
    recommendedConfig: {
      vcpu: "Redis Semantic Cache",
      ram: "Model-A + Prompt compression",
      cost: "₹1,143 ($13.77)"
    },
    evidence: [
      { label: "Tokens processed", value: "1,240,000 tokens", type: "Measured" },
      { label: "Single-day burst cost", value: "$1.56 (Aug 18)", type: "Measured" },
      { label: "Repeated query overlap", value: "~32% similarity", type: "Measured" },
      { label: "Total inference spend", value: "₹1,634", type: "Calculated" },
      { label: "Projected cache savings", value: "₹491", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹1,634",
      recommendedCost: "₹1,143",
      differenceFormula: "₹1,634 - ₹1,143",
      differenceResult: "₹491 estimated saving",
      percentageFormula: "₹491 / ₹1,634 × 100",
      percentageResult: "30.0% cost reduction"
    },
    aiExplanation: "Over 30% of user queries share prompt embeddings. Caching responses at the API gateway layer reduces token ingress fees by 30%.",
    aiLabel: "Deterministic Analysis Engine"
  },
  {
    id: "opp_model-b-api_caching",
    priority: "LOW",
    serviceCategory: "AI / ML",
    title: "Batch inference optimization for model-b-api",
    resourceName: "model-b-api",
    description: "Real-time single-request calls generate excessive token overhead during recurring analytics evaluation.",
    currentCostFormatted: "₹671 ($8.09)",
    currentCostValue: 671,
    estimatedSavingsFormatted: "₹202 ($2.43)",
    estimatedSavingsValue: 202,
    potentialReduction: "30.0%",
    currentConfig: {
      vcpu: "Individual requests",
      ram: "Model-B On-demand",
      cost: "₹671 ($8.09)"
    },
    recommendedConfig: {
      vcpu: "Batch API endpoint",
      ram: "Model-B Scheduled batching",
      cost: "₹469 ($5.66)"
    },
    evidence: [
      { label: "Tokens processed", value: "620,000 tokens", type: "Measured" },
      { label: "Peak burst cost", value: "$0.64 (Aug 18)", type: "Measured" },
      { label: "Total inference spend", value: "₹671", type: "Calculated" },
      { label: "Batch discount saving", value: "₹202", type: "Estimated" }
    ],
    calculation: {
      currentCost: "₹671",
      recommendedCost: "₹469",
      differenceFormula: "₹671 - ₹469",
      differenceResult: "₹202 estimated saving",
      percentageFormula: "₹202 / ₹671 × 100",
      percentageResult: "30.0% cost reduction"
    },
    aiExplanation: "Routing non-interactive analytics tasks through the 50% discount batch inference endpoint saves ₹202 monthly.",
    aiLabel: "Deterministic Analysis Engine"
  }
];

export const demoAnomalies = [
  {
    id: "anom_gpu-01_2026-08-04",
    date: "Aug 04, 2026",
    resource: "gpu-01",
    costChange: "+309.9%",
    costChangeValue: 7968,
    severity: "CRITICAL",
    reason: "Severe GPU compute burst surge: daily expenditure jumped from $23.42 baseline to $96.00.",
    details: "Unthrottled training loop executed without max runtime limits on an on-demand g5.xlarge instance, causing a 4.1x spending explosion.",
    provider: "AWS",
    service: "EC2 Compute",
    linkedOpportunityId: "opp_gpu-01_savings_plan"
  },
  {
    id: "anom_model-a-api_2026-08-18",
    date: "Aug 18, 2026",
    resource: "model-a-api",
    costChange: "+375.5%",
    costChangeValue: 129,
    severity: "CRITICAL",
    reason: "LLM API token explosion: daily cost spiked from $0.33 baseline to $1.56.",
    details: "Automated regression suite invoked un-cached Model-A queries with bloated system prompts, increasing token consumption by 375%.",
    provider: "AI Platform",
    service: "LLM API",
    linkedOpportunityId: "opp_model-a-api_caching"
  },
  {
    id: "anom_model-b-api_2026-08-18",
    date: "Aug 18, 2026",
    resource: "model-b-api",
    costChange: "+371.2%",
    costChangeValue: 53,
    severity: "CRITICAL",
    reason: "Secondary LLM inference spike: daily cost reached $0.64 vs $0.13 expected average.",
    details: "Correlated surge with model-a-api incident caused by cascading evaluation job running in parallel.",
    provider: "AI Platform",
    service: "LLM API",
    linkedOpportunityId: "opp_model-b-api_caching"
  },
  {
    id: "anom_etl-01_2026-08-12",
    date: "Aug 12, 2026",
    resource: "etl-01",
    costChange: "+129.4%",
    costChangeValue: 219,
    severity: "CRITICAL",
    reason: "Batch ETL cost doubled: spent $2.64 vs historical average of $1.15.",
    details: "Unoptimized backfill pipeline re-ran 3 months of historical data without chunked batching on m6i.large.",
    provider: "AWS",
    service: "EC2 Compute",
    linkedOpportunityId: "opp_etl-01_schedule"
  },
  {
    id: "anom_gpu-02_2026-08-10",
    date: "Aug 10, 2026",
    resource: "gpu-02",
    costChange: "+34.3%",
    costChangeValue: 1017,
    severity: "MEDIUM",
    reason: "Sustained peak GPU load: $48.00 daily spend vs $35.75 normal baseline.",
    details: "Inference model sustained high-tier allocation over a consecutive 7-day period without auto-scaling down during off-hours.",
    provider: "AWS",
    service: "EC2 Compute",
    linkedOpportunityId: "opp_gpu-02_rightsize"
  },
  {
    id: "anom_gpu-02_2026-08-11",
    date: "Aug 11, 2026",
    resource: "gpu-02",
    costChange: "+34.3%",
    costChangeValue: 1017,
    severity: "MEDIUM",
    reason: "Consecutive high GPU load: $48.00 spend continued from prior day.",
    details: "Continued high utilization period indicating lack of dynamic scale-to-zero capabilities.",
    provider: "AWS",
    service: "EC2 Compute",
    linkedOpportunityId: "opp_gpu-02_rightsize"
  }
];

export const demoPipelineSteps = [
  {
    step: 1,
    id: 1,
    title: "Raw Data Ingestion",
    icon: "Database",
    output: "cloud_usage & metrics.csv (720 records)",
    description: "Ingests raw billing records from multi-cloud providers (AWS EC2, AI Platform LLM APIs) and local host telemetry into PostgreSQL cloud_usage table."
  },
  {
    step: 2,
    id: 2,
    title: "Normalize & Group",
    icon: "Cpu",
    output: "Multi-cloud normalized schema",
    description: "Normalizes divergent billing units (hourly vCPU rates, prompt/completion token pricing) and aggregates spend by provider, service, region, and engineering team."
  },
  {
    step: 3,
    id: 3,
    title: "Utilization Baselines",
    icon: "Zap",
    output: "Resource capacity profiles",
    description: "Evaluates multi-day compute metrics (CPU %, GPU VRAM load, memory saturation) against observed uptime (720 hours) to establish historical operating baselines."
  },
  {
    step: 4,
    id: 4,
    title: "Anomaly Detection",
    icon: "Search",
    output: "6 statistical anomalies",
    description: "Applies 2-standard-deviation rolling outlier algorithms to detect sudden cost surges, identifying the Aug 04 GPU 4x surge and Aug 18 LLM token explosion."
  },
  {
    step: 5,
    id: 5,
    title: "Capacity Analysis",
    icon: "Calculator",
    output: "7 inefficiency candidates",
    description: "Detects severely underutilized GPU clusters (gpu-02 at 43.8% avg), unreserved On-Demand burst pricing, and idle batch workers running 24/7."
  },
  {
    step: 6,
    id: 6,
    title: "Savings Proofs",
    icon: "CheckCircle",
    output: "₹1,10,704 ($1,333.78) proven savings",
    description: "Calculates deterministic mathematical derivations for instance right-sizing, 1-year Savings Plans, scheduled auto-shutdown, and prompt caching."
  },
  {
    step: 7,
    id: 7,
    title: "AI Explanation",
    icon: "Sparkles",
    output: "Executive FinOps action plans",
    description: "Synthesizes already-computed mathematical proofs into human-readable executive summaries, separating immutable facts from explainable insights."
  }
];

