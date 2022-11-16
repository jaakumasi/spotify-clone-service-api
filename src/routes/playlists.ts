import * as express from 'express';
import { validate, PlaylistModel } from '../models/playlist';
import { UserModel } from '../models/user';
import { admin, auth, validateObjectID } from '../middleware';
import * as joi from 'joi';
import { SongModel } from '../models/song';
/**
 * router for CREATING and EDITING playlists as well as ADDING, REMOVING and DELETING songs from playlists 
 */
const playlistRouter = express.Router();

// create playlist
playlistRouter.post('/', auth, async (req: express.Request, res: express.Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    const playlist = await new PlaylistModel({ ...req.body, user: user._id }).save();
    user.playlists.push(playlist._id);
    await user.save();

    return res.status(201).send({ data: playlist });
})

// add song to playlist
playlistRouter.post('/add-song', auth, async (req: express.Request, res: express.Response) => {
    const joiSchema = joi.object({
        playlistId: joi.string().required(),
        songId: joi.string().required()
    });
    const { error } = joiSchema.validate(req.body);
    if (error) res.status(400).send({ message: error.details[0].message });

    const playlist = await PlaylistModel.findById(req.body.playlistId);
    if (!playlist) return res.status(404).send({ message: 'playlist not found' });

    const song = await SongModel.findById(req.body.songId);
    if (!song) return res.status(404).send({ message: 'song not found' });
    // add song to playlist only if its not already in it
    if (playlist.songs.indexOf(req.body.songId) === -1) {
        playlist.songs.push(req.body.songId);
        await playlist.save();
        return res.status(200).send({ message: 'song has been added to playlist', data: playlist });
    }
    else
        return res.status(400).send({ message: 'song is already in the playlist' });
})

// remove song from playlist
playlistRouter.put('/remove-song', async (req: express.Request, res: express.Response) => {
    const joiSchema = joi.object({
        playlistId: joi.string().required(),
        songId: joi.string().required()
    });
    const { error } = joiSchema.validate(req.body);
    if (error) res.status(400).send({ message: error.details[0].message });

    const playlist = await PlaylistModel.findById(req.body.playlistId);
    if (!playlist) return res.status(404).send({ message: 'playlist not found' });

    const song = await SongModel.findById(req.body.songId);
    if (!song) return res.status(404).send({ message: 'song not found' });

    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();

    return res.status(200).send({ message: 'song has been removed from playlist', data: playlist });
})

// edit playlist by id
playlistRouter.put('/:id', [validateObjectID, auth], async (req: express.Request, res: express.Response) => {
    const joiSchema = joi.object({
        name: joi.string().allow(''),
        desc: joi.string().allow(''),
        img: joi.string().allow()
    });
    const { error } = joiSchema.validate(req.body);
    if (error) res.status(400).send({ message: error.details[0].message });

    const playlist = await PlaylistModel.findById(req.params.id);
    if (!playlist) return res.status(404).send({ message: 'playlist not found' });

    playlist.name = req.body.name;
    playlist.desc = req.body.desc;
    playlist.img = req.body.img;
    await playlist.save();

    return res.status(200).send({ message: 'playlist successfully updated', data: playlist });
})

// get playlist by id
playlistRouter.get('/:id', [validateObjectID, auth], async (req: express.Request, res: express.Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    const playlist = await PlaylistModel.findById(req.params.id);
    if (!playlist) return res.status(404).send({ message: 'playlist not found' });

    const songs = await SongModel.find({ _id: playlist.songs });
    return res.status(200).send({ data: { playlist, songs } });
})

// get all playlists
playlistRouter.get('/', auth, async (req: express.Request, res: express.Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    const playlists = await PlaylistModel.find({ _id: user.playlists });
    return res.status(200).send({ data: playlists });
})

// delete playlist by id
playlistRouter.delete('/:id', [validateObjectID, auth], async (req: express.Request, res: express.Response) => {
    const playlist = await PlaylistModel.findById(req.params.id);
    if (!playlist) return res.status(404).send({ message: 'playlist not found' });
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    // @ts-ignore
    const index = user.playlists.indexOf(req.params.id);
    user.playlists.splice(index, 1);
    await user.save();
    await playlist.remove();
    return res.status(200).send({ message: 'playlist deleted' });
})

export default playlistRouter;







// get random playlists
playlistRouter.post('/random', auth, async (req: express.Request, res: express.Response) => {
    // @ts-ignore                   ----- temp
    const playlists = await PlaylistModel.aggregate([{ $sample: { $size: 10 } }]);
    return res.status(200).send({ data: playlists });
})