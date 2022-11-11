import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { validate, UserModel } from '../models/user'
/**
 * router for creating new users
 */
const usersRouter = express.Router();

usersRouter.post('/', async (req: express.Request, res: express.Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await UserModel.findOne({ email: req.body.email }); 
    if (user) return res.status(403).send({ message: 'email already exists' });

    const newUser = await new UserModel({
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10)
    }).save();

    newUser.password = undefined;
    newUser.__v = undefined;

    return res.status(201).send({ message: 'new user created successfully', data: newUser });
});

usersRouter.get('/', async (req: express.Request, res: express.Response) => {
    const users = await UserModel.find().select('-password -__v');
    return res.status(200).send({data: users});  
});

export default usersRouter;