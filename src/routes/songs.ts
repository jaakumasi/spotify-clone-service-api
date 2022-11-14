import * as express from 'express';
import { validate, SongModel } from '../models/song';
import { UserModel } from '../models/user';
import { admin, auth, validateObjectID } from '../middleware';
/**
 * router for creating, getting, updating and deleting users
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
songsRouter.delete('/:id', [validateObjectID, admin], async (req: express.Request, res: express.Response) => {
    await SongModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: 'song deleted successfully' });
})

// like song
songsRouter.put('/like/:id', [validateObjectID, auth], async (req: express.Request, res: express.Response) => {
    const song = await SongModel.findById(req.params.id);
    if (!song) return res.status(400).send({ message: 'song does not exist' });
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    // @ts-ignore
    const index = user.likedSongs.indexOf(song._id);

    let resMessage = '';
    if (index === -1) {
        // @ts-ignore
        user.likedSongs.push(song._id);
        resMessage = 'Added to liked songs';
    }
    else {
        user.likedSongs.splice(index, 1); 
        resMessage = 'Removed from liked songs';
    }
    await user.save();
    return res.status(200).send({ message: resMessage });
})

// get all liked songs
songsRouter.get('/like', auth, async (req: express.Request, res: express.Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    const songs = await SongModel.find({ _id: user.likedSongs });
    return res.status(200).send({ data: songs });
})

export default songsRouter;
