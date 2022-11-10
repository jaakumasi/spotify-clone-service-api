import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { validate, userModel } from '../models/user'

export const loginRouter = express.Router();

loginRouter.post('/', async (req: express.Request, res: express.Response) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password))
        return res.status(400).send({ message: 'Invalid email or password' });

});

