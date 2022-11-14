import * as express from 'express';
import { validate, SongModel } from '../models/song';
import { UserModel } from '../models/user';
import { admin, auth, validateObjectID } from '../middleware';
/**
 * router for 
 */
 const playlistRouter = express.Router();

 export default playlistRouter;