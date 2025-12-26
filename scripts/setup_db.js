const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runSchema() {
    try {
        const schemaPath = path.join(__dirname, '../schema/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Running schema...');
        await client.query(schema);

        console.log('Schema executed successfully!');
        client.release();
    } catch (err) {
        console.error('Error executing schema', err);
    } finally {
        await pool.end();
    }
}

runSchema();
