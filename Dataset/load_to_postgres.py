#!/usr/bin/env python3
"""
load_to_postgres.py
Automated loader utility to populate a PostgreSQL database from the merged and raw datasets.
Can be configured using environment variables:
PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
"""

import os
import csv
import sys

def generate_insert_sql(output_sql_file="Dataset/populate_database.sql"):
    """
    Generates a standalone SQL script containing all INSERT statements
    ready to run directly on any PostgreSQL instance without requiring psycopg2.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    merged_csv_path = os.path.join(script_dir, 'merged_dataset.csv')
    sql_out_path = os.path.join(script_dir, os.path.basename(output_sql_file))

    print(f"Generating INSERT statements from {merged_csv_path}...")
    with open(merged_csv_path, mode='r', encoding='utf-8') as f:
        records = list(csv.DictReader(f))

    with open(sql_out_path, mode='w', encoding='utf-8') as out:
        out.write("-- CostIQ Automated PostgreSQL Data Population Script\n")
        out.write("BEGIN;\n\n")

        for r in records:
            # Escape strings
            fields = []
            vals = []
            for k, v in r.items():
                fields.append(k)
                if v == '' or v is None:
                    vals.append('NULL')
                elif k in ['total_cost', 'unit_cost', 'input_cost', 'output_cost', 'usage_hours',
                           'cpu_utilization_percent', 'ram_utilization_percent', 'disk_utilization_percent',
                           'gpu_utilization_percent', 'network_sent_mb', 'network_recv_mb', 'requests',
                           'input_tokens', 'output_tokens']:
                    try:
                        float(v)
                        vals.append(v)
                    except ValueError:
                        vals.append('NULL')
                elif k == 'is_cost_anomaly':
                    vals.append('TRUE' if v.upper() == 'TRUE' else 'FALSE')
                else:
                    escaped = v.replace("'", "''")
                    vals.append(f"'{escaped}'")

            col_names = ", ".join(fields)
            val_strs = ", ".join(vals)
            out.write(f"INSERT INTO merged_dataset ({col_names}) VALUES ({val_strs});\n")

        out.write("\nCOMMIT;\n")

    print(f" Generated {sql_out_path} with {len(records)} INSERT operations.")

if __name__ == '__main__':
    generate_insert_sql()
