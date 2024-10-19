import * as dotenv from 'dotenv';
dotenv.config(); // Load env variables first

import AppDataSource from "./src/config/database";

async function testConnection() {
    // Print loaded environment variables (safely)
    console.log('Environment Check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded ✅' : 'Missing ❌');

    try {
        await AppDataSource.initialize();
        console.log("\n✅ Database connection established successfully!");

        const result = await AppDataSource.query('SELECT current_database() as database');
        console.log('Connected to database:', result[0].database);

        await AppDataSource.destroy();
    } catch (error) {
        console.error("\n❌ Connection Error:", error);
    }
}

testConnection();