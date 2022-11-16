import * as express from 'express';
import { validate, PlaylistModel } from '../models/playlist';
import { UserModel } from '../models/user';
import { admin, auth, validateObjectID } from '../middleware';
import * as joi from 'joi';
import { SongModel } from '../models/song';
/**
 * router to handle search
 */
const searchRouter = express.Router();

export default searchRouter;
