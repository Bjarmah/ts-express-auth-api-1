import express, { Application, Response, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml')); // adjust path as needed

// Add Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});
export default app;
