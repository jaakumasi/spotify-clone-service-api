import * as express from 'express';
import dbConnection from './db';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import songsRouter from './routes/songs';
import playlistRouter from './routes/playlists';
import searchRouter from './routes/search';
require('express-async-errors');
require('dotenv').config();

dbConnection(); //  connect to mongo database
const app = express();
app.use(express.json());

// using routers
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/login', authRouter);
app.use('/api/v1/songs', songsRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/', searchRouter);

app.listen(process.env.PORT, () => console.log(`server running port ${process.env.PORT}...`));