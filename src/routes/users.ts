import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { validate, userModel } from '../models/user'

export const usersRouter = express.Router();

usersRouter.post('/', async (req: express.Request, res: express.Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await userModel.findOne({ email: req.body.email });
    if (user) return res.status(403).send({ message: 'email already exists' });

    const newUser = await new userModel({
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10)
    }).save();

    newUser.password = undefined;
    newUser.__v = undefined;

    return res.status(201).send({ message: 'new user created successfully', data: newUser });
});

