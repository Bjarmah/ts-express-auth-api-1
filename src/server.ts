import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import app from './app';
import { createConnection } from 'typeorm';

dotenv.config();

const PORT = process.env.PORT || 3000;

createConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => console.error("Error connecign to the Database: ", error));