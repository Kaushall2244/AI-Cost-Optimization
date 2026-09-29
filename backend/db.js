const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "costiq",
    password: process.env.PGPASSWORD || undefined,
    port: parseInt(process.env.PGPORT || "5432", 10)
});

module.exports = pool;
