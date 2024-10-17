import 'dotenv/config';
import 'reflect-metadata'; // Add this import
import app from './app';
import AppDataSource from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize TypeORM connection
        await AppDataSource.initialize();
        console.log('Database connection initialized');

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});