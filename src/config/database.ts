import { DataSourceOptions, DataSource } from "typeorm";
import { User } from "../models/user";
import { OTP } from "../models/otp";
import * as dotenv from 'dotenv';
dotenv.config();

console.log('Database Type:', process.env.DB_TYPE);

const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: process.env.CA_CERT,
        rejectUnauthorized: true
    },
    entities: [User, OTP],
    synchronize: false,
    logging: true
}

console.log('Database Config:', {
    ...config,
    password: '****' // Hide password in logs
});

// Alternative configuration using URL
// const config: DataSourceOptions = {
//     type: 'postgres',
//     url: process.env.DATABASE_URL,
//     ssl: {
//         ca: process.env.CA_CERT,
//         rejectUnauthorized: true,
//         sslmode: 'verify-full' // Change from 'require' to 'verify-full'
//     },
//     entities: [User, OTP],
//     synchronize: false,
//     logging: true
// }

const AppDataSource = new DataSource(config);

export default AppDataSource;