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


app.use('/auth', authRoutes);//Add auth routes
app.use('/users', userRoutes);//Add user routes

// Root route handler for the homepage
app.get("/", (req: Request, res: Response) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '../index.html'));
    } else {
        res.json({
            message: "Welcome to 'MY' API",
            documentation_url: "https://intern-api-0e3f4df9db4a.herokuapp.com/api-docs",
        });
    }
});
export default app;
