import mongoose from 'mongoose';
import * as joi from 'joi';

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    song: { type: String, required: true },
    img: { type: String, required: true },
    duration: { type: String, required: true },
});

export const validate = (song: Object) => {
    const joiSchema = joi.object({
        name: joi.string().required(),
        artist: joi.string().required(),
        song: joi.string().required(),
        img: joi.string().required(),
        duration: joi.string().required(),
    });
    return joiSchema.validate(song);
};  

export const songModel = mongoose.model('song', songSchema);

