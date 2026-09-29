import csv
import os
import time
from datetime import datetime

import psutil

FILE = "metrics.csv"

fields = [
    "timestamp",
    "cpu_percent",
    "ram_percent",
    "disk_percent",
    "network_sent_mb",
    "network_recv_mb"
]

file_exists = os.path.exists(FILE)

with open(FILE, "a", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fields)

    if not file_exists:
        writer.writeheader()

    while True:
        net = psutil.net_io_counters()

        row = {
            "timestamp": datetime.now().isoformat(),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "ram_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage("/").percent,
            "network_sent_mb": round(net.bytes_sent / 1024**2, 2),
            "network_recv_mb": round(net.bytes_recv / 1024**2, 2)
        }

        writer.writerow(row)
        f.flush()

        print(row)

        time.sleep(2)
