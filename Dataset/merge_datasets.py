#!/usr/bin/env python3
"""
merge_datasets.py
Merge cloud/AI billing dataset and local agent telemetry metrics into a unified FinOps dataset
and generate PostgreSQL DDL/ingestion scripts.
"""

import csv
import os
import sys
from datetime import datetime

def merge_datasets():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    usage_csv_path = os.path.join(script_dir, 'cloud_ai_usage.csv')
    metrics_csv_path = os.path.join(script_dir, 'metrics.csv')
    output_csv_path = os.path.join(script_dir, 'merged_dataset.csv')

    print(f"Reading {usage_csv_path}...")
    with open(usage_csv_path, mode='r', encoding='utf-8') as f:
        usage_records = list(csv.DictReader(f))

    print(f"Reading {metrics_csv_path}...")
    with open(metrics_csv_path, mode='r', encoding='utf-8') as f:
        metric_records = list(csv.DictReader(f))

    print(f"Loaded {len(usage_records)} usage records and {len(metric_records)} telemetry records.")

    # Compute average host telemetry summary from agent metrics
    avg_cpu = sum(float(r['cpu_percent']) for r in metric_records) / len(metric_records)
    avg_ram = sum(float(r['ram_percent']) for r in metric_records) / len(metric_records)
    avg_disk = sum(float(r['disk_percent']) for r in metric_records) / len(metric_records)
    avg_gpu = sum(float(r['gpu_percent']) for r in metric_records) / len(metric_records)
    avg_net_sent = sum(float(r['network_sent_mb']) for r in metric_records) / len(metric_records)
    avg_net_recv = sum(float(r['network_recv_mb']) for r in metric_records) / len(metric_records)

    print(f"Agent Telemetry Averages: CPU={avg_cpu:.2f}%, RAM={avg_ram:.2f}%, Disk={avg_disk:.2f}%, GPU={avg_gpu:.2f}%")

    merged_fields = [
        'record_id',
        'record_type',            # CLOUD_BILLING, AI_API_BILLING, HOST_AGENT_METRICS
        'timestamp',              # Full timestamp or ISO date
        'date',                   # YYYY-MM-DD
        'provider',               # AWS, AI Platform, Local Monitoring Agent
        'category',               # cloud, ai, host_telemetry
        'service',                # EC2, LLM API, Node Exporter / Agent
        'resource',               # gpu-01, model-a-api, local-node, etc.
        'team',                   # AI Team, Platform Team, Data Team, Operations
        'region',                 # us-east-1, us-west-2, global, local
        'instance_type',          # g5.xlarge, m6i.large, etc.
        'model',                  # Model-A, Model-B, etc.
        'usage_hours',
        'cpu_utilization_percent',
        'ram_utilization_percent',
        'disk_utilization_percent',
        'gpu_utilization_percent',
        'network_sent_mb',
        'network_recv_mb',
        'requests',
        'input_tokens',
        'output_tokens',
        'unit_cost',
        'input_cost',
        'output_cost',
        'total_cost',
        'is_cost_anomaly',
        'notes'
    ]

    merged_rows = []

    # 1. Process usage records
    for r in usage_records:
        rec_type = 'AI_API_BILLING' if r.get('category') == 'ai' else 'CLOUD_BILLING'
        total_cost = float(r.get('total_cost') or 0.0)
        util_pct = float(r.get('utilization_percent') or 0.0) if r.get('utilization_percent') else None

        # Flag anomalies: daily cost spike or extreme low util with high cost
        is_anomaly = False
        notes = ''
        if total_cost > 30.0:
            is_anomaly = True
            notes = 'High daily cost spike detected (> $30)'
        elif util_pct is not None and util_pct < 15.0 and total_cost > 10.0:
            is_anomaly = True
            notes = 'Severe under-utilization inefficiency (< 15%)'

        merged_row = {
            'record_id': r.get('record_id', ''),
            'record_type': rec_type,
            'timestamp': f"{r.get('date')}T00:00:00Z",
            'date': r.get('date', ''),
            'provider': r.get('provider', ''),
            'category': r.get('category', ''),
            'service': r.get('service', ''),
            'resource': r.get('resource', ''),
            'team': r.get('team', ''),
            'region': r.get('region', ''),
            'instance_type': r.get('instance_type', ''),
            'model': r.get('model', ''),
            'usage_hours': r.get('usage_hours', ''),
            'cpu_utilization_percent': f"{util_pct:.2f}" if util_pct is not None else '',
            'ram_utilization_percent': f"{avg_ram:.2f}" if rec_type == 'CLOUD_BILLING' else '',
            'disk_utilization_percent': f"{avg_disk:.2f}" if rec_type == 'CLOUD_BILLING' else '',
            'gpu_utilization_percent': f"{avg_gpu:.2f}" if 'gpu' in r.get('resource', '') else '',
            'network_sent_mb': '',
            'network_recv_mb': '',
            'requests': r.get('requests', ''),
            'input_tokens': r.get('input_tokens', ''),
            'output_tokens': r.get('output_tokens', ''),
            'unit_cost': r.get('unit_cost', ''),
            'input_cost': r.get('input_cost', ''),
            'output_cost': r.get('output_cost', ''),
            'total_cost': f"{total_cost:.4f}",
            'is_cost_anomaly': 'TRUE' if is_anomaly else 'FALSE',
            'notes': notes
        }
        merged_rows.append(merged_row)

    # 2. Process metrics records (Local Agent Telemetry)
    for idx, m in enumerate(metric_records):
        ts = m.get('timestamp', '')
        date_str = ts.split('T')[0] if 'T' in ts else '2026-09-02'
        rec_id = f"AGM{idx+1:04d}"

        merged_row = {
            'record_id': rec_id,
            'record_type': 'HOST_AGENT_METRICS',
            'timestamp': ts,
            'date': date_str,
            'provider': 'Local Agent',
            'category': 'host_telemetry',
            'service': 'Monitoring Agent',
            'resource': 'local-host-node',
            'team': 'Operations',
            'region': 'local',
            'instance_type': f"{m.get('cpu_cores', 12)} Cores / {m.get('ram_total_gb', 15.3)}GB RAM",
            'model': '',
            'usage_hours': '0.05',
            'cpu_utilization_percent': m.get('cpu_percent', ''),
            'ram_utilization_percent': m.get('ram_percent', ''),
            'disk_utilization_percent': m.get('disk_percent', ''),
            'gpu_utilization_percent': m.get('gpu_percent', ''),
            'network_sent_mb': m.get('network_sent_mb', ''),
            'network_recv_mb': m.get('network_recv_mb', ''),
            'requests': '',
            'input_tokens': '',
            'output_tokens': '',
            'unit_cost': '',
            'input_cost': '',
            'output_cost': '',
            'total_cost': '0.0000',
            'is_cost_anomaly': 'FALSE',
            'notes': 'Live telemetry metric collected by local monitoring daemon'
        }
        merged_rows.append(merged_row)

    # Write merged CSV
    with open(output_csv_path, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=merged_fields)
        writer.writeheader()
        writer.writerows(merged_rows)

    print(f" Successfully created {output_csv_path} with {len(merged_rows)} total unified records.")
    return output_csv_path

if __name__ == '__main__':
    merge_datasets()
