const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const pool = require("./db");

function findCostFile() {
    if (process.env.COST_FILE && fs.existsSync(process.env.COST_FILE)) {
        return process.env.COST_FILE;
    }
    const candidates = [
        path.resolve(__dirname, "..", "cloud_ai_usage.csv"),
        path.resolve(__dirname, "cloud_ai_usage.csv"),
        path.resolve(__dirname, "..", "Dataset", "cloud_ai_usage.csv"),
        path.resolve(__dirname, "..", "cost-agent", "cloud_ai_usage.csv"),
        path.resolve(process.cwd(), "cloud_ai_usage.csv")
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    return candidates[0];
}

const COST_FILE = findCostFile();

async function importData() {
    const rows = [];

    if (!fs.existsSync(COST_FILE)) {
        console.error("CSV file not found:", COST_FILE);
        process.exit(1);
    }

    console.log("Reading CSV from:", COST_FILE);

    fs.createReadStream(COST_FILE)
        .pipe(csv())
        .on("data", (row) => {
            rows.push(row);
        })
        .on("end", async () => {
            console.log(`Found ${rows.length} records in CSV.`);

            const client = await pool.connect();

            try {
                // Ensure table exists
                await client.query(`
                    CREATE TABLE IF NOT EXISTS cloud_usage (
                        id SERIAL PRIMARY KEY,
                        record_id VARCHAR(50) UNIQUE,
                        date DATE,
                        provider VARCHAR(50),
                        category VARCHAR(50),
                        service VARCHAR(100),
                        resource VARCHAR(100),
                        team VARCHAR(100),
                        region VARCHAR(100),
                        instance_type VARCHAR(100),
                        model VARCHAR(150),
                        usage_hours NUMERIC,
                        utilization_percent NUMERIC,
                        requests BIGINT,
                        input_tokens BIGINT,
                        output_tokens BIGINT,
                        unit_cost NUMERIC,
                        input_cost NUMERIC,
                        output_cost NUMERIC,
                        total_cost NUMERIC,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);

                await client.query("BEGIN");

                for (const row of rows) {
                    await client.query(
                        `
                        INSERT INTO cloud_usage (
                            record_id,
                            date,
                            provider,
                            category,
                            service,
                            resource,
                            team,
                            region,
                            instance_type,
                            model,
                            usage_hours,
                            utilization_percent,
                            requests,
                            input_tokens,
                            output_tokens,
                            unit_cost,
                            input_cost,
                            output_cost,
                            total_cost
                        )
                        VALUES (
                            $1, $2, $3, $4, $5, $6, $7, $8,
                            $9, $10, $11, $12, $13, $14, $15,
                            $16, $17, $18, $19
                        )
                        ON CONFLICT (record_id)
                        DO UPDATE SET
                            total_cost = EXCLUDED.total_cost,
                            utilization_percent = EXCLUDED.utilization_percent
                        `,
                        [
                            row.record_id,
                            row.date,
                            row.provider,
                            row.category,
                            row.service,
                            row.resource,
                            row.team,
                            row.region,
                            row.instance_type,
                            row.model,
                            Number(row.usage_hours) || 0,
                            Number(row.utilization_percent) || 0,
                            Number(row.requests) || 0,
                            Number(row.input_tokens) || 0,
                            Number(row.output_tokens) || 0,
                            Number(row.unit_cost) || 0,
                            Number(row.input_cost) || 0,
                            Number(row.output_cost) || 0,
                            Number(row.total_cost) || 0
                        ]
                    );
                }

                await client.query("COMMIT");

                const countRes = await client.query("SELECT COUNT(*) AS count FROM cloud_usage");

                console.log("=================================");
                console.log("Import completed successfully!");
                console.log(`Total records in PostgreSQL: ${countRes.rows[0].count}`);
                console.log("=================================");

            } catch (error) {
                await client.query("ROLLBACK");
                console.error("Import failed:", error.message);
            } finally {
                client.release();
                await pool.end();
            }
        })
        .on("error", (error) => {
            console.error("CSV reading failed:", error.message);
        });
}

importData();
