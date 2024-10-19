import { DataSourceOptions, DataSource } from "typeorm";
import { User } from "../models/user";
import { OTP } from "../models/otp";

const config: DataSourceOptions = {
    type: 'postgres',
    ...(process.env.NODE_ENV === 'production'
        ? {
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            },
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'admin',
            database: process.env.DB_NAME || 'intern_api',
        }
    ),
    entities: [User, OTP],
    synchronize: process.env.NODE_ENV === 'development', // Be careful with this in production
    logging: false,
}

const AppDataSource = new DataSource(config);

export default AppDataSource;