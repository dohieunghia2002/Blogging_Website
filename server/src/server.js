import express, {urlencoded} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));


connectDB();

const port = 3001;
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
})