import * as express from 'express';
import { validate, PlaylistModel } from '../models/playlist';
import { auth, validateObjectID } from '../middleware';
import * as joi from 'joi';
import { SongModel } from '../models/song';
/**
 * router to handle search
 */
const searchRouter = express.Router();

searchRouter.post('/', auth, async (req: express.Request, res: express.Response) => {
    const search = req.query.search;
    if (search !== '') {
        const songs = await SongModel.find({ name: { $regex: search, $options: 'i' } }).select('-__v').limit(10);
        const playlists = await PlaylistModel.find({ name: { $regex: search, $options: 'i' } }).select('-__v').limit(10);
        return res.status(200).send({ data: { playlists, songs } });
    }
    else {
        return res.status(200).send({});
    }
})

export default searchRouter;
