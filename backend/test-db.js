const pool = require("./db");

async function testDatabase() {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        console.log("PostgreSQL connected!");
        console.log(result.rows[0]);

    } catch (error) {
        console.error("PostgreSQL connection failed:");
        console.error(error.message);

    } finally {
        await pool.end();
    }
}

testDatabase();
