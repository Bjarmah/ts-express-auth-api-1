import { ConnectionOptions } from "typeorm";
import { User } from "../models/user";

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'intern_api',
    entities: [User],
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

export default config;