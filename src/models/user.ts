import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as joi from 'joi';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    date: { type: String, required: true },
    year: { type: String, required: true },
    month: { type: String, required: true },
    platLists: { type: [String], default: [] },
    likedSongs: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = () => {
    const token = jwt.sign(
        // @ts-ignore
        { _id: this._id, name: this.name },
        process.env.JWTKEY,
        { expiresIn: '7d' }
    )
    return token;
};

export const validate = (user: object) => {
    const joiSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        gender: joi.string().valid('male', 'female', 'other').required(),
        date: joi.string().required(),
        year: joi.string().required(),
        month: joi.string().required(),
    });
    return joiSchema.validate(user);
};

export const UserModel = mongoose.model('user', userSchema);

