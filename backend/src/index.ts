import express, {Request, Response} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { dbConnection } from './config/db.config';
import hpp from 'hpp';

import 'dotenv/config';

const app = express();

dbConnection();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());
app.use(helmet());

app.use(hpp());
app.use(cors());

app.get( '/', (req: Request, res: Response) => {
    res.send('E Learning System');
})

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log('app server is running at port '+ PORT);
})