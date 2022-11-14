import * as express from 'express';
import { validate, SongModel } from '../models/song'
import { admin, auth, validateObjectID } from '../middleware';
/**
 * router for 
 */
const songsRouter = express.Router();

// create song
songsRouter.post('/', admin, async (req: express.Request, res: express.Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const song = await new SongModel(req.body).save();

    song.__v = undefined;
    return res.status(201).send({ data: song, message: 'song successfully created' });
});

// get all songs
songsRouter.get('/', async (req: express.Request, res: express.Response) => {
    const songs = await SongModel.find();
    return res.status(200).send({ data: songs });
})

// update song by id
songsRouter.put('/:id', [validateObjectID, admin], async (req: express.Request, res: express.Response) => {
    const song = await SongModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.status(200).send({ message: 'song successfully updated', data: song });
})

// delete song by id
songsRouter.put('/:id', [validateObjectID, admin], async (req: express.Request, res: express.Response) => {
    await SongModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: 'song deleted successfully' });
})


export default songsRouter;
