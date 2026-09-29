# CostIQ — Cloud + AI Cost Intelligence & Optimization Platform

CostIQ is an evidence-backed FinOps platform that analyzes multi-cloud infrastructure and AI workload costs, detects statistical billing anomalies and resource underutilization, computes deterministic optimization savings, and visualizes actionable right-sizing recommendations through a modern executive dashboard.

---

## 1. System Architecture

```text
       Cloud & AI Usage Data (CSV)           Local Machine Telemetry
                  │                                     │
                  ▼                                     ▼
        PostgreSQL Ingestion                       metrics.csv
                  │                                     │
                  ▼                                     ▼
         PostgreSQL Database (costiq)          Local Monitoring Agent (agent.py)
                  │                                     │
                  ▼                                     │
        Node.js / Express Backend (port 5000) ◄─────────┘
                  │
                  ▼
        Python Analytics Engine (analytics.py)
        • Cost Aggregation & Outlier Detection
        • Underutilization & Idle Analysis
        • Deterministic Mathematical Savings Proofs
        • Optimization Opportunity Ranking
                  │
                  ▼
        React Frontend Dashboard (port 5173)
        • Executive Light Theme (White & Dark Blue)
        • Dynamic Apache ECharts Visualizations
        • Evidence-Backed Recommendations & Math Proofs
```

---

## 2. Directory Structure

```text
SNS Hackathon/
├── analytics.py             # Python deterministic analytical engine (Pandas, NumPy, Scikit-learn)
├── agent.py                 # Local machine telemetry collector (psutil)
├── cloud_ai_usage.csv       # Multi-cloud & AI API billing records (720 rows)
├── metrics.csv              # Live host telemetry time-series (CPU, RAM, Disk, GPU, Net)
├── .venv/                   # Python virtualenv with pandas, numpy, psutil, scikit-learn
│
├── backend/                 # Node.js Express REST API Server
│   ├── server.js            # Express API endpoints (/api/costs, /api/opportunities, etc.)
│   ├── db.js                # PostgreSQL connection pool (costiq)
│   ├── import-data.js       # Atomic CSV import utility into PostgreSQL
│   ├── test-db.js           # Database connectivity test
│   ├── package.json         # Backend dependencies (express, pg, cors, csv-parser)
│   └── node_modules/
│
├── Dataset/                 # Normalized and merged datasets & SQL migrations
│   ├── cloud_ai_usage.csv   # Raw cloud billing dataset
│   ├── metrics.csv          # Raw agent telemetry dataset
│   ├── merged_dataset.csv   # Unified merged dataset (776 records)
│   ├── merge_datasets.py    # Python dataset merger utility
│   ├── init_postgresql.sql  # Complete PostgreSQL schema (tables, indexes, views)
│   ├── load_to_postgres.py  # Standalone automated PostgreSQL data loader
│   └── populate_database.sql # Transactional SQL INSERT statements (776 rows)
│
├── src/                     # React Frontend Application
│   ├── api/                 # Centralized API service layer
│   │   ├── costs.js         # Cost trends, service/provider breakdown, expensive assets
│   │   ├── opportunities.js # Right-sizing opportunities with evidence & math formulas
│   │   ├── anomalies.js     # Statistical spending surge alerts
│   │   ├── metrics.js       # KPI metrics & live machine telemetry
│   │   └── analysis.js      # 7-step analysis pipeline workflow
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Header, Sidebar, KpiCard, StatusBadge, LoadingSkeleton
│   │   ├── cost/            # CostTrendChart, ServiceBreakdown, ProviderBreakdown, TopResources
│   │   ├── opportunities/   # OpportunityCard, OpportunityList
│   │   ├── anomalies/       # AnomalyList, AnomalyDetailModal
│   │   ├── detail/          # OpportunityDetailModal, EvidenceCard, CalculationCard, AIExplanationCard
│   │   └── analysis/        # PipelineWorkflow
│   ├── pages/               # DashboardPage, CostsPage, OpportunitiesPage, AnomaliesPage, etc.
│   ├── data/                # Centralized fallback demo data (demoData.js)
│   ├── App.jsx              # Main application shell with theme state
│   ├── index.css            # Light theme styling, slate scrollbars, typography
│   └── main.jsx
│
├── index.html               # Main HTML entry with Inter font
├── package.json             # Workspace npm package configuration
├── tailwind.config.js       # Executive Dark Blue & Pure White design tokens
└── vite.config.js           # Vite build configuration
```

---

## 3. Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (Active service running on `localhost:5432`)

### Step 1: Database Setup & Data Ingestion
1. Create the PostgreSQL database:
   ```bash
   createdb -U postgres costiq
   ```
2. Import the billing records into PostgreSQL:
   ```bash
   npm run backend:import
   ```
   *(Or run `node backend/import-data.js`)*

### Step 2: Start the Backend API Server
```bash
npm run backend
```
Backend will start on `http://localhost:5000`.

**Verify API Endpoints:**
- `GET /` — Health check
- `GET /api/costs` — PostgreSQL aggregated billing data
- `GET /api/opportunities` — Python-computed right-sizing recommendations
- `GET /api/anomalies` — Statistical spending outliers
- `GET /api/live-metrics` — Local host telemetry stream
- `GET /api/analysis` — Complete deterministic analytical output

### Step 3: Start the Frontend Application
In a separate terminal:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser to view the CostIQ dashboard.

### Step 4 (Optional): Start the Live Telemetry Agent
```bash
npm run agent
```
*(Collects machine CPU, RAM, Disk, and Network metrics every 2 seconds into `metrics.csv`)*

---

## 4. Key Engineering Highlights
1. **Deterministic Analytics**: All costs, anomaly scores, capacity percentages, and savings proofs are computed via Python algorithms—never hallucinated by an LLM.
2. **Audited Evidence**: Recommendations explicitly distinguish between `Measured`, `Calculated`, and `Estimated` values with mathematical derivation proofs.
3. **Executive Light Theme**: Designed with crisp white cards (`#ffffff`), slate canvas (`#f8fafc`), and deep dark blue (`#0f172a` / `#1e3a8a` / `#2563eb`) accents.
