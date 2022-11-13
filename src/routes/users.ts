import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { validate, UserModel } from '../models/user'
import { admin, auth, validateObjectID } from '../middleware';
/**
 * router for getting users and creating new users
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

// get all users
usersRouter.get('/', admin, async (req: express.Request, res: express.Response) => {
    const users = await UserModel.find().select('-password -__v');
    return res.status(200).send({ data: users });
});

// get user by id
usersRouter.get('/:id', [validateObjectID, auth], async (req: express.Request, res: express.Response) => {
    const user = await UserModel.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(203).send({ message: 'No user with that id exists' });
    return res.status(200).send({ data: user });
});

// update user by id
usersRouter.put('/:id', [validateObjectID, auth], async (req: express.Request, res: express.Response) => {
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    ).select('-password -__v');
    return res.status(200).send({ data: user });
});

// delete user by id
usersRouter.delete('/:id', [validateObjectID, admin], async (req: express.Request, res: express.Response) => {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: 'User successfully deleted' });
});

// delete all users
usersRouter.delete('/', [validateObjectID, admin], async (req: express.Request, res: express.Response) => {
    await UserModel.deleteMany();
    return res.status(200).send({ message: 'Users successfully deleted' });
});

export default usersRouter;