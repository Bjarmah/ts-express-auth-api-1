import express, { Application, Response, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});
export default app;
