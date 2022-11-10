import mongoose from 'mongoose';
import * as joi from 'joi';

const objectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: objectId, ref: 'user', required: true },
    desc: { type: String },
    songs: {type: Array, default: []},
    img: { type: String }
});

export const validate = (playlist: Object) => {
    const joiSchema = joi.object({
        name: joi.string().required(),
        user: joi.string().required(),
        desc: joi.string().allow(''),
        songs: joi.array().items(joi.string()),
        img: joi.string().required() 
    });
    return joiSchema.validate(playlist);
};

export const playlistModel = mongoose.model('playlist', playlistSchema);

