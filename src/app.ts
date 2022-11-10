import * as express from 'express';
import dbConnection from './db';
import { usersRouter } from './routes/users';
require('dotenv').config();

dbConnection(); //  connect to mongo database
const app = express();
app.use(express.json());


app.use('/api/v1/users', usersRouter);


app.listen(process.env.PORT, () => console.log(`server running port ${process.env.PORT}...`));