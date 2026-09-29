-- =====================================================================
-- CostIQ: AI Cost Optimization Assistant - PostgreSQL Database Schema
-- =====================================================================
-- Purpose: Complete production relational database schema for multi-cloud
-- and AI billing records, host agent telemetry metrics, detected anomalies,
-- and evidence-based optimization recommendations.
-- =====================================================================

-- 1. Create Schema and Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables/views if resetting database
DROP VIEW IF EXISTS v_cost_by_service CASCADE;
DROP VIEW IF EXISTS v_cost_by_provider CASCADE;
DROP VIEW IF EXISTS v_daily_cost_trends CASCADE;
DROP VIEW IF EXISTS v_unified_cost_metrics CASCADE;

DROP TABLE IF EXISTS optimization_opportunities CASCADE;
DROP TABLE IF EXISTS cost_anomalies CASCADE;
DROP TABLE IF EXISTS agent_telemetry_metrics CASCADE;
DROP TABLE IF EXISTS cloud_ai_usage CASCADE;
DROP TABLE IF EXISTS merged_dataset CASCADE;

-- =====================================================================
-- 2. Table: cloud_ai_usage
-- Ingests raw cloud & AI billing events from cloud_ai_usage.csv
-- =====================================================================
CREATE TABLE cloud_ai_usage (
    id SERIAL PRIMARY KEY,
    record_id VARCHAR(50) UNIQUE NOT NULL,
    record_date DATE NOT NULL,
    provider VARCHAR(50) NOT NULL,            -- e.g. 'AWS', 'AI Platform'
    category VARCHAR(50) NOT NULL,            -- e.g. 'cloud', 'ai'
    service VARCHAR(100) NOT NULL,           -- e.g. 'EC2', 'LLM API'
    resource_name VARCHAR(150) NOT NULL,     -- e.g. 'gpu-01', 'model-a-api'
    team VARCHAR(100),                        -- e.g. 'AI Team', 'Platform Team'
    region VARCHAR(50),                       -- e.g. 'us-east-1', 'global'
    instance_type VARCHAR(50),                -- e.g. 'g5.xlarge', 'm6i.large'
    model VARCHAR(100),                       -- e.g. 'Model-A'
    usage_hours NUMERIC(10, 4),
    utilization_percent NUMERIC(5, 2),
    requests INTEGER,
    input_tokens BIGINT,
    output_tokens BIGINT,
    unit_cost NUMERIC(12, 4),
    input_cost NUMERIC(12, 4),
    output_cost NUMERIC(12, 4),
    total_cost NUMERIC(12, 4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_date ON cloud_ai_usage(record_date);
CREATE INDEX idx_usage_resource ON cloud_ai_usage(resource_name);
CREATE INDEX idx_usage_provider ON cloud_ai_usage(provider);
CREATE INDEX idx_usage_category ON cloud_ai_usage(category);

-- =====================================================================
-- 3. Table: agent_telemetry_metrics
-- Ingests host & machine metrics collected by the local monitoring agent
-- =====================================================================
CREATE TABLE agent_telemetry_metrics (
    id SERIAL PRIMARY KEY,
    metric_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    cpu_percent NUMERIC(5, 2) NOT NULL,
    ram_percent NUMERIC(5, 2) NOT NULL,
    disk_percent NUMERIC(5, 2) NOT NULL,
    gpu_percent NUMERIC(5, 2) DEFAULT 0.0,
    network_sent_mb NUMERIC(10, 2),
    network_recv_mb NUMERIC(10, 2),
    cpu_cores INTEGER NOT NULL DEFAULT 12,
    ram_total_gb NUMERIC(6, 2) NOT NULL DEFAULT 15.3,
    host_identifier VARCHAR(100) DEFAULT 'local-node-01',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_telemetry_timestamp ON agent_telemetry_metrics(metric_timestamp);

-- =====================================================================
-- 4. Table: merged_dataset
-- Unified consolidated dataset combining billing and telemetry logs
-- =====================================================================
CREATE TABLE merged_dataset (
    id SERIAL PRIMARY KEY,
    record_id VARCHAR(50) NOT NULL,
    record_type VARCHAR(50) NOT NULL,        -- 'CLOUD_BILLING', 'AI_API_BILLING', 'HOST_AGENT_METRICS'
    timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    record_date DATE NOT NULL,
    provider VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    service VARCHAR(100) NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    team VARCHAR(100),
    region VARCHAR(50),
    instance_type VARCHAR(100),
    model VARCHAR(100),
    usage_hours NUMERIC(10, 4),
    cpu_utilization_percent NUMERIC(5, 2),
    ram_utilization_percent NUMERIC(5, 2),
    disk_utilization_percent NUMERIC(5, 2),
    gpu_utilization_percent NUMERIC(5, 2),
    network_sent_mb NUMERIC(10, 2),
    network_recv_mb NUMERIC(10, 2),
    requests INTEGER,
    input_tokens BIGINT,
    output_tokens BIGINT,
    unit_cost NUMERIC(12, 4),
    input_cost NUMERIC(12, 4),
    output_cost NUMERIC(12, 4),
    total_cost NUMERIC(12, 4) NOT NULL DEFAULT 0.0,
    is_cost_anomaly BOOLEAN DEFAULT FALSE,
    notes TEXT
);

CREATE INDEX idx_merged_date ON merged_dataset(record_date);
CREATE INDEX idx_merged_resource ON merged_dataset(resource_name);
CREATE INDEX idx_merged_type ON merged_dataset(record_type);

-- =====================================================================
-- 5. Table: cost_anomalies
-- Detected statistical spikes and billing outliers
-- =====================================================================
CREATE TABLE cost_anomalies (
    id VARCHAR(50) PRIMARY KEY,
    anomaly_date DATE NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    cost_change_formatted VARCHAR(50) NOT NULL,
    cost_change_amount NUMERIC(12, 2) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('HIGH', 'MEDIUM', 'LOW')),
    reason TEXT NOT NULL,
    root_cause_details TEXT,
    provider VARCHAR(50) NOT NULL,
    service_category VARCHAR(50) NOT NULL,
    linked_opportunity_id VARCHAR(50),
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anomalies_severity ON cost_anomalies(severity);
CREATE INDEX idx_anomalies_date ON cost_anomalies(anomaly_date);

-- =====================================================================
-- 6. Table: optimization_opportunities
-- Evidence-backed right-sizing, auto-shutdown, and tiering opportunities
-- =====================================================================
CREATE TABLE optimization_opportunities (
    id VARCHAR(50) PRIMARY KEY,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    service_category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    current_cost_monthly NUMERIC(12, 2) NOT NULL,
    recommended_cost_monthly NUMERIC(12, 2) NOT NULL,
    estimated_savings_monthly NUMERIC(12, 2) NOT NULL,
    potential_reduction_percent NUMERIC(5, 2) NOT NULL,
    current_config JSONB NOT NULL,
    recommended_config JSONB NOT NULL,
    evidence_metrics JSONB NOT NULL,
    calculation_proof JSONB NOT NULL,
    ai_explanation TEXT NOT NULL,
    ai_label VARCHAR(100) DEFAULT 'Generated from analyzed evidence',
    status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'APPLIED', 'IGNORED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 7. Views for FinOps Dashboards & Frontend APIs
-- =====================================================================

-- Daily Cost Trends View
CREATE VIEW v_daily_cost_trends AS
SELECT 
    record_date,
    SUM(total_cost) AS daily_cost,
    COUNT(DISTINCT resource_name) AS active_resources,
    CASE 
        WHEN SUM(total_cost) > 50.0 THEN TRUE 
        ELSE FALSE 
    END AS is_anomaly
FROM cloud_ai_usage
GROUP BY record_date
ORDER BY record_date ASC;

-- Cost by Service View
CREATE VIEW v_cost_by_service AS
SELECT 
    service AS service_name,
    category,
    SUM(total_cost) AS total_spent,
    ROUND((SUM(total_cost) / (SELECT SUM(total_cost) FROM cloud_ai_usage) * 100)::numeric, 2) AS percentage_share
FROM cloud_ai_usage
GROUP BY service, category
ORDER BY total_spent DESC;

-- Cost by Provider View
CREATE VIEW v_cost_by_provider AS
SELECT 
    provider,
    SUM(total_cost) AS total_spent,
    ROUND((SUM(total_cost) / (SELECT SUM(total_cost) FROM cloud_ai_usage) * 100)::numeric, 2) AS percentage_share
FROM cloud_ai_usage
GROUP BY provider
ORDER BY total_spent DESC;

-- Top Inefficient Resources View (Under 20% Utilization with High Cost)
CREATE VIEW v_inefficient_resources AS
SELECT 
    resource_name,
    provider,
    service,
    instance_type,
    ROUND(AVG(utilization_percent), 2) AS avg_utilization,
    SUM(total_cost) AS total_cost_accumulated,
    COUNT(*) AS observed_days
FROM cloud_ai_usage
WHERE utilization_percent IS NOT NULL AND utilization_percent < 20.0
GROUP BY resource_name, provider, service, instance_type
ORDER BY total_cost_accumulated DESC;

-- =====================================================================
-- 8. CSV Ingestion Helper Statements (Run via psql CLI or load_to_postgres.py)
-- =====================================================================
/*
\copy cloud_ai_usage(record_id, record_date, provider, category, service, resource_name, team, region, instance_type, model, usage_hours, utilization_percent, requests, input_tokens, output_tokens, unit_cost, input_cost, output_cost, total_cost) FROM 'Dataset/cloud_ai_usage.csv' WITH (FORMAT csv, HEADER true);

\copy agent_telemetry_metrics(metric_timestamp, cpu_percent, ram_percent, disk_percent, gpu_percent, network_sent_mb, network_recv_mb, cpu_cores, ram_total_gb) FROM 'Dataset/metrics.csv' WITH (FORMAT csv, HEADER true);

\copy merged_dataset(record_id, record_type, timestamp_utc, record_date, provider, category, service, resource_name, team, region, instance_type, model, usage_hours, cpu_utilization_percent, ram_utilization_percent, disk_utilization_percent, gpu_utilization_percent, network_sent_mb, network_recv_mb, requests, input_tokens, output_tokens, unit_cost, input_cost, output_cost, total_cost, is_cost_anomaly, notes) FROM 'Dataset/merged_dataset.csv' WITH (FORMAT csv, HEADER true);
*/