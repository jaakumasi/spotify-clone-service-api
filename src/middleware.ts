import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(400).send({ message: 'Access Denied! No token provided' });

    jwt.verify(token, process.env.JWTKEY, (err, user) => {
        if (err) return res.status(400).send({ message: 'Invalid token' });
        else {
            // @ts-ignore
            console.log('user: ', user)
            // @ts-ignore
            req.user = user;
            next();
        }
    });
}

export const admin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(400).send({ message: 'Access Denied! No token provided' });

    jwt.verify(token, process.env.JWTKEY, (err, user) => {
        if (err) return res.status(400).send({ message: 'Invalid token' });
        else {
            // @ts-ignore
            console.log('user: ', user);
            // @ts-ignore
            if (!user.isAdmin)
                return res.status(403).send({ message: 'Access Denied !' });
            // @ts-ignore
            req.user = user;
            next();
        }
    });
}

export const validateObjectID = (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))  // verify that user id is a valid bson ObjectId
        return res.status(404).send({message: 'Invalid ID'});
    next();
}