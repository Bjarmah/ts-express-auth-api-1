import { DataSourceOptions, DataSource } from "typeorm";
import { User } from "../models/user";
import { OTP } from "../models/otp";
import * as dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
    type: 'postgres',
    host: 'pg-3d72b01-intern-api.k.aivencloud.com',
    port: 28452,
    username: 'avnadmin',
    password: 'AVNS_aC1EloSEnMhUVylYOQe',
    database: 'defaultdb',
    ssl: {
        ca: process.env.CA_CERT,
        rejectUnauthorized: true
    },
    entities: [User, OTP],
    synchronize: false,
    logging: true
}

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