import * as express from 'express';
import dbConnection from './db';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import test from './routes/test';
require('express-async-errors');
require('dotenv').config();

dbConnection(); //  connect to mongo database
const app = express();
app.use(express.json());

// using routers
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/login', authRouter);

// temporary
app.use('/api/v1/test', test);

app.listen(process.env.PORT, () => console.log(`server running port ${process.env.PORT}...`));