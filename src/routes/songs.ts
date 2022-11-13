import * as express from 'express';
import { validate, SongModel } from '../models/song'
import { admin, auth, validateObjectID } from '../middleware';
/**
 * router for 
 */
const songsRouter = express.Router();

// create song
songsRouter.post('/', async (req: express.Request, res: express.Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const song = await new SongModel(req.body).save();

    song.__v = undefined;
    return res.status(201).send({data: song, message: 'song successfully created'});
})

export default songsRouter;
